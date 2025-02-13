import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CategoryApp } from "../Controls/CategoryMaster";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { ProgressBar } from "primereact/progressbar";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { ProductCreateAction } from "../../store/ProductController";
import TimeShiftDialog from "../WorkingPlan/WorkingPlan-TimeShiftDialog";
import { download, HelpPermission } from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import moment from "moment";
class WorkingPlanTimeShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoading: false,
      dates: {},
      subCateId: 0,
      segmentId: 0,
      division: "",
      categoryId: "",
      subCateId: "",
      productCode: "",
      displayInsertDialog: false,
      displayDeleteDialog: false,
      inputValues: {},
      dateInsert: [],
      displayEditDialog: false,
      displayConfirmation: false,
      confirm: false,
      permission: {},
    };
    this.pageId = 15;
    this.fileUpload = React.createRef();
    //toast
    this.displayToastMessage = this.displayToastMessage.bind(this);
    //search
    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleDropDownShift = this.handleDropDownShift.bind(this);
    //insert
    this.handleDisplayInsertDialog = this.handleDisplayInsertDialog.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleCalendar = this.handleCalendar.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleCate = this.handleCate.bind(this);
    this.handleValid = this.handleValid.bind(this);
    // Edit
    this.handleDisplayEditDialog = this.handleDisplayEditDialog.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleCalendarEdit = this.handleCalendarEdit.bind(this);
    //delete
    this.renderFooterDeleteAction = this.renderFooterDeleteAction.bind(this);
    this.handleDisplayDeleteDialog = this.handleDisplayDeleteDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    //export
    this.handleLink = this.handleLink.bind(this);
    this.handleLinkTemplate = this.handleLinkTemplate.bind(this);
    //import
    this.handleImport = this.handleImport.bind(this);
    // confirm
    this.renderFooterConfirm = this.renderFooterConfirm.bind(this);
    this.displayConfirm = this.displayConfirm.bind(this);
    this.confirmAction = this.confirmAction.bind(this);
  }
  handleAction(rowData, event) {
    return (
      <div>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-info p-mr-2"
            onClick={() =>
              this.handleDisplayEditDialog("true", rowData, event.rowIndex)
            }
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
  //Confirm
  renderFooterConfirm() {
    return (
      <div>
        <Button
          hidden={this.state.delete}
          label={this.props.language["cancel"] || "l_cancel"}
          className="p-button-danger"
          icon="pi pi-times"
          onClick={() => this.displayConfirm("false")}
        />
        <Button
          hidden={this.state.delete}
          label={this.props.language["continute"] || "l_continute"}
          className="p-button-info"
          icon="pi pi-check"
          onClick={() => this.confirmAction()}
        />
      </div>
    );
  }
  displayConfirm(boolean) {
    if (boolean === "true") {
      this.setState({ displayConfirmation: true });
    } else {
      this.setState({
        displayConfirmation: false,
        confirm: false,
      });
    }
  }
  async confirmAction() {
    await this.props.WorkingPlanController.Insert_TimeShift(
      this.state.inputValues.shopId,
      this.state.inputValues.categoryId || "",
      this.state.inputValues.FromDate,
      this.state.inputValues.ToDate,
      this.state.inputValues.shift,
      this.state.inputValues.From,
      this.state.inputValues.To,
      this.state.inputValues.From1 || "",
      this.state.inputValues.To1 || ""
    );
    const result = await this.props.insertTimeShift;
    if (result !== -1 && result[0] && result[0].alert === "1") {
      await this.setState({
        isLoading: false,
        inputValues: {},
        dateInsert: null,
        displayConfirmation: false,
        dates: "",
        data: this.props.filterTimeShift,
      });
      await this.displayToastMessage("info", "Insert succeed", 1);
    } else await this.displayToastMessage("error", "Insert failed", -1);
  }
  //search
  handleChange = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
  };
  handleInputSearch(e, statename = "") {
    this.setState({
      [statename]: e,
    });
  }
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
  async handleDate() {
    let FromDate = "",
      ToDate = "";
    if (this.state.dates) {
      if (this.state.dates[0]) {
        let fromYear = this.state.dates[0].getFullYear().toString();
        let fromMonth = ("0" + (this.state.dates[0].getMonth() + 1)).slice(-2);
        let fromDay = ("0" + this.state.dates[0].getDate()).slice(-2);
        FromDate = fromYear + fromMonth + fromDay;
      }
      if (this.state.dates[1]) {
        let toYear = this.state.dates[1].getFullYear().toString();
        let toMonth = ("0" + (this.state.dates[1].getMonth() + 1)).slice(-2);
        let toDay = ("0" + this.state.dates[1].getDate()).slice(-2);
        ToDate = toYear + toMonth + toDay;
      }
      await this.setState({ FromDate: FromDate, ToDate: ToDate });
    }
  }
  async handleSearch() {
    await this.handleDate();
    await this.setState({ isLoading: true });
    await this.props.WorkingPlanController.Filter_TimeShift(
      this.state.FromDate || "",
      this.state.ToDate || "",
      this.state.dealerId || "",
      this.state.shopCodeSearch || "",
      this.state.categoryId || ""
    );
    const data = this.props.filterTimeShift;
    await this.setState({ data: data, isLoading: false });
    if (data) {
      await this.displayToastMessage("success", "Search succeed", data.length);
    } else await this.displayToastMessage("error", "Search failed", -1);
  }
  // Edit
  handleDisplayEditDialog(boolean, rowData, index) {
    if (boolean === "true") {
      let fromDate = new Date(rowData.fromDate);
      this.setState({
        actionName: "Edit",
        displayEditDialog: true,
        inputValues: {
          ...this.state.inputValues,
          categoryId: rowData.categoryId,
          toDate: rowData.toDate ? rowData.toDate : [],
          fromTo: rowData.fromTo ? rowData.fromTo : "",
          shift: rowData.shift ? rowData.shift : "",
          id: rowData.timeShiftId,
          fromDate: fromDate ? fromDate : "",
          index: index,
        },
      });
    } else {
      this.setState({ displayEditDialog: false, inputValues: {} });
    }
  }
  async handleUpdate() {
    const fromDate = await parseInt(
      moment(this.state.inputValues.fromDate).format("YYYYMMDD")
    );
    const toDate = await parseInt(
      moment(this.state.inputValues.toDate).format("YYYYMMDD")
    );
    if (this.state.inputValues.fromTo.length < 11) {
      return await this.setState({
        inputValues: { ...this.state.inputValues, errorFromTo: "Error Time" },
      });
    }
    if (fromDate > toDate) {
      return await this.setState({
        inputValues: { ...this.state.inputValues, errorToDate: "Error Date" },
      });
    }
    await this.setState({
      inputValues: { ...this.state.inputValues, errorFromTo: "" },
    });
    await this.setState({ isLoading: true });
    await this.props.WorkingPlanController.Update_TimeShift(
      this.state.inputValues.id,
      this.state.inputValues.toDate,
      this.state.inputValues.categoryId || "",
      this.state.inputValues.fromTo,
      this.state.inputValues.shift.toUpperCase(),
      this.state.inputValues.index
    );
    const result = this.props.UpdateTimeShift;
    if (result && result[0] && result[0].alert === "1") {
      await this.displayToastMessage("info", "Update succeed", 1);
      await this.highlightParentRow(this.state.inputValues.index);
      await this.setState({
        data: this.props.filterTimeShift,
        displayEditDialog: false,
        inputValues: {},
      });
    } else await this.displayToastMessage("error", "Update failed", 0);
    await this.setState({ isLoading: false });
  }
  // insert
  handleDropDown(e, stateName, id) {
    this.setState({
      [stateName]: {
        ...this.state[stateName],
        [id]: e.target.value == null ? "" : e.target.value[id],
        shopName: e.value,
      },
    });
  }
  async handleDisplayInsertDialog(boolean) {
    if (boolean === "true") {
      await this.setState({
        actionName: "Insert",
        displayInsertDialog: true,
      });
    } else {
      await this.setState({
        displayInsertDialog: false,
        isLoading: false,
      });
    }
  }
  handleChangeForm(e, stateName = "", subStateName) {
    this.setState({
      [stateName]: {
        ...this.state[stateName],
        [subStateName]: e.target.value == null ? "" : e.target.value,
      },
    });
  }
  handleDropDownShift(e, stateName, id) {
    this.setState({
      [stateName]: {
        ...this.state[stateName],
        [id]: e.target.value == null ? "" : e.target.value[id],
        shifts: e.value,
      },
    });
  }
  handleCate(id, value) {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  }
  async handleValid() {
    let check = true;
    if (!this.state.inputValues.FromDate) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorFromDate: "Input Required",
        },
      });
      check = false;
    } else {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorFromDate: "" },
      });
    }
    if (!this.state.inputValues.shopId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShopId: "Input Required",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorShopId: "" },
      });
    if (!this.state.inputValues.shift) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShift: "Input Required",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorShift: "" },
      });
    if (!this.state.inputValues.From) {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorFrom: "Input Required" },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorFrom: "" },
      });
    if (!this.state.inputValues.To) {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorTo: "Input Required" },
      });
      check = false;
    } else if (this.state.inputValues.To <= this.state.inputValues.From) {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorTo: "Error Time" },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorTo: "" },
      });
    if (this.state.inputValues.To1 <= this.state.inputValues.From1) {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorTo1: "Error Time" },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorTo1: "" },
      });
    if (!check) return false;
    else return true;
  }
  async handleInsert() {
    try {
      await this.setState({ isLoading: true });
      if (await this.handleValid()) {
        await this.props.WorkingPlanController.CheckInsert_TimeShift(
          this.state.inputValues.shopId,
          this.state.inputValues.categoryId || "",
          this.state.inputValues.FromDate,
          this.state.inputValues.shift
        );
        let checkInsert = this.props.checkInsertTimeShift.result;
        if (checkInsert === 1) {
          await this.props.WorkingPlanController.Insert_TimeShift(
            this.state.inputValues.shopId,
            this.state.inputValues.categoryId || "",
            this.state.inputValues.FromDate,
            this.state.inputValues.ToDate,
            this.state.inputValues.shift,
            this.state.inputValues.From,
            this.state.inputValues.To,
            this.state.inputValues.From1 || "",
            this.state.inputValues.To1 || ""
          );
          const result = await this.props.insertTimeShift;
          if (result !== -1 && result[0] && result[0].alert === "1") {
            await this.setState({
              data: this.props.filterTimeShift,
              dateInsert: [],
              inputValues: {},
              dates: "",
            });
            await this.displayToastMessage("info", "Insert succeed", 1);
          } else await this.displayToastMessage("error", "Insert failed", 0);
        } else if (checkInsert === -1) {
          await this.displayConfirm("true");
        } else await this.displayToastMessage("error", "Insert failed", -1);
        await this.setState({ isLoading: false });
      }
    } catch (e) {
      await this.displayToastMessage("error", "Insert failed", 0);
    }
  }
  async handleCalendar(e) {
    let FromDate = "",
      ToDate = "";
    if (e.target.value) {
      if (e.target.value[0]) {
        let fromYear = e.target.value[0].getFullYear().toString();
        let fromMonth = ("0" + (e.target.value[0].getMonth() + 1)).slice(-2);
        let fromDay = ("0" + e.target.value[0].getDate()).slice(-2);
        FromDate = fromYear + "-" + fromMonth + "-" + fromDay;
      }
      if (e.target.value[1]) {
        let toYear = e.target.value[1].getFullYear().toString();
        let toMonth = ("0" + (e.target.value[1].getMonth() + 1)).slice(-2);
        let toDay = ("0" + e.target.value[1].getDate()).slice(-2);
        ToDate = toYear + "-" + toMonth + "-" + toDay;
      }
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          FromDate: FromDate,
          ToDate: ToDate,
        },
        dateInsert: e.value,
      });
    }
  }
  async handleCalendarEdit(e) {
    let toDate = "";
    if (e.target.value) {
      let toYear = e.target.value.getFullYear().toString();
      let toMonth = ("0" + (e.target.value.getMonth() + 1)).slice(-2);
      let toDay = ("0" + e.target.value.getDate()).slice(-2);
      toDate = toYear + "-" + toMonth + "-" + toDay;
    }
    await this.setState({
      inputValues: { ...this.state.inputValues, toDate: toDate },
    });
  }
  // delete
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
          onClick={() => this.handleDelete()}
        />
      </div>
    );
  }
  handleDisplayDeleteDialog(boolean, rowData, index) {
    if (boolean === "true") {
      // this.handleDelete()
      this.setState({
        displayDeleteDialog: true,
        deletedata: rowData,
        deleteIndex: index,
      });
    } else {
      this.setState({
        displayDeleteDialog: false,
        deletedata: [],
      });
    }
  }
  async handleDelete() {
    await this.setState({ isLoading: true });
    await this.props.WorkingPlanController.Delete_TimeShift(
      this.state.deletedata.timeShiftId,
      this.state.deleteIndex
    );
    const result = this.props.DeleteTimeShift[0].result;
    const messenger = this.props.DeleteTimeShift[0].messenger;
    if (result === 1) {
      await this.setState({
        displayDeleteDialog: false,
        data: this.props.filterTimeShift,
      });
      await this.displayToastMessage("info", "Delete succeed", messenger);
    } else await this.displayToastMessage("error", "Delete failed", messenger);
    await this.setState({ isLoading: false });
  }
  //export
  async handleLink() {
    await this.setState({ isLoading: true });
    await this.handleDate();
    await this.props.WorkingPlanController.Export_TimeShift(
      this.state.FromDate,
      this.state.ToDate || "",
      this.state.dealerId || "",
      this.state.shopCodeSearch || "",
      this.state.categoryId || ""
    );
    const result = this.props.ExportTimeShift[0].status;
    const messenger = this.props.ExportTimeShift[0].message;
    const fileUrl = this.props.ExportTimeShift[0].fileUrl;
    if (result === 1) {
      await download(fileUrl);
      await this.setState({ isLoading: false });
      await this.displayToastMessage("success", "Export succeed", messenger);
    } else {
      await this.setState({ isLoading: false });
      await this.displayToastMessage("error", "Export failed", messenger);
    }
  }
  async handleLinkTemplate() {
    await this.setState({ isLoading: true });
    await this.handleDate();
    await this.props.WorkingPlanController.Export_Template_TimeShift(
      this.state.FromDate,
      this.state.shopCodeSearch || ""
    );
    const result = this.props.ExportTemplateTimeShift[0].status;
    const messenger = this.props.ExportTemplateTimeShift[0].message;
    const fileUrl = this.props.ExportTemplateTimeShift[0].fileUrl;
    if (result === 1) {
      await download(fileUrl);
      await this.setState({ isLoading: false });
      await this.displayToastMessage("success", "Export succeed", messenger);
    } else {
      await this.setState({ isLoading: false });
      await this.displayToastMessage("error", "Export failed", messenger);
    }
  }
  // Import
  async handleImport(e) {
    await this.setState({ isLoading: true });
    await this.props.WorkingPlanController.Import_TimeShift(e.files[0]);
    const result = this.props.ImportTimeShift[0].status;
    const messenger = this.props.ImportTimeShift[0].message;
    if (result === 1) {
      await this.setState({ isLoading: false });
      await this.displayToastMessage("success", "Import succeed", messenger);
      await this.fileUpload.current.clear();
    } else {
      await this.setState({ isLoading: false });
      await this.displayToastMessage("error", "Import failed", messenger);
      await this.fileUpload.current.clear();
    }
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
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  async componentDidMount() {
    await this.props.ProductController.GetCategory();
  }
  render() {
    let leftButton = [],
      rightButton = [],
      html = [];
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
            className="p-button-danger ml-2"
            style={{ marginRight: 10 }}
            onClick={this.handleLink}
          ></Button>
        );
        rightButton.push(
          <Button
            label={"Template"}
            icon="pi pi-download"
            className="p-button-danger ml-2"
            style={{ marginRight: 10 }}
            onClick={this.handleLinkTemplate}
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
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            ref={this.fileUpload}
            mode="basic"
            onClear={this.clear}
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
      if (this.state.actionName === "Insert") {
        html.push(
          <div>
            <TimeShiftDialog
              handleChangeCate={this.handleCate}
              actionName={"Insert"}
              stateName={"inputValues"}
              dialogStateName={"displayInsertDialog"}
              inputValues={this.state.inputValues}
              displayDialog={this.state.displayInsertDialog}
              footerAction={this.renderFooterInsertAction}
              handleChangeForm={this.handleChangeForm}
              displayOnHide={this.handleDisplayInsertDialog}
              handleDropDown={this.handleDropDown}
              handleCalendar={this.handleCalendar}
              handleCate={this.handleCate}
              FromToDate={this.state.dateInsert}
              handleSideBarAction={this.handleInsert}
              handleDropDownShift={this.handleDropDownShift}
            />
          </div>
        );
      }
      if (this.state.actionName === "Edit") {
        html.push(
          <div>
            <TimeShiftDialog
              actionName={"Edit"}
              stateName={"inputValues"}
              dialogStateName={"displayEditDialog"}
              inputValues={this.state.inputValues}
              displayDialog={this.state.displayEditDialog}
              footerAction={this.renderFooterEditAction}
              displayOnHide={this.handleDisplayEditDialog}
              handleChangeCate={this.handleCate}
              handleDropDown={this.handleDropDown}
              handleCalendarEdit={this.handleCalendarEdit}
              handleChangeForm={this.handleChangeForm}
              handleSideBarAction={this.handleUpdate}
              FromToDate={this.state.dateInsert}
              handleDropDownShift={this.handleDropDownShift}
            />
          </div>
        );
      }
    }
    return this.state.permission.view ? (
      <div>
        {html}
        <Toast ref={(el) => (this.toast = el)} baseZIndex={1200} />
        <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div>
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
                    showButtonBar
                  />
                </div>
                <div className="p-col-12 p-md-3 p-sm-6">
                  <label>
                    {this.props.language["storelist_shopcode"] ||
                      "storelist_shopcode"}
                  </label>
                  <InputText
                    disabled={this.state.productId > 0 ? true : false}
                    value={this.state.shopCodeSearch}
                    onChange={(e) =>
                      this.handleInputSearch(e.target.value, "shopCodeSearch")
                    }
                  ></InputText>
                </div>
                <CategoryApp {...this} />
              </div>
              <Toolbar
                left={leftButton}
                right={rightButton}
                style={{ marginTop: "10px" }}
              />
              {this.state.isLoading == true ? (
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "5px" }}
                ></ProgressBar>
              ) : null}
            </div>
          </AccordionTab>
        </Accordion>
        <DataTable
          value={this.state.data}
          paginator
          rows={20}
          rowHover
          dataKey="rowNum"
        >
          <Column
            filter
            field="rowNum"
            header={this.props.language["no."] || "l_no."}
            style={{ width: 60 }}
          ></Column>
          <Column
            filter
            field="shopCode"
            header={this.props.language["shop_code"] || "l_shop_code"}
            style={{ textAlign: "center", width: "10%" }}
          ></Column>
          <Column
            filter
            field="shopName"
            header={this.props.language["shop_name"] || "l_shop_name"}
            style={{ textAlign: "center", width: "18%" }}
          ></Column>
          <Column
            filter
            field="category"
            header={this.props.language["category"] || "l_category"}
            style={{ textAlign: "center", width: "10%" }}
          ></Column>
          <Column
            filter
            field="fromDate"
            header={this.props.language["from_date"] || "l_from_date"}
            style={{ textAlign: "center", width: "10%" }}
          ></Column>
          <Column
            filter
            field="toDate"
            header={this.props.language["to_date"] || "l_to_date"}
            style={{ textAlign: "center", width: "10%" }}
          ></Column>
          <Column
            filter
            field="shift"
            header={this.props.language["shift"] || "l_shift"}
            style={{ textAlign: "center", width: "7%" }}
          ></Column>
          <Column
            filter
            field="fromTo"
            header={this.props.language["from_to"] || "l_from_to"}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            filter
            body={(rowData, e) => this.handleAction(rowData, e)}
            header={this.props.language["tool"] || "l_tool"}
            style={{ textAlign: "center", width: "10%" }}
          ></Column>
        </DataTable>
        <Dialog
          baseZIndex={1200}
          header="Confirmation"
          visible={this.state.displayConfirmation}
          modal
          style={{ width: "40vw" }}
          footer={this.renderFooterConfirm()}
          onHide={() => this.displayConfirm("false")}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["timeshift_hasnt_finished_yet"] ||
                "l_cancel"}{" "}
            </span>
          </div>
        </Dialog>

        <Dialog
          header="Delete"
          visible={this.state.displayDeleteDialog}
          style={{ width: "30vw" }}
          footer={this.renderFooterDeleteAction()}
          onHide={() => this.handleDisplayDeleteDialog("false")}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["confirm_to_delete"] ||
                "l_confirm_to_delete"}
              ?
            </span>
          </div>
        </Dialog>
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    usecate: true,
    categories: state.products.categories,
    productCates: state.products.productCates,
    language: state.languageList.language,
    filterTimeShift: state.workingPlans.filterTimeShift,
    checkInsertTimeShift: state.workingPlans.checkInsertTimeShift,
    insertTimeShift: state.workingPlans.insertTimeShift,
    UpdateTimeShift: state.workingPlans.UpdateTimeShift,
    DeleteTimeShift: state.workingPlans.DeleteTimeShift,
    ExportTimeShift: state.workingPlans.ExportTimeShift,
    ExportTemplateTimeShift: state.workingPlans.ExportTemplateTimeShift,
    ImportTimeShift: state.workingPlans.ImportTimeShift,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingPlanTimeShift);
