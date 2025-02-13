import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
//import {Card} from 'primereact/card';
import { InputText } from "primereact/inputtext";
//import {Checkbox} from "primereact/checkbox";
//import {RadioButton} from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
//React-redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getEmployees } from '../store/EmployeeController';
import { Container } from 'reactstrap';
import EmployeeChild from './EmployeeChild'
import { Sidebar } from 'primereact/sidebar';
import BottomDoker from './Controls/BottomDoker';
class EmployeeList extends Component {
    constructor(props) {
        super();
        this.state = {
            expandedRows: null
        }
        this.LoadList = this.LoadList.bind(this);
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }
    LoadList() {
        this.props.GetList(null);
    }
    componentDidMount() {
        this.LoadList();
    }
    rowExpansionTemplate(data) {
        return (
            <EmployeeChild dataEmployee={data}></EmployeeChild>
        )
    }
    render() {
        return (
            <Container>
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header={this.props.language["search"] || "l_search"}>
                        <div className="p-grid">
                            <div className="p-col-4">
                                <span className="p-float-label">
                                    <InputText id="EmployeeCode" value={this.state.employeecode} onChange={(e) => this.setState({ employeecode: e.target.value })} />
                                    <label htmlFor="EmployeeCode">{this.props.language["employee_code"] || "l_employee_code"}</label>
                                </span>
                            </div>
                            <div className="p-col-4">
                                <span className="p-float-label">
                                    <InputText id="EmployeeCode" value={this.state.employeename} onChange={(e) => this.setState({ employeename: e.target.value })} />
                                    <label htmlFor="EmployeeCode">{this.props.language["employee_name"] || "l_employee_name"}</label>
                                </span>
                            </div>
                            <div className="p-col-4">

                            </div>
                            <div className="p-col-4">

                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <Toolbar>
                    <div className="p-toolbar-group-left">
                        <Button label={this.props.language["filter"] || "l_filter"} icon="pi pi-search" className="p-button-success" onClick={this.LoadList}></Button>
                    </div>
                </Toolbar>
                <DataTable value={this.props.employeeLists} paginator={true} scrollHeight="500px" rows={50}
                    first={this.state.first} scrollable={true}
                    onPage={(e) => this.setState({ first: e.first })} selectionMode="single"
                    expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({ expandedRows: e.data })}
                    rowExpansionTemplate={this.rowExpansionTemplate} dataKey="employeeCode">
                    <Column expander={true} style={{ width: '3em' }} />
                    <Column field="employeeCode" filter={true} header={this.props.language["employee_code"] || "l_employee_code"} style={{ width: '150px' }} />
                    <Column field="fullName" filter={true} header={this.props.language["employee_name"] || "l_employee_name"} style={{ width: '250px' }} />
                    <Column field="address" header={this.props.language["address"] || "l_address"} filter={true} style={{ width: '650px' }} />
                    <Column field="mobile" header={this.props.language["mobile"] || "l_mobile"} filter={true} style={{ width: '150px' }} />
                    <Column field="email" header={this.props.language["email"] || "l_email"} filter={true} style={{ width: '250px' }} />
                </DataTable>
                <Sidebar position="bottom"
                    visible={this.state.visible}
                    onHide={(e) => this.setState({ visible: false })}>
                    <Container>

                    </Container>
                </Sidebar>
                <Button onClick={(e) => this.setState({ visible: true })}>Show</Button>
                <BottomDoker />
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        employeeLists: state.employeeLists.employeeLists,
        loading: state.employeeLists.loading,
        errors: state.employeeLists.errors,
        forceReload: state.employeeLists.forceReload,
        language: state.languageList.language
    }
}
export default connect(mapStateToProps, dispatch => bindActionCreators(getEmployees, dispatch))(EmployeeList);