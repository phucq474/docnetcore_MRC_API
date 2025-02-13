import React, { Component, PureComponent } from "react";
import { bindActionCreators } from "redux";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CategoryApp } from "../Controls/CategoryMaster";
import {
  getAccountId,
  download,
  HelpPermission,
  getLogin,
} from "../../Utils/Helpler";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { ProductCreateAction } from "../../store/ProductController";
import ProductPriceDialog from "./product-dialog";
import moment from "moment";
import Page403 from "../ErrorRoute/page403";
import { data } from "jquery";
import { InputTextarea } from "primereact/inputtextarea";
import { Type } from "ajv/dist/compile/util";
class ProductPrice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      datas: {},
      divisionId: 0,
      categoryId: "",
      subCateId: 0,
      segmentId: 0,
      subCateId: "",
      productCode: "",
      // customerCode: "",
      // shopCode: "",
      displayInsertDialog: false,
      displayDeleteDialog: false,
      inputValues: {
        year: parseInt(moment(new Date()).format("YYYY")),
        month: parseInt(moment(new Date()).format("MM")),
        dates: [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(),
        ],
      },
      year: { year: parseInt(moment(new Date()).format("YYYY")) },
      month: { month: parseInt(moment(new Date()).format("MM")) },
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      permission: {
        view: true,
        edit: true,
        import: true,
        export: true,
        delete: true,
        create: true,
      },
    };
    this.pageId = 3061;
    this.fileUpload = React.createRef();
    // Search
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInputSearch = this.handleInputSearch.bind(this);
    // action
    this.handleAction = this.handleAction.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleProductDropdownInsert =
      this.handleProductDropdownInsert.bind(this);
    //update
    this.handlePrice = this.handlePrice.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handlePriceBarrel = this.handlePriceBarrel.bind(this);
    // insert
    this.renderFooterInsertAction = this.renderFooterInsertAction.bind(this);
    this.handleDisplayInsertDialog = this.handleDisplayInsertDialog.bind(this);
    this.handleValidInput = this.handleValidInput.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    // delete
    this.renderFooterDeleteAction = this.renderFooterDeleteAction.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDisplayDeleteDialog = this.handleDisplayDeleteDialog.bind(this);
    // export
    this.handleLink = this.handleLink.bind(this);
    this.handleLinkTemplate = this.handleLinkTemplate.bind(this);
    // import
    this.handleImport = this.handleImport.bind(this);
  }
  Alert = (messager, typestyle) => {
    this.setState({ loading: false });
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: `${this.props.language["annoucement"] || "l_annoucement"} `,
      detail: messager,
    });
  };
  handleChange = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
  };
  handleChangeDropDown = async (id, value) => {
    let inputValues = this.state.inputValues;
    inputValues[id] = value ? value : null;
    await this.setState({ inputValues });
  };
  displayToastMessage(severity, toastMessage, actionState) {
    // 1:succeess  -1:failed
    let detail = "";
    if (actionState === 1) detail = "1 row affected";
    else if (actionState === -1) detail = "0 row affected";
    else detail = `Result ${actionState}`;
    this.toast.show({
      severity: severity,
      summary: toastMessage,
      detail: detail,
      life: 3000,
    });
  }
  async handleSearch(search) {
    const state = this.state;
    let data = {
      divisionId: state.divisionId ? state.divisionId : null,
      brandId: state.brandId ? state.brandId : null,
      categoryId: state.categoryId ? state.categoryId : null,
      productCode: state.productCode ? state.productCode : null,
      fromdate: state.dates[0]
        ? moment(state.dates[0]).format("YYYY-MM-DD")
        : null,
      todate: state.dates[1]
        ? moment(state.dates[1]).format("YYYY-MM-DD")
        : null,
    };
    await this.props.ProductController.FilterProductPrice(data);
    const result = await this.props.listProductPrice;
    if (result && result.length > 0) {
      await this.setState({ data: result });
      await this.Alert("Search thành công", "info");
    } else await this.Alert("Không có dữ liệu", "error");
    await this.setState({ isLoading: false });
  }
  handleChangeForm(e, stateName = "", subStateName) {
    this.setState({
      [stateName]: {
        ...this.state[stateName],
        [subStateName]: e.target.value == null ? "" : e.target.value,
      },
    });
  }
  handleDropDown(e, stateName, id) {
    if (id !== "fromtodate")
      this.setState({
        [stateName]: {
          ...this.state[stateName],
          [id]: e.target.value[id] == null ? "" : e.target.value[id],
        },
      });
    else
      this.setState({
        [stateName]: { ...this.state[stateName], dates: e.value },
      });
  }
  handleProductDropdownInsert(id, value) {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        productId: value,
      },
    });
  }
  handleInputSearch(e, statename = "") {
    this.setState({
      [statename]: e,
    });
  }
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
  // update
  handlePriceFromDate(rowData, stateName = "", event) {
    return (
      <div>
        <Calendar
          fluid
          id="formDate"
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
  handlePriceToDate(rowData, stateName = "", event) {
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
  handlePriceBarrel(rowData, stateName = "", event) {
    return (
      <div>
        <InputNumber
          id="barrelPrice"
          value={rowData[stateName] !== null ? rowData[stateName] : 0}
          onValueChange={(e) =>
            this.handleChangePriceNPD(
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
  handlePrice(rowData, stateName = "", event) {
    return (
      <div>
        <InputNumber
          value={rowData[stateName] !== null ? rowData[stateName] : 0}
          onValueChange={(e) =>
            this.handleChangePrice(
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
  handlePrice_FTR(rowData, stateName = "", event) {
    return (
      <div>
        <InputNumber
          value={rowData[stateName]}
          onValueChange={(e) =>
            this.handleChangePrice_FTR(
              stateName,
              e.target.id,
              e.target.value,
              event.rowIndex
            )
          }
          mode="decimal"
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
  handleChangePriceNPD = (id, value, index) => {
    let temp = this.state.data;
    temp[index].barrelPrice = value;
    this.setState({ data: temp });
  };
  handleChangePrice = (id, value, index) => {
    let temp = this.state.data;
    temp[index].price = value;
    this.setState({ data: temp });
  };

  handleChangePrice_FTR = (stateName, id, value, index) => {
    let temp = this.state.data;
    temp[index][`${stateName}`] = value;
    this.setState({ data: temp });
  };
  async handleUpdate(rowData, index) {
    await this.setState({ isLoading: true });
    const Action = "UPDATE";
    if (Action === "UPDATE") {
      const data =
        getLogin().accountName === "MARICO MT"
          ? {
              id: rowData.id,
              productId: rowData.productId,
              fromDate: rowData.fromDate,
              toDate: rowData.toDate,
              price: rowData.price,
              barrelPrice: rowData.barrelPrice,
            }
          : {
              id: rowData.id,
              recommendShelfPrice: rowData.recommendShelfPrice,
              retailerPrice: rowData.retailerPrice,
              retailerPriceNonVAT: rowData.retailerPriceNonVAT,
              barrelPrice: rowData.barrelPrice,
            };
      await this.props.ProductController.SaveProductPrice(Action, data, index);
      const result = this.props.saveProductPrice;
      if (result && result[0] && result[0].response === "1") {
        await this.setState({ data: this.props.listProductPrice });
        await this.highlightParentRow(index);
        await this.Alert("Cập nhập thành công", "info");
      } else await this.Alert(result[0].response, "error");
      await this.setState({ isLoading: false });
    } else {
      this.Alert("Khong co data", "Error");
    }
  }
  // delete
  handleDisplayDeleteDialog(boolean, rowData, index) {
    if (boolean === "true") {
      this.setState({
        displayDeleteDialog: true,
        id: rowData.id,
        indexDelete: index,
      });
    } else this.setState({ displayDeleteDialog: false });
  }
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
  async handleDelete() {
    await this.setState({ isLoading: true });
    const Action = "DELETE";
    if (Action === "DELETE") {
      let id = {
        id: this.state.id,
      };
      await this.props.ProductController.SaveProductPrice(
        Action,
        id,
        this.state.indexDelete
      );
      const result = this.props.saveProductPrice;
      if (result && result[0] && result[0].response === "1") {
        await this.Alert("Xóa thành công", "info");
        await this.setState({ data: this.props.listProductPrice });
      } else await this.Alert(result[0].response, "error");
      await this.setState({ isLoading: false, displayDeleteDialog: false });
    } else {
      await this.Alert("Khong co data", "error");
    }
  }
  // insert
  renderFooterInsertAction() {
    return (
      <div>
        <Button
          label={this.props.language["cancel"] || "l_cancel"}
          icon="pi pi-times"
          className="p-button-info"
          onClick={() => this.handleDisplayInsertDialog("false")}
        />
        <Button
          label={this.props.language["save"] || "l_save"}
          icon="pi pi-check"
          className="p-button-success"
          Action="INSERT"
          onClick={() => this.handleInsert()}
        />
      </div>
    );
  }
  handleDisplayInsertDialog(boolean) {
    if (boolean === "true") {
      this.setState({ displayInsertDialog: true });
    } else {
      this.setState({ displayInsertDialog: false, inputValues: {} });
    }
  }
  async handleValidInput() {
    let check = true;
    let AccountId = JSON.parse(localStorage.getItem("USER")).accountId;
    const inputValues = this.state.inputValues;
    if (!inputValues.dates || !inputValues.dates[0]) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorDates: "Input Required",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorDates: "" },
      });

    if (!inputValues.productId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorProductCode: "Input Required",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorProductCode: "" },
      });

    if (getLogin().accountName === "MARICO MT") {
      if (!inputValues.price) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorPrice: "Input Required",
          },
        });
        check = false;
      } else {
        if (inputValues.price <= 0) {
          await this.setState({
            inputValues: {
              ...this.state.inputValues,
              errorPrice: "Cannot be Zero or Nagative Number",
            },
          });
          check = false;
        } else
          await this.setState({
            inputValues: { ...this.state.inputValues, errorPrice: "" },
          });
        //---------
        // if (this.state.inputValues.barrelPrice <= 0) {
        //     await this.setState({ inputValues: { ...this.state.inputValues, errorBarrelPrice: "Cannot be Zero or Nagative Number" } });
        //     check = false
        // } else await this.setState({ inputValues: { ...this.state.inputValues, errorBarrelPrice: "" } });
      }
    } else {
      if (!inputValues.retailerPrice) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorRetailerPrice: "Input Required",
          },
        });
        check = false;
      } else {
        if (inputValues.retailerPrice <= 0) {
          await this.setState({
            inputValues: {
              ...this.state.inputValues,
              errorRetailerPrice: "Cannot be Zero or Nagative Number",
            },
          });
          check = false;
        } else
          await this.setState({
            inputValues: { ...this.state.inputValues, errorRetailerPrice: "" },
          });
      }
    }

    if (!check) return false;
    else return true;
  }
  async handleInsert() {
    const inputValues = this.state.inputValues;
    if (await this.handleValidInput()) {
      await this.setState({ isLoading: true });
      const Action = "INSERT";
      if (Action === "INSERT") {
        const data =
          getLogin().accountName === "MARICO MT"
            ? {
                customerId: null,
                shopId: null,
                productId: inputValues.productId,
                price: inputValues.price,
                barrelPrice: inputValues.barrelPrice || 0,
                fromDate: moment(inputValues.dates[0]).format("YYYY-MM-DD"),
                toDate: inputValues.dates[1]
                  ? moment(inputValues.dates[1]).format("YYYY-MM-DD")
                  : null,
              }
            : {
                customerId: null,
                shopId: null,
                productId: inputValues.productId,
                recommendSheftPrice: inputValues.recommendSheftPrice || null,
                retailerPrice: inputValues.retailerPrice || null,
                retailerPriceNonVAT: inputValues.retailerPriceNonVAT || null,
                barrelPrice: inputValues.barrelPrice || null,
                fromDate: moment(inputValues.dates[0]).format("YYYY-MM-DD"),
                toDate: inputValues.dates[1]
                  ? moment(inputValues.dates[1]).format("YYYY-MM-DD")
                  : null,
              };
        await this.props.ProductController.SaveProductPrice(Action, data);
        const result = await this.props.saveProductPrice;
        if (result && result[0] && result[0].response === "1") {
          await this.Alert("Thêm thành công", "info");
          await this.setState({
            displayInsertDialog: false,
            data: this.props.listProductPrice,
            inputValues: {},
          });
        } else this.Alert(result[0].response, "error");
      } else {
        this.Alert("Thất bại Không có data", "error");
      }
    }
    await this.setState({ isLoading: false });
  }
  //export
  async handleLink() {
    await this.setState({ isLoading: true });
    const state = this.state;
    let data = {
      divisionId: state.divisionId ? state.divisionId : null,
      brandId: state.brandId ? state.brandId : null,
      categoryId: state.categoryId ? state.categoryId : null,
      productCode: state.productCode ? state.productCode : null,
      fromdate: state.dates[0]
        ? moment(state.dates[0]).format("YYYY-MM-DD")
        : null,
      todate: state.dates[1]
        ? moment(state.dates[1]).format("YYYY-MM-DD")
        : null,
    };
    await this.props.ProductController.ExportProductPrice(
      getLogin().accountName,
      data
    );
    const result = this.props.exportProductPrice;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ isLoading: false });
  }
  /// template
  async handleLinkTemplate() {
    await this.setState({ isLoading: true });
    await this.props.ProductController.TemplateProductPrice(
      getLogin().accountName
    );
    const result = this.props.templateProductPrice;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ isLoading: false });
  }
  // import
  async handleImport(e) {
    await this.setState({ isLoading: true });
    await this.props.ProductController.ImportProductPrice(
      e.files[0],
      getLogin().accountName
    );
    const result = this.props.importProductPrice;
    if (result && result.status === 1) {
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.fileUpload.current.clear();
    await this.setState({ isLoading: false });
  }
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
  showProduct = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <strong>{rowData.productCode}</strong>
        </div>
        <p>{rowData.productName}</p>
      </div>
    );
  };
  async componentWillMount() {
    const month = [];
    const year = [];
    for (let i = 1; i <= 12; i++) {
      await month.push({ month: i });
    }
    for (let j = 2017; j <= 2030; j++) {
      await year.push({ year: j });
    }
    // let permission = await HelpPermission(this.pageId);
    await this.setState({ months: month, years: year });
  }
  async componentDidMount() {
    await this.props.ProductController.GetCategory();
  }
  render() {
    let leftButton = [],
      rightButton = [];
    if (this.state.permission) {
      if (this.state.permission.view) {
        leftButton.push(
          <Button
            label={this.props.language["search"] || "l_search"}
            icon="pi pi-search"
            style={{ marginRight: 10 }}
            className="p-button-success"
            onClick={this.handleSearch}
          ></Button>
        );
      }
      if (this.state.permission.export) {
        leftButton.push(
          <Button
            label={this.props.language["export"] || "l_export"}
            icon="pi pi-download"
            className="p-button-danger"
            onClick={this.handleLink}
          ></Button>
        );
      }
      if (this.state.permission.create) {
        rightButton.push(
          <Button
            icon="pi pi-plus"
            label={this.props.language["insert"] || "l_insert"}
            className="p-button-info"
            style={{ marginRight: 10 }}
            onClick={() => this.handleDisplayInsertDialog("true")}
          />
        );
      }
      if (this.state.permission.import) {
        rightButton.push(
          <Button
            label={this.props.language["template"] || "l_template"}
            icon="pi pi-download"
            className="p-button-success"
            style={{ marginRight: 10 }}
            onClick={this.handleLinkTemplate}
          ></Button>
        );
        rightButton.push(
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            ref={this.fileUpload}
            mode="basic"
            onClear={this.clear}
            onSelect={(e) => {
              console.log(e);
            }}
            uploadHandler={this.handleImport}
            customUpload={true}
            accept=".xlsx,.xls"
            maxFileSize={10000000}
            style={{ marginRight: "15px" }}
          />
        );
        rightButton.push(
          <Button
            icon="pi pi-times"
            style={{ marginLeft: 10 }}
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
              this.fileUpload.current.fileInput = { value: "" };
              this.fileUpload.current.clear();
            }}
          />
        );
      }
    }

    return this.state.permission.view ? (
      <div>
        <Dialog
          header="Delete"
          visible={this.state.displayDeleteDialog}
          style={{ width: "50vw" }}
          footer={this.renderFooterDeleteAction()}
          onHide={() => this.handleDisplayDeleteDialog("false")}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>Are you sure you want to proceed?</span>
          </div>
        </Dialog>
        <Toast ref={(el) => (this.toast = el)} />
        <ProductPriceDialog
          displayDialog={this.state.displayInsertDialog}
          footerAction={this.renderFooterInsertAction}
          handleInput={this.handleChangeForm}
          displayOnHide={this.handleDisplayInsertDialog}
          inputValues={this.state.inputValues}
          stateName={"inputValues"}
          months={this.state.months}
          years={this.state.years}
          handleDropDown={this.handleDropDown}
          handleProductDropdown={this.handleProductDropdownInsert}
          handleChangeDropDown={this.handleChangeDropDown}
          language={this.props.language}
        />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-grid p-fluid p-formgrid">
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
              <CategoryApp {...this} />
              <div className="p-field p-col-12 p-md-3 p-sm-6">
                <label>
                  {this.props.language["product.code"] || "product.code"}
                </label>
                <InputText
                  disabled={this.state.productId > 0 ? true : false}
                  value={this.state.productCode}
                  onChange={(e) =>
                    this.handleInputSearch(e.target.value, "productCode")
                  }
                ></InputText>
              </div>
            </div>
            <Toolbar
              left={leftButton}
              right={rightButton}
              style={{ marginTop: "10px" }}
            />
            {this.state.isLoading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "10px" }}
              ></ProgressBar>
            )}
          </AccordionTab>
        </Accordion>
        <DataTable
          value={this.state.data}
          paginator
          rows={20}
          paginatorPosition={"both"}
          rowHover
          fontSize="13px"
          resizableColumns
          columnResizeMode="expand"
        >
          <Column
            filter
            field="rowNum"
            header="No."
            style={{ width: 50, textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="division"
            header="Division"
            style={{ width: 100, textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="brand"
            header={this.props.language["brand"] || "l_brand"}
            style={{ width: 100, textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="category"
            header={this.props.language["category"] || "l_category"}
            style={{ width: 120, textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="productCode"
            header={this.props.language["product_name"] || "l_product_name"}
            style={{ width: 300, textAlign: "center" }}
            body={this.showProduct}
          ></Column>
          <Column
            filter
            field="fromDate"
            body={(rowData, e) =>
              this.handlePriceFromDate(rowData, "fromDate", e)
            }
            header={this.props.language["from_date"] || "l_from_date"}
            style={{ width: 150, textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="toDate"
            body={(rowData, e) => this.handlePriceToDate(rowData, "toDate", e)}
            header={this.props.language["to_date"] || "l_to_date"}
            style={{ width: 150, textAlign: "center" }}
          ></Column>
          {getLogin().accountName !== "Fonterra" && (
            <Column
              filter
              field="price"
              body={(rowData, e) => this.handlePrice(rowData, "price", e)}
              header="Price"
              style={{ width: 170, textAlign: "center" }}
            ></Column>
          )}
          {getLogin().accountName !== "Fonterra" && (
            <Column
              filter
              body={(rowData, e) =>
                this.handlePriceBarrel(rowData, "barrelPrice", e)
              }
              header={this.props.language["barrel_price"] || "l_barrel_price"}
              style={{ width: 170, textAlign: "center" }}
            ></Column>
          )}
          {getLogin().accountName === "Fonterra" && (
            <Column
              filter
              body={(rowData, e) =>
                this.handlePrice_FTR(rowData, "recommendShelfPrice", e)
              }
              header="recommendShelfPrice"
              style={{ width: "7%" }}
            ></Column>
          )}
          {getLogin().accountName === "Fonterra" && (
            <Column
              filter
              body={(rowData, e) =>
                this.handlePrice_FTR(rowData, "retailerPrice", e)
              }
              header="retailerPrice"
              style={{ width: "7%" }}
            ></Column>
          )}
          {getLogin().accountName === "Fonterra" && (
            <Column
              filter
              body={(rowData, e) =>
                this.handlePrice_FTR(rowData, "retailerPriceNonVAT", e)
              }
              header="retailerPriceNonVAT"
              style={{ width: "7%" }}
            ></Column>
          )}
          {getLogin().accountName === "Fonterra" && (
            <Column
              filter
              body={(rowData, e) =>
                this.handlePrice_FTR(rowData, "barrelPrice", e)
              }
              header={this.props.language["barrel_price"] || "l_barrel_price"}
              style={{ width: "7%" }}
            ></Column>
          )}
          <Column
            body={(rowData, e) => this.handleAction(rowData, e)}
            header="Tool"
            style={{ width: 120, textAlign: "center" }}
          ></Column>
        </DataTable>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    usedivision: true,
    usebrand: true,
    usecate: true,
    usesubcate: false,
    usesegment: false,
    categories: state.products.categories,
    productCates: state.products.productCates,
    listProductPrice: state.products.listProductPrice,
    insertProductPrice: state.products.insertProductPrice,
    updateProductPrice: state.products.updateProductPrice,
    saveProductPrice: state.products.saveProductPrice,
    importProductPrice: state.products.importProductPrice,
    deleteProductPrice: state.products.deleteProductPrice,
    exportProductPrice: state.products.exportProductPrice,
    templateProductPrice: state.products.templateProductPrice,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductPrice);
