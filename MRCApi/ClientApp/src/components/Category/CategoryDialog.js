import React, { Component } from 'react';
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

class CategoryDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            division: '',
            categoryId: 0,
            subCateId: 0,
            segmentId: 0,
        }
    }
    render() {
        const { stateName, displayDialog, displayFooterAction, handleDialog, handleChangeForm, inputValues,
            actionName, handleActionFunction, dialogStateName
        } = this.props
        return (
            <React.Fragment>
                <Dialog header={actionName} visible={displayDialog} style={{ width: "90vw" }} footer={displayFooterAction(actionName, () => handleDialog(false, dialogStateName), handleActionFunction)} onHide={() => handleDialog(false, dialogStateName)}>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label>Division</label>
                            <Dropdown value={inputValues.division} options={inputValues.divisions} filter showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "division")} optionLabel="division"
                                placeholder={this.props.language["select_division"] || "l_select_division"} />
                            <small className="p-invalid p-d-block">{inputValues.errorDivision || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>Category</label>
                            <Dropdown value={inputValues.category} options={inputValues.categoryList} filter showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "category")} optionLabel="categoryString" editable
                                placeholder={this.props.language["select_category"] || "l_select_category"} />
                            <small className="p-invalid p-d-block">{inputValues.errorCate || ""}</small>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>Category Code*</label>
                            <InputText value={inputValues.categoryCode} onChange={(e) => handleChangeForm(e.target.value, stateName, "categoryCode")}
                                placeholder={this.props.language["input_category_code"] || "l_input_category_code"} disabled={inputValues.disabledCateCode} />
                            <small className="p-invalid p-d-block">{inputValues.errorCateCode || ""}</small>
                        </div>

                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label>Category VN</label>
                            <InputText value={inputValues.categoryVN} onChange={(e) => handleChangeForm(e.target.value, stateName, "categoryVN")}
                                placeholder={this.props.language["input_category_vn"] || "l_input_category_vn"} disabled={inputValues.disabledCateVN} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>Sub Cate</label>
                            <Dropdown value={inputValues.subCategory} options={inputValues.subCategoryList} filter showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "subCategory")} optionLabel="subCategory" editable
                                placeholder={this.props.language["select_subcategory"] || "l_select_subcategory"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>Sub Cate VN</label>
                            <InputText value={inputValues.subCategoryVN} onChange={(e) => handleChangeForm(e.target.value, stateName, "subCategoryVN")}
                                placeholder={this.props.language["input_subcategory_vn"] || "l_input_subcategory_vn"} disabled={inputValues.disableSubCateVN}
                                disabled={inputValues.disabledSubCateVN} />
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label>Segment</label>
                            <Dropdown value={inputValues.segment} options={inputValues.segmentList} filter showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "segment")} optionLabel="segment" editable
                                placeholder={this.props.language["select_segment"] || "l_select_segment"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>subSegment</label>
                            <Dropdown value={inputValues.subSegment} options={inputValues.subSegmentList} filter showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "subSegment")} optionLabel="subSegment" editable
                                placeholder={this.props.language["select_subsegment"] || "l_select_subsegment"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>Status</label>
                            <Dropdown value={inputValues.status} options={inputValues.statuses} showClear
                                onChange={(e) => handleChangeForm(e.value, stateName, "status")} optionLabel="name" disabled={actionName === "Insert"} />
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label>order</label>
                            <InputNumber value={inputValues.order || ""} onValueChange={(e) => handleChangeForm(e.target.value, stateName, "order")}
                                placeholder={this.props.language["input_order"] || "l_input_order"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>order2</label>
                            <InputNumber value={inputValues.order2 || ""} onValueChange={(e) => handleChangeForm(e.target.value, stateName, "order2")}
                                placeholder={this.props.language["input_order2"] || "l_input_order2"} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label>type</label>
                            <InputText value={inputValues.type || ""} onChange={(e) => handleChangeForm(e.target.value, stateName, "type")}
                                placeholder={this.props.language["input_type"] || "l_input_type"} />
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        categories: state.products.categories,
        productCates: state.products.productCates,
        usedivision: true,
        usecate: false,
        usesubcate: false,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog);
