import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { download } from '../../Utils/Helpler';
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
import OSATargetDetail from './OSATargetDetail';
import { actionCreatorsOSA } from '../../store/OSAController';
import { Dialog } from 'primereact/dialog';
class OSATargetActiveSKU extends Component {
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
        }
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
        await this.props.OSAController.FilterOSATarget(data)
        const result = this.props.filterOSATarget
        if (result && result.length > 0) {
            await this.Alert("GetData Successful", "info")
            await this.setState({ datas: result })
        } else {
            await this.Alert("No Data", 'error')
            await this.setState({ datas: result })
        }
        await this.setState({ loading: false })

    }
    // Template
    handleGetTemplate = async () => {
        await this.props.OSAController.TemplateOSATarget()
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
        await this.props.OSAController.ImportOSATarget(event.files[0])
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
        await this.props.OSAController.ExportOSATarget(data)
        const result = this.props.exportOSATarget
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
    handleValid = async () => {
        let check = true;
        const inputValues = this.state.inputValues
        if (!inputValues.promotionCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionCode: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionCode: "" } })

        if (!inputValues.activeDate) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorActiveDate: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorActiveDate: "" } })

        if (!inputValues.dates || !inputValues.dates[1]) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })

        if (!inputValues.divisionId) {
            await this.Alert('Xin chọn Cat', 'error')
            check = false
        }
        if (!inputValues.brandId) {
            await this.Alert('Xin chọn SubCate', 'error')
            check = false
        }

        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        const inputValues = this.state.inputValues
        if (await this.handleValid()) {
            await this.setState({ loading: true })
            const data = {
                customerId: inputValues.customerId || null,
                divisionId: inputValues.divisionId || null,
                brandId: inputValues.brandId || null,
                categoryId: inputValues.categoryId || null,
                promotionCode: inputValues.promotionCode || null,
                productCode: inputValues.productCode || null,
                productName: inputValues.productName || null,
                fromDate: moment(inputValues.dates[0]).format('YYYY-MM-DD'),
                toDate: moment(inputValues.dates[1]).format('YYYY-MM-DD'),
                activeDate: moment(inputValues.activeDate).format('YYYY-MM-DD'),
                mua: inputValues.mua || null,
                tang: inputValues.tang || null,
                maVPKM: inputValues.maVPKM || null,
                doiTuongApDung: inputValues.doiTuongApDung || null,
                type: inputValues.type || null,
                area: inputValues.area || null,
            }
            await this.props.PromotionController.InsertPromotionList(data)
            const result = this.props.insertPromotionList
            if (result && result[0] && result[0].alert == '1') {
                await this.setState({ datas: this.props.filterPromotionList })
                await this.Alert('Thêm thành công', 'info')
            } else await this.Alert('Thêm thất bại', 'error')
            await this.setState({ loading: false, insertDialog: false })
        }
    }
    /// Update 
    handleUpdateDialog = async (boolean, rowData, index) => {
        if (boolean) {
            await this.setState({
                updateDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    index: index,
                    activeDate: new Date(rowData.activeDate),
                    dates: [new Date(rowData.fromDate), rowData.toDate ? new Date(rowData.toDate) : null],
                    id: rowData.id,
                    area: rowData.area,
                    brandId: rowData.brandId,
                    categoryId: rowData.categoryId,
                    customerId: rowData.customerId,
                    divisionId: rowData.divisionId,
                    doiTuongApDung: rowData.doiTuongApDung,
                    maVPKM: rowData.maVPKM,
                    productCode: rowData.productCode,
                    productName: rowData.productName,
                    promotionCode: rowData.promotionCode,
                    promotionName: rowData.promotionName,
                    tang: rowData.tang,
                    mua: rowData.mua,
                    type: rowData.type,
                },
            })
        } else {
            this.setState({ updateDialog: false, inputValues: {} })
        }
    }
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
    handleUpdate = async () => {
        const inputValues = this.state.inputValues
        if (await this.handleValid()) {
            await this.setState({ loading: true })
            const data = {
                id: inputValues.id,
                customerId: inputValues.customerId || null,
                divisionId: inputValues.divisionId || null,
                brandId: inputValues.brandId || null,
                categoryId: inputValues.categoryId || null,
                promotionCode: inputValues.promotionCode || null,
                productCode: inputValues.productCode || null,
                productName: inputValues.productName || null,
                fromDate: moment(inputValues.dates[0]).format('YYYY-MM-DD'),
                toDate: moment(inputValues.dates[1]).format('YYYY-MM-DD'),
                activeDate: moment(inputValues.activeDate).format('YYYY-MM-DD'),
                mua: inputValues.mua || null,
                tang: inputValues.tang || null,
                maVPKM: inputValues.maVPKM || null,
                doiTuongApDung: inputValues.doiTuongApDung || null,
                type: inputValues.type || null,
                area: inputValues.area || null,
            }
            await this.props.PromotionController.UpdatePromotionList(data, inputValues.index)
            const result = this.props.updatePromotionList
            if (result && result[0] && result[0].alert === '1') {
                await this.Alert('Cập Nhập Thành Công', 'info')
                await this.setState({ datas: this.props.filterPromotionList })
                await this.highlightParentRow(inputValues.index)
            } else await this.Alert('Cập Nhập Thất Bại', 'error')
            await this.setState({ loading: false, updateDialog: false })
        }
    }

    // Delete
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
                deleteDialog: true
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
        await this.props.OSAController.DeleteOSATarget(state.deleteProductId)
        const result = this.props.deleteDetailOSATarget
        if (result.status === 1) {
            await this.Alert(result.message, 'info')
            let call = this.state.reCall; call++
            await this.setState({ reCall: call })
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false, deleteDialog: false })
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
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined  btn__hover" style={{ marginRight: 10 }}
                        onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined  btn__hover" onClick={() => this.handleDeleteDialog(true, rowData, event.rowIndex)} />}
            </div>
        )
    }
    rowExpansionTemplate = (rowData) => {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-12 p-sm-12">
                    <OSATargetDetail
                        // handleActionRow={this.handleActionRow}
                        rowDataChild={rowData}
                        setSelectedRow={this.setSelectedRow}
                        rowSelection={this.state.rowSelection}
                        insertDataRow={this.insertDataRow(rowData)}
                        dataInput={rowData}
                        reCall={this.state.reCall}
                    ></OSATargetDetail>
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
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />}
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
        if (this.state.deleteDialog) {
            dialogDelete = <Dialog header="Delete" style={{ width: '30vw' }}
                visible={this.state.deleteDialog}
                footer={this.footerDeleteDialog()}
                onHide={() => this.handleDeleteDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>bạn có muốn xóa?</span>
                </div>
            </Dialog>
        }
        // if (this.state.insertDialog) { // * INSERT DIALOG
        //     dialogInsert = <OSATargetDialog
        //         stateName={"inputValues"}
        //         actionName={"Insert"}
        //         inputValues={this.state.inputValues}
        //         handleChangeForm={this.handleChangeForm}
        //         handleChange={this.handleChange}
        //         handleChangeDropDown={this.handleChangeDropDown}
        //         //dialog
        //         displayDialog={this.state.insertDialog}
        //         footerAction={this.footerInsertDialog}
        //         handleActionDialog={this.handleInsertDialog}
        //     />
        // }
        // if (this.state.updateDialog) { // * UPDATE DIALOG
        //     dialogUpdate = <OSATargetDialog
        //         stateName={"inputValues"}
        //         actionName={"Update"}
        //         inputValues={this.state.inputValues}
        //         handleChangeForm={this.handleChangeForm}
        //         handleChange={this.handleChange}
        //         handleChangeDropDown={this.handleChangeDropDown}
        //         //dialog
        //         displayDialog={this.state.updateDialog}
        //         footerAction={this.footerUpdateDialog}
        //         handleActionDialog={this.handleUpdateDialog}
        //     />
        // }
        return (
            <React.Fragment >
                <Toast ref={(el) => this.toast = el} />
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header={this.props.language["search"] || "search"}>
                        <div className="p-fluid p-formgrid p-grid">
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
                    dataKey="stt" rowHover
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    expandedRows={this.state.expandedRows}
                    onRowToggle={(e) => {
                        this.setState({ expandedRows: e.data })
                    }}
                    //onSelectedChange={() => this.onSelectedChange}
                    rowExpansionTemplate={this.rowExpansionTemplate} >
                    <Column expander={true} style={{ width: '1em' }} />
                    <Column filter header='No.' field="stt" style={{ width: 20, textAlign: 'center' }} />
                    <Column field="brandVN" header={this.props.language["brand"] || "l_brand"} style={{ textAlign: 'center', width: 60 }} filter={true} />
                    <Column field="categoryVN" header={this.props.language["division"] || "l_division"} style={{ textAlign: 'center', width: 50 }} filter={true} />
                    <Column field="customerName" body={this.showCustomer} filter={true} style={{ width: 120, textAlign: 'center' }} header={this.props.language["customer_name"] || "l_customer_name"} />
                    <Column body={this.showShop} filter header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: 200, textAlign: 'center' }} />
                    <Column field="fromDate" body={(rowData) => <div>{moment(rowData.fromDate).format('YYYY-MM-DD')}</div>} header={this.props.language["from_date"] || "l_from_date"} style={{ width: 60, textAlign: 'center' }} filter={true} />
                    <Column field="toDate" body={(rowData) => <div>{moment(rowData.toDate).format('YYYY-MM-DD')}</div>} header={this.props.language["to_date"] || "l_to_date"} style={{ width: 60, textAlign: 'center' }} filter={true} />
                    <Column field="total" header={this.props.language["total"] || "l_total"} style={{ width: 60, textAlign: 'center' }} filter={true} />
                    {/* <Column body={this.actionButtons} header="#" style={{ width: 50, textAlign: "center" }} ></Column> */}
                </DataTable>
                {dialogInsert}
                {dialogUpdate}
                {dialogDelete}
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterOSATarget: state.osa.filterOSATarget,
        insertOSATarget: state.osa.insertOSATarget,
        updateOSATarget: state.osa.updateOSATarget,
        exportOSATarget: state.osa.exportOSATarget,
        templateOSATarget: state.osa.templateOSATarget,
        importOSATarget: state.osa.importOSATarget,
        deleteDetailOSATarget: state.osa.deleteDetailOSATarget,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OSAController: bindActionCreators(actionCreatorsOSA, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OSATargetActiveSKU)