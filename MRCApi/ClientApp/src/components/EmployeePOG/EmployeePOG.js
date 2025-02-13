import React, { createRef, PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
import moment from 'moment';
import { actionCreatorsEmployeePOG } from '../../store/EmployeePOGController';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import YearDropDownList from '../Controls/YearDropDownList';
import { Dropdown } from 'primereact/dropdown';

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

const lstWeek = [
    { value: 1, name: "W1" },
    { value: 2, name: 'W2' },
    { value: 3, name: 'W3' },
    { value: 4, name: 'W4' },
    { value: 5, name: 'W5' },
    { value: 6, name: 'W6' },
]

class EmployeePOGForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groupId: null,
            permission: {},
            datas: [],
            loading: false,
            insertDialog: false,
            updateDialog: false,
            inputValues: {},
            status: true,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            displayConfirmDialog: false,
            year: new Date().getFullYear(),
        }
        this.fileUpload = React.createRef()
        this.pageId = 3071
        this.handleChange = this.handleChange.bind(this);
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
    // handle change
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    handleChangeForm = (value, stateName, subStateName = null) => {
        if (subStateName === null) {
            this.setState({ [stateName]: value });
        } else {
            this.setState({
                [stateName]: { ...this.state[stateName], [subStateName]: value, }
            });
        }
    }
    onChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
    }
    handleChangeDropDown = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            }
        })
    }
    getFilter = async () => {
        const state = await this.state

        let EmployeeId = '';
        if (state.employeeId) {
            state.employeeId.forEach(item => {
                EmployeeId += ',' + item;
            });
        }

        const data = await {
            employeeId: EmployeeId ? EmployeeId : null,
            week: state.week || null,
            month: state.month || null,
            year: state.year || null,
            supId: state.supId || null,
            position: state.positionId || null
        }
        return data
    }

    // search
    handleSearch = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true, datas: [], selectedRowData: [] })
        await this.props.EmployeePOGController.POG_Filter(data)
        const result = await this.props.pog_Filter
        console.log("result",result)
        if (result && result.status === 200) {
            await this.setState({ datas: result.data })
            await this.Alert('Tìm kiếm thành công', 'info')
        } else { await this.Alert('Không có dữ liệu', 'info') }
        await this.setState({ loading: false })
    }

    actionButtons = (rowData, event) => {
        return (
            <div>
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />}
            </div>
        )
    }

    //Delete
    handleDeleteDialog = (boolean, stateName, rowData) => {
        if (this.state.selectedRowData && this.state.selectedRowData.length > 0) {
            if (boolean) {
                this.setState({
                    [stateName]: true,
                })
            } else {
                this.setState({
                    [stateName]: false,
                })
            }
        } else {
            this.toast.show({ severity: 'warn', summary: 'Thông báo', detail: 'Chưa chọn dữ liệu để Delete', life: 5000 });
        }
    }

    renderFooterAction = (actionName, cancel, proceed) => {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }

    handleDelete = async () => {
        await this.setState({ isLoading: true })
        let dataDelete = await this.state.selectedRowData

        let listId = ""
        if (dataDelete && dataDelete.length > 0) {
            await dataDelete.forEach(e => {
                listId = listId + e.id + ","
            })
        }
        await this.props.EmployeePOGController.POG_Delete(listId)
        const response = await this.props.pog_Delete
        await this.handleDeleteDialog(false, "displayConfirmDialog")
        if (response.status === 200) {
            await this.Alert(response.message, "info")
            let datas = this.state.datas
            if (dataDelete && dataDelete.length > 0) {
                await dataDelete.forEach(p => {
                    let index = datas.findIndex(e => e.id === p.id)
                    if (index > -1) {
                        datas.splice(index, 1)
                    }
                })
            }
            await this.setState({ datas: datas, selectedRowData: [] })
        } else {
            await this.Alert(response.message, 'error')
        }
        await this.setState({ isLoading: false })
    }

    /// export
    handleExport = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true })
        await this.props.EmployeePOGController.POG_Export(data)
        const result = this.props.pog_Export
        if (result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.EmployeePOGController.POG_Template()
        const result = await this.props.pog_Template
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.EmployeePOGController.POG_Import(event.files[0])
        const result = this.props.pog_Import
        if (result && result.status === 200)
            await this.Alert(result.message, 'info')
        else
            await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
        await this.fileUpload.current.clear()
    }
    highlightParentRow = async (rowIndex) => {
        try {
            const seconds = await 3000, outstanding = await "highlightText"
            let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0]
            if (rowUpdated && !rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                rowUpdated.children[rowIndex].classList.add(outstanding)
                setTimeout(() => {
                    if (rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                        rowUpdated.children[rowIndex].classList.remove(outstanding)
                    }
                }, seconds)
            }
        } catch (e) { }
    }
    showSup = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.supCode}</strong></div>
                <p>{rowData.supName}</p>
            </div>
        )
    }
    showEmployee = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.employeeCode}</strong></div>
                <p>{rowData.employeeName} ({rowData.position})</p>
            </div>
        )
    }
    showAccount = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.accountCode}</strong></div>
                <p>{rowData.accountName}</p>
            </div>
        )
    }

    render() {
        let dialogConfirm = null;
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {/* {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />} */}
                {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic"
                    customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }}
                    onClear={this.clear} uploadHandler={this.handleImport}
                />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />}
            </React.Fragment>
        );
        if (this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{ width: '350px' }}
                footer={this.renderFooterAction("Delete", () => this.handleDeleteDialog(false, "displayConfirmDialog"), this.handleDelete)}
                onHide={() => this.handleDeleteDialog(false, "displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>{this.props.language["are_you_sure_to_delete_these_row"] || "l_are_you_sure_to_delete_these_row"}?</span>
                </div>
            </Dialog>
        }
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={"l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["year"] || "l_year"}</label>
                                    <YearDropDownList
                                        id="year"
                                        onChange={this.handleChange}
                                        value={this.state.year} />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["month"] || "l_month"}</label>
                                    <Dropdown
                                        className="w-100"
                                        id="month"
                                        key={lstMonth.value}
                                        value={this.state.month || null}
                                        options={lstMonth}
                                        placeholder="Chọn tháng" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e) => { this.handleChange("month", e.target.value) }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["week"] || "l_week"}</label>
                                    <Dropdown
                                        className="w-100"
                                        id="week"
                                        key={lstWeek.value}
                                        value={this.state.week || null}
                                        options={lstWeek}
                                        placeholder="Chọn tuần" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e) => { this.handleChange("week", e.target.value) }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["position"] || "l_position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="positionId"
                                        type="PG-PGAL-GS-Leader"
                                        value={this.state.positionId}
                                        onChange={this.handleChange}
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
                                        value={this.state.supId}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["employee"] || "l_employee"}</label>
                                    <EmployeeDropDownList
                                        type=""
                                        typeId={!this.state.positionId ? 0 : this.state.positionId}
                                        parentId={!this.state.supId ? 0 : this.state.supId}
                                        id="employeeId"
                                        onChange={this.handleChange}
                                        value={this.state.employeeId} />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <DataTable
                        dataKey="rowNum"
                        selection={this.state.selectedRowData}
                        onSelectionChange={e => this.setState({ selectedRowData: e.value })}
                        responsive filterDisplay="row"
                        ref={(el) => { this.dt = el; }}
                        paginatorPosition={"both"}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        value={this.state.datas} paginator={true} rows={50}
                        rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                        <Column filter header='No.' field="rowNum" style={{ width: '3%', textAlign: 'center' }} />
                        <Column body={this.showSup} filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["sup"] || "l_sup"} />
                        <Column body={this.showEmployee} filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["employee"] || "l_employee"} />
                        <Column field="year" filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["year"] || "l_year"} />
                        <Column field="month" filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["month"] || "l_month"}/>
                        <Column field="week" filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["week"] || "l_week"}/>
                        <Column field="pass" filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["pass"] || "l_pass"}/>
                        <Column field="fail" filter={true} style={{ textAlign: 'center', width: '5%' }} header={this.props.language["fail"] || "l_fail"}/>
                        <Column selectionMode="multiple" headerStyle={{ width: '3%', textAlign: 'center' }} style={{ textAlign: 'center' }}
                            header={this.state.permission && this.state.permission.create && (
                                <span className="p-buttonset">
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                                        onClick={() => this.handleDeleteDialog(true, "displayConfirmDialog")} />
                                </span>
                            )}
                        />
                    </DataTable>
                    {dialogConfirm}
                </Card>
            ) : (this.state.permission.view !== undefined && <Page403 />)

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,

        pog_Filter: state.employeePOG.pog_Filter,
        pog_Save: state.employeePOG.pog_Save,
        pog_Delete: state.employeePOG.pog_Delete,
        pog_Export: state.employeePOG.pog_Export,
        pog_Template: state.employeePOG.pog_Template,
        pog_Import: state.employeePOG.pog_Import
    }
}
function mapDispatchToProps(dispatch) {
    return {
        EmployeePOGController: bindActionCreators(actionCreatorsEmployeePOG, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeePOGForm);
