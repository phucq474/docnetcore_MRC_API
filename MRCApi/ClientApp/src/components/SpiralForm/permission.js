import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import moment from 'moment';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { bindActionCreators } from 'redux';
import { CustomerCreateAction } from '../../store/CustomerController';
import { CreateActionSpiralFormPermission } from '../../store/SpiralFormPermissionController';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';

class Permission extends Component {
    constructor() {
        super();
        this.state = {
            showPermission: false,
            permissions: [],
            selectArea: null,
            selectRegion: null,
            selectProvince: null,
            selectSup: null,
            selectPosition: null,
            selectPermission: null,
            selectedEmployees: [],
            dates: [],
            selectDealer: []
        }
        this.lstPermission = [
            { name: "true", value: true },
            { name: "false", value: false },
            { name: "", value: null }
        ];
        this.dt = React.createRef();
        this.handleBindData = this.handleBindData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.permissionBodyTemplate = this.permissionBodyTemplate.bind(this);
        this.permissionFilterTemplate = this.permissionFilterTemplate.bind(this);
        this.areaFilterTemplate = this.areaFilterTemplate.bind(this);
        this.regionFilterTemplate = this.regionFilterTemplate.bind(this);
        this.provinceFilterTemplate = this.provinceFilterTemplate.bind(this);
        this.supBodyTemplate = this.supBodyTemplate.bind(this);
        this.supFilterTemplate = this.supFilterTemplate.bind(this);
        this.employeesBodyTemplate = this.employeesBodyTemplate.bind(this);
        this.positionFilterTemplate = this.positionFilterTemplate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.dealerFilterTemplate = this.dealerFilterTemplate.bind(this);

    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }

    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
        if (id === "dealerId") this.onDealerFilterChange(value);

    }
    componentDidMount() {
        // if (this.props.formDetail !== null && this.props.formDetail !== undefined)
        this.props.CustomerController.GetCustomerList(null);
        this.handleBindData();
    }
    handleBindData() {
        this.setState({ permissions: [], dates: [] })
        this.props.SpiralFormPermissionController.GetById({ formId: this.props.formDetail === null || this.props.formDetail === undefined ? 0 : this.props.formDetail.id })
            .then(() => {
                this.setState({ permissions: this.props.permissions, selectedEmployees: [] });
                //this.onPermissionFilterChange({ value: true })
            });
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
    permissionBodyTemplate(rowData) {
        if (rowData.permission)
            return <i style={{ color: "green" }} className='pi pi-check-circle'></i>;
        else
            return <i className='pi pi-times-circle'></i>;
    }
    onPermissionFilterChange = (event) => {
        this.dt.current.filter(event.value, 'permission', 'equals');
        this.setState({ selectPermission: event.value })
    }
    permissionFilterTemplate() {
        return <TriStateCheckbox value={this.state.selectPermission} onChange={this.onPermissionFilterChange} />
    }
    areaFilterTemplate() {
        let data = this.state.permissions;
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
        let data = this.state.permissions;
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
        let data = this.state.permissions;
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
        let data = this.state.permissions;
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
    positionFilterTemplate() {
        let data = this.state.permissions;
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
    dealerFilterTemplate() {
        let data = this.state.permissions;
        let result = [], lstData = [];
        if (data.length > 0) {
            data.forEach(element => {
                if (element.dealerName !== null) {
                    let key = element.dealerName.split(' ');
                    if (key.length > 0)
                        for (let index = 0; index < key.length; index++) {
                            const item = key[index];
                            lstData.push({ name: item, value: item });
                        }
                }
            });
            result = lstData.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }

        return <MultiSelect value={this.state.selectDealer}
            style={{ width: '100%' }}
            options={result}
            showClear
            onChange={this.onDealerFilterChange}
            optionLabel="name"
            placeholder="select a Customer"
            className="p-column-filter"
            maxSelectedLabels={1} />;
    }
    onDealerFilterChange = (event) => {
        //this.dt.current.filter(event.value, 'dealerName', 'custom');
        if (event.value === null || event.value === undefined || event.value === "" || event.value?.length === 0) {
            this.setState({ permissions: this.props.permissions });
        }
        else if (event.value.length > 0) {
            let result = this.props.permissions;
            for (let index = 0; index < event.value.length; index++) {
                const dealer = event.value[index];
                result.forEach(element => {
                    if (element.dealerName !== null)
                        if (element.dealerName.includes(dealer))
                            element.checkDealer = 1;
                });
            }
            this.setState({ permissions: result.filter(i => i.checkDealer === 1) })

        }
        this.setState({ selectDealer: event.value })
    }

    handleUpdate(type) {
        const results = this.state.selectedEmployees;
        let data = [], dealerId = null;
        if (results.length === 0)
            return this.showError("Chưa chọn nhân viên");

        if (type === "Update") {
            if (this.state.dates[0] === undefined || this.state.dates[0] === null)
                return this.showError("Chưa chọn ngày bắt đầu");
        }
        if (this.state.selectDealer?.length > 0) {
            dealerId = "";
            for (let index = 0; index < this.state.selectDealer.length; index++) {
                const element = this.state.selectDealer[index];
                let dealer = this.props.customerList.find(e => e.customerCode === element)
                if (dealer !== undefined && dealer !== null)
                    dealerId += dealer.id + ",";
            }
        }

        results.forEach(element => {
            data.push({
                formId: this.props.formDetail.id,
                id: element.id,
                employeeId: element.employeeId,
                dealerId: dealerId,
                fromDate: moment(this.state.dates[0]).format("YYYYMMDD") || null,
                toDate: (this.state.dates[1] !== undefined && this.state.dates[1] !== null) ? moment(this.state.dates[1]).format("YYYYMMDD") : null,
                type: type
            })
        });
        //console.log(JSON.stringify(data));
        this.props.SpiralFormPermissionController.Update(data)
            .then(() => {
                const result = this.props.updates;
                if (result.status > 0) {
                    this.handleBindData();
                    this.showSuccess("Update successful");
                }
                else {
                    this.showError("Update fail !");
                }
            });
    }
    renderHeader() {
        return (<div>
            <strong>Employees</strong>
            {/* <i>Dealer</i>
            <DealerDropDownList
                style={{ marginLeft: 15 }}
                width={200}
                id="dealerId"
                mode="multi"
                onChange={this.handleChange}
                value={this.state.dealerId} /> */}
            <Button icon="pi pi-refresh" style={{ float: 'right', marginTop: -10 }} onClick={this.handleBindData} />
        </div>);
    }
    render() {

        const footer = (
            <div>
                <Calendar fluid
                    value={this.state.dates}
                    onChange={(e) => this.setState({ dates: e.value })}
                    dateFormat="yy-mm-dd"
                    id="fromDate"
                    selectionMode="range"
                    placeholder='FromDate - ToDate'
                    style={{ width: 280 }}
                    showIcon showButtonBar />
                <Button className='p-button-success' label={this.props.language["update_permission"] || "l_update_permission"} icon="pi pi-check" onClick={() => this.handleUpdate("Update")} />
                <Button className='p-button-warning' label={this.props.language["remove_permission"] || "l_remove_permission"} icon="pi pi-trash" onClick={() => this.handleUpdate("Delete")} />
                <Button className='p-button-danger' label={this.props.language["close"] || "l_close"} icon="pi pi-times" onClick={this.props.parentMethod} />
            </div>
        );
        let data = [];
        if (this.props.formDetail !== null) data.push(this.props.formDetail);
        const permissionFilterTemplate = this.permissionFilterTemplate();
        const areaFilterTemplate = this.areaFilterTemplate();
        const regionFilterTemplate = this.regionFilterTemplate();
        const provinceFilterTemplate = this.provinceFilterTemplate();
        const supFilterTemplate = this.supFilterTemplate();
        const positionFilterTemplate = this.positionFilterTemplate();
        const dealerFilterTemplate = this.dealerFilterTemplate();
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <Dialog header={this.props.language["form_permission"] || "l_form_permission"}
                    footer={footer}
                    visible
                    maximized
                    modal={true}
                    onHide={this.props.parentMethod}>
                    <div className="p-grid" >
                        <div className="p-col-12" >
                            <DataTable
                                key="tb8"
                                value={data}
                                style={{ fontSize: "13px" }}
                                dataKey="id">
                                <Column field="title" header={this.props.language["title"] || "l_title"} style={{ width: "300px" }} />
                                <Column field="subTitle" header={this.props.language["subtitle"] || "l_subtitle"} />
                                <Column field="usedEmployees" header={this.props.language["use_employees"] || "l_use_employees"} style={{ width: "100px" }} />
                                <Column field="usedStores" header={this.props.language["use_stores"] || "l_use_stores"} style={{ width: "100px" }} />
                                <Column field="position" header={this.props.language["position"] || "l_position"} style={{ width: "100px" }} />
                                <Column field="mMobile" header={this.props.language["mobile"] || "l_mobile"} style={{ width: "100px" }} />
                            </DataTable>
                        </div>
                        <div className="p-col-12" >
                            {this.state.permissions.length === 0 ?
                                <ProgressSpinner style={{ zIndex: 1000, position: 'absolute', top: '50%', left: '47%' }} /> : null}
                            <DataTable
                                ref={this.dt}
                                key="tb8"
                                value={this.state.permissions}
                                style={{ fontSize: "13px" }}
                                filterDisplay="row"
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
                                paginatorPosition={"both"}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                dataKey="rowNum" >
                                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                                <Column field="dealerName" filter filterElement={dealerFilterTemplate} header={this.props.language["customer"] || "l_customer"} />
                                <Column field="area" filter filterElement={areaFilterTemplate} header={this.props.language["area"] || "l_area"} style={{ width: "100px" }} />
                                <Column field="region" filter filterElement={regionFilterTemplate} header={this.props.language["region"] || "l_region"} />
                                <Column field="province" filter filterElement={provinceFilterTemplate} header={this.props.language["province"] || "l_province"} style={{ width: "180px" }} />
                                <Column field="supCode" filter body={this.supBodyTemplate} filterElement={supFilterTemplate} header={this.props.language["supname"] || "l_supname"} style={{ width: "200px" }} />
                                <Column field="fullName" filter filterMatchMode='contains' body={this.employeesBodyTemplate} header={this.props.language["employee"] || "l_employee"} style={{ width: "200px" }} />
                                <Column field="typeName" filter filterElement={positionFilterTemplate} header={this.props.language["position"] || "l_position"} style={{ width: 70, textAlign: 'center' }} />
                                <Column field="fromDate" filter filterMatchMode='contains' header={this.props.language["fromdate"] || "l_fromdate"} style={{ width: "100px" }} />
                                <Column field="toDate" filter filterMatchMode='contains' header={this.props.language["todate"] || "l_todate"} style={{ width: "100px" }} />
                                <Column field="permission" filter dataType="boolean" body={this.permissionBodyTemplate} filterElement={permissionFilterTemplate} header={this.props.language["permission"] || "l_permission"} style={{ width: 60, textAlign: 'center' }} />
                            </DataTable>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        customerList: state.customer.customerList,
        permissions: state.spiralFormPermission.permissions,
        updates: state.spiralFormPermission.updates,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormPermissionController: bindActionCreators(CreateActionSpiralFormPermission, dispatch),
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Permission);