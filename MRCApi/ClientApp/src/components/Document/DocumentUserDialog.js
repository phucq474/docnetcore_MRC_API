import React, { Component } from 'react'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { connect } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from 'redux';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { DocumentCreateAction } from '../../store/DocumentController';
import moment from 'moment';
import { MultiSelect } from 'primereact/multiselect';
class PromotionListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            divisionId: 0,
            brandId: 0,
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            area: ''
        }
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value === null ? "" : value });
        this.props.handleChangeDropDown(id, value)
    }
    render() {
        const { actionName, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction,
        } = this.props
        return (
            <Dialog style={{ width: '60vw' }}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-3 p-md-6 p-sm-6">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.dates} onChange={e => handleChangeForm(e.target.value, stateName, 'dates')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="dates" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small className="p-invalid p-d-block">{inputValues.errorDates || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label>{this.props.language["document"] || "l_document"}</label>
                        <MultiSelect value={inputValues.document}
                            options={inputValues.getDocument}
                            filter showClear
                            onChange={(e) => handleChangeForm(e.value, stateName, "document")}
                            optionLabel="documentName" editable
                            placeholder={this.props.language["select_document"] || "l_select_document"} />
                        <small className="p-invalid p-d-block">{inputValues.errorDocument || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        <label>{this.props.language["position"] || "l_position"}</label>
                        <EmployeeTypeDropDownList
                            id="positionId"
                            type="PG-PGAL-GS-Leader"
                            value={inputValues.positionId}
                            onChange={this.handleChange}
                        ></EmployeeTypeDropDownList>
                    </div>
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        <label>{this.props.language["manager"] || "l_manager"}</label>
                        <EmployeeDropDownList
                            type="SUP-Leader"
                            typeId={0}
                            mode="single"
                            id="supId"
                            parentId={0}
                            value={inputValues.supId}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        <label>{this.props.language["employee"] || "l_employee"}</label>
                        <EmployeeDropDownList
                            type=""
                            typeId={inputValues.positionId === null ? 0 : inputValues.positionId}
                            mode=""
                            id="employeeId"
                            parentId={inputValues.supId}
                            value={inputValues.employeeId}
                            onChange={this.handleChange}
                        />
                        <small className="p-invalid p-d-block">{inputValues.errorEmployee || ""}</small>
                    </div>

                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        getDocument: state.documents.getDocument,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DocumentController: bindActionCreators(DocumentCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(PromotionListDialog);