import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { HelpPermission, getAccountId, download } from '../../Utils/Helpler'
import { ProgressBar } from 'primereact/progressbar';
import Page403 from '../ErrorRoute/page403';
import { actionCreatorsQC } from '../../store/QCController.js';
import QCDetail from './qc-detail.js';

class QC extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,
            dataResult: null,
            details: null,
            permission: {}
        }
        this.pageId = 3064;// 3162
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleChange = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            },
            [id]: value === null ? "" : value
        });
    }
    Search = async (data) => {
        await this.setState({ expandedRows: null })
        await this.props.QCController.GetDynamic(data)
            .then(() => {
                const result = this.props.qcLists
                if (result && result.length > 0) {
                    this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
                    this.setState({ dataResult: result })
                } else {
                    this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error");
                    this.setState({ dataResult: null })
                }
            });
    }
    Export = async (data) => {
        await this.props.QCController.ExportRawdata(data)
            .then(() => {
                const result = this.props.qcRawdata
                if (result && result.status === 1) {
                    download(result.fileUrl)
                    this.Alert(result.message, "info")
                }
                else
                    this.Alert(result.message, "error");
                this.setState({ isLoading: false })
            })

    }
    rowExpansionTemplate(rowData) {
        return (<QCDetail key={rowData.rowNum} pageId={this.pageId} dataInput={rowData}></QCDetail>);
    }
    shopNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.shopCode}</strong></label> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }
    customerTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label >{rowData.customerName}</label> <br></br>
            <label >{rowData.accountName} </label>
        </div>
        );
    }
    employeeNameTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.employeeCode}</strong> </label><br></br>
            <label >{rowData.employeeName} </label>
        </div>
        );
    }
    qcStatusTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <strong>{rowData.qcStatus}</strong><br></br>
            {rowData.qcStatus === 'Progressing' ? <label> {rowData.noKPI}/{rowData.totalKPI}</label> : null}
        </div>
        );
    }
    render() {
        let result = null;
        result =
            <DataTable
                value={this.state.dataResult}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 50, 100]}
                style={{ fontSize: "13px", marginTop: '10px' }}
                paginatorPosition={"both"}
                dataKey="rowNum"
                rowHover
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => {
                    this.setState({ expandedRows: e.data })
                }}
                rowExpansionTemplate={this.rowExpansionTemplate} >
                <Column expander={true} style={{ width: '3em' }} />
                <Column filter field="rowNum" style={{ width: "50px" }} header="No." />
                <Column filter field="provinceName" style={{ width: 120 }} header={this.props.language["province"] || "l_province"} />
                <Column filter field="channelName" style={{ width: 100 }} header={this.props.language["channel"] || "l_channel"} />
                <Column filter body={this.customerTemplate} field="customerName" style={{ width: 120 }} header={this.props.language["customer_name"] || "l_customer_name"} />
                <Column filter body={this.shopNameTemplate} header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "240px" }} />
                <Column filter field="address" header={this.props.language["address"] || "address"} />
                <Column filter body={this.employeeNameTemplate} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "220px" }} />
                <Column filter field="workDate" header={this.props.language["date"] || "l_date"} style={{ width: "100px" }} />
                <Column filter body={this.qcStatusTemplate} style={{ width: 120 }} header={this.props.language["qc_status"] || "l_qc_status"} />
            </DataTable>

        return (
            this.state.permission.view ? (
                <div>
                    <div className="p-fluid">
                        <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                        {this.state.permission !== undefined &&
                            <Search
                                isVisibleQCStatus={true}
                                isVisibleKPIQC={true}
                                pageType="qc"
                                {...this}
                                permission={this.state.permission}
                            ></Search>}
                        {result}
                    </div>
                </div>) : (this.state.permission.view !== undefined && (
                    <Page403 />
                ))

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        qcLists: state.qc.qcLists,
        qcDetails: state.qc.qcDetails,
        qcRawdata: state.qc.qcRawdata
    }
}
function mapDispatchToProps(dispatch) {
    return {
        QCController: bindActionCreators(actionCreatorsQC, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QC);