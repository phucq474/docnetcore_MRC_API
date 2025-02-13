import React, { PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Search from "../Controls/Search";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { HelpPermission, getAccountId, download } from "../../Utils/Helpler";
import { ProgressBar } from "primereact/progressbar";
import Page403 from "../ErrorRoute/page403";
import { actionCreatorsDisplayContestResult } from "../../store/DisplayContestResultsController";
import ResultDetail from "./result-detail";
import { Accordion, AccordionTab } from "primereact/accordion";
import ChannelDropDownList from "../Controls/ChannelDropDownList";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import { RegionApp } from "../Controls/RegionMaster";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import moment from "moment";

class DisplayContestResults extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      expandedRows: null,
      selected: 0,
      dataResult: null,
      details: null,
      permission: {},
      listMaster: [],
      storeList: [],
      shopId: null,
      customerId: null,
      employee: [],
      brand: null,
    };
    this.pageId = 3165;
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.shopNameTemplate = this.shopNameTemplate.bind(this);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  async componentDidMount() {
    this.Search();
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  handleChange = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
      [id]: value === null ? "" : value,
    });
    if (id === "employee") {
      let result = [],
        storeList = [];
      if (value !== null && value !== undefined) {
        this.state.listMaster.forEach((element) => {
          if (value.includes(element.employeeId)) {
            result.push(element);
          }
        });
      } else {
        result = this.state.listMaster;
      }
      result.forEach((element) => {
        let index = storeList.findIndex((i) => i.value === element.shopId);
        if (index < 0)
          storeList.push({
            value: element.shopId,
            name: element.shopCode + " - " + element.shopName,
          });
      });
      this.setState({
        storeList: storeList,
      });
    }
  };
  async handleGetData() {
    if (this.state.dates === undefined || this.state.dates === null) {
      await this.fToast(
        `${
          this.props.language["please_select_start_date"] ||
          "l_please_select_start_date"
        }`,
        "error"
      );
      return;
    }
    const fromdate = await this.state.dates[0];
    const todate = await this.state.dates[1];
    if (fromdate === undefined || fromdate === null) {
      await this.fToast(
        `${
          this.props.language["please_select_start_date"] ||
          "l_please_select_start_date"
        }`,
        "error"
      );
      return;
    }
    //
    this.setState({ loading: true });
    const province = await this.state.province;
    let lstProvince = await null;
    if (province) {
      lstProvince = await "";
      await province.forEach((p) => {
        lstProvince += p + ",";
      });
    }
    //sup
    const sup = await this.state.supId;
    let lstSup = await null;
    if (sup) {
      lstSup = await "";
      await sup.forEach((p) => {
        lstSup += p + ",";
      });
    }
    // employee
    const employees = await this.state.employee;
    let lstEmp = await null;
    if (employees) {
      lstEmp = await "";
      if (employees.length > 0) {
        await employees.forEach((element) => {
          lstEmp = lstEmp + element + ",";
        });
      } else {
        lstEmp = lstEmp + employees;
      }
    }

    var data = await {
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
      customerId: !this.state.customerId
        ? null
        : this.state.customerId?.join(","),
      channelId: !this.state.channelId ? null : this.state.channelId,
      area: this.state.area === "" ? null : this.state.area,
      province: lstProvince === "" ? null : lstProvince,
      supId: lstSup === "" ? null : lstSup,
      position: this.state.position === "" ? null : this.state.position,
      employeeId: lstEmp === "" ? null : lstEmp,
      shopId: this.state.shopId === "" ? null : this.state.shopId,
      brand: this.state.brand === "" ? null : this.state.brand,
    };
    return data;
  }
  Search = async () => {
    const data = await this.handleGetData();
    await this.setState({ expandedRows: null });
    await this.props.DisplayContestResultController.GetList(data).then(() => {
      const result = this.props.resultList;
      let storeList = [];
      if (result && result.length > 0) {
        if (this.state.listMaster.length === 0) {
          result.forEach((element) => {
            let index = storeList.findIndex((i) => i.value === element.shopId);
            if (index < 0)
              storeList.push({
                value: element.shopId,
                name: element.shopCode + " - " + element.shopName,
              });
          });
          this.setState({
            storeList: storeList,
            listMaster: result,
          });
        }
        this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
        this.setState({ dataResult: result });
      } else {
        this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error");
        this.setState({ dataResult: null });
      }
    });
    this.setState({ loading: false });
  };
  Export = async () => {
    const data = await this.handleGetData();
    await this.props.DisplayContestResultController.Export(data).then(() => {
      const result = this.props.exported;
      if (result && result.status === 1) {
        download(result.fileUrl);
        this.Alert(result.message);
      } else this.Alert(result.message, "error");
      this.setState({ loading: false });
    });
  };
  ExportPPT = async () => {
    const data = await this.handleGetData();
    await this.props.DisplayContestResultController.ExportPPT(data).then(() => {
      const result = this.props.exportedPPT;
      if (result && result.status === 1) {
        download(result.fileUrl);
        this.Alert(result.message);
      } else this.Alert(result.message, "error");
      this.setState({ loading: false });
    });
  };
  rowExpansionTemplate(rowData) {
    return (
      <ResultDetail
        dataInput={rowData}
        brand={this.state.brand}
        pageId={this.pageId}
      />
    );
  }
  shopNameTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <label>
          <strong>{rowData.shopCode}</strong>
        </label>{" "}
        <br></br>
        <label>{rowData.shopName} </label>
      </div>
    );
  }
  customerTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <label>{rowData.customerName}</label> <br></br>
        <label>{rowData.accountName} </label>
      </div>
    );
  }
  employeeNameTemplate = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <label>
          <strong>{rowData.employeeCode}</strong>
        </label>
        <br></br>
        <label>
          {rowData.employeeName} ({rowData.typeName})
        </label>
      </div>
    );
  };
  qcStatusTemplate = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.status}</strong>
      </div>
    );
  };
  renderToolbar() {
    const { permission } = this.state;
    let leftSearch = [],
      rightSearch = [];
    if (this.props.isVisibleFilter === false);
    else if (permission && permission.view === true) {
      leftSearch.push(
        <Button
          label={this.props.language["search"] || "l_search"}
          icon="pi pi-search"
          style={{ width: "auto", marginRight: ".25em" }}
          onClick={() => this.Search()}
        />
      );
    }
    if (permission?.export) {
      leftSearch.push(
        <Button
          label={this.props.language["export"] || "l_export"}
          icon="pi pi-file-excel"
          style={{ width: "auto", marginRight: ".25em" }}
          className="p-button-success"
          onClick={() => this.Export()}
        />
      );

      leftSearch.push(
        <Button
          label={this.props.language["export_ppt"] || "l_export_ppt"}
          icon="pi pi-file-export"
          style={{ width: "auto", marginRight: ".25em" }}
          className="p-button-warning"
          onClick={() => this.ExportPPT()}
        />
      );
    }

    return <Toolbar left={leftSearch} right={rightSearch} />;
  }
  render() {
    const lstBrand = [
      {
        name: "Xmen",
        value: "Hình trưng bày Xmen",
      },
      {
        name: "Oliv",
        value: "Hình trưng bày Oliv",
      },
      {
        name: "Purite",
        value: "Hình trưng bày Purite",
      },
      {
        name: "Lashe Superfood",
        value: "Hình trưng bày Lashe Superfood",
      },
      {
        name: "Thuận Phát",
        value: "Hình trưng bày Xmen",
      },
    ];
    let result = null;
    result = (
      <DataTable
        value={this.state.dataResult}
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100]}
        style={{ fontSize: "13px", marginTop: "10px" }}
        paginatorPosition={"both"}
        dataKey="rowNum"
        rowHover
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        expandedRows={this.state.expandedRows}
        onRowToggle={(e) => {
          this.setState({ expandedRows: e.data });
        }}
        rowExpansionTemplate={this.rowExpansionTemplate}
      >
        <Column expander={true} style={{ width: "3em" }} />
        <Column filter field="rowNum" style={{ width: "50px" }} header="No." />
        <Column
          filter
          field="provinceNameVN"
          style={{ width: 120 }}
          header={this.props.language["province"] || "l_province"}
        />
        <Column
          filter
          field="channelName"
          style={{ width: 100 }}
          header={this.props.language["channel"] || "l_channel"}
        />
        <Column
          filter
          body={this.customerTemplate}
          field="customerName"
          style={{ width: 120 }}
          header={this.props.language["customer_name"] || "l_customer_name"}
        />
        <Column
          filter
          body={this.shopNameTemplate}
          header={this.props.language["shop_name"] || "l_shop_name"}
          style={{ width: "240px" }}
          filterField="shopName"
          field="shopName"
          filterMatchMode="contains"
        />
        <Column
          filter
          field="address"
          filterField="address"
          filterMatchMode="contains"
          header={this.props.language["address"] || "address"}
        />
        <Column
          filter
          field="employeeName"
          body={this.employeeNameTemplate}
          header={this.props.language["employee_name"] || "l_employee_name"}
          style={{ width: "240px" }}
        />
        <Column
          filter
          //body={this.qcStatusTemplate}
          field="total"
          style={{ width: 120 }}
          header={this.props.language["total"] || "l_total"}
        />
      </DataTable>
    );

    return this.state.permission.view ? (
      <div>
        <div className="p-fluid">
          <Toast ref={(el) => (this.toast = el)} baseZIndex={135022} />
          <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
            <AccordionTab header={this.props.language["search"] || "l_search"}>
              <div className="p-grid">
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
                    inputStyle={{ width: "91.5%", visible: false }}
                    style={{ width: "100%" }}
                    showIcon
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["channel"] || "l_channel"}</label>
                  <ChannelDropDownList
                    id="channelId"
                    onChange={this.handleChange}
                    accId={this.state.accId}
                    value={this.state.channelId}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["customer"] || "l_customer"}
                  </label>
                  <CustomerDropDownList
                    id="customerId"
                    mode="single"
                    onChange={this.handleChange}
                    accId={this.state.accId}
                    value={this.state.customerId}
                  />
                </div>
                <RegionApp {...this} />
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["supervisor"] || "l_supervisor"}
                  </label>
                  <EmployeeDropDownList
                    type="SUP-Leader"
                    typeId={0}
                    id="supId"
                    mode="multi"
                    parentId={""}
                    onChange={this.handleChange}
                    value={this.state.supId}
                    accId={this.state.accId}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["position"] || "position"}</label>
                  <EmployeeTypeDropDownList
                    id="position"
                    type="PG-SR-Leader-SUP"
                    onChange={this.handleChange}
                    value={this.state.position}
                    accId={this.state.accId}
                    typeDropDown={"single"}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["employee"] || "employee"}</label>
                  <EmployeeDropDownList
                    id="employee"
                    type="SR-PG-Leader-SUP"
                    typeId={!this.state.position ? 0 : this.state.position}
                    parentId={!this.state.supId ? "" : this.state.supId}
                    onChange={this.handleChange}
                    value={this.state.employee}
                    accId={this.state.accId}
                    mode={"multi"}
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>
                    {this.props.language["shop_name"] || "l_shop_name"}
                  </label>
                  <Dropdown
                    id="shopId"
                    style={{ width: "100%" }}
                    value={this.state.shopId}
                    options={this.state.storeList}
                    filter
                    showClear
                    onChange={(e) => this.setState({ shopId: e.value })}
                    optionLabel="name"
                  />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["brand"] || "l_brand"}</label>
                  <Dropdown
                    id="brand"
                    style={{ width: "100%" }}
                    value={this.state.brand}
                    options={lstBrand}
                    filter
                    showClear
                    onChange={(e) => this.setState({ brand: e.value })}
                    optionLabel="name"
                  />
                </div>
              </div>
            </AccordionTab>
          </Accordion>
          {this.renderToolbar()}
          {this.state.loading ? (
            <ProgressBar
              mode="indeterminate"
              style={{ height: "5px" }}
            ></ProgressBar>
          ) : null}
          <br />
          {result}
        </div>
      </div>
    ) : (
      this.state.permission?.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    resultList: state.displayContestResult.resultList,
    exported: state.displayContestResult.exported,
    exportedPPT: state.displayContestResult.exportedPPT,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    DisplayContestResultController: bindActionCreators(
      actionCreatorsDisplayContestResult,
      dispatch
    ),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayContestResults);
