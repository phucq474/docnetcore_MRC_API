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
import { Toast } from 'primereact/toast';
import { CustomerCreateAction } from '../../store/CustomerController';
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';
import { Dialog } from 'primereact/dialog';
import YearDropDownList from '../Controls/YearDropDownList';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import { actionCreatorsSellIn } from '../../store/SellInController';
import { InputText } from 'primereact/inputtext';
import SellInByEmployeeDialog from './SellInByEmployee-Dialog';
import { AccountDropDownList } from '../Controls/AccountDropDownList';
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

class SellInByEmployee extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            permission: {},
            datas: [],
            loading: false,
            insertDialog: false,
            updateDialog: false,
            inputValues: {},
            displayConfirmDialog: false,
            month: null,
            year: new Date().getFullYear(),
            positionId: null,
            supId: null,
            employeeId: null,
            divisionId: null,
            shopCode: null,
            accId: null

        }
        this.fileUpload = React.createRef()
        this.pageId = 3068
        this.handleChange = this.handleChange.bind(this);
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
        await this.props.SellInController.SellInByEmployee_GetListDivision(this.state.accId)
        await this.props.SellInController.SellInByEmployee_GetListShop(this.state.accId)
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    // handle change
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
        if (id === 'accId') {
            this.props.SellInController.SellInByEmployee_GetListDivision(value)
            this.props.SellInController.SellInByEmployee_GetListShop(value)
        }
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
        if (id === "account_Id") {
            this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    account_Id: value ? value : null,
                    accountCode: value ? value.code : null,
                    accountName: value ? (value.name || value) : null
                }
            })
        } else {
            this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    [id]: value === null ? "" : value
                }
            })
        }
    }
    getFilter = async () => {
        const state = await this.state
        let employeeId = ''
        if (state.employeeId && state.employeeId.length > 0) {
            state.employeeId.forEach(e => {
                employeeId += e + ",";
            })
        }
        const data = await {
            month: state.month ? state.month : null,
            year: state.year ? state.year : null,
            employeeId: (employeeId && employeeId !== '') ? employeeId : null,
            positionId: state.positionId || null,
            supId: state.supId || null,
            shopCode: state.shopCode || null,
            divisionId: state.divisionId || null,
            accId: this.state.accId
        }
        return data
    }

    // search
    handleSearch = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true, datas: [] })
        await this.props.SellInController.SellInByEmployee_Filter(data, this.state.accId)
        const result = this.props.sellInByEmployee_Filter
        if (result.status === 200) {
            await this.setState({ datas: result.data })
            await this.Alert('Tìm kiếm thành công', 'info')
        } else await this.Alert('Không có dữ liệu', 'info')
        await this.setState({ loading: false })
    }

    actionButtons = (rowData, event) => {
        return (
            <div>
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleDeleteDialog(true, "displayConfirmDialog", rowData)} />}
            </div>
        )
    }

    //Delete
    handleDeleteDialog = (boolean, stateName, rowData) => {
        if (boolean) {
            this.setState({
                displayConfirmDialog: true,
                rowData: rowData,
                idDelete: rowData.id
            })
        } else {
            this.setState({
                displayConfirmDialog: false,
                rowData: null,
                idDelete: null
            })
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
        const id = this.state.idDelete
        await this.props.SellInController.SellInByEmployee_Delete(id, this.state.accId)
        const response = await this.props.sellInByEmployee_Delete
        await this.handleDeleteDialog(false, "displayConfirmDialog")
        if (response.status === 200) {
            await this.Alert(response.message, "info")
            let datas = this.state.datas
            let index = datas.findIndex(e => e.id === id)
            if (index >= 0) {
                datas.splice(index, 1)
            }
            await this.setState({ datas: datas })
        } else {
            await this.Alert(response.message, 'error')
        }
        await this.setState({ isLoading: false })
    }

    /// Insert
    handleInsertDialog = (boolean) => {
        if (boolean) {
            this.setState({
                insertDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    year: new Date().getFullYear()
                }
            })
        } else {
            this.setState({ insertDialog: false, inputValues: {} })
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
        if (!this.state.inputValues.month) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorMonth: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorMonth: "" } })

        if (!this.state.inputValues.year) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorYear: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorYear: "" } })

        if (!this.state.inputValues.employeeId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "" } })

        if (!this.state.inputValues.employeeId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "" } })

        // if (!this.state.inputValues.shopId) {
        //     await this.setState({ inputValues: { ...this.state.inputValues, errorShop: "Input Required!" } })
        //     check = false
        // } else this.setState({ inputValues: { ...this.state.inputValues, errorShop: "" } })

        if (!this.state.inputValues.divisionId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDivisionId: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorDivisionId: "" } })

        if (!this.state.inputValues.upToDate) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorUpToDate: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorUpToDate: "" } })

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        await this.handleValid().then(async (valid) => {
            if (valid) {
                const inputValues = this.state.inputValues

                // let employeeId = ''
                // if(inputValues.employeeId && inputValues.employeeId.length > 0){
                //     inputValues.employeeId.forEach(e=>{
                //         employeeId += e +","
                //     })
                // }

                const data = {
                    month: inputValues.month || null,
                    year: inputValues.year || null,
                    // employeeId: (employeeId && employeeId !== '') ? employeeId : null,
                    employeeId: inputValues.employeeId || null,
                    shopId: inputValues.shopId || null,
                    divisionId: inputValues.divisionId || null,
                    target: inputValues.target || null,
                    actual: inputValues.actual || null,
                    note: inputValues.note || null,
                    upToDate: moment(inputValues.upToDate).format("YYYY-MM-DD") || null
                }
                await this.props.SellInController.SellInByEmployee_Insert(data, this.state.accId)
                let response = await this.props.sellInByEmployee_Insert
                if (response.status === 200) {
                    let datas = this.state.datas
                    datas.unshift(response.data[0])
                    await this.setState({ datas: datas, insertDialog: false, inputValues: {} })
                    await this.highlightParentRow(0)
                    await this.Alert(response.message, "info")
                } else {
                    await this.Alert(response.message, "error")
                    await this.setState({ insertDialog: false, inputValues: {} })
                }
            }
        })
        await this.setState({ isLoading: false })
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
                    month: rowData.month,
                    year: rowData.year,
                    employeeId: rowData.employeeId,
                    shopId: rowData.shopId || null,
                    divisionId: rowData.divisionId,
                    target: rowData.target,
                    actual: rowData.actual,
                    note: rowData.note,
                    upToDate: rowData.upToDate ? new Date(rowData.upToDate) : null,
                    supId: rowData.supId,
                    positionId: rowData.positionId
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
                    month: inputValues.month || null,
                    year: inputValues.year || null,
                    // employeeId: (employeeId && employeeId !== '') ? employeeId : null,
                    employeeId: inputValues.employeeId || null,
                    shopId: inputValues.shopId || null,
                    divisionId: inputValues.divisionId || null,
                    target: inputValues.target || null,
                    actual: inputValues.actual || null,
                    note: inputValues.note || null,
                    upToDate: moment(inputValues.upToDate).format("YYYY-MM-DD") || null,
                    id: inputValues.id
                }
                await this.props.SellInController.SellInByEmployee_Update(data, this.state.accId)
                let response = await this.props.sellInByEmployee_Update

                if (response.status === 200) {
                    await this.highlightParentRow(inputValues.index)

                    let datas = this.state.datas
                    datas[inputValues.index] = response.data[0]

                    await this.setState({
                        datas: datas,
                        inputValues: {},
                        updateDialog: false,
                    })
                    await this.Alert(response.message, "info")
                } else {
                    await this.Alert(response.message, "error")
                    await this.setState({
                        inputValues: {},
                        updateDialog: false,
                    })
                }
            }
        })
        await this.setState({ isLoading: false })
    }
    /// export
    handleExport = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true })
        await this.props.SellInController.SellInByEmployee_Export(data, this.state.accId)
        const result = this.props.sellInByEmployee_Export
        if (result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.SellInController.SellInByEmployee_Template(this.state.accId)
        const result = this.props.sellInByEmployee_Template
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.SellInController.SellInByEmployee_Import(event.files[0])
        const result = this.props.sellInByEmployee_Import
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
                <div><strong>{rowData.employeeCode}</strong> ({rowData.position})</div>
                <p>{rowData.employeeName}</p>
            </div>
        )
    }
    showShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.shopCode}</strong></div>
                <p>{rowData.shopName}</p>
            </div>
        )
    }
    async componentDidMount() {

    }
    render() {
        let dialogInsert = null, dialogUpdate = null, dialogConfirm = null;
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
            dialogInsert = <SellInByEmployeeDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
                handleChangeDropDown={this.handleChangeDropDown}
                listDivision={this.props.sellInByEmployee_GetListDivision}
                listShop={this.props.sellInByEmployee_GetListShop}
                accId={this.state.accId}
            />
        }
        if (this.state.updateDialog) { // * UPDATe DIALOG
            dialogUpdate = <SellInByEmployeeDialog
                stateName={"inputValues"}
                actionName={"Update"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                //dialog
                displayDialog={this.state.updateDialog}
                footerAction={this.footerUpdateDialog}
                handleActionDialog={this.handleUpdateDialog}
                handleChangeDropDown={this.handleChangeDropDown}
                listDivision={this.props.sellInByEmployee_GetListDivision}
                listShop={this.props.sellInByEmployee_GetListShop}
                accId={this.state.accId}
            />
        }
        if (this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{ width: '350px' }}
                footer={this.renderFooterAction("Delete", () => this.handleDeleteDialog(false, "displayConfirmDialog"), this.handleDelete)}
                onHide={() => this.handleDeleteDialog(false, "displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
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
                                <AccountDropDownList
                                    id="accId"
                                    className='p-field p-col-12 p-md-3'
                                    onChange={this.handleChange}
                                    filter={true}
                                    showClear={true}
                                    value={this.state.accId} />
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
                                        value={this.state.month}
                                        options={lstMonth}
                                        placeholder="Select an Option" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e) => { this.setState({ month: e.target.value }) }}
                                    />
                                </div>

                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["position"] || "l_position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="positionId"
                                        type="PG-PGAL-GS-Leader"
                                        accId={this.state.accId}
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
                                        accId={this.state.accId}
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
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.employeeId} />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["division"] || "l_division"}</label>
                                    <Dropdown
                                        className="w-100"
                                        id="divisionId"
                                        key={this.props.sellInByEmployee_GetListDivision.value}
                                        value={this.state.divisionId}
                                        options={this.props.sellInByEmployee_GetListDivision}
                                        placeholder="Select an Option" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e) => { this.setState({ divisionId: e.target.value }) }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label htmlFor="ShopCode">{this.props.language["shopcode"] || "l_shopcode"}</label>
                                    <span className="p-float-label">
                                        <InputText id="shopCode" value={this.state.shopCode} onChange={e => this.setState({ shopCode: e.target.value })} style={{ width: '100% ' }} />
                                    </span>
                                </div>

                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <DataTable
                        paginatorPosition={"both"}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        value={this.state.datas} paginator={true} rows={50}
                        rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                        <Column filter header='No.' field="stt" style={{ width: '3%', textAlign: 'center' }} />
                        <Column body={this.showSup} filter={true} style={{ textAlign: 'center', width: '10%' }} header={"l_Sup"} />
                        <Column body={this.showEmployee} filter={true} style={{ textAlign: 'center', width: '10%' }} header={"l_Employee"} />
                        <Column body={this.showShop} filter={true} style={{ textAlign: 'center', width: '10%' }} header={"l_Shop"} />
                        <Column field="division" filter header={"l_division"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="target" filter header={"l_target"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="actual" filter header={"l_actual"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="month" filter={true} style={{ textAlign: 'center', width: '3%' }} header={"l_month"} />
                        <Column field="year" filter={true} style={{ textAlign: 'center', width: '3%' }} header={"l_year"} />
                        <Column field="upToDate" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_up_to_date"} />
                        <Column body={this.actionButtons} header="#" style={{ width: '3%', textAlign: "center" }} ></Column>
                    </DataTable>
                    {dialogInsert}
                    {dialogUpdate}
                    {dialogConfirm}
                </Card>
            ) : (this.state.permission.view !== undefined && <Page403 />)

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        customerTarget_Filter: state.customer.customerTarget_Filter,
        customerTarget_Insert: state.customer.customerTarget_Insert,
        customerTarget_Update: state.customer.customerTarget_Update,
        customerTarget_Export: state.customer.customerTarget_Export,
        customerTarget_Template: state.customer.customerTarget_Template,
        customerTarget_Import: state.customer.customerTarget_Import,
        customerTarget_Delete: state.customer.customerTarget_Delete,

        sellInByEmployee_Filter: state.sellin.sellInByEmployee_Filter,
        sellInByEmployee_Insert: state.sellin.sellInByEmployee_Insert,
        sellInByEmployee_Update: state.sellin.sellInByEmployee_Update,
        sellInByEmployee_Delete: state.sellin.sellInByEmployee_Delete,
        sellInByEmployee_Export: state.sellin.sellInByEmployee_Export,
        sellInByEmployee_Template: state.sellin.sellInByEmployee_Template,
        sellInByEmployee_GetListDivision: state.sellin.sellInByEmployee_GetListDivision,
        sellInByEmployee_GetListShop: state.sellin.sellInByEmployee_GetListShop,
        sellInByEmployee_Import: state.sellin.sellInByEmployee_Import
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
        SellInController: bindActionCreators(actionCreatorsSellIn, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SellInByEmployee);
