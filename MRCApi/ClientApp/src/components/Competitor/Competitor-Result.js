import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PhotoGallery from '../Controls/Gallery/PhotoGallery';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { HelpPermission, download } from '../../Utils/Helpler'
import Page403 from '../ErrorRoute/page403';
import { ProductCreateAction } from '../../store/ProductController';
import { CompetitorCreateAction } from '../../store/CompetitorController';
import CompetitorResultDetail from './Competitor-Result-Detail';

class CompetitorResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            datas: [],
            permission: {},

            editImageDisplaySidebar: false,
            updateImageDisplay: false,
            insertImageDisplay: false,

            inputValues: {},
            bindDataDetails: false,
            productId: 0,
            division: "",
            categoryId: 0,
            subCateId: 0,
            segmentId: 0,

            isLoading: false,
            dialogRow: false,
            details: [],
            rowSelection: null,
            imageDisplay: false,
            delete: false,
            reCallDetail: 0
        }
        this.pageId = 2055
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    Search = async (data) => {
        await this.setState({ expandedRows: null, isLoading: true, datas: [] })
        await this.props.CompetitorController.FilterResult(data).then(() => {
            const result = this.props.competitorResultFilter
            if (result && result.length > 0) {
                this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
                this.setState({ datas: result })
            } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")
            this.setState({ isLoading: false })
        });
    }
    Export = async (data) => {
        await this.props.CompetitorController.ExportResult(data)
        const result = this.props.competitorResultExport
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-7 p-sm-12">
                    <CompetitorResultDetail
                        dataInput={rowData}
                        reCall={this.state.reCallDetail}
                    ></CompetitorResultDetail>
                </div>
                <div className="p-col-12 p-md-5 p-sm-12">
                    <PhotoGallery
                        {...this}
                        dataInput={rowData}
                        reportId={rowData.reportId}
                        pageId={this.pageId}
                        photoType="COMPETITOR"
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
            <label ><strong>{rowData.shopCode}</strong></label> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }
    employeeNameTemplate = (rowData) => {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.employeeCode}</strong> </label><br></br>
            <label >{rowData.employeeName} ({rowData.position})</label>
        </div>
        );
    }
    render() {
        let result = null;
        result =
            <DataTable
                value={this.state.datas}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 50, 100]}
                style={{ fontSize: "13px", marginTop: '10px' }}
                rowHover
                paginatorPosition={"both"}
                dataKey="rowNum"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => { this.setState({ expandedRows: e.data }) }}
                rowExpansionTemplate={this.rowExpansionTemplate} >
                <Column expander={true} style={{ width: '3em' }} />
                <Column filter field="rowNum" style={{ width: "50px" }} header="No." />
                <Column filter field="provinceName" style={{ width: 120 }} header={this.props.language["province"] || "l_province"} />
                <Column filter field="customerName" style={{ width: 120 }} header={this.props.language["system"] || "l_system"} />
                <Column filter field="accountName" style={{ width: 120 }} header={this.props.language["account"] || "l_account"} />
                <Column filter field="provinceName" style={{ width: 100 }} header={this.props.language["province"] || "l_province"} />
                <Column filter body={this.shopNameTemplate} header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "220px" }} />
                <Column filter field="address" header={this.props.language["address"] || "address"} />
                <Column filter body={this.employeeNameTemplate} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: 220, textAlign: 'center' }} />
                <Column filter field="workDate" header={this.props.language["date"] || "l_date"} style={{ width: "100px" }} />
                {/* <Column field="total" header={this.props.language["total"] || "l_total"} style={{ width: "80px", textAlign: "right" }} /> */}
            </DataTable>
        return (
            this.state.permission.view ? (
                <div>
                    <div className="p-fluid">
                        <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                        {this.state.permission !== undefined &&
                            <Search
                                pageType="competitor-result" {...this}
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
        competitorResultFilter: state.competitor.competitorResultFilter,
        competitorResultExport: state.competitor.competitorResultExport
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
        CompetitorController: bindActionCreators(CompetitorCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompetitorResult);