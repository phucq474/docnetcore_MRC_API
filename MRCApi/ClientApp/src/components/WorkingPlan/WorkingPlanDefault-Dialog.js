import React, { Component } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { connect } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import ShopDropDownList from "../Controls/ShopDropDownList";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ShiftDropDownList from "../Controls/ShiftDropDownList";
import { bindActionCreators } from "redux";
import { ShopTargetAPI } from "../../store/ShopTargetController";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import moment from "moment";
class WorkingPlanDefaultDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      divisionId: "",
      categoryId: 0,
      subCatId: 0,
      variantId: 0,
      brandId: 0,
      labelButton: "No File Chosen",
      deleteTableDialog: false,
    };
    this.images = React.createRef();
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  handleChange = async (id, value) => {
    await this.setState({ [id]: value === null ? "" : value });
    await this.props.handleChangeDropDown(id, value);
  };
  checkBoxInsert = (rowData, event, id) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          checked={rowData[id] === 1 ? true : false}
          onChange={(e) =>
            this.props.handleChangeCheckBox(
              id,
              e.checked,
              event.rowIndex,
              "Insert"
            )
          }
        ></Checkbox>
      </div>
    );
  };
  checkBoxData = (rowData, event, id) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          checked={rowData[id] === 1 ? true : false}
          onChange={(e) =>
            this.props.nameAction === "Insert"
              ? this.props.handleChangeCheckBox(
                  id,
                  e.checked,
                  event.rowIndex,
                  "Insert"
                )
              : this.props.handleChangeCheckBox(id, e.checked, event.rowIndex)
          }
        ></Checkbox>
      </div>
    );
  };
  showShiftCode = (rowData, event) => {
    let typeName = null;
    const inputValues = this.props.inputValues;
    if (inputValues.positionId === 3) typeName = "ALPHA";
    else if (inputValues.positionId === 6) typeName = "MT";
    const shiftLists = this.props.shiftLists.filter(
      (item) =>
        (item.shiftGroup === typeName && item.refCode === "ON") ||
        typeName === null
    );
    let result = [];
    if (shiftLists.length > 0) {
      shiftLists.forEach((element) => {
        result.push({
          name: element.shiftCode + " (" + element.shiftName + ")",
          value: element.shiftCode,
          shiftName: element.shiftName,
        });
      });
    }
    return (
      <div>
        <Dropdown
          key={result.value}
          id="shiftCode"
          style={{ width: "100%" }}
          options={result}
          onChange={(e) =>
            this.props.handleChangeTable(
              e.target.id,
              e.target.value,
              event.rowIndex,
              rowData
            )
          }
          value={rowData.shiftCode}
          placeholder={
            this.props.language["select_an_option"] || "l_select_an_option"
          }
          optionLabel="name"
          filterPlaceholder={
            this.props.language["select_an_option"] || "l_select_an_option"
          }
          filterBy="name"
          showClear={true}
        />
      </div>
    );
  };
  showFromDate = (rowData, event, id) => {
    return (
      <div>
        <Calendar
          fluid
          value={new Date(moment(`${rowData.fromDate}`).format("YYYY-MM-DD"))}
          onChange={(e) =>
            this.props.handleChangeTable(
              e.target.id,
              e.target.value
                ? +moment(e.target.value).format("YYYYMMDD")
                : e.target.value,
              event.rowIndex
            )
          }
          dateFormat="yy-mm-dd"
          inputClassName="p-inputtext"
          id="fromDate"
          inputStyle={{ width: "91.5%", visible: false }}
          style={{ width: "100%" }}
          showIcon
        />
      </div>
    );
  };
  showToDate = (rowData, event, id) => {
    return (
      <div>
        <Calendar
          fluid
          value={new Date(moment(`${rowData.toDate}`).format("YYYY-MM-DD"))}
          onChange={(e) =>
            this.props.handleChangeTable(
              e.target.id,
              e.target.value
                ? +moment(e.target.value).format("YYYYMMDD")
                : e.target.value,
              event.rowIndex
            )
          }
          dateFormat="yy-mm-dd"
          inputClassName="p-inputtext"
          id="toDate"
          inputStyle={{ width: "91.5%", visible: false }}
          style={{ width: "100%" }}
          showIcon
        />
      </div>
    );
  };
  showShopName = (rowData) => {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <label>
            <i className="pi pi-shopping-cart"></i>{" "}
            <strong>{rowData.shopCode}</strong>
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>{rowData.shopName}</label>
        </div>
      </div>
    );
  };
  // delete Table Insert
  handleDeleteTableDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        deleteTableDialog: true,
        id: rowData.id,
        isTableDialog: true,
      });
    } else this.setState({ deleteTableDialog: false });
  };
  footerDeleteTableDialog = () => {
    return (
      <div>
        <div>
          <Button
            label={this.props.language["cancel"] || "l_cancel"}
            className="p-button-danger"
            onClick={() => this.handleDeleteTableDialog(false)}
          />
          <Button
            label={this.props.language["delete"] || "l_delete"}
            className="p-button-info"
            onClick={() => this.handleDeleteTable()}
          />
        </div>
      </div>
    );
  };
  handleDeleteTable = async () => {
    const state = this.state;
    await this.props.WorkingPlanController.DeleteWorkingDefault(
      state.id,
      0,
      state.isTableDialog
    );
    const result = this.props.deleteWorkingDefault;
    if (result && result.status === 1) {
      await this.props.bindDataShop();
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ deleteTableDialog: false });
  };
  showButtonAction = (rowData, event) => {
    return (
      <div>
        {rowData.id && (
          <Button
            icon="pi pi-trash"
            className="p-button-danger"
            style={{ marginRight: 5 }}
            onClick={() =>
              this.handleDeleteTableDialog(true, rowData, event.rowIndex)
            }
          />
        )}
        <Button
          icon="pi pi-plus"
          className="p-button-info"
          onClick={() => this.props.addDuplicate(rowData, event.rowIndex)}
        />
      </div>
    );
  };
  componentDidMount() {
    const shiftLists = [...this.props.shiftLists];
    if (shiftLists.length === 0) this.props.WorkingPlanController.GetShifts();
  }
  render() {
    let deleteDialog = null;
    const {
      nameAction,
      displayDialog,
      inputValues,
      handleChangeForm,
      handleActionDialog,
      stateName,
      footerAction,
      checkBoxData,
      bindDataShop,
      handleChangeDropDown,
    } = this.props;
    if (this.state.deleteTableDialog)
      deleteDialog = (
        <Dialog
          header="Confirmation"
          modal
          style={{ width: "350px" }}
          visible={this.state.deleteTableDialog}
          footer={this.footerDeleteTableDialog()}
          onHide={() => this.handleDeleteTableDialog(false)}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["are_you_sure_to_delete"] ||
                "l_are_you_sure_to_delete"}
              ?
            </span>
          </div>
        </Dialog>
      );
    return (
      <React.Fragment>
        {deleteDialog}
        <Toast ref={(el) => (this.toast = el)} />
        <Dialog
          style={{ width: "80vw" }}
          id="working-plan-dialog"
          maximized={true}
          header={nameAction}
          visible={displayDialog}
          footer={footerAction(false)}
          onHide={() => handleActionDialog(false)}
        >
          <div className="p-fluid p-formgrid p-grid">
            {nameAction === "Insert" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>
                  {this.props.language["from_date"] || "l_from_date"}
                </label>
                <Calendar
                  fluid
                  value={inputValues.fromDate}
                  onChange={(e) =>
                    handleChangeForm(e.value, stateName, "fromDate")
                  }
                  dateFormat="yy-mm-dd"
                  inputClassName="p-inputtext"
                  id="toDate"
                  inputStyle={{ width: "91.5%", visible: false }}
                  style={{ width: "100%" }}
                  showIcon
                />
                <small className="p-invalid p-d-block">
                  {inputValues.errorFromDate || ""}
                </small>
              </div>
            )}
            <div
              className={
                nameAction === "Update"
                  ? "p-field p-col-12 p-md-4 p-sm-6"
                  : "p-field p-col-12 p-md-3 p-sm-6"
              }
            >
              <label>{this.props.language["position"] || "position"}</label>
              <EmployeeTypeDropDownList
                id="positionId"
                type="PG-PGAL"
                onChange={handleChangeDropDown}
                value={inputValues.positionId}
                disabled={nameAction === "Update" ? true : false}
              />
              <small className="p-invalid p-d-block">
                {inputValues.errorPositionId || ""}
              </small>
            </div>
            <div className="p-field p-col-12 p-md-4 p-sm-6">
              <label>{this.props.language["employee"] || "employee"}</label>
              <EmployeeDropDownList
                typeId={
                  inputValues.positionId === null ? 0 : inputValues.positionId
                }
                id="employeeId"
                mode="single"
                parentId=""
                onChange={handleChangeDropDown}
                value={inputValues.employeeId}
                disabled={nameAction === "Update" ? true : false}
              />
              <small className="p-invalid p-d-block">
                {inputValues.errorEmployee || ""}
              </small>
            </div>
            {nameAction === "Insert" && (
              <div
                className="p-field p-col-12 p-md-1 p-sm-6"
                style={{ marginTop: 8 }}
              >
                <br />
                <Button
                  label={this.props.language["get_shop"] || "l_get_shop"}
                  className="p-button-success"
                  onClick={() => bindDataShop()}
                />
              </div>
            )}
            {nameAction === "Update" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>
                  {this.props.language["store_name"] || "l_store_name"}
                </label>
                <ShopDropDownList
                  id="shopId"
                  //disabled={this.state.disabled}
                  employeeId={
                    inputValues.employeeId ? inputValues.employeeId : 0
                  }
                  onChange={handleChangeDropDown}
                  value={inputValues.shopId ? inputValues.shopId : 0}
                  disabled={nameAction === "Update" ? true : false}
                />
              </div>
            )}
            {nameAction === "Update" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>
                  {this.props.language["from_to_date"] || "l_from_to_date"}
                </label>
                <Calendar
                  fluid
                  value={inputValues.fromToDate}
                  onChange={(e) =>
                    handleChangeForm(e.value, stateName, "fromToDate")
                  }
                  dateFormat="yy-mm-dd"
                  inputClassName="p-inputtext"
                  id="fromToDate"
                  selectionMode="range"
                  inputStyle={{ width: "91.5%", visible: false }}
                  style={{ width: "100%" }}
                  showIcon
                />
                <small className="p-invalid p-d-block">
                  {inputValues.errorFromToDate || ""}
                </small>
              </div>
            )}
            {nameAction === "Update" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>
                  {this.props.language["shift_code"] || "l_shift_code"}
                </label>
                <ShiftDropDownList
                  id="shiftCode"
                  typeId={inputValues.positionId}
                  onChange={handleChangeDropDown}
                  value={inputValues.shiftCode}
                />
                <small className="p-invalid p-d-block">
                  {inputValues.errorShiftCode || ""}
                </small>
              </div>
            )}
          </div>
          <div className="p-field p-col-12 p-md-12 p-sm-6">
            <DataTable
              rowHover
              // scrollable scrollHeight='400px'
              value={
                nameAction === "Insert"
                  ? inputValues.dataTableInsert
                  : inputValues.dataTableUpdate
              }
              style={{ fontSize: "13px" }}
            >
              {nameAction === "Insert" && (
                <Column
                  field="isInsert"
                  style={{ width: 60 }}
                  body={(rowData, e) =>
                    this.checkBoxInsert(rowData, e, "isInsert")
                  }
                  filter={true}
                  header={this.props.language["is_insert"] || "l_is_insert"}
                />
              )}
              {nameAction === "Insert" && (
                <Column
                  header="No."
                  body={(rowData) => (
                    <Button
                      style={{ width: "100%" }}
                      className="p-button-outlined p-button-warning"
                      label={rowData.rowNum}
                    />
                  )}
                  filter="rowNum"
                  style={{ width: 60 }}
                />
              )}
              {nameAction === "Insert" && (
                <Column
                  field="shopName"
                  style={{ width: 200 }}
                  body={this.showShopName}
                  filter={true}
                  header={this.props.language["shop_name"] || "l_shop_name"}
                />
              )}
              {nameAction === "Insert" && (
                <Column
                  field="shiftCode"
                  style={{ width: 150 }}
                  body={this.showShiftCode}
                  filter={true}
                  header={this.props.language["shift"] || "l_shift"}
                />
              )}
              {nameAction === "Insert" && (
                <Column
                  field="fromDate"
                  style={{ width: 150 }}
                  body={this.showFromDate}
                  filter={true}
                  header={this.props.language["from_date"] || "l_from_date"}
                />
              )}
              {nameAction === "Insert" && (
                <Column
                  field="toDate"
                  style={{ width: 150 }}
                  body={this.showToDate}
                  filter={true}
                  header={this.props.language["to_date"] || "l_to_date"}
                />
              )}
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "monday")}
                style={{ width: 40 }}
                header={this.props.language["mon"] || "l_mon"}
              />
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "tuesday")}
                style={{ width: 40 }}
                header={this.props.language["tue"] || "l_tue"}
              />
              <Column
                body={(rowData, e) =>
                  this.checkBoxData(rowData, e, "wednesday")
                }
                style={{ width: 40 }}
                header={this.props.language["wed"] || "l_wed"}
              />
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "thursday")}
                style={{ width: 40 }}
                header={this.props.language["thu"] || "l_thu"}
              />
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "friday")}
                style={{ width: 40 }}
                header={this.props.language["fri"] || "l_fri"}
              />
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "saturday")}
                style={{ width: 40 }}
                header={this.props.language["sat"] || "l_sat"}
              />
              <Column
                body={(rowData, e) => this.checkBoxData(rowData, e, "sunday")}
                style={{ width: 40 }}
                header={this.props.language["sun"] || "l_sun"}
              />
              {nameAction === "Insert" && (
                <Column
                  body={(rowData, e) => this.showButtonAction(rowData, e)}
                  style={{ width: 100, textAlign: "center" }}
                  header="#"
                />
              )}
            </DataTable>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}
function mapstateToProps(state) {
  return {
    language: state.languageList.language,
    shiftLists: state.workingPlans.shiftLists,
    deleteWorkingDefault: state.workingPlans.deleteWorkingDefault,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ShopTargetController: bindActionCreators(ShopTargetAPI, dispatch),
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
  };
}
export default connect(
  mapstateToProps,
  mapDispatchToProps
)(WorkingPlanDefaultDialog);
