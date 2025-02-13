import React, { PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Search from "../Controls/Search";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "primereact/toast";
import { HelpPermission, getAccountId, download } from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import { ProductCreateAction } from "../../store/ProductController";
import StockOutDetail from "./StockOutDetail";
import { actionCreatorStockOut } from "../../store/StockOutController";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import PhotoGallery from "../Controls/Gallery/PhotoGallery";
class StockOut extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: null,
      selected: 0,
      data: [],
      permission: {},
      updateDialog: false,
      accId: null,
    };
    this.pageId = 8;
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.shopNameTemplate = this.shopNameTemplate.bind(this);
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  Search = async (data) => {
    await this.setState({ expandedRows: null });
    await this.props.StockOutController.FilterStockOut(data, data.accId);

    const result = this.props.filterStockOut;
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
    await this.props.StockOutController.ExportStockOut(data, data.accId);
    const result = this.props.exportStockOut;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
  };
  rowExpansionTemplate(rowData) {
    if (rowData.havePhotos === 1)
      return (
        <div className="p-grid">
          <div className="p-col-12 p-md-7 p-sm-12">
            <StockOutDetail
              key={rowData.rowNum}
              dataInput={rowData}
            ></StockOutDetail>
          </div>
          <div className="p-col-12 p-md-5 p-sm-12">
            <PhotoGallery
              {...this}
              dataInput={rowData}
              photoType={"Stock"}
              pageId={this.pageId}
            />
          </div>
        </div>
      );
    else
      return (
        <StockOutDetail
          key={rowData.rowNum}
          dataInput={rowData}
          handleUpdateRowDialog={this.handleUpdateRowDialog}
          accId={this.state.accId}
        ></StockOutDetail>
      );
  }
  handleUpdateRowDialog = async (boolean, rowData, index) => {
    if (boolean) {
      await this.setState({
        updateDialog: true,
        inputValues: {
          ...this.state.inputValues,
          index: index,
          stockProductId: rowData.stockProductId,
          rowData: rowData,
        },
      });
    } else {
      this.setState({ updateDialog: false, inputValues: {} });
    }
  };
  footerUpdateRowDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleUpdateRowDialog(false)}
            />
            <Button
              label={this.props.language["update"] || "l_update"}
              className="p-button-info"
              onClick={() => this.handleUpdate()}
            />
          </div>
        )}
      </div>
    );
  };
  handleUpdate = async () => {
    await this.setState({ loading: true });

    let rowData = this.state.inputValues.rowData;
    let data = {
      stockProductId: rowData.stockProductId,
      quantity: rowData.quantity,
    };
    await this.props.StockOutController.UpdateDetailStockOut(data);
    const result = this.props.updateDetailStockOut;
    if (result.status === 200) {
      await this.Alert(result.message, "info");
    } else {
      await this.Alert(result.message, "error");
    }

    await this.handleUpdateRowDialog(false);
    await this.setState({ loading: false, inputValues: {} });
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
  handleChange = (id, value) => {
    this.setState({
      [id]: value === null ? "" : value,
    });
  };
  Template = (data) => {
    this.props.StockOutController.TemplateStockOut(data, this.state.accId).then(
      () => {
        const rs = this.props.templateStockOut;
        if (rs.status === 200) {
          download(rs.fileUrl);
          this.Alert(rs.message, "success");
        } else {
          this.Alert(rs.message, "error");
        }
      }
    );
  };

  Import = (file) => {
    this.props.StockOutController.ImportStockOut(file).then(() => {
      const rs = this.props.importStockOut;
      if (rs.status === 200) {
        this.Alert(rs.message, "success");
      } else if (rs.status === 300) {
        download(rs.fileUrl);
        this.Alert(rs.message, "error");
      } else {
        this.Alert(rs.message, "error");
      }
    });
  };

  render() {
    let result = null;
    let dialogInsert = null,
      dialogUpdate = null;
    result = (
      <DataTable
        value={this.state.data}
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
        <Column expander={true} style={{ width: "3em" }} />
        <Column filter field="rowNum" style={{ width: "40px" }} header="No." />
        <Column
          filter
          field="provinceName"
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
          field="customerName"
          style={{ width: 140 }}
          header={this.props.language["customer"] || "l_customer"}
        />
        <Column
          filter
          body={this.shopNameTemplate}
          header={this.props.language["shop_name"] || "l_shop_name"}
          style={{ width: "260px" }}
        />
        <Column
          filter
          field="address"
          header={this.props.language["address"] || "address"}
        />
        <Column
          filter
          body={this.employeeNameTemplate}
          header={this.props.language["employee_name"] || "l_employee_name"}
          style={{ width: 220, textAlign: "center" }}
        />
        <Column
          filter
          field="workDate"
          header={this.props.language["date"] || "l_date"}
          style={{ width: "100px" }}
        />
        <Column
          field="amount"
          header={this.props.language["amount"] || "l_amount"}
          style={{ width: 100 }}
        />
        {/* <Column body={this.handleAction} header={this.props.language["tool"] || "l_tool"} style={{ width: "150px", textAlign: "center" }} /> */}
      </DataTable>
    );
    if (this.state.updateDialog) {
      dialogUpdate = (
        <Dialog
          header="Update"
          style={{ width: "30vw" }}
          visible={this.state.updateDialog}
          footer={this.footerUpdateRowDialog()}
          onHide={() => this.handleUpdateRowDialog(false)}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>bạn có muốn thay đổi?</span>
          </div>
        </Dialog>
      );
    }
    return this.state.permission.view ? (
      <div>
        <div className="p-fluid">
          <Toast ref={(el) => (this.toast = el)} baseZIndex={135022} />
          {this.state.permission !== undefined && (
            <Search
              pageType="stock_out"
              {...this}
              permission={this.state.permission}
              isImport={true}
              haveTemplate={true}
            ></Search>
          )}
          {result}
          {dialogUpdate}
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
    filterStockOut: state.stockout.filterStockOut,
    exportStockOut: state.stockout.exportStockOut,
    updateDetailStockOut: state.stockout.updateDetailStockOut,
    importStockOut: state.stockout.importStockOut,
    templateStockOut: state.stockout.templateStockOut,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
    StockOutController: bindActionCreators(actionCreatorStockOut, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StockOut);
