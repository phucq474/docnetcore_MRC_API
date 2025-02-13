import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import ShopDropDownList from '../Controls/ShopDropDownList';
import EmployeeDropDownList from "../Controls/EmployeeDropDownList"
import './attendant.css';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';

const user = JSON.parse(localStorage.getItem("USER"));

class AttendantSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            positionByAccount: user.accountId === 10 ? "PG-SR-MER" : "PG-SR-MER-SUP",
        }
    }
    render() {
        const { stateName, displayDialog, handleDialog, handleChangeForm, inputValues, handleChange,
            handleActionFunction, dialogStateName, employeeValue, handleInputFileChange, shopId,
            handleDisplayImageEditor, shiftOption, accId, position
        } = this.props
        const shiftDrop = shiftOption;
        let result = [];
        if (shiftDrop.length > 0) {
            shiftDrop.forEach(element => {
                result.push({ name: element.shiftName, value: element.shiftCode });
            });
        }
        return (
            <React.Fragment>
                <Dialog visible={displayDialog} maximized baseZIndex={9999999} onHide={() => handleDialog(false, dialogStateName)}>
                    <div className="p-d-flex p-jc-center p-ai-center" style={{ width: "80vw", margin: "auto" }} >
                        <div className="" style={{ width: "65vw" }}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>{this.props.language["date_time"] || "l_date_time"}</label>
                                    <Calendar value={inputValues.dateTime} onChange={(e) => handleChangeForm(e.value, stateName, "dateTime")} dateFormat="yy-mm-dd" showTime showIcon />
                                    <small className="p-invalid p-d-block">{inputValues.errorDateTime || ""}</small>
                                </div>
                            </div>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-col-12 p-md-12">
                                    <label>{this.props.language["position"] || "position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        onChange={handleChange}
                                        value={position}
                                        accId={accId}
                                    />
                                </div>
                                <div className="p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>{this.props.language["employee"] || "l_employee"}</label>
                                    <EmployeeDropDownList
                                        type={this.state.positionByAccount}
                                        id="employeeValue" mode="single"
                                        typeId={position || ""}
                                        parentId={0}
                                        onChange={handleChange}
                                        value={employeeValue}
                                        accId={accId}
                                    />
                                    <small className="p-invalid p-d-block">{inputValues.errorEmployee || ""}</small>
                                </div>
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>{this.props.language["store_name"] || "l_store_name"}</label>
                                    <ShopDropDownList
                                        id="shopId"
                                        employeeId={employeeValue}
                                        // useBindData={true}
                                        onChange={handleChange}
                                        accId={accId}
                                        value={shopId} />
                                    <small className="p-invalid p-d-block">{inputValues.errorStoreName || ""}</small>
                                </div>
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>{this.props.language["shift_code"] || "l_shift_code"}</label>
                                    <Dropdown value={inputValues.shiftCode ? inputValues.shiftCode : ""} options={result} onChange={(e) => handleChangeForm(e.value, stateName, "shiftCode")} optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_shift_code"] || "l_select_shift_code"} />
                                    <small className="p-invalid p-d-block">{inputValues.errorShiftCode || ""}</small>
                                </div>
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>{this.props.language["check_type"] || "l_check_type"}</label>
                                    <Dropdown value={inputValues.checkType ? inputValues.checkType : ""} options={inputValues.checkTypes} onChange={(e) => handleChangeForm(e.value, stateName, "checkType")} optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_store_name"] || "l_select_store_name"} />
                                    <small className="p-invalid p-d-block">{inputValues.errorCheckType || ""}</small>
                                </div>

                            </div>
                        </div>
                        <div className="" style={{ width: "45vw" }}>
                            <div className="attendant_container" style={{ top: "5%" }} >
                                <img src={inputValues.emptyImage || ""} className={inputValues.classImage} style={{ width: "30vw", height: "50vh", top: 0 }} alt="" />
                                <input type="file" accept="image/*" className={inputValues.classInputFile} onChange={() => handleInputFileChange(0)}
                                    style={{ width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                />
                            </div>
                            <small className="p-invalid p-d-block" style={{ textAlign: "center" }}>{inputValues.errorImage || ""}</small>
                        </div>
                    </div>
                    <div style={{ width: '100vw', height: '50vh', position: "absolute", top: "83vh" }}>
                        <hr />
                        <div style={{ marginRight: "5%", float: "right" }}>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => handleDialog(false, dialogStateName)} className="p-button-danger p-mr-2"
                                style={{ width: "100px" }}
                            />
                            <Button label="Insert" icon="pi pi-check" onClick={() => handleActionFunction(0)} autoFocus
                                style={{ width: "100px" }} className="p-button-info p-mr-2"
                            />
                            <Button onClick={async () => { await handleDisplayImageEditor(true, "displayImageEditor", { indexImage: 0, imageForEdit: inputValues.prevSavedImage || null, insertAll: true, dialog: dialogStateName }) }}
                                className="p-button-warning" icon="pi pi-image" />
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(AttendantSideBar);
