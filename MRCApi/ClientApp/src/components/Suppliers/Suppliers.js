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
import { actionCreatorsSuppliers } from '../../store/SuppliersController';
import SuppliersDialog from './SuppliersDialog';
import { InputText } from "primereact/inputtext";
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
class Suppliers extends PureComponent {
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
            status: true

        }
        this.fileUpload = React.createRef()
        this.pageId = 3103
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
    // search
    handleSearch = async () => {
        const state = this.state
        const data = {
            supplierCode: state.supplierCode,
            supplierName: state.supplierName,
            status: state.status ? 1 : 0
        }
        await this.setState({ loading: true })
        await this.props.SuppliersController.FilterSuppliers(data)
        const result = this.props.filterSuppliers
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
        if (!this.state.inputValues.supplierCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorSupplierCode: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorSupplierCode: "" } })

        if (!this.state.inputValues.supplierName) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorSupplierName: "Input Required!" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorSupplierName: "" } })

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        await this.handleValid().then(async (valid) => {
            if (valid) {
                const inputValues = this.state.inputValues
                console.log(inputValues)
                const data = {
                    supplierCode: inputValues.supplierCode,
                    supplierName: inputValues.supplierName,
                    contact: inputValues.contact || null,
                    address: inputValues.address || null,
                    phone: inputValues.phone || null,
                    fax: inputValues.fax || null,
                    fullName: inputValues.fullName || null,
                    orderBy: inputValues.orderBy || null
                }
                await this.props.SuppliersController.InsertSuppliers(data)
                let response = await this.props.insertSuppliers
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({ datas: this.props.filterSuppliers, insertDialog: false, inputValues: {} })
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
        const data = {
            supplierCode: state.supplierCode,
            supplierName: state.supplierName,
            status: state.status ? 1 : 0
        }
        await this.setState({ loading: true })
        await this.props.SuppliersController.ExportSuppliers(data)
        const result = this.props.exportSuppliers
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.SuppliersController.TemplateSuppliers()
        const result = this.props.templateSuppliers
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.SuppliersController.ImportSuppliers(event.files[0])
        const result = this.props.importSuppliers
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
            dialogInsert = <SuppliersDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
            />
        }
        if (this.state.updateDialog) { // * UPDATe DIALOG
            dialogUpdate = <SuppliersDialog
                stateName={"inputValues"}
                actionName={"Update"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                //dialog
                displayDialog={this.state.updateDialog}
                footerAction={this.footerUpdateDialog}
                handleActionDialog={this.handleUpdateDialog}
            />
        }
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["supplier_code"] || "l_supplier_code"}  </label>
                                    <InputText id="supplierCode"
                                        value={this.state.supplierCode} onChange={e => this.onChange(e.target.id, e.target.value)} />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["supplier_name"] || "l_supplier_name"}  </label>
                                    <InputText id="supplierName"
                                        value={this.state.supplierName} onChange={e => this.onChange(e.target.id, e.target.value)} />
                                </div>
                                <div className="p-col-3 p-md-1 p-sm-4">
                                    <label>{this.props.language["status"] || "l_status"}  </label>
                                    <br />
                                    <div style={{ paddingTop: 10 }}>
                                        <Checkbox inputId="status" checked={this.state.status} onChange={e => this.setState({ status: e.checked })} />
                                        <small htmlFor="status">{this.state.status ? ' Active' : ' InActive'}</small>
                                    </div>
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
                        <Column filter header='No.' field="rowNum" style={{ width: 50 }} />
                        <Column filter field="supplierCode" header={this.props.language["supplier_code"] || "l_supplier_code"} style={{ width: "120px", textAlign: 'center' }} />
                        <Column filter field="supplierName" header={this.props.language["supplier_name"] || "l_supplier_name"} style={{ width: 200, textAlign: 'center' }} />
                        <Column field="contact" filter={true} style={{ width: "110px", textAlign: 'center' }} header={this.props.language["contact"] || "l_contact"} />
                        <Column field="address" header={this.props.language["address"] || "l_address"} style={{ textAlign: 'center', width: "150px" }} filter={true} />
                        <Column field="phone" header={this.props.language["phone"] || "l_phone"} style={{ width: "100px", textAlign: 'center' }} filter={true} />
                        <Column field="fax" header={this.props.language["fax"] || "l_fax"} style={{ width: "80px", textAlign: 'center' }} filter={true} />
                        <Column field="fullName" header={this.props.language["full_name"] || "l_full_name"} style={{ width: "80px", textAlign: 'center' }} filter={true} />
                        <Column body={this.actionButtons} header="#" style={{ width: 70, textAlign: "center" }} ></Column>
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
        filterSuppliers: state.suppliers.filterSuppliers,
        exportSuppliers: state.suppliers.exportSuppliers,
        importSuppliers: state.suppliers.importSuppliers,
        templateSuppliers: state.suppliers.templateSuppliers,
        insertSuppliers: state.suppliers.insertSuppliers,
        updateSuppliers: state.suppliers.updateSuppliers,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SuppliersController: bindActionCreators(actionCreatorsSuppliers, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Suppliers);
