import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { connect } from "react-redux";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from "redux";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import TimeField from "react-simple-timefield";
import { InputSwitch } from "primereact/inputswitch";
class ShiftListDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.WorkingPlanController.GetShiftList(this.props.accId);
  }
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
        style={{ width: "80vw" }}
        header={actionName}
        visible={displayDialog}
        footer={footerAction(false)}
        onHide={() => handleActionDialog(false)}
      >
        <div className="p-fluid p-formgrid p-grid">
          {/* <div className="p-field p-col-12 p-md-3">
                        <label>{this.props.language["shift"] || "l_shift"}*</label>
                        <Dropdown value={inputValues.shift} options={this.props.shiftLists} filter showClear
                            onChange={(e) => handleChangeForm(e.value, stateName, "shift")} optionLabel="groupName" editable
                            placeholder={this.props.language["select_group_name"] || "l_select_group_name"} />
                        <small className="p-invalid p-d-block">{inputValues.errorShift || ""}</small>
                    </div> */}
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>
              {this.props.language["shift_group"] || "l_shift_group"}
            </label>
            <span className="p-float-label">
              <InputText
                id="shiftGroup"
                maxLength={8}
                value={inputValues.shiftGroup}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "shiftGroup")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorShiftGroup || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["group_name"] || "l_group_name"}</label>
            <span className="p-float-label">
              <InputText
                id="groupName"
                value={inputValues.groupName}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "groupName")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorGroupName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["shift_code"] || "l_shift_code"}</label>
            <span className="p-float-label">
              <InputText
                id="shiftCode"
                maxLength={8}
                value={inputValues.shiftCode}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "shiftCode")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorShiftCode || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["shift_name"] || "l_shift_name"}</label>
            <span className="p-float-label">
              <InputText
                id="shiftName"
                value={inputValues.shiftName}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "shiftName")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorShiftName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-1 p-sm-6">
            <label style={{ marginBottom: 12 }}>
              {this.props.language["ref_code"] || "l_ref_code"}
            </label>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: 15 }}>
                <span className="p-float-label">
                  <InputSwitch
                    checked={inputValues.refCode}
                    onChange={(e) =>
                      handleChangeForm(e.value, stateName, "refCode")
                    }
                  />
                </span>
              </div>
              <div>
                <label>
                  {inputValues.refCode ? (
                    <strong>ON</strong>
                  ) : (
                    <strong>OFF</strong>
                  )}
                </label>
              </div>
            </div>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorRefCode || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-2 p-sm-6">
            <label>{this.props.language["value"] || "l_value"}</label>
            <span className="p-float-label">
              <InputNumber
                className="w-100"
                id="value"
                mode="decimal"
                maxFractionDigits={1}
                minFractionDigits={1}
                value={inputValues.value}
                useGrouping={false}
                disabled={inputValues.refCode ? false : true}
                onValueChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "value")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorValue || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-2 p-sm-6">
            <label>{this.props.language["order"] || "l_order"}</label>
            <span className="p-float-label">
              <InputNumber
                className="w-100"
                id="order"
                mode="decimal"
                value={inputValues.order}
                useGrouping={false}
                onValueChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "order")
                }
              />
            </span>
          </div>
          {inputValues.refCode && (
            <div className="p-field p-col-3 p-md-2 p-sm-6">
              <label>{this.props.language["from"] || "l_from"}</label>
              <span className="p-float-label">
                <TimeField
                  style={{
                    width: "100%",
                    backgroundColor: "black",
                    color: "white",
                    height: "36px",
                  }}
                  value={inputValues.from}
                  placeholder="From"
                  disable
                  onChange={(e) =>
                    handleChangeForm(e.target.value, stateName, "from")
                  }
                />
              </span>
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorFrom || ""}
              </small>
            </div>
          )}
          {inputValues.refCode && (
            <div className="p-field p-col-3 p-md-2 p-sm-6">
              <label>{this.props.language["to"] || "l_to"}</label>
              <span className="p-float-label">
                <TimeField
                  style={{
                    width: "100%",
                    backgroundColor: "black",
                    color: "white",
                    height: "36px",
                  }}
                  value={inputValues.to}
                  placeholder="To"
                  onChange={(e) =>
                    handleChangeForm(e.target.value, stateName, "to")
                  }
                />
              </span>
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorTo || ""}
              </small>
            </div>
          )}

          <div className="p-col-3 p-md-2 p-sm-6">
            <label>{this.props.language["status"] || "l_status"} : </label>
            <br />
            <div style={{ paddingTop: 15 }}>
              <Checkbox
                inputId="status"
                checked={inputValues.status || ""}
                onChange={(e) =>
                  actionName === "Update"
                    ? handleChangeForm(e.checked, stateName, "status")
                    : ""
                }
              />
              <small htmlFor="status">
                {inputValues.status ? " Active" : " InActive"}
              </small>
            </div>
          </div>
          <div className="p-field p-col-3 p-md-12 p-sm-6">
            <label>{this.props.language["note"] || "l_note"}</label>
            <span className="p-float-label">
              <InputTextarea
                id="note"
                rows={3}
                cols={20}
                value={inputValues.note}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "note")
                }
              />
            </span>
          </div>
        </div>
      </Dialog>
    );
  }
}
function mapstateToProps(state) {
  return {
    language: state.languageList.language,
    shiftLists: state.workingPlans.shiftLists,
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
export default connect(mapstateToProps, mapDispatchToProps)(ShiftListDialog);
