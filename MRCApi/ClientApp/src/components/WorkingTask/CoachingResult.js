import React, { useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { ProgressBar } from "primereact/progressbar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Page403 from "../ErrorRoute/page403";
import {
  HelpPermission,
  getEmployeeId,
  getAccountId,
  download,
} from "../../Utils/Helpler";
import { WorkingTaskCreateAction } from "../../store/WorkingTaskController";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Checkbox } from "primereact/checkbox";
import CoachingResultDetail from "./CoachingResultDetail.js";
import { Link } from "react-router-dom";

class CoachingResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      activeIndex: 0,
      permission: {},
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      loading: false,
    };
    this.pageId = 3162;
  }

  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    this.setState({ permission: permission });
  }

  getFilter = () => {
    const employees = this.state.employee;
    let lstEmp = null;
    if (employees) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }
    const fromdate = this.state.dates?.[0];
    const todate = this.state.dates?.[1];
    const data = {
      fromDate: moment(fromdate).format("YYYYMMDD"),
      toDate:
        todate === undefined || todate === null
          ? moment(fromdate).format("YYYYMMDD")
          : moment(todate).format("YYYYMMDD"),
      fromdate: moment(fromdate).format("YYYY-MM-DD"),
      todate:
        todate === undefined || todate === null
          ? moment(fromdate).format("YYYY-MM-DD")
          : moment(todate).format("YYYY-MM-DD"),
      position: this.state.typeId ? this.state.typeId : null,
      supId: this.state.supId ? this.state.supId : null,
      employeeId: employees ? lstEmp : null,
    };
    return data;
  };

  // componentDidMount() {
  //     this.handleSearch()
  // }

  handleSearch = async () => {
    await this.setState({ datas: [], loading: true, expandedRows: null });
    const data = await this.getFilter();
    await this.props.WorkingTaskController.Coaching_Filter(data);
    const result = await this.props.coaching_Filter;
    if (result.status === 200 || result.status === 1) {
      await this.setState({ datas: result.data });
      this.toast.show({
        severity: "success",
        summary: "Thông báo",
        detail: result.message,
        life: 3000,
      });
    } else {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: result.message,
        life: 5000,
      });
    }
    await this.setState({ loading: false });
  };
  handleExport = async () => {
    await this.setState({ loading: true });
    const data = await this.getFilter();
    await this.props.WorkingTaskController.Coaching_Export(data);
    const result = await this.props.coaching_Export;
    if (result.status === 200 || result.status === 1) {
      download(result.fileUrl);
      this.toast.show({
        severity: "success",
        summary: "Thông báo",
        detail: result.message,
        life: 3000,
      });
    } else {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: result.message,
        life: 5000,
      });
    }
    await this.setState({ loading: false });
  };

  handleChange = async (id, value) => {
    await this.setState({ [id]: value || null });
  };

  templateCheckbox = (check) => {
    return <Checkbox checked={check ? true : false}></Checkbox>;
  };

  rowExpansionTemplate = (rowData) => {
    return <CoachingResultDetail rowData={rowData}></CoachingResultDetail>;
  };

  render() {
    return this.state.permission.view ? (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <AccordionTab header={this.props.language["search"] || "search"}>
            <div className="p-grid">
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>
                  {this.props.language["from_to_date"] || "l_from_to_date"}
                </label>
                <Calendar
                  fluid
                  value={this.state.dates}
                  onChange={(e) => this.setState({ dates: e.value })}
                  dateFormat="yy-mm-dd"
                  inputClassName="p-inputtext"
                  id="dates"
                  selectionMode="range"
                  style={{ width: "100%" }}
                  showIcon
                />
              </div>
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["position"] || "l_position"}</label>
                <EmployeeTypeDropDownList
                  id="typeId"
                  type={"PG-SR-Leader-SUP"}
                  value={this.state.typeId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>
                  {this.props.language["supervisor"] || "l_supervisor"}
                </label>
                <EmployeeDropDownList
                  mode="single"
                  type="SUP-Leader"
                  typeId={0}
                  id="supId"
                  parentId={null}
                  value={this.state.supId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["employee"] || "employee"}</label>
                <EmployeeDropDownList
                  type={"SR-PG-Leader-SUP"}
                  id="employee"
                  typeId={!this.state.typeId ? 0 : this.state.typeId}
                  parentId={!this.state.supId ? 0 : this.state.supId}
                  onChange={this.handleChange}
                  value={this.state.employee}
                  mode="multi"
                />
              </div>
            </div>
            <Toolbar
              left={
                <div>
                  {this.state.permission !== undefined &&
                    this.state.permission.view === true && (
                      <Button
                        key="search"
                        label={this.props.language["search"] || "search"}
                        icon="pi pi-search"
                        style={{ marginRight: ".25em" }}
                        onClick={this.handleSearch}
                      />
                    )}

                  {this.state.permission !== undefined &&
                    this.state.permission.export === true && (
                      <Button
                        label="Export excel"
                        icon="pi pi-file-excel"
                        style={{ marginRight: ".25em" }}
                        className="p-button-success"
                        onClick={this.handleExport}
                      />
                    )}
                </div>
              }
              right={
                <div>
                  {this.state.permission !== undefined &&
                    this.state.permission.view === true && (
                      <Link
                        target="_blank"
                        className="p-button-warning"
                        to={{ pathname: `/coaching-byemployee` }}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          icon="pi pi-window-maximize"
                          style={{ marginRight: "10px" }}
                          label={
                            this.props.language["coaching_byemployee"] ||
                            "l_coaching_byemployee"
                          }
                          className="p-button-warning"
                        ></Button>
                      </Link>
                    )}
                </div>
              }
            />
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>
        <div style={{ margin: "10px" }}>
          <DataTable
            value={this.state.datas}
            resizableColumns
            removableSort
            paginator
            rows={20}
            rowsPerPageOptions={[20, 50, 100]}
            style={{ fontSize: "13px", marginTop: 10 }}
            rowHover
            paginatorPosition={"both"}
            dataKey="rowNum"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            expandedRows={this.state.expandedRows}
            onRowToggle={(e) => {
              this.setState({ expandedRows: e.data });
            }}
            rowExpansionTemplate={this.rowExpansionTemplate}
          >
            <Column expander={true} style={{ width: "3%" }} />
            <Column
              filter
              field="rowNum"
              filterMatchMode="contains"
              header={"No."}
              sortable
              style={{ textAlign: "center", width: "5%" }}
            />
            <Column
              filter
              field="assessorCode"
              filterMatchMode="contains"
              header={this.props.language["assessor_code"] || "assessor_code"}
              sortable
              style={{ textAlign: "center", width: "10%" }}
            />
            <Column
              filter
              field="assessorName"
              filterMatchMode="contains"
              header={this.props.language["assessor_name"] || "assessor_name"}
              sortable
              style={{ textAlign: "center", width: "15%" }}
            />
            <Column
              filter
              field="employeeCode"
              filterMatchMode="contains"
              header={this.props.language["employee_code"] || "employee_code"}
              sortable
              style={{ textAlign: "center", width: "10%" }}
            />
            <Column
              filter
              field="employeeName"
              filterMatchMode="contains"
              header={this.props.language["employee_name"] || "employee_name"}
              sortable
              style={{ textAlign: "center" }}
            />
            <Column
              filter
              field="position"
              filterMatchMode="contains"
              header={this.props.language["position"] || "position"}
              sortable
              style={{ textAlign: "center", width: "10%" }}
            />
            <Column
              filter
              field="reportDate"
              filterMatchMode="contains"
              header={this.props.language["workdate"] || "workdate"}
              sortable
              style={{ textAlign: "center", width: "10%" }}
            />
            <Column
              filter
              field="coaching"
              filterMatchMode="contains"
              header={this.props.language["avg_coaching"] || "avg_coaching"}
              style={{ textAlign: "center", width: "10%" }}
              sortable
            />
            <Column
              filter
              field="market"
              filterMatchMode="contains"
              header={this.props.language["avg_market"] || "avg_market"}
              style={{ textAlign: "center", width: "10%" }}
              sortable
            />
          </DataTable>
        </div>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    coaching_Filter: state.workingTask.coaching_Filter,
    coaching_Detail: state.workingTask.coaching_Detail,
    coaching_Export: state.workingTask.coaching_Export,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    WorkingTaskController: bindActionCreators(
      WorkingTaskCreateAction,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoachingResult);
