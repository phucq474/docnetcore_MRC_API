import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LanguageAPI } from "../../store/LanguageController";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProductCreateAction } from "../../store/ProductController";
import { CategoryApp } from "../Controls/CategoryMaster";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { ShopTargetAPI } from "../../store/ShopTargetController";
import TimeField from "react-simple-timefield";
import { Sidebar } from "primereact/sidebar";
class TimeShiftDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      shifts: [],
      shopId: 0,
      employeeId: 0,
      inputValues: {},
      categoryId: "",
      isFetchedStore: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  async handleChange(id, value) {
    await this.setState({ [id]: value === null ? "" : value });
    await this.props.handleChangeCate(id, value);
  }
  UNSAFE_componentWillReceiveProps(nextProp) {
    if (nextProp.inputValues.categoryId) {
      this.setState({
        ...this.state,
        categoryId: nextProp.inputValues.categoryId,
      });
    }
    if (!nextProp.inputValues.categoryId) {
      this.setState({
        ...this.state,
        categoryId: "",
      });
    }
    if (nextProp.inputValues.toDate) {
      let toDate = new Date(nextProp.inputValues.toDate);
      this.setState({ toDate: toDate });
    }
  }
  async componentDidMount() {
    await this.props.LanguageController.GetLanguage();
    await this.props.ProductController.GetCategory();
    await this.props.ShopTargetController.GetStoreName();
  }
  async componentWillMount() {
    await this.props.WorkingPlanController.ShiftLists_TimeShift();
    if (this.props.shiftListTimeShift) {
      let shifts = this.props.shiftListTimeShift;
      for (let i = 0; i < shifts.length; i++) {
        await this.state.shifts.push({ shift: shifts[i].shiftCode });
      }
    }
  }
  render() {
    const {
      displayDialog,
      inputValues,
      displayOnHide,
      handleChangeForm,
      stateName,
      handleDropDown,
      actionName,
      handleCalendar,
      handleCalendarEdit,
      FromToDate,
      handleSideBarAction,
      handleDropDownShift,
    } = this.props;
    return (
      <React.Fragment>
        <Sidebar
          visible={displayDialog}
          fullScreen
          style={{ zIndex: "1000" }}
          onHide={() => displayOnHide("false")}
        >
          <h1 style={{ fontWeight: "normal" }}>{actionName}</h1>
          {actionName === "Insert" && (
            <div className=" p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-4 p-sm-6 ">
                <label>
                  {this.props.language["from_to_date"] || "l_from_to_date"}
                </label>
                <div>
                  <Calendar
                    fluid
                    value={FromToDate || []}
                    onChange={(e) => {
                      handleCalendar(e);
                    }}
                    dateFormat="yy-mm-dd"
                    id="fromDate"
                    selectionMode="range"
                    inputStyle={{ width: "91.5%", visible: false }}
                    style={{ width: "100%" }}
                    showIcon
                    showButtonBar
                  />
                </div>
                <small className="p-invalid p-d-block">
                  {inputValues.errorFromDate || ""}
                </small>
              </div>
              <div className="p-col-12 p-md-8 p-sm-6 p-field">
                <label>
                  {this.props.language["store_name"] || "l_store_name"}
                </label>
                <div>
                  <Dropdown
                    value={inputValues.shopName || ""}
                    options={this.props.getStoreName}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      handleDropDown(e, stateName, "shopId");
                    }}
                    optionLabel="shopName"
                    filter
                    showClear
                    filterBy="shopNameVN"
                    placeholder={
                      this.props.language["select_store_name"] ||
                      "l_select_store_name"
                    }
                  />
                </div>
                <small className="p-invalid p-d-block">
                  {inputValues.errorShopId || ""}
                </small>
              </div>
            </div>
          )}
          <div
            className=" p-formgrid p-grid"
            style={actionName == "Insert" ? { marginBottom: "5px" } : {}}
          >
            {actionName === "Edit" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>
                  {this.props.language["from_date"] || "l_from_date"}
                </label>
                <div>
                  <Calendar
                    value={inputValues.fromDate || ""}
                    inputStyle={{ width: "91.5%", visible: false }}
                    dateFormat="yy-mm-dd"
                    id="basic"
                    style={{ width: "100%" }}
                    showIcon
                    showButtonBar
                    disabled
                  />
                </div>
              </div>
            )}
            {actionName === "Edit" && (
              <div className="p-field p-col-12 p-md-4 p-sm-6">
                <label>{this.props.language["to_date"] || "l_to_date"}</label>
                <div>
                  <Calendar
                    value={this.state.toDate || ""}
                    inputStyle={{ width: "91.5%", visible: false }}
                    onChange={(e) => {
                      handleCalendarEdit(e);
                    }}
                    dateFormat="yy-mm-dd"
                    id="basic"
                    style={{ width: "100%" }}
                    showIcon
                    showButtonBar
                  />
                </div>
                <small className="p-invalid p-d-block">
                  {inputValues.errorToDate || ""}
                </small>
              </div>
            )}
            {actionName === "Edit" && (
              <div className="p-field p-col-12 p-md-4">
                <label htmlFor="basic">
                  {this.props.language["shift"] || "l_shift"}
                </label>
                <div>
                  <InputText
                    value={inputValues.shift || ""}
                    placeholder="shift"
                    onChange={(e) => handleChangeForm(e, stateName, "shift")}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
              </div>
            )}
          </div>
          {actionName === "Insert" && (
            <div className=" p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-4">
                <label htmlFor="basic">
                  {this.props.language["shift"] || "l_shift"}
                </label>
                <div>
                  <Dropdown
                    style={{ width: "100%" }}
                    value={inputValues.shifts}
                    options={this.state.shifts}
                    onChange={(e) => {
                      handleDropDownShift(e, stateName, "shift");
                    }}
                    optionLabel="shift"
                    placeholder="Select a shift"
                  />
                  <small className="p-invalid p-d-block">
                    {inputValues.errorShift || ""}
                  </small>
                </div>
              </div>
              <div className="p-field p-col-12 p-md-2">
                <label htmlFor="basic">
                  {this.props.language["from"] || "l_from"}
                </label>
                <div>
                  <TimeField
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                      height: "36px",
                    }}
                    value={inputValues.From || ""}
                    placeholder="From"
                    onChange={(e) => {
                      handleChangeForm(e, stateName, "From");
                      this.setState({ From: e.target.value });
                    }}
                  />
                  <small className="p-invalid p-d-block">
                    {inputValues.errorFrom || ""}
                  </small>
                </div>
              </div>
              <div className="p-field p-col-12 p-md-2">
                <label htmlFor="basic">
                  {this.props.language["to"] || "l_to"}
                </label>
                <div>
                  <TimeField
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                      height: "36px",
                    }}
                    value={inputValues.To || ""}
                    placeholder="To"
                    onChange={(e) => {
                      handleChangeForm(e, stateName, "To");
                      this.setState({ To: e.value });
                    }}
                  />
                  <small className="p-invalid p-d-block">
                    {inputValues.errorTo || ""}
                  </small>
                </div>
              </div>
              <div className="p-field p-col-12 p-md-2">
                <label htmlFor="basic">
                  {this.props.language["from1"] || "l_from1"}
                </label>
                <div>
                  <TimeField
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                      height: "36px",
                    }}
                    value={inputValues.From1 || ""}
                    placeholder="From1"
                    onChange={(e) => {
                      handleChangeForm(e, stateName, "From1");
                      this.setState({ From1: e.value });
                    }}
                  />
                </div>
              </div>
              <div className="p-field p-col-12 p-md-2">
                <label htmlFor="basic">
                  {this.props.language["to1"] || "l_to1"}
                </label>
                <div>
                  <TimeField
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                      height: "36px",
                    }}
                    value={inputValues.To1 || ""}
                    placeholder="To1"
                    onChange={(e) => {
                      handleChangeForm(e, stateName, "To1");
                      this.setState({ To1: e.value });
                    }}
                  />
                  <small className="p-invalid p-d-block">
                    {inputValues.errorTo1 || ""}
                  </small>
                </div>
              </div>
            </div>
          )}
          <div className=" p-formgrid p-grid">
            {actionName === "Edit" && (
              <div className="p-field p-col-12 p-md-4">
                <label htmlFor="basic">
                  {this.props.language["from_time_to_time"] ||
                    "l_from_time_to_time"}
                </label>
                <div>
                  <InputText
                    value={inputValues.fromTo || ""}
                    placeholder="mm:ss-mm:ss&mm:ss-mm:ss"
                    onChange={(e) => handleChangeForm(e, stateName, "fromTo")}
                    maxLength="23"
                  />
                  <small className="p-invalid p-d-block">
                    {inputValues.errorFromTo || ""}
                  </small>
                </div>
              </div>
            )}
            <CategoryApp {...this} dialog={true} />
          </div>
          {actionName === "Insert" && (
            <div>
              <div style={{ position: "fixed", bottom: "50px", right: "25px" }}>
                <Button
                  style={{ marginRight: "10px" }}
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-info"
                  onClick={() => displayOnHide("false")}
                />
                <Button
                  label="Save"
                  icon="pi pi-check"
                  className="p-button-success"
                  onClick={() => handleSideBarAction()}
                />
              </div>
            </div>
          )}
          {actionName === "Edit" && (
            <div>
              <div style={{ position: "fixed", bottom: "50px", right: "25px" }}>
                <Button
                  style={{ marginRight: "10px" }}
                  label="Cancel"
                  className="p-button-info"
                  icon="pi pi-times"
                  onClick={() => displayOnHide("false")}
                />
                <Button
                  label="Update"
                  className="p-button-success"
                  icon="pi pi-check"
                  onClick={() => handleSideBarAction()}
                />
              </div>
            </div>
          )}
        </Sidebar>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    categories: state.products.categories,
    usecate: true,
    shiftListTimeShift: state.workingPlans.shiftListTimeShift,
    getStoreName: state.shoptarget.getStoreName,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    LanguageController: bindActionCreators(LanguageAPI, dispatch),
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
    ShopTargetController: bindActionCreators(ShopTargetAPI, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TimeShiftDialog);
