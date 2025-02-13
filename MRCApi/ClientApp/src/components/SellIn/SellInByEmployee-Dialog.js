import React, { PureComponent } from 'react'
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { bindActionCreators } from 'redux';
import { actionCreatorsSellIn } from '../../store/SellInController';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Dropdown } from 'primereact/dropdown';
import YearDropDownList from '../Controls/YearDropDownList';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const lstMonth = [
    { value: 1, name: "1" },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
    { value: 7, name: '7' },
    { value: 8, name: '8' },
    { value: 9, name: '9' },
    { value: 10, name: '10' },
    { value: 11, name: '11' },
    { value: 12, name: '12' }

]

class SellInByEmployeeDialog extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    handleChange = async (id, value) => {
        await this.setState({ [id]: value === null ? "" : value });
        await this.props.handleChangeDropDown(id, value)
    }
    componentDidMount() {

    }
    render() {
        const { actionName, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction,
        } = this.props
        return (
            <Dialog style={{ width: '80vw' }}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["year"] || "l_year"}</label>
                        <YearDropDownList
                            id="year"
                            onChange={this.handleChange}
                            value={inputValues.year}
                            disabled={actionName === "Update" ? true : false} />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorYear || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["month"] || "l_month"}</label>
                        <Dropdown
                            className="w-100"
                            id="month"
                            key={lstMonth.value}
                            value={inputValues.month}
                            options={lstMonth}
                            placeholder="Select an Option" optionLabel="name"
                            filter={true} filterPlaceholder="Select an Option" filterBy="name"
                            showClear={true}
                            onChange={(e) => { this.handleChange("month", e.target.value) }}
                            disabled={actionName === "Update" ? true : false}
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorMonth || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["position"] || "l_position"}</label>
                        <EmployeeTypeDropDownList
                            id="positionId"
                            type="PG-PGAL-GS-Leader"
                            value={inputValues.positionId}
                            onChange={this.handleChange}
                            accId={this.props.accId}
                            disabled={actionName === "Update" ? true : false}
                        ></EmployeeTypeDropDownList>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["manager"] || "l_manager"}</label>
                        <EmployeeDropDownList
                            type="SUP-Leader"
                            typeId={0}
                            mode="single"
                            id="supId"
                            parentId={0}
                            accId={this.props.accId}
                            value={inputValues.supId}
                            onChange={this.handleChange}
                            disabled={actionName === "Update" ? true : false}
                        />
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["employee"] || "l_employee"}</label>
                        <EmployeeDropDownList
                            type=""
                            typeId={!inputValues.positionId ? 0 : inputValues.positionId}
                            parentId={!inputValues.supId ? 0 : inputValues.supId}
                            id="employeeId"
                            accId={this.props.accId}
                            onChange={this.handleChange}
                            value={inputValues.employeeId}
                            mode="single"
                            disabled={actionName === "Update" ? true : false}
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorEmployeeId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["shop"] || "l_shop"}</label>
                        <Dropdown
                            className="w-100"
                            id="shopId"
                            key={this.props.listShop.value}
                            value={inputValues.shopId}
                            options={this.props.listShop}
                            placeholder="Select an Option" optionLabel="name"
                            filter={true} filterPlaceholder="Select an Option" filterBy="name"
                            showClear={true}
                            onChange={(e) => { this.handleChange("shopId", e.target.value) }}
                            disabled={actionName === "Update" ? true : false}
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorDivisionId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["division"] || "l_division"}</label>
                        <Dropdown
                            className="w-100"
                            id="divisionId"
                            key={this.props.listDivision.value}
                            value={inputValues.divisionId}
                            options={this.props.listDivision}
                            placeholder="Select an Option" optionLabel="name"
                            filter={true} filterPlaceholder="Select an Option" filterBy="name"
                            showClear={true}
                            onChange={(e) => { this.handleChange("divisionId", e.target.value) }}
                            disabled={actionName === "Update" ? true : false}
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorDivisionId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["target"] || "l_target"}</label>
                        <span className="p-float-label">
                            <InputNumber id="target" mode="decimal" minFractionDigits={2}
                                value={inputValues.target} onChange={e => handleChangeForm(e.value, stateName, 'target')} />
                        </span>
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorTarget || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["actual"] || "l_actual"}</label>
                        <span className="p-float-label">
                            <InputNumber id="actual" mode="decimal" minFractionDigits={2}
                                value={inputValues.actual} onChange={e => handleChangeForm(e.value, stateName, 'actual')} />
                        </span>
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorActual || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["note"] || "l_note"}</label>
                        <span className="p-float-label">
                            <InputText id="note" value={inputValues.note} onChange={e => handleChangeForm(e.target.value, stateName, 'note')} />
                        </span>
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorActual || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["up_to_date"] || "l_up_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.upToDate} onChange={e => handleChangeForm(e.target.value, stateName, 'upToDate')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="upToDate" selectionMode="single"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{inputValues.errorUpToDate || ""}</small>

                    </div>
                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SellInController: bindActionCreators(actionCreatorsSellIn, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(SellInByEmployeeDialog);