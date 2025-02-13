import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OSAResultActionCreators } from '../../store/OSAResultController';

class OSAResultDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }

    componentDidMount() {
        const data = this.props.dataInput;
        this.props.OSAResultController.GetDetail({
            customerId: data.customerId,
            shopId: data.shopId,
            employeeId: data.employeeId,
            workDate: data.workDate
        }).then(
            () => {
                this.setState({
                    details: this.props.osaDetail
                })
            }
        )
    }

    osaTemplate = (rowData) => {
        return (<Checkbox checked={rowData.osa ? true : false} />)
    }
    render() {
        if (this.state.details.length === 0)
            return (<ProgressSpinner style={{ left: "47%", top: '45%', width: '50px', height: '50px' }} strokeWidth="5" fill="#EEEEEE" animationDuration=".5s" />);


        return (
            <div className="p-fluid" style={{ height: 550 }}>
                <DataTable className="p-datatable-striped"
                    scrollable
                    rowGroupMode="subheader"
                    groupField="brand"
                    sortMode="single"
                    sortField="brand"
                    rowGroupHeaderTemplate={rowData => {
                        return (
                            <Button className="p-button-success p-button-outlined btn__hover" label={rowData.brand}
                                style={{ width: 'max-content', float: 'left', cursor: 'auto' }} />
                        )
                    }}
                    rowGroupFooterTemplate={() => { }}
                    value={this.state.details} scrollHeight="400px"
                    style={{ fontSize: "12pt", marginTop: "10px" }}
                >
                    <Column header="No." field="rowNum" style={{ width: "5%" }} />
                    <Column filterMatchMode="contains" filter header={this.props.language["category"] || "l_category"} field="category" style={{ width: '20%' }} />
                    <Column filterMatchMode="contains" filter header={this.props.language["product_code"] || "l_product_code"} field="productCode" style={{ width: '20%' }} />
                    <Column filterMatchMode="contains" filter header={this.props.language["product_name"] || "l_product_name"} field="productName" />
                    <Column filter body={this.osaTemplate} header="OSA" field="osa" style={{ width: '5%', textAlign: 'center' }} />
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        osaDetail: state.osaResult.osaDetail
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OSAResultController: bindActionCreators(OSAResultActionCreators, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OSAResultDetail);