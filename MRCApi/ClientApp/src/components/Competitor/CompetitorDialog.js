import React,{Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {InputText} from "primereact/inputtext";
import {InputNumber} from 'primereact/inputnumber';
import {connect} from 'react-redux';
import {MultiSelect} from 'primereact/multiselect';

class CompetitorDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const {stateName,displayDialog,displayFooterAction,handleDialog,handleChangeForm,inputValues,listCates,
            actionName,handleActionFunction,dialogStateName,
        } = this.props
        return (
            <React.Fragment>
                <Dialog header={actionName} visible={displayDialog} style={{width: '80vw'}} footer={displayFooterAction(actionName,() => handleDialog(false,dialogStateName),handleActionFunction)} onHide={() => handleDialog(false,dialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid" >
                        {/* <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["competitor_name"] || "l_competitor_name"}</label>
                            <InputText value={inputValues.competitorName} onChange={(e) => handleChangeForm(e.target.value,stateName,"competitorName")}
                                placeholder={this.props.language["input_name"] || "l_input_name"} />
                            <small className="p-invalid p-d-block">{inputValues.errorCompetitor || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["competitor_name_vn"] || "l_competitor_name_vn"}</label>
                            <InputText value={inputValues.competitorNameVN} onChange={(e) => handleChangeForm(e.target.value,stateName,"competitorNameVN")}
                                placeholder={this.props.language["input_name_vn"] || "l_input_name_vn"} />
                            <small className="p-invalid p-d-block">{inputValues.errorCompetitorVN || ""}</small>
                        </div> */}
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["brand_code"] || "l_brand_code"}</label>
                            <InputText value={inputValues.brandCode} onChange={(e) => handleChangeForm(e.target.value,stateName,"brandCode")}
                                placeholder={this.props.language["input_brand_code"] || "l_input_brand_code"} />
                            <small className="p-invalid p-d-block">{inputValues.errorBrandCode || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["brand_name"] || "l_brand_name"}</label>
                            <InputText value={inputValues.brandName} onChange={(e) => handleChangeForm(e.target.value,stateName,"brandName")}
                                placeholder={this.props.language["input_brand_name"] || "l_input_brand_name"} />
                            <small className="p-invalid p-d-block">{inputValues.errorBrandName || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["competitor"] || "l_competitor"}</label>
                            <InputText value={inputValues.competitor} onChange={(e) => handleChangeForm(e.target.value,stateName,"competitor")}
                                placeholder={this.props.language["input_competitor"] || "l_input_competitor"} />
                            <small className="p-invalid p-d-block">{inputValues.errorCompetitor || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["category"] || "l_category"}</label>
                            <MultiSelect value={inputValues.listCates} options={listCates} onChange={(e) => handleChangeForm(e.value,stateName,"listCates")} filter showClear optionLabel="category"
                                placeholder={this.props.language["select"] || "l_select"} />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label>{this.props.language["order"] || "l_order"}</label>
                            <InputNumber value={inputValues.order || ""} onValueChange={(e) => handleChangeForm(e.target.value,stateName,"order")} mode="decimal"
                                style={{direction: "rtl"}} placeholder={this.props.language["input_order"] || "l_input_order"} />
                        </div>
                    </div>
                </Dialog>

            </React.Fragment >
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        categories: state.products.categories,
        usedivision: false,
        usecate: true,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CompetitorDialog);
