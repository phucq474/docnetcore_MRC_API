import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { actionCreatorsSellIn } from '../../store/SellInController';

class SellInDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }
    FormatNumber = (number) => {
        return (
            <div>{new Intl.NumberFormat().format(number)}</div>
        )
    }
    async componentDidMount() {
        await this.setState({
            loading: true,
            details: []
        })
        const data = this.props.dataInput;
        await this.props.SellInController.DetailSI(data.id, this.props.accId)
        const result = await this.props.detailSI
        if (result.status === 200) {
            await this.setState({
                details: result.data
            })
        } else {
            await this.setState({
                details: []
            })
        }
        await this.setState({
            loading: false
        })
    }
    render() {
        return (
            <div className="p-fluid" style={{ height: "80%" }}>
                {this.state.loading && <ProgressSpinner style={{ left: "47%", top: '45%', width: '50px', height: '50px' }} strokeWidth="5" fill="#EEEEEE" animationDuration=".5s" />}
                {this.state.details.length > 0 &&
                    <DataTable className="p-datatable-striped"
                        scrollable
                        value={this.state.details} scrollHeight="400px"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                    >
                        <Column header="No." field="rowNum" style={{ width: "3%", textAlign: 'center' }} />
                        <Column filter field="division" header={this.props.language["division"] || "l_division"} style={{ width: "5%", textAlign: 'center' }} />
                        <Column filter field="brand" header={this.props.language["brand"] || "l_brand"} style={{ width: "5%", textAlign: 'center' }} />
                        <Column filter field="category" header={this.props.language["category"] || "l_category"} style={{ width: "5%", textAlign: 'center' }} />
                        <Column filter field="productCode" header={this.props.language["productCode"] || "l_productCode"} style={{ width: "5%", textAlign: 'center' }} />
                        <Column filter field="productName" header={this.props.language["productName"] || "l_productName"} style={{ width: "15%" }} />
                        <Column filter field="quantity" header={this.props.language["quantity"] || "l_quantity"} style={{ width: "5%", textAlign: 'center' }} />
                        <Column body={(rowData) => this.FormatNumber(rowData.price)} header={this.props.language["price"] || "l_price"} style={{ width: "5%", textAlign: 'center' }} />
                    </DataTable>
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        detailSI: state.sellin.detailSI
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SellInController: bindActionCreators(actionCreatorsSellIn, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SellInDetail);