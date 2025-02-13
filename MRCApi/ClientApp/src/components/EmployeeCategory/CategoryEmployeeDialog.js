import React, { PureComponent } from 'react'
import { Calendar } from 'primereact/calendar';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { CategoryApp } from '../Controls/CategoryMaster';
import EmployeeDropDownList from "../Controls/EmployeeDropDownList"
import { Dropdown } from 'primereact/dropdown';

class CategoryEmployeeDialog extends PureComponent {
    constructor(props) {
        super(props)
    }

    handleChange = async (id, value) => {
        await this.props.handleChangeDropDown(id, value)
    }
    render() {
        const { actionName, displayDialog, inputValues, handleActionDialog, footerAction,
            handleCalendar } = this.props
        return (
            <Dialog style={{ width: '80vw' }}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-grid">
                    <div className="p-field p-col-12 p-md-4">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar
                            value={inputValues.dates || []}
                            onChange={(e) => handleCalendar(e.target.id, e.value)}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            selectionMode="range"
                            id='dates'
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small className="p-invalid p-d-block">{inputValues.errorFromDate || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label>{this.props.language["employee"] || "l_employee"}</label>
                        <EmployeeDropDownList
                            type={0}
                            id="employeeId" mode="single"
                            typeId={""}
                            parentId={0}
                            disabled={actionName === 'Update' ? true : false}
                            onChange={this.handleChange}
                            accId={this.props.accId}
                            value={inputValues.employeeId}
                        />
                        <small className="p-invalid p-d-block">{inputValues.errorEmployeeId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label>{this.props.language["category"] || "l_category"}</label>
                        <Dropdown
                            id="categoryId"
                            style={{ width: '100%' }}
                            options={this.props.categories}
                            onChange={(e) => this.handleChange('categoryId', e.target.value)}
                            value={inputValues.categoryId}
                            placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                            optionLabel="name"
                            filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                            filterBy="name"
                            filter
                            showClear={true}
                            disabled={actionName === 'Update' ? true : false}
                        />
                    </div>
                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        usedivision: false,
        usecate: true,
        usesubcate: false,
        usesegment: false,
        usesubsegment: false,
        language: state.languageList.language,
    }
}
function mapDispatchToProps() {
    return {

    }
}
export default connect(mapstateToProps, mapDispatchToProps)(CategoryEmployeeDialog);