import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
// import { ConfirmDialog } from 'primereact/confirmdialog';
import { Calendar } from "primereact/calendar";
import { ToggleButton } from "primereact/togglebutton";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Accordion, AccordionTab } from "primereact/accordion";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import WorkingPlanCell from "../WorkingPlan/working-plan-cell";
import WorkingPlanCell_IMV from "../WorkingPlan/working-plan-cell-imv";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { CalendarCreateAction } from "../../store/CalendarController";
import moment from "moment";
import { Link, Switch } from "react-router-dom";
import {
  download,
  getToken,
  URL,
  HelpPermission,
  getLogin,
  getAccountId,
} from "../../Utils/Helpler";
import { FileUpload } from "primereact/fileupload";
import Page403 from "../ErrorRoute/page403";
import { Dialog } from "primereact/dialog";
import "../Shop/customcss.css";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

const user = JSON.parse(localStorage.getItem("USER"));
const lstView = [
  { value: "Month", name: "Month" },
  { value: "Week", name: "Week" },
];
const lstStatus = [
  { value: 3, name: "Đề xuất" },
  { value: 2, name: "Xem xét" },
  { value: 1, name: "Đã duyệt" },
];
class WorkingPlanResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCell: [],
      activeIndex: 0,
      selectedRow: {},
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      employeeId: [],
      supId: null,
      customerId: null,
      confirmed: null,
      status: [],
      position: null,
      shopCode: null,
      showComponent: false,
      permission: {},
      dataDetails: [],
      handleDialogTemplate: false,
      cycle: null,
      accId: null,
    };
    this.pageId = 1043;
    this.columns = [];
    this.handleGetColumn = this.handleGetColumn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.LoadList = this.LoadList.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.clear = this.clear.bind(this);
    this.columnTemplate = this.columnTemplate.bind(this);
    this.showCellDetail = this.showCellDetail.bind(this);
    this.onHideCellDetail = this.onHideCellDetail.bind(this);
    this.Confirm = this.Confirm.bind(this);
    this._child = React.createRef();
    this.fileUpload = React.createRef();
  }

  onHideCellDetail(data) {
    this.setState({ showComponent: false });
    let dataDetails = this.state.dataDetails;
    if (data !== undefined && data !== null) {
      if (data.type === "ChangeShift" || data.type === "ChangeDate") {
        dataDetails.forEach((element) => {
          if (data.workDate !== "shiftName") {
            if (
              element.employeeId === data.employeeId &&
              element.shopId === data.shopId &&
              element.shiftCode === data.shiftDefault
            ) {
              element[data.workDate] = data.shiftCode;
            }
          } else if (data.type === "ChangeShift") {
            if (
              element.employeeId === data.employeeId &&
              element.shopId === data.shopId &&
              element.shiftCode === data.shiftOld
            ) {
              const shift = this.props.shiftLists.find(
                (item) => item.shiftCode === data.shiftCode
              );
              if (shift !== undefined && shift !== null) {
                element.shiftCode = shift.shiftCode;
                element.shiftName = shift.shiftName;
                element.value = shift.value;
              }
            }
          }
        });
      }
    }
    this.setState({ dataDetails: dataDetails });
  }
  showCellDetail(rowData, workDate) {
    if (workDate !== "value") {
      let data = {
        year: rowData.year,
        week: rowData.week,
        shopId: rowData.shopId,
        employeeId: rowData.employeeId,
        workDate: workDate,
        position: rowData.typeName,
        typeId: rowData.typeId,
        positionGroup: rowData.positionGroup,
        employeeName: rowData.employeeCode + " - " + rowData.fullName,
        shopName: rowData.shopCode + " - " + rowData.shopName,
        shiftCode: rowData[workDate],
        shiftDefault: rowData.shiftCode,
      };
      this.setState({ showComponent: true, dataCell: data });
    }
  }
  Confirm() {
    this.clear();
    this.showLoading();
    this.props.WorkingPlanController.Confirm(this.state.dataDetails).then(
      () => {
        if (this.props.wpConfirm.result === 1) {
          this.showSuccess("Confirm is successfull");
          this.LoadList();
        } else return this.showError("Confirm is fail");
      }
    );
    this.clearLD();
  }
  clearLD() {
    this.toastLD.clear();
  }
  showLoading() {
    this.toastLD.show({
      severity: "warn",
      sticky: true,
      content: (
        <div className="p-flex p-flex-column" style={{ flex: "1" }}>
          <div className="p-text-center">
            <i className="pi pi-lock" style={{ fontSize: "3rem" }}></i>
            <h4>
              {this.props.language["confirming"] || "l_confirming"}.........
            </h4>
          </div>
          <div className="p-grid p-fluid">
            <ProgressSpinner style={{ height: "50px", width: "100%" }} />
          </div>
        </div>
      ),
    });
  }
  handleChange(id, value) {
    this.setState({ [id]: value });
  }
  handleChangeForm(e) {
    if (e.target.id === "status") this.setState({ [e.target.id]: e.value });
    else this.setState({ [e.target.id]: e.target.value });
  }
  getFilter() {
    //  if (this.state.week === undefined) return this.showError("Please choose a week");
    // const infoCycle = JSON.parse(this.state.cycle)[0];
    // const fromdate = infoCycle.fromDate;
    // const todate = infoCycle.toDate;
    // let fromdate = '', todate = '';
    // const calendar = this.props.calendars.filter(item => item.year === this.state.year && item.weekByYear === this.state.week);
    // if (calendar !== null && calendar !== undefined) {
    //     fromdate = moment(calendar[0].date).format("YYYY-MM-DD");
    //     todate = moment(calendar[calendar.length - 1].date).format("YYYY-MM-DD");
    // }

    const employees = this.state.employeeId || [];
    let lstEmp = null,
      lstStatus = null;
    if (employees.length > 0) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }
    if (this.state.status.length > 0) {
      lstStatus = "";
      this.state.status.forEach((element) => {
        lstStatus = lstStatus + element + ",";
      });
    }
    let dates = this.state.dates;
    this.setState({ loading: true });
    var data = {
      fromDate: parseInt(moment(dates[0]).format("YYYYMMDD"), 0),
      toDate: parseInt(moment(dates[1]).format("YYYYMMDD"), 0),
      fromdate: moment(dates[0]).format("YYYY-MM-DD"),
      todate:
        dates[1] === undefined || dates[1] === null
          ? ""
          : moment(dates[1]).format("YYYY-MM-DD"),
      customerId: this.state.customerId === "" ? null : this.state.customerId,
      position: this.state.position === "" ? null : this.state.position,
      supId: this.state.supId === "" ? null : this.state.supId,
      employeeId: lstEmp,
      shopCode: this.state.shopCode === "" ? null : this.state.shopCode,
      status: lstStatus,
    };
    return data;
  }
  LoadList() {
    const data = this.getFilter();
    this.handleGetColumn();
    this.props.WorkingPlanController.GetList(data, this.state.accId).then(
      () => {
        this.setState({ loading: false, dataDetails: this.props.workingPlans });
        if (this.props.workingPlans.length > 0)
          this.showSuccess(
            "Result are " + this.props.workingPlans.length + " rows"
          );
        else this.showError("nodata");
      }
    );
  }
  handleExport() {
    const data = this.getFilter();
    // if ((data.position === "" || data.position === null) && getLogin().accountName !== 'MARICO MT') {
    //     this.showError(`${this.props.language["please_select_a_position"] || "l_please_select_a_position"}`);
    //     this.setState({ loading: false });
    //     return;
    // }
    this.handleGetColumn();
    this.props.WorkingPlanController.ExportLLV(data, this.state.accId).then(
      () => {
        this.setState({ loading: false });
        if (this.props.urlFile.status === 1) {
          download(this.props.urlFile.fileUrl);
          this.showSuccess("Successful");
        } else {
          this.showError(this.props.urlFile.message);
        }
      }
    );
  }

  clear() {
    this.toastBC.clear();
  }
  showConfirm() {
    this.toastBC.show({
      severity: "warn",
      sticky: true,
      content: (
        <div className="p-flex p-flex-column" style={{ flex: "1" }}>
          <div className="p-text-center">
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "3rem" }}
            ></i>
            <p>
              {this.props.language["l_are_you_sure_to_confirm"] ||
                "l_are_you_sure_to_confirm"}
            </p>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-6">
              <Button
                type="button"
                label={this.props.language["yes"] || "l_yes"}
                className="p-button-success"
                onClick={this.Confirm}
              />
            </div>
            <div className="p-col-6">
              <Button
                type="button"
                label={this.props.language["no"] || "l_no"}
                className="p-button-secondary"
                onClick={this.clear}
              />
            </div>
          </div>
        </div>
      ),
    });
  }
  handleGetColumn() {
    this.columns = [];
    this.columns.push({
      field: "employeeId",
      header: `${this.props.language["employee_code"] || "employee_code"}`,
      name: "ShopId",
      width: "200px",
    });
    this.columns.push({
      field: "shopId",
      header: `${
        this.props.language["storelist.shopcode"] || "storelist.shopcode"
      }`,
      name: "ShopId",
      width: "250px",
    });
    const fromdate = new Date(this.state.dates[0]);
    const todate = new Date(this.state.dates[1]);
    for (let day = fromdate; day <= todate; day.setDate(day.getDate() + 1)) {
      this.columns.push({
        field: moment(day).format("YYYY-MM-DD").toString(),
        header: day.getDate().toString(),
        dayName: moment(day).format("ddd").toString(),
        month: moment(day).format("MMMM").toString(),
        width: "50px",
      });
    }
  }
  renderHeader() {
    let days = 0,
      headerMonth = [],
      headerDayName = [],
      headerDay = [],
      result = [],
      background = "#f8f8f8",
      fontColor = "#000000";
    if (this.state.view === "Week") days = 7;
    this.columns.forEach((item) => {
      if (item.month === undefined) {
        headerMonth.push(
          <Column
            key={item.header}
            header={item.header}
            style={{
              textAlign: "center",
              fontSize: 16,
              backgroundColor: "#191919",
            }}
            rowSpan={3}
          />
        );
      } else {
        if (item.dayName === "Sun") {
          background = "#7d2f0d";
          fontColor = "#ffffff";
        } else {
          background = "#f8f8f8";
          fontColor = "#000000";
        }
        if (item.month === "Status") {
          background = "#00a3f6";
          fontColor = "#ffffff";
        }
        headerDayName.push(
          <Column
            key={item.dayName}
            header={item.dayName}
            style={{
              textAlign: "center",
              backgroundColor: background,
              color: fontColor,
              fontWeight: 700,
            }}
            rowSpan={item.month === "Status" ? 2 : 1}
          />
        );
        if (item.month !== "Status")
          headerDay.push(
            <Column
              key={item.header}
              header={item.header}
              style={{
                textAlign: "center",
                backgroundColor: background,
                color: fontColor,
                fontWeight: 700,
              }}
            />
          );
      }
    });
    if (this.columns.length > 0) {
      if (
        this.columns[2].month === this.columns[this.columns.length - 1].month
      ) {
        result = this.columns.filter(
          (element) => element.month === this.columns[2].month
        );
        headerMonth.push(
          <Column
            key={this.columns[2].month}
            header={this.columns[2].month}
            style={{ textAlign: "center", backgroundColor: "#606060" }}
            colSpan={result.length}
          />
        );
      } else {
        result = this.columns.filter(
          (element) => element.month === this.columns[2].month
        );
        headerMonth.push(
          <Column
            key={this.columns[2].month}
            header={this.columns[2].month}
            style={{ textAlign: "center", backgroundColor: "#606060" }}
            colSpan={result.length}
          />
        );
        result = this.columns.filter(
          (element) =>
            element.month === this.columns[this.columns.length - 1].month
        );
        headerMonth.push(
          <Column
            key={this.columns[this.columns.length - 1].month}
            header={this.columns[this.columns.length - 1].month}
            style={{ textAlign: "center", backgroundColor: "#191919" }}
            colSpan={result.length}
          />
        );
      }
    }

    return (
      <ColumnGroup>
        <div>{headerMonth}</div>
        <div>{headerDayName}</div>
        <div>{headerDay}</div>
      </ColumnGroup>
    );
  }
  columnTemplate(rowData, cell) {
    switch (cell.field) {
      case "shopId":
        return (
          <div>
            <strong>{rowData.shopCode}</strong>
            <br></br>
            <label>{rowData.shopName}</label>
            {/* <i>{rowData.address}</i> */}
          </div>
        );
      case "employeeId":
        return (
          <div>
            <strong>{rowData.employeeCode}</strong>
            <br></br>
            <label>
              {rowData.fullName} ({rowData.typeName}){" "}
            </label>
          </div>
        );
      default:
        let shiftType = rowData[cell.field];
        if (shiftType !== null && shiftType !== undefined) {
          let key = shiftType.toString().split("_");
          if (key.length === 3) {
            let shiftCode = key[0],
              confirm = parseInt(key[1]),
              status = parseInt(key[2]);

            switch (confirm) {
              case 1:
                return (
                  <div
                    onClick={(e) => this.showCellDetail(rowData, cell.field)}
                    style={{
                      backgroundColor: "#03c0ff",
                      margin: "-13px",
                      padding: "17px 0px",
                    }}
                  >
                    <strong>{shiftCode}</strong>
                  </div>
                );
              case 2:
                return (
                  <div
                    onClick={(e) => this.showCellDetail(rowData, cell.field)}
                    style={{
                      backgroundColor: "#ec123e",
                      margin: "-13px",
                      padding: "17px 0px",
                    }}
                  >
                    <strong>{shiftCode}</strong>
                  </div>
                );
              case 3:
                return (
                  <div
                    onClick={(e) => this.showCellDetail(rowData, cell.field)}
                    style={{
                      backgroundColor: "#fa9a00",
                      margin: "-13px",
                      padding: "17px 0px",
                    }}
                  >
                    <strong>{shiftCode}</strong>
                  </div>
                );
              default:
                return (
                  <div
                    onClick={(e) => this.showCellDetail(rowData, cell.field)}
                    style={{ margin: "-13px", padding: "17px 0px" }}
                  >
                    <strong>{shiftCode}</strong>
                  </div>
                );
            }
          } else {
            return (
              <div
                onClick={(e) => this.showCellDetail(rowData, cell.field)}
                style={{ margin: "-13px", padding: "17px 0px" }}
              >
                {shiftType}
              </div>
            );
          }
        } else {
          return (
            <div
              onClick={(e) => this.showCellDetail(rowData, cell.field)}
              style={{ margin: "-13px", padding: "17px 0px" }}
            >
              {shiftType}
            </div>
          );
        }
    }
  }
  renderTableResult() {
    if (this.state.loading) {
      return (
        <div key="divLoading">
          <Toast ref={(el) => (this.toast = el)} />
          <ProgressSpinner style={{ height: "50px", width: "100%" }} />
        </div>
      );
    }
    const dynamicColumns = this.columns.map((col, i) => {
      return (
        <Column
          body={this.columnTemplate}
          style={{ width: col.width, textAlign: "center" }}
          key={col.field}
          field={col.field}
        />
      );
    });
    return (
      <div key="divTable" className="p-col-12">
        <DataTable
          value={this.state.dataDetails}
          paginator={true}
          paginatorPosition={"both"}
          rows={10}
          rowHover
          headerColumnGroup={this.renderHeader()}
          rowsPerPageOptions={[10, 50, 100, 200]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          scrollable={true}
          scrollHeight="550px"
          className="p-datatable-gridlines"
          style={{ fontSize: "13px", maxWidth: "100%" }}
          dataKey="rowNum"
        >
          {dynamicColumns}
        </DataTable>
      </div>
    );
  }

  renderFooterConfirm = () => {
    return (
      <div>
        <Button
          label={this.props.language["cancel"] || "l_cancel"}
          className="p-button-info"
          icon="pi pi-times"
          onClick={() => this.setState({ handleDialogTemplate: false })}
        />
        <Button
          label={this.props.language["download"] || "l_download"}
          className="p-button-success"
          icon="pi pi-check"
          onClick={() => this.handleTemplate()}
        />
      </div>
    );
  };
  handleTemplate = () => {
    const state = this.state;
    this.setState({ loading: true, handleDialogTemplate: false });
    if (!state.fromToDate) {
      return this.showError("Xin chọn ngày xuất file");
    }
    const employees = state.employeeId || [];
    let lstEmp = null,
      lstStatus = null;
    if (employees.length > 0) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }
    if (this.state.status.length > 0) {
      lstStatus = "";
      this.state.status.forEach((element) => {
        lstStatus = lstStatus + element + ",";
      });
    }
    const data = {
      fromDate: +moment(state.fromToDate[0]).format("YYYYMMDD"),
      toDate: state.fromToDate[1]
        ? +moment(state.fromToDate[1]).format("YYYYMMDD")
        : null,
      fromdate: moment(state.fromToDate[0]).format("YYYY-MM-DD"),
      todate: state.fromToDate[1]
        ? moment(state.fromToDate[1]).format("YYYY-MM-DD")
        : null,
      position: state.position,
      customerId: state.customerId === "" ? null : state.customerId,
      supId: state.supId === "" ? null : state.supId,
      employeeId: lstEmp,
      shopCode: state.shopCode === "" ? null : state.shopCode,
      status: lstStatus,
    };
    this.props.WorkingPlanController.TemplateLLV(data, this.state.accId).then(
      () => {
        const result = this.props.templateFile;
        if (result.status === 1) {
          download(result.fileUrl);
          this.showSuccess(result?.message);
        } else this.showError(result?.message);
      }
    );
    this.setState({ loading: false });
  };
  handleImport = (event) => {
    this.setState({ loading: true });
    this.props.WorkingPlanController.ImportLLV(
      event.files[0],
      this.state.accId
    ).then(() => {
      const response = this.props.importLLV;
      if (response.status === 1) {
        this.showSuccess(response?.message);
      } else {
        this.showError(response?.message);
      }
    });

    this.fileUpload.current.fileInput = { value: "" };
    this.fileUpload.current.clear();
    this.setState({ loading: false });
  };
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    let data = {
      view: true,
      edit: true,
      create: true,
      delete: true,
      import: true,
      export: true,
    };
    this.setState({ permission: data });
  }

  showError = (value) => {
    this.toast.clear();
    this.toast.show({
      life: 15000,
      severity: "error",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  };
  showSuccess = (value) => {
    this.toast.clear();
    this.toast.show({
      life: 15000,
      severity: "success",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  };
  render() {
    let result = [],
      rightSearch = [],
      changeShift = [],
      beLate = [],
      confirmDialog = null;
    if (this.state.permission.view === true) {
      changeShift.push(
        <Button
          style={{ backgroundColor: "#fa9a00", width: 50, height: 30 }}
          tooltip={
            this.props.language[
              "other_employees_wish_to_change_shift_but_have_not_been_approved"
            ] ||
            "l_other_employees_wish_to_change_shift_but_have_not_been_approved"
          }
        />
      );
      changeShift.push(
        `${this.props.language["change_shift_work"] || "l_change_shift_work"}`
      );

      changeShift.push(
        <Button
          style={{
            backgroundColor: "#03c0ff",
            width: 50,
            height: 30,
            marginLeft: 10,
          }}
          tooltip={
            this.props.language["salessup_confirmed"] || "l_salessup_confirmed"
          }
        />
      );
      changeShift.push(
        `${this.props.language["salessup_confirmed"] || "l_salessup_confirmed"}`
      );

      changeShift.push(
        <Button
          style={{
            backgroundColor: "#ec123e",
            width: 50,
            height: 30,
            marginLeft: 10,
          }}
          tooltip={
            this.props.language["salessup_reject"] || "l_salessup_reject"
          }
        />
      );
      changeShift.push(
        `${this.props.language["salessup_reject"] || "l_salessup_reject"}`
      );
    }
    if (
      this.props.workingPlans.length > 0 &&
      this.state.permission.view === true
    ) {
      result.push(<div className="p-col-12">{changeShift}</div>);
      result.push(this.renderTableResult());
    }
    // if (this.props.workingPlans.length > 0 && this.state.permission.edit === true) {
    //     rightSearch.push(<Button
    //         label={this.props.language["confirm"] || "l_confirm"}
    //         icon="pi pi-check"
    //         style={{ marginRight: '.25em', width: 'auto' }}
    //         onClick={() => this.showConfirm()} />);
    // }
    if (this.state.permission.export)
      rightSearch.push(
        <Button
          label={this.props.language["template"] || "l_template"}
          icon="pi pi-check"
          className="p-button-warning"
          style={{ marginRight: ".25em", width: "auto" }}
          onClick={() => {
            // if (this.state.position) {
            this.setState({
              handleDialogTemplate: true,
              fromToDate: [
                new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                new Date(),
              ],
            });
          }}
        />
      );
    if (this.state.permission.import)
      rightSearch.push(
        <FileUpload
          ref={this.fileUpload}
          name="myfile[]"
          mode="basic"
          chooseLabel={this.props.language["import"] || "l_import"}
          accept=".xlsx,.xls"
          customUpload={true}
          multiple={false}
          uploadHandler={(e) => this.handleImport(e)}
        />
      );
    if (this.state.permission.import)
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
    if (this.state.handleDialogTemplate) {
      confirmDialog = (
        <Dialog
          header={this.props.language["template"] || "l_template"}
          visible={this.state.handleDialogTemplate}
          style={{ width: "20vw" }}
          footer={this.renderFooterConfirm()}
          onHide={() => this.setState({ handleDialogTemplate: false })}
        >
          <div className="p-grid p-align-start vertical-container">
            <div className="p-field p-col-12 p-md-12 p-sm-6">
              <label>
                {this.props.language["from_to_date"] || "l_from_to_date"}
              </label>
              <Calendar
                showIcon
                style={{ width: "100%" }}
                id="fromToDate"
                selectionMode="range"
                dateFormat="yy-mm-dd"
                value={this.state.fromToDate}
                onChange={(e) => this.handleChangeForm(e)}
              ></Calendar>
            </div>
          </div>
        </Dialog>
      );
    }
    return this.state.permission.view ? (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <Toast ref={(el) => (this.toastLD = el)} position="top-center" />
        <Toast ref={(el) => (this.toastBC = el)} position="top-center" />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div key="divSearch">
              <div className="p-grid">
                <AccountDropDownList
                  id="accId"
                  className="p-field p-col-12 p-md-3"
                  onChange={this.handleChange}
                  filter={true}
                  showClear={true}
                  value={this.state.accId}
                />
                <div className="p-field p-col-12 p-md-3 p-sm-6">
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
                    inputStyle={{ width: "91.5%", visible: false }}
                    style={{ width: "100%" }}
                    showIcon
                  />
                </div>
                {/* <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["year"] || "l_year"}</label>
                                        <YearDropDownList
                                            id="year"
                                            onChange={this.handleChange}
                                            value={this.state.year} />
                                        {/* <label>{this.props.language["cycle"] || "Cycle"}</label>
                                        <CycleDropDownList
                                            id="cycle"
                                            value={this.state.cycle}
                                            onChange={this.handleChange}
                                        /> 
                                    </div>
                                    <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["week"] || "l_week"}</label>
                                        <WeekDropDownList
                                            id="week"
                                            year={this.state.year}
                                            onChange={this.handleChange}
                                            value={this.state.week} />
                                    </div> */}
                <div className="p-field p-col-12 p-md-3 p-sm-6">
                  <label>{this.props.language["SUP"] || "Sales Sup"}</label>
                  <EmployeeDropDownList
                    type="SUP-Leader"
                    typeId={0}
                    id="supId"
                    parentId={null}
                    mode="single"
                    onChange={this.handleChange}
                    accId={this.state.accId}
                    value={this.state.supId}
                  />
                </div>
                <div className="p-field p-col-12 p-md-3 p-sm-6">
                  <label>{this.props.language["position"] || "position"}</label>
                  <EmployeeTypeDropDownList
                    id="position"
                    type="PG-SR-Leader-SUP"
                    onChange={this.handleChange}
                    accId={this.state.accId}
                    value={this.state.position}
                  />
                </div>
                <div className="p-field p-col-12 p-md-3 p-sm-6">
                  <label>{this.props.language["employee"] || "employee"}</label>
                  <EmployeeDropDownList
                    typeId={
                      this.state.position === null ? 0 : this.state.position
                    }
                    id="employeeId"
                    parentId={
                      this.state.supId === null ? null : this.state.supId
                    }
                    onChange={this.handleChange}
                    accId={this.state.accId}
                    value={this.state.employeeId}
                    mode="Multi"
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["shopcode"] || "shopcode"}</label>
                  <InputText
                    type="text"
                    style={{ width: "100%" }}
                    placeholder={this.props.language["shopcode"] || "shopcode"}
                    value={this.state.shopCode}
                    onChange={this.handleChangeForm}
                    id="shopCode"
                  />
                </div>
                {/* <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["status"] || "l_status"}</label>
                                        <SelectButton
                                            id="status"
                                            style={{ width: '100%' }}
                                            optionLabel="name"
                                            optionValue="value"
                                            value={this.state.status}
                                            options={lstStatus}
                                            multiple
                                            onChange={this.handleChangeForm}
                                        />
                                    </div> */}
              </div>
              <Toolbar
                left={
                  <div>
                    {this.state.permission !== undefined &&
                    this.state.permission.view === true ? (
                      <Button
                        label={this.props.language["search"] || "search"}
                        icon="pi pi-search"
                        style={{ marginRight: ".25em", width: "auto" }}
                        onClick={this.LoadList}
                      />
                    ) : null}

                    {this.state.permission !== undefined &&
                    this.state.permission.export === true &&
                    this.state.permission.view === true ? (
                      <Button
                        label={
                          this.props.language["menu.export_report"] ||
                          "menu.export_report"
                        }
                        style={{ marginRight: ".25em", width: "auto" }}
                        icon="pi pi-file-excel"
                        className="p-button-danger"
                        onClick={this.handleExport}
                      />
                    ) : null}
                    {this.state.permission !== undefined &&
                    this.state.permission.edit === true &&
                    this.state.permission.view === true ? (
                      <Link
                        to={"/workingPlandaily"}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          label={
                            this.props.language["edit_working_plan"] ||
                            "l_edit_working_plan"
                          }
                          style={{ marginRight: ".25em", width: "auto" }}
                          icon="pi pi-external-link"
                          hidden={false}
                          className="p-button-success"
                        />
                      </Link>
                    ) : null}
                  </div>
                }
                right={rightSearch}
              />
              {this.state.loading ? (
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "5px" }}
                ></ProgressBar>
              ) : null}
            </div>
          </AccordionTab>
        </Accordion>
        {this.state.showComponent &&
        (this.state.accId === 1 || getAccountId() === 1) ? (
          <WorkingPlanCell
            key={this.state.dataCell}
            parentMethod={this.onHideCellDetail}
            accId={this.state.accId}
            permission={this.state.permission}
            dataInput={this.state.dataCell}
          />
        ) : null}
        {this.state.showComponent &&
        this.state.accId !== 1 &&
        getAccountId() !== 1 ? (
          <WorkingPlanCell_IMV
            key={this.state.dataCell}
            parentMethod={this.onHideCellDetail}
            accId={this.state.accId}
            permission={this.state.permission}
            dataInput={this.state.dataCell}
          />
        ) : null}
        <div>
          {result}
          {confirmDialog}
        </div>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    calendars: state.calendars.calendars,
    details: state.workingPlans.details,
    shiftLists: state.workingPlans.shiftLists,
    workingPlans: state.workingPlans.workingPlans,
    wpConfirm: state.workingPlans.wpConfirm,
    urlTemplate: state.workingPlans.urlTemplate,
    urlFile: state.workingPlans.urlFile,
    language: state.languageList.language,
    templateFile: state.workingPlans.templateFile,
    importLLV: state.workingPlans.importLLV,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
    CalendarController: bindActionCreators(CalendarCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkingPlanResult);
