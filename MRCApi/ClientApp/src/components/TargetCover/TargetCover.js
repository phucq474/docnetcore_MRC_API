import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Toast } from 'primereact/toast';
import { HelpPermission, download } from '../../Utils/Helpler'
import Page403 from '../ErrorRoute/page403';
import { TargetCoverCreateAction } from '../../store/TargetCoverController';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';

class TargetCover extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,
            updateDialog: false,
            data: [],
            permission: {},
        }
        this.pageId = 3069
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
        this.employeeNameTemplate = this.employeeNameTemplate.bind(this);
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
        await this.setState({ expandedRows: null, data: [] })
        await this.props.TargetCoverController.TargetCover_Filter(data);

        const result = await this.props.targetCover_Filter;
        if (result && result.status === 200) {
            await this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
            await this.setState({ data: result.data })
        } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")

    }
    Export = async (data) => {
        await this.props.TargetCoverController.TargetCover_Export(data)
        const result = this.props.targetCover_Export;
        if (result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    Import = async (eFile, fileUpload) => {
        await this.props.TargetCoverController.TargetCover_Import(eFile)
        const result = this.props.targetCover_Import;
        if (result.status === 1) {
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-11 p-sm-12">
                    {/* <NewCustomertDetail
                        key={rowData.id}
                        dataInput={rowData}
                    ></NewCustomertDetail> */}
                </div>
            </div>
        );
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
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    shopNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <strong>{rowData.shopCode}</strong> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }
    employeeNameTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <strong>{rowData.employeeCode}</strong> <br></br>
            <label >{rowData.employeeName} ({rowData.position})</label>
        </div>
        );
    }
    actionButtons = (rowData, event) => {
        return (
            <div>
                {/* {this.state.permission.edit &&
                    // <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                    //     onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />} */}
                {this.state.permission.edit &&
                    <Button icon="pi pi-save" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleUpdateRowDialog(true, rowData, event.rowIndex)} />}
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
        await this.props.TargetCoverController.TargetCover_Delete(id)
        const response = await this.props.targetCover_Delete
        await this.handleDeleteDialog(false,"displayConfirmDialog")
        if(response.status === 200) {
            await this.Alert(response.message, "info")
            let data = this.state.data
            let index = data.findIndex(e=> e.id === id)
            if(index>=0){
                data.splice(index,1)
            }
            await this.setState({data: data})
        } else {
            await this.Alert(response.message,'error')
        }
        await this.setState({isLoading: false})
    }

    //Update
    handleUpdateRowDialog = async (boolean, rowData, index) => {
        if (boolean) {
            await this.setState({
                updateDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    index: index,
                    id: rowData.id,
                    rowData: rowData
                }
            })
        } else {
            this.setState({ 
                updateDialog: false, 
                inputValues: {} 
            })
        }
    }

    templateTarget = (options, colName) => {
        return (
            <div>
                <InputNumber value={options.rowData[`${colName}`]}
                    id={colName}
                    onValueChange={(e) => this.handleChangeTarget(options.rowData, e.target.value, options.rowIndex, colName)} />
            </div>
        )
    }
    handleChangeTarget = (rowData, value, index, colName) => {
        let data = this.state.data
        data[index][`${colName}`] = value;
        this.setState({
            data: data
        })
    }
    footerUpdateRowDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.edit &&
                    <div>
                        <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleUpdateRowDialog(false)} />
                        <Button label={this.props.language["update"] || "l_update"} className="p-button-info" onClick={() => this.handleUpdate()} />
                    </div>}
            </div>
        )
    }
    handleUpdate = async () => {
        await this.setState({ loading: true })

        let rowData = this.state.inputValues.rowData

        let data = {
            id: rowData.id,
            target: rowData.target
        }
        await this.props.TargetCoverController.TargetCover_Update(data)
        const result = this.props.targetCover_Update
        if(result.status === 200){
            await this.Alert(result.message, 'info')
        }else{
            await this.Alert(result.message, 'error')
        }
       
        await this.handleUpdateRowDialog(false)
        await this.setState({ loading: false, inputValues: {} })
    }
    render() {
        let result = null, dialogConfirm = [], dialogUpdate = [];
        if (this.state.updateDialog) {
            dialogUpdate = <Dialog header="Update" style={{ width: '30vw' }}
                visible={this.state.updateDialog}
                footer={this.footerUpdateRowDialog()}
                onHide={() => this.handleUpdateRowDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>bạn có muốn thay đổi?</span>
                </div>
            </Dialog>
        }
        result =
            <DataTable
                value={this.state.data}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 50, 100]}
                style={{ fontSize: "13px", marginTop: 10 }}
                rowHover
                paginatorPosition={"both"}
                dataKey="rowNum"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                <Column filter field="rowNum" style={{ width: "3%", textAlign: 'center' }} header="No." />
                <Column filter field="supCode" header={this.props.language["sup_code"] || "l_sup_code"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="supName" header={this.props.language["sup_name"] || "l_sup_name"} style={{ width: "10%" }} />
                <Column body={this.employeeNameTemplate} header={this.props.language["employee"] || "l_employee"} style={{ width: "10%", textAlign: "center" }} />
                {/* <Column body={this.shopNameTemplate} header={this.props.language["shop"] || "l_shop"} style={{ width: "10%", textAlign: "center" }} /> */}
                {/* <Column filter field="target" header={this.props.language["target"] || "l_target"} style={{ width: "5%", textAlign: 'center' }} /> */}
                <Column field="target" editor={(options) => this.templateTarget(options, "target")} header={this.props.language["target"] || "l_target"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="fromDate" header={this.props.language["from_date"] || "l_from_date"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="toDate" header={this.props.language["to_date"] || "l_to_date"} style={{ width: "5%", textAlign: 'center' }} />
                <Column body={this.actionButtons} header="#" style={{ width: '3%', textAlign: "center" }} ></Column>
            </DataTable>

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
                <div className="p-fluid">
                    <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                    {this.state.permission !== undefined &&
                        <Search
                            pageType="target-cover"
                            {...this}
                            isVisibleChannel={false}
                            isVisibleCustomer={false}
                            isVisibleShopCode={true}
                            isImport={true}
                            permission={this.state.permission}
                        ></Search>}
                    {result}
                    {dialogConfirm}
                    {dialogUpdate}
                </div>) : (this.state.permission.view !== undefined && (
                    <Page403 />
                ))

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        targetCover_Filter: state.targetcover.targetCover_Filter,
        targetCover_Export: state.targetcover.targetCover_Export,
        targetCover_Import: state.targetcover.targetCover_Import,
        targetCover_Delete: state.targetcover.targetCover_Delete,
        targetCover_Update: state.targetcover.targetCover_Update
    }
}
function mapDispatchToProps(dispatch) {
    return {
        TargetCoverController: bindActionCreators(TargetCoverCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TargetCover);