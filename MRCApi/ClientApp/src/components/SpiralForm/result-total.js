import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { connect } from "react-redux";
import { CreateActionSpiralForm } from "../../store/SpiralFormController";
import { CreateActionSpiralFormStatistical } from "../../store/SpiralFormStatisticalController.js";
import { bindActionCreators } from "redux";
import { download, HelpPermission } from "../../Utils/Helpler";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import Page403 from "../ErrorRoute/page403";
import { TabView, TabPanel } from "primereact/tabview";
import DataDetail from "./dataDetail";
import ResultList from "./Statistical/result-list.js";

class FormTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: null,
      selected: 0,
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      employeeId: [],
      list: [],
      permission: {},
      formId: "",
      position: "",
      supId: "",
      activeIndex: 0,
    };
    this.pageId = 30;
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.getFilter = this.getFilter.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.LoadList = this.LoadList.bind(this);
    this.showError = this.showError.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.dateTemplate = this.dateTemplate.bind(this);
  }
  showError(value) {
    this.toast.show({
      severity: "error",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  }
  showSuccess(value) {
    this.toast.show({
      severity: "success",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  }
  getFilter() {
    const employees = this.state.employeeId;
    let lstEmp = null;
    if (employees.length > 0) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }

    this.setState({ loading: true, activeIndex: 0 });
    const fromdate = this.state.dates[0];
    const todate = this.state.dates[1];
    var data = {
      fromDate: parseInt(moment(fromdate).format("YYYYMMDD"), 0),
      toDate: parseInt(moment(todate).format("YYYYMMDD"), 0),
      fromdate: moment(fromdate).format("YYYY-MM-DD"),
      todate: moment(todate).format("YYYY-MM-DD"),
      formId: this.state.formId === "" ? null : this.state.formId,
      position: this.state.position === "" ? null : this.state.position,
      supId: this.state.supId === "" ? null : this.state.supId,
      employeeId: lstEmp,
    };
    return data;
  }
  LoadList() {
    const data = this.getFilter();
    this.props.SpiralFormController.GetResultTotal(data).then(() => {
      this.setState({ loading: false });
      this.showSuccess("Successful");
    });

    this.props.SpiralFormStatisticalController.GetList(data).then(() => {
      const result = this.props.statisticalList;
      this.setState({ statisticalList: result });
    });
  }
  handleExport() {
    const data = this.getFilter();
  }
  handleChange(id, value) {
    this.setState({ [id]: value });
  }
  handleChangeForm(e) {
    this.setState({ [e.target.id]: e.target.value });
  }
  rowExpansionTemplate = (rowData) => {
    return (
      <div>
        <DataDetail
          dataInput={rowData}
          employee={this.state.employeeId}
          permission={this.state.permission}
        />
      </div>
    );
  };
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
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  componentDidMount() {
    const data = {
      fromDate: parseInt(moment(this.state.dates[1]).format("YYYYMMDD"), 0),
      title: "",
    };
    this.props.SpiralFormController.GetList(data).then(() => {
      let lst = [];
      if (this.props.list.length > 0) {
        this.props.list.forEach((element) => {
          lst.push({ name: element.title, value: element.id });
        });
      }
      this.setState({ list: lst });
    });
  }
  dateTemplate(rowData) {
    return (
      <div>
        <label>{moment(rowData.workDate).format("YYYY-MM-DD")}</label>
      </div>
    );
  }
  Alert = (messager, typestyle) => {
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: messager,
    });
  };
  handleValid = async () => {
    let check = true;
    if (!this.state.formId) {
      await this.Alert("Should be have texts in Title", "error");
      check = false;
    }
    if (!check) return false;
    else return true;
  };
  export = async () => {
    if (await this.handleValid()) {
      await this.setState({ loading: true });
      const datas = this.getFilter();
      let data = {
        fromDate: datas.fromDate,
        toDate: datas.toDate,
        supId: datas.supId || null,
        employeeId: datas.employeeId || null,
        position: datas.position || null,
        formId: datas.formId || null,
      };
      await this.props.SpiralFormController.ExportDetail(data);
      const result = this.props.exportDetail;
      if (result.status === 1) {
        await download(result.fileUrl);
        await this.Alert(result.message, "success");
        await this.setState({ loading: false });
      } else {
        await this.Alert(result.message, "error");
        await this.setState({ loading: false });
      }
    }
  };
  exportImages = async () => {
    if (await this.handleValid()) {
      await this.setState({ loading: true });
      const datas = this.getFilter();
      let data = {
        fromDate: datas.fromDate,
        toDate: datas.toDate,
        supId: datas.supId || null,
        employeeId: datas.employeeId || null,
        position: datas.position || null,
        formId: datas.formId || null,
      };
      await this.props.SpiralFormController.ExportImages(data);
      const result = this.props.exportImages;
      if (result.status === 1) {
        await download(result.fileUrl);
        await this.Alert(result.message, "success");
        await this.setState({ loading: false });
      } else {
        await this.Alert(result.message, "error");
        await this.setState({ loading: false });
      }
    }
  };
  render() {
    let result = null;
    if (this.props.resultTotals.length > 0) {
      result = (
        <DataTable
          value={this.props.resultTotals}
          paginator
          //paginatorPosition="both"
          rows={50}
          rowsPerPageOptions={[50, 100]}
          style={{ fontSize: "13px" }}
          rowHover
          dataKey="rowNum"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          expandedRows={this.state.expandedRows}
          onRowToggle={(e) => this.onSelectedChange(e.data)}
          rowExpansionTemplate={this.rowExpansionTemplate}
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="rowNum" style={{ width: "60px" }} header="No." />
          <Column
            filter
            field="employeeCode"
            style={{ width: "150px" }}
            header={this.props.language["leader_code"] || "l_leader_code"}
          />
          <Column
            filter
            field="employeeName"
            header={
              this.props.language["employee.fullname"] || "employee.fullname"
            }
            style={{ width: "250px" }}
          />
          <Column
            filter
            field="position"
            style={{ width: "60px", textAlign: "center" }}
            header={this.props.language["position"] || "position"}
          />
          <Column
            filter
            field="title"
            header={this.props.language["title"] || "title"}
          />
          <Column
            filter
            field="workDate"
            body={this.dateTemplate}
            header={this.props.language["workdate"] || "l_workdate"}
            style={{ width: "100px", textAlign: "center" }}
          />
          <Column
            filter
            field="total"
            header={this.props.language["total"] || "total"}
            style={{ width: "60px", textAlign: "center" }}
          />
        </DataTable>
      );
    }
    return this.state.permission.view ? (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        {this.state.permission !== undefined && (
          <Accordion activeIndex={0}>
            <AccordionTab header={this.props.language["search"] || "l_search"}>
              <div key="divSearch">
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
                      id="fromDate"
                      selectionMode="range"
                      inputStyle={{ width: "91.5%", visible: false }}
                      style={{ width: "100%" }}
                      showIcon
                    />
                  </div>
                  <div className="p-col-12 p-md-3 p-sm-6">
                    <label>{this.props.language["title"] || "l_title"}</label>
                    <Dropdown
                      key={this.state.list.value}
                      id="formId"
                      style={{ width: "100%" }}
                      placeholder={
                        this.props.language["select_a_title"] ||
                        "l_select_a_title"
                      }
                      onChange={this.handleChangeForm}
                      optionLabel="name"
                      filter={true}
                      showClear={true}
                      options={this.state.list}
                      value={this.state.formId}
                    />
                  </div>
                  <div className="p-col-12 p-md-3 p-sm-6">
                    <label>
                      {this.props.language["supervisor"] || "l_supervisor"}
                    </label>
                    <EmployeeDropDownList
                      type="SUP-Leader"
                      typeId={0}
                      id="supId"
                      parentId={0}
                      mode="single"
                      onChange={this.handleChange}
                      value={this.state.supId}
                    />
                  </div>
                  <div className="p-col-12 p-md-3 p-sm-6">
                    <label>
                      {this.props.language["position"] || "position"}
                    </label>
                    <EmployeeTypeDropDownList
                      id="position"
                      type="PG-SR-MER"
                      onChange={this.handleChange}
                      value={this.state.position}
                    />
                  </div>
                  <div className="p-col-12 p-md-3 p-sm-6">
                    <label>
                      {this.props.language["employee"] || "employee"}
                    </label>
                    <EmployeeDropDownList
                      type="PG-SR-MER"
                      typeId={
                        this.state.position === null ? 0 : this.state.position
                      }
                      id="employeeId"
                      parentId={
                        this.state.supId === null ? 0 : this.state.supId
                      }
                      onChange={this.handleChange}
                      value={this.state.employeeId}
                      mode={"multi"}
                    />
                  </div>
                </div>
                <Toolbar
                  left={
                    <div>
                      {this.state.permission !== undefined && (
                        <Button
                          label={this.props.language["search"] || "search"}
                          icon="pi pi-search"
                          visible={false}
                          style={
                            this.state.permission.view === true
                              ? { marginRight: ".25em", width: "auto" }
                              : { display: "none" }
                          }
                          onClick={this.LoadList}
                        />
                      )}

                      {this.state.permission &&
                        this.state.permission.export && (
                          <Button
                            label={
                              this.props.language["menu.export_report"] ||
                              "menu.export_report"
                            }
                            icon="pi pi-file-excel"
                            className="p-button-danger"
                            onClick={this.export}
                            style={{ marginRight: ".25em", width: "auto" }}
                          />
                        )}
                      {this.state.permission &&
                        this.state.permission.export && (
                          <Button
                            label={
                              this.props.language["menu.export_images"] ||
                              "menu.export_images"
                            }
                            icon="pi pi-folder"
                            className="p-button-danger"
                            onClick={this.exportImages}
                          />
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
              </div>
            </AccordionTab>
          </Accordion>
        )}

        <TabView
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <TabPanel leftIcon="pi pi-list" header=".  Kết quả chi tiết">
            {result}
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar" header=".  Thống kê">
            <ResultList
              dataInput={this.state}
              result={this.state.statisticalList}
            />
          </TabPanel>
        </TabView>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    list: state.spiralform.list,
    formResult: state.spiralform.formResult,
    resultTotals: state.spiralform.resultTotals,
    tableDetails: state.spiralform.tableDetails,
    exportDetail: state.spiralform.exportDetail,
    exportImages: state.spiralform.exportImages,
    statisticalList: state.spiralFormStatistical.statisticalList,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    SpiralFormStatisticalController: bindActionCreators(
      CreateActionSpiralFormStatistical,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(FormTotal);
