import React, { Component } from "react";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { RegionApp } from "../Controls/RegionMaster";
import { RegionActionCreate } from "../../store/RegionController";
import { getToken, URL, download, HelpPermission } from "../../Utils/Helpler";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../store/EmployeeStoreController";
import { Accordion, AccordionTab } from "primereact/accordion";
import { connect } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./customcss.css";
import { Card } from "primereact/card";
import Page403 from "../ErrorRoute/page403";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class ShopPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      loading: false,
      shopAvailable: [],
      shopPermission: [],
      selectedAvailable: null,
      selectedPermission: null,
      permission: {},
      saveConfirmDialog: false,
      inputValues: {},
      lisEmployee: [],
      accId: null,
      Employee: null,
      Sup: null,
      TypeId: null,
    };
    this.pageId = 4;
    this._child = React.createRef();
    this.LoadData = this.LoadData.bind(this);
    this.rowItemTemplate = this.rowItemTemplate.bind(this);
    this.onMoveToPermission = this.onMoveToPermission.bind(this);
    this.onMoveToAvailable = this.onMoveToAvailable.bind(this);
    this.onMoveAllToAvailable = this.onMoveAllToAvailable.bind(this);
    this.onMoveAllToPermission = this.onMoveAllToPermission.bind(this);
    this.SavePermission = this.SavePermission.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.arrRandomId = [];
    this.Export = this.Export.bind(this);
    this.onClickExport = this.onClickExport.bind(this);
    this.onClickTemplate = this.onClickTemplate.bind(this);
    this.Import = this.Import.bind(this);
    this.timeout = 1000;
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: false });
  }

  async componentDidMount() {
    await this.props.RegionController.GetListRegion(this.state.accId);
    await this.props.EmployeeController.GetEmployeeDDL(this.state.accId).then(
      () => this.setState({ lisEmployee: this.props.employeeDDL })
    );
  }

  LoadData() {
    if (!this.state.Employee) {
      this.toast.show({
        severity: "warn",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: `${
          this.props.language["please_select_employee"] ||
          "l_please_select_employee"
        }`,
      });
      return;
    }
    this.arrRandomId = [];
    this.setState({ loading: true });
    let ProvinceId = "";
    if (this.state.province) {
      this.state.province.forEach((item) => {
        ProvinceId += "," + item;
      });
    }
    var data = {
      EmployeeId: this.state.Employee ? this.state.Employee : null,
      CustomerId: this.state.customerId ? this.state.customerId : null,
      Area: this.state.area ? this.state.area : null,
      ProvinceId: ProvinceId ? ProvinceId : null,
      ShopCodes: this.state.shopCode ? this.state.shopCode : null,
    };
    this.props.EmployeeStoreController.Filter(data, this.state.accId).then(
      (val) => {
        if (
          this.props.filterResult.table.length > 0 ||
          this.props.filterResult.table1.length > 0
        ) {
          this.toast.show({
            severity: "success",
            summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
            detail: `${this.props.language["success"] || "l_success"}`,
          });
          this.setState({
            shopAvailable: this.props.filterResult.table,
            shopPermission: this.props.filterResult.table1,
            selectedAvailable: null,
            selectedPermission: null,
          });
        } else
          this.toast.show({
            severity: "info",
            summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
            detail: `${this.props.language["data_null"] || "l_data_null"}`,
          });
      }
    );
  }

  SavePermission = async (data) => {
    this.setState({ loading: true });
    const url = URL + "EmployeeStore/Save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        accId: this.state.accId || "",
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: error,
      });
    }
  };

  Export = async (data) => {
    this.setState({ loading: true });
    const url = URL + "EmployeeStore/Export";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        JsonData: JSON.stringify(data),
        accId: this.state.accId || "",
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: error,
      });
    }
  };

  Import = async (e) => {
    this.setState({ loading: true });
    const url = URL + `EmployeeStore/import`;
    const formData = new FormData();
    formData.append("fileUpload", e.files[0]);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        accId: this.state.accId || "",
      },
      body: formData,
    };
    try {
      const request = new Request(url, requestOptions);
      const response = await fetch(request);
      const result = await response.json();
      if (result.status === 500) {
        this.toast.show({
          severity: "error",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      }
      if (result.status === 200) {
        this.toast.show({
          severity: "success",
          summary: "Thông báo",
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      } else if (result.status === 300) {
        download(result.fileUrl);
        this.toast.show({
          severity: "error",
          summary: "Thông báo",
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      } else {
        this.toast.show({
          severity: "error",
          summary: "Thông báo",
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: error,
      });
      this.setState({
        loading: false,
      });
    } finally {
      this._child.current.clear();
      this.setState({
        loading: false,
      });
    }
  };

  onMoveToPermission() {
    if (!this.state.dates || this.state.dates.length === 0) {
      this.toast.show({
        severity: "warn",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: `${
          this.props.language["please_select_from_to_date"] ||
          "l_please_select_from_to_date"
        }`,
      });
      return;
    }
    const fromdate = this.state.dates[0];
    const todate = this.state.dates[1];
    let shopAvailable = this.state.shopAvailable;
    let shopPermission = this.state.shopPermission;
    let selectedAvailable = this.state.selectedAvailable;
    var i = shopAvailable.length;
    const min = -1;
    const max = -1000;
    while (i--) {
      selectedAvailable.forEach((item) => {
        if (shopAvailable[i] === item) {
          shopAvailable.splice(i, 1);
          item.fromDate = fromdate;
          item.toDate = todate;
          var idRandom = null;
          while (true) {
            idRandom = min + Math.random() * (max - min);
            if (this.arrRandomId.includes(idRandom) === false) {
              item.id = idRandom;
              this.arrRandomId.push(idRandom);
              break;
            }
          }
          shopPermission.push(item);
        }
      });
    }
    this.setState({
      shopAvailable: shopAvailable,
      shopPermission: shopPermission,
      selectedPermission: null,
    });
  }

  onMoveToAvailable() {
    const fromdate = this.state.dates[0];
    const todate = this.state.dates[1];
    let shopavailable = this.state.shopAvailable;
    let shoppermission = this.state.shopPermission;
    let selectedpermission = this.state.selectedPermission;
    var i = shoppermission.length;
    while (i--) {
      selectedpermission.forEach((item) => {
        if (shoppermission[i] === item) {
          shoppermission.splice(i, 1);
          shopavailable.push(item);
        }
      });
    }
    this.setState({
      shopAvailable: shopavailable,
      shopPermission: shoppermission,
      selectedAvailable: null,
    });
  }

  onMoveAllToPermission() {
    if (!this.state.dates || this.state.dates.length === 0) {
      this.toast.show({
        severity: "warn",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: `${
          this.props.language["please_select_from_to_date"] ||
          "l_please_select_from_to_date"
        }`,
      });
      return;
    }
    const fromdate = this.state.dates[0];
    const todate = this.state.dates[1];
    let shopavailable = this.state.shopAvailable;
    let shopermission = this.state.shopPermission;
    var i = shopavailable.length;
    while (i--) {
      shopavailable[i].fromDate = fromdate;
      shopavailable[i].toDate = todate;
      shopermission.push(shopavailable[i]);
      shopavailable.splice(i, 1);
    }
    this.setState({
      shopAvailable: shopavailable,
      shopPermission: shopermission,
      selectedAvailable: null,
      selectedPermission: null,
    });
  }

  onMoveAllToAvailable() {
    let shopavailable = this.state.shopAvailable;
    let shopermission = this.state.shopPermission;
    var i = shopermission.length;
    while (i--) {
      shopavailable.push(shopermission[i]);
      shopermission.splice(i, 1);
    }
    this.setState({
      shopAvailable: shopavailable,
      shopPermission: shopermission,
      selectedAvailable: null,
      selectedPermission: null,
    });
  }

  onClickSave() {
    let shoppermission = this.state.shopPermission;
    let shopSave = [];
    shoppermission.forEach((item) => {
      let objSave = {
        shopId: item.shopId,
        fromDate: parseInt(moment(item.fromDate).format("YYYYMMDD")),
        toDate: item.toDate
          ? parseInt(moment(item.toDate).format("YYYYMMDD"))
          : null,
      };
      shopSave.push(objSave);
    });
    let dataToSave = {
      EmployeeId: this.state.Employee,
      ShopCodes: this.state.shopCode ? this.state.shopCode : null,
      ShopSave: JSON.stringify(shopSave),
    };
    this.SavePermission(dataToSave).then((result) => {
      if (parseInt(result, 10) > 0) {
        this.toast.show({
          severity: "success",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${
            this.props.language["save_successful"] || "l_save_successful"
          }`,
        });
        this.setState({
          loading: false,
        });
        return;
      } else {
        this.toast.show({
          severity: "info",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${this.props.language["save_failed"] || "l_save_failed"}`,
        });
        this.setState({
          loading: false,
        });
        return;
      }
    });
  }

  onClickExport() {
    let ProvinceId = "";
    if (this.state.province) {
      this.state.province.forEach((item) => {
        ProvinceId += "," + item;
      });
    }
    var data = {
      employeeId: this.state.Employee ? this.state.Employee : null,
      customerId: this.state.customerId ? this.state.customerId : null,
      area: this.state.area ? this.state.area : null,
      provinceId: ProvinceId ? ProvinceId : null,
      shopCode: this.state.shopCode ? this.state.shopCode : null,
      supId: this.state.Sup ? this.state.Sup : null,
      typeId: this.state.TypeId ? this.state.TypeId : null,
    };
    this.Export(data).then((result) => {
      if (result.status == 200) {
        this.toast.show({
          severity: "success",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${this.props.language["success"] || "l_success"}`,
        });
        this.setState({
          urlExport: result.fileUrl,
          loading: false,
        });
      } else {
        this.toast.show({
          severity: "error",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      }
    });
  }

  onClickTemplate() {
    let ProvinceId = "";
    if (this.state.province) {
      this.state.province.forEach((item) => {
        ProvinceId += "," + item;
      });
    }
    var data = {
      employeeId: this.state.Employee ? this.state.Employee : null,
      customerId: this.state.customerId ? this.state.customerId : null,
      area: this.state.area ? this.state.area : null,
      provinceId: ProvinceId ? ProvinceId : null,
      shopCode: this.state.shopCode ? this.state.shopCode : null,
      supId: this.state.Sup ? this.state.Sup : null,
      typeId: this.state.TypeId ? this.state.TypeId : null,
    };
    this.Export(data).then((result) => {
      if (result.status == 200) {
        this.toast.show({
          severity: "success",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${this.props.language["success"] || "l_success"}`,
        });
        this.setState({
          urlTemplate: result.fileUrl,
          loading: false,
        });
      } else {
        this.toast.show({
          severity: "error",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: result.message,
        });
        this.setState({
          loading: false,
        });
      }
    });
  }

  handleChange = (id, value) => {
    if (id === "Employee") {
      const listEm = this.state.lisEmployee;
      const tmpEm = listEm.find((p) => p.id === value);
      this.setState({
        [id]: value === null || value === undefined ? "" : value,
        TypeId: tmpEm ? tmpEm.typeId : null,
        shopAvailable: [],
        shopPermission: [],
        selectedAvailable: null,
        selectedPermission: null,
      });
    } else if (id === "accId") {
      this.setState({
        [id]: value === null || value === undefined ? "" : value,
        shopAvailable: [],
        shopPermission: [],
        selectedAvailable: null,
        selectedPermission: null,
        TypeId: null,
        Employee: null,
        Sup: null,
      });
      this.props.RegionController.GetListRegion(value);
      this.props.EmployeeController.GetEmployeeDDL(value).then(() =>
        this.setState({ lisEmployee: this.props.employeeDDL })
      );
    } else {
      this.setState({
        [id]: value === null || value === undefined ? "" : value,
      });
    }
  };

  rowItemTemplate(itemshop) {
    return (
      <div className="p-clearfix">
        <p style={{ display: "inline" }}>{itemshop.shopId}</p> -
        <p style={{ display: "inline" }}>{itemshop.shopName}</p> -
        <p style={{ display: "inline" }}>
          {moment(itemshop.fromDate).format("DD/MM/YYYY")}
        </p>
        -
        <p style={{ display: "inline" }}>
          {itemshop.toDate ? moment(itemshop.toDate).format("DD/MM/YYYY") : ""}
        </p>
      </div>
    );
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  fromDateEditor = (rowData, event) => {
    return (
      <Calendar
        id="icon"
        dateFormat="dd-mm-yy"
        value={new Date(rowData.fromDate)}
        onChange={(e) =>
          this.handleChangeFromDate(rowData, e.value, event.rowIndex)
        }
        showIcon
      />
    );
  };
  toDateEditor = (rowData, event) => {
    return (
      <Calendar
        id="icon"
        dateFormat="dd-mm-yy"
        value={rowData.toDate ? new Date(rowData.toDate) : null}
        onChange={(e) =>
          this.handleChangeToDate(rowData, e.value, event.rowIndex)
        }
        showIcon
      />
    );
  };
  handleChangeFromDate = (rowData, value, index) => {
    let temp = this.state.shopPermission;
    if (rowData.id > 0) {
      let ind = temp.findIndex((e) => e.id === rowData.id);
      if (ind > -1) {
        temp[ind].fromDate = value ? moment(value).format() : null;
      }
    } else {
      let ind = temp.findIndex(
        (e) => e.id === rowData.id && e.shopId === rowData.shopId
      );
      if (ind > -1) {
        temp[ind].fromDate = value ? moment(value).format() : null;
      }
    }
    // temp[index].fromDate = moment(value).format();
    this.setState({ shopPermission: temp });
  };
  handleChangeToDate = (rowData, value, index) => {
    let temp = this.state.shopPermission;
    if (rowData.id > 0) {
      let ind = temp.findIndex((e) => e.id === rowData.id);
      if (ind > -1) {
        temp[ind].toDate = value ? moment(value).format() : null;
      }
    } else {
      let ind = temp.findIndex(
        (e) => e.id === rowData.id && e.shopId === rowData.shopId
      );
      if (ind > -1) {
        temp[ind].toDate = value ? moment(value).format() : null;
      }
    }
    // temp[index].toDate = value ? moment(value).format() : null;
    this.setState({ shopPermission: temp });
  };
  renderAction = (rowData, event) => {
    return (
      <Button
        icon="pi pi-save"
        className="p-button-success"
        onClick={() => this.handleSave(rowData, event.rowIndex)}
      />
    );
  };
  handleSave = async (rowData, index) => {
    await this.setState({ loading: true });
    const data = {
      id: rowData.id,
      employeeId: this.state.Employee,
      shopId: rowData.shopId,
      fromDate: parseInt(moment(new Date(rowData.fromDate)).format("YYYYMMDD")),
      toDate: rowData.toDate
        ? parseInt(moment(new Date(rowData.toDate)).format("YYYYMMDD"))
        : 0,
    };
    await this.props.EmployeeStoreController.UpdateDate(
      data,
      index,
      this.state.accId
    );
    const result = this.props.updateDate;
    if (result.status === 200) {
      await this.setState({
        inputValues: {},
        shopPermission: this.props.filterResult.table1,
      });
      await this.Alert("Cập nhập thành công", "info");
    } else {
      await this.Alert(result.message, "error");
    }
    await this.setState({ loading: false });
  };
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  render() {
    let leftSearch = [],
      rightSearch = [],
      rightSave = [],
      htmldownload = null;
    if (this.state.permission) {
      if (this.state.permission.view) {
        leftSearch.push(
          <Button
            label={this.props.language["search"] || "search"}
            icon="pi pi-search"
            style={{ marginRight: ".25em", width: "auto" }}
            onClick={this.LoadData}
          />
        );
      }
      if (this.state.permission.view === true && this.state.permission.export) {
        leftSearch.push(
          <Button
            label={
              this.props.language["menu.export_report"] || "menu.export_report"
            }
            icon="pi pi-download"
            style={{ marginRight: ".25em", width: "auto" }}
            className="p-button-success"
            onClick={this.onClickExport}
          />
        );
      }
      if (this.state.permission.view === true && this.state.permission.create) {
        rightSearch.push(
          <Button
            label={
              this.props.language["create_template"] || "l_create_template"
            }
            icon="pi pi-file-excel"
            style={{ marginRight: ".25em", width: "auto" }}
            className="p-button-danger"
            onClick={this.onClickTemplate}
          />
        );
      }
      if (this.state.permission.view === true && this.state.permission.import) {
        rightSearch.push(
          <FileUpload
            ref={this._child}
            name="myfile[]"
            mode="basic"
            chooseLabel={this.props.language["import"] || "l_import"}
            accept=".xlsx,.xls"
            customUpload={true}
            multiple={false}
            uploadHandler={this.Import}
          />
        );
        rightSearch.push(
          <Button
            label={this.props.language["cancel"] || "cancel"}
            icon="pi pi-times-circle"
            style={{ marginLeft: ".25em", width: "auto" }}
            className="p-button-danger"
            onClick={(e) => this._child.current.clear()}
          />
        );
      }
      if (
        this.state.permission.edit === true &&
        this.state.permission.view === true
      ) {
        rightSave.push(
          <Button
            tooltip={this.props.language["save"] || "save"}
            icon="pi pi-save"
            className="p-button-success"
            onClick={this.onClickSave}
          />
        );
      }
      if (
        this.state.urlExport &&
        this.state.urlExport.length > 10 &&
        this.state.permission.export
      ) {
        htmldownload = (
          <Button
            icon="pi pi-download"
            label={this.props.language["download"] || "l_download"}
            className="p-button-rounded p-button-warning p-mr-2"
            onClick={() => download(this.state.urlExport)}
          />
        );
        leftSearch.push(htmldownload);
      }
      if (
        this.state.urlTemplate &&
        this.state.urlTemplate.length > 10 &&
        this.state.permission.import
      ) {
        htmldownload = (
          <Button
            icon="pi pi-download"
            label={this.props.language["download"] || "l_download"}
            style={{ marginLeft: ".25em", width: "auto" }}
            className="p-button-rounded p-button-warning p-mr-2"
            onClick={() => download(this.state.urlTemplate)}
          />
        );
        rightSearch.push(htmldownload);
      }
    }
    return this.state.permission.view ? (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div>
              <div className="p-grid">
                <AccountDropDownList
                  id="accId"
                  className="p-field p-col-12 p-md-3"
                  onChange={this.handleChange}
                  filter={true}
                  showClear={true}
                  value={this.state.accId}
                />
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["l_supervisor"] || "l_supervisor"}
                  </label>
                  <EmployeeDropDownList
                    type="SUP"
                    parentId={null}
                    typeId={0}
                    id="Sup"
                    mode="single"
                    accId={this.state.accId}
                    value={this.state.Sup}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["position"] || "l_position"}
                  </label>
                  <EmployeeTypeDropDownList
                    id="TypeId"
                    type=""
                    value={this.state.TypeId}
                    accId={this.state.accId}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["employee"] || "employee"}</label>
                  <EmployeeDropDownList
                    type=""
                    parentId={this.state.Sup ? this.state.Sup : null}
                    typeId={this.state.TypeId ? this.state.TypeId : 0}
                    id="Employee"
                    mode="single"
                    accId={this.state.accId}
                    value={this.state.Employee}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["Customer"] || "l_Customer"}
                  </label>
                  <CustomerDropDownList
                    id="customerId"
                    mode="single"
                    accId={this.state.accId}
                    value={this.state.customerId}
                    onChange={this.handleChange}
                  />
                </div>
                <RegionApp {...this} />
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["storelist.shopcode"] ||
                      "storelist.shopcode"}
                  </label>
                  <InputText
                    type="text"
                    style={{ width: "100%" }}
                    placeholder={
                      this.props.language["storelist.shopcode"] ||
                      "storelist.shopcode"
                    }
                    value={this.state.shopCode || ""}
                    onChange={(e) => {
                      this.setState({
                        shopCode: e.target.value,
                      });
                    }}
                    id="shopCode"
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["from_to_date"] || "l_from_to_date"}
                  </label>
                  <Calendar
                    fluid
                    value={this.state.dates}
                    onChange={(e) => this.setState({ dates: e.value })}
                    dateFormat="yy-mm-dd"
                    inputClassName="p-inputtext"
                    id="fromDate"
                    selectionMode="range"
                    // value={this.state.dates}
                    inputStyle={{ width: "91.5%", visible: false }}
                    style={{ width: "100%" }}
                    showIcon
                  />
                </div>
              </div>
              <br />
              <Toolbar left={leftSearch} right={rightSearch} />

              {this.state.loading ? (
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "5px" }}
                ></ProgressBar>
              ) : null}
            </div>
          </AccordionTab>
        </Accordion>
        <div className="p-picklist p-component" style={{ width: "100%" }}>
          <div
            className="p-picklist-list-wrapper p-picklist-source-wrapper"
            style={{ width: "35%", flex: "none" }}
          >
            <div className="p-picklist-header">
              {this.props.language["menu_store"] || "menu_store"}{" "}
              {this.state.shopAvailable.length}
            </div>
            <ul
              className="p-picklist-list p-picklist-source"
              role="listbox"
              aria-multiselectable="true"
              style={{ height: 650 }}
            >
              <DataTable
                dataKey="shopId"
                value={this.state.shopAvailable}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 30, 50]}
                scrollable
                scrollHeight="250px"
                selection={this.state.selectedAvailable}
                onSelectionChange={(e) =>
                  this.setState({ selectedAvailable: e.value })
                }
              >
                <Column
                  selectionMode="multiple"
                  field="shopId"
                  style={{ width: "3em" }}
                />
                <Column
                  filter
                  header={
                    this.props.language["storelist.shopcode"] ||
                    "storelist.shopcode"
                  }
                  field="shopCode"
                  style={{ width: 150 }}
                />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopname"] ||
                    "storelist.shopname"
                  }
                  field="shopName"
                />
              </DataTable>
            </ul>
          </div>
          <div className="p-picklist-buttons p-picklist-transfer-buttons">
            <Button
              icon="pi pi-angle-right"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveToPermission}
            />
            <Button
              icon="pi pi-angle-double-right"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveAllToPermission}
            />
            <Button
              icon="pi pi-angle-left"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveToAvailable}
            />
            <Button
              icon="pi pi-angle-double-left"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveAllToAvailable}
            />
            {rightSave}
          </div>
          <div
            className="p-picklist-list-wrapper p-picklist-target-wrapper"
            style={{ width: "65%" }}
          >
            <div className="p-picklist-header">
              {this.props.language["menu_store"] || "menu_store"}
              {" " + this.state.shopPermission.length}{" "}
              {this.props.language["distributed"] || "l_distributed"}
            </div>
            <ul
              className="p-picklist-list p-picklist-targe"
              role="listbox"
              aria-multiselectable="true"
              style={{ height: 450, overflow: "auto" }}
            >
              <DataTable
                dataKey="id"
                value={this.state.shopPermission}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 30, 50]}
                // scrollable scrollHeight="250px"
                selection={this.state.selectedPermission}
                onSelectionChange={(e) =>
                  this.setState({ selectedPermission: e.value })
                }
              >
                <Column selectionMode="multiple" style={{ width: "3em" }} />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopcode"] ||
                    "storelist.shopcode"
                  }
                  field="shopCode"
                  style={{ width: 120 }}
                />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopname"] ||
                    "storelist.shopname"
                  }
                  field="shopName"
                  style={{ width: 200 }}
                />
                <Column
                  header={this.props.language["fromdate"] || "fromdate"}
                  style={{ width: 170 }}
                  // field={(e) => e.fromDate ? moment(e.fromDate, "YYYYMMDD").format("DD/MM/YYYY") : null}
                  body={(rowData, e) => this.fromDateEditor(rowData, e)}
                />
                <Column
                  header={this.props.language["todate"] || "todate"}
                  style={{ width: 170 }}
                  // field={(e) => e.toDate ? moment(e.toDate, "YYYYMMDD").format("DD/MM/YYYY") : null}
                  body={(rowData, e) => this.toDateEditor(rowData, e)}
                />
                <Column
                  body={(rowdata, e) => this.renderAction(rowdata, e)}
                  style={{ textAlign: "center", width: 80 }}
                ></Column>
              </DataTable>
            </ul>
          </div>
        </div>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    filterResult: state.employeeStore.filterResult,
    language: state.languageList.language,
    updateDate: state.employeeStore.updateDate,
    usearea: true,
    useprovince: true,
    regions: state.regions.regions,
    employeeDDL: state.employees.employeeDDL,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    EmployeeStoreController: bindActionCreators(actionCreators, dispatch),
    RegionController: bindActionCreators(RegionActionCreate, dispatch),
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopPermission);
