import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CompetitorCreateAction } from '../../store/CompetitorController';
import { TabView, TabPanel } from 'primereact/tabview';
class CompetitorResultDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: [],
            activeIndex: 0,
            tabTable: null,
        }
    }
    priceTemplate = (rowData) =>{
        let temp = null
        if(rowData.price){
            temp =  <div style={{ textAlign: "center" }}>
                        <label >{new Intl.NumberFormat().format(rowData.price)}</label>
                    </div>
        }
        return temp
    }

    promotionPriceTemplate = (rowData) =>{
        let temp = null
        if(rowData.promotionPrice){
            temp =  <div style={{ textAlign: "center" }}>
                        <label >{new Intl.NumberFormat().format(rowData.promotionPrice)}</label>
                    </div>
        }
        return temp
    }

    async componentDidMount() {
        const data = this.props.dataInput;
        await this.props.CompetitorController.DetailResult(data)
        let datas = this.props.competitorResultDetail
        let result = []
        await result.push(
            <div className="p-fluid" >
                <DataTable className="p-datatable-striped"
                    scrollable
                    rowGroupMode="subheader"
                    groupField="catInfo"
                    sortMode="single"
                    rowGroupHeaderTemplate={rowData => {}}
                    rowGroupFooterTemplate={() => { }}
                    value={datas} scrollHeight="400px"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                >
                    <Column header="No." field="rowNum" style={{ width: "60px" }} />
                    <Column filter header={this.props.language["competitor"] || "l_competitor"} field="competitor" />
                    <Column filter header={this.props.language["Category"] || "l_Category"} field="category" />
                    <Column filter header={this.props.language["subcate"] || "l_subcate"} field="subcate" />
                    <Column filter header={this.props.language["mechanics"] || "l_mechanics"} field="mechanics" />
                    <Column filter body={this.priceTemplate} header={this.props.language["price"] || "l_price"} />
                    <Column filter body={this.promotionPriceTemplate} header={this.props.language["promotion_price"] || "l_promotion_price"} field="promotionPrice" />
                    <Column filter header={this.props.language["from_date"] || "l_from_date"} field="fromDate" />
                    <Column filter header={this.props.language["to_date"] || "l_to_date"} field="toDate" />
                </DataTable>
            </div>   
        )  
        await this.setState({ details: this.props.competitorResultDetail, tabTable: result })
    }
    
    render() {
        const { handleActionRow, insertDataRow, rowDataChild, setSelectedRow, rowSelection } = this.props
        return (
            <div>
                {this.state.tabTable}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        competitorResultDetail: state.competitor.competitorResultDetail
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CompetitorController: bindActionCreators(CompetitorCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompetitorResultDetail);