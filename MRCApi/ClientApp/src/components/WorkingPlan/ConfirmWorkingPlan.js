import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { Component } from "react";
import { download, getToken, URL } from "../../Utils/Helpler";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import CalendarMaster from "../Controls/CalendarMaster";
import moment from "moment";
import { connect } from "react-redux";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { bindActionCreators } from "redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatCurrency, HelpPermission } from "../../Utils/Helpler";
import BusinessTripDetail from "./BusinessTripDetail";
import Page403 from "../ErrorRoute/page403";

class ConfirmWorkingPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      expandedRows: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      week: parseInt(moment(new Date()).format("W")),
      permission: {},
    };
    this.pageId = 4075;
    this.Import = this.Import.bind(this);
    this.Export = this.Export.bind(this);
    this._child = React.createRef();
    this.onClickExport = this.onClickExport.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.LoadData = this.LoadData.bind(this);
    this.getWeek = this.getWeek.bind(this);
    this.getDateRangeOfWeek = this.getDateRangeOfWeek.bind(this);
    this.addDays = this.addDays.bind(this);
    this.onSelectedChange = this.onSelectedChange.bind(this);
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
  }

  LoadData() {
    this.setState({
      loading: true,
    });
    if (!this.state.year) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Chưa chọn năm",
        life: 5000,
      });
      return;
    } else {
      if (!this.state.month && !this.state.week) {
        this.toast.show({
          severity: "warn",
          summary: "Thông báo",
          detail: "Vui lòng chọn tháng hoặc tuần",
          life: 5000,
        });
        return;
      }
    }
    let FromDateInt = null,
      ToDateInt = null;
    if (this.state.week) {
      var obj = this.getDateRangeOfWeek(this.state.week, this.state.year);
      FromDateInt = parseInt(moment(new Date(obj.FromDate)).format("YYYYMMDD"));
      ToDateInt = parseInt(moment(new Date(obj.ToDate)).format("YYYYMMDD"));
    } else {
      var FromDate = new Date(this.state.year, this.state.month - 1, 1);
      var FirstDateOfNextMonth = new Date(
        this.state.year,
        FromDate.getMonth() + 1,
        1
      );
      FromDateInt = parseInt(moment(FromDate).format("YYYYMMDD"));
      ToDateInt = parseInt(
        moment(this.addDays(FirstDateOfNextMonth, -1)).format("YYYYMMDD")
      );
    }
    var data = {
      fromDate: FromDateInt,
      toDate: ToDateInt,
      supId: this.state.supId ? this.state.supId : null,
      employeeId: this.state.employeeId ? this.state.employeeId : null,
    };
    this.props.WorkingPlanController.BusinessTripFilter(data).then((result) => {
      if (this.props.filterResult.length > 0) {
        this.toast.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Thành công",
          life: 5000,
        });
      } else
        this.toast.show({
          severity: "info",
          summary: "Thông báo",
          detail: "Không có dữ liệu",
          life: 5000,
        });
      this.setState({
        loading: false,
        FromDateInt: FromDateInt,
        ToDateInt: ToDateInt,
      });
    });
  }

  handleChange(id, value) {
    this.setState({ [id]: value });
  }

  onSelectedChange(rowData) {
    this.setState({ loading: false });
    var selected = rowData;
    var lastselect = this.state.expandedRows;
    if (lastselect != null)
      for (var key in selected) {
        // skip loop if the property is from prototype
        if (!selected.hasOwnProperty(key)) continue;
        // var obj = selected[key];
        for (var prop in lastselect) {
          // skip loop if the property is from prototype
          if (selected.hasOwnProperty(prop)) delete selected[prop];
          //selected[prop]=false;
        }
      }
    this.setState({ expandedRows: selected });
  }

  amountBodyTemplate(rowData) {
    return <label>{formatCurrency(rowData.totalSupport, 0)}</label>;
  }

  getWeek = function (dateInput) {
    var date = new Date(dateInput.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    var week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  getDateRangeOfWeek = function (weekNo, y) {
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    d1 = new Date("" + y + "");
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + 7 * (weekNo - this.getWeek(d1)));
    rangeIsFrom =
      d1.getFullYear() +
      "-" +
      (d1.getMonth() + 1 < 10 ? "0" + (d1.getMonth() + 1) : d1.getMonth() + 1) +
      "-" +
      (d1.getDate() < 10 ? "0" + d1.getDate() : d1.getDate());
    d1.setDate(d1.getDate() + 6);
    rangeIsTo =
      d1.getFullYear() +
      "-" +
      (d1.getMonth() + 1 < 10 ? "0" + (d1.getMonth() + 1) : d1.getMonth() + 1) +
      "-" +
      (d1.getDate() < 10 ? "0" + d1.getDate() : d1.getDate());
    return {
      FromDate: rangeIsFrom,
      ToDate: rangeIsTo,
    };
  };

  addDays = function (date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  };

  rowExpansionTemplate(para) {
    return (
      <BusinessTripDetail
        FromDate={this.state.FromDateInt}
        ToDate={this.state.ToDateInt}
        EmployeeId={para.employeeId}
      />
    );
  }

  Import = async (e) => {
    const url = URL + `WorkingPlan/ImportConfirmWorkingPlan`;
    const formData = new FormData();
    formData.append("fileUpload", e.files[0]);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    };
    try {
      const request = new Request(url, requestOptions);
      const response = await fetch(request);
      const result = await response.json();
      if (result.status === 200) {
        this.toast.show({
          severity: "success",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${
            this.props.language["import_successful"] || "l_import_successful"
          }`,
        });
        this.setState({
          loading: false,
        });
      } else {
        this.toast.show({
          severity: "error",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: result.message,
        });
        this.setState({ loading: false });
      }
      this._child.current.clear();
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
        detail: error,
      });
      this.setState({
        loading: false,
      });
      this._child.current.clear();
    }
  };

  Export = async (Year, Month, SupId, EmployeeId) => {
    const url = URL + `WorkingPlan/ExportBizTrip`;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        Year: Year,
        Month: Month,
        SupId: SupId,
        EmployeeId: EmployeeId,
      },
    };
    try {
      const request = new Request(url, requestOptions);
      const response = await fetch(request);
      const result = await response.json();
      if (result.status === 200) {
        this.toast.show({
          severity: "success",
          summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
          detail: `${this.props.language["success"] || "l_success"}`,
        });
        this.setState({
          loading: false,
          urlExport: result.fileUrl,
        });
      } else {
        if (result.status === 0) {
          this.toast.show({
            severity: "warn",
            summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
            detail: `${this.props.language["data_null"] || "l_data_null"}`,
          });
          this.setState({
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
    }
  };

  onClickExport() {
    var SupId = this.state.supId ? this.state.supId : 0;
    var EmployeeId = this.state.employeeId ? this.state.employeeId : 0;
    var Year = this.state.year;
    var Month = this.state.month;
    this.setState({ loading: true });
    this.Export(Year, Month, SupId, EmployeeId);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  render() {
    let leftSearch = [],
      rightSearch = [];
    let htmlFilter = [];
    if (this.state.permission) {
      if (this.state.permission.view === true) {
        leftSearch.push(
          <Button
            label="Search"
            icon="pi pi-search"
            style={{ marginRight: ".25em" }}
            onClick={this.LoadData}
            key="btnSearch"
          />
        );
      }
      if (
        this.state.permission.export === true &&
        this.state.permission.view === true
      ) {
        leftSearch.push(
          <Button
            label={
              this.props.language["menu.export_report"] || "menu.export_report"
            }
            icon="pi pi-download"
            className="p-button-danger"
            style={{ marginLeft: ".25em" }}
            onClick={this.onClickExport}
            key="btnExport"
          />
        );
        if (this.state.urlExport && this.state.urlExport.length > 10) {
          leftSearch.push(
            <Button
              icon="pi pi-download"
              label={this.props.language["download"] || "l_download"}
              style={{ marginLeft: ".25em", width: "35%" }}
              className="p-button-rounded p-button-primary p-mr-2"
              onClick={() => download(this.state.urlExport)}
              key="btnDownload"
            />
          );
        }
      }
      if (
        this.state.permission.import === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <FileUpload
            key="FileUpload"
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
            style={{ marginLeft: ".25em", width: "50%" }}
            className="p-button-danger"
            onClick={(e) => this._child.current.clear()}
            key="btnCancel"
          />
        );
      }
    }
    return this.state.permission.view ? (
      <Card>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div>
              <div className="p-grid">
                <CalendarMaster
                  key="calendar"
                  year={this.state.year ? this.state.year : 0}
                  month={this.state.month ? this.state.month : 0}
                  week={this.state.week ? this.state.week : 0}
                  useYear={true}
                  useMonth={true}
                  useWeek={true}
                  onChange={this.handleChange}
                />
                <div className="p-col-12 p-md-3 p-sm-6">
                  <label>{this.props.language["supplier"] || "supplier"}</label>
                  <EmployeeDropDownList
                    type="SUP"
                    typeId={0}
                    id="supId"
                    parentId={0}
                    mode="single"
                    onChange={this.handleChange}
                    value={this.state.supId}
                  />
                </div>
                <div className="p-col-12 p-md-3 p-sm-6">
                  <label>{this.props.language["employee"] || "employee"}</label>
                  <EmployeeDropDownList
                    type="PG-SR-MER"
                    typeId={this.state.position ? this.state.position : 0}
                    id="employeeId"
                    mode="single"
                    parentId={this.state.supId ? this.state.supId : 0}
                    onChange={this.handleChange}
                    value={this.state.employeeId}
                  />
                </div>
              </div>
              <Toolbar key="id" left={leftSearch} right={rightSearch}></Toolbar>
              {this.state.loading ? (
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "5px" }}
                ></ProgressBar>
              ) : null}
              <DataTable
                dataKey="rowNum"
                value={this.props.filterResult}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 30, 50]}
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => this.onSelectedChange(e.data)}
                rowExpansionTemplate={this.rowExpansionTemplate}
              >
                <Column expander style={{ width: "3em" }} />
                <Column
                  header="No."
                  headerStyle={{ textAlign: "center", width: 50 }}
                  field="rowNum"
                />
                <Column
                  filter
                  headerStyle={{ textAlign: "center" }}
                  filterMatchMode="contains"
                  header="SUP"
                  field="sup"
                />
                <Column
                  filter
                  headerStyle={{ textAlign: "center" }}
                  filterMatchMode="contains"
                  header="Mã nhân viên"
                  field="employeeCode"
                />
                <Column
                  filter
                  headerStyle={{ textAlign: "center" }}
                  filterMatchMode="contains"
                  header="Tên nhân viên"
                  field="employeeName"
                />
                <Column
                  headerStyle={{ textAlign: "center" }}
                  body={this.amountBodyTemplate}
                  style={{ textAlign: "center" }}
                  header="Tổng tiền hỗ trợ"
                  field="totalSupport"
                />
              </DataTable>
            </div>
          </AccordionTab>
        </Accordion>
      </Card>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    filterResult: state.workingPlans.businessTripFilter,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmWorkingPlan);
