import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { actionCreatorsOOL } from '../../store/OOLController';
import { TabView, TabPanel } from 'primereact/tabview';
class OOLResultDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: [],
            activeIndex: 0,
            tabTable: null,
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.reCall !== this.props.reCall) {
    //         const data = nextProps.dataInput;
    //         this.props.DisplayController.GetDisplayDetail(data)
    //             .then(
    //                 () => {
    //                     this.setState({
    //                         details: this.props.details
    //                     })
    //                 }
    //             )
    //     }
    // }
    async componentDidMount() {
        const data = this.props.dataInput;
        await this.props.OOLController.DetailResult(data)
        let datas = this.props.oolResultDetail
        let map = new Map(), listHeader = [], result = [];
        if (datas && datas.length > 0) {
            datas.forEach(item =>{
                if(listHeader.length > 0){
                    let temp = null
                    temp = listHeader.findIndex(e => e == item.type)
                    if(temp === -1){
                        listHeader.push(item.type)
                    }
                }else{
                    listHeader.push(item.type)
                }
            })
            for (let i = 0; i < listHeader.length; i++) {
                let dataTable = await datas.filter(e => e.type == listHeader[i])
                await result.push(
                    <TabPanel header={listHeader[i]}>
                        <div className="p-fluid" >
                            <DataTable className="p-datatable-striped"
                                scrollable
                                rowGroupMode="subheader"
                                groupField="catInfo"
                                sortMode="single"
                                rowGroupHeaderTemplate={rowData => {
                                    return (
                                        <Button className="p-button-success p-button-outlined btn__hover" label={rowData.catInfo}
                                            style={{ width: 'max-content', float: 'left', cursor: 'auto' }} />
                                    )
                                }}
                                rowGroupFooterTemplate={() => { }}
                                value={dataTable} scrollHeight="400px"
                                style={{ fontSize: "13px", marginTop: "10px" }}
                            // onSelectionChange={(e) => setSelectedRow(e.value, rowDataChild)}
                            // selection={rowSelection}
                            // key={rowDataChild.key}
                            >
                                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                                <Column header="No." field="rowNum" style={{ width: "60px" }} />
                                <Column filter header={this.props.language["location_name"] || "l_location_name"} field="locationName" />
                                <Column filter header={this.props.language["ool_value"] || "l_ool_value"} field="oolValue" />
                                <Column filter header={this.props.language["from_date"] || "l_from_date"} field="fromDate" />
                                <Column filter header={this.props.language["to_date"] || "l_to_date"} field="toDate" />
                                {/* <Column filter header={insertDataRow} body={(rowData) => handleActionRow(rowData, rowDataChild, this.props.details)} style={{ width: '70px' }} /> */}
                            </DataTable>
                        </div>
                    </TabPanel>
                )
            }
            await this.setState({ details: this.props.oolResultDetail, tabTable: result })
        }
    }
    render() {
        const { handleActionRow, insertDataRow, rowDataChild, setSelectedRow, rowSelection } = this.props
        return (
            <div>
                <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    {this.state.tabTable}
                </TabView>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        oolResultDetail: state.ool.oolResultDetail,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OOLController: bindActionCreators(actionCreatorsOOL, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OOLResultDetail);