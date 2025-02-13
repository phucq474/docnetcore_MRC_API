import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { actionCreatorsOOL } from "../../store/OOLController";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { download, HelpPermission } from "../../Utils/Helpler";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CategoryApp } from "../Controls/CategoryMaster";
import { InputText } from "primereact/inputtext";
import { connect } from "react-redux";
import { ProductCreateAction } from "../../store/ProductController";
import { RegionActionCreate } from "../../store/RegionController";
import { RegionApp } from "../Controls/RegionMaster";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import moment from "moment";
import Page403 from "../ErrorRoute/page403";
import PropTypes from "prop-types";
import { InputNumber } from "primereact/inputnumber";

class OOLTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      loading: false,
      insertDialog: false,
      updateDialog: false,
      deleteDialog: false,
      permission: {
        view: true,
        export: true,
        import: true,
        create: true,
        delete: true,
        edit: true,
      },
      area: null,
      province: [],
      divisionId: 0,
      brandId: 0,
      categoryId: 0,
      provinceCode: 0,
      subCatId: 0,
      target: 0,
      variantId: 0,
      data: [],
    };
    this.pageId = 1013;
    this.fileUpload = React.createRef();
  }
  static propTypes = {
    pageType: PropTypes.string.isRequired,
  };

  DefaultLoad = () => {
    // const user = JSON.parse(localStorage.getItem("USER"));
    this.props.RegionController.GetListRegion();
  };
  async componentWillMount() {
    await this.DefaultLoad();
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
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
    this.setState({ [id]: value ? value : null });
  };
  // Search
  handleSearch = async () => {
    const province = await this.state.province;
    let lstProvince = await null;
    if (province) {
      lstProvince = await "";
      await province.forEach((p) => {
        lstProvince += p + ",";
      });
    }
    const state = this.state;
    const data = {
      divisionId: state.divisionId || null,
      brandId: state.brandId || null,
      shopCode: state.shopCode || null,
      customerId: state.customerId || null,
      province: lstProvince === "" ? null : lstProvince,
      channel: state.channel || null,
      fromDate:
        state.dates && state.dates[0]
          ? moment(state.dates[0]).format("YYYY-MM-DD")
          : null,
      toDate:
        state.dates && state.dates[1]
          ? moment(state.dates[1]).format("YYYY-MM-DD")
          : null,
    };
    await this.props.OOLController.FilterTarget(data);
    const result = this.props.oolTargetFilter;
    await this.Alert("Tìm kiếm thành công", "info");
    await this.setState({ datas: result });
  };

  // UPDATE
  handleAction(rowData, event) {
    return (
      <div>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-save"
            className="p-button-rounded p-button-info p-mr-2"
            Action="UPDATE"
            onClick={() => this.handleUpdate(rowData, event.rowIndex)}
          />
        )}
        {this.state.permission.delete && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() =>
              this.handleDisplayDeleteDialog("true", rowData, event.rowIndex)
            }
          />
        )}
      </div>
    );
  }
  handleOOLFromDate(rowData, stateName = "", event) {
    return (
      <div>
        <Calendar
          fluid
          id="fromDate"
          value={new Date(rowData[stateName] || "")}
          onChange={(e) =>
            this.handleChangeFromDate(
              e.target.id,
              e.target.value,
              event.rowIndex
            )
          }
          dateFormat="yy-mm-dd"
          inputClassName="p-inputtext"
          selectionMode="single"
        />
      </div>
    );
  }
  handleOOLToDate(rowData, stateName = "", event) {
    return (
      <div>
        <Calendar
          fluid
          id="toDate"
          value={new Date(rowData[stateName] || "")}
          onChange={(e) =>
            this.handleChangeTodate(e.target.id, e.target.value, event.rowIndex)
          }
          dateFormat="yy-mm-dd"
          inputClassName="p-inputtext"
          selectionMode="single"
        />
      </div>
    );
  }
  handleTarget(rowData, stateName = "", event) {
    return (
      <div>
        <InputNumber
          value={rowData[stateName] !== null ? rowData[stateName] : 0}
          onValueChange={(e) =>
            this.handleChangeTarget(
              e.target.id,
              e.target.value !== null ? e.target.value : 0,
              event.rowIndex
            )
          }
          mode="decimal"
          minFractionDigits={2}
        />
      </div>
    );
  }
  handleChangeFromDate(id, value, index) {
    let temp = this.state.data;
    let formatfromDate = value
      ? new Date(value).toLocaleDateString("en-CA")
      : null;
    temp[index].fromDate = formatfromDate;
    this.setState({ data: temp });
  }
  handleChangeTodate = (id, value, index) => {
    let temp = this.state.data;
    let formattoDate = value
      ? new Date(value).toLocaleDateString("en-CA")
      : null;
    temp[index].toDate = formattoDate;
    this.setState({ data: temp });
  };
  handleChangeTarget = (id, value, index) => {
    let temp = this.state.data;
    temp[index].target = value;
    this.setState({ data: temp });
  };
  async handleUpdate(rowData, index) {
    await this.setState({ isLoading: true });
    const Action = "UPDATE";
    if (Action === "UPDATE") {
      const data = {
        id: rowData.id,
        shopId: rowData.shopId,
        divisionId: rowData.divisionId,
        brandId: rowData.brandId,
        brand: rowData.brand,
        locationId: rowData.locationId,
        fromDate: rowData.fromDate,
        toDate: rowData.toDate,
        targetId: rowData.targetId,
      };
      await this.props.OOLController.SaveOOLTarget(Action, data, index);
      const result = this.props.oolSaveTarget;
      if (result && result[0] && result[0].response === "1") {
        await this.setState({ data: this.props.oolTargetFilter });
        await this.highlightParentRow(index);
        await this.Alert("Cập nhập thành công", "info");
      } else await this.Alert(result[0].response, "error");
      await this.setState({ isLoading: false });
    } else {
      this.Alert("Khong co data", "Error");
    }
  }
  //Delete
  renderFooterDeleteAction() {
    return (
      <div>
        <Button
          hidden={this.state.delete}
          label={this.props.language["cancel"] || "l_cancel"}
          className="p-button-info"
          icon="pi pi-times"
          onClick={() => this.handleDisplayDeleteDialog("false")}
        />
        <Button
          hidden={this.state.delete}
          label={this.props.language["delete"] || "l_delete"}
          className="p-button-danger"
          icon="pi pi-check"
          Action="DELETE"
          onClick={() => this.handleDelete()}
        />
      </div>
    );
  }
  // Template
  handleGetTemplate = async () => {
    const state = this.state;
    const data = {
      divisionId: state.divisionId || null,
      brandId: state.brandId || null,
      shopCode: state.shopCode || null,
      customerId: state.customerId || null,
      fromDate:
        state.dates && state.dates[0]
          ? moment(state.dates[0]).format("YYYY-MM-DD")
          : null,
      toDate:
        state.dates && state.dates[1]
          ? moment(state.dates[1]).format("YYYY-MM-DD")
          : null,
    };
    await this.props.OOLController.GetTemplateTarget(data);
    const result = this.props.ooltargetsTemplate;
    if (result && result.status === 200) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  // import
  handleImport = async (event) => {
    await this.setState({ loading: true });
    await this.props.OOLController.ImportTarget(event.files[0]);
    const result = this.props.resultImportOOLTarget;
    if (result && result.status === 200)
      await this.Alert(result.message, "info");
    else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
    await this.fileUpload.current.clear();
  };
  // export
  handleExport = async () => {
    const state = this.state;
    const data = {
      divisionId: state.divisionId || null,
      brandId: state.brandId || null,
      shopCode: state.shopCode || null,
      customerId: state.customerId || null,
      fromDate:
        state.dates && state.dates[0]
          ? moment(state.dates[0]).format("YYYY-MM-DD")
          : null,
      toDate:
        state.dates && state.dates[1]
          ? moment(state.dates[1]).format("YYYY-MM-DD")
          : null,
    };
    await this.setState({ loading: true });
    await this.props.OOLController.ExportTarget(data);
    const result = this.props.ooltargetsExport;
    if (result && result.status === 200) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };

  showShop = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <strong>{rowData.shopCode}</strong>
        </div>
        <p>{rowData.shopName}</p>
      </div>
    );
  };
  componentDidMount() {
    this.props.ProductController.GetCategory();
  }
  render() {
    const leftContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.view && (
          <Button
            icon="pi pi-search"
            label={this.props.language["search"] || "l_search"}
            onClick={() => this.handleSearch()}
            style={{ marginRight: "15px" }}
            className="p-button-info"
          />
        )}
        {this.state.permission && this.state.permission.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["export"] || "l_export"}
            onClick={this.handleExport}
            style={{ marginRight: "15px" }}
          />
        )}
      </React.Fragment>
    );
    const rightContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["template"] || "l_template"}
            onClick={this.handleGetTemplate}
            style={{ marginRight: "15px" }}
          />
        )}
        {/* {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />} */}
        {this.state.permission && this.state.permission.import && (
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            ref={this.fileUpload}
            mode="basic"
            customUpload={true}
            accept=".xlsx,.xls"
            maxFileSize={10000000}
            style={{ marginRight: "15px" }}
            onClear={this.clear}
            uploadHandler={this.handleImport}
          />
        )}
        {this.state.permission && this.state.permission.import && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
              this.fileUpload.current.fileInput = { value: "" };
              this.fileUpload.current.clear();
            }}
          />
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
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["customer"] || "l_customer"}</label>
                <CustomerDropDownList
                  id="customerId"
                  mode="single"
                  onChange={this.handleChange}
                  value={this.state.customerId}
                />
              </div>
              {<RegionApp id="appregion" {...this} />}
              {<CategoryApp id="appcate" {...this} />}
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["shopcode"] || "l_shopcode"}</label>
                <InputText
                  className="w-100"
                  id="shopCode"
                  value={this.state.shopCode || ""}
                  onChange={(e) =>
                    this.handleChange(e.target.id, e.target.value)
                  }
                ></InputText>
              </div>
            </div>
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>
        <Toolbar left={leftContents} right={rightContents} />
        <DataTable
          paginatorPosition={"both"}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          value={this.state.datas}
          paginator={true}
          rows={50}
          rowsPerPageOptions={[20, 50, 100]}
          style={{ fontSize: "13px" }}
        >
          <Column filter header="No." field="stt" style={{ width: 30 }} />
          <Column
            field="provinceNameVN"
            header={this.props.language["province"] || "l_province"}
            style={{ textAlign: "center", width: 60 }}
            filter={true}
          />
          <Column
            field="areaName"
            header={this.props.language["area"] || "l_area"}
            style={{ textAlign: "center", width: 60 }}
            filter={true}
          />
          <Column
            field="division"
            header={this.props.language["division"] || "l_division"}
            style={{ textAlign: "center", width: 60 }}
            filter={true}
          />
          <Column
            field="brand"
            header={this.props.language["brand"] || "l_brand"}
            style={{ textAlign: "center", width: 60 }}
            filter={true}
          />
          <Column
            field="customerName"
            filter={true}
            style={{ width: 80, textAlign: "center" }}
            header={this.props.language["customer_name"] || "l_customer_name"}
          />
          <Column
            filter
            header={this.props.language["shop_name"] || "l_shop_name"}
            body={this.showShop}
            style={{ width: 200, textAlign: "center" }}
          />
          <Column
            field="locationName"
            header={this.props.language["item"] || "l_item"}
            style={{ width: "100px" }}
            filter={true}
          />
          <Column
            field="type"
            header={this.props.language["type"] || "l_type"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="target"
            header="target"
            body={(rowData, e) => this.handleTarget(rowData, "target", e)}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="fromDate"
            header={this.props.language["from_date"] || "l_from_date"}
            body={(rowData, e) => this.handleOOLFromDate(rowData, "toDate", e)}
            style={{ width: 80, textAlign: "center" }}
            filter={true}
          />
          <Column
            field="toDate"
            header={this.props.language["to_date"] || "l_to_date"}
            body={(rowData, e) => this.handleOOLToDate(rowData, "toDate", e)}
            style={{ width: "80px", textAlign: "center" }}
            filter={true}
          />
          <Column
            body={(rowData, e) => this.handleAction(rowData, e)}
            header="Tool"
            style={{ width: 120, textAlign: "center" }}
          ></Column>
          {/* <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column> */}
        </DataTable>
      </React.Fragment>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    oolTargetFilter: state.ool.oolTargetFilter,
    oolSaveTarget: state.ool.oolSaveTarget,
    ooltargetsTemplate: state.ool.ooltargetsTemplate,
    resultImportOOLTarget: state.ool.resultImportOOLTarget,
    ooltargetsExport: state.ool.ooltargetsExport,
    language: state.languageList.language,
    categories: state.products.categories,
    regions: state.regions.regions,
    usearea: true,
    useprovince: true,
    usedivision: true,
    usebrand: true,
    usecate: true,
    usesubcate: true,
    usevariant: false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    RegionController: bindActionCreators(RegionActionCreate, dispatch),
    OOLController: bindActionCreators(actionCreatorsOOL, dispatch),
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OOLTarget);
