import React, { PureComponent } from 'react'
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { bindActionCreators } from 'redux';
import { WorkingPlanCreateAction } from '../../store/WorkingPlanColtroller'
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const lstReport = [
    { value: 'Total SKU', name: 'Total SKU' },
    { value: 'MCL', name: 'MCL' },
    { value: 'OOS', name: 'OOS' },
    { value: 'CHILLED', name: 'CHILLED' },
    { value: 'CGs', name: 'CGs' },
    { value: 'Target KAS', name: 'Target KAS' }
]

class ShopByCustomerDialog extends PureComponent {
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
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.dates}
                            onChange={e => handleChangeForm(e.target.value, stateName, 'dates')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="fromDate" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon
                        />
                        <small style={{color:'red'}} className="p-invalid p-d-block">{inputValues.errorDates || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{ "l_customer_parent"}</label>
                        <CustomerDropDownList
                            id='customerId'
                            mode='single'
                            onChange={this.handleChange}
                            value={inputValues.customerId} 
                            disabled={actionName === "Update" ? true : false}/>
                        <small style={{color:'red'}} className="p-invalid p-d-block">{inputValues.errorCustomerId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["position"] || "l_position"}</label>
                        <EmployeeTypeDropDownList
                            id="positionId"
                            type="PG-PGAL-GS-Leader"
                            value={inputValues.positionId}
                            onChange={this.handleChange}
                            disabled={actionName === "Update" ? true : false}
                        ></EmployeeTypeDropDownList>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["report"] || "l_report"}</label>
                        <Dropdown
                            className="w-100"
                            id="report"
                            key={lstReport.value}
                            value={inputValues.report}
                            options={lstReport}
                            placeholder="Select an Option" optionLabel="name"
                            filter={true} filterPlaceholder="Select an Option" filterBy="name"
                            showClear={true}
                            onChange={e => handleChangeForm(e.value, stateName, 'report')}
                            disabled={actionName === "Update" ? true : false}
                        />
                        <small style={{color:'red'}}  className="p-invalid p-d-block">{inputValues.errorReport || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["percent"] || "l_percent"}</label>
                        <span className="p-float-label">
                            <InputNumber id="percent" mode="decimal" minFractionDigits={2}
                                value={inputValues.percent} onChange={e => handleChangeForm(e.value, stateName, 'percent')} />
                        </span>
                        <small style={{color:'red'}} className="p-invalid p-d-block">{inputValues.errorPercent || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["target"] || "l_target"}</label>
                        <span className="p-float-label">
                            <InputNumber id="target" mode="decimal" minFractionDigits={2}
                                value={inputValues.target} onChange={e => handleChangeForm(e.value, stateName, 'target')} />
                        </span>
                        <small style={{color:'red'}} className="p-invalid p-d-block">{inputValues.errorTarget || ""}</small>
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
        WorkingPlanController: bindActionCreators(WorkingPlanCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(ShopByCustomerDialog);