import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { connect } from "react-redux";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from "redux";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { Calendar } from "primereact/calendar";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { getLogin } from "../../Utils/Helpler";
class AnnualLeaveDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = (id, value) => {
    this.props.handleChangeDropDown(id, value);
  };
  componentDidMount() {}
  render() {
    const {
      actionName,
      displayDialog,
      inputValues,
      handleChangeForm,
      handleActionDialog,
      stateName,
      footerAction,
    } = this.props;
    return (
      <Dialog
        style={{ width: "60 vw" }}
        header={actionName}
        visible={displayDialog}
        footer={footerAction(false)}
        onHide={() => handleActionDialog(false)}
      >
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>
              {this.props.language["month_picker"] || "l_month_picker"}
            </label>
            <Calendar
              fluid
              value={inputValues.dates}
              onChange={(e) => handleChangeForm(e.value, stateName, "dates")}
              view="month"
              dateFormat="yy/mm"
              yearNavigator
              yearRange="2010:2030"
              id="dates"
              inputStyle={{ width: "91.5%", visible: false }}
              style={{ width: "100%" }}
              showIcon
            />
            <small className="p-invalid p-d-block">
              {inputValues.errorDates || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>{this.props.language["position"] || "l_position"}</label>
            <EmployeeTypeDropDownList
              id="positionId"
              type="PG-PGAL-GS-Leader"
              value={inputValues.positionId}
              onChange={this.handleChange}
            ></EmployeeTypeDropDownList>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>{this.props.language["manager"] || "l_manager"}</label>
            <EmployeeDropDownList
              type="SUP-Leader"
              typeId={0}
              mode="single"
              id="supId"
              parentId={0}
              value={inputValues.supId}
              onChange={this.handleChange}
            />
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>{this.props.language["employee"] || "l_employee"}</label>
            <EmployeeDropDownList
              type=""
              typeId={
                inputValues.positionId === null ? 0 : inputValues.positionId
              }
              id="employeeId"
              mode="single"
              parentId={inputValues.supId === null ? 0 : inputValues.supId}
              onChange={this.handleChange}
              value={inputValues.employeeId}
            />
            <small className="p-invalid p-d-block">
              {inputValues.errorEmployeeId || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>
              {this.props.language["annual_leave"] || "l_annual_leave"}
            </label>
            <span className="p-float-label">
              <InputNumber
                id="al"
                useGrouping={false}
                value={inputValues.al}
                onChange={(e) => handleChangeForm(e.value, stateName, "al")}
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorAl || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>
              {this.props.language["annual_leave_month"] ||
                "l_annual_leave_month"}
            </label>
            <span className="p-float-label">
              <InputNumber
                id="al_month"
                useGrouping={false}
                value={inputValues.al_month}
                onChange={(e) =>
                  handleChangeForm(e.value, stateName, "al_month")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorAlMonth || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>
              {this.props.language[
                getLogin().accountName === "Fonterra" ? "cl" : "nb"
              ] || getLogin().accountName === "Fonterra"
                ? "l_cl"
                : "l_nb"}
            </label>
            <span className="p-float-label">
              <InputNumber
                id="nb"
                useGrouping={false}
                value={inputValues.nb}
                onChange={(e) => handleChangeForm(e.value, stateName, "nb")}
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorNb || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-4 p-sm-6">
            <label>
              {this.props.language[
                getLogin().accountName === "Fonterra" ? "cl_month" : "nb_month"
              ] || getLogin().accountName === "Fonterra"
                ? "l_cl_month"
                : "l_nb_month"}
            </label>
            <span className="p-float-label">
              <InputNumber
                id="nb_month"
                useGrouping={false}
                value={inputValues.nb_month}
                onChange={(e) =>
                  handleChangeForm(e.value, stateName, "nb_month")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorNbMonth || ""}
            </small>
          </div>
        </div>
      </Dialog>
    );
  }
}
function mapstateToProps(state) {
  return {
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
  };
}
export default connect(mapstateToProps, mapDispatchToProps)(AnnualLeaveDialog);
