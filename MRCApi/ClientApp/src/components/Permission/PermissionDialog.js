import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { PermissionAPI } from "../../store/PermissionController"
import { bindActionCreators } from 'redux';
class PermissionDialog extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.props.PermissionController.GetParentAccountMenus()
    }
    render() {
        const {
            header, displayDialogStateName, stateName, valueStates,
            dialogState, renderFooterDialog, handleAction, handleDialog,
            handleChangeForm,
        } = this.props
        const getParentAccountMenus = [...this.props.getParentAccountMenus];
        let result = [];
        if (getParentAccountMenus.length > 0) {
            getParentAccountMenus.forEach(element => {
                result.push({ name: element.menuTitle, value: element.id });
            });
        }
        return (
            <div>
                <Dialog header={header} visible={dialogState} modal style={{ width: "90vw" }} footer={renderFooterDialog(handleAction, displayDialogStateName)} onHide={() => handleDialog(false, displayDialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid" style={{ height: "" }}>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["parent_title"] || "l_parent_title"}</label>
                            <div>
                                <Dropdown value={valueStates.parentId} options={result} onChange={(e) => handleChangeForm(e.target.value, stateName, "parentId")} optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_parent_title"] || "l_select_parent_title"} />
                            </div>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["menu_title"] || "l_menu_title"}</label>
                            {
                                header === "Update Form" ? (
                                    <InputText
                                        value={valueStates.menuTitle ? valueStates.menuTitle : ""}
                                        onChange={(e) => handleChangeForm(e.target.value, stateName, "menuTitle")}
                                        placeholder={this.props.language["input_menu_title"] || "l_input_menu_title"} />
                                ) : (
                                    <Dropdown value={valueStates.menuTitle ? valueStates.menuTitle : ""}
                                        options={valueStates.menuTitles} onChange={(e) => handleChangeForm(e.value, stateName, "menuTitle")}
                                        optionLabel="menu" filter showClear editable filterBy="menuTitle"
                                        placeholder={this.props.language["select_menu_title"] || "l_select_menu_title"} />
                                )
                            }
                            <small className="p-invalid p-d-block">{valueStates.errorMenuTitle ? valueStates.errorMenuTitle : ""}</small>
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid" style={{ height: "" }}>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["menu_icon"] || "l_menu_icon"}</label>
                            <InputText value={valueStates.menuIcon ? valueStates.menuIcon : ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "menuIcon")} placeholder={this.props.language["input_menu_icon"] || "l_input_menu_icon"} />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["vietnamese_title"] || "l_vietnamese_title"}</label>
                            <InputText value={valueStates.menuTitleVN ? valueStates.menuTitleVN : ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "menuTitleVN")} placeholder={this.props.language["input_vietnamese_title"] || "l_input_vietnamese_title"} />
                        </div>
                    </div>

                    <div className="p-fluid p-formgrid p-grid" style={{ height: "" }}>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["menu_url"] || "l_menu_url"}</label>
                            <InputText value={valueStates.virtualUrl ? valueStates.virtualUrl : ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "virtualUrl")} placeholder={this.props.language["input_virtual_url"] || "l_input_virtual_url"} />
                            <small className="p-invalid p-d-block">{valueStates.errorMenuUrl ? valueStates.errorMenuUrl : ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["virtual_url"] || "l_virtual_url"}</label>
                            <InputText value={valueStates.virtualUrl_a ? valueStates.virtualUrl_a : ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "virtualUrl_a")} placeholder={this.props.language["input_menu_url"] || "l_input_menu_url"} />
                        </div>

                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["display_order"] || "l_display_order"}</label>
                            <InputNumber value={valueStates.displayOrder ? valueStates.displayOrder : ""} onValueChange={(e) => handleChangeForm(e.target.value, stateName, "displayOrder")} mode="decimal" useGrouping={false} placeholder={this.props.language["input_display_order"] || "l_input_display_order"} />
                            <small className="p-invalid p-d-block">{valueStates.errorDisplayOrder ? valueStates.errorDisplayOrder : ""}</small>
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid" style={{ height: "" }}>
                        {/* <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["sort_list"] || "l_sort_list"}</label>
                            <InputNumber value={valueStates.sortList ? valueStates.sortList : ""} onValueChange={(e) => handleChangeForm(e.target.value, stateName, "sortList")} mode="decimal" useGrouping={false} placeholder={this.props.language["input_sort_list"] || "l_input_sort_list"} />
                            <small className="p-invalid p-d-block">{valueStates.errorSortList ? valueStates.errorSortList : ""}</small>
                        </div> */}

                    </div>
                </Dialog>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        getParentAccountMenus: state.permission.getParentAccountMenus,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        PermissionController: bindActionCreators(PermissionAPI, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PermissionDialog);

