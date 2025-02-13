import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Detail from './detail.js'

class ResultList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            resultList: null,
            expandedRows: null
        }
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }
    // Filter = () => {
    //     this.setState({  expandedRows: null });
    //     const dataInput=this.props.dataInput;

    //     const data = {
    //         fromDate: moment(dataInput.dates[0]).format("YYYYMMDD"),
    //         toDate: moment(dataInput.dates[1]).format("YYYYMMDD"),
    //         formId: dataInput.formId === '' ? null : dataInput.formId,
    //     }
    //     this.props.SpiralFormStatisticalController.GetList(data)
    //         .then(() => {
    //             const result = this.props.statisticalList;
    //             this.setState({ statisticalList: result, loading: false });
    //             // if (result.length === 0) {
    //             //     this.showSuccess("no data");
    //             // }
    //             // else
    //             //     this.showSuccess("successful");

    //             // console.log(result);
    //         });
    // }
    rowExpansionTemplate = (rowData) => {
        return (<Detail dataInput={rowData}></Detail>)
    }
    render() {

        return (

            <DataTable
                value={this.props.result}
                paginator
                paginatorPosition="bottom"
                rows={10}
                rowsPerPageOptions={[10, 20]}
                style={{ fontSize: "13px" }}
                rowHover
                dataKey="rowNum"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => { this.setState({ expandedRows: e.data }); }}
                rowExpansionTemplate={this.rowExpansionTemplate} >
                <Column expander style={{ width: '5em' }} />
                <Column field="rowNum" style={{ width: 50 }} header="No." />
                <Column field="title" header={this.props.language["title"] || "l_title"} />
                <Column field="createdName" header={this.props.language["created_by"] || "l_created_by"} style={{ width: "200px" }} />
                <Column field="usedEmployees" header={this.props.language["used_employees"] || "l_used_employees"} style={{ width: "100px", textAlign: 'center' }} />
                <Column field="usedStores" header={this.props.language["used_stores"] || "l_used_stores"} style={{ width: "100px", textAlign: 'center' }} />
                <Column field="forms" style={{ width: "60px", textAlign: 'center' }} header={this.props.language["forms"] || "forms"} />
            </DataTable>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultList);