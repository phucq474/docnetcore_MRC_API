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
import { CustomerCreateAction } from '../../store/CustomerController';
import CustomerDialog from './CustomerDialog';
import { InputText } from "primereact/inputtext";
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import ChannelDropDownList from '../Controls/ChannelDropDownList';
import CustomerAccountDropDownList from '../Controls/CustomerAccountDropDownList';
import { AccountDropDownList } from '../Controls/AccountDropDownList';

class Customers extends PureComponent {
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
            accId: null
        }
        this.fileUpload = React.createRef()
        this.pageId = 3060
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
    // search
    handleSearch = async () => {
        const state = this.state
        const data = {
            parentId: state.customerId || null,
            customerCode: state.customerCode || null,
            customerName: state.customerName || null,
            status: state.status ? 1 : 0,
            channelId: state.channelId ? state.channelId : null,
            account_Id: state.account_Id ? state.account_Id : null,
        }
        await this.setState({ loading: true })
        await this.props.CustomerController.FilterCustomer(data, this.state.accId)
        const result = this.props.filterCustomer
        if (result && result.length > 0) {
            await this.Alert('Tìm kiếm thành công', 'info')
        } else await this.Alert('Không có dữ liệu', 'info')
        await this.setState({ loading: false, datas: result })
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
            this.setState({ insertDialog: true, inputValues: {} })
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
        if (!this.state.inputValues.customerCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorCustomerCode: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorCustomerCode: "" } })

        if (!this.state.inputValues.customerName) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorCustomerName: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorCustomerName: "" } })

        if ((!this.state.inputValues.account_Id || this.state.inputValues.account_Id === '') && this.state.inputValues.accountCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorAccountName: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorAccountName: "" } })

        if (this.state.inputValues.account_Id && this.state.inputValues.account_Id !== '' && !this.state.inputValues.accountCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorAccountCode: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorAccountCode: "" } })

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        await this.handleValid().then(async (valid) => {
            if (valid) {
                const inputValues = this.state.inputValues
                const data = {
                    parentId: inputValues.customerId || null,
                    channelId: inputValues.channelId || null,
                    account_Id: inputValues.account_Id.id || null,
                    accountCode: inputValues.accountCode || null,
                    accountName: inputValues.accountName || null,
                    customerCode: inputValues.customerCode,
                    customerName: inputValues.customerName,
                    orderBy: inputValues.orderBy || null
                }
                await this.props.CustomerController.InsertCustomer(data, this.state.accId)
                let response = await this.props.insertCustomer
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({ datas: this.props.filterCustomer, insertDialog: false, inputValues: {} })
                    await this.highlightParentRow(0)
                    await this.Alert("Thêm thành công", "info")
                } else {
                    await this.Alert("Thêm thất bại", "error")
                    await this.setState({ inputValues: {} })
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
                    customerCode: rowData.customerCode,
                    customerName: rowData.customerName,
                    orderBy: rowData.orderBy,
                    status: rowData.status === 1 ? true : false,
                    customerId: rowData.parentId,
                    accountCode: rowData.accountCode,
                    accountName: rowData.accountName,
                    account_Id: rowData.account_Id ? {
                        id: rowData.account_Id,
                        code: rowData.accountCode,
                        name: rowData.accountName
                    } : null,
                    channelId: rowData.channelId,
                    parentId: rowData.parentId
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
                    parentId: inputValues.customerId || null,
                    channelId: inputValues.channelId || null,
                    account_Id: inputValues.account_Id.id || null,
                    accountCode: inputValues.accountCode || null,
                    accountName: inputValues.accountName || null,
                    customerCode: inputValues.customerCode,
                    customerName: inputValues.customerName,
                    orderBy: inputValues.orderBy || null,
                    status: inputValues.status ? 1 : 0,
                    id: inputValues.id
                }
                await this.props.CustomerController.UpdateCustomer(data, inputValues.index, this.state.accId)
                let response = await this.props.updateCustomer
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({
                        datas: this.props.filterCustomer,
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
        const data = {
            parentId: state.customerId || null,
            customerCode: state.customerCode || null,
            customerName: state.customerName || null,
            status: state.status ? 1 : 0,
        }
        await this.setState({ loading: true })
        await this.props.CustomerController.ExportCustomer(data, this.state.accId)
        const result = this.props.exportCustomer
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.CustomerController.TemplateCustomer(this.state.accId)
        const result = this.props.templateCustomer
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.CustomerController.ImportCustomer(event.files[0], this.state.accId)
        const result = this.props.importCustomer
        if (result && result.status === 1)
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
            dialogInsert = <CustomerDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                accId={this.state.accId}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
                handleChangeDropDown={this.handleChangeDropDown}
            />
        }
        if (this.state.updateDialog) { // * UPDATe DIALOG
            dialogUpdate = <CustomerDialog
                stateName={"inputValues"}
                actionName={"Update"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                accId={this.state.accId}
                //dialog
                displayDialog={this.state.updateDialog}
                footerAction={this.footerUpdateDialog}
                handleActionDialog={this.handleUpdateDialog}
                handleChangeDropDown={this.handleChangeDropDown}
            />
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
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_customer"}</label>
                                    <CustomerDropDownList
                                        id='customerId'
                                        mode='single'
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.customerId} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_channel"}</label>
                                    <ChannelDropDownList
                                        id='channelId'
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.channelId} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_account"}</label>
                                    <CustomerAccountDropDownList
                                        id='account_Id'
                                        mode='single'
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.account_Id}
                                        edit={false} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_status"}  </label>
                                    <br />
                                    <div style={{ marginTop: 15 }}>
                                        <Checkbox inputId="status" checked={this.state.status} onChange={e => this.setState({ status: e.checked })} />
                                        <small htmlFor="status">{this.state.status ? ' Active' : ' InActive'}</small>
                                    </div>
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_customer_code"}  </label>
                                    <InputText id="customerCode"
                                        value={this.state.customerCode} onChange={e => this.onChange(e.target.id, e.target.value)} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{"l_customer_name"}  </label>
                                    <InputText id="customerName"
                                        value={this.state.customerName} onChange={e => this.onChange(e.target.id, e.target.value)} />
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
                        <Column field="channelName" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_channel"} />
                        <Column body={this.showAccount} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_account"} />
                        <Column filter header={"l_parent"} body={this.showParent} style={{ width: '5%', textAlign: 'center' }} />
                        <Column field="customerCode" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_customer_code"} />
                        <Column field="customerName" filter={true} style={{ textAlign: 'center', width: '10%' }} header={"l_customer_name"} />
                        <Column body={this.actionButtons} header="#" style={{ width: '3%', textAlign: "center" }} ></Column>
                    </DataTable>
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
        filterCustomer: state.customer.filterCustomer,
        insertCustomer: state.customer.insertCustomer,
        updateCustomer: state.customer.updateCustomer,
        exportCustomer: state.customer.exportCustomer,
        templateCustomer: state.customer.templateCustomer,
        importCustomer: state.customer.importCustomer,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Customers);
