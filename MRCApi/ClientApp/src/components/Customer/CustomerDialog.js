import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { connect } from "react-redux";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from "redux";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import CustomerAccountDropDownList from "../Controls/CustomerAccountDropDownList";
import ChannelDropDownList from "../Controls/ChannelDropDownList";
class CustomerDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = async (id, value) => {
    await this.setState({ [id]: value === null ? "" : value });
    await this.props.handleChangeDropDown(id, value);
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
        style={{ width: "80vw" }}
        header={actionName}
        visible={displayDialog}
        footer={footerAction(false)}
        onHide={() => handleActionDialog(false)}
      >
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-3">
            <label>{"l_customer_parent"}</label>
            <CustomerDropDownList
              id="customerId"
              mode="single"
              accId={this.props.accId}
              onChange={this.handleChange}
              value={inputValues.customerId}
            />
          </div>
          <div className="p-field p-col-12 p-md-3">
            <label>{"l_channel"}</label>
            <ChannelDropDownList
              id="channelId"
              accId={this.props.accId}
              onChange={this.handleChange}
              value={inputValues.channelId}
            />
          </div>
          <div className="p-field p-col-12 p-md-3">
            <label>
              {this.props.language["account_name"] || "l_account_name"}
            </label>
            <CustomerAccountDropDownList
              id="account_Id"
              mode="single"
              accId={this.props.accId}
              onChange={this.handleChange}
              value={inputValues.account_Id}
              edit={true}
            />
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorAccountName || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-3">
            <label>{"account_code"}</label>
            <span className="p-float-label">
              <InputText
                id="accountCode"
                value={inputValues.accountCode}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "accountCode")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorAccountCode || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-3">
            <label>{"l_customer_code"}</label>
            <span className="p-float-label">
              <InputText
                id="customerCode"
                value={inputValues.customerCode}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "customerCode")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorCustomerCode || ""}
            </small>
          </div>
          <div className="p-field p-col-12 p-md-3">
            <label>{"l_customer_name"}</label>
            <span className="p-float-label">
              <InputText
                id="customerName"
                value={inputValues.customerName}
                onChange={(e) =>
                  handleChangeForm(e.target.value, stateName, "customerName")
                }
              />
            </span>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorCustomerName || ""}
            </small>
          </div>
          <div className="p-field p-col-3 p-md-3 p-sm-6">
            <label>{"l_order_by"}</label>
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
              <label>{"l_status"} : </label>
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

          {/* <div className="p-field p-col-3 p-md-6 p-sm-6">
                        <label>{ "l_contact_name"}</label>
                        <span className="p-float-label">
                            <InputText id="contactName"
                                value={inputValues.contactName} onChange={e => handleChangeForm(e.target.value, stateName, 'contactName')} />
                        </span>
                        <small className="p-invalid p-d-block">{inputValues.errorKpiName || ""}</small>
                    </div>
                    <div className="p-field p-col-3 p-md-6 p-sm-6">
                        <label>{"l_contact_title"}</label>
                        <span className="p-float-label">
                            <InputText id="contactTitle"
                                value={inputValues.contactTitle} onChange={e => handleChangeForm(e.target.value, stateName, 'contactTitle')} />
                        </span>
                        <small className="p-invalid p-d-block">{inputValues.errorKpiName || ""}</small>
                    </div>

                    <div className="p-field p-col-3 p-md-6 p-sm-6">
                        <label>{"l_address"}</label>
                        <span className="p-float-label">
                            <InputText id="address"
                                value={inputValues.address} onChange={e => handleChangeForm(e.target.value, stateName, 'address')} />
                        </span>
                        <small className="p-invalid p-d-block">{inputValues.errorKpiName || ""}</small>
                    </div>
                    <div className="p-field p-col-3 p-md-3 p-sm-6">
                        <label>{ "l_phone"}</label>
                        <span className="p-float-label">
                            <InputText id="phone"
                                value={inputValues.phone} onChange={e => handleChangeForm(e.target.value, stateName, 'phone')} />
                        </span>
                    </div>
                    <div className="p-field p-col-3 p-md-3 p-sm-6">
                        <label>{ "l_fax"}</label>
                        <span className="p-float-label">
                            <InputText id="fax"
                                value={inputValues.fax} onChange={e => handleChangeForm(e.target.value, stateName, 'fax')} />
                        </span>
                    </div> */}
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
export default connect(mapstateToProps, mapDispatchToProps)(CustomerDialog);
