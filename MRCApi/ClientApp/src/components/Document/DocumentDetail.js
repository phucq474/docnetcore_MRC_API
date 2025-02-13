import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { DocumentCreateAction } from '../../store/DocumentController';
import moment from 'moment';
class DocumentDetail extends PureComponent {
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
            this.props.DocumentController.DetailItem(data)
                .then(
                    () => {
                        this.setState({ details: this.props.detailItem })
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
    async componentDidMount() {
        const data = this.props.dataInput;
        await this.props.DocumentController.DetailItem(data)
        await this.setState({ details: this.props.detailItem })
    }
    render() {
        const { handleActionRow, insertDataRow, rowDataChild, setSelectedRow, rowSelection } = this.props
        return (
            <div className="p-fluid" style={{ height: 550 }}>
                <DataTable className="p-datatable-striped"
                    scrollable
                    value={this.state.details} scrollHeight="400px"
                    onSelectionChange={(e) => setSelectedRow(e.value, rowDataChild)}
                    selection={rowSelection}
                    key={rowDataChild.stt}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column header="No." field="stt" style={{ width: "60px" }} />
                    <Column filter header={this.props.language["document_name"] || "l_document_name"} field="documentName" style={{ width: 200 }} />
                    <Column filter header={this.props.language["file_name"] || "l_file_name"} field="fileName" />
                    <Column filter header={this.props.language["file_type"] || "l_file_type"} field="fileType" style={{ width: 120 }} />
                    <Column header={insertDataRow} style={{ width: '70px' }} body={(rowData) => handleActionRow(rowData)} />
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        detailItem: state.documents.detailItem,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DocumentController: bindActionCreators(DocumentCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentDetail);