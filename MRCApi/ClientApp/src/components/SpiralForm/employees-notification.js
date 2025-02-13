import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { bindActionCreators } from 'redux';
import { CreateActionSpiralForm } from '../../store/SpiralFormController';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';


class EmployeesNotification extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            selectArea: null,
            selectRegion: null,
            selectProvince: null,
            selectSup: null,
            selectPosition: null,
            selectEmployee: null,
            selectedEmployees: [],
            loading: true,
        }
        this.dt = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.handleBindData = this.handleBindData.bind(this);
        this.areaFilterTemplate = this.areaFilterTemplate.bind(this);
        this.regionFilterTemplate = this.regionFilterTemplate.bind(this);
        this.provinceFilterTemplate = this.provinceFilterTemplate.bind(this);
        this.supFilterTemplate = this.supFilterTemplate.bind(this);
        this.employeeFilterTemplate = this.employeeFilterTemplate.bind(this);
        this.onEmployeeFilterChange=this.onEmployeeFilterChange.bind(this);
        this.positionFilterTemplate = this.positionFilterTemplate.bind(this);
        //this.sendData = this.sendData.bind(this);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    componentDidMount() {
        if (this.props.formDetail !== null)
            this.handleBindData();
    }
    handleBindData() {
        this.setState({
            employees: [],
            selectedEmployees: [],
            loading: true,
            selectArea: null,
            selectRegion: null,
            selectProvince: null,
            selectSup: null,
            selectPosition: null,
            selectEmployee: null
        })
        this.props.SpiralFormController.GetEmployees({ supId: null, position: null, employeeId: null })
            .then(() => {
                this.setState({ employees: this.props.employees, loading: false });
                //this.onPermissionFilterChange({ value: true })
            });
    }
    areaFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.area, value: element.area });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectArea}
            style={{ width: '100%' }}
            options={result}
            showClear
            onChange={this.onAreaFilterChange}
            optionLabel="name"
            placeholder="select Areas"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onAreaFilterChange = (event) => {
        this.dt.current.filter(event.value, 'area', 'in');
        this.setState({ selectArea: event.value, selectRegion: null, selectProvince: null })
    }
    regionFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.region, value: element.region });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectRegion}
            style={{ width: '100%' }}
            options={result}
            showClear
            onChange={this.onRegionFilterChange}
            optionLabel="name"
            placeholder="select Regions"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onRegionFilterChange = (event) => {
        this.dt.current.filter(event.value, 'region', 'in');
        this.setState({ selectRegion: event.value, selectProvince: null })
    }
    provinceFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.province, value: element.province });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectProvince}
            style={{ width: '100%' }}
            options={result}
            showClear
            onChange={this.onProvinceFilterChange}
            optionLabel="name"
            filter
            filterMatchMode='contains'
            placeholder="select Province"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onProvinceFilterChange = (event) => {
        this.dt.current.filter(event.value, 'province', 'in');
        this.setState({ selectProvince: event.value })
    }
    supFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.supName, value: element.supCode });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectSup}
            style={{ width: '100%' }}
            showClear
            filter
            filterMatchMode='contains'
            options={result}
            onChange={this.onSupFilterChange}
            optionLabel="name"
            placeholder="select Sups"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onSupFilterChange = (event) => {
        this.dt.current.filter(event.value, 'supCode', 'in');
        this.setState({ selectSup: event.value })
    }
    employeeFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.employeeCode + ' - ' + element.fullName, value: element.employeeCode });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectEmployee}
            style={{ width: '100%' }}
            showClear
            filter
            filterMatchMode='contains'
            options={result}
            onChange={this.onEmployeeFilterChange}
            optionLabel="name"
            placeholder="select Employees"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onEmployeeFilterChange(event) {
        this.dt.current.filter(event.value, 'employeeCode', 'in');
        this.setState({ selectEmployee: event.value })
    }
    positionFilterTemplate() {
        let data = this.state.employees;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                lstData.push({ name: element.typeName, value: element.typeName });
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectPosition}
            style={{ width: '100%' }}
            options={result}
            showClear
            onChange={this.onPositionFilterChange}
            optionLabel="name"
            placeholder="select Positions"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onPositionFilterChange = (event) => {
        this.dt.current.filter(event.value, 'typeName', 'in');
        this.setState({ selectPosition: event.value })
    }
    sendData = () => {
        this.props.parentMethod(this.state.selectedEmployees)
    }
    renderHeader() {
        return (<div style={{ marginTop: -5, display: 'flex', justifyContent: 'space-between' }}>
            <Button icon="pi pi-refresh" className="p-button-sm" onClick={this.handleBindData} />
            <Button className="p-button-sm p-button-raised p-button-secondary p-button-text" >Employees</Button>
            <Button
                icon="pi pi-caret-right"
                iconPos='right'
                disabled={this.state.selectedEmployees.length > 0 ? false : true}
                className="p-button-sm p-button-success"
                onClick={() => this.props.parentMethod(this.state.selectedEmployees)}
                label="Next" />
        </div>);
    }
    supBodyTemplate(rowData) {
        return (<div style={{ textAlign: 'center' }}>
            <strong>{rowData.supCode}</strong><br></br>
            <label>{rowData.supName}</label>
        </div>)
    }
    employeesBodyTemplate(rowData) {
        return (<div style={{ textAlign: 'center' }}>
            <strong>{rowData.employeeCode}</strong><br></br>
            <label>{rowData.fullName}</label>
        </div>)
    }
    render() {
        //const hyperlink = window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + this.props.formDetail.accessKey;
        return (
            <>
                <Toast ref={(el) => this.toast = el} />
                {this.state.loading ? <ProgressSpinner style={{ zIndex: 1000, position: 'absolute', top: '50%', left: 250 }} /> : null}

                <div className='p-grid' style={{ marginRight: 0 }}>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["area"] || "l_area"}</label>
                        {this.areaFilterTemplate()}
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["region"] || "l_region"}</label>
                        {this.regionFilterTemplate()}
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["province"] || "l_province"}</label>
                        {this.provinceFilterTemplate()}
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["supervisor"] || "l_supervisor"}</label>
                        {this.supFilterTemplate()}
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["position"] || "l_position"}</label>
                        {this.positionFilterTemplate()}
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-4">
                        <label>{this.props.language["employee"] || "l_employee"}</label>
                        {this.employeeFilterTemplate()}
                    </div>
                </div>
                <div className="p-grid" style={{ marginRight: 0, marginTop:15 }} >
                    <div className="p-col-12" >
                        <DataTable
                            ref={this.dt}
                            key="tb8"
                            value={this.state.employees}
                            style={{ fontSize: "13px" }}
                            rows={10}
                            header={this.renderHeader()}
                            rowHover
                            paginator
                            scrollable
                            scrollHeight='400px'
                            selectionMode="checkbox"
                            selection={this.state.selectedEmployees}
                            onSelectionChange={e => this.setState({ selectedEmployees: e.value })}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                            paginatorPosition={"top"}
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            dataKey="rowNum" >
                            <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                            <Column field="area" style={{ display: 'none' }} header={this.props.language["area"] || "l_area"} />
                            <Column field="region" style={{ display: 'none' }} header={this.props.language["region"] || "l_region"} />
                            <Column field="province" style={{ display: 'none' }} header={this.props.language["province"] || "l_province"} />
                            <Column field="supCode" body={this.supBodyTemplate} header={this.props.language["supname"] || "l_supname"} style={{ width: 200, textAlign: 'center' }} />
                            <Column field="employeeCode" body={this.employeesBodyTemplate} header={this.props.language["employee"] || "l_employee"} style={{ textAlign: 'center' }} />
                            <Column field="typeName" header={this.props.language["position"] || "l_position"} style={{ width: 100, textAlign: 'center' }} />
                        </DataTable>
                    </div>
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        employees: state.spiralform.employees,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeesNotification);