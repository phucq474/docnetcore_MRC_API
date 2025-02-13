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
import { RegionActionCreate } from '../../store/RegionController'
import TimeField from 'react-simple-timefield';
import { CategoryApp } from '../Controls/CategoryMaster'
import { RegionApp } from '../Controls/RegionMaster';
import { Calendar } from 'primereact/calendar';
import CustomerAccountDropDownList from '../Controls/CustomerAccountDropDownList';
import DivisionDropDownList from '../Controls/DivisionDropDownList';
import { actionCreatorsPromotion } from '../../store/PromotionController';

class PromotionListDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account_Id: null,
            divisionId: null,
            brandId: null,
            categoryId: null,
            subCatId: null,
            variantId: null,
            area: ''
        }
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value === null ? "" : value });
        this.props.handleChangeDropDown(id, value)
    }
    async componentWillReceiveProps(nextProps) {
        await this.setState({
            divisionId: nextProps.inputValues.divisionId ? nextProps.inputValues.divisionId : 0,
            account_Id: nextProps.inputValues.account_Id ? nextProps.inputValues.account_Id : null,
            brandId: nextProps.inputValues.brandId ? nextProps.inputValues.brandId : 0,
            categoryId: nextProps.inputValues.categoryId ? nextProps.inputValues.categoryId : 0,
            // area: nextProps.inputValues.area ? nextProps.inputValues.area : '',
            // customerId: nextProps.inputValues.customerId ? nextProps.inputValues.customerId : 0,
        })
    }
    async componentDidMount() {
        // this.props.ProductController.GetCategory();
        // this.props.RegionController.GetListRegion();
        await this.props.PromotionController.GetListPromotionType()
    }

    render() {
        const { actionName, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction,
        } = this.props
        return (
            <Dialog style={{ width: '70%' }}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["account"] || "l_account"}</label>
                        <CustomerAccountDropDownList
                            id='account_Id'
                            mode='single'
                            onChange={this.handleChange}
                            value={inputValues.account_Id} />
                    </div>
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.dates} onChange={e => handleChangeForm(e.target.value, stateName, 'dates')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="dates" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small className="p-invalid p-d-block">{inputValues.errorDates || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["group"] || "l_group"}</label>
                        <span className="p-float-label">
                            <InputText id="groupName"
                                value={inputValues.groupName} onChange={e => handleChangeForm(e.target.value, stateName, 'groupName')} />
                        </span>
                    </div>
                    {/* <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["division"] || "l_division"}</label>
                        <DivisionDropDownList
                            id='divisionId'
                            mode='single'
                            onChange={this.handleChange}
                            value={inputValues.divisionId} />
                    </div> */}
                   
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["promotion_type"] || "l_promotion_type"}</label>
                        <span className="p-float-label">
                            <Dropdown
                                className="w-100"
                                id="promotionType"
                                key={this.props.promotionTypeList.value}
                                value={inputValues.promotionType}
                                options={this.props.promotionTypeList}
                                placeholder="Select an Option" optionLabel="name"
                                filter={true} filterPlaceholder="Select an Option" filterBy="name"
                                showClear={true}
                                onChange={(e) => this.handleChange("promotionType", e.target.value)}
                                editable
                            />
                        </span>
                    </div>                    
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["promotion_code"] || "l_promotion_code"}</label>
                        <span className="p-float-label">
                            <InputText id="promotionCode"
                                value={inputValues.promotionCode} onChange={e => handleChangeForm(e.target.value, stateName, 'promotionCode')} />
                        </span>
                        <small className="p-invalid p-d-block">{inputValues.errorPromotionCode || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-4 p-sm-6">
                        <label>{this.props.language["promotion_name"] || "l_promotion_name"}</label>
                        <span className="p-float-label">
                            <InputText id="promotionName"
                                value={inputValues.promotionName} onChange={e => handleChangeForm(e.target.value, stateName, 'promotionName')} />
                        </span>
                        <small className="p-invalid p-d-block">{inputValues.errorPromotionName || ""}</small>
                    </div>
                    
                    {<CategoryApp id="appcate" {...this} className="p-field p-col-12 p-md-4 p-sm-6"/>}
                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        categories: state.products.categories,
        regions: state.regions.regions,
        usedivision: true,
        usebrand: true,
        usecate: true,
        usesubcate: false,
        usevariant: false,
        usearea: false,
        useprovince: false,
        promotionTypeList: state.promotion.promotionTypeList
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch),
        PromotionController: bindActionCreators(actionCreatorsPromotion, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(PromotionListDialog);