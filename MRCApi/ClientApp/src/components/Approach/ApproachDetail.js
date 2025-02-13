import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actionCreatorsApproach } from '../../store/ApproachController.js';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class ApproachDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.reCall !== this.props.reCall) {
            const data = nextProps.dataInput.approachId;
            await this.props.ApproachController.GetDetail(data)
                .then(
                    () => {
                        this.setState({
                            details: this.props.getDetail.data
                        })
                    }
                )
        }
    }
    async componentDidMount() {
        const data = this.props.dataInput.approachId;
        await this.props.ApproachController.GetDetail(data)
            .then(
                () => {
                    this.setState({
                        details: this.props.getDetail.data
                    })
                }
            )
    }
    render() {
        const { handleActionRow, insertDataRow, rowDataChild, setSelectedRow, rowSelection } = this.props
        console.log("this.state.details", this.state.details)
        return (
            <div className="p-fluid" style={{}}>
                <DataTable
                    value={this.state.details} resizableColumns columnResizeMode="expand"
                    paginatorPosition={"both"}
                    dataKey="rn"
                    rowHover>
                    <Column filterMatchMode='contains' filter field="rn" header="No." style={{ width: '2%', textAlign: 'center' }} />
                    <Column filterMatchMode='contains' filter field="itemName" header={this.props.language["item_name"] || "l_item_name"} style={{ width: '10%' }} />
                    <Column filterMatchMode='contains' filter field="itemValue" header={this.props.language["item_value"] || "l_item_value"} style={{ width: '2%', textAlign: 'center' }} />
                </DataTable>

            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        getDetail: state.approach.getDetail,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ApproachController: bindActionCreators(actionCreatorsApproach, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ApproachDetail);