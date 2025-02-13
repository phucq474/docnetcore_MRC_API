import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { getToken, URL } from "../../Utils/Helpler";
import { Calendar } from 'primereact/calendar';
import { connect } from 'react-redux';
import moment from 'moment';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { RegionActionCreate } from '../../store/RegionController';
import { RegionApp } from './../Controls/RegionMaster';
import { CategoryApp } from './../Controls/CategoryMaster';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { bindActionCreators } from "redux";
import { ProductCreateAction } from '../../store/ProductController';
import { Card } from 'primereact/card';
import { download, HelpPermission } from '../../Utils/Helpler';

class ProductPermission extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            expandedRows: null,
            selected: 0,
            area: null,
            dealerId: null,
            positionId: null,
            brand: null,
            division: null,
            categoryId: null,
            subCateId: null,
            segmentId: null,
            productCode: null
        }
        this._child = React.createRef();
        this.LoadList = this.LoadList.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
    }
    DefaultLoad = () => {
        this.props.RegionController.GetListRegion();
        this.props.ProductController.GetCategory();
    }
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    handleExport() {
        this.setState({ loading: true });
        let data = this.getDataFilter();
        this.props.ProductController.Export_ProductPermission(data);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    UNSAFE_componentWillReceiveProps() {
        this.setState({ loading: false });
    }
    OnCreateTemplate = async () => {
        this.setState({ loading: true });
        const token = getToken();
        const url = URL + `product/tmp_ProductPermission`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch(url, requestOptions);
            const file = await response.json();
            if (file.status === 1) {
                this.setState({ linkTemplate: file.fileUrl })
                this.showSuccess(`${this.props.language["create_template_successful"] || "l_create_template_successful"}`);
            }
            else
                this.showError(file.message);
        }
        catch (err) {
        }
        finally {
            this.setState({ loading: false });
        }
    }
    Import = async (e) => {
        this.setState({ loading: false });
        const url = URL + `product/import_ProductPermission`;
        const formData = new FormData();
        formData.append('fileUpload', e.files[0]);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                //  'Content-Type': 'multipart/form-data',
            },
            body: formData,
        };

        try {
            const request = new Request(url, requestOptions);
            const response = await fetch(request);
            const result = await response.json();
            if (response.status === 200)
                if (result.status === 1) {
                    this.showSuccess(result.message)
                }
                else {
                    this.showError(result.message)
                }
        }
        catch (error) {
            this.showError("Error")
        }
        finally {
            this.setState({ loading: false });
            this._child.current.clear()
        }
    }
    getDataFilter() {
        const fromdate = this.state.dates[0];
        const todate = this.state.dates[1];
        var data = {
            fromInt: parseInt(moment(fromdate).format("YYYYMMDD"), 0),
            toInt: parseInt(moment(todate).format("YYYYMMDD"), 0),
            area: this.state.area,
            dealerId: this.state.dealerId,
            positionId: this.state.positionId,
            brand: this.state.brand,
            division: this.state.division,
            categoryId: this.state.categoryId,
            subCateId: this.state.subCateId,
            segmentId: this.state.segmentId,
            productCode: this.state.productCode
        }
        return JSON.stringify(data);
    }
    LoadList() {
        this.setState({ expandedRows: null });
        this.setState({ loading: true });
        let data = this.getDataFilter();
        this.props.ProductController.GetList_ProductPermission(data);
    }
    componentDidMount() {
        this.DefaultLoad();
    }
    fromDateTemplate(rowData) {
        return (
            <div>
                <label>{rowData.fromDate.toString().substring(0, 10)}</label>
            </div>

        );
    }
    toDateTemplate(rowData) {
        if (rowData.toDate !== null)
            return (
                <div>
                    <label>{rowData.toDate.toString().substring(0, 10)}</label>
                </div>

            );
        else return null;
    }
    render() {
        let btnDownload = null;
        if (this.props.urlFile !== []) {
            if (this.props.urlFile.status === 1) {
                btnDownload = <Button
                    className="p-button-success p-button-rounded"
                    onClick={e => download(this.props.urlFile.fileUrl)}
                    label='Download' />;
                this.showSuccess(`${this.props.language["export_successful"] || "l_export_successful"}`);
            }
            else if (this.props.urlFile.status === 0) {
                this.showError(`${this.props.language["export_failed"] || "l_export_failed"}`);
            }
            this.props.urlFile.status = -1;
        }

        let leftSearch = [], rightSearch = [];
        leftSearch.push(
            <Button
                label={this.props.language["search"] || "search"}
                icon="pi pi-search"
                style={{ marginRight: '.25em' }}
                visible={false}
                onClick={this.LoadList} />);
        leftSearch.push(
            <Button
                label={this.props.language["export"] || "l_export"}
                icon="pi pi-download"
                className="p-button-warning"
                style={{ marginRight: '.25em' }}
                onClick={this.handleExport} />)
        if (btnDownload !== null)
            leftSearch.push(btnDownload);
        rightSearch.push(
            <FileUpload
                ref={this._child}
                style={{ whiteSpace: 'nowrap', width: '100%' }}
                name="myfile[]"
                mode="basic"
                chooseLabel={this.props.language["import"] || "l_import"}
                accept=".xlsx,.xls"
                customUpload={true}
                multiple={false}
                uploadHandler={this.Import} />)
        rightSearch.push(
            <Button
                label={this.props.language["template"] || "l_template"}
                style={{ marginLeft: 5, marginRight: 5 }}
                className="p-button-successs"
                onClick={this.OnCreateTemplate} />)
        rightSearch.push(
            <a href={this.state.linkTemplate}
                style={{ color: '#ffffff' }} download>
                {this.state.linkTemplate ? "download" : ""}
            </a>);
        let result = null;
        if (this.props.productPermissions.length > 0) {
            result =
                <Card style={{ marginTop: "10px" }}>
                    <DataTable
                        key="tb1"
                        value={this.props.productPermissions}
                        paginator={true}
                        rows={50}
                        rowsPerPageOptions={[50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        dataKey="id">
                        <Column field="area" style={{ width: '100px' }} filter={true} header={this.props.language["storelist.area"] || "storelist.area"} />
                        <Column field="dealerName" filterMatchMode="contains" style={{ width: '100px' }} filter={true} header={this.props.language["dealername"] || "dealername"} />
                        <Column field="position" style={{ width: '60px' }} filter={true} header={this.props.language["position"] || "position"} />
                        <Column field="brand" style={{ width: '90px' }} filter={true} header={this.props.language["brand"] || "l_brand"} />
                        <Column field="division" style={{ width: '90px' }} filter={true} header={this.props.language["division"] || "l_division"} />
                        <Column field="categoryCode" filterMatchMode="contains" filter={true} style={{ width: '70px' }} header={this.props.language["category"] || "category"} />
                        <Column field="subCategory" filterMatchMode="contains" header={this.props.language["subcategory"] || "subcategory"} filter={true} />
                        <Column field="segment" filterMatchMode="contains" header={this.props.language["segment"] || "segment"} filter={true} />
                        <Column field="productCode" filterMatchMode="contains" header={this.props.language["product.code"] || "product.code"} filter={true} />
                        <Column field="productName" filterMatchMode="contains" header={this.props.language["product.name"] || "product.name"} filter={true} />
                        <Column field="fromDate" style={{ width: '100px' }} body={this.fromDateTemplate} header={this.props.language["fromdate"] || "fromdate"} />
                        <Column field="toDate" style={{ width: '100px' }} body={this.toDateTemplate} header={this.props.language["todate"] || "todate"} />
                    </DataTable>
                </Card>
        }

        return (
            <div className="p-fluid">
                <Toast ref={(el) => this.toast = el} />
                <Accordion activeIndex={0} style={{ marginTop: '10px' }}>
                    <AccordionTab header={this.props.language["search"] || "l_search"}>
                        <div className="p-fluid">
                            <div className="p-grid">
                                <div className="p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                    <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.setState({ dates: e.value })}
                                        dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                        id="fromDate" selectionMode="range"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    />
                                </div>
                                <RegionApp {...this} />

                                <div className="p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["position"] || "position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        type="PG-SR-MER"
                                        onChange={this.handleChange}
                                        value={this.state.position} />
                                </div>
                                <CategoryApp {...this} />
                            </div>
                            <br />
                            <Toolbar right={rightSearch} left={leftSearch}>

                            </Toolbar>
                            {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                        </div>
                    </AccordionTab>
                </Accordion>
                {result}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        productPermissions: state.products.productPermissions,
        categories: state.products.categories,
        regions: state.regions.regions,
        urlFile: state.products.urlFile,
        usearea: true,
        useregion: false,
        userprovince: false,
        usedistrict: false,
        usedivision: true,
        usecate: true,
        usesubcate: true,
        usesegment: true,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductPermission);