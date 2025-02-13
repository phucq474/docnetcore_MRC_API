import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/LoginController";
import { setLogin } from "../Utils/Helpler";
import { Redirect } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import backtop from '../asset/images/Background01.svg';
import backtop_2 from '../asset/images/Background02.svg';
import backtop_3 from '../asset/images/Background03.svg';
import backtop_4 from '../asset/images/Background04.svg';
import logo from '../asset/images/logo.png'
import { Password } from 'primereact/password';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from "primereact/toast";
//FireBase
// import { messaging } from '../init-fcm'
// import * as firebase from "firebase/app";
// import 'firebase/messaging'
class Login extends PureComponent {
  constructor(props) {
    super(props);
    sessionStorage.clear();
    localStorage.removeItem("USER");
    localStorage.removeItem("fetch_once");
    localStorage.removeItem("LangActive");
    this.state = {
      redirect: false,
      id: 0,
      loading: false,
    };
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
  }
  async handleLogin(event) {
    this.setState({ loading: true });
    let username = this.state.username;
    let password = this.state.password;
    let token = '999999999';
    // if (firebase.messaging.isSupported()) {
    //   try {
    //     token = await messaging.getToken();
    //   } catch (error) { }
    // } else {
    //   token = "platform don't support";
    // }
    let alert = "";
    if (username === undefined || username === null || username === "") {
      this.showError("Tên đăng nhập không được để trống.");
      return;
    }
    if (password === undefined || password === null || password === "") {
      this.showError("Mật khẩu không được để trống.");
      return;
    }
    if (token === null || token === "")
      alert += "Bạn vui lòng cho phép sử dụng chức năng nhận thông báo";
    if (alert.length > 1) this.setState({ messager: alert, show: true });
    else {
      this.props.getLoginActions.SignIn({
        username: username,
        password: password,
        token: token,
        versionid: 1,
        client_time: Date()
      });
    }
  }
  handleChangeUser(e) {
    e.preventDefault();
    this.setState({ username: e.target.value });
  }
  UNSAFE_componentWillMount() {
    this.defaultTheme();
  }
  defaultTheme = () => {
    let currentTheme = localStorage.getItem("THEME");
    if (currentTheme === null)
      currentTheme = this.defaultTheme;
    let themeElement = document.getElementById('theme-link');
    themeElement.setAttribute('href', themeElement.getAttribute('href').replace('theme_set', currentTheme));
  }
  handleChangePass(e) {
    e.preventDefault();
    this.setState({ password: e.target.value });
  }
  handleLoginSuccess(url) {
    window.location.href = url ? url : '/'
  }
  checkEnter(e) {
    if (e.keyCode === 13) {
      this.handleLogin();
    }
  }

  getUrlDefault = (data) => {
    if (data?.length > 0) {
      const child = data[0].Children ? JSON.parse(data[0].Children) : [];
      if (child?.length > 0) {
        if (child[0].MenuUrl) {
          return child[0].MenuUrl;
        }
      }
      else {
        return data[0].MenuUrl;
      }
    }
    return "/";
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.props.login) {
      if (nextProps.login.id > 0) {
        // const menuList = JSON.parse(nextProps.login.menuList);
        const url = '/' // this.getUrlDefault(JSON.parse(menuList[0].Menu));
        let strLogin = JSON.stringify(nextProps.login);
        setLogin(strLogin);
        this.handleLoginSuccess(url);
      }
      else {
        this.showError(nextProps.login.error);
      }
    } else
      if (this.props.errors !== nextProps.errors)
        this.showError(nextProps.errors);

  }
  Close = () => {
    this.setState({ show: false });
  }
  SendMail = () => {
    if (this.state.email === undefined || !this.state.email.includes('@')) {
      this.showError("Tài khoản email không hợp lệ");
    } else {
      const data = {
        email: this.state.email,
        use_set: this.state.use_set,
      }
      this.props.getLoginActions.SendMail(data);
    }
  }
  renderFooter = () => {
    return (
      <div>
        <Button className="p-button-info" onClick={() => this.SendMail()}>Gửi yêu cầu</Button>
        {/* <Button className="p-button-danger"
          onClick={() => this.setState({ displayPop: false })}>Huỷ bỏ</Button> */}
      </div>
    );
  }
  handleEmail = (e) => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  }
  showError(message, style) {
    if (style === undefined)
      style = 'error'
    this.toast.show({ severity: style, summary: 'Notification', detail: message });
    this.setState({ loading: false });
  }
  handleClose(e) {
    this.setState({ show: false });
  }
  render() {
    if (this.state.redirect === true) {
      return <Redirect to='/attendance' />;
    }
    return (
      <div className="p-fluid">
        <img alt="backTop" style={{ width: '100%', position: 'absolute', left: 0, zIndex: -1 }} src={backtop_4}></img>
        <div style={{ width: '56%', height: '120px', textAlign: "center" }}>
          <img alt="logo" src={logo}></img>
        </div>
        <div style={{ marginTop: 100, zIndex: 10 }} className="p-d-flex p-ai-center">
          <div className="p-col-2 p-md-2 p-sm-0"></div>
          <div className="p-col-8 p-md-8 p-sm-10">
            <Card className="shadow-8" title="Sign In System">
              <div className="p-grid">
                <div className="p-col-12 p-md-12">
                  <label>Username</label>
                  <InputText
                    id="username"
                    value={this.state.username}
                    placeholder="Enter Username"
                    onChange={this.handleChangeUser}
                  ></InputText>
                </div>
                <div className="p-col-12 p-md-12">
                  <label>Password</label>
                  <Password
                    id="password"
                    onKeyUp={this.checkEnter.bind(this)}
                    value={this.state.password}
                    style={{ zIndex: 100 }}
                    feedback={false}
                    onChange={this.handleChangePass} />
                </div>
                <div className="p-col-12 p-md-6 p-sm-6">
                  <Button style={{ width: 150 }} onClick={() => this.setState({ displayPop: true })}
                    className="p-button-danger p-button-outlined" label="Forget pass" />
                </div>
                <div style={{ textAlign: 'right' }} className="p-col-12 p-md-6 p-sm-6">
                  <Button style={{ width: 150 }} className="p-d-inline" label="Sign In" onClick={this.handleLogin} />
                </div>
              </div>
            </Card>
            <Toast ref={(el) => this.toast = el} />
            <div style={{ textAlign: 'center', width: '100%', position: 'relative', top: -100 }}>
              {this.state.loading ? <ProgressSpinner /> : null}
            </div>
          </div>
          <div className="p-col-2  p-md-2 p-sm-0"></div>
        </div>
        <footer style={{ bottom: 0, width: '100%', textAlign: 'center', marginBottom: 10, position: 'fixed' }}>
          <h4>Công ty TNHH Sức Bật</h4>
          <label>27b Nguyễn Đình Chiều, P.Đakao, Q.1, TP.Hồ Chí Minh</label>
          <h6>Copyright © 2020 website. All Rights Reserved</h6>
        </footer>
        <Dialog header="Lấy lại mật khẩu"
          visible={this.state.displayPop} style={{ width: '50vw' }}
          onHide={() => this.setState({ displayPop: false })} footer={this.renderFooter()}>
          <div>
            <label>Tài khoản khôi phục mật khẩu</label>
            <InputText value={this.state.use_set}
              placeholder="user recovery password"
              onChange={(e) => this.setState({ use_set: e.target.value })}
            />
            <label>Email khôi phục mật khẩu</label>
            <br />
            <InputText
              type="email" keyfilter='email'
              value={this.state.email}
              onChange={this.handleEmail}
              placeholder="email to:...." />
          </div>
        </Dialog>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state,
    username: state.logins.username,
    password: state.logins.password,
    login: state.logins.login,
    loading: state.logins.loading,
    errors: state.logins.errors,
    forceReload: state.logins.forceReload
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getLoginActions: bindActionCreators(actionCreators, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
