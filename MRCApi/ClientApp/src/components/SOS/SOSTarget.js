import React, { createRef, PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { ProgressBar } from "primereact/progressbar";
import { bindActionCreators } from "redux";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { download, HelpPermission } from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import { SOSTargetActionCreators } from "../../store/SOSTargetController";
import { Calendar } from "primereact/calendar";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
// import SOSListDialog from './SOSListDialog';
import moment from "moment";
import { InputText } from "primereact/inputtext";
class SOSTarget extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groupId: null,
      permission: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        import: true,
        export: true,
      },
      dates: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 1
        ),
        new Date(),
      ],
      datas: [],
      loading: false,
      insertDialog: false,
      updateDialog: false,
      inputValues: { dataTableInsert: [] },
      status: true,
    };
    this.fileUpload = React.createRef();
    this.pageId = 3142;
    this.handleChange = this.handleChange.bind(this);
  }
  // async componentWillMount() {
  //     let permission = await HelpPermission(this.pageId);
  //     await this.setState({ permission })
  // }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  // handle change
  handleChange(id, value) {
    this.setState({ [id]: value === null ? "" : value });
  }
  handleChangeForm = async (value, stateName, subStateName = null) => {
    if (subStateName === null) {
      await this.setState({ [stateName]: value });
    } else {
      await this.setState({
        [stateName]: { ...this.state[stateName], [subStateName]: value },
      });
      if (subStateName === "refCode" && !value)
        await this.setState({
          [stateName]: { ...this.state[stateName], from: 0, to: 0, value: 0 },
        });
    }
  };
  onChange = (id, value) => {
    this.setState({ [id]: value ? value : null });
  };
  handleChangeTable = (id, value, index) => {
    let temp = this.state.inputValues.dataTableInsert;
    temp[index][id] = value;
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        dataTableInsert: temp,
      },
    });
  };
  handleChangeCheckBox = async (id, value, index, type) => {
    let temp = this.state.inputValues.dataTableInsert;
    temp[index][id] = value ? 1 : 0;
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        dataTableInsert: temp,
      },
    });
  };
  // search
  handleSearch = async () => {
    const state = this.state;
    const data = {
      customerId: state.customerId || null,
      shopCode: state.shopCode || null,
      fromdate: state.dates
        ? moment(state.dates[0]).format("YYYY-MM-DD")
        : null,
      todate:
        state.dates && state.dates[1]
          ? moment(state.dates[1]).format("YYYY-MM-DD")
          : null,
    };
    await this.setState({ loading: true });
    await this.props.SOSTargetController.FilterSOSTarget(data);
    const result = this.props.filterSOSTarget;
    if (result && result.length > 0) {
      await this.Alert("Tìm kiếm thành công", "info");
    } else await this.Alert("Không có dữ liệu", "info");
    await this.setState({ loading: false, datas: result });
  };

  actionButtons = (rowData, event) => {
    return (
      <div>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
            onClick={() =>
              this.handleUpdateDialog(true, rowData, event.rowIndex)
            }
          />
        )}
      </div>
    );
  };
  /// Insert
  bindDataShop = async () => {
    const inputValues = this.state.inputValues;
    const data = { fromDate: inputValues.fromDate || null };
    await this.props.SOSTargetController.GetListCategory(data);
    const result = this.props.getListCategory;
    if (result && result.length > 0) {
      await this.Alert("Lấy dữ liệu thành công", "info");
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          dataTableInsert: result,
        },
      });
    } else {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          dataTableInsert: [],
        },
      });
      await this.Alert("Không có dữ liệu", "error");
    }
  };
  handleInsertDialog = (boolean) => {
    if (boolean) {
      this.setState({
        insertDialog: true,
        inputValues: {
          ...this.state.inputValues,
          refCode: true,
          status: true,
          from: 0,
        },
      });
    } else {
      this.setState({ insertDialog: false });
    }
  };
  footerInsertDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.create && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleInsertDialog(false)}
            />
            <Button
              label={this.props.language["insert"] || "l_insert"}
              className="p-button-info"
              onClick={() => this.handleInsert()}
            />
          </div>
        )}
      </div>
    );
  };

  handleInsert = async () => {
    const inputValues = this.state.inputValues;
    const data = inputValues.dataTableInsert;
    if (data.length === 0)
      return await this.Alert(
        this.props.language["please_choose_cate"] || "l_please_choose_cate",
        "error"
      );
    await this.props.SOSTargetController.InsertSOSList(data);
    const result = await this.props.insertSOSList;
    if (result && result.status === 1) {
      await this.setState({ inputValues: {} });
      await this.highlightParentRow(0);
      await this.Alert("Thêm thành công", "info");
    } else {
      await this.Alert("Thêm thất bại", "error");
      await this.setState({ inputValues: {} });
    }
    await this.setState({ isLoading: false });
  };
  /// Update
  footerUpdateDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleUpdateDialog(false)}
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
  handleUpdateDialog = async (boolean, rowData, index) => {
    if (boolean) {
      await this.setState({
        updateDialog: true,
        inputValues: {
          ...this.state.inputValues,
          index: index,
          id: rowData.id,
          applyDate: rowData.applyDate ? new Date(rowData.applyDate) : null,
          status: rowData.status ? true : false,
          orderBy: rowData.orderBy,
        },
      });
    } else {
      this.setState({ updateDialog: false, inputValues: {} });
    }
  };
  handleUpdate = async () => {
    await this.setState({ isLoading: true });
    const inputValues = this.state.inputValues;
    if (!inputValues.applyDate)
      return await this.Alert("Xin chọn ngày kích hoạt", "error");
    const data = {
      applyDate: moment(inputValues.applyDate).format("YYYY-MM-DD"),
      orderBy: inputValues.orderBy || null,
      status: inputValues.status ? 1 : 0,
      id: inputValues.id,
    };
    await this.props.SOSTargetController.updateSOSList(data, inputValues.index);
    const result = await this.props.updateSOSList;
    if (typeof result === "object" && result[0] && result[0].alert == "1") {
      await this.setState({
        datas: this.props.filterSOSList,
        inputValues: {},
        updateDialog: false,
      });
      await this.highlightParentRow(inputValues.index);
      await this.Alert("Cập nhập thành công", "info");
    } else {
      await this.Alert("Cập nhập thất bại", "error");
    }
    await this.setState({ isLoading: false });
  };
  /// export
  handleExport = async () => {
    const state = this.state;
    const data = {
      customerId: state.customerId || null,
      shopCode: state.shopCode || null,
      fromdate: state.dates
        ? moment(state.dates[0]).format("YYYY-MM-DD")
        : null,
      todate:
        state.dates && state.dates[1]
          ? moment(state.dates[1]).format("YYYY-MM-DD")
          : null,
    };
    await this.setState({ loading: true });
    await this.props.SOSTargetController.ExportSOSTarget(data);
    const result = this.props.exportSOSTarget;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  // template
  handleGetTemplate = async () => {
    await this.setState({ loading: true });
    await this.props.SOSTargetController.TemplateSOSTarget();
    const result = this.props.templateSOSTarget;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  /// import
  handleImport = async (event) => {
    await this.setState({ loading: true });
    await this.props.SOSTargetController.ImportSOSTarget(event.files[0]);
    const result = this.props.importSOSTarget;
    if (result && result.status === 1) await this.Alert(result.message, "info");
    else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
    await this.fileUpload.current.clear();
  };
  highlightParentRow = async (rowIndex) => {
    try {
      const seconds = await 3000,
        outstanding = await "highlightText";
      let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0];
      if (
        rowUpdated &&
        !rowUpdated.children[rowIndex].classList.contains(outstanding)
      ) {
        rowUpdated.children[rowIndex].classList.add(outstanding);
        setTimeout(() => {
          if (rowUpdated.children[rowIndex].classList.contains(outstanding)) {
            rowUpdated.children[rowIndex].classList.remove(outstanding);
          }
        }, seconds);
      }
    } catch (e) {}
  };
  showGroup = (rowData) => {
    return (
      <Button
        className="p-button-warning p-button-outlined btn__hover"
        label={rowData.groupName}
        style={{ width: "max-content", float: "left", cursor: "auto" }}
      />
    );
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
  showCustomer = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <strong>{rowData.customerCode}</strong>
        </div>
        <p>{rowData.customerName}</p>
      </div>
    );
  };
  render() {
    let dialogInsert = null,
      dialogUpdate = null;
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
    // if (this.state.insertDialog) { // * INSERT DIALOG
    //     dialogInsert = <SOSListDialog
    //         stateName={"inputValues"}
    //         nameAction={"Insert"}
    //         inputValues={this.state.inputValues}
    //         handleChangeForm={this.handleChangeForm}
    //         handleChange={this.handleChange}
    //         //dialog
    //         displayDialog={this.state.insertDialog}
    //         footerAction={this.footerInsertDialog}
    //         handleActionDialog={this.handleInsertDialog}
    //         bindDataShop={this.bindDataShop}
    //         handleChangeTable={this.handleChangeTable}
    //         handleChangeCheckBox={this.handleChangeCheckBox}
    //     />
    // }
    // if (this.state.updateDialog) { // * UPDATE DIALOG
    //     dialogUpdate = <SOSListDialog
    //         stateName={"inputValues"}
    //         nameAction={"Update"}
    //         inputValues={this.state.inputValues}
    //         handleChangeForm={this.handleChangeForm}
    //         handleChange={this.handleChange}
    //         //dialog
    //         displayDialog={this.state.updateDialog}
    //         footerAction={this.footerUpdateDialog}
    //         handleActionDialog={this.handleUpdateDialog}
    //         bindDataShop={this.bindDataShop}
    //         handleChangeTable={this.handleChangeTable}
    //         handleChangeCheckBox={this.handleChangeCheckBox}
    //     />
    // }
    return this.state.permission.view ? (
      <Card>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
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
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>
                  {this.props.language["shop_code"] || "l_shop_code"}
                </label>
                <InputText
                  id="shopCode"
                  value={this.state.shopCode}
                  onChange={(e) =>
                    this.handleChange(e.target.id, e.target.value)
                  }
                ></InputText>
              </div>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
          </AccordionTab>
        </Accordion>
        {this.state.loading ? (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "5px" }}
          ></ProgressBar>
        ) : null}
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
          <Column
            filter
            header="No."
            field="stt"
            style={{ width: 50, textAlign: "center" }}
          />
          <Column
            filter
            body={this.showCustomer}
            header={this.props.language["customer_name"] || "l_customer_name"}
            style={{ width: 190, textAlign: "center" }}
          />
          <Column
            filter
            body={this.showShop}
            header={this.props.language["shop_name"] || "l_shop_name"}
            style={{ textAlign: "center" }}
          />
          {/*<Column filter field="address" header={this.props.language["address"] || "l_address"} style={{ textAlign: 'center' }} />*/}
          <Column
            filter
            field="division"
            header={this.props.language["division_"] || "l_division_"}
            style={{ width: 150, textAlign: "center" }}
          />
          <Column
            filter
            field="brand"
            header={this.props.language["brand"] || "l_brand"}
            style={{ width: 150, textAlign: "center" }}
          />
          <Column
            field="category"
            filter={true}
            style={{ width: 150, textAlign: "center" }}
            header={this.props.language["category"] || "l_category"}
          />
          <Column
            field="unit"
            header={this.props.language["unit"] || "l_unit"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="standard"
            header={this.props.language["standard"] || "l_standard"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="fromDate"
            header={this.props.language["from_date"] || "l_from_date"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="toDate"
            header={this.props.language["to_date"] || "l_to_date"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          {/* <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column> */}
        </DataTable>
        {dialogInsert}
        {dialogUpdate}
      </Card>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    filterSOSTarget: state.sos.filterSOSTarget,
    exportSOSTarget: state.sos.exportSOSTarget,
    templateSOSTarget: state.sos.templateSOSTarget,
    importSOSTarget: state.sos.importSOSTarget,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SOSTargetController: bindActionCreators(SOSTargetActionCreators, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SOSTarget);
