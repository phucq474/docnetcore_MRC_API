import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PhotoGallery from '../Controls/Gallery/PhotoGallery';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { HelpPermission, getAccountId, download } from '../../Utils/Helpler'
import { ProgressBar } from 'primereact/progressbar';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { actionCreatorsOOL } from '../../store/OOLController';
// import OSAResultDetail from './OSAResultDetail';
import Page403 from '../ErrorRoute/page403';
import { ProductCreateAction } from '../../store/ProductController';
import OOLResultDetail from './OOLResultDetail';

class OOLResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            datas: [],
            permission: {},

            displayDialogInsert: false,
            dialogInsertRow: false,
            displayDialogEdit: false,
            dialogEditRow: false,
            displayDeleteDialog: false,
            displayDeleteRow: false,
            editImageDisplaySidebar: false,
            updateImageDisplay: false,
            insertImageDisplay: false,

            inputValues: {},
            bindDataDetails: false,
            productId: 0,
            division: "",
            categoryId: 0,
            subCateId: 0,
            segmentId: 0,

            isLoading: false,
            dialogRow: false,
            details: [],
            rowSelection: null,
            imageDisplay: false,
            delete: false,
            reCallDetail: 0
        }
        this.pageId = 2056
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
        this.changeDate = this.changeDate.bind(this);
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleChange = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            },
            [id]: value === null ? "" : value
        });
    }
    Search = async (data) => {
        await this.setState({ expandedRows: null, isLoading: true, datas: [] })
        await this.props.OOLController.FilterResult(data).then(() => {
            const result = this.props.oolResultFilter
            if (result && result.length > 0) {
                this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
                this.setState({ datas: result })
            } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")
            this.setState({ isLoading: false })
        });
    }
    Export = async (data) => {
        await this.props.OOLController.ExportResult(data)
        const result = this.props.oolResultExport
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    // handleActionRow =(rowData, rowDataChild, details)=> {
    //     return (
    //         <div style={{ textAlign: 'center' }}>
    //             {this.state.permission && this.state.permission.edit &&
    //                 <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => this.displayEditRow('true', rowData, rowDataChild, details)} />
    //             }
    //         </div>
    //     )
    // }
    // handleAction = (rowData, event)=> {
    //     return (
    //         <div>
    //             {this.state.permission && this.state.permission.edit &&
    //                 <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2" onClick={() => this.handleDisplayEditDialog('true', rowData)} />
    //             }
    //             {this.state.permission && this.state.permission.delete &&
    //                 <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => this.handleDisplayDeleteDialog('true', rowData, event.rowIndex)} />
    //             }
    //         </div>
    //     )
    // }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-7 p-sm-12">
                    <OOLResultDetail
                        // handleActionRow={this.handleActionRow}
                        // rowDataChild={rowData}
                        // //details={this.props.details}
                        // setSelectedRow={this.setSelectedRow}
                        // rowSelection={this.state.rowSelection}
                        // insertDataRow={this.insertDataRow(rowData)}
                        // displayCheckBox={this.displayCheckBox}
                        dataInput={rowData}
                        reCall={this.state.reCallDetail}
                    ></OOLResultDetail>
                    {/* {rowData.shopCode} */}
                </div>
                <div className="p-col-12 p-md-5 p-sm-12">
                    <PhotoGallery
                        {...this}
                        dataInput={rowData}
                        reportId={rowData.reportId}
                        pageId={this.pageId}
                        photoType="VISIBILITY"
                    />
                </div>
                {/* {rowData.result === 1 &&
                    <div className="p-col-12 p-md-12 p-sm-12">
                        <DisplayResultDetail
                            dataInput={rowData}
                            ChangeResultRow={this.ChangeResultRow}
                            index={rowData.key}
                        />
                    </div>} */}
            </div>
        );
    }
    ChangeResultRow = async (result, key) => {
        const state = this.state
        let data = await JSON.parse(JSON.stringify(state.datas))
        let arr = await data.filter((e) => e.key === key)
        if (result === 1) {
            arr[0].resultStatus = 'Đạt'
            await this.setState({ datas: data })
        }
        else {
            arr[0].resultStatus = 'Rớt'
            await this.setState({ datas: data })
        }
    }

    async changeDate(e) {
        let date = ''
        if (e) {
            let year = e.getFullYear().toString()
            let month = ("0" + (e.getMonth() + 1)).slice(-2)
            let day = ("0" + e.getDate()).slice(-2)
            date = year + month + day
        }
        await this.setState({ inputValues: { ...this.state.inputValues, workDate: date } })
    }
    // Edit row
    displayEditRow = (boolean, rowData, rowDataChild, details) => {
        this.setState({ rowData: rowData, details: details, rowDataChild: rowDataChild })
        if (boolean === 'true') {
            this.setState({
                dialogEditRow: true,
                dialogRow: false,
                inputValues: {
                    productIdOld: rowData.productId ? rowData.productId : '',
                    productId: rowData.productId ? rowData.productId : '',
                    displayRow: rowData.display ? rowData.display : '',
                    category: rowData.category ? rowData.category : '',
                    subCategory: rowData.subCategory ? rowData.subCategory : '',
                    productName: rowData.productName ? rowData.productName : '',
                    employeeId: rowDataChild.employeeId ? rowDataChild.employeeId : '',
                    shopId: rowDataChild.shopId ? rowDataChild.shopId : '',
                    workDate: rowDataChild.workDate ? rowDataChild.workDate : '',
                },
                subCateId: rowData.subCatId ? rowData.subCatId : '',
                categoryId: rowData.categoryId ? rowData.categoryId : '',
            })
        } else this.setState({ dialogEditRow: false, inputValues: {}, categoryId: 0, subCateId: 0 })
    }
    renderFooterEditRow = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.edit &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} icon="pi pi-times" className="p-button-info" onClick={() => this.displayEditRow('false')} />
                }
                {this.state.permission && this.state.permission.edit &&
                    <Button style={{ marginRight: '10px' }} label="Update" icon="pi pi-check" className="p-button-success" onClick={() => this.handleUpdateItem()} />
                }
            </div>
        )
    }
    handleUpdateItem = async () => {
        if (await this.handleValidRow()) {
            await this.props.DisplayController.UpdateItemDisplay(
                getAccountId(),
                this.state.inputValues.shopId,
                this.state.inputValues.employeeId,
                this.state.inputValues.workDate,
                this.state.inputValues.productIdOld,
                this.state.inputValues.productId,
                this.state.inputValues.displayRow,
            )
            const result = this.props.updateItemDisplay[0]
            if (result) {
                if (result.alert === '1') {
                    await this.showSuccess('Update item success');
                    if (this.state.details) {
                        let arr = this.state.details.filter((e) => e.rowNum == this.state.rowData.rowNum)
                        arr[0].productName = await result.productName
                        arr[0].productId = await result.productId
                        arr[0].display = await result.display
                        arr[0].productCode = await result.productCode
                        arr[0].category = await result.category
                    }
                    if (this.props.displays) {
                        let arrDisplay = this.props.displays.filter((e) => e.rowNum == this.state.rowDataChild.rowNum)
                        arrDisplay[0].total = await result.total
                    }
                    await this.setState({ dialogEditRow: false, isLoading: false })
                } else await this.showError(result.alert)
            } else await this.showError('Insert Error')
        }

    }
    //Edit
    handleDisplayEditDialog = (boolean, rowData) => {
        this.setState({ rowData: rowData })
        if (boolean === 'true') {
            let date = rowData.workDate.toString()
            let year = date.slice(0, 4)
            let month = date.slice(4, 6)
            let day = date.slice(6, 8)
            let changeDate = year + "-" + month + "-" + day;
            date = new Date(changeDate)

            this.setState({
                displayDialogEdit: true,
                inputValues: {
                    ...this.state.inputValues,
                    employeeId: rowData.employeeId ? rowData.employeeId : '',
                    workDate: rowData.workDate ? rowData.workDate : '',
                    shopIdOld: rowData.shopId ? rowData.shopId : '',
                    shopId: rowData.shopId ? rowData.shopId : '',
                    date: date ? date : '',
                    employeeName: rowData.employeeName ? rowData.employeeName : '',
                    area: rowData.area ? rowData.area : '',
                    dealerName: rowData.dealerName ? rowData.dealerName : '',
                    address: rowData.address ? rowData.address : '',
                }
            })
        } else this.setState({ displayDialogEdit: false, inputValues: {} })
    }
    handleUpdate = async () => {
        await this.setState({ isLoading: true })
        if (!this.state.inputValues.shopId) {
            await this.setState({ inputValues: { ...this.state.inputValues, shopId: this.state.inputValues.shopIdOld } })
        }
        if (this.state.inputValues.date) {
            let workDateNew = ''
            let date = this.state.inputValues.date
            let year = date.getFullYear().toString()
            let month = ("0" + (date.getMonth() + 1)).slice(-2)
            let day = ("0" + date.getDate()).slice(-2)
            workDateNew = year + month + day
            await this.setState({ inputValues: { ...this.state.inputValues, workDateNew: parseInt(workDateNew) } })
        }
        await this.props.DisplayController.UpdateDisplay(
            this.state.inputValues.shopIdOld,
            this.state.inputValues.employeeId,
            this.state.inputValues.workDate,
            this.state.inputValues.shopId,
            this.state.inputValues.workDateNew
        )
        const result = this.props.updateDisplay
        if (result[0]) {
            if (result[0].alert === '1') {
                if (this.props.displays) {
                    let arr = this.props.displays.filter((e) => e.rowNum == this.state.rowData.rowNum)
                    arr[0].shopName = result[0].shopName
                    arr[0].shopId = result[0].shopId
                    arr[0].workDate = result[0].workDate
                    arr[0].address = result[0].address
                    arr[0].dealerName = result[0].dealerName
                    arr[0].total = result[0].total
                }
                await this.showSuccess(result.alert);
                await this.setState({ displayDialogEdit: false, isLoading: false })
            } else await this.showError(result.alert)
        } else {
            await this.showError('Update Error')
            await this.setState({ isLoading: false })
        }
    }
    // insert
    onChange = async (e, value) => {
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                [e]: value === null ? "" : value
            }
        })
        if (this.state.inputValues.reportId) {
            await this.props.DisplayController.PhotoType(
                this.state.inputValues.reportId
            )
        }
    }
    insertDataRow = (rowData) => {
        return (
            <div>
                {this.state.permission && this.state.permission.create &&
                    <Button icon="pi pi-user-edit" style={{ width: '100%', marginRight: '.25em' }}
                        className='p-button-rounded p-button-success '
                        onClick={() => this.displayInsertRow('true', rowData)} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button style={{ width: '100%', marginRight: '.25em', marginTop: '10px' }} icon="pi pi-trash" className=" p-button-rounded p-button-danger"
                        onClick={() => this.state.deleteProductId ? this.handleDisplayDeleteDialogRow('true', rowData) : {}} />
                }
            </div>
        )
    }
    renderFooterInsertRow = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.create &&
                    <Button style={{ marginRight: '10px' }} label={this.props.language["cancel"] || "l_cancel"} icon="pi pi-times" className="p-button-info"
                        onClick={() => this.displayInsertRow('false')} />
                }
                {this.state.permission && this.state.permission.create &&
                    <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-check" className="p-button-success"
                        onClick={() => this.handleInsert('Insert')} />
                }
            </div>
        )
    }
    displayInsertRow = async (boolean, rowData) => {
        if (boolean === 'true') {
            await this.setState({
                rowDataInsert: rowData,
                dialogInsertRow: true,
                dialogRow: true,
                inputValues: {
                    ...this.state.inputValues,
                    employeeId: rowData.employeeId ? rowData.employeeId : '',
                    shopId: rowData.shopId ? rowData.shopId : '',
                    workDateRow: rowData.workDate ? rowData.workDate : '',
                }
            })
        } else this.setState({
            dialogInsertRow: false,
            inputValues: {},
            categoryId: 0,
            subCateId: 0,
            segmentId: 0,
        })
    }
    handleDialogDisplayInsert = (displayDialogInsert, insertType) => {
        if (displayDialogInsert && insertType === 'displayDialogInsertAll') {
            this.setState({
                displayDialogInsert: true,
                inputValues: {
                    ...this.state.inputValues,
                }
            })
        } else this.setState({ displayDialogInsert: false, })
    }
    handleValid = async () => {
        let check = true;
        if (!this.state.inputValues.workDate) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorWorkDate: "Input Required" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorWorkDate: "" } })

        if (!this.state.inputValues.shopId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorShopId: "Input Required" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorShopId: "" } })

        if (!this.state.inputValues.productId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorProductId: "Input Required" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorProductId: "" } })

        if (!this.state.inputValues.employeeId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "Input Required" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorEmployeeId: "" } })

        if (!this.state.inputValues.display) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDisplay: "Input Required" } });
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorDisplay: "" } })
        if (!check) return false
        else return true;
    }
    handleValidRow = async () => {
        let check = true;
        if (!this.state.inputValues.productId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorProductCodeRow: "Input Required" } });
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorProductCodeRow: "" } })
        if (!this.state.inputValues.displayRow) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDisplayRow: "Input Required" } });
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorDisplayRow: "" } })
        if (!check) return false
        else return true;
    }
    handleInsert = async (insertType = '') => {
        await this.changeDate(this.state.inputValues.date)
        if (insertType === 'InsertAll' && await this.handleValid() === true) {
            await this.setState({ inputValues: { ...this.state.inputValues, typeInsert: 0 }, isLoading: true })
            await this.props.DisplayController.InsertDisplay(
                getAccountId,
                this.state.inputValues.shopId,
                this.state.inputValues.employeeId,
                parseInt(this.state.inputValues.workDate),
                this.state.inputValues.productId,
                this.state.inputValues.display,
                this.state.inputValues.typeInsert
            )
            const result = await this.props.insertDisplay[0]
            if (result) {
                if (result.alert === '1') {
                    await this.showSuccess('Insert success');
                    await this.setState({
                        datas: this.props.displays,
                        isLoading: false,
                        inputValues: {}
                    })
                } else await this.showError(result.alert)
            } else await this.showError('Insert Error')
        }
        if (insertType === 'Insert' && await this.handleValidRow() === true) {
            await this.setState({ inputValues: { ...this.state.inputValues, typeInsert: 1 }, isLoading: true })
            await this.props.DisplayController.InsertDisplay(
                getAccountId(),
                this.state.inputValues.shopId,
                this.state.inputValues.employeeId,
                this.state.inputValues.workDateRow,
                this.state.inputValues.productId,
                this.state.inputValues.displayRow,
                this.state.inputValues.typeInsert
            )
            const result = await this.props.insertDisplay
            if (result[0]) {
                if (result[0].alert === '1') {
                    let index = this.props.displays.findIndex((e) =>
                        e.employeeId === this.state.rowDataInsert.employeeId &&
                        e.shopId === this.state.rowDataInsert.shopId &&
                        e.workDate === this.state.rowDataInsert.workDate
                    )
                    // let arr = this.props.displays.filter((e) => e.rowNum == this.state.rowDataInsert.rowNum)
                    this.props.displays[index].total = result[0].total
                    await this.showSuccess('Insert item success');
                    let reCallDetail = this.state.reCallDetail;
                    await reCallDetail++;
                    await this.setState({
                        dialogInsertRow: false,
                        isLoading: false,
                        inputValues: {},
                        categoryId: 0,
                        subCateId: 0,
                        segmentId: 0,
                        reCallDetail: reCallDetail
                    })
                } else await this.showError(result.alert)
            } else {
                await this.setState({ isLoading: false })
                await this.showError('Insert Error')
            }
        }
    }
    // handleChange
    handleChangeForm = (e, stateName = "", subStateName) => {
        this.setState({
            [stateName]: { ...this.state[stateName], [subStateName]: e.target.value == null ? "" : e.target.value }
        });
    }
    handleChangeControl = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            }
        });
    }
    handleChangeDropDown = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            }
        })
    }
    //delete
    renderFooterDeleteAction = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button hidden={this.state.delete} label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDisplayDeleteDialog('false')} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button hidden={this.state.delete} label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleDelete()} />
                }
            </div>
        );
    }
    handleDisplayDeleteDialog = (boolean, rowData, index) => {
        if (boolean === 'true') {
            this.setState({
                delete: true,
                displayDeleteDialog: true,
                deletedata: rowData,
                index: index,
            })
        } else {
            this.setState({
                displayDeleteDialog: false,
                deletedata: [],
            })
        }
    }
    handleDelete = async () => {
        await this.props.DisplayController.DeleteDisplay(
            this.state.deletedata.shopId,
            this.state.deletedata.employeeId,
            this.state.deletedata.workDate,
            this.state.deletedata.listProductId || '',
        )
        const result = await this.props.deleteDisplay
        if (result[0].alert === '1') {
            await this.showSuccess('Delete Successful');
            if (this.props.displays) {
                this.props.displays.splice(this.state.index, 1)
            }
            await this.setState({ displayDeleteDialog: false, isLoading: false })
        } else await this.showError('Delete Failed')
    }
    // delete Row
    setSelectedRow = async (value, rowData) => {
        let deleteRow = value.map((e) => e.productId)
        deleteRow = deleteRow.toString()
        let displayRow = await value.map(e => e.display)
        if (displayRow.length > 0) {
            displayRow = displayRow.reduce((a, b) => { return (a + b) })
        }
        await this.setState({
            rowSelection: value,
            deleteProductId: deleteRow,
            deleteRowLength: deleteRow.length,
            deleteRow: rowData,
            displayRow: displayRow,
        })
    }
    handleDisplayDeleteDialogRow = (boolean, rowData) => {
        if (boolean === 'true') {
            this.setState({
                displayDeleteRow: true,
                delete: false,
                deleteRowData: rowData
            })
        } else {
            this.setState({
                displayDeleteRow: false,
                delete: false,
            })
        }
    }
    handleDeleteRow = async () => {
        if (this.state.deleteRowLength === this.props.details.length) {
            await this.props.DisplayController.DeleteDisplay(
                this.state.deleteRow.shopId,
                this.state.deleteRow.employeeId,
                this.state.deleteRow.workDate,
                null,
            )
            const result = this.props.deleteDisplay.result
            const messenger = this.props.deleteDisplay.messenger
            if (result === 1) {
                await this.showSuccess(messenger);
                if (this.props.displays) {
                    let arr = this.props.display.filter(e => e.rowNum == this.state.deleteRow.rowNum)
                    arr[0].total = this.state.deleteRow.total - this.state.displayRow
                }
                await this.setState({ displayDeleteRow: false, isLoading: false })
            } else await this.showError(messenger)
        } else {
            await this.props.DisplayController.DeleteDisplay(
                this.state.deleteRow.shopId,
                this.state.deleteRow.employeeId,
                this.state.deleteRow.workDate,
                this.state.deleteProductId,
            )
            const result = this.props.deleteDisplay
            const messenger = this.props.deleteDisplay.messenger
            if (result[0].alert == '1') {
                let arr = this.props.displays.filter(e => e.employeeId === this.state.deleteRowData.employeeId)
                arr[0].total = result[0].total
                await this.showSuccess(messenger);
                await this.setState({ displayDeleteRow: false, isLoading: false, expandedRows: true })
            } else await this.showError(messenger)
        }
    }
    renderFooterDeleteActionRow = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDisplayDeleteDialogRow('false')} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleDeleteRow()} />
                }
            </div>
        );
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    shopNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.shopCode}</strong></label> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }
    employeeNameTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.employeeCode}</strong> </label><br></br>
            <label >{rowData.employeeName} ({rowData.position})</label>
        </div>
        );
    }
    render() {
        let result = null;
        // if (this.props.displays.length > 0) {
        result =
            <DataTable
                value={this.state.datas}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 50, 100]}
                style={{ fontSize: "13px", marginTop: '10px' }}
                rowHover
                paginatorPosition={"both"}
                dataKey="rowNum"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => { this.setState({ expandedRows: e.data }) }}
                rowExpansionTemplate={this.rowExpansionTemplate} >
                <Column expander={true} style={{ width: '3em' }} />
                <Column filter field="rowNum" style={{ width: "50px" }} header="No." />
                <Column filter field="provinceName" style={{ width: 120 }} header={this.props.language["province"] || "l_province"} />
                <Column filter field="customerName" style={{ width: 120 }} header={this.props.language["customer_name"] || "l_customer_name"} />
                <Column filter field="accountName" style={{ width: 120 }} header={this.props.language["account"] || "l_account"} />
                <Column filter body={this.shopNameTemplate} header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "220px" }} />
                <Column filter field="address" header={this.props.language["address"] || "address"} />
                <Column filter body={this.employeeNameTemplate} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: 220, textAlign: 'center' }} />
                <Column filter field="workDate" header={this.props.language["date"] || "l_date"} style={{ width: "100px" }} />
                <Column field="total" header={this.props.language["total"] || "l_total"} style={{ width: "80px", textAlign: "right" }} />
                {/* <Column body={this.handleAction} header={this.props.language["tool"] || "l_tool"} style={{ width: "150px", textAlign: "center" }} /> */}
            </DataTable>

        return (
            this.state.permission.view ? (
                <div>
                    {/* <Dialog header="Delete" style={{ width: '30vw' }}
                        visible={this.state.delete ? this.state.displayDeleteDialog : this.state.displayDeleteRow}
                        footer={this.state.delete ? this.renderFooterDeleteAction() : this.renderFooterDeleteActionRow()}
                        onHide={() => this.state.delete ? this.handleDisplayDeleteDialog('false') : this.handleDisplayDeleteDialogRow('false')}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to proceed?</span>
                        </div>
                    </Dialog>
                    <Dialog style={{ width: '50vw' }}
                        header={this.state.dialogRow ? "Insert Row" : 'Update Row'}
                        visible={this.state.dialogRow ? this.state.dialogInsertRow : this.state.dialogEditRow}
                        footer={this.state.dialogRow ? this.renderFooterInsertRow('displayBasic') : this.renderFooterEditRow('displayBasic')}
                        onHide={() => this.state.dialogRow ? this.displayInsertRow('false') : this.displayEditRow('false')}>
                        <div className="p-fluid p-formgrid p-grid" >
                            <CategoryApp
                                {...this}
                                dialog='p-col-6'
                                categoryId={this.state.categoryId}
                                subCateId={this.state.subCateId}
                            />
                            <div className="p-field p-col-12 p-md-6">
                                <label htmlFor="basic">{this.props.language["product_code"] || "l_product_code"}</label>
                                <div >
                                    <ProductDropDownList {...this}
                                        id='productId'
                                        value={this.state.inputValues.productId}
                                        division={this.state.division}
                                        categoryId={this.state.categoryId}
                                        subCateId={this.state.subCateId}
                                        segmentId={this.state.segmentId}
                                    />
                                    <small className="p-invalid p-d-block">{this.state.inputValues.errorProductCodeRow || ""}</small>
                                </div>
                            </div>
                            <div className="p-field p-col-12 p-md-6">
                                <label>{this.props.language["display"] || "l_display"}</label>
                                <div>
                                    <InputNumber id="withoutgrouping" value={this.state.inputValues.displayRow || ''} onValueChange={(e) => this.handleChangeForm(e, 'inputValues', 'displayRow')} mode="decimal" useGrouping={false} />
                                    <small className="p-invalid p-d-block">{this.state.inputValues.errorDisplayRow || ""}</small>
                                </div>
                            </div>
                        </div>
                    </Dialog> */}
                    <div className="p-fluid">
                        <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                        {this.state.permission !== undefined &&
                            <Search
                                pageType="OOL_Target" {...this}
                                permission={this.state.permission}
                            ></Search>}
                        {result}
                    </div>
                    {/* <DisplayDialog
                        stateName={"inputValues"}
                        actionName={"Insert"}
                        dialogStateName={"displayDialogInsertAll"}
                        displayDialog={this.state.displayDialogInsert}
                        inputValues={this.state.inputValues}
                        handleDialog={this.handleDialogDisplayInsert}
                        handleChangeForm={this.handleChangeForm}
                        handleChangeDropDown={this.handleChangeDropDown}
                        handleChangeControl={this.handleChangeControl}
                        handleSideBarAction={this.handleInsert}
                        handleChange={this.handleChange}

                    />
                    <DisplayDialog
                        stateName={"inputValues"}
                        actionName={"Edit"}
                        dialogStateName={"displayDialogEditAll"}
                        displayDialog={this.state.displayDialogEdit}
                        inputValues={this.state.inputValues}
                        handleDialog={this.handleDisplayEditDialog}
                        handleChangeForm={this.handleChangeForm}
                        handleChangeDropDown={this.handleChangeDropDown}
                        handleChangeControl={this.handleChangeControl}
                        handleSideBarAction={this.handleUpdate}
                        handleChange={this.handleChange}
                    /> */}
                </div>) : (this.state.permission.view !== undefined && (
                    <Page403 />
                ))

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        oolResultFilter: state.ool.oolResultFilter,
        oolResultExport: state.ool.oolResultExport,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OOLController: bindActionCreators(actionCreatorsOOL, dispatch),
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OOLResult);