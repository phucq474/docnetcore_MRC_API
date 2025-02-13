import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { HelpPermission, download } from '../../Utils/Helpler'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { Toast } from 'primereact/toast';
import { actionCreatorsApproach } from '../../store/ApproachController.js';
import ApproachDetail from './ApproachDetail.js';
class ApproachForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            searchValues: {},
            expandedRows: {},
            details: {},
            isLoading: false,
            permission: {},
        }
        this.pageId = 3063
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Search = async (data) => {
        this.setState({ isLoading: true, data: [], expandedRows: {} })
        await this.props.ApproachController.Filter(data);
        const result = await this.props.filter;
        if (result?.status === 200) {
            this.Alert(result?.message, "success")
            this.setState({
                data: result.data,
            })
        }
        else {
            this.Alert(result?.message, "error")
        }
        this.setState({
            isLoading: false,
        })
    }
    Export = async (data) => {
        await this.props.ApproachController.Exports(data)
        const result = this.props.fileExport;
        if (result && result.status === 200) {
            await download(result.fileUrl)
            await this.Alert(result.message, "info")
        } else await this.Alert(result.message, "error")
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    rowExpansionTemplate = (rowData) => {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-12 p-sm-12">
                    <ApproachDetail
                        rowDataChild={rowData}
                        dataInput={rowData}
                        reCall={this.state.reCallDetail}
                    ></ApproachDetail>
                </div>
            </div>
        )
    }

    shopNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.shopCode}</strong></label> <br></br>
            <label >{rowData.shopName} </label>
        </div>
        );
    }

    employeeNameTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.employeeCode}</strong> </label><br></br>
            <label >{rowData.employeeName}</label><br></br>
            <label >({rowData.position})</label>
        </div>
        );
    }

    managerTemplate(rowData) {
        return (<div style={{ textAlign: "center" }}>
            <label ><strong>{rowData.managerCode}</strong> </label><br></br>
            <label >{rowData.managerName}</label><br></br>
        </div>
        );
    }

    render() {
        return (
            <div>
                <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                {this.state.permission !== undefined &&
                    <Search
                        pageType="approach" {...this}
                        permission={this.state.permission}
                    ></Search>}
                <DataTable
                    value={this.state.data} resizableColumns columnResizeMode="expand"
                    paginatorPosition={"both"} paginator rows={20}
                    dataKey="rowNum"
                    expandedRows={this.state.expandedRows}
                    onRowToggle={(e) => {
                        this.setState({ expandedRows: e.data })
                    }}
                    rowExpansionTemplate={this.rowExpansionTemplate}
                    onRowExpand={this.onRowExpand}
                    rowHover>
                    <Column expander={true} style={{ width: '5%', textAlign: 'center', }} />
                    <Column filterMatchMode='contains' filter field="rowNum" header="No." style={{ width: '5%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="areaName" header={this.props.language["area"] || "l_area"} style={{ width: '5%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="provinceName" header={this.props.language["province"] || "l_province"} style={{ width: '10%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="customerName" header={this.props.language["customer"] || "l_customer"} style={{ width: '10%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="shopName" body={this.shopNameTemplate} header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: '15%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="address" header={this.props.language["address"] || "l_address"} style={{ width: '20%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="managerName" body={this.managerTemplate} header={this.props.language["manager"] || "l_manager"} style={{ width: '15%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="employeeName" body={this.employeeNameTemplate} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: '15%', textAlign: 'center' }}></Column>
                    <Column filterMatchMode='contains' filter field="workDate" header={this.props.language["workdate"] || "l_workdate"} style={{ width: '10%', textAlign: 'center' }}></Column>
                    {/* <Column filterMatchMode='contains' filter field="total" header={this.props.language["total"] || "l_total"} style={{ width: '5%', textAlign: 'center' }}></Column> */}
                </DataTable>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filter: state.approach.filter,
        getDetail: state.approach.getDetail,
        fileExport: state.approach.fileExport,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ApproachController: bindActionCreators(actionCreatorsApproach, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ApproachForm);