import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import {
  download,
  HelpPermission,
  formatCurrency,
} from "../../../Utils/Helpler";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import CustomerDropDownList from "../../Controls/CustomerDropDownList";
import moment from "moment";
import { SellInIMVActionCreators } from "../../../store/SellInIMVController";
import Page403 from "../../ErrorRoute/page403";
import EmployeeDropDownList from "../../Controls/EmployeeDropDownList";
import { AccountDropDownList } from "../../Controls/AccountDropDownList";

class SellInIMV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      dates: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      loading: false,
      sellInIMV: [],
      customerId: null,
      kamId: null,
      sssId: null,
      permission: {
        view: true,
        export: true,
        import: true,
        create: true,
        delete: true,
        edit: true,
      },
      accId: 3,
    };
    this.pageId = 3080;
    this.fileUpload = React.createRef();
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  Alert = (mess, style) => {
    if (style === undefined) {
      style = "success";
    }
    let life = 3000;
    if (style === "error") {
      life = 7000;
    }
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
      life: life,
    });
  };
  // handle Change
  handleChange = (id, value) => {
    this.setState({ [id]: value ? value : null });
  };
  handleChangeForm = (value, stateName, subStateName = null) => {
    if (subStateName === null) {
      this.setState({ [stateName]: value });
    } else {
      this.setState({
        [stateName]: { ...this.state[stateName], [subStateName]: value },
      });
    }
  };
  getFilter() {
    this.setState({ loading: true, expandedRows: null });
    var data = {
      year: parseInt(moment(this.state.dates).format("YYYY"), 0),
      month: parseInt(moment(this.state.dates).format("MM"), 0),
      customerId: this.state.customerId,
      kamId: this.state.kamId,
      sssId: this.state.sssId,
    };
    return data;
  }
  handleSearch() {
    let data = this.getFilter();
    this.props.SellInIMVController.GetList(data, this.state.accId).then(() => {
      this.setState({
        loading: false,
        sellInIMV: this.props.sellInIMV,
      });
      this.Alert(
        this.props.sellInIMV.length === 0
          ? `${this.props.language["data_null"] || "l_data_null"}`
          : `${this.props.language["found"] || "l_found"}: ` +
              this.props.sellInIMV.length +
              ` ${this.props.language["rows"] || "l_rows"}`
      );
    });
  }

  handleExport() {
    let data = this.getFilter();
    this.props.SellInIMVController.Export(data, this.state.accId).then(() => {
      this.setState({ loading: false });
      if (this.props.exported.status === 200) {
        download(this.props.exported.fileUrl);
        this.Alert("Thành công");
      } else {
        this.Alert(this.props.exported.message, "error");
      }
    });
  }
  handleGetTemplate = async () => {
    await this.props.SellInIMVController.GetTemplate(this.state.accId);
    const result = this.props.templated;
    if (result && result.status === 200) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  // import
  handleImport = async (event) => {
    await this.setState({ loading: true });
    await this.props.SellInIMVController.Import(
      event.files[0],
      this.state.accId
    );
    const result = this.props.imported;
    if (result?.status === 1) {
      await this.Alert(result?.message, "info");
    } else {
      await this.Alert(result?.message, "error");
      if (result?.fileUrl !== null) {
        download(result?.fileUrl);
      }
    }
    await this.setState({ loading: false });
    await this.fileUpload.current.clear();
  };
  //   async componentWillMount() {
  //     let permission = await HelpPermission(this.pageId);
  //     await this.setState({ permission });
  //   }
  shopBodyTemplate = (rowData) => {
    return (
      <>
        <strong>{rowData.shopCode}</strong>
        <br></br>
        <label>{rowData.shopName}</label>
      </>
    );
  };
  kamBodyTemplate = (rowData) => {
    return (
      <>
        <strong>{rowData.kamCode}</strong>
        <br></br>
        <label>{rowData.kamName}</label>
      </>
    );
  };
  sssBodyTemplate = (rowData) => {
    return (
      <>
        <strong>{rowData.sssCode}</strong>
        <br></br>
        <label>{rowData.sssName}</label>
      </>
    );
  };
  componentDidMount() {}
  render() {
    const leftContents = (
      <React.Fragment>
        {this.state.permission?.view && (
          <Button
            icon="pi pi-search"
            label={this.props.language["search"] || "l_search"}
            onClick={() => this.handleSearch()}
            style={{ marginRight: "15px" }}
            className="p-button-success"
          />
        )}
        {this.state.permission?.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["export"] || "l_export"}
            onClick={() => this.handleExport()}
            style={{ marginRight: "15px" }}
            className="p-button-danger"
          />
        )}
      </React.Fragment>
    );
    const rightContents = (
      <React.Fragment>
        {this.state.permission?.import && (
          <>
            <Button
              icon="pi pi-download"
              label={this.props.language["template"] || "l_template"}
              onClick={() => this.handleGetTemplate()}
              style={{ marginRight: "10px" }}
              className="p-button-secondary"
            />
            <FileUpload
              chooseLabel={this.props.language["import"] || "l_import"}
              ref={this.fileUpload}
              mode="basic"
              customUpload={true}
              accept=".xlsx,.xls"
              maxFileSize={10000000}
              style={{ marginRight: "-15px" }}
              onClear={this.clear}
              uploadHandler={this.handleImport}
            />
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-text"
              onClick={() => {
                this.fileUpload.current.fileInput = { value: "" };
                this.fileUpload.current.clear();
              }}
            />
          </>
        )}
      </React.Fragment>
    );

    return this.state.permission.view ? (
      <React.Fragment>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <AccordionTab header={this.props.language["search"] || "search"}>
            <div className="p-fluid p-formgrid p-grid">
              <AccountDropDownList
                id="accId"
                className="p-field p-col-12 p-md-3"
                onChange={this.handleChange}
                filter={true}
                showClear={true}
                value={this.state.accId}
              />
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["month"] || "l_month"}</label>
                <Calendar
                  fluid
                  value={this.state.dates}
                  onChange={(e) => this.setState({ dates: e.value })}
                  dateFormat="MM-yy"
                  yearNavigator
                  yearRange="2020:2030"
                  inputClassName="p-inputtext"
                  id="fromDate"
                  view="month"
                  inputStyle={{ width: "91.5%", visible: false }}
                  style={{ width: "100%" }}
                  showIcon
                />
              </div>
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["customer"] || "l_customer"}</label>
                <CustomerDropDownList
                  id="customerId"
                  mode="single"
                  accId={this.state.accId}
                  onChange={this.handleChange}
                  value={this.state.customerId}
                />
              </div>
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>KAM</label>
                <EmployeeDropDownList
                  type="KAM"
                  typeId={17}
                  id="kamId"
                  parentId={0}
                  mode="single"
                  accId={this.state.accId}
                  onChange={this.handleChange}
                  value={this.state.kamId === null ? 0 : this.state.kamId}
                />
              </div>
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>SSS</label>
                <EmployeeDropDownList
                  type="SUP"
                  typeId={16}
                  id="sssId"
                  parentId={this.state.kamId || 0}
                  mode="single"
                  accId={this.state.accId}
                  onChange={this.handleChange}
                  value={this.state.sssId === null ? 0 : this.state.sssId}
                />
              </div>
            </div>
            <br />
            <Toolbar left={leftContents} right={rightContents} />
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>

        <DataTable
          value={this.state.sellInIMV}
          paginator
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          style={{ fontSize: "13px" }}
          rowHover
          paginatorPosition={"both"}
          dataKey="rowNum"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column
            filter
            header="No."
            field="rowNum"
            style={{ width: "5%", textAlign: "center" }}
          />
          <Column
            filter
            filterMatchMode="contains"
            field="area"
            style={{ width: "10%", textAlign: "center" }}
            header={this.props.language["area"] || "l_area"}
          />
          <Column
            filter
            filterMatchMode="contains"
            field="customer"
            style={{ width: "10%", textAlign: "center" }}
            header={this.props.language["customer"] || "l_customer"}
          />
          <Column
            filterMatchMode="contains"
            field="shopName"
            body={this.shopBodyTemplate}
            header={this.props.language["kam"] || "l_kam"}
            style={{ textAlign: "center" }}
            filter={true}
          />
          <Column
            field="target"
            header={this.props.language["target"] || "l_target"}
            body={(rowData) => <label>{formatCurrency(rowData.target)}</label>}
            style={{ width: "10%", textAlign: "center" }}
          />
          <Column
            field="actual"
            header={this.props.language["actual"] || "l_actual"}
            body={(rowData) => <label>{formatCurrency(rowData.actual)}</label>}
            style={{ width: "10%", textAlign: "center" }}
          />
          <Column
            field="upToDate"
            header={this.props.language["up_to_date"] || "l_up_to_date"}
            style={{ width: "10%", textAlign: "center" }}
          />
          <Column
            filterMatchMode="contains"
            field="kamName"
            body={this.kamBodyTemplate}
            header={this.props.language["kam"] || "l_kam"}
            style={{ textAlign: "center" }}
            filter={true}
          />
          <Column
            filterMatchMode="contains"
            field="sssName"
            body={this.sssBodyTemplate}
            header={this.props.language["sss"] || "l_sss"}
            style={{ textAlign: "center" }}
            filter={true}
          />
        </DataTable>
      </React.Fragment>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    sellInIMV: state.sellInIMV.sellInIMV,
    templated: state.sellInIMV.templated,
    imported: state.sellInIMV.imported,
    exported: state.sellInIMV.exported,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SellInIMVController: bindActionCreators(SellInIMVActionCreators, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SellInIMV);
