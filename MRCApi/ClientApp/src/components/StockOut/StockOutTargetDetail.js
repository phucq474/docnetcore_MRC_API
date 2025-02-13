import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { actionCreatorStockOut } from '../../store/StockOutController';
import moment from 'moment';
class StockOutTargetDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reCall !== this.props.reCall) {
            const data = nextProps.dataInput;
            this.props.StockOutController.DetailStockOutTarget(data)
                .then(
                    () => {
                        this.setState({
                            details: this.props.detailStockOutTarget
                        })
                    }
                )
        }
    }
    showProduct = (rowData) => {
        return (<div >
            <div>
                <label>{rowData.productName}</label>
            </div>
            {(rowData.mhtt || rowData.sptt) &&
                <div>
                    {rowData.mhtt ? <label style={{ color: "#3399FF" }} >{`MHTT : ${moment(rowData.fromDate).format('YYYY-MM-DD')} - ${moment(rowData.toDate).format('YYYY-MM-DD')}`}</label> : null}
                    <br />
                    {rowData.sptt ? <label style={{ color: "#3399FF" }} >{`SPTT : ${moment(rowData.fromDate).format('YYYY-MM-DD')} - ${moment(rowData.toDate).format('YYYY-MM-DD')}`} </label> : null}
                </div>}
        </div>
        );
    }
    componentDidMount() {
        const data = this.props.dataInput;
        this.props.StockOutController.DetailStockOutTarget(data)
            .then(
                () => {
                    this.setState({
                        details: this.props.detailStockOutTarget
                    })
                }
            )
    }
    render() {
        const { handleActionRow, insertDataRow, rowDataChild, setSelectedRow, rowSelection } = this.props
        return (
            <div className="p-fluid" style={{ height: 550 }}>
                <DataTable className="p-datatable-striped"
                    scrollable
                    rowGroupMode="subheader"
                    groupField="brandVN"
                    sortMode="single"
                    sortField="brandVN"
                    rowGroupHeaderTemplate={rowData => {
                        return (
                            <Button className="p-button-success p-button-outlined btn__hover" label={rowData.brandVN}
                                style={{ width: 'max-content', float: 'left', cursor: 'auto' }} />
                        )
                    }}
                    rowGroupFooterTemplate={() => { }}
                    value={this.state.details} scrollHeight="400px"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    onSelectionChange={(e) => setSelectedRow(e.value, rowDataChild)}
                    selection={rowSelection}
                // key={rowDataChild.stt}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column header="No." field="stt" style={{ width: "60px" }} />
                    {/* <Column filter header={this.props.language["brand"] || "l_brand"} field="brand" style={{ width: 200 }} /> */}
                    {/* <Column filter header={this.props.language["category"] || "l_category"} field="category" style={{ width: 120 }} /> */}
                    <Column filter header={this.props.language["product_code"] || "l_product_code"} field="productCode" style={{ width: 120 }} />
                    <Column filter body={this.showProduct} header={this.props.language["produc_name"] || "l_product_name"} field="productName" />
                    <Column header={insertDataRow} style={{ width: '70px' }} />
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        detailStockOutTarget: state.stockout.detailStockOutTarget,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        StockOutController: bindActionCreators(actionCreatorStockOut, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StockOutTargetDetail);