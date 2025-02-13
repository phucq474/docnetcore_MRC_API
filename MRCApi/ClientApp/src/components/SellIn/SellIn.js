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
import { actionCreatorsSellIn } from '../../store/SellInController';
import SellInDetail from './SellIn-Detail';

class SellIn extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            data: [],
            permission: {},
            accId: null
        }
        this.pageId = 9
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.shopNameTemplate = this.shopNameTemplate.bind(this);
        this.employeeNameTemplate = this.employeeNameTemplate.bind(this);
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

    Import = async (files, fileUpload) => {
        await this.props.SellInController.ImportSI(files, this.state.accId);
        const result = await this.props.importSI;
        if (result && result.status === 1) {
            await this.Alert(result.message, "info");
        } else this.Alert(result.message, "error")
    }

    Search = async (data) => {
        await this.setState({ expandedRows: null, data: [] })
        await this.props.SellInController.FilterSI(data, data.accId);

        const result = await this.props.filterSI;
        if (result && result.status === 200) {
            await this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
            await this.setState({ data: result.data })
        } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")

    }
    Export = async (data) => {
        await this.props.SellInController.ExportSI(data, data.accId)
        const result = this.props.exportSI;
        if (result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    Template = async () => {
        await this.props.SellInController.TemplateSI(this.state.accId)
        const result = this.props.templateSI;
        if (result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-10 p-sm-12">
                    <SellInDetail
                        key={rowData.id}
                        dataInput={rowData}
                        accId={this.state.accId}
                    ></SellInDetail>
                </div>
            </div>
        );
    }
    // handleChange
    handleChangeForm = (e, stateName = "", subStateName) => {
        this.setState({
            [stateName]: { ...this.state[stateName], [subStateName]: e.target.value == null ? "" : e.target.value }
        });
    }
    handleChangeControl = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            }
        });
    }
    handleChangeDropDown = (id, value) => {
        this.setState({
            inputValues: {
                ...this.state.inputValues,
                [id]: value === null ? "" : value
            }
        })
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

    FormatNumber = (number) => {
        return (
            <div>{new Intl.NumberFormat().format(number)}</div>
        )
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
                <Column expander={true} style={{ width: '3%' }} />
                <Column filter field="rowNum" style={{ width: "3%", textAlign: 'center' }} header="No." />
                <Column filter field="system" header={this.props.language["system"] || "l_system"} style={{ width: "8%", textAlign: 'center' }} />
                <Column filter field="channel" header={this.props.language["channel"] || "l_channel"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="shopCode" header={this.props.language["shop_code"] || "l_shop_code"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="shopName" header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "10%" }} />
                <Column filter field="address" header={this.props.language["address"] || "l_address"} style={{ width: "10%" }} />
                <Column filter field="date" header={this.props.language["date"] || "l_date"} style={{ width: "5%", textAlign: 'center' }} />
                <Column body={(rowData) => this.FormatNumber(rowData.amount)} header={(this.props.language["amount"] || "l_amount") + " (VNĐ)"} style={{ width: '5%', textAlign: 'center' }} />
            </DataTable>
        // }
        return (
            this.state.permission.view ? (
                <div className="p-fluid">
                    <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                    {this.state.permission !== undefined &&
                        <Search
                            pageType="sellin"
                            {...this}
                            isVisibleEmployee={false}
                            isVisiblePosition={false}
                            haveTemplate={true}
                            isImport={true}
                            permission={this.state.permission}
                        ></Search>}
                    {result}
                </div>) : (this.state.permission.view !== undefined && (
                    <Page403 />
                ))

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterSI: state.sellin.filterSI,
        exportSI: state.sellin.exportSI,
        templateSI: state.sellin.templateSI,
        importSI: state.sellin.importSI
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SellInController: bindActionCreators(actionCreatorsSellIn, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SellIn);