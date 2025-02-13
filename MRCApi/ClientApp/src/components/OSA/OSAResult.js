import React, { PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Search from "../Controls/Search";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PhotoGallery from "../Controls/Gallery/PhotoGallery";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { HelpPermission, getAccountId, download } from "../../Utils/Helpler";
import OSAResultDetail from "./OSAResultDetail";
import Page403 from "../ErrorRoute/page403";
import { OSAResultActionCreators } from "../../store/OSAResultController.js";

class OSAResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: null,
      selected: 0,

      data: [],
      permission: {},
      accId: null
    };
    this.pageId = 14;
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.shopNameTemplate = this.shopNameTemplate.bind(this);
    this.employeeNameTemplate = this.employeeNameTemplate.bind(this);
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
  };
  Search = async (data) => {
    await this.setState({ expandedRows: null, data: [] });
    await this.props.OSAResultController.GetList(data, data.accId);

    const result = await this.props.osaResults;
    if (result && result.length > 0) {
      await this.Alert(
        `${this.props.language["success"] || "l_success"}`,
        "info"
      );
    } else
      this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error");
    await this.setState({ data: result });
  };
  Export = async (data) => {
    await this.props.OSAResultController.Export(data, data.accId);
    const result = this.props.fileExport;
    if (result && result.status === 200) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
  };
  rowExpansionTemplate(rowData) {
    return (
      <div className="p-grid">
        <div className="p-col-12 p-md-7 p-sm-12">
          <OSAResultDetail
            key={rowData.rowNum}
            dataInput={rowData}
          ></OSAResultDetail>
        </div>
        <div className="p-col-12 p-md-5 p-sm-12">
          <PhotoGallery
            {...this}
            dataInput={rowData}
            reportId={rowData.reportId}
            photoType={"OSA"}
            pageId={this.pageId}
            insert={true}
            edit={true}
            delete={true}
            accId={this.state.accId}
          />
        </div>
      </div>
    );
  }
  // handleChange
  handleChangeForm = (e, stateName = "", subStateName) => {
    this.setState({
      [stateName]: {
        ...this.state[stateName],
        [subStateName]: e.target.value == null ? "" : e.target.value,
      },
    });
  };
  handleChangeControl = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  };
  handleChangeDropDown = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  };
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  shopNameTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.shopCode}</strong> <br></br>
        <label>{rowData.shopName} </label>
      </div>
    );
  }
  employeeNameTemplate = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.employeeCode}</strong> <br></br>
        <label>
          {rowData.fullName} ({rowData.position})
        </label>
      </div>
    );
  };
  totalTemplate = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.percent} %</strong>
        <br />
        <label>
          ({rowData.totalOSA}/{rowData.countOSA})
        </label>
      </div>
    );
  };
  render() {
    let result = null;
    // if (this.props.displays.length > 0) {
    result = (
      <DataTable
        value={this.state.data}
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100]}
        style={{ fontSize: "12pt", marginTop: 10 }}
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
        <Column filter field="rowNum" style={{ width: "4%", textAlign: 'center' }} header="No." />
        <Column
          filter
          filterMatchMode="contains"
          field="provinceName"
          style={{ width: '10%', textAlign: 'center' }}
          header={this.props.language["province"] || "l_province"}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="customerName"
          style={{ width: '10%', textAlign: 'center' }}
          header={this.props.language["customer"] || "l_customer"}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="accountName"
          style={{ width: '10%', textAlign: 'center' }}
          header={this.props.language["account"] || "l_account"}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="shopName"
          body={this.shopNameTemplate}
          header={this.props.language["shop_name"] || "l_shop_name"}
          style={{ width: '15%', textAlign: 'center' }}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="address"
          headerStyle={{ textAlign: 'center' }}
          header={this.props.language["address"] || "address"}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="employeeName"
          body={this.employeeNameTemplate}
          header={this.props.language["employee_name"] || "l_employee_name"}
          style={{ width: '15%', textAlign: 'center' }}
        />
        <Column
          filter
          filterMatchMode="contains"
          field="workDate"
          header={this.props.language["date"] || "l_date"}
          style={{ width: '7%', textAlign: 'center' }}
        />
        <Column
          body={this.totalTemplate}
          header={this.props.language["total"] || "l_total"}
          style={{ width: '7%', textAlign: 'center' }}
        />
        {/* <Column body={this.handleAction} header={this.props.language["tool"] || "l_tool"} style={{ width: "150px", textAlign: "center" }} /> */}
      </DataTable>
    );
    // }
    return this.state.permission.view ? (
      <div className="p-fluid">
        <Toast ref={(el) => (this.toast = el)} baseZIndex={135022} />
        {this.state.permission !== undefined && (
          <Search
            pageType="osa_result"
            {...this}
            permission={this.state.permission}
          ></Search>
        )}
        {result}
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    osaResults: state.osaResult.osaResults,
    fileExport: state.osaResult.fileExport,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    OSAResultController: bindActionCreators(OSAResultActionCreators, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OSAResult);
