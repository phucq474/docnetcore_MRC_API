import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SOSResultActionCreators } from '../../store/SOSResultController';
import { ProgressSpinner } from 'primereact/progressspinner';
class SOSDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }
    rowClass(data) {



        switch (data.rowNum) {
            case 100:
                return { 'row-group-level1': data.rowNum === 100 };
            case 1000:
                return { 'row-group-level2': data.rowNum === 1000 };
            case 10000:
                return { 'row-group-level3': data.rowNum === 10000 };
            default:
                break;
        }

    }
    componentDidMount() {
        const data = this.props.dataInput;
        this.props.SOSResultController.GetDetail({
            shopId: data.shopId,
            employeeId: data.employeeId,
            workDate: data.workDate
        }).then(
            () => {
                this.setState({
                    details: this.props.sosDetail
                })
            }
        )
    }
    render() {
        if (this.state.details.length === 0)
            return (<ProgressSpinner style={{ left: "47%", top: '45%', width: '50px', height: '50px' }} strokeWidth="5" fill="#EEEEEE" animationDuration=".5s" />);
        return (
            <div className="p-fluid" style={{ height: 550 }}>
                <DataTable className="p-datatable-striped"
                    key="id"
                    scrollable
                    rowClassName={this.rowClass}
                    value={this.state.details}
                    scrollHeight="400px"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                >
                    <Column filter header={this.props.language["name"] || "l_name"} field="name" />
                    <Column filter header={this.props.language["actual"] || "l_actual"} field="actual" style={{ width: 100 }} />
                    <Column filter header={this.props.language["total"] || "l_total"} field="total" style={{ width: 120 }} />
                    <Column filter header="%" field="percent" style={{ width: 80, textAlign: 'center' }} />
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        sosDetail: state.sosResult.sosDetail,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SOSResultController: bindActionCreators(SOSResultActionCreators, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SOSDetail);