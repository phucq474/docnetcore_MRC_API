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
import { CustomerCreateAction } from '../../store/CustomerController';
import NewCustomertDetail from './new-customer-detail.js';

class NewCustomer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            data: [],
            permission: {},
        }
        this.pageId = 3065
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
    Search = async (data) => {
        await this.setState({ expandedRows: null, data: [] })
        await this.props.CustomerController.NewCustomer_Filter(data);

        const result = await this.props.newCustomer_Filter;
        if (result && result.status === 200) {
            await this.Alert(`${this.props.language["success"] || "l_success"}`, "info");
            await this.setState({ data: result.data })
        } else this.Alert(`${this.props.language["no_data"] || "l_no_data"}`, "error")

    }
    Export = async (data) => {
        await this.props.CustomerController.NewCustomer_Export(data)
        const result = this.props.newCustomer_Export;
        if (result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    rowExpansionTemplate(rowData) {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-11 p-sm-12">
                    <NewCustomertDetail
                        key={rowData.id}
                        dataInput={rowData}
                    ></NewCustomertDetail>
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
                <Column filter field="supCode" header={this.props.language["sup_code"] || "l_sup_code"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="supName" header={this.props.language["sup_name"] || "l_sup_name"} style={{ width: "10%" }} />
                <Column filter field="employeeCode" header={this.props.language["employee_code"] || "l_employee_code"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="fullName" header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: "10%" }} />
                <Column filter field="position" header={this.props.language["position"] || "l_position"} style={{ width: "5%", textAlign: 'center' }} />
                <Column filter field="reportDate" header={this.props.language["date"] || "l_date"} style={{ width: "5%", textAlign: 'center'  }} />
                <Column field='total' header={this.props.language["total"] || "l_total"} style={{ width: '5%', textAlign: 'center' }} />
            </DataTable>
        // }
        return (
            this.state.permission.view ? (
                <div className="p-fluid">
                    <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                    {this.state.permission !== undefined &&
                        <Search
                            pageType="new-customer"
                            {...this}
                            isVisibleChannel={false}
                            isVisibleCustomer={false}
                            isVisibleShopCode={true}
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
        newCustomer_Filter: state.customer.newCustomer_Filter,
        newCustomer_Export: state.customer.newCustomer_Export

    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewCustomer);