import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import React, { PureComponent } from "react";
import MasterListDataDropDownList from '../Controls/MasterListDataDropDownList';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import './Employee.css';

class EmployeeWorkingStatus extends PureComponent {
    constructor(props) {
        super(props);
        this.lstResultMaternityStatus = [
            { value: 1, name: `${this.props.language["solved"] || "l_solved"}` },
            { value: 2, name: `${this.props.language["solving"] || "l_solving"}` },
            { value: 3, name: `${this.props.language["comment"] || "l_comment"}` }
        ]
    }
    render() {
        const { dateActive, dateExpire, renderAction, actualDate, Notes, maternityStatus, deleteDialog, handleDeleteWorkingDialog, renderFooterDeleteDialog, Infor } = this.props
        return (
            <Card className="p-shadow-10" title={this.props.language["employee_status"] || "l_employee_status"}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["working_status"] || "l_working_status"}</label>
                        <MasterListDataDropDownList
                            listCode="WorkingStatus"
                            id="workingStatusId"
                            value={this.props.Infor.workingStatusId}
                            onChange={this.props.handlerchangeDropDown}
                            accId={this.props.accId}
                        ></MasterListDataDropDownList>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar
                            showIcon monthNavigator yearNavigator yearRange="2000:2030"
                            id="fromtodate" selectionMode={this.props.Infor.workingStatusId === 3 ? "single" : "range"}
                            dateFormat="yy-mm-dd"
                            value={this.props.Infor.workingStatusId === 3 ? this.props.Infor.fromtodate[0] : this.props.Infor.fromtodate ? this.props.Infor.fromtodate : [new Date(), new Date()]}
                            onChange={(e) => this.props.handlerChangeDate(e, 'WorkingStatus')}>
                        </Calendar>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6" style={this.props.Infor.workingStatusId !== 4 ? { display: 'none' } : {}}>
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["actual_date"] || "l_actual_date"}</label>
                        <Calendar
                            showIcon
                            id="actualDate" monthNavigator yearNavigator yearRange="2000:2030"
                            dateFormat="yy-mm-dd"
                            disabled={this.props.Infor.workingStatusId == 4 ? false : true}
                            value={this.props.Infor.actualDate}
                            onChange={this.props.handlerchangeInput}></Calendar>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6" style={this.props.Infor.workingStatusId !== 4 ? { display: 'none' } : {}}>
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["result_maternity_status"] || "l_result_maternity_status"}</label>
                        <Dropdown
                            id="maternityStatus"
                            className="w-100"
                            key={this.lstResultMaternityStatus.value}
                            options={this.lstResultMaternityStatus}
                            disabled={this.props.Infor.workingStatusId == 4 ? false : true}
                            placeholder={this.props.language["select_an_option"] || "l_select_an_option"} optionLabel="name"
                            value={this.props.Infor.maternityStatus}
                            onChange={this.props.handlerchangeDropDown}
                        ></Dropdown>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6" style={this.props.Infor.workingStatusId !== 4 ? { display: 'none' } : {}}>
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["comment"] || "l_comment"}</label>
                        <InputText
                            id="maternityComment"
                            className="w-100"
                            value={this.props.Infor.maternityComment || ""}
                            onChange={this.props.handlerchangeInput}
                            disabled={this.props.Infor.workingStatusId == 4 ? false : true}
                        ></InputText>
                    </div>
                </div>
                <br />
                <Dialog
                    visible={deleteDialog}
                    onHide={() => handleDeleteWorkingDialog(false)}
                    footer={renderFooterDeleteDialog}
                    header="Confirmation" icon="pi pi-exclamation-triangle">
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} /> Bạn có chắc chắn xóa?
                    </div>
                </Dialog>
                <div className="p-fluid">
                    <DataTable value={this.props.employeeWorkingStatus}>
                        <Column style={{ width: '3%', textAlign: 'center', }} header="No." field="rowNum"></Column>
                        <Column style={{ width: '8%' }} header={this.props.language["working_status"] || "l_working_status"} field="workingStatus"></Column>

                        <Column style={{ width: '12%' }} header={this.props.language["date_active"] || "l_date_active"}
                            body={(rowData, e) => dateActive(rowData, e)}></Column>

                        <Column style={{ width: '12%' }} header={this.props.language["date_expire"] || "l_date_expire"}
                            body={(rowData, e) => dateExpire(rowData, e)}></Column>
                        {/* <Column style={{ width: '12%' }} header={this.props.language["actual"] || "l_actual"}
                            body={(rowData, e) => actualDate(rowData, e)}></Column>
                        <Column style={{ width: '10%' }} header={this.props.language["maternity_status"] || "l_maternity_status"}
                            body={(rowData, e) => maternityStatus(rowData, e)}></Column>
                        <Column style={{ width: '12%' }} header={this.props.language["notes"] || "notes"}
                            body={(rowData, e) => Notes(rowData, e)}></Column> */}
                        <Column header="#" body={(rowdata, e) => renderAction(rowdata, e)} style={{ textAlign: 'center', width: '5%' }} ></Column>
                    </DataTable>
                </div>
            </Card>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeWorkingStatus);