import React,{Component} from 'react';
import {InputText} from "primereact/inputtext";
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {connect} from 'react-redux';

class MasterDialog extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {stateName,displayDialog,displayFooterAction,handleDisplayDialog,handleChangeForm,inputValues,isLockOptions,
            actionName,handleActionFunction,dialogStateName
        } = this.props
        return (
            <React.Fragment>
                <Dialog header={actionName} visible={displayDialog} style={{width: "70vw"}} footer={displayFooterAction(actionName,() => handleDisplayDialog(false,dialogStateName),handleActionFunction)} onHide={() => handleDisplayDialog(false,dialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="basic">{this.props.language["list_code"] || "l_list_code"}</label>
                            <Dropdown value={inputValues.listCode || ""} options={this.props.getListCodeMasterlist} onChange={(e) => handleChangeForm(e.value,stateName,"listCode")}
                                optionLabel="listCode" filter showClear filterBy="listCode" editable={inputValues.isEditableListCode} placeholder={this.props.language["input_list_code"] || "l_input_list_code"} />
                            <small className="p-invalid p-d-block">{inputValues.errorListCode || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="basic">{this.props.language["code"] || "l_code"}</label>
                            <InputText value={inputValues.code || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"code")} placeholder={this.props.language["input_code"] || "l_input_code"} />
                            <small className="p-invalid p-d-block">{inputValues.errorCode || ""}</small>
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["name"] || "l_name"}</label>
                            <InputText value={inputValues.name || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"name")} placeholder={this.props.language["input_name"] || "l_input_name"} />
                            <small className="p-invalid p-d-block">{inputValues.errorName || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["name_vn"] || "l_name_vn"}</label>
                            <InputText value={inputValues.nameVN || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"nameVN")} placeholder={this.props.language["input_name_vn"] || "l_input_name_vn"} />
                            <small className="p-invalid p-d-block">{inputValues.errorNameVN || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["is_lock"] || "l_is_lock"}</label>
                            <Dropdown value={inputValues.isLock} options={isLockOptions} onChange={(e) => handleChangeForm(e.value,stateName,"isLock")} optionLabel="name" />
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["ref_code"] || "l_ref_code"}</label>
                            <InputText value={inputValues.ref_Code || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"ref_Code")} placeholder={this.props.language["input_ref_code"] || "l_input_ref_code"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["ref_name"] || "l_ref_name"}</label>
                            <InputText value={inputValues.ref_Name || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"ref_Name")} placeholder={this.props.language["input_ref_name"] || "l_input_ref_name"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["image_item"] || "l_image_item"}</label>
                            <InputText value={inputValues.imageItem || ""} onChange={(e) => handleChangeForm(e.target.value,stateName,"imageItem")} placeholder={this.props.language["input_image"] || "l_input_image"} />
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
        getListCodeMasterlist: state.masterList.getListCodeMasterlist,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MasterDialog);
