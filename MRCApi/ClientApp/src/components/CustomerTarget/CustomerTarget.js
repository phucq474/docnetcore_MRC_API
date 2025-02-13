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
import CustomerTargetDialog from './CustomerTargetDialog';
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import { Calendar } from 'primereact/calendar';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';
import { Dialog } from 'primereact/dialog';

const lstReport = [
    { value: 'Total SKU', name: 'Total SKU' },
    { value: 'MCL', name: 'MCL' },
    { value: 'OOS', name: 'OOS' },
    { value: 'CHILLED', name: 'CHILLED' },
    { value: 'CGs', name: 'CGs' },
    { value: 'Target KAS', name: 'Target KAS' }
]

class CustomerTarget extends PureComponent {
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
            displayConfirmDialog: false
        }
        this.fileUpload = React.createRef()
        this.pageId = 3067
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
        if(id==="account_Id"){
            this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    account_Id: value ? value : null,
                    accountCode: value ?  value.code : null,
                    accountName: value ? (value.name || value) : null
                }
            })
        }else{
            this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    [id]: value === null ? "" : value
                }
            })
        }
    }
    getFilter = async () =>{
        const state = await this.state
        const data = await {
            fromDate: state.dates ? parseInt(moment(state.dates[0]).format("YYYYMMDD")) : null,
            toDate: state.dates.length > 1 ?  parseInt(moment(state.dates[1]).format("YYYYMMDD")) : null,
            customerId: state.customerId || null,
            positionId: state.positionId || null,
            report: state.report || null
        }
        return data
    }

    // search
    handleSearch = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true , datas: []})
        await this.props.CustomerController.CustomerTarget_Filter(data)
        const result = this.props.customerTarget_Filter
        if (result.status === 200) {
            await this.setState({datas: result.data})
            await this.Alert('Tìm kiếm thành công', 'info')
        } else await this.Alert('Không có dữ liệu', 'info')
        await this.setState({ loading: false})
    }

    actionButtons = (rowData, event) => {
        return (
            <div>
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleDeleteDialog(true,"displayConfirmDialog",rowData)} />}
            </div>
        )
    }

    //Delete
    handleDeleteDialog = (boolean, stateName, rowData) =>{
        if(boolean){
            this.setState({
                displayConfirmDialog: true,
                rowData: rowData,
                idDelete: rowData.id
            })
        }else{
            this.setState({
                displayConfirmDialog: false,
                rowData: null,
                idDelete: null
            })
        }
    }

    renderFooterAction = (actionName,cancel,proceed) =>{
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }

    handleDelete = async () => {
        await this.setState({isLoading: true})
        const id = this.state.idDelete
        await this.props.CustomerController.CustomerTarget_Delete(id)
        const response = await this.props.customerTarget_Delete
        await this.handleDeleteDialog(false,"displayConfirmDialog")
        if(response.status === 200) {
            await this.Alert(response.message, "info")
            let datas = this.state.datas
            let index = datas.findIndex(e=> e.id === id)
            if(index>=0){
                datas.splice(index,1)
            }
            await this.setState({datas: datas})
        } else {
            await this.Alert(response.message,'error')
        }
        await this.setState({isLoading: false})
    }

    /// Insert
    handleInsertDialog = (boolean) => {
        if (boolean) {
            this.setState({ 
                insertDialog: true ,
                inputValues:{
                    ...this.state.inputValues,
                    dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()]
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
        if (!this.state.inputValues.dates) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })

        if (!this.state.inputValues.customerId && !this.state.inputValues.report && this.state.inputValues.percent) {

        } 
        if(!this.state.inputValues.customerId && !this.state.inputValues.report && !this.state.inputValues.percent){
            if(!this.state.inputValues.percent){
                await this.setState({ inputValues: { ...this.state.inputValues, errorPercent: "Input Required!", errorReport: "", errorCustomerId: "" } })
                check = false
            } else this.setState({ inputValues: { ...this.state.inputValues, errorPercent: "" } })
        } 
        if(this.state.inputValues.customerId && !this.state.inputValues.report && !this.state.inputValues.percent){
            if(!this.state.inputValues.report){
                await this.setState({ inputValues: { ...this.state.inputValues, errorReport: "Input Required!", errorPercent: "" } })
                check = false
            } else this.setState({ inputValues: { ...this.state.inputValues, errorReport: "" } })
        }
        if(!this.state.inputValues.customerId && this.state.inputValues.report && !this.state.inputValues.percent){
            // if (!this.state.inputValues.customerId) {
            //     await this.setState({ inputValues: { ...this.state.inputValues, errorCustomerId: "Input Required!", errorPercent: "" } })
            //     check = false
            // } else this.setState({ inputValues: { ...this.state.inputValues, errorCustomerId: "" } })
        }
        
        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        await this.handleValid().then(async (valid) => {
            if (valid) {
                const inputValues = this.state.inputValues
                const data = {
                    fromDate: inputValues.dates ? parseInt(moment(inputValues.dates[0]).format("YYYYMMDD")) : null,
                    toDate: inputValues.dates.length > 1 ? parseInt(moment(inputValues.dates[1]).format("YYYYMMDD")) : null,
                    customerId: inputValues.customerId || null,
                    positionId: inputValues.positionId || null,
                    percent: inputValues.percent || null,
                    target: inputValues.target || null,
                    report: inputValues.report || null
                }
                await this.props.CustomerController.CustomerTarget_Insert(data)
                let response = await this.props.customerTarget_Insert
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
                    dates: [new Date(rowData.fromDate), rowData.toDate ? new Date(rowData.toDate) : null],
                    customerId: rowData.customerId,
                    positionId: rowData.positionId,
                    report: rowData.report,
                    percent: rowData.percent,
                    target: rowData.target,
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
                    fromDate: inputValues.dates ? parseInt(moment(inputValues.dates[0]).format("YYYYMMDD")) : null,
                    toDate: inputValues.dates.length > 1 ? parseInt(moment(inputValues.dates[1]).format("YYYYMMDD")) : null,
                    customerId: inputValues.customerId || null,
                    positionId: inputValues.positionId || null,
                    percent: inputValues.percent || null,
                    target: inputValues.target || null,
                    report: inputValues.report || null,
                    id: inputValues.id
                }
                await this.props.CustomerController.CustomerTarget_Update(data)
                let response = await this.props.customerTarget_Update
                
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
        await this.props.CustomerController.CustomerTarget_Export(data)
        const result = this.props.customerTarget_Export
        if (result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.CustomerController.CustomerTarget_Template()
        const result = this.props.customerTarget_Template
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.CustomerController.CustomerTarget_Import(event.files[0])
        const result = this.props.customerTarget_Import
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
    showCustomer = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.customerCode}</strong></div>
                <p>{rowData.customerName}</p>
            </div>
        )
    }
    showParent = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.parentCode}</strong></div>
                <p>{rowData.parentName}</p>
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
    componentDidMount() {
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
            dialogInsert = <CustomerTargetDialog
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
            />
        }
        if (this.state.updateDialog) { // * UPDATe DIALOG
            dialogUpdate = <CustomerTargetDialog
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
            />
        }
        if(this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{width: '350px'}} 
                footer={this.renderFooterAction("Delete",() => this.handleDeleteDialog(false,"displayConfirmDialog"),this.handleDelete)} 
                onHide={() => this.handleDeleteDialog(false,"displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        }
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={ "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                    <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.setState({ dates: e.value })}
                                        dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                        id="fromDate" selectionMode="range"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{ "l_customer"}</label>
                                    <CustomerDropDownList
                                        id='customerId'
                                        mode='single'
                                        onChange={this.handleChange}
                                        value={this.state.customerId} />
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
                                    <label>{this.props.language["report"] || "l_report"}</label>
                                    <Dropdown
                                        className="w-100"
                                        id="report"
                                        key={lstReport.value}
                                        value={this.state.report}
                                        options={lstReport}
                                        placeholder="Select an Option" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e)=>{this.setState({report: e.target.value})}}
                                    />
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
                        <Column body={this.showCustomer} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_customer"} />
                        <Column body={this.showAccount} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_account"} />
                        <Column field="position" filter header={ "l_position"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="report" filter header={ "l_report"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="percent" filter header={ "l_percent(%)"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="target" filter header={ "l_target"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="fromDate" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_from_date"} />
                        <Column field="toDate" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_to_date"} />
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
        customerTarget_Delete: state.customer.customerTarget_Delete
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerTarget);
