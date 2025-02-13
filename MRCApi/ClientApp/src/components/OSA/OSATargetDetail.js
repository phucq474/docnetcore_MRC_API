import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OSATargetActionCreators } from '../../store/OSATargetController';
import { Button } from 'primereact/button';
import { getLogin } from '../../Utils/Helpler';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

class OSATargetDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: [],
            displayConfirmDialog: false,
        }
    }

    componentDidMount() {
        const data = this.props.dataInput;
        this.props.OSATargetController.GetDetail({
            customerId: data.customerId,
            shopId: data.shopId,
            fromDate: data.fromDate,
            toDate: data.toDate
        })
            .then(
                () => {
                    this.setState({
                        details: this.props.osaTargetDetail
                    })
                }
            )
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleDeleteDialog = (boolean, stateName, rowData) => {
        if (this.state.selectedRowData && this.state.selectedRowData.length > 0) {
            if (boolean) {
                this.setState({
                    [stateName]: true,
                })
            } else {
                this.setState({
                    [stateName]: false,
                })
            }
        } else {
            this.toast.show({ severity: 'warn', summary: 'Thông báo', detail: 'Chưa chọn dữ liệu để Delete', life: 5000 });
        }
    }
    HandleChangeSelectedRow = (value,e) =>{
        this.setState({selectedRowData : null})
        this.setState({selectedRowData : value})

    }
    renderFooterAction = (actionName, cancel, proceed) => {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    handleDelete = async () => {
        await this.setState({ loading: true })
        let dataDelete = await this.state.selectedRowData

        let listId = ""
        if (dataDelete && dataDelete.length > 0) {
            await dataDelete.forEach(e => {
                listId = listId + e.id + ","
            })
        }
        
        let datas = this.state.details
        if (dataDelete && dataDelete.length > 0) {
            await dataDelete.forEach(p => {
                let index = datas.findIndex(e => e.id === p.id)
                if (index > -1) {
                    datas.splice(index, 1)
                }
            })
        }

        await this.props.OSATargetController.Delete(listId)
        const response = await this.props.osaTargetDelete
        await this.handleDeleteDialog(false, "displayConfirmDialog")
        if (response.status === 200) {
            await this.Alert(response.message, "info")
            let datas = this.state.details
            if (dataDelete && dataDelete.length > 0) {
                await dataDelete.forEach(p => {
                    let index = datas.findIndex(e => e.id === p.id)
                    if (index > -1) {
                        datas.splice(index, 1)
                    }
                })
            }
            await this.setState({ details: datas, selectedRowData: [] })
            await this.props.ActionRefreshData(this.props.dataInput.rowNum, this.state.details.length)
        } else {
            await this.Alert(response.message, 'error')
        }
        await this.setState({ loading: false })
    }
    render() {
        let dialogConfirm = null;
        if (this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            dialogConfirm = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{ width: '350px' }}
                footer={this.renderFooterAction("Delete", () => this.handleDeleteDialog(false, "displayConfirmDialog"), this.handleDelete)}
                onHide={() => this.handleDeleteDialog(false, "displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>{this.props.language["are_you_sure_to_delete_these_row"] || "l_are_you_sure_to_delete_these_row"}?</span>
                </div>
            </Dialog>
        }
        return (
            <div className="p-fluid" >
                <Toast ref={(el) => this.toast = el} />
                <DataTable className="p-datatable-striped"
                    scrollable
                    value={this.state.details} scrollHeight="400px"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    dataKey="rowNum"
                    selection={this.state.selectedRowData}
                    onSelectionChange={e => this.HandleChangeSelectedRow(e.value,e)}
                    responsive filterDisplay="row"
                    ref={(el) => { this.dt = el; }}
                >
                    <Column header="No." field="rowNum" style={{ width: "5%" }} />
                    <Column filter filterMatchMode="contains" header={this.props.language["division"] || "l_division"} field="division" style={{ width: '10%', textAlign: 'center' }} />
                    <Column filter filterMatchMode="contains" header={this.props.language["brand"] || "l_brand"} field="brand" style={{ width: '10%', textAlign: 'center' }} />
                    <Column filter filterMatchMode="contains" header={this.props.language["category"] || "l_category"} field="category" style={{ width: '10%', textAlign: 'center' }} />
                    <Column filter filterMatchMode="contains" header={this.props.language["product_code"] || "l_product_code"} field="productCode" style={{ width: '10%', textAlign: 'center' }} />
                    <Column filter filterMatchMode="contains" body={this.showProduct} header={this.props.language["product_name"] || "l_product_name"} field="productName" style={{ width: '20%', textAlign: 'center' }}/>
                    {getLogin().accountName === "Fonterra" && 
                        <Column selectionMode="multiple" headerStyle={{ width: '3%', textAlign: 'center' }} style={{ textAlign: 'center' }}
                            header={this.props.permission && this.props.permission.create && (
                                <span className="p-buttonset">
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2 btn__hover"
                                        onClick={() => this.handleDeleteDialog(true, "displayConfirmDialog")} />
                                </span>
                            )}
                        />
                    }
                </DataTable>
                {dialogConfirm}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        osaTargetDetail: state.osaTarget.osaTargetDetail,
        osaTargetDelete: state.osaTarget.osaTargetDelete
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OSATargetController: bindActionCreators(OSATargetActionCreators, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OSATargetDetail);