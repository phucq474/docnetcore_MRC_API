import React, { Component } from 'react'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { connect } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from 'redux';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProductCreateAction } from '../../store/ProductController';
import { Calendar } from 'primereact/calendar';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';

class StockOutTargetDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            divisionFilter: null,
            brandFilter: null,
            area: ''
        }
        this.filterDivision = this.filterDivision.bind(this);
        this.filterBrand = this.filterBrand.bind(this);
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value === null ? "" : value });
        this.props.handleChangeDropDown(id, value)
    }
    handleChangeHeader = (e, id) => {
        this.dt.filter(e.value, id, 'in');
        this.setState({ [id]: e.value });
    }
    async componentWillReceiveProps(nextProps) {
        await this.setState({
            divisionId: nextProps.inputValues.divisionId ? nextProps.inputValues.divisionId : 0,
            brandId: nextProps.inputValues.brandId ? nextProps.inputValues.brandId : 0,
            categoryId: nextProps.inputValues.categoryId ? nextProps.inputValues.categoryId : 0,
            area: nextProps.inputValues.area ? nextProps.inputValues.area : '',
            customerId: nextProps.inputValues.customerId ? nextProps.inputValues.customerId : 0,
        })
    }
    filterDivision() {
        return (
            <MultiSelect
                value={this.state.division}
                options={this.state.optionDivision}
                optionLabel='division'
                onChange={(e) => this.handleChangeHeader(e, 'division')}
                itemTemplate={this.showDivision}
                placeholder={this.props.language["select_division"] || "l_select_division"} className="p-column-filter" showClear />
        )
    }
    filterBrand() {
        return (
            <MultiSelect
                value={this.state.brand}
                options={this.state.optionBrand}
                optionLabel='brand'
                onChange={(e) => this.handleChangeHeader(e, 'brand')}
                itemTemplate={this.showBrand}
                placeholder={this.props.language["select_brand"] || "l_select_brand"} className="p-column-filter" showClear />
        )
    }
    showDivision = (rowData) => {
        return (
            <div>
                {rowData.division}
            </div>
        )
    }
    showBrand = (rowData) => {
        return (
            <div>
                {rowData.brand}
            </div>
        )
    }
    async componentDidMount() {
        await this.props.ProductController.GetListProduct()
        const result = await this.props.getListProduct
        const map1 = new Map(), map2 = new Map()
        let optionDivision = [], optionBrand = [];
        for (const item of result) {
            if (!map1.has(item.divisionId)) {
                map1.set(item.divisionId, true);
                optionDivision.push({
                    division: item.division,
                    value: item.division,
                });
            }
            if (!map2.has(item.brand)) {
                map2.set(item.brand, true);
                optionBrand.push({
                    brand: item.brand,
                    value: item.brand,
                });
            }
        }
        await this.setState({ optionBrand, optionDivision })
    }

    render() {
        const { actionName, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction, handleChangeTable
        } = this.props
        return (
            <Dialog style={{ width: '80vw' }}
                id='stockout_target_dialog'
                maximized={true}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-3 p-md-3 p-sm-6">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.dates} onChange={e => handleChangeForm(e.target.value, stateName, 'dates')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="dates" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small className="p-invalid p-d-block">{inputValues.errorDates || ""}</small>
                    </div>
                    <div className="p-field p-col-3 p-md-3 p-sm-6">
                        <label>{this.props.language["customer"] || "l_customer"}</label>
                        <CustomerDropDownList
                            id='customerId'
                            mode=''
                            onChange={this.handleChange}
                            value={inputValues.customerId} />
                        <small className="p-invalid p-d-block">{inputValues.errorCustomer || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-12 p-sm-12">
                        <DataTable value={this.props.getListProduct}
                            ref={(el) => this.dt = el}
                            scrollable
                            scrollHeight='400px'
                            selectionMode="multiple" cellSelection
                            tableStyle={{ overFlow: 'visible !important' }}
                            rowHover paginatorPosition={"both"}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            selection={inputValues.productSelected}
                            onSelectionChange={e => handleChangeTable(e)}
                            dataKey="id">
                            <Column selectionMode="multiple" onSelectionChange headerStyle={{ width: '3em' }}></Column>
                            <Column filter filterElement={this.filterDivision()} filterFunction={this.filterDivision()} field="division" body={(rowData) => this.showDivision(rowData)} header={this.props.language["division"] || "l_division"} style={{ width: 150 }}></Column>
                            <Column filter filterElement={this.filterBrand()} filterFunction={this.filterBrand()} field="brand" body={(rowData) => this.showBrand(rowData)} header={this.props.language["brand"] || "l_brand"} style={{ width: 300 }}></Column>
                            <Column filter field="productCode" header={this.props.language["product_name"] || "l_product_name"} style={{ width: 200 }}></Column>
                            <Column filter field="productName" header={this.props.language["product_code"] || "l_product_code"}></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog >
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        getListProduct: state.products.getListProduct
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(StockOutTargetDialog);