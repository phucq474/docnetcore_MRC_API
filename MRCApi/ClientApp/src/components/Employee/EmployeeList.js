import React, { Component } from "react";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import {
  IoCheckmarkCircleSharp,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import {
  getToken,
  URL,
  HelpPermission,
  download,
  getLogin,
} from "../../Utils/Helpler";
import { Dropdown } from "primereact/dropdown";
//React-redux
import { bindActionCreators } from "redux";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import { ProgressBar } from "primereact/progressbar";
import moment from "moment";
import { Card } from "primereact/card";
import Page403 from "../ErrorRoute/page403";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: null,
      employeeCode: "",
      employeeName: "",
      typeId: 0,
      supId: 0,
      userName: "",
      phone: "",
      linkTemplate: null,
      linkExport: null,
      file: null,
      loading: false,
      activeIndex: 0,
      permission: {},
      downloaded: true,
      deleteDialog: false,
      resetPasswordDialog: false,
      employeeList: [],
      accId: "",
    };
    this.pageId = 3;
    this.LoadList = this.LoadList.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.handlerChangeInput = this.handlerChangeInput.bind(this);
    this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    this.handlerUploadClick = this.handlerUploadClick.bind(this);
    this.actionStatusTemplate = this.actionStatusTemplate.bind(this);
    this.OnExport = this.OnExport.bind(this);
    //this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.fileUpload = React.createRef();
    this.statusOption = [
      { value: 1, name: "Active" },
      { value: 0, name: "In-Active" },
    ];
  }

  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false });
  }

  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
      life: 5000,
    });
  };

  getFilter = () => {
    var data = {
      EmployeeCode: this.state.employeeCode || null,
      EmployeeName: this.state.employeeName || null,
      TypeId: this.state.typeId || null,
      SupId: this.state.supId || null,
      UserName: this.state.userName || null,
      PhoneNumber: this.state.phone || null,
      Status:
        !this.state.status && this.state.status !== 0
          ? null
          : this.state.status,
      CMND: this.state.idCard || null,
      accId: this.state.accId !== undefined ? this.state.accId : null,
    };
    return data;
  };

  async LoadList() {
    await this.setState({ loading: true });
    const filter = await this.getFilter();
    await this.props.EmployeeController.GetList(filter);
    const result = this.props.lists;
    if (result.length > 0) {
      await this.Alert("Thành công", "success");
    } else {
      await this.Alert("Không thành công", "error");
    }
    await this.setState({
      loading: false,
      employeeList: result,
    });
  }

  handlerChangeInput(e) {
    this.setState({
      [e.target.id]: e.target.value === null ? "" : e.target.value,
    });
  }

  handleChangeDropdown(id, value) {
    this.setState({ [id]: value === null ? "" : value });
  }

  handlerChangeFile(e) {
    this.setState({ file: e.files[0] });
  }

  handlerUploadClick(e) {
    this.setState({ loading: true });
    this.Import(e).then((val) => {
      if (val) {
        this.setState({
          loading: false,
        });
        this.fileUpload.current.fileInput = { value: "" };
        this.fileUpload.current.clear();
      }
    });
  }

  handlerDeleteDialog = (boolean, EmployeeId, Status) => {
    if (boolean) {
      this.setState({
        deleteDialog: true,
        employeeIdDelete: EmployeeId,
      });
    } else {
      this.setState({ deleteDialog: false });
    }
  };

  handlerResetPassDialog = (boolean, EmployeeId) => {
    if (boolean) {
      this.setState({ resetPasswordDialog: true, employeeIdReset: EmployeeId });
    } else {
      this.setState({ resetPasswordDialog: false });
    }
  };

  footerDeleteDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.delete && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-info"
              onClick={() => this.handlerDeleteDialog(false)}
            />
            <Button
              label={this.props.language["delete"] || "l_delete"}
              className="p-button-danger"
              onClick={() => this.handleDeleteStatus()}
            />
          </div>
        )}
      </div>
    );
  };

  handleDeleteStatus = async () => {
    await this.setState({ loading: true });
    await this.props.EmployeeController.UpdateStatus(
      this.state.employeeIdDelete,
      0
    );
    const result = this.props.updateStatus;
    let employeeList = this.state.employeeList;
    if (result.status === 200) {
      let indexEmployeeToDelete = employeeList.findIndex(
        (e) => e.id === this.state.employeeIdDelete
      );
      employeeList[indexEmployeeToDelete].status = 0;
      await this.Alert(result.message, "info");
    } else {
      await this.Alert(result.message, "error");
    }
    await this.setState({
      deleteDialog: false,
      loading: false,
      employeeList: employeeList,
    });
  };

  footerResetPasswordDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-info"
              onClick={() => this.handlerResetPassDialog(false)}
            />
            <Button
              label={this.props.language["reset"] || "l_reset"}
              className="p-button-success"
              onClick={() => this.handleResetPassWord()}
            />
          </div>
        )}
      </div>
    );
  };

  handleResetPassWord = async () => {
    await this.setState({ loading: true });
    await this.props.EmployeeController.ResetPassword(
      this.state.employeeIdReset
    );
    const result = this.props.resetPassword;
    if (result.status === 200) {
      await this.Alert(result.message, "info");
    } else {
      await this.Alert(result.message, "error");
    }
    await this.setState({ resetPasswordDialog: false, loading: false });
  };

  Import = async (e) => {
    const url = URL + "employee/import";
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
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      if (result.status === 200) {
        this.Alert(result.message, "info");
      } else if (result.status === 0) {
        // console.log(result.fileUrl)
      } else if (result.status === 500) {
        this.Alert(result.message, "error");
      }
      return 1;
    } catch (error) {}
  };

  OnExport = async () => {
    this.setState({ loading: true });
    const token = getToken();
    const url = URL + `employee/export`;
    const filter = this.getFilter();
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
        Json: JSON.stringify(filter),
        accId: this.state.accId || "",
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      const link = await response.json();
      if (link.status === 1) {
        await download(link.fileUrl);
        await this.Alert(link.message, "info");
      } else {
        await this.Alert(link.message, "error");
      }
    } catch (err) {
    } finally {
      this.setState({ loading: false });
    }
  };

  OnCreateTemplate = async () => {
    const token = getToken();
    const url = URL + `employee/template`;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
        accId: this.state.accId || "",
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      const link = await response.json();
      if (link.status === 1) {
        await download(link.fileUrl);
        await this.Alert(link.message, "info");
      } else await this.Alert(link.message, "error");
    } catch (err) {
    } finally {
      this.setState({ loading: false });
    }
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <Button
            style={{ marginLeft: 5 }}
            className="p-button-sm p-button-warning"
            icon="pi pi-pencil"
            title={this.props.language["edit"] || "l_edit"}
            onClick={() => window.open(`./CreateEmployee/${rowData.id}`)}
          />
        )}
        {this.state.permission && this.state.permission.delete && (
          <Button
            style={{ marginLeft: 5 }}
            className="p-button-sm p-button-danger"
            icon="pi pi-trash"
            title={this.props.language["delete"] || "l_delete"}
            onClick={() =>
              this.handlerDeleteDialog(true, rowData.id, rowData.status)
            }
          />
        )}
        {this.state.permission && this.state.permission.edit && (
          <Button
            style={{ marginLeft: 5 }}
            className="p-button-sm p-button-success"
            icon="pi pi-replay"
            tooltip={
              this.props.language["reset_password"] || "l_reset_password"
            }
            onClick={() => this.handlerResetPassDialog(true, rowData.id)}
          />
        )}
      </div>
    );
  }
  actionStatusTemplate(rowData) {
    return (
      <label>
        {rowData.status === 1 ? (
          <IoCheckmarkCircleSharp color="green" size={25} />
        ) : (
          <IoCheckmarkCircleOutline size={25} />
        )}
      </label>
    );
  }
  actionUserName(rowData) {
    return <strong>{rowData.userName}</strong>;
  }
  actionWorkingDate(rowData) {
    return (
      <label>
        {rowData.workingDate
          ? new moment(rowData.workingDate).format("DD-MM-YYYY")
          : null}
      </label>
    );
  }

  actionResignedDate(rowData) {
    return (
      <label>
        {rowData.resignedDate
          ? new moment(rowData.resignedDate).format("DD-MM-YYYY")
          : null}
      </label>
    );
  }
  actionStartDate(rowData) {
    return (
      <label>
        {rowData.startDate
          ? new moment(rowData.startDate).format("DD-MM-YYYY")
          : null}
      </label>
    );
  }
  render() {
    let leftSearch = [],
      rightSearch = [],
      dialogConfirm = null;
    if (this.state.permission) {
      if (this.state.permission.view === true) {
        leftSearch.push(
          <Button
            style={{ marginRight: 10 }}
            label={this.props.language["search"] || "l_search"}
            icon="pi pi-search"
            onClick={this.LoadList}
          ></Button>
        );
      }
      if (
        this.state.permission.export === true &&
        this.state.permission.view === true
      ) {
        leftSearch.push(
          <Button
            style={{ marginRight: 10 }}
            label={this.props.language["export"] || "l_export"}
            icon="pi pi-download"
            className="p-button-danger"
            onClick={this.OnExport}
          ></Button>
        );
      }
      if (
        this.state.permission.import === true &&
        this.state.permission.view === true
      ) {
        leftSearch.push(
          <Button
            style={{ marginRight: 10 }}
            label={this.props.language["template"] || "l_template"}
            icon="pi pi-download"
            className="p-button-primary"
            onClick={this.OnCreateTemplate}
          ></Button>
        );
      }
      // if (this.state.permission.import === true && this.state.permission.view === true) {
      //     leftSearch.push(<Button style={{ marginRight: 10 }} label={this.props.language["imei"] || "l_imei"} icon="pi pi-info" className="p-button-help" onClick={() => window.open('/employeeimei')}></Button>);
      // }
      if (
        this.state.permission.create === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <Link
            className="p-button-success"
            to={{ pathname: `/CreateEmployee/`, EmpObj: null, isInsert: true }}
            style={{ textDecoration: "none" }}
          >
            <Button
              icon="pi pi-user-edit"
              style={{ marginRight: "10px" }}
              label={this.props.language["insert"] || "l_insert"}
              className="p-button-danger"
            ></Button>
          </Link>
        );
      }
      if (this.state.linkTemplate)
        rightSearch.push(
          <Button
            style={{ marginLeft: "10px" }}
            label={this.props.language["download"] || "l_download"}
            className="p-button-success"
            onClick={(e) => download(this.state.linkTemplate)}
          />
        );
      //rightSearch.push(<a href={this.state.linkTemplate} download>{this.state.linkTemplate ? "download" : ""}</a>);
      if (
        this.state.permission.import === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <FileUpload
            ref={this.fileUpload}
            chooseLabel={this.props.language["import"] || "l_import"}
            mode="basic"
            className="p-button-primary"
            customUpload
            uploadHandler={this.handlerUploadClick}
          ></FileUpload>
        );
      }
      if (
        this.state.permission.import === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
              this.fileUpload.current.fileInput = { value: "" };
              this.fileUpload.current.clear();
            }}
          />
        );
      }
      dialogConfirm = (
        <Dialog
          header="Confirmation"
          modal
          style={{ width: "350px" }}
          visible={
            this.state.deleteDialog
              ? this.state.deleteDialog
              : this.state.resetPasswordDialog
          }
          footer={
            this.state.deleteDialog
              ? this.footerDeleteDialog()
              : this.footerResetPasswordDialog()
          }
          onHide={() =>
            this.state.deleteDialog
              ? this.handlerDeleteDialog(false)
              : this.handlerResetPassDialog(false)
          }
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            {this.state.deleteDialog ? (
              <span>
                {this.props.language["are_you_sure_to_delete"] ||
                  "l_are_you_sure_to_delete"}
                ?
              </span>
            ) : (
              <span>
                {this.props.language["are_you_sure_reset_password"] ||
                  "l_are_you_sure_reset_password"}
                ?
              </span>
            )}
          </div>
        </Dialog>
      );
    }
    return this.state.permission.view ? (
      <div>
        <Accordion
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <AccordionTab header={this.props.language["search"] || "search"}>
            <div className="p-fluid p-grid p-formgrid">
              <AccountDropDownList
                id="accId"
                className="p-field p-col-12 p-md-3"
                onChange={this.handleChangeDropdown}
                filter={true}
                showClear={true}
                value={this.state.accId}
              />
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["position"] || "l_position"}</label>
                <EmployeeTypeDropDownList
                  id="typeId"
                  type=""
                  value={this.state.typeId}
                  onChange={this.handleChangeDropdown}
                  accId={this.state.accId}
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["sup"] || "l_sup"}</label>
                <EmployeeDropDownList
                  mode="single"
                  type="SUP"
                  typeId={0}
                  id="supId"
                  parentId={null}
                  value={this.state.supId}
                  onChange={this.handleChangeDropdown}
                  accId={this.state.accId}
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["employee_code"] || "employee_code"}
                </label>
                <InputText
                  placeholder="Mã nhân viên"
                  className="w-100"
                  id="employeeCode"
                  value={this.state.employeeCode || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["employee.name"] || "employee.name"}
                </label>
                <InputText
                  placeholder="Tên nhân viên"
                  className="w-100"
                  id="employeeName"
                  value={this.state.employeeName || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["username"] || "username"}</label>
                <InputText
                  placeholder="Tên đăng nhập"
                  className="w-100"
                  id="userName"
                  value={this.state.userName || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["phone"] || "phone"}</label>
                <InputText
                  placeholder="Số điện thoại"
                  className="w-100"
                  id="phone"
                  value={this.state.phone || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["id_card"] || "l_id_card"}</label>
                <InputText
                  placeholder="CMND/CCCD"
                  className="w-100"
                  id="idCard"
                  value={this.state.idCard || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["status"] || "l_status"}</label>
                <div>
                  <Dropdown
                    value={this.state.status}
                    id="status"
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      this.handleChangeDropdown(e.target.id, e.value)
                    }
                    optionLabel="name"
                    filter
                    showClear
                    filterBy="name"
                    options={this.statusOption}
                    placeholder={
                      this.props.language["select_status"] || "l_select_status"
                    }
                  />
                </div>
              </div>
            </div>
            <Toolbar left={leftSearch} right={rightSearch} />
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>

        <Card style={{ marginTop: "10px" }}>
          <Toast ref={(el) => (this.toast = el)} />
          <DataTable
            value={this.state.employeeList}
            paginator
            rows={20}
            rowsPerPageOptions={[20, 50, 100]}
            paginatorPosition={"both"}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            style={{ fontSize: "13px", marginTop: "10px" }}
            dataKey="employeeCode"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          >
            <Column
              field="employeeCode"
              filter={true}
              header={this.props.language["employee_code"] || "l_employee_code"}
              style={{ width: "8%" }}
            />
            <Column
              field="fullName"
              filterMatchMode="contains"
              filter={true}
              header={this.props.language["employee.name"] || "l_employee.name"}
              style={{ width: "10%" }}
            />
            <Column
              field="mobile"
              header={this.props.language["employeephone"] || "l_employeephone"}
              filter={true}
              style={{ width: "10%" }}
            />
            <Column
              field="identityCardNumber"
              header={
                this.props.language["IdentityCardNumber"] ||
                "l_IdentityCardNumber"
              }
              filter={true}
              style={{ width: "10%" }}
            />
            <Column
              field="position"
              header={
                this.props.language["employee.position"] ||
                "l_employee.position"
              }
              filter={true}
              style={{ width: "8%" }}
            />
            <Column
              field="parentName"
              filterMatchMode="contains"
              header={this.props.language["manager"] || "l_manager"}
              filter={true}
              style={{ width: "10%" }}
            />
            <Column
              field="username"
              filterMatchMode="contains"
              header={this.props.language["username"] || "l_username"}
              filter={true}
              style={{ width: "9%" }}
            />
            <Column
              field="workingStatus"
              header={
                this.props.language["employee.workingstatus"] ||
                "l_employee.workingstatus"
              }
              filter
              style={{ width: "9%" }}
            />
            <Column
              field="workingDate"
              body={this.actionWorkingDate}
              header={
                this.props.language["employee.workingdate"] ||
                "l_employee.workingdate"
              }
              filter
              style={{ width: "10%" }}
            />
            <Column
              body={this.actionResignedDate}
              header={
                this.props.language["employee.resigneddate"] ||
                "l_employee.resigneddate"
              }
              filter
              style={{ width: "10%" }}
            />
            <Column
              body={this.actionStartDate}
              header={
                this.props.language["employee.startdateftr"] ||
                "l_employee.startdateftr"
              }
              filter
              style={{ width: "9%" }}
            />
            <Column
              body={this.actionStatusTemplate}
              header={this.props.language["status"] || "l_status"}
              filter={true}
              style={{ width: "6%" }}
            />
            <Column
              body={this.actionTemplate}
              header={this.props.language["tools"] || "l_tools"}
              style={{ width: "15%" }}
            />
          </DataTable>
          {dialogConfirm}
        </Card>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    lists: state.employees.lists,
    loading: state.employees.loading,
    errors: state.employees.errors,
    forceReload: state.employees.forceReload,
    language: state.languageList.language,
    updateStatus: state.employees.updateStatus,
    resetPassword: state.employees.resetPassword,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList);
