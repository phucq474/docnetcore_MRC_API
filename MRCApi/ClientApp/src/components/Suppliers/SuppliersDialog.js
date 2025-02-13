import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { connect } from "react-redux";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from "redux";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
class SuppliersDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
        style={{ width: "80vw" }}
        header={actionName}
        visible={displayDialog}
        footer={footerAction(false)}
        onHide={() => handleActionDialog(false)}
      >
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>
              {this.props.language["supplier_code"] || "l_supplier_code"}
            </label>
            <span className="p-float-label">
              <InputText
                id="supplierCode"
                value={inputValues.supplierCode}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "supplierCode")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorSupplierCode || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>
              {this.props.language["supplier_name"] || "l_supplier_name"}
            </label>
            <span className="p-float-label">
              <InputText
                id="supplierName"
                value={inputValues.supplierName}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "supplierName")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorSupplierName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-6 p-sm-6">
            <label>{this.props.language["full_name"] || "l_full_name"}</label>
            <span className="p-float-label">
              <InputText
                id="fullName"
                value={inputValues.fullName}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "fullName")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorKpiName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-6 p-sm-6">
            <label>{this.props.language["address"] || "l_address"}</label>
            <span className="p-float-label">
              <InputText
                id="address"
                value={inputValues.address}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "address")
                }
              />
            </span>
            <small className="p-invalid p-d-block">
              {inputValues.errorKpiName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-6 p-sm-6">
            <label>{this.props.language["contact"] || "l_contact"}</label>
            <span className="p-float-label">
              <InputText
                id="contact"
                value={inputValues.contact}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "contact")
                }
              />
            </span>
          </div>

          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["phone"] || "l_phone"}</label>
            <span className="p-float-label">
              <InputText
                id="phone"
                value={inputValues.phone}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "phone")
                }
              />
            </span>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["fax"] || "l_fax"}</label>
            <span className="p-float-label">
              <InputText
                id="fax"
                value={inputValues.fax}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "fax")
                }
              />
            </span>
          </div>

          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{this.props.language["order_by"] || "l_order_by"}</label>
            <span className="p-float-label">
              <InputNumber
                className="w-100"
                id="orderBy"
                mode="decimal"
                value={inputValues.orderBy}
                useGrouping={false}
                onValueChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "orderBy")
                }
              />
            </span>
          </div>
          {actionName === "Update" && (
            <div className="p-col-3 p-md-2 p-sm-6">
              <label>{this.props.language["status"] || "l_status"} : </label>
              <br />
              <div style={{ paddingTop: 6 }}>
                <Checkbox
                  inputId="status"
                  checked={inputValues.status || ""}
                  onChange={(e) =>
                    handleChangeForm(e.checked, stateName, "status")
                  }
                />
                <small htmlFor="status">
                  {inputValues.status ? " Active" : " InActive"}
                </small>
              </div>
            </div>
          )}
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
export default connect(mapstateToProps, mapDispatchToProps)(SuppliersDialog);
