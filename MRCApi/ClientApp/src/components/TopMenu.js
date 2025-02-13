import React, { PureComponent } from "react";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { getLogin, setLangue, listTheme, DefaultTheme } from "../Utils/Helpler";
import { PanelMenu } from "primereact/panelmenu";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { ToggleButton } from "primereact/togglebutton";
import UserChangePass from "./ChangePass";
import { connect } from "react-redux";
import { PermissionAPI } from "../store/PermissionController";
import { bindActionCreators } from "redux";
import { LanguageAPI } from "../store/LanguageController";
import Emitter from "./EventEmitter";
import "../css/MenuStyle.css";

import moment from "moment";
let isDisplay = false;
const TODAY = +moment().format("YYYYMMDD");
class TopMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.UserChangePassElement = React.createRef();

    this.state = {
      isOpen: true,
      AppName: "Spiral System",
      FullName: this.props.login != null ? this.props.login.FullName : "",
      disable:
        this.props.login !== null || this.props.login === "" ? false : true,
      menus: [],
      language: false,
      showChangePass: false,
      themeName: "",
      item: [],
      reminPass: "",
    };
    this.switchLangue = this.switchLangue.bind(this);
  }
  showNotify = (e) => {
    this.op.toggle(e);
  };
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  themeChanged = (newTheme) => {
    const currentTheme = this.props.themeName;
    this.props.LanguageController.SetTheme(newTheme);
    let themeElement = document.getElementById("theme-link");
    themeElement.setAttribute(
      "href",
      themeElement.getAttribute("href").replace("theme_set", newTheme)
    );
    themeElement.setAttribute(
      "href",
      themeElement.getAttribute("href").replace(currentTheme, newTheme)
    );
  };
  UNSAFE_componentWillMount() {
    let lastTheme = localStorage.getItem("THEME");
    if (lastTheme === null) lastTheme = DefaultTheme;
    this.themeChanged(lastTheme);
  }
  async componentDidMount() {
    if (localStorage.getItem("isVie") === undefined) {
      localStorage.setItem("isVie", false);
    }
    const login = getLogin();
    if (login !== null) {
      await this.setState({
        FullName: login.fullName,
        disable: true,
        AppName: login.accountName,
      });
      isDisplay = await true;
      await this.props.LanguageController.GetLanguage();
      const item = [
        {
          label: this.props.language["logout"] || "l_logout",
          icon: "pi pi-sign-out",
          command: (e) => {
            this.LogOut();
          },
        },
        {
          label: this.props.language["changepass"] || "l_changepass",
          icon: "pi pi-cog",
          command: (e) => {
            this.setState({ showChangePass: true });
          },
        },
      ];
      // if (login?.expriedPass === undefined || login?.expriedPass === null || TODAY >= login.expriedPass) {
      //     const mes = login.expriedPass === undefined || login?.expriedPass === null ? 'Mật khẩu của bạn chưa được thay đổi vui lòng thay đổi mật khẩu mới' : 'Mật khẩu của bạn đã hết hạn vui lòng đổi lại mật khẩu mới'
      //     this.setState({ showChangePass: true, reminPass: mes })
      // }
      this.setState({ item: item });
    }
    if (localStorage.getItem("isVie") === "true") {
      this.setState({ language: false });
      setLangue(false);
    } else if (localStorage.getItem("isVie") === "false") {
      this.setState({ language: true });
      setLangue(true);
    }
    //

    await this.fetchTopMenus();
    const menuList = await this.props.getTopMenus;
    await this.handleRenderMenu(menuList);
    Emitter.on("update_top_menu", async (e) => {
      await this.fetchTopMenus();
      await this.handleRenderMenu(this.props.getTopMenus); // On Update From Permision Form
    });
  }
  QuickRecent = async (item) => {
    let listRecent = await JSON.parse(localStorage?.getItem("QRECENT") || "[]");
    listRecent = listRecent.filter((v) => v.MenuId !== item.MenuId);
    let logItem = { ...item };
    logItem["timeRecent"] = new Date();
    logItem["sortRecent"] = new Date().getMilliseconds();
    await listRecent.push(logItem);
    await localStorage.setItem("QRECENT", JSON.stringify(listRecent));
    window.location.href = item.MenuUrl;
  };
  fetchTopMenus = async () => {
    await this.props.PermissionController.GetTopMenus();
    await localStorage.setItem(
      "menuList",
      JSON.stringify(this.props.getTopMenus)
    );
  };
  handleRenderMenu(menus) {
    let itemsMenu = [];
    if (menus?.length > 0) {
      const language = this.state.language;
      menus.sort((a, b) =>
        a.DisplayOrder > b.DisplayOrder
          ? 1
          : b.DisplayOrder > a.DisplayOrder
          ? -1
          : 0
      );
      for (let i = 0, lenMenus = menus.length; i < lenMenus; i++) {
        if (menus[i].Children && JSON.parse(menus[i].Children)) {
          let Children = JSON.parse(menus[i].Children),
            children = [],
            subMenus = [];
          if (menus[i].IsView) {
            if (Array.isArray(Children) && Children.length > 0) {
              const itemChild = Children.sort((a, b) =>
                a.DisplayOrder > b.DisplayOrder
                  ? 1
                  : b.DisplayOrder > a.DisplayOrder
                  ? -1
                  : 0
              );
              itemChild.forEach((item) => {
                if (item.IsView) {
                  children.push({
                    label: !language ? item.MenuTitleVN : item.MenuTitle,
                    icon: item.MenuIcon,
                    url: item.MenuUrl,
                  });
                  subMenus.push({
                    label: !language ? item.MenuTitleVN : item.MenuTitle,
                    icon: item.MenuIcon,
                    command: () => this.QuickRecent(item),
                  });
                }
              });
              itemsMenu.push({
                label: !language ? menus[i].MenuTitleVN : menus[i].MenuTitle,
                icon: menus[i].MenuIcon,
                items: subMenus,
              });
            } else {
              itemsMenu.push({
                label: !language ? menus[i].MenuTitleVN : menus[i].MenuTitle,
                icon: menus[i].MenuIcon,
                command: () => {
                  this.QuickRecent(menus[i]);
                },
              });
            }
          }
        }
      }
      this.setState({
        menus: menus,
        itemsMenu: itemsMenu,
      });
    }
  }
  async switchLangue(e) {
    await this.setState({ language: e.value });
    await this.handleRenderMenu(this.state.menus); // On Switch Lang
    await setLangue(e.value);

    if (e.value) {
      await localStorage.setItem("isVie", false);
    } else {
      await localStorage.setItem("isVie", true);
    }
    await this.props.LanguageController.GetLanguage();
  }
  LogOut = () => {
    sessionStorage.clear();
    localStorage.removeItem("USER");
    window.location.href = "/login";
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    const login = getLogin();
    if (nextProps !== this.props) {
      if (login !== null) {
        // if (login?.expriedPass === undefined || login?.expriedPass === null || TODAY >= login.expriedPass) {
        //     const mes = login.expriedPass === undefined || login?.expriedPass === null ? 'Mật khẩu của bạn chưa được thay đổi vui lòng thay đổi mật khẩu mới' : 'Mật khẩu của bạn đã hết hạn vui lòng đổi lại mật khẩu mới'
        //     this.setState({ showChangePass: true, reminPass: mes })
        // }
        this.setState({ FullName: login.fullName });
        this.setState({ disable: true });
        isDisplay = true;
      }
    }
  }
  onSelectTheme = (e) => {
    this.themeChanged(e.item.themeName);
  };
  render() {
    let menuBar = null;
    const HiddenMenu = [];
    HiddenMenu.push(
      <div
        key="leftMenu"
        style={{
          minHeight: 60,
          alignContent: "center",
          paddingRight: 10,
          paddingLeft: 10,
        }}
        className="p-card p-shadow-3 btn-lefmenu"
      >
        <div className="p-sm-4">
          <Button
            icon="pi pi-microsoft"
            onClick={() => this.setState({ visible: true })}
            label={this.state.AppName}
            className="p-button-raised p-button-text"
          ></Button>
        </div>
        <div
          className="p-sm-8 box"
          style={{ textAlign: "right", height: 15, float: "right" }}
        >
          <Button
            icon="pi pi-palette"
            style={{ marginRight: 5 }}
            aria-controls="themelist"
            aria-haspopup
            onClick={(event) => this.menu.toggle(event)}
          />
          <Menu
            popup
            ref={(el) => (this.menu = el)}
            id="themelist"
            model={listTheme(this.onSelectTheme)}
          />
          <ToggleButton
            checked={this.state.language}
            onLabel="Eng"
            offLabel="Vie"
            style={{ marginRight: 5 }}
            onIcon="pi pi-star-o"
            className={
              this.state.language === true ? "p-button-info" : "p-button-danger"
            }
            offIcon="pi pi-star"
            onChange={(e) => this.switchLangue(e)}
          />
          <Button
            tooltip="Profile"
            icon="pi pi-user"
            className="p-button-warning"
            style={{ marginLeft: "5px", marginRight: 5 }}
          />
          <Button
            tooltip="ChangePass"
            onClick={() => this.setState({ showChangePass: true })}
            className="p-button-success"
            icon="pi pi-cog"
            style={{ marginRight: 5 }}
          />
          {/* <Button tooltip="Notification" onClick={(e) => this.showNotify(e)} badge="8" badgeClassName="p-badge-danger"
                        icon="pi pi-bell" className="p-button-info" style={{ marginRight: 5, minWidth: 60 }} /> */}
          <Button
            tooltip="Logout"
            className="p-button-danger"
            onClick={() => (window.location.href = "/login")}
            icon="pi pi-sign-out"
          />
        </div>
      </div>
    );
    const leftContent = (
      <div className="p-d-inline" key={this.state.AppName}>
        <Button
          className="p-button-outlined btn__hover"
          label={this.state.AppName}
        ></Button>
      </div>
    );
    const rightContent = (
      <div className="p-d-flex">
        <Button
          icon="pi pi-palette"
          style={{ marginRight: 5 }}
          aria-controls="themelist"
          aria-haspopup
          onClick={(event) => this.menu.toggle(event)}
        />
        <Menu
          popup
          ref={(el) => (this.menu = el)}
          id="themelist"
          model={listTheme(this.onSelectTheme)}
        />
        <ToggleButton
          checked={this.state.language}
          onLabel="Eng"
          offLabel="Vie"
          style={{ marginRight: 5 }}
          onIcon="pi pi-star"
          offIcon="pi pi-star-o"
          onChange={(e) => this.switchLangue(e)}
        />
        {/* <Button className="p-button-warning" style={{ marginRight: 5 }}
                    icon="pi pi-user" label={this.state.FullName} /> */}
        <SplitButton
          label={this.state.FullName}
          icon="pi pi-user"
          className="p-button-warning"
          style={{ marginRight: 5 }}
          model={this.state.item}
        ></SplitButton>
        {/* <Button tooltip="ChangePass" onClick={() => this.setState({ showChangePass: true })} className="p-button-success"
                    icon="pi pi-cog" style={{ marginRight: 5 }} />
                <Button tooltip="Logout" className="p-button-danger" onClick={() => this.LogOut()} icon="pi pi-sign-out" /> */}
      </div>
    );
    if (this.state.menus?.length > 0) {
      menuBar = (
        <Menubar
          key={this.state.menus}
          style={{ borderRadius: 0 }}
          start={leftContent}
          end={rightContent}
          model={this.state.itemsMenu}
          className="btn-topmenu"
        />
      );
    } else {
      menuBar = (
        <Menubar
          key={this.state.menus}
          style={{ borderRadius: 0 }}
          start={leftContent}
          end={rightContent}
          model={null}
          className="btn-topmenu"
        />
      );
    }
    const UI_MENU = isDisplay ? (
      <div>
        <div key="divMenu" style={{ zIndex: 1000 }}>
          {HiddenMenu} {menuBar}
        </div>
        <Sidebar
          showCloseIcon={false}
          title={this.state.AppName}
          style={{ background: "#343a40", padding: 0, overflowY: "auto" }}
          visible={this.state.visible}
          position="left"
          onHide={() => this.setState({ visible: false })}
        >
          <div style={{ padding: 3 }}>
            <span
              style={{
                marginLeft: 10,
                color: "white",
                width: "100%",
                textAlign: "right",
              }}
            >
              Spiral System
            </span>
            <br />
            <img alt="a" width={80} height={80} src="/images/a.png" rounded />
            <span style={{ color: "white", textAlign: "left" }}>
              {this.state.FullName}
            </span>
          </div>
          <div>
            <PanelMenu model={this.state.itemsMenu} />
          </div>
        </Sidebar>
      </div>
    ) : (
      <div />
    );
    return (
      <React.Fragment>
        <Dialog
          header={this.props.language["change_password"] || "l_change_password"}
          maximized
          visible={this.state.showChangePass}
          style={{ width: "50vw" }}
          modal
          onHide={() => this.setState({ showChangePass: false })}
        >
          <UserChangePass
            language={this.props.language}
            messager={this.state.reminPass}
            ischange={this.state.showchange}
          />
        </Dialog>
        {UI_MENU}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    themeName: state.languageList.themeName,
    getTopMenus: state.permission.getTopMenus,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    LanguageController: bindActionCreators(LanguageAPI, dispatch),
    PermissionController: bindActionCreators(PermissionAPI, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
