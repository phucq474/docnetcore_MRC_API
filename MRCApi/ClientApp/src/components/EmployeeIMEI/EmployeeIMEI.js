import React, { Component } from 'react'
import { GetEmployeeIMEIList, GetEmployeeIMEIDetail, InsertEmployeeIMEI, } from '../../store/EmployeeIMEIController';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { HelpPermission } from '../../Utils/Helpler';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable'
import EmployeeIMEIDialog from './EmployeeIMEIDialog'
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { ProgressSpinner } from 'primereact/progressspinner';
import Page403 from '../ErrorRoute/page403';
import { Checkbox } from 'primereact/checkbox';
import { SelectButton } from 'primereact/selectbutton';

class EmployeeIMEI extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visibleInsertDialog: false,
            visibleUpdateDialog: false,
            permission: {},
            datas: [],
            inputValues: {},
        }
        this.pageId = 3174;

        this.imeiCheckOptions = [
            { id: 1, name: "Check" },
            { id: 0, name: "Uncheck" }
        ]
        this.styleSpinner = {
            width: "50px",
            height: "50px",
            position: "absolute",
            zIndex: 100,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
    }
    handleSearch = async () => {
        await this.setState({ loading: true, })
        const { supId, position, employee, checkIMEI, } = this.state
        const data = {
            supId: supId || null,
            position: position || null,
            employeeId: employee || null,
            checkIMEI: checkIMEI?.id !== undefined ? checkIMEI?.id : null,
        }
        const result = await GetEmployeeIMEIList(data)
        await this.setState({ datas: result, loading: false, })
    }
    handleInsert = async () => {
        try {
            const { imei0, imei1, imei2, employee, checkIMEI, } = this.state.inputValues
            const data = {
                imei0: imei0 || null,
                imei1: imei1 || null,
                imei2: imei2 || null,
                checkIMEI: checkIMEI?.id !== undefined ? checkIMEI?.id : null,
                employeeId: employee || null,
            }
            if (!employee) {
                this.Alert(this.props.language["please_select_an_employee"] || "l_please_select_an_employee", "error")
                return
            }
            this.setState({ loading: true, })
            const result = await InsertEmployeeIMEI(data)
            if (result?.[0]?.alert == "1") {
                this.Alert("Insert Successfully", "info")
                this.handleDisplayDialog(false, 'visibleInsertDialog')
                this.state.datas = result
                this.setState({
                    datas: this.state.datas
                })
            } else {
                this.Alert("Insert Failed", "error")
            }
        } catch (e) {
            console.log(e)
        }
        this.setState({ loading: false, })
    }
    handleUpdate = async () => {
        try {
            const { imei0, imei1, imei2, employee, checkIMEI, } = this.state.inputValues
            const data = {
                imei0: imei0 || null,
                imei1: imei1 || null,
                imei2: imei2 || null,
                checkIMEI: checkIMEI?.id !== undefined ? checkIMEI?.id : null,
                employeeId: employee || null,
            }
            this.setState({ loading: true, })
            const result = await InsertEmployeeIMEI(data)
            if (result?.[0]?.alert == "1") {
                this.Alert("Update Successfully", "info")
                this.handleDisplayDialog(false, 'visibleUpdateDialog')
                this.state.datas[this.state.rowIndex] = result?.[0] || {}
                this.setState({
                    datas: this.state.datas
                })
            } else {
                this.Alert("Update Failed", "error")
            }
        } catch (e) {
            console.log(e)
        }
        this.setState({ loading: false, })
    }
    handleDisplayDialog = async (boolean, stateName, rowData, rowIndex) => {
        if (boolean) {
            if (stateName === "visibleInsertDialog") {
                this.setState({
                    inputValues: {
                        checkIMEI: this.imeiCheckOptions.filter(e => e.id === 1)?.[0] || {},
                    }
                })
            } else if (stateName === "visibleUpdateDialog") {
                const resultDetail = await GetEmployeeIMEIDetail(rowData.employeeId)
                this.setState({
                    inputValues: {
                        ...this.state.inputValues,
                        employee: resultDetail?.[0]?.employeeId || null,
                        imei0: resultDetail?.[0]?.imei0 || null,
                        imei1: resultDetail?.[0]?.imei1 || null,
                        imei2: resultDetail?.[0]?.imei2 || null,
                        checkIMEI: this.imeiCheckOptions.filter(e => e.id === resultDetail?.[0]?.checkIMEI)?.[0] || {},
                    }
                })
            }
            this.setState({
                [stateName]: boolean,
                rowIndex: rowIndex,
            })
        } else {
            this.setState({
                [stateName]: boolean
            })
        }
    }
    handleChangeForm = async (value, stateName = "", subStateName = null) => {
        await this.setState({
            [stateName]: { ...this.state[stateName], [subStateName]: value == null ? "" : value }
        });
        if (subStateName === "employee") {
            const resultDetail = await GetEmployeeIMEIDetail(value)
            this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    imei0: resultDetail?.[0]?.imei0 || null,
                    imei1: resultDetail?.[0]?.imei1 || null,
                    imei2: resultDetail?.[0]?.imei2 || null,
                    checkIMEI: this.imeiCheckOptions.filter(e => e.id === resultDetail?.[0]?.checkIMEI)?.[0] || {},
                }
            })
        }
    }
    actionButtons = (rowData, event) => {
        return (
            <div className="p-d-flex p-flex-column">
                {this.state.permission?.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover" onClick={() => this.handleDisplayDialog(true, "visibleUpdateDialog", rowData, event.rowIndex)} />}
            </div>
        )
    }
    renderFooterAction = (actionName, cancel, proceed) => {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    componentDidMount() {
    }
    render() {
        let insertDialog = null, updateDialog = null
        const leftContents = (
            <React.Fragment>
                {this.state.permission?.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {/* {this.state.permission?.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleDisplayDialog(true, 'visibleInsertDialog')} style={{ marginRight: "15px" }} />} */}
            </React.Fragment>
        );
        if (this.state.visibleInsertDialog) { // * INSERT DIALOG
            insertDialog = <EmployeeIMEIDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                dialogStateName={"visibleInsertDialog"}
                displayDialog={this.state.visibleInsertDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleInsert}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDisplayDialog={this.handleDisplayDialog}
                imeiCheckOptions={this.imeiCheckOptions} />
        }
        if (this.state.visibleUpdateDialog) { // * UPDATE DIALOG
            updateDialog = <EmployeeIMEIDialog
                stateName={"inputValues"}
                actionName={"Update"}
                dialogStateName={"visibleUpdateDialog"}
                displayDialog={this.state.visibleUpdateDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleUpdate}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDisplayDialog={this.handleDisplayDialog}
                imeiCheckOptions={this.imeiCheckOptions} />
        }
        return (
            this.state.permission?.view ? (<React.Fragment >
                <Toast ref={(el) => this.toast = el} />
                {this.state.loading && (
                    <ProgressSpinner style={this.styleSpinner} strokeWidth="8" fill="none" animationDuration=".5s" />
                )}
                <Accordion activeIndex={0} onTabChange={(e) => this.setState({})}>
                    <AccordionTab header={this.props.language["search"] || "search"}>
                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["supervisor"] || "l_supervisor"}</label>
                                <EmployeeDropDownList
                                    type="SUP-Leader"
                                    typeId={0}
                                    id="supId"
                                    mode='single'
                                    parentId={0}
                                    onChange={this.handleChange}
                                    value={this.state.supId} />
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["position"] || "l_position"}</label>
                                <EmployeeTypeDropDownList
                                    id="position"
                                    type="PG-Leader-SUP-GS"
                                    onChange={this.handleChange}
                                    value={this.state.position} />
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["employee"] || "l_employee"}</label>
                                <EmployeeDropDownList
                                    id="employee"
                                    type="PG-Leader-SUP"
                                    typeId={!this.state.position ? 0 : this.state.position}
                                    parentId={!this.state.supId ? 0 : this.state.supId}
                                    mode={'single'}
                                    onChange={this.handleChange}
                                    value={this.state.employee} />
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["imei_status"] || "l_imei_status"}</label>
                                <SelectButton value={this.state.checkIMEI} options={this.imeiCheckOptions} onChange={(e) => this.handleChange("checkIMEI", e.value)}
                                    optionLabel="name" />
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <Toolbar left={leftContents} right={rightContents} />
                <DataTable
                    paginatorPosition={"both"}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    value={this.state.datas} paginator={true} rows={50}
                    rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                    <Column filter header='No.' field="rowNum" style={{ width: '10%', textAlign: 'center', }} />
                    <Column field="position" header={this.props.language["position"] || "l_position"} style={{ textAlign: 'center', width: '20%', }} filter={true} />
                    <Column field="employeeCode" header={this.props.language["employee_code"] || "l_employee_code"} style={{ textAlign: 'center', width: '20%', }} filter={true} />
                    <Column field="employeeName" header={this.props.language["employee"] || "l_employee"} style={{ textAlign: 'center', width: '20%', }} filter={true} />
                    <Column field="imei0" header={"imei0"} style={{ textAlign: 'center', width: '15%', }} filter={true} />
                    <Column field="imei1" header={"imei1"} style={{ textAlign: 'center', width: '15%', }} filter={true} />
                    <Column field="imei2" header={"imei2"} style={{ textAlign: 'center', width: '15%', }} filter={true} />
                    <Column body={(rowData) => {
                        return (
                            <Checkbox checked={rowData.checkIMEI == '1'} />
                        )
                    }} header={this.props.language["status"] || "l_status"} style={{ textAlign: 'center', width: '10%', }} filter={true} />
                    <Column body={this.actionButtons} header="#" style={{ width: '10%', textAlign: 'center' }}></Column>
                </DataTable>

                {insertDialog}
                {updateDialog}
            </React.Fragment>) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))

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
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeIMEI)