import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { DocumentCreateAction } from '../../store/DocumentController';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
class DocumentUserDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.reCall !== this.props.reCall) {
            const data = this.props.dataInput;
            const date = this.props.date
            const dataSend = {
                employeeId: data.employeeId,
                fromDate: date ? +moment(date[0]).format('YYYYMMDD') : null,
                toDate: date && date[1] ? +moment(date[1]).format('YYYYMMDD') : null,
                fromdate: date ? moment(date[0]).format('YYYY-MM-DD') : null,
                todate: date && date[1] ? moment(date[1]).format('YYYY-MM-DD') : null,
            }
            await this.props.DocumentController.DetailDocumentUser(dataSend)
            await this.setState({ details: this.props.detailDocumentUser })
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
    showCalendar = (rowData, id) => {
        return (
            <Calendar fluid
                value={new Date(rowData[id])}
                baseZIndex={2000}
                // onChange={e => handleChangeForm(e.target.value, stateName, 'activeDate')}
                dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                inputStyle={{ width: '91.5%', visible: false }}
                style={{ width: '100%' }} showIcon
            />
        )
    }
    async componentDidMount() {
        const data = this.props.dataInput;
        const date = this.props.date
        const dataSend = {
            employeeId: data.employeeId,
            fromDate: date ? +moment(date[0]).format('YYYYMMDD') : null,
            toDate: date && date[1] ? +moment(date[1]).format('YYYYMMDD') : null,
            fromdate: date ? moment(date[0]).format('YYYY-MM-DD') : null,
            todate: date && date[1] ? moment(date[1]).format('YYYY-MM-DD') : null,
        }
        await this.props.DocumentController.DetailDocumentUser(dataSend)
        await this.setState({ details: this.props.detailDocumentUser })
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
                    <Column filter header={this.props.language["document_name"] || "l_document_name"} field="documentName" style={{ width: 300 }} />
                    <Column filter header={this.props.language["file_name"] || "l_file_name"} field="fileName" />
                    <Column filter header={this.props.language["file_type"] || "l_file_type"} field="fileType" style={{ width: 120 }} />
                    <Column filter header={this.props.language["from_date"] || "l_from_date"} field="fromDate" style={{ width: 150, textAlign: "center" }} />
                    <Column filter header={this.props.language["to_date"] || "l_to_date"} field="toDate" style={{ width: 150, textAlign: "center" }} />
                    <Column header={insertDataRow} style={{ width: 60 }} body={(rowData) => handleActionRow(rowData)} />
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        detailDocumentUser: state.documents.detailDocumentUser,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DocumentController: bindActionCreators(DocumentCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentUserDetail);