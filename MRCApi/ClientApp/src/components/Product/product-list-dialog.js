import React, { PureComponent } from 'react'
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import CompetitorDropDownList from '../Controls/CompetitorDropDownList';
import { CategoryApp } from '../Controls/CategoryMaster';
import { Dropdown } from 'primereact/dropdown';

class ProductListDialog extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            divisionId: '',
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            brandId: 0,
            labelButton: "No File Chosen",
        }
        this.images = React.createRef()
    }
    componentDidMount() {
        this.handleGetProductType()
        this.setState({
            divisionId: this.props.inputValues.divisionId ? this.props.inputValues.divisionId : '',
            categoryId: this.props.inputValues.categoryId ? this.props.inputValues.categoryId : 0,
            subCatId: this.props.inputValues.subCatId ? this.props.inputValues.subCatId : 0,
            variantId: this.props.inputValues.variantId ? this.props.inputValues.variantId : 0,
            brandId: this.props.inputValues.brandId ? this.props.inputValues.brandId : 0,
        })
    }

    handleGetProductType = () =>{
        var typeId = this.props.inputValues.typeId
        if(typeof typeId === 'number'){
            var listType = this.props.listProductType
            listType.forEach(e=>{
                if(parseInt(e.code) === typeId){
                    this.props.handleChangeInput(e, this.props.stateName, 'typeId')
                }
            })
        }
    }

    handleChange = async (id, value) => {
        await this.setState({ [id]: value === null ? "" : value });
        await this.props.handleChangeDropDown(id, value)
    }
    render() {
        const { nameAction, displayDialog, inputValues, handleChangeInput, handleActionDialog, stateName, footerAction, } = this.props
        return (
            <Dialog style={{ width: '80vw' }}
                header={nameAction}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    {<CategoryApp
                        {...this}
                        handleChange={this.handleChange}
                        className="p-field p-col-12 p-md-3 p-sm-6"
                    />}
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["product.code"] || "product.code"}</label>
                        <InputText id="productCode" disabled={this.state.productId > 0 ? true : false} value={inputValues.productCode}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'productCode')}></InputText>
                        <small className="p-invalid p-d-block">{inputValues.errorProductCode || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["product.name"] || "product.name"}</label>
                        <InputText id="productName" value={inputValues.productName || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'productName')}></InputText>
                        <small className="p-invalid p-d-block">{inputValues.errorProductName || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["product.name.vn"] || "product.name.vn"}</label>
                        <InputText id="productNameVN" value={inputValues.productNameVN || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'productNameVN')}></InputText>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["bar_code"] || "l_bar_code"}</label>
                        <InputText id="barcode" value={inputValues.barcode || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'barcode')}></InputText>
                        {/* <small className="p-invalid p-d-block">{inputValues.errorBarCode || ""}</small> */}
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["barrel_barcode"] || "l_barrel_barcode"}</label>
                        <InputText id="barrelBarcode" value={inputValues.barrelBarcode || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'barrelBarcode')}></InputText>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["barrel_size"] || "l_barrel_size"}</label>
                        <InputNumber id="barrelSize" value={inputValues.barrelSize || ''}
                            onValueChange={(e) => handleChangeInput(e.target.value, stateName, 'barrelSize')}></InputNumber>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["barrel_price"] || "l_barrel_price"}</label>
                        <InputNumber id="barrelPrice" value={inputValues.barrelPrice || ''} useGrouping={false} minFractionDigits={1}
                            onValueChange={(e) => handleChangeInput(e.target.value, stateName, 'barrelPrice')}></InputNumber>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["product_unit"] || "product_unit"}</label>
                        <InputText id="unit" value={inputValues.unit || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'unit')}></InputText>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["package_size"] || "l_package_size"}</label>
                        <InputText id="packsize" value={inputValues.packsize || ''}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'packsize')}></InputText>
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["order_by"] || "l_order_by"}</label>
                        <InputNumber id="orderBy" value={inputValues.orderBy || ''} useGrouping={false}
                            onValueChange={(e) => handleChangeInput(e.target.value, stateName, 'orderBy')}></InputNumber>
                    </div>
                    {/* <div hidden={true} className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["type_id"] || "l_type_id"}</label>
                        <InputNumber id="typeId" value={inputValues.typeId || ''} useGrouping={false}
                            onValueChange={(e) => handleChangeInput(e.target.value, stateName, 'typeId')}></InputNumber>
                    </div> */}
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["type_id"] || "l_type_id"}</label>
                        <Dropdown
                            // key={inputValues.typeId.value}
                            style={{ width: '100%' }}
                            options={this.props.listProductType}
                            onChange={(e) => handleChangeInput(e.target.value, stateName, 'typeId')}
                            value={inputValues.typeId}
                            placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                            optionLabel="name"
                            filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                            filterBy="name"
                            filter
                            showClear={true}
                        />
                    </div>
                    <div className="p-field p-col-12 p-md-3 p-sm-6">
                        <label>{this.props.language["price"] || "l_price"}</label>
                        <InputNumber id="price" value={inputValues.price || ''} useGrouping={false}
                            onValueChange={(e) => handleChangeInput(e.target.value, stateName, 'price')}></InputNumber>
                    </div>
                    {/* {nameAction === 'Insert' && (
                        <div className="p-field p-col-12 p-md-3 p-sm-6">
                            <label>{this.props.language["image"] || "l_image"}</label>
                            <Button icon="pi pi-images" label={this.state.labelButton} className="p-button-info p-button-outlined p-mr-2 btn_posm" style={{ width: '100%' }}
                                onClick={() => this.images.current.click()} />
                            <input type="file" accept="image/*" ref={this.images} onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    if (e.target.files.length === 1) {
                                        this.setState({ labelButton: `1 File Chosen` })
                                    } else {
                                        this.setState({ labelButton: `${e.target.files.length} Files Chosen` })
                                    }
                                } else {
                                    this.setState({ labelButton: "No File Chosen" })
                                }
                                handleChangeInput(e.target.files, stateName, "images")
                            }} style={{ display: 'none' }} multiple />
                            {inputValues.clearFile && this.images.current !== null ? 'asdsad' : ''}
                        </div>
                    )} */}
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <br />
                        <label>{this.props.language["top"] || "l_top"} : </label>
                        <Checkbox inputId="top" checked={inputValues.top || ''} onChange={e => handleChangeInput(e.checked, stateName, 'top')} />
                        <small htmlFor="top">{inputValues.top ? ' Yes' : ' No'}</small>
                    </div>

                    {nameAction === 'Update' &&
                        <div className="p-col-12 p-md-2 p-sm-6">
                            <br />
                            <label>{this.props.language["status"] || "status"} : </label>
                            <Checkbox inputId="status"
                                checked={inputValues.status || ''}
                                onChange={e => handleChangeInput(e.checked, stateName, 'status')} />
                            <small htmlFor="status">{inputValues.status ? ' Active' : ' Inactive'}</small>
                        </div>}
                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        categories: state.products.categories,
        usedivision: true,
        usecate: true,
        usesubcate: false,
        usevariant: false,
        usebrand: true,
        language: state.languageList.language,
    }
}
function mapDispatchToProps() {
    return {
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(ProductListDialog);