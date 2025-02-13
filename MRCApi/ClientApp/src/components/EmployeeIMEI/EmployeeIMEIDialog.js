import React, { Component } from 'react';
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import { connect } from 'react-redux';

class EmployeeIMEIDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
        this.props.handleChangeForm(value, this.props.stateName, id)
    }
    render() {
        const { stateName, displayDialog, displayFooterAction, handleDisplayDialog, handleChangeForm, inputValues,
            actionName, handleActionFunction, dialogStateName, imeiCheckOptions,
        } = this.props
        return (
            <React.Fragment>
                <Dialog header={actionName} visible={displayDialog} style={{ width: "70vw" }} footer={displayFooterAction(actionName, () => handleDisplayDialog(false, dialogStateName), handleActionFunction)} onHide={() => handleDisplayDialog(false, dialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="basic">{this.props.language["employee"] || "l_employee"}</label>
                            <EmployeeDropDownList
                                id="employee"
                                type="PG-Leader-SUP"
                                typeId={0}
                                disabled={dialogStateName === "visibleUpdateDialog"}
                                mode={'single'}
                                parentId={0}
                                onChange={this.handleChange}
                                value={inputValues.employee} />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="basic">{this.props.language["is_lock"] || "l_is_lock"}</label>
                            <Dropdown value={inputValues.checkIMEI} options={imeiCheckOptions} placeholder={this.props.language["imei_status"] || "l_imei_status"}
                                onChange={(e) => handleChangeForm(e.value, stateName, "checkIMEI")} optionLabel="name" />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{"imei0"}</label>
                            <InputText value={inputValues.imei0 || ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "imei0")} placeholder={"imei0"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{"imei1"}</label>
                            <InputText value={inputValues.imei1 || ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "imei1")} placeholder={"imei1"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{"imei2"}</label>
                            <InputText value={inputValues.imei2 || ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "imei2")} placeholder={"imei2"} />
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
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
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeIMEIDialog);
