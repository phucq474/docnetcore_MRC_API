import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PhotoGallery from '../Controls/Gallery/PhotoGallery';
import { Toast } from 'primereact/toast';
import { HelpPermission, getAccountId, download } from '../../Utils/Helpler'
import Page403 from '../ErrorRoute/page403';
import { SOSResultActionCreators } from '../../store/SOSResultController.js';
import SOSDetail from './SOSDetail';

class SOSResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            data: [],
            permission: {
                view: true,
                edit: true,
                create: true,
                import: true,
                export: true,
                delete: true,
            },
        }
        this.pageId = 2057
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
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
        await this.props.SOSResultController.GetList(data);

        const result = await this.props.sosResults;
        if (result && result.length > 0) {
            await this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
            await this.setState({ data: result })
        } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")

    }
    Export = async (data) => {
        await this.props.SOSResultController.Export(data)
        const result = this.props.fileExport;
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-7 p-sm-12">
                    <SOSDetail
                        key={rowData.rowNum}
                        dataInput={rowData}
                    ></SOSDetail>
                </div>
                <div className="p-col-12 p-md-5 p-sm-12">
                    <PhotoGallery
                        {...this}
                        dataInput={rowData}
                        photoType={"SOS"}
                        pageId={this.pageId}
                    />
                </div>
            </div>
        );
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    shopNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <strong>{rowData.shopCode}</strong> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }
    employeeNameTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <strong>{rowData.employeeCode}</strong> <br></br>
            <label >{rowData.fullName} ({rowData.position})</label>
        </div>
        );
    }
    showTotal = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <strong >{rowData.percent} %</strong><br />
            <label >({rowData.value}/{rowData.total})</label>
        </div>
        );
    }
    render() {
        let result = null;
        // if (this.props.displays.length > 0) {
        result =
            <DataTable
                value={this.state.data}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 50, 100]}
                style={{ fontSize: "13px", marginTop: 10 }}
                rowHover
                paginatorPosition={"both"}
                dataKey="rowNum"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => { this.setState({ expandedRows: e.data }) }}
                rowExpansionTemplate={this.rowExpansionTemplate} >
                <Column expander={true} style={{ width: '3em' }} />
                <Column filter field="rowNum" style={{ width: "40px" }} header="No." />
                <Column filter field="provinceName" style={{ width: 120 }} header={this.props.language["province"] || "l_province"} />
                <Column filter field="channelName" style={{ width: 100 }} header={this.props.language["channel"] || "l_channel"} />
                <Column filter field="customerName" style={{ width: 140 }} header={this.props.language["customer"] || "l_customer"} />
                <Column filter body={this.shopNameTemplate} header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "260px" }} />
                <Column filter field="address" header={this.props.language["address"] || "address"} />
                <Column filter body={this.employeeNameTemplate} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: 220, textAlign: 'center' }} />
                <Column filter field="workDate" header={this.props.language["date"] || "l_date"} style={{ width: "100px" }} />
                <Column body={this.showTotal} header={this.props.language["total"] || "l_total"} style={{ width: 100 }} />
                {/* <Column body={this.handleAction} header={this.props.language["tool"] || "l_tool"} style={{ width: "150px", textAlign: "center" }} /> */}
            </DataTable>
        // }
        return (
            this.state.permission.view ? (
                <div>

                    <div className="p-fluid">
                        <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                        {this.state.permission !== undefined &&
                            <Search
                                pageType="sos_result" {...this}
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
        sosResults: state.sosResult.sosResults,
        fileExport: state.sosResult.fileExport
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SOSResultController: bindActionCreators(SOSResultActionCreators, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SOSResult);