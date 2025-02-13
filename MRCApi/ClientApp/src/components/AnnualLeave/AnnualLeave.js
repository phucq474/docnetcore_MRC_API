import React, { createRef, PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
import { bindActionCreators } from 'redux';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { actionCreatorsAnnualLeave } from '../../store/AnnualLeaveController';
import AnnualLeaveDialog from './AnnualLeaveDialog';
import { InputText } from "primereact/inputtext";
import { download, getLogin, HelpPermission } from '../../Utils/Helpler';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Calendar } from 'primereact/calendar';
import CalendarMaster from '../Controls/CalendarMaster';
import Page403 from '../ErrorRoute/page403';
import moment from 'moment';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';

class AnnualLeave extends PureComponent {
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
            year: new Date().getFullYear(),

        }
        this.fileUpload = React.createRef()
        this.pageId = getLogin().accountName === 'MARICO MT' ? 3159 : 3066
        this.handleChange = this.handleChange.bind(this);
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Alert = (mess, style, time) => {
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
    getFilter = () => {
        const year = this.state.year ? this.state.year : null;
        const supId = this.state.supId ? this.state.supId : null;
        const position = this.state.positionId ? this.state.positionId : null;
        let listEmployee = '';
        if (this.state.employeeId) {
            this.state.employeeId.forEach(element => {
                listEmployee += element + ',';
            });
        }
        const employeeId = listEmployee.length > 3 ? listEmployee : null;
        const filter = {
            year,
            supId,
            employeeId,
            position
        };
        return filter;
    }
    // search
    handleSearch = async () => {
        const state = this.state
        const data = this.getFilter();
        await this.setState({ loading: true })
        await this.props.AnnualLeaveController.FilterAnnualLeave(data)
        const result = this.props.filterAnnualLeave
        if (result) {
            await this.setState({ datas: result })
            await this.Alert('Tìm kiếm thành công', 'info')
        } else await this.Alert('Không có dữ liệu', 'error')

        await this.setState({ loading: false, })
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
    /// Insert
    handleInsertDialog = (boolean) => {
        if (boolean) {
            this.setState({ insertDialog: true })
        } else {
            this.setState({ insertDialog: false })
        }
    }
    footerInsertDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.create &&
                    <div>
                        <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleInsertDialog(false)} />
                        <Button label={this.props.language["insert"] || "l_insert"} className="p-button-info" onClick={() => this.handleInsert()} />
                    </div>}
            </div>
        )
    }
    handleValid = async () => {
        let check = true;
        const inputValues = this.state.inputValues
        if (!inputValues.dates) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })

        if (!inputValues.al) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorAl: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorAl: "" } })

        if (!inputValues.employeeId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "" } })

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        await this.handleValid().then(async (valid) => {
            if (valid) {
                await this.setState({ isLoading: true })
                const inputValues = this.state.inputValues
                const data = {
                    year: inputValues.dates.getFullYear(),
                    month: inputValues.dates.getMonth() + 1,
                    al: inputValues.al,
                    alMonth: inputValues.al_month,
                    nb: inputValues.nb,
                    nbMonth: inputValues.nb_month,
                    employeeId: inputValues.employeeId
                }
                await this.props.AnnualLeaveController.InsertAnnualLeave(data)
                let response = await this.props.insertAnnualLeave
                if (response && response.status === 200) {
                    await this.setState({ insertDialog: false, })
                    await this.Alert("Thêm thành công", "info")
                } else
                    await this.Alert("Thêm thất bại", "error")
                await this.setState({ isLoading: false, inputValues: {} })
            }
        })
    }
    /// Update
    footerUpdateDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.edit &&
                    <div>
                        <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleUpdateDialog(false)} />
                        <Button label={this.props.language["update"] || "l_update"} className="p-button-info" onClick={() => this.handleUpdate()} />
                    </div>}
            </div>
        )
    }
    handleUpdateDialog = async (boolean, rowData, index) => {
        if (boolean) {
            await this.setState({
                updateDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    index: index,
                    id: rowData.id,
                    supplierCode: rowData.supplierCode,
                    supplierName: rowData.supplierName,
                    fullName: rowData.fullName,
                    phone: rowData.phone,
                    address: rowData.address,
                    contact: rowData.contact,
                    orderBy: rowData.orderBy,
                    fax: rowData.fax,
                    status: rowData.status,
                }
            })
        } else {
            this.setState({ updateDialog: false, inputValues: {} })
        }
    }
    handleUpdate = async () => {
        await this.setState({ isLoading: true })
        await this.handleValid().then(async (valid) => {
            if (valid) {
                const inputValues = this.state.inputValues
                const data = {
                    supplierCode: inputValues.supplierCode,
                    supplierName: inputValues.supplierName,
                    contact: inputValues.contact || null,
                    address: inputValues.address || null,
                    phone: inputValues.phone || null,
                    fax: inputValues.fax || null,
                    fullName: inputValues.fullName || null,
                    orderBy: inputValues.orderBy || null,
                    status: inputValues.status ? 1 : 0,
                    id: inputValues.id
                }
                await this.props.SuppliersController.UpdateSuppliers(data, inputValues.index)
                let response = await this.props.updateSuppliers
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({
                        datas: this.props.filterSuppliers,
                        inputValues: {},
                        updateDialog: false,
                    })
                    await this.highlightParentRow(inputValues.index)
                    await this.Alert("Cập nhập thành công", "info")
                } else {
                    await this.Alert("Cập nhập thất bại", "error")
                }
            }
        })
        await this.setState({ isLoading: false })
    }
    /// export
    handleExport = async () => {
        const state = this.state
        const data = await this.getFilter()
        await this.setState({ loading: true })
        await this.props.AnnualLeaveController.ExportAnnualLeave(data)
        const result = this.props.exportAnnualLeave
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        const state = this.state
        const data = await this.getFilter()
        await this.props.AnnualLeaveController.TemplateAnnualLeave(data)
        const result = this.props.templateAnnualLeave
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.AnnualLeaveController.ImportAnnualLeave(event.files[0])
        const result = this.props.importAnnualLeave
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
    showEmployee = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.employeeCode}</strong></div>
                <p>{rowData.employeeName}</p>
            </div>
        )
    }
    showLeader = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.leaderCode}</strong></div>
                <p>{rowData.leaderName}</p>
            </div>
        )
    }
    componentDidMount() {
    }

    templatePrice = (options, colName) => {
        return (
            <div>
                <InputNumber value={options.rowData[`${colName}`]}
                    id={colName}
                    onValueChange={(e) => this.handleChangePrice(options.rowData, e.target.value, options.rowIndex, colName)} mode="decimal" minFractionDigits={2} />
            </div>
        )
    }
    //edit enter row
    handleChangePrice = (rowData, value, index, colName) => {
        let data = this.state.datas

        if (rowData.type === 1) {
            data.table[index][`${colName}`] = value;
        } else if (rowData.type === 2) {
            data.table1[index][`${colName}`] = value;
        } else if (rowData.type === 3) {
            data.table2[index][`${colName}`] = value;
        } else if (rowData.type === 4) {
            data.table3[index][`${colName}`] = value;
        }
        this.setState({
            datas: data
        })
    }
    actionButtons = (rowData, event) => {
        return (
            <div>
                {this.state.permission.edit &&
                    <Button icon="pi pi-save" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleUpdateRowDialog(true, rowData, event.rowIndex)} />}
            </div>
        )
    }
    handleUpdateRowDialog = async (boolean, rowData, index) => {
        if (boolean) {
            await this.setState({
                updateDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    index: index,
                    id: rowData.id,
                    rowData: rowData
                }
            })
        } else {
            this.setState({ updateDialog: false, inputValues: {} })
        }
    }
    footerUpdateRowDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.edit &&
                    <div>
                        <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleUpdateRowDialog(false)} />
                        <Button label={this.props.language["update"] || "l_update"} className="p-button-info" onClick={() => this.handleUpdate()} />
                    </div>}
            </div>
        )
    }
    handleUpdate = async () => {
        await this.setState({ loading: true })

        let rowData = this.state.inputValues.rowData

        let valCol = null
        if (rowData.type === 1) {
            valCol = 'AL'
        } else if (rowData.type === 2) {
            valCol = 'MonthAL'
        } else if (rowData.type === 3) {
            valCol = 'NB'
        } else if (rowData.type === 4) {
            valCol = 'MonthNB'
        }

        for (let i = 1; i <= 12; i++) {
            let colName = null
            if (i <= 9) colName = "0" + i
            else colName = i

            let data = {
                employeeId: rowData.employeeId,
                month: i,
                value: rowData[`${colName}`] ? rowData[`${colName}`] : null,
                year: this.state.year,
                type: valCol
            }
            await this.props.AnnualLeaveController.UpdateAnnualLeave(data)
        }
        await this.Alert('Lưu thành công', 'info')
        await this.handleUpdateRowDialog(false)
        await this.setState({ loading: false, inputValues: {} })
    }
    render() {
        let dialogInsert = null, dialogUpdate = null;
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />}
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
        if (this.state.insertDialog) { // * INSERT DIALOG
            dialogInsert = <AnnualLeaveDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleChangeDropDown={this.handleChangeDropDown}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
            />
        }
        // if (this.state.updateDialog) { // * UPDATe DIALOG
        //     dialogUpdate = <AnnualLeaveDialog
        //         stateName={"inputValues"}
        //         actionName={"Update"}
        //         inputValues={this.state.inputValues}
        //         handleChangeForm={this.handleChangeForm}
        //         handleChange={this.handleChange}
        //         //dialog
        //         displayDialog={this.state.updateDialog}
        //         footerAction={this.footerUpdateDialog}
        //         handleActionDialog={this.handleUpdateDialog}
        //     />
        // }
        if (this.state.updateDialog) {
            dialogUpdate = <Dialog header="Update" style={{ width: '30vw' }}
                visible={this.state.updateDialog}
                footer={this.footerUpdateRowDialog()}
                onHide={() => this.handleUpdateRowDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>bạn có muốn thay đổi?</span>
                </div>
            </Dialog>
        }
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="No." style={{ width: 50 }} />
                <Column header={this.props.language["position"] || "l_position"} />
                <Column header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                <Column header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                <Column header='Tháng' style={{ textAlign: 'center' }} colSpan={12} />
            </Row>
            <Row>
                <Column filter field="rowNum" style={{ width: 50 }} />
                <Column filter field="position" style={{ width: 80, textAlign: 'center' }} />
                <Column filter body={this.showLeader} style={{ width: "120px", textAlign: 'center' }} />
                <Column filter body={this.showEmployee} style={{ width: "120px", textAlign: 'center' }} />
                <Column field="01" style={{ width: 70, textAlign: 'center' }} header="01" />
                <Column field="02" style={{ width: 70, textAlign: 'center' }} header="02" />
                <Column field="03" style={{ width: 70, textAlign: 'center' }} header="03" />
                <Column field="04" style={{ width: 70, textAlign: 'center' }} header="04" />
                <Column field="05" style={{ width: 70, textAlign: 'center' }} header="05" />
                <Column field="06" style={{ width: 70, textAlign: 'center' }} header="06" />
                <Column field="07" style={{ width: 70, textAlign: 'center' }} header="07" />
                <Column field="08" style={{ width: 70, textAlign: 'center' }} header="08" />
                <Column field="09" style={{ width: 70, textAlign: 'center' }} header="09" />
                <Column field="10" style={{ width: 70, textAlign: 'center' }} header="10" />
                <Column field="11" style={{ width: 70, textAlign: 'center' }} header="11" />
                <Column field="12" style={{ width: 70, textAlign: 'center' }} header="12" />
            </Row>
        </ColumnGroup>;
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                {/* <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.handleChange(e.target.id, e.value)}
                                        view="year" dateFormat="yy" yearNavigator
                                        yearRange="2010:2030"
                                        id="dates"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    /> */}
                                <CalendarMaster
                                    key="calendar"
                                    id="year"
                                    year={this.state.year ? this.state.year : 0}
                                    useYear={true}
                                    useMonth={false}
                                    useWeek={false}
                                    onChange={this.handleChange}
                                />
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
                                        value={this.state.employeeId} 
                                        mode={"multi"}/>
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    {/* <DataTable
                        headerColumnGroup={headerGroup}
                        paginatorPosition={"both"}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        value={this.state.datas} paginator={true} rows={50}
                        rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                        <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                        <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: 80, textAlign: 'center' }} />
                        <Column filter body={this.showLeader} header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                        <Column filter body={this.showEmployee} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                        <Column field="01" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="02" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="03" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="04" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="05" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="06" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="07" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="08" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="09" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="10" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="11" filter={true} style={{ width: 70, textAlign: 'center' }} />
                        <Column field="12" filter={true} style={{ width: 70, textAlign: 'center' }} />
                         <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column> 
                    </DataTable> */}
                    <TabView>
                        <TabPanel header="AL">
                            <DataTable
                                headerColumnGroup={headerGroup}
                                paginatorPosition={"both"}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                value={this.state.datas.table} paginator={true} rows={50}
                                rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }}
                                editMode="cell" className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
                                <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                                <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: 80, textAlign: 'center' }} />
                                <Column filter body={this.showLeader} header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column filter body={this.showEmployee} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column field="01" editor={(options) => this.templatePrice(options, "01")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="02" editor={(options) => this.templatePrice(options, "02")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="03" editor={(options) => this.templatePrice(options, "03")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="04" editor={(options) => this.templatePrice(options, "04")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="05" editor={(options) => this.templatePrice(options, "05")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="06" editor={(options) => this.templatePrice(options, "06")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="07" editor={(options) => this.templatePrice(options, "07")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="08" editor={(options) => this.templatePrice(options, "08")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="09" editor={(options) => this.templatePrice(options, "09")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="10" editor={(options) => this.templatePrice(options, "10")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="11" editor={(options) => this.templatePrice(options, "11")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="12" editor={(options) => this.templatePrice(options, "12")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column>
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="AL MONTH">
                            <DataTable
                                headerColumnGroup={headerGroup}
                                paginatorPosition={"both"}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                value={this.state.datas.table1} paginator={true} rows={50}
                                rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                                <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                                <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: 80, textAlign: 'center' }} />
                                <Column filter body={this.showLeader} header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column filter body={this.showEmployee} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column field="01" editor={(options) => this.templatePrice(options, "01")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="02" editor={(options) => this.templatePrice(options, "02")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="03" editor={(options) => this.templatePrice(options, "03")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="04" editor={(options) => this.templatePrice(options, "04")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="05" editor={(options) => this.templatePrice(options, "05")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="06" editor={(options) => this.templatePrice(options, "06")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="07" editor={(options) => this.templatePrice(options, "07")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="08" editor={(options) => this.templatePrice(options, "08")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="09" editor={(options) => this.templatePrice(options, "09")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="10" editor={(options) => this.templatePrice(options, "10")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="11" editor={(options) => this.templatePrice(options, "11")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="12" editor={(options) => this.templatePrice(options, "12")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column>
                            </DataTable>
                        </TabPanel>
                        <TabPanel header={getLogin().accountName === "Fonterra" ? "CL" : "NB"}>
                            <DataTable
                                headerColumnGroup={headerGroup}
                                paginatorPosition={"both"}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                value={this.state.datas.table2} paginator={true} rows={50}
                                rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                                <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                                <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: 80, textAlign: 'center' }} />
                                <Column filter body={this.showLeader} header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column filter body={this.showEmployee} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column field="01" editor={(options) => this.templatePrice(options, "01")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="02" editor={(options) => this.templatePrice(options, "02")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="03" editor={(options) => this.templatePrice(options, "03")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="04" editor={(options) => this.templatePrice(options, "04")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="05" editor={(options) => this.templatePrice(options, "05")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="06" editor={(options) => this.templatePrice(options, "06")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="07" editor={(options) => this.templatePrice(options, "07")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="08" editor={(options) => this.templatePrice(options, "08")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="09" editor={(options) => this.templatePrice(options, "09")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="10" editor={(options) => this.templatePrice(options, "10")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="11" editor={(options) => this.templatePrice(options, "11")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="12" editor={(options) => this.templatePrice(options, "12")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column>
                            </DataTable>
                        </TabPanel>
                        <TabPanel header={getLogin().accountName === "Fonterra" ? "CL MONTH" : "NB MONTH"}>
                            <DataTable
                                headerColumnGroup={headerGroup}
                                paginatorPosition={"both"}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                value={this.state.datas.table3} paginator={true} rows={50}
                                rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                                <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                                <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: 80, textAlign: 'center' }} />
                                <Column filter body={this.showLeader} header={this.props.language["leader_name"] || "l_leader_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column filter body={this.showEmployee} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "120px", textAlign: 'center' }} />
                                <Column field="01" editor={(options) => this.templatePrice(options, "01")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="02" editor={(options) => this.templatePrice(options, "02")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="03" editor={(options) => this.templatePrice(options, "03")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="04" editor={(options) => this.templatePrice(options, "04")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="05" editor={(options) => this.templatePrice(options, "05")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="06" editor={(options) => this.templatePrice(options, "06")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="07" editor={(options) => this.templatePrice(options, "07")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="08" editor={(options) => this.templatePrice(options, "08")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="09" editor={(options) => this.templatePrice(options, "09")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="10" editor={(options) => this.templatePrice(options, "10")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="11" editor={(options) => this.templatePrice(options, "11")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="12" editor={(options) => this.templatePrice(options, "12")} filter={true} style={{ width: 70, textAlign: 'center' }} />
                                <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                    {dialogInsert}
                    {dialogUpdate}
                </Card>
            ) : (this.state.permission.view !== undefined && <Page403 />)

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterAnnualLeave: state.annualleave.filterAnnualLeave,
        exportAnnualLeave: state.annualleave.exportAnnualLeave,
        importAnnualLeave: state.annualleave.importAnnualLeave,
        templateAnnualLeave: state.annualleave.templateAnnualLeave,
        insertAnnualLeave: state.annualleave.insertAnnualLeave,
        updateAnnualLeave: state.annualleave.updateAnnualLeave
    }
}
function mapDispatchToProps(dispatch) {
    return {
        AnnualLeaveController: bindActionCreators(actionCreatorsAnnualLeave, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AnnualLeave);
