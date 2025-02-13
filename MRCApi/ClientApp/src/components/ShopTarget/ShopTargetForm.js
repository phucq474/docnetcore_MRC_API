import React,{Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {Button} from 'primereact/button';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import ShopTargetDialog from './ShopTargetDialog';
import {Dialog} from 'primereact/dialog';
import {ShopTargetAPI} from '../../store/ShopTargetController'
import {Toolbar} from 'primereact/toolbar';
import {download} from '../../Utils/Helpler'
import {FileUpload} from 'primereact/fileupload';
import {Dropdown} from 'primereact/dropdown';
import {getAccountId,HelpPermission} from '../../Utils/Helpler'
import {ProgressSpinner} from 'primereact/progressspinner';
import EmployeeDropDownList from "../Controls/EmployeeDropDownList"
import {actionCreatorsShop} from '../../store/ShopController';
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList"
import RegionDropDownList from '../Controls/RegionDropDownList';
import moment from 'moment'
import '../../css/highlight.css'
import Page403 from '../ErrorRoute/page403';

class ShopTargetForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            displayUpdateDialog: false,
            displayInsertDialog: false,
            displayConfirmDialog: false,
            rowData: {},
            inputValues: {},
            searchValues: {},
            position: 0,
            employee: 0,
            yearData: [],
            monthData: [],
            isFetchedProvince: false,
            isFetchedStoreList: false,
            cloneShopLists: [],
            isLoading: false,
            permission: {},
        }
        this.pageId = 2044
        this.handleSearch = this.handleSearch.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleInsert = this.handleInsert.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleExport = this.handleExport.bind(this)
        this.handleImport = this.handleImport.bind(this)
        this.handleValidInput = this.handleValidInput.bind(this)
        this.displayToastMessage = this.displayToastMessage.bind(this)
        this.actionButtons = this.actionButtons.bind(this)
        this.renderFooterAction = this.renderFooterAction.bind(this)
        this.handleDialog = this.handleDialog.bind(this)
        this.handleChangeForm = this.handleChangeForm.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.fileUpload = React.createRef();
    }
    async handleSearch(otherAction = true) {
        if(!otherAction) {
            await this.setState({isLoading: true})
        }
        const {searchByYear,searchByMonth,searchByRegion,searchByNumber,searchByTarget} = await this.state.searchValues
        await this.props.ShopTargetController.GetListTarget(
            searchByYear ? searchByYear.name : new Date().getFullYear(),
            searchByMonth ? searchByMonth.name : "",
            searchByRegion ? searchByRegion : "",
            this.state.position ? this.state.position : "",
            this.state.employee ? this.state.employee : "",
            searchByNumber ? searchByNumber.id : "",
            (typeof searchByTarget === "object" && searchByTarget && searchByTarget.targetName) ?
                searchByTarget.targetName : searchByTarget ? searchByTarget : ""
        )
        const datas = await this.props.listTargets
        await datas.sort((a,b) => {
            if(a.year > b.year) return -1;
            if(a.year < b.year) return 1;
            if(a.month > b.month) return -1;
            if(a.month < b.month) return 1;
            return 0;
        })
        if(!otherAction) {
            await this.displayToastMessage("info","Result ",datas.length)
            await this.setState({isLoading: false})
        }
        await this.setState({datas: datas})
    }
    async handleInsert() {
        await this.setState({isLoading: true})
        const {year,month,quantity,employeeValue,amount,visit,shopId,provinceCode,targetName} = await this.state.inputValues
        if((provinceCode && provinceCode.provinceCode) && shopId === 0) {
            await this.displayToastMessage("error","Insert Failed",1)
            return
        }
        await this.handleValidInput("insert").then(async (valid) => {
            if(valid) {
                const data = await {
                    "year": year ? year.name : "",
                    "month": month ? month.name : "",
                    "quantity": quantity ? quantity : "",
                    "Amount": amount ? amount : "",
                    "Visit": visit ? visit : "",
                    "EmployeeId": employeeValue || 0,
                    "ShopId": (shopId && shopId.shopId) ? shopId.shopId : "",
                    "ProvinceCode": (provinceCode && provinceCode.provinceCode && shopId === 0) ? provinceCode.provinceCode : "",
                    "targetName": (typeof targetName === "object" && targetName && targetName.targetName) ?
                        targetName.targetName : targetName ? targetName : "",
                }
                await this.props.ShopTargetController.InsertListTarget(data)
                let response = await this.props.insertListTarget
                if(response[0] && response[0].result === 1) {
                    await this.handleSearch()
                    await this.handleDialog(false,"displayInsertDialog")
                    await this.displayToastMessage("success","Insert Successful",1)
                } else {
                    await this.displayToastMessage("error","Insert Failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleUpdate() {
        await this.setState({isLoading: true})
        const {amount,quantity,visit,provinceCode,shopId,targetName,id,rowIndex} = await this.state.inputValues
        if((provinceCode && provinceCode.provinceCode) && shopId === 0) {
            await this.displayToastMessage("error","Update Failed",1)
            return
        }
        await this.handleValidInput().then(async (valid) => {
            if(valid) {
                const data = await {
                    "amount": amount || "",
                    "quantity": quantity || "",
                    "shopId": (shopId && shopId.shopId) ? shopId.shopId : "",
                    "ProvinceCode": provinceCode && provinceCode.provinceCode ? provinceCode.provinceCode : "",
                    "visit": visit || "",
                    "id": id || "",
                    "targetName": (typeof targetName === "object" && targetName && targetName.targetName) ?
                        targetName.targetName : targetName ? targetName : "",
                }
                await this.props.ShopTargetController.UpdateListTarget(data,rowIndex)
                let response = await this.props.updateListTarget
                if(response[0] && response[0].result === 1) {
                    await this.handleSearch()
                    await this.highlightParentRow(rowIndex)
                    await this.handleDialog(false,"displayUpdateDialog")
                    await this.displayToastMessage("success","Update Successful",1)
                } else {
                    await this.displayToastMessage("error","Update Failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleDelete() {
        await this.setState({isLoading: true})
        const data = await {id: this.state.rowData.id}
        await this.props.ShopTargetController.DeleteListTarget(data)
        const response = await this.props.deleteListTarget
        await this.handleDialog(false,"displayConfirmDialog")
        if(response[0] && response[0].result === 1) {
            await this.displayToastMessage("success","Delete Successful",1)
            await this.setState({datas: this.props.listTargets})
        } else {
            await this.displayToastMessage("error","Delete failed",-1)
        }
        await this.setState({isLoading: false})
    }
    async handleExport() {
        await this.setState({isLoading: true})
        const {searchByYear,searchByMonth,searchByRegion,searchByNumber,searchByTarget} = await this.state.searchValues
        await this.props.ShopTargetController.ExportListTarget(
            searchByYear ? searchByYear.name : new Date().getFullYear(),
            searchByMonth ? searchByMonth.name : "",
            searchByRegion ? searchByRegion : "",
            this.state.position !== 0 ? this.state.position : "",
            this.state.employee !== 0 ? this.state.employee : "",
            searchByNumber ? searchByNumber.id : "",
            (typeof searchByTarget === "object" && searchByTarget && searchByTarget.targetName) ?
                searchByTarget.targetName : searchByTarget ? searchByTarget : "",
        )
        let response = await this.props.exportListTarget
        if(response[0] && response[0].status === 1) {
            await download(response[0].fileUrl)
            await this.displayToastMessage("success","Export Successful",1)
        } else {
            await this.displayToastMessage("error","Export Failed",-1)
        }
        await this.setState({isLoading: false})
    }
    async handleImport(event) {
        await this.setState({isLoading: true})
        await this.props.ShopTargetController.ImportListTarget(event.files[0])
        let response = await this.props.importListTarget
        if(response && response.status === 1) {
            await this.displayToastMessage("success",response.message)
        } else {
            await this.displayToastMessage("error", response.message,-1)
        }
        this.fileUpload.current.fileInput = await {"value": ''};
        await this.fileUpload.current.clear()
        await this.setState({isLoading: false})
    }
    async handleValidInput(actionName) {
        let check = await true;
        const {shopId,employeeValue,year,month,provinceCode,quantity,amount,visit,targetName} = await this.state.inputValues
        if(actionName === "insert") {
            if((employeeValue == null || employeeValue == undefined || employeeValue === 0) &&
                (shopId === 0 || shopId === undefined || shopId == null || shopId === "")) {
                await this.setState({inputValues: {...this.state.inputValues,errorEmployee: "Employee or Store Required"}})
                check = await false
            } else await this.setState({inputValues: {...this.state.inputValues,errorEmployee: ""}})
            if(!year) {
                await this.setState({inputValues: {...this.state.inputValues,errorYear: "Year Required"}})
                check = await false
            } else await this.setState({inputValues: {...this.state.inputValues,errorYear: ""}})
            if(!month) {
                await this.setState({inputValues: {...this.state.inputValues,errorMonth: "Month Required"}})
                check = await false
            } else await this.setState({inputValues: {...this.state.inputValues,errorMonth: ""}})
            /**
             * if accountID === 2.
             */
            if(getAccountId() === 2) {
                if(!provinceCode) {
                    await this.setState({inputValues: {...this.state.inputValues,errorProvinceCode: "Province Required"}})
                    check = await false
                } else await this.setState({inputValues: {...this.state.inputValues,errorProvinceCode: ""}})
            }
        }
        if(!targetName) {
            await this.setState({inputValues: {...this.state.inputValues,errorTargetName: "Target Required"}})
            check = await false
        } else await this.setState({inputValues: {...this.state.inputValues,errorTargetName: ""}})
        if((quantity === null || quantity === undefined) &&
            (amount === null || amount === undefined) &&
            (visit === null || visit === undefined)) {
            await this.setState({inputValues: {...this.state.inputValues,errorNumber: "Input Required"}})
            check = await false
        } else await this.setState({inputValues: {...this.state.inputValues,errorNumber: ""}})
        if(!check) return false
        else return true
    }
    displayToastMessage(severity,toastMessage,actionState = null) { // 1:succeess  -1:failed
        let detail = ""
        if (actionState===null) detail = ""
        else if(actionState === 1) detail = "1 row affected"
        else if(actionState === -1) detail = "0 row affected"
        else detail = `Result ${actionState}`
        this.toast.show({severity: severity,summary: toastMessage,detail: detail,life: 3000});
    }
    actionButtons(rowData,event) {
        return (
            <div className="p-d-flex p-flex-column">
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleDialog(true,"displayUpdateDialog",rowData,event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleDialog(true,"displayConfirmDialog",rowData)} />}
            </div>
        )
    }
    renderFooterAction(actionName,cancel,proceed) {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    async handleDialog(boolean,stateName,rowData = {},rowIndex = -1) {
        if(boolean) {
            await this.setState({isLoading: true})
            let cloneShopLists = await []
            if(!this.state.isFetchedStoreList) {
                await this.props.ShopController.GetShopByEmployees({
                    workDate: "",position: "",supId: "",employeeId: "",dealerId: "",area: "",region: "",province: "",
                });
                cloneShopLists = await this.props.employeeShops
                await this.setState({
                    cloneShopLists: cloneShopLists,
                })
            }
            if(getAccountId() === 2) { // * Accountid = 2
                if(!this.state.isFetchedProvince) {
                    await this.props.ShopTargetController.GetProvinceCode()
                }
            }
            if(stateName === "displayInsertDialog") {

            } else if(stateName === "displayUpdateDialog") { // * Update
                const provinceCode = await this.props.getProvinceCode.filter(e => rowData.provinceCode && e.provinceCode === rowData.provinceCode)
                const filterShopList = await this.state.cloneShopLists.filter(e => e.shopId === rowData.shopId)
                await this.setState({
                    inputValues: {
                        ...this.state.inputValues,
                        provinceCode: provinceCode[0] || {},
                        shopId: filterShopList[0] || {},
                        id: rowData.id || "",
                        employeeName: rowData.employeeName || "",
                        fullName: rowData.fullName || "",
                        shopNameVN: rowData.shopNameVN || "",
                        quantity: rowData.quanlity || "",
                        amount: rowData.amount || "",
                        visit: rowData.visit || "",
                        date: `${rowData.month}/${rowData.year}`,
                        targetName: rowData.targetName || "",
                        rowIndex: rowIndex,
                    },
                })
            }
            await this.setState({
                [stateName]: true,
                rowData: rowData,
                inputValues: {
                    ...this.state.inputValues,
                    provinceCodes: this.props.getProvinceCode || [],
                    shopLists: this.state.cloneShopLists,
                },
                // * already fetched
                isFetchedStoreList: true,
                isFetchedProvince: true,

                isLoading: false,
            })
        } else {
            await this.setState({
                [stateName]: false,
                rowData: {},
                inputValues: {},
                isLoading: false
            })
        }
    }
    handleChange = async (id,value) => {
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value,
            }
        });
        if(id === 'position' || id === 'supId') {
            await this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    employeeValue: 0,
                    shopId: 0
                }
            });
        }
        if(id === "shopId") {
            await this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    provinceCode: {}
                }
            })
        }
        if(id === 'employeeValue' && value !== null) {
            await this.bindShop(value)
        } else {
            await this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    shopLists: this.state.cloneShopLists,
                }
            })
        }

    }
    bindShop = async (employeeId,shopId = -1) => {
        let data = await {
            workDate: moment(new Date()).format('YYYYMMDD'),position: 0,shopId: 0,supId: '',
            employeeId: employeeId ? employeeId.toString() : '',dealerId: 0,area: '',region: '',province: ''
        }
        await this.props.ShopController.GetShopByEmployees(data)
        const employeeShops = await this.props.employeeShops
        let filterShop = await []
        if(employeeShops.length > 0) {
            if(shopId !== -1) {
                filterShop = employeeShops.filter(e => e.shopId === shopId)
            } else {
                filterShop = employeeShops
            }
        }
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                shopId: filterShop.length > 0 ? filterShop[0] : {},
                shopLists: filterShop,
            }
        })
    }
    async handleChangeForm(value,stateName,subStateName = null) {
        if(subStateName === null) {
            await this.setState({[stateName]: value});
        } else {
            if(subStateName === "provinceCode") {
                await this.setState({
                    [stateName]: {...this.state[stateName],[subStateName]: value,shopId: 0}
                });
            } else {
                await this.setState({
                    [stateName]: {...this.state[stateName],[subStateName]: value,}
                });
            }
        }
    }
    handleChangeDropDownSearch = async (id,value) => {
        await this.setState({
            [id]: value === null ? "" : value,
        });
        if(id === 'position' || id === 'supId') await this.setState({employee: 0});
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({permission})
    }
    componentDidMount() {
        const init = async () => {
            let searchByNumbers = await [
                {name: "Visit",id: 1},
                {name: "Quantity",id: 2},
                {name: "Amount",id: 3},
            ]
            let yearData = await []
            let monthData = await []
            let currentYear = await new Date().getFullYear()
            for(let i = currentYear + 1;i >= currentYear - 3;i--) {
                await yearData.push({name: i})
            }
            for(let i = 1;i <= 12;i++) {
                await monthData.push({name: i})
            }
            await this.props.ShopTargetController.GetTargetName()
            await this.setState({
                searchValues: {
                    ...this.state.searchValues,
                    searchByNumbers: searchByNumbers,
                },
                yearData: yearData,
                monthData: monthData,
                listTargetName: this.props.listTargetName,
            })
        }
        init()
    }
    highlightParentRow = async (rowIndex) => {
        const seconds = await 3000,outstanding = await "highlightText"
        let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0]
        if(rowUpdated && !rowUpdated.children[rowIndex].classList.contains(outstanding)) {
            rowUpdated.children[rowIndex].classList.add(outstanding)
            setTimeout(() => {
                if(rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                    rowUpdated.children[rowIndex].classList.remove(outstanding)
                }
            },seconds)
        }
    }
    handleRegionDropDown = (id,value) => {
        this.setState({
            searchValues: {
                ...this.state.searchValues,
                searchByRegion: value
            }
        });
    }
    render() {
        let dataTable = null,dialogInsert = null,dialogUpdate = null,dialogConfirm = null
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch(false)} style={{marginRight: "15px"}} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{marginRight: "15px"}} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic" onClear={this.clear} uploadHandler={this.handleImport} customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{marginRight: "15px"}} />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = {"value": ''};
                    this.fileUpload.current.clear()
                }} />}
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleDialog(true,"displayInsertDialog")} style={{marginRight: "15px"}} />}
            </React.Fragment>
        );
        if(this.state.datas.length > 0) { // * Datatable
            dataTable = <DataTable
                value={this.state.datas} paginator rows={20}
                resizableColumns columnResizeMode="expand"
                rowsPerPageOptions={[10,20,50]}
                paginatorPosition={"both"}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowHover>
                <Column field="no" header="No." body={(rowData,event) => <span>{event.rowIndex + 1}</span>} style={{width: '4%',textAlign: "center"}}></Column>
                <Column filter field="area" header={this.props.language["area"] || "l_area"} style={{textAlign: "center"}}></Column>
                <Column filter field="provinceVN" header={this.props.language["province"] || "l_province"} style={{textAlign: "center"}} className="province_shoptarget" ></Column>
                <Column filter field="employeeCode" header={this.props.language["employee_code"] || "l_employee_code"} style={{ textAlign: "center" }}></Column>
                <Column filter field="fullName" header={this.props.language["employee_name"] || "l_employee_name"} style={{  textAlign: "center" }}></Column>
                <Column filter field="shopCode" header={this.props.language["shop_code"] || "l_shop_code"} style={{textAlign: "center"}}  ></Column>
                <Column filter field="shopNameVN" header={this.props.language["shop_name"] || "l_shop_name"} className="shopname_shoptarget" style={{textAlign: "center"}}></Column>
                <Column filter field="year" header={this.props.language["year"] || "l_year"} style={{width: '6%',textAlign: "center"}} ></Column>
                <Column filter field="month" header={this.props.language["month"] || "l_month"} style={{width: '6%',textAlign: "center"}} ></Column>
                <Column filter field="targetName" header={this.props.language["target_name"] || "l_target_name"} style={{width: '9%',textAlign: "center"}} ></Column>
                <Column filter field="quanlity" header={this.props.language["quantity"] || "l_quantity"} className="quantity_shoptarget" style={{width: '7%',textAlign: "center"}}
                    body={(rowData) => <span>{Number(rowData.quanlity).toLocaleString()}</span>} />
                <Column filter field="amount" header={this.props.language["amount"] || "l_amount"} className="amount_shoptarget" style={{width: '7%',textAlign: "center"}}
                    body={(rowData) => <span>{Number(rowData.amount).toLocaleString()}</span>} />
                <Column filter field="visit" header={this.props.language["visit"] || "l_visit"} className="visit_shoptarget" style={{width: '7%',textAlign: "center"}}
                    body={(rowData) => <span>{Number(rowData.visit).toLocaleString()}</span>} />
                <Column body={this.actionButtons} header="#" style={{width: '5%',textAlign: "center"}} ></Column>
            </DataTable>
        }
        if(this.state.displayInsertDialog) { // * INSERT DIALOG
            dialogInsert = <ShopTargetDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                dialogStateName={"displayInsertDialog"}
                displayDialog={this.state.displayInsertDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleInsert}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleDialog={this.handleDialog}
                yearData={this.state.yearData}
                monthData={this.state.monthData}
                listTargetName={this.state.listTargetName}
            />
        }
        if(this.state.displayUpdateDialog) { // * UPDATE DIALOG
            dialogUpdate = <ShopTargetDialog
                stateName={"inputValues"}
                actionName={"Update"}
                dialogStateName={"displayUpdateDialog"}
                displayDialog={this.state.displayUpdateDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleUpdate}
                handleChange={this.handleChange}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDialog={this.handleDialog}
                listTargetName={this.state.listTargetName}
            />
        }
        if(this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{width: '350px'}} footer={this.renderFooterAction("Delete",() => this.handleDialog(false,"displayConfirmDialog"),this.handleDelete)} onHide={() => this.handleDialog(false,"displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        }
        return (
            this.state.permission.view ? (
                <React.Fragment>
                    <Toast ref={(el) => this.toast = el} />
                    {this.state.isLoading &&
                        <div className="loading_container">
                            <ProgressSpinner className="loading_spinner" strokeWidth="8" fill="none" animationDuration=".5s" />
                        </div>
                    }
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["year"] || "l_year"}</label>
                                    <Dropdown value={this.state.searchValues.searchByYear || ""} options={this.state.yearData} onChange={(e) => this.handleChangeForm(e.value,"searchValues","searchByYear")} optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_year"] || "l_select_year"} />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["month"] || "l_month"}</label>
                                    <Dropdown value={this.state.searchValues.searchByMonth || ""} options={this.state.monthData} onChange={(e) => this.handleChangeForm(e.value,"searchValues","searchByMonth")} optionLabel="name" filter showClear filterBy="name" placeholder={this.props.language["select_month"] || "l_select_month"} />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["region"] || "l_region"}</label>
                                    <RegionDropDownList
                                        regionType="Area"
                                        parent=""
                                        value={this.state.searchValues.searchByRegion}
                                        onChange={this.handleRegionDropDown}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["position"] || "l_position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        type={""}
                                        onChange={this.handleChangeDropDownSearch}
                                        value={this.state.position}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["employee"] || "l_employee"}</label>
                                    <EmployeeDropDownList
                                        type={this.state.position}
                                        id="employee" mode="single"
                                        typeId={this.state.position}
                                        parentId={0}
                                        onChange={this.handleChangeDropDownSearch}
                                        value={this.state.employee}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["target_name"] || "l_target_name"}</label>
                                    <Dropdown value={this.state.searchValues.searchByTarget || ""} options={this.state.listTargetName}
                                        onChange={(e) => this.handleChangeForm(e.value,"searchValues","searchByTarget")} optionLabel="targetName" filter showClear filterBy="targetName"
                                        placeholder={this.props.language["select_by"] || "l_select_by"} editable />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {dataTable}
                    {dialogInsert}
                    {dialogUpdate}
                    {dialogConfirm}
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        listTargets: state.shoptarget.listTargets,
        getProvinceCode: state.shoptarget.getProvinceCode,
        insertListTarget: state.shoptarget.insertListTarget,
        updateListTarget: state.shoptarget.updateListTarget,
        deleteListTarget: state.shoptarget.deleteListTarget,
        exportListTarget: state.shoptarget.exportListTarget,
        importListTarget: state.shoptarget.importListTarget,
        listTargetName: state.shoptarget.listTargetName,
        employeeShops: state.shops.employeeShops,
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ShopTargetController: bindActionCreators(ShopTargetAPI,dispatch),
        ShopController: bindActionCreators(actionCreatorsShop,dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ShopTargetForm);