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
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { actionCreatorsShopByCustomer } from '../../store/ShopByCustomerController';
import { download, HelpPermission } from '../../Utils/Helpler';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import Page403 from '../ErrorRoute/page403';
import moment from 'moment';
import { RegionApp } from '../Controls/RegionMaster';
import { RegionActionCreate } from '../../store/RegionController';

class ShopByCustomer extends PureComponent {
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

        let ProvinceId = '';
        if (state.province) {
            state.province.forEach(item => {
                ProvinceId += ',' + item;
            });
        }

        const data = await {
            fromDate: state.dates ? parseInt(moment(state.dates[0]).format("YYYYMMDD")) : null,
            toDate: state.dates.length > 1 ?  parseInt(moment(state.dates[1]).format("YYYYMMDD")) : null,
            fromdate: state.dates ? moment(state.dates[0]).format("YYYY-MM-DD") : null,
            todate: state.dates.length > 1 ?  moment(state.dates[1]).format("YYYY-MM-DD") : null,
            customerId: state.customerId || null,
            shopCode: state.shopCode || null,
            area: this.state.area ? this.state.area : null,
            province: ProvinceId ? ProvinceId : null,
        }
        return data
    }

    // search
    handleSearch = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true , datas: [], selectedRowData: []})
        await this.props.ShopByCustomerController.ShopByCus_Filter(data)
        const result = this.props.shopByCus_filter
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
            </div>
        )
    }

    //Delete
    handleDeleteDialog = (boolean, stateName, rowData) =>{
        if(this.state.selectedRowData && this.state.selectedRowData.length >0){
            if(boolean){
                this.setState({
                    [stateName]: true,
                })
            }else{
                this.setState({
                    [stateName]: false,
                })
            }
        }else{
            this.toast.show({ severity: 'warn', summary: 'Thông báo', detail: 'Chưa chọn dữ liệu để Delete', life: 5000 });
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
        let dataDelete = await this.state.selectedRowData
       
        let listId = ""
        if(dataDelete && dataDelete.length > 0 ){
            await dataDelete.forEach(e=>{
                listId = listId + e.id + ","
            })
        }
        await this.props.ShopByCustomerController.ShopByCus_Delete(listId)
        const response = await this.props.shopByCus_delete
        await this.handleDeleteDialog(false,"displayConfirmDialog")
        if(response.status === 200) {
            await this.Alert(response.message, "info")
            let datas = this.state.datas
            if(dataDelete && dataDelete.length > 0 ){
                await dataDelete.forEach(p=>{
                    let index = datas.findIndex(e=> e.id === p.id)
                    if(index > -1){
                        datas.splice(index,1)
                    }
                })
            }
            await this.setState({datas: datas, selectedRowData: []})
        } else {
            await this.Alert(response.message,'error')
        }
        await this.setState({isLoading: false})
    }

    /// export
    handleExport = async () => {
        let data = await this.getFilter()
        await this.setState({ loading: true })
        await this.props.ShopByCustomerController.ShopByCus_Export(data)
        const result = this.props.shopByCus_export
        if (result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // template
    handleGetTemplate = async () => {
        await this.setState({ loading: true })
        await this.props.ShopByCustomerController.ShopByCus_Template()
        const result = this.props.shopByCus_template
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    /// import
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.ShopByCustomerController.ShopByCus_Import(event.files[0])
        const result = this.props.shopByCus_import
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
    showShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.shopCode}</strong></div>
                <p>{rowData.shopName}</p>
            </div>
        )
    }
    showCustomer = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.customerCode}</strong></div>
                <p>{rowData.customerName}</p>
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
        this.props.RegionController.GetListRegion();
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
        if(this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{width: '350px'}} 
                footer={this.renderFooterAction("Delete",() => this.handleDeleteDialog(false,"displayConfirmDialog"),this.handleDelete)} 
                onHide={() => this.handleDeleteDialog(false,"displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}} />
                    <span>{this.props.language["are_you_sure_to_delete_these_row"] || "l_are_you_sure_to_delete_these_row"}?</span>
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
                                <RegionApp {...this} />
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{ "l_customer"}</label>
                                    <CustomerDropDownList
                                        id='customerId'
                                        mode='single'
                                        onChange={this.handleChange}
                                        value={this.state.customerId} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["shopcode"] || "shopcode"}</label>
                                    <InputText
                                        type="text"
                                        style={{ width: '100%' }}
                                        placeholder={this.props.language["shopcode"] || "shopcode"}
                                        value={this.state.shopCode}
                                        onChange={(e) => this.setState({ shopCode: e.target.value })}
                                        id="shopCode" />
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
                        <Column field="province" filter header={ "l_province"} style={{ width: '5%', textAlign: 'center' }} />
                        <Column body={this.showShop} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_shop"} />
                        <Column body={this.showCustomer} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_customer"} />
                        <Column body={this.showAccount} filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_account"} />
                        <Column field="fromDate" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_from_date"} />
                        <Column field="toDate" filter={true} style={{ textAlign: 'center', width: '5%' }} header={"l_to_date"} />
                        {/* <Column body={this.actionButtons} header="#" style={{ width: '3%', textAlign: "center" }} ></Column> */}
                        <Column selectionMode="multiple" headerStyle={{ width: '3%', textAlign: 'center'  }}  style={{textAlign: 'center' }}
                            header={this.state.permission && this.state.permission.create && (
                                <span className="p-buttonset">
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                                        onClick={() => this.handleDeleteDialog(true,"displayConfirmDialog")} />
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
        usearea: true,
        useprovince: true,
        regions: state.regions.regions,

        shopByCus_filter: state.shopByCustomer.shopByCus_filter,
        shopByCus_save: state.shopByCustomer.shopByCus_save,
        shopByCus_delete: state.shopByCustomer.shopByCus_delete,
        shopByCus_export: state.shopByCustomer.shopByCus_export,
        shopByCus_template: state.shopByCustomer.shopByCus_template,
        shopByCus_import: state.shopByCustomer.shopByCus_import
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ShopByCustomerController: bindActionCreators(actionCreatorsShopByCustomer, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShopByCustomer);
