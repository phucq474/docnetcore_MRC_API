import React, { Component } from 'react'
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList'
import ShopDropDownList from '../Controls/ShopDropDownList';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import ShiftDropDownList from '../Controls/ShiftDropDownList';
import { bindActionCreators } from 'redux';
import { ShopTargetAPI } from '../../store/ShopTargetController'
import { WorkingPlanCreateAction } from '../../store/WorkingPlanColtroller';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import moment from 'moment';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
class SOSListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            divisionId: '',
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            brandId: 0,
            labelButton: "No File Chosen",
            deleteTableDialog: false
        }
        this.images = React.createRef()
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleChange = async (id, value) => {
        await this.setState({ [id]: value === null ? "" : value });
        await this.props.handleChangeDropDown(id, value)
    }
    checkBoxInsert = (rowData, event, id) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <Checkbox checked={rowData[id] === 1 ? true : false}
                    onChange={(e) => this.props.handleChangeCheckBox(id, e.checked, event.rowIndex)}
                ></Checkbox>
            </div>
        )
    }
    showFromDate = (rowData, event, id) => {
        return (
            <div>
                <Calendar fluid
                    value={new Date(moment(rowData.applyDate).format('YYYY-MM-DD'))}
                    onChange={(e) => this.props.handleChangeTable(e.target.id, e.target.value ? moment(e.target.value).format('YYYY-MM-DD') : e.target.value, event.rowIndex)}
                    dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                    id="applyDate"
                    inputStyle={{ width: '91.5%', visible: false }}
                    style={{ width: '100%' }} showIcon
                />
            </div>
        )
    }
    showToDate = (rowData, event, id) => {
        return (
            <div>
                <Calendar fluid
                    value={new Date(moment(`${rowData.toDate}`).format('YYYY-MM-DD'))}
                    onChange={(e) => this.props.handleChangeTable(e.target.id, e.target.value ? +moment(e.target.value).format('YYYYMMDD') : e.target.value, event.rowIndex)}
                    dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                    id="toDate"
                    inputStyle={{ width: '91.5%', visible: false }}
                    style={{ width: '100%' }} showIcon
                />
            </div>
        )
    }
    showOrderBy = (rowData, event, id) => {
        return (
            <div>
                <InputNumber id="orderBy" onValueChange={(e) => this.props.handleChangeTable(e.target.id, e.target.value, event.rowIndex)} value={rowData.orderBy} />
            </div>
        )
    }
    render() {
        let deleteDialog = null;
        const { nameAction, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction, checkBoxData, bindDataShop,
            handleChangeDropDown, } = this.props
        if (this.state.deleteTableDialog)
            deleteDialog = <Dialog header="Confirmation" modal style={{ width: '350px' }}
                visible={this.state.deleteTableDialog}
                footer={this.footerDeleteTableDialog()}
                onHide={() => this.handleDeleteTableDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        return (
            <React.Fragment>
                {deleteDialog}
                <Toast ref={(el) => this.toast = el} />
                <Dialog style={nameAction === 'Insert' ? { width: '80vw' } : { width: '60vw' }}
                    maximized={nameAction === 'Insert' ? true : false}
                    header={nameAction}
                    visible={displayDialog}
                    footer={footerAction(false)}
                    onHide={() => handleActionDialog(false)}>
                    <div className="p-fluid p-formgrid p-grid">
                        {nameAction === 'Insert' &&
                            <div className="p-field p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["from_date"] || "l_from_date"}</label>
                                <Calendar fluid
                                    value={inputValues.fromDate}
                                    onChange={(e) => handleChangeForm(e.value, stateName, 'fromDate')}
                                    dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                    inputStyle={{ width: '91.5%', visible: false }}
                                    style={{ width: '100%' }} showIcon
                                />
                                <small className="p-invalid p-d-block">{inputValues.errorFromDate || ""}</small>
                            </div>}
                        {nameAction === 'Insert' &&
                            <div className="p-field p-col-12 p-md-1 p-sm-6" style={{ marginTop: 8 }}>
                                <br />
                                <Button label={this.props.language["get_cate"] || "l_get_cate"} className="p-button-success" onClick={() => bindDataShop()} />
                            </div>}
                        {nameAction === 'Update' &&
                            <div className="p-field p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                <Calendar fluid
                                    value={inputValues.applyDate}
                                    onChange={(e) => handleChangeForm(e.value, stateName, 'applyDate')}
                                    dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                    inputStyle={{ width: '91.5%', visible: false }}
                                    style={{ width: '100%' }} showIcon
                                />
                                <small className="p-invalid p-d-block">{inputValues.errorFromToDate || ""}</small>
                            </div>}
                        {nameAction === 'Update' &&
                            <div className="p-field p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["order_by"] || "l_order_by"}</label>
                                <InputNumber id="orderBy" onValueChange={(e) => handleChangeForm(e.target.value, stateName, 'orderBy')} value={inputValues.orderBy} />
                            </div>
                        }
                        {nameAction === 'Update' &&
                            <div className="p-field p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["status"] || "l_status"}</label>
                                <div style={{ display: 'flex', marginTop: '4px' }}>
                                    <div style={{ marginRight: 15 }}>
                                        <span className="p-float-label">
                                            <InputSwitch checked={inputValues.status} onChange={(e) => handleChangeForm(e.value, stateName, 'status')} />
                                        </span>
                                    </div>
                                    <div>
                                        <label>{inputValues.status ? <strong>ON</strong> : <strong>OFF</strong>}</label>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    {nameAction === 'Insert' &&
                        <div className="p-field p-col-12 p-md-12 p-sm-6">
                            <DataTable rowHover
                                value={inputValues.dataTableInsert} style={{ fontSize: "13px" }} >
                                <Column field="stt" header='No.' filter style={{ width: 60 }} />
                                <Column field="division" style={{ width: 200 }} filter={true} header={this.props.language["division"] || "l_division"} />
                                <Column field="brand" style={{ width: 150 }} filter={true} header={this.props.language["brand"] || "l_brand"} />
                                <Column field="category" style={{ width: 150 }} filter={true} header={this.props.language["category"] || "l_category"} />
                                <Column field="fromDate" style={{ width: 150 }} body={this.showFromDate} filter={true} header={this.props.language["from_date"] || "l_from_date"} />
                                <Column field="fromDate" style={{ width: 150 }} body={this.showOrderBy} filter={true} header={this.props.language["order"] || "l_order"} />
                                <Column field="isInsert" style={{ width: 60 }} body={(rowData, e) => this.checkBoxInsert(rowData, e, 'isInsert')} filter={true} header={this.props.language["is_insert"] || "l_is_insert"} />
                            </DataTable>
                        </div>}
                </Dialog>
            </React.Fragment>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        shiftLists: state.workingPlans.shiftLists,
        deleteWorkingDefault: state.workingPlans.deleteWorkingDefault,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        WorkingPlanController: bindActionCreators(WorkingPlanCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(SOSListDialog);