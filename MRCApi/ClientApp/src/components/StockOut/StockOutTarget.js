import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { download, HelpPermission } from '../../Utils/Helpler';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { connect } from 'react-redux';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import moment from 'moment';
import StockOutTargetDetail from './StockOutTargetDetail';
import { actionCreatorStockOut } from '../../store/StockOutController';
import { Dialog } from 'primereact/dialog';
import Page403 from '../ErrorRoute/page403';
import StockOutTargetDialog from './StockOutTargetDialog';
import { AccountDropDownList } from '../Controls/AccountDropDownList';
class StockOutTarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            loading: false,
            rowSelection: null,
            insertDialog: false,
            updateDialog: false,
            deleteDialog: false,
            removeDialog: false,
            permission: {
                view: true,
                export: true,
                import: true,
                create: true,
                delete: true,
                edit: true,
            },
            divisionId: 0,
            brandId: 0,
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            data: [],
            reCall: 0,
            accId: null
        }
        this.pageId = 3133;
        this.fileUpload = React.createRef()
        this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    // handle Change
    handleChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
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
    async handleChangeDropDown(id, value) {
        let inputValues = this.state.inputValues;
        inputValues[id] = value ? value : null;
        await this.setState({ inputValues })
    }
    handleChangeTable = (e) => {
        this.setState({
            inputValues: { ...this.state.inputValues, productSelected: e.value }
        })
    }
    changeFromDate = async (id, value, rowData, index) => {
        let table = await JSON.parse(JSON.stringify(this.state.datas))
        table[index].fromDate = value ? await moment(value).format('YYYY-MM-DD') : null
        await this.setState({ datas: table, fromDateOld: rowData.fromDate })

    }
    changeToDate = async (id, value, rowData, index) => {
        let table = await JSON.parse(JSON.stringify(this.state.datas))
        table[index].toDate = value ? await moment(value).format('YYYY-MM-DD') : null
        await this.setState({ datas: table, toDateOld: rowData.toDate })
    }

    // Search
    handleSearch = async () => {
        const state = this.state
        const data = await {
            customerId: state.customerId || null,
            fromDate: state.dates && state.dates[0] ? +moment(state.dates[0]).format('YYYYMMDD') : null,
            toDate: state.dates && state.dates[1] ? +moment(state.dates[1]).format('YYYYMMDD') : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
        }
        await this.setState({ loading: true })
        await this.props.StockOutController.FilterStockOutTarget(data, this.state.accId)
        const result = this.props.filterStockOutTarget
        if (result && result.length > 0) {
            await this.Alert("Tìm kiếm thành công", "info")
            await this.setState({ datas: result })
        } else {
            await this.Alert("Không có dữ liệu", 'error')
            await this.setState({ datas: result })
        }
        await this.setState({ loading: false })

    }
    // Template
    handleGetTemplate = async () => {
        await this.props.OSAController.TemplateOSATarget(this.state.accId)
        const result = this.props.templateOSATarget
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // import 
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.OSAController.ImportOSATarget(event.files[0], this.state.accId)
        const result = this.props.importOSATarget
        if (result && result.status === 1)
            await this.Alert(result.message, 'info')
        else
            await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
        await this.fileUpload.current.clear()
    }
    // export 
    handleExport = async () => {
        const state = this.state
        const data = {
            customerId: state.customerId || null,
            fromDate: state.dates && state.dates[0] ? +moment(state.dates[0]).format('YYYYMMDD') : null,
            toDate: state.dates && state.dates[1] ? +moment(state.dates[1]).format('YYYYMMDD') : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
        }
        await this.setState({ loading: true })
        await this.props.StockOutController.ExportStockOutTarget(data, this.state.accId)
        const result = this.props.exportStockOutTarget
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }

    //Insert
    handleInsertDialog = (boolean) => {
        if (boolean) {
            this.setState({
                insertDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    status: true
                }
            })
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
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        if (!permission?.view) {
            permission = await HelpPermission(3103);
        }
        await this.setState({ permission })
    }
    handleValid = async () => {
        let check = true;
        const inputValues = this.state.inputValues
        if (!inputValues.productSelected || inputValues.productSelected.length === 0) {
            await this.Alert('Xin chọn sản phẩm', 'error')
            check = false
        }
        if (!inputValues.customerId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorCustomer: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorCustomer: "" } })

        if (!inputValues.dates) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        const inputValues = this.state.inputValues
        if (await this.handleValid()) {
            await this.setState({ loading: true })
            let listProduct = []
            inputValues.productSelected.forEach((element) => {
                listProduct.push(element.id)
            })
            const data = {
                listCustomer: `[${inputValues.customerId}]` || null,
                fromDate: moment(inputValues.dates[0]).format('YYYY-MM-DD'),
                toDate: inputValues.dates[1] ? moment(inputValues.dates[1]).format('YYYY-MM-DD') : null,
                listProduct: `[${listProduct}]`
            }
            await this.props.StockOutController.InsertStockOutTarget(data, this.state.accId)
            const result = this.props.insertStockOutTarget
            if (result && result.status === 1) {
                await this.Alert('Thêm thành công', 'info')
            } else await this.Alert('Thêm thất bại', 'error')
            await this.setState({ loading: false, inputValues: {} })
        }
    }
    /// Update 
    handleUpdate = async (rowData, index) => {
        const state = this.state
        const data = {
            fromDate: rowData.fromDate,
            toDate: rowData.toDate,
            customerId: rowData.customerId,
            fromDateOld: state.fromDateOld ? state.fromDateOld : rowData.fromDate,
            toDateOld: state.toDateOld ? state.toDateOld : rowData.toDate
        }
        await this.props.StockOutController.UpdateStockOutTarget(data, this.state.accId)
        const result = this.props.updateStockOutTarget
        if (result && result.status === 1) {
            await this.Alert('Cập Nhập Thành Công', 'info')
            await this.highlightParentRow(index)
        } else await this.Alert('Cập Nhập Thất Bại', 'error')
        await this.setState({ loading: false, fromDateOld: null, toDateOld: null })
    }

    // Delete Detail
    setSelectedRow = async (value, rowData) => {
        let deleteRow = value.map((e) => e.id)
        deleteRow = deleteRow.toString()
        await this.setState({
            rowSelection: value,
            deleteProductId: deleteRow,
            deleteRow: rowData,
        })
    }
    handleDeleteDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                id: rowData.id,
                deleteDialog: true,
                rowData: rowData,
            })
        } else {
            this.setState({ deleteDialog: false })
        }
    }
    footerDeleteDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDeleteDialog(false)} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleDelete()} />
                }
            </div>
        );
    }
    handleDelete = async () => {
        const state = this.state
        await this.setState({ loading: true })
        const data = {
            customerId: state.rowData.customerId,
            fromDate: state.rowData.fromDate,
            toDate: state.rowData.toDate,
            listbrandId: null,
            listId: state.deleteProductId
        }
        await this.props.StockOutController.DeleteStockOutTarget(data, null)
        const result = this.props.deleteStockOutTarget
        if (result.status === 1) {
            await this.Alert(result.message, 'info')
            let call = this.state.reCall; call++
            await this.setState({ reCall: call })
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false, deleteDialog: false })
    }
    /// delete
    handleRemoveDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                removeDialog: true,
                index: index,
                rowData: rowData,
            })
        } else {
            this.setState({ removeDialog: false })
        }
    }
    footerRemoveDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleRemoveDialog(false)} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleRemove()} />
                }
            </div>
        );
    }
    handleRemove = async () => {
        const state = this.state
        await this.setState({ loading: true })
        const data = {
            customerId: state.rowData.customerId,
            fromDate: state.rowData.fromDate,
            toDate: state.rowData.toDate,
            listbrandId: null,
            listId: null
        }
        await this.props.StockOutController.DeleteStockOutTarget(data, state.index)
        const result = this.props.deleteStockOutTarget
        if (result && result.status === 1) {
            await this.setState({ datas: this.props.filterStockOutTarget })
            await this.Alert(result.message, 'info')
        } else await this.Alert('Remove Failed', 'error')
        await this.setState({ loading: false, removeDialog: false })
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
    showShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.shopCode}</strong></div>
                <p>{rowData.shopName}</p>
            </div>
        )
    }
    actionButtons = (rowData, event) => {
        return (
            <div>
                {this.state.permission.edit &&
                    <Button icon="pi pi-save " className="p-button-rounded p-button-info p-button-outlined  btn__hover" style={{ marginRight: 10 }}
                        onClick={() => this.handleUpdate(rowData, event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined  btn__hover" onClick={() => this.handleRemoveDialog(true, rowData, event.rowIndex)} />}
            </div>
        )
    }
    rowExpansionTemplate = (rowData) => {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-12 p-sm-12">
                    <StockOutTargetDetail
                        // handleActionRow={this.handleActionRow}
                        rowDataChild={rowData}
                        setSelectedRow={this.setSelectedRow}
                        rowSelection={this.state.rowSelection}
                        insertDataRow={this.insertDataRow(rowData)}
                        dataInput={rowData}
                        reCall={this.state.reCall}
                    ></StockOutTargetDetail>
                </div>
            </div>
        );
    }
    insertDataRow = (rowData) => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button style={{ width: '100%', marginRight: '.25em', marginTop: '10px' }} icon="pi pi-trash" className=" p-button-rounded p-button-danger"
                        onClick={() => this.state.deleteProductId ? this.handleDeleteDialog(true, rowData) : {}} />
                }
            </div>
        )
    }
    showFromDate = (rowData, event) => {
        return (
            <Calendar fluid
                value={rowData.fromDate ? new Date(rowData.fromDate) : null} onChange={e => this.changeFromDate('fromDateNew', e.target.value, rowData, event.rowIndex)}
                dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                id="fromDate"
                inputStyle={{ width: '91.5%', visible: false }}
                style={{ width: '100%' }} showIcon />
        )
    }
    showToDate = (rowData, event) => {
        return (
            <Calendar fluid
                value={rowData.toDate ? new Date(rowData.toDate) : null} onChange={e => this.changeToDate('toDateNew', e.target.value, rowData, event.rowIndex)}
                dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                id="toDate"
                inputStyle={{ width: '91.5%', visible: false }}
                style={{ width: '100%' }} showIcon />
        )
    }
    componentDidMount() {
    }
    render() {
        let dialogInsert = null, dialogUpdate = null, dialogDelete = null;
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {/* {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />} */}
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />}
                {/* {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic"
                    customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }}
                    onClear={this.clear} uploadHandler={this.handleImport}
                />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />} */}
            </React.Fragment>
        );
        if (this.state.deleteDialog || this.state.removeDialog) {
            dialogDelete = <Dialog header="Delete" style={{ width: '30vw' }}
                visible={this.state.deleteDialog ? this.state.deleteDialog : this.state.removeDialog}
                footer={this.state.deleteDialog ? this.footerDeleteDialog() : this.footerRemoveDialog()}
                onHide={() => this.state.deleteDialog ? this.handleDeleteDialog(false) : this.handleRemoveDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>bạn có muốn xóa?</span>
                </div>
            </Dialog>
        }
        if (this.state.insertDialog) { // * INSERT DIALOG
            dialogInsert = <StockOutTargetDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleChangeDropDown={this.handleChangeDropDown}
                handleChangeTable={this.handleChangeTable}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
            />
        }
        return (
            this.state.permission.view ? (
                <React.Fragment >
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                        <AccordionTab header={this.props.language["search"] || "search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <AccountDropDownList
                                    id="accId"
                                    className='p-field p-col-12 p-md-3 p-sm-6'
                                    onChange={this.handleChange}
                                    filter={true}
                                    showClear={true}
                                    value={this.state.accId} />
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                    <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.handleChange(e.target.id, e.value)}
                                        dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                        id="dates" selectionMode="range"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["customer"] || "l_customer"}</label>
                                    <CustomerDropDownList
                                        id='customerId'
                                        mode='single'
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.customerId} />
                                </div>
                            </div>
                            {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                        </AccordionTab>
                    </Accordion>
                    <Toolbar left={leftContents} right={rightContents} />
                    <DataTable
                        value={this.state.datas}
                        paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover paginatorPosition={"both"}
                        dataKey="stt"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        expandedRows={this.state.expandedRows}
                        onRowToggle={(e) => {
                            this.setState({ expandedRows: e.data })
                        }}
                        //onSelectedChange={() => this.onSelectedChange}
                        rowExpansionTemplate={this.rowExpansionTemplate} >
                        <Column expander={true} style={{ width: 80 }} />
                        <Column filter header='No.' field="stt" style={{ width: 80, textAlign: 'center' }} />
                        <Column field="customerName" body={this.showCustomer} filter={true} style={{ textAlign: 'center' }} header={this.props.language["customer_name"] || "l_customer_name"} />
                        {/* <Column body={this.showShop} filter header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: 200, textAlign: 'center' }} /> */}
                        <Column field="fromDate" body={(rowData, e) => this.showFromDate(rowData, e)} header={this.props.language["from_date"] || "l_from_date"} style={{ width: 250, textAlign: 'center' }} filter={true} />
                        <Column field="toDate" body={(rowData, e) => this.showToDate(rowData, e)} header={this.props.language["to_date"] || "l_to_date"} style={{ width: 250, textAlign: 'center' }} filter={true} />
                        <Column field="total" header={this.props.language["total"] || "l_total"} style={{ width: 100, textAlign: 'center' }} filter={true} />
                        <Column body={this.actionButtons} header="#" style={{ width: 120, textAlign: "center" }} ></Column>
                    </DataTable>
                    {dialogInsert}
                    {dialogUpdate}
                    {dialogDelete}
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))

        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterStockOutTarget: state.stockout.filterStockOutTarget,
        insertStockOutTarget: state.stockout.insertStockOutTarget,
        updateStockOutTarget: state.stockout.updateStockOutTarget,
        deleteStockOutTarget: state.stockout.deleteStockOutTarget,
        exportStockOutTarget: state.stockout.exportStockOutTarget,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        StockOutController: bindActionCreators(actionCreatorStockOut, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StockOutTarget)