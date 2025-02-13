import React,{Component} from 'react';
import {InputText} from "primereact/inputtext";
import {InputNumber} from 'primereact/inputnumber';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {connect} from 'react-redux';
import {getAccountId} from '../../Utils/Helpler'
import EmployeeDropDownList from "../Controls/EmployeeDropDownList"
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList"

const user = JSON.parse(localStorage.getItem("USER"));
class ShopTargetDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            positionByAccount: user.accountId === 10 ? "PG-SR-MER" : "PG-SR-MER-SUP",
        }
    }
    render() {
        const {stateName,displayDialog,displayFooterAction,handleDialog,handleChangeForm,inputValues,handleChange,
            actionName,handleActionFunction,dialogStateName,listTargetName,
            yearData,monthData
        } = this.props
        return (
            <React.Fragment>
                <Dialog header={actionName} visible={displayDialog} style={{width: '80vw'}} footer={displayFooterAction(actionName,() => handleDialog(false,dialogStateName),handleActionFunction)} onHide={() => handleDialog(false,dialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid" >
                        {actionName === "Insert" && (
                            <div className="p-field p-col-12 p-md-4">
                                <label>{this.props.language["position"] || "l_position"}</label>
                                <EmployeeTypeDropDownList
                                    id="position"
                                    type={""}
                                    onChange={handleChange}
                                    value={inputValues.position || 0}
                                />
                            </div>
                        )}
                        {actionName === "Insert" && (
                            <div className="p-field p-col-12 p-md-4">
                                <label>{this.props.language["employee"] || "l_employee"}</label>
                                <EmployeeDropDownList
                                    type={this.state.positionByAccount}
                                    id="employeeValue" mode="single"
                                    typeId={inputValues.position || 0}
                                    parentId={0}
                                    onChange={handleChange}
                                    value={inputValues.employeeValue || 0}
                                />
                                <small className="p-invalid p-d-block">{inputValues.errorEmployee || ""}</small>
                            </div>
                        )}
                        {actionName === "Insert" && (
                            <div className="p-field p-col-12 p-md-4">
                                <label>{this.props.language["target_name"] || "l_target_name"}</label>
                                <Dropdown value={inputValues.targetName || ""} options={listTargetName}
                                    onChange={(e) => handleChangeForm(e.value,stateName,"targetName")} optionLabel="targetName" filter showClear filterBy="targetName"
                                    placeholder={this.props.language["select_by"] || "l_select_by"} editable />
                                <small className="p-invalid p-d-block">{inputValues.errorTargetName || ""}</small>
                            </div>
                        )}
                    </div>
                    <div className="p-fluid p-formgrid p-grid" >
                        {actionName === "Update" && (
                            <div className="p-field p-col-12 p-md-6">
                                <label>{this.props.language["employee"] || "l_employee"}</label>
                                <InputText value={inputValues.fullName || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"fullName")} disabled={true} />
                            </div>
                        )}
                        {actionName === "Update" && (
                            <div className="p-field p-col-12 p-md-6">
                                <label>{this.props.language["date"] || "l_date"}</label>
                                <InputText value={inputValues.date || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"date")} disabled={true} />
                            </div>
                        )}
                        <div className={`p-field p-col-12 p-md-${getAccountId() === 2 ? "3" : actionName === "Insert" ? "4" : "6    "}`}>
                            <label>{this.props.language["store_name"] || "l_store_name"}</label>
                            <Dropdown value={inputValues.shopId || {}} options={inputValues.shopLists}
                                onChange={(e) => handleChangeForm(e.value,stateName,"shopId")} optionLabel="shopName" filter showClear filterBy="shopName"
                                placeholder={this.props.language["select_shop"] || "l_select_shop"} />
                            <small className="p-invalid p-d-block">{inputValues.errorStore || ""}</small>
                        </div>
                        {actionName === "Update" && (
                            <div className="p-field p-col-12 p-md-6">
                                <label>{this.props.language["target_name"] || "l_target_name"}</label>
                                <Dropdown value={inputValues.targetName || ""} options={listTargetName}
                                    onChange={(e) => handleChangeForm(e.value,stateName,"targetName")} optionLabel="targetName" filter showClear filterBy="targetName"
                                    placeholder={this.props.language["select_by"] || "l_select_by"} editable />
                                <small className="p-invalid p-d-block">{inputValues.errorTargetName || ""}</small>
                            </div>
                        )}
                        {
                            (getAccountId() === 2) && (
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["province_code"] || "l_province_code"}</label>
                                    <Dropdown value={inputValues.provinceCode ? inputValues.provinceCode : ""} options={inputValues.provinceCodes}
                                        onChange={(e) => handleChangeForm(e.value,stateName,"provinceCode")} optionLabel="provinceVN" filter showClear filterBy="provinceVN"
                                        placeholder={this.props.language["select_province"] || "l_select_province"} />
                                    <small className="p-invalid p-d-block">{inputValues.errorProvinceCode || ""}</small>
                                </div>
                            )
                        }
                        {actionName === "Insert" && (
                            <div className={`p-field p-col-12 p-md-${getAccountId() === 2 ? "3" : "4"}`}>
                                <label>{this.props.language["year"] || "l_year"}</label>
                                <Dropdown value={inputValues.year || ""} options={yearData} onChange={(e) => handleChangeForm(e.value,stateName,"year")}
                                    optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_year"] || "l_select_year"} />
                                <small className="p-invalid p-d-block">{inputValues.errorYear || ""}</small>
                            </div>
                        )}
                        {actionName === "Insert" && (
                            <div className={`p-field p-col-12 p-md-${getAccountId() === 2 ? "3" : "4"}`}>
                                <label>{this.props.language["month"] || "l_month"}</label>
                                <Dropdown value={inputValues.month || ""} options={monthData} onChange={(e) => handleChangeForm(e.value,stateName,"month")}
                                    optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_month"] || "l_select_month"} />
                                <small className="p-invalid p-d-block">{inputValues.errorMonth || ""}</small>
                            </div>
                        )}
                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label>{this.props.language["quantity"] || "l_quantity"}</label>
                            <InputNumber value={inputValues.quantity || ""} onValueChange={(e) => handleChangeForm(e.target.value,stateName,"quantity")} mode="decimal" max={1000}
                                style={{direction: "rtl"}} placeholder={this.props.language["input_quantity"] || "l_input_quantity"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>{this.props.language["amount"] || "l_amount"}</label>
                            <InputNumber value={inputValues.amount || ""} onValueChange={(e) => handleChangeForm(e.target.value,stateName,"amount")} max={999999999999}
                                style={{direction: "rtl"}} placeholder={this.props.language["input_amount"] || "l_input_amount"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>{this.props.language["visit"] || "l_visit"}</label>
                            <InputNumber value={inputValues.visit || ""} onValueChange={(e) => handleChangeForm(e.target.value,stateName,"visit")} mode="decimal" max={1000}
                                style={{direction: "rtl"}} placeholder={this.props.language["input_visit"] || "l_input_visit"} />
                        </div>
                        <small className="p-invalid p-d-block" style={{textAlign: "center",width: "100%"}}>{inputValues.errorNumber || ""}</small>
                    </div>
                </Dialog>

            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ShopTargetDialog);
