import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { actionCreatorsPromotion } from '../../store/PromotionController';
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
import { CategoryApp } from '../Controls/CategoryMaster'
import { InputText } from "primereact/inputtext";
import { connect } from 'react-redux';
import { ProductCreateAction } from '../../store/ProductController';
import CustomerAccountDropDownList from '../Controls/CustomerAccountDropDownList';
import { RegionApp } from '../Controls/RegionMaster';
import { RegionActionCreate } from '../../store/RegionController'
import moment from 'moment';
import PromotionListDialog from './PromotionListDialog';
import { Dialog } from 'primereact/dialog';
import Page403 from '../ErrorRoute/page403';
import { Dropdown } from 'primereact/dropdown';

class PromotionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            loading: false,
            insertDialog: false,
            updateDialog: false,
            deleteDialog: false,
            permission: {},
            account_id: null,
            divisionId: 0,
            brandId: 0,
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            data: [],
            promotionType: null
        }
        this.pageId = 2053;
        this.fileUpload = React.createRef()
        this.handleChangeDropDown = this.handleChangeDropDown.bind(this);
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
    // handle Change
    handleChange = async (id, value) => {
        await this.setState({ [id]: value ? value : null })
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
        this.setState({ loading: true })
        const state = this.state
        const data = {
            account_Id: state.account_Id ? state.account_Id.id : null,
            divisionId: state.divisionId || null,
            promotionCode: state.promotionCode || null,
            fromDate: state.dates && state.dates[0] ? parseInt(moment(state.dates[0]).format('YYYYMMDD')) : null,
            toDate: state.dates && state.dates[1] ? parseInt(moment(state.dates[1]).format('YYYYMMDD')) : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
            promotionType: state.promotionType || null,
            brandId: state.brandId || null,
            categoryId: state.categoryId || null,
        }
        await this.props.PromotionController.FilterPromotionList(data)
        const result = this.props.filterPromotionList
        await this.Alert("Tìm kiếm thành công", "info")
        await this.setState({ datas: result })
        this.setState({ loading: false })
    }
    // Template
    handleGetTemplate = async () => {
        this.setState({ loading: true })
        await this.props.PromotionController.TemplatePromotionList()
        const result = this.props.templatePromotionList
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // import 
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.PromotionController.ImportPromotionList(event.files[0])
        const result = this.props.importPromotionList
        if (result && result.status === 1)
            await this.Alert(result.message, 'info')
        else
            await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
        await this.fileUpload.current.clear()
    }
    // export 
    handleExport = async () => {
        await this.setState({ loading: true })
        const state = this.state
        const data = {
            divisionId: state.divisionId || null,
            account_Id: state.account_Id ? state.account_Id.id : null,
            promotionCode: state.promotionCode || null,
            fromDate: state.dates && state.dates[0] ? parseInt(moment(state.dates[0]).format('YYYYMMDD')) : null,
            toDate: state.dates && state.dates[1] ? parseInt(moment(state.dates[1]).format('YYYYMMDD')) : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
            promotionType: state.promotionType || null,
            brandId: state.brandId || null,
            categoryId: state.categoryId || null,
        }
        await this.setState({ loading: true })
        await this.props.PromotionController.ExportPromotionList(data)
        const result = this.props.exportPromotionList
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
                    status: true,
                    dates: [new Date(), null]
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
        const inputValues = this.state.inputValues
        if (!inputValues.promotionCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionCode: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionCode: "" } })

        if (!inputValues.promotionName) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionName: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorPromotionName: "" } })

        if (!inputValues.dates || !inputValues.dates[1]) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })

        if (!inputValues.divisionId) {
            await this.Alert('Xin chọn Cat', 'error')
            check = false
        }
        if (!inputValues.account_Id) {
            await this.Alert('Xin chọn Account', 'error')
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
                divisionId: inputValues.divisionId || null,
                account_Id: inputValues.account_Id.id || null,
                promotionCode: inputValues.promotionCode || null,
                promotionName: inputValues.promotionName || null,
                fromDate: parseInt(moment(inputValues.dates[0]).format('YYYYMMDD')),
                toDate: parseInt(moment(inputValues.dates[1]).format('YYYYMMDD')) || null,
                promotionType: inputValues.promotionType || null,
                brandId: inputValues.brandId || null,
                categoryId: inputValues.categoryId || null,
                groupName: inputValues.groupName || null
            }
            await this.props.PromotionController.InsertPromotionList(data)
            const result = this.props.insertPromotionList
            if (result && result[0] && result[0].alert == '1') {
                await this.setState({ datas: this.props.filterPromotionList })
                await this.Alert('Thêm thành công', 'info')
            } else await this.Alert('Thêm thất bại', 'error')
            await this.setState({ loading: false, insertDialog: false, inputValues: {} })
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
                    dates: [new Date(rowData.fromDate), rowData.toDate ? new Date(rowData.toDate) : null],
                    id: rowData.id,
                    divisionId: rowData.divisionId,
                    brandId: rowData.brandId,
                    categoryId: rowData.categoryId,
                    promotionCode: rowData.promotionCode,
                    promotionName: rowData.promotionName,
                    account_Id: rowData.account_Id ? {
                        id: rowData.account_Id,
                        code: rowData.accountCode,
                        name: rowData.accountName,
                        key: rowData.account_Id,
                    } : null,
                    promotionType: rowData.promotionType,
                    groupName: rowData.groupName
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
                divisionId: inputValues.divisionId || null,
                account_Id: inputValues.account_Id.id || null,
                promotionCode: inputValues.promotionCode || null,
                promotionName: inputValues.promotionName || null,
                fromDate: parseInt(moment(inputValues.dates[0]).format('YYYYMMDD')),
                toDate: parseInt(moment(inputValues.dates[1]).format('YYYYMMDD')) || null,
                promotionType: inputValues.promotionType || null,
                brandId: inputValues.brandId || null,
                categoryId: inputValues.categoryId || null,
                groupName: inputValues.groupName || null
            }
            await this.props.PromotionController.UpdatePromotionList(data, inputValues.index)
            const result = this.props.updatePromotionList
            if (result && result[0] && result[0].alert == '1') {
                let data = await this.state.datas
                let ind = data.findIndex(e => e.id === inputValues.id)
                if (ind > -1) {
                    data[ind] = result[0]
                }
                await this.Alert('Cập Nhập Thành Công', 'info')
                await this.setState({ datas: data })
                await this.highlightParentRow(ind)
            } else await this.Alert('Cập Nhập Thất Bại', 'error')
            await this.setState({ loading: false, updateDialog: false, inputValues: {} })
        }
    }

    // Delete
    handleDeleteDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                id: rowData.id,
                indexDelete: index,
                deleteDialog: true
            })
        } else this.setState({ deteleDialog: false, id: null, indexDelete: null })
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
        await this.props.PromotionController.DeletePromotionList(state.id, state.indexDelete)
        const result = this.props.deletePromotionList
        if (result.status === 200) {
            let data = await this.state.datas
            let ind = data.findIndex(e => e.id === state.id)
            if (ind > -1) {
                data.splice(ind, 1)
            }
            await this.setState({ datas: data })
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false, deleteDialog: false, id: null, indexDelete: null })
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
    showPromotion = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.promotionCode}</strong></div>
                <p>{rowData.promotionName}</p>
            </div>
        )
    }
    showProduct = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.productCode}</strong></div>
                <p>{rowData.productName}</p>
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
    async componentDidMount() {
        await this.props.ProductController.GetCategory();
        await this.props.RegionController.GetListRegion();
        await this.props.PromotionController.GetListPromotionType()
    }
    render() {
        let dialogInsert = null, dialogUpdate = null;
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} className="p-button-success" />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} className="p-button-warning" />}
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} className="p-button-danger" />}
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
            dialogInsert = <PromotionListDialog
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
        if (this.state.updateDialog) { // * UPDATE DIALOG
            dialogUpdate = <PromotionListDialog
                stateName={"inputValues"}
                actionName={"Update"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleChangeDropDown={this.handleChangeDropDown}
                //dialog
                displayDialog={this.state.updateDialog}
                footerAction={this.footerUpdateDialog}
                handleActionDialog={this.handleUpdateDialog}
            />
        }
        return (
            this.state.permission.view ? (<React.Fragment >
                <Dialog header="Delete" style={{ width: '30vw' }}
                    visible={this.state.deleteDialog}
                    footer={this.footerDeleteDialog()}
                    onHide={() => this.handleDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        <span>bạn có muốn xóa?</span>
                    </div>
                </Dialog>
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
                                <label>{this.props.language["account"] || "l_account"}</label>
                                <CustomerAccountDropDownList
                                    id='account_Id'
                                    mode='single'
                                    onChange={this.handleChange}
                                    value={this.state.account_Id} />
                            </div>
                            {<CategoryApp id="appcate" {...this} />}
                            {/* <RegionApp {...this} /> */}
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["promotion_code"] || "l_promotion_code"}</label>
                                <InputText className="w-100" id="promotionCode" value={this.state.promotionCode || ""}
                                    onChange={e => this.handleChange(e.target.id, e.target.value)}></InputText>
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["promotion_type"] || "l_promotion_type"}</label>
                                <span className="p-float-label">
                                    <Dropdown
                                        className="w-100"
                                        id="promotionType"
                                        key={this.props.promotionTypeList.value}
                                        value={this.state.promotionType}
                                        options={this.props.promotionTypeList}
                                        placeholder="Select an Option" optionLabel="name"
                                        filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                        showClear={true}
                                        onChange={(e) => this.handleChange("promotionType", e.target.value)}
                                        editable
                                    />
                                </span>
                            </div>
                        </div>
                        {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar> : null}
                    </AccordionTab>
                </Accordion>
                <Toolbar left={leftContents} right={rightContents} />
                <DataTable
                    paginatorPosition={"both"}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    value={this.state.datas} paginator={true} rows={50}
                    rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }} >
                    <Column filter header='No.' field="stt" style={{ width: '3%', textAlign: 'center' }} />
                    <Column field="accountName" header={this.props.language["account"] || "l_account"} style={{ textAlign: 'center', width: '3%' }} filter={true} />
                    <Column field="division" header={this.props.language["division"] || "l_division"} style={{ textAlign: 'center', width: '3%' }} filter={true} />
                    <Column field="brand" header={this.props.language["brand"] || "l_brand"} style={{ textAlign: 'center', width: '3%' }} filter={true} />
                    <Column field="category" header={this.props.language["category"] || "l_category"} style={{ textAlign: 'center', width: '3%' }} filter={true} />
                    <Column field="groupName" header={this.props.language["promotion_group"] || "l_promotion_group"} style={{ textAlign: 'center', width: '8%' }} filter={true} />
                    <Column filter header={this.props.language["promotion_name"] || "l_promotion_name"} body={this.showPromotion} style={{ width: "12%", textAlign: 'center' }} />
                    <Column field="fromDate" body={(rowData) => <div>{moment(rowData.fromDate).format('YYYY-MM-DD')}</div>} header={this.props.language["from_date"] || "l_from_date"} style={{ width: '5%', textAlign: 'center' }} filter={true} />
                    <Column field="toDate" body={(rowData) => <div>{moment(rowData.toDate).format('YYYY-MM-DD')}</div>} header={this.props.language["to_date"] || "l_to_date"} style={{ width: "5%", textAlign: 'center' }} filter={true} />
                    <Column field="promotionType" header={this.props.language["type"] || "l_type"} style={{ textAlign: 'center', width: '5%' }} filter={true} />
                    <Column body={this.actionButtons} header="#" style={{ width: '5%', textAlign: "center" }} ></Column>
                </DataTable>
                {dialogInsert}
                {dialogUpdate}
            </React.Fragment>
            ) : (this.state.permission.view !== undefined && <Page403 />)
        )
    }
}
function mapStateToProps(state) {
    return {
        filterPromotionList: state.promotion.filterPromotionList,
        importPromotionList: state.promotion.importPromotionList,
        exportPromotionList: state.promotion.exportPromotionList,
        templatePromotionList: state.promotion.templatePromotionList,
        insertPromotionList: state.promotion.insertPromotionList,
        updatePromotionList: state.promotion.updatePromotionList,
        deletePromotionList: state.promotion.deletePromotionList,
        language: state.languageList.language,
        categories: state.products.categories,
        regions: state.regions.regions,
        usedivision: true,
        usebrand: true,
        usecate: true,
        usesubcate: false,
        usevariant: false,
        usearea: false,
        useprovince: false,
        promotionTypeList: state.promotion.promotionTypeList

    }
}
function mapDispatchToProps(dispatch) {
    return {
        PromotionController: bindActionCreators(actionCreatorsPromotion, dispatch),
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PromotionList)