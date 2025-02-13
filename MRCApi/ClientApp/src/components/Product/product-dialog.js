import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LanguageAPI } from "../../store/LanguageController";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import ProductDropDownList from "../Controls/ProductDropDownList";
import moment from "moment";
import { CategoryApp } from "../Controls/CategoryMaster";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import ShopDropDownList from "../Controls/ShopDropDownList";
import { getLogin } from "../../Utils/Helpler";

class ProductPriceDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: { year: parseInt(moment(new Date()).format("YYYY")) },
      month: { month: parseInt(moment(new Date()).format("MM")) },
    };
  }
  handleChange = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
    this.props.handleChangeDropDown(id, value);
  };
  render() {
    const {
      displayDialog,
      inputValues,
      displayOnHide,
      footerAction,
      handleInput,
      stateName,
      months,
      years,
      handleDropDown,
      handleProductDropdown,
    } = this.props;
    let AccountId = JSON.parse(localStorage.getItem("USER")).accountId;
    let htmlFilter = [];
    htmlFilter.push(
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-3 p-md-3">
          <label>
            {this.props.language["from_to_date"] || "l_from_to_date"}
          </label>
          <Calendar
            fluid
            value={inputValues.dates}
            onChange={(e) => handleDropDown(e, stateName, "fromtodate")}
            dateFormat="yy-mm-dd"
            inputClassName="p-inputtext"
            id="fromDate"
            selectionMode="range"
            inputStyle={{ width: "91.5%", visible: false }}
            style={{ width: "100%" }}
            showIcon
          />
          <small style={{ color: "red" }} className="p-invalid p-d-block">
            {inputValues.errorDates || ""}
          </small>
        </div>
        {/* <div className="p-field p-col-3 p-md-3 p-sm-6">
                    <label>{this.props.language["customer"] || "l_customer"}</label>
                    <CustomerDropDownList
                        id='customerId'
                        mode='single'
                        onChange={this.handleChange}
                        value={inputValues.customerId} />
                </div>
                <div className="p-field p-col-12 p-md-3 p-sm-6">
                    <label>{this.props.language["store_name"] || "l_store_name"}</label>
                    <ShopDropDownList
                        id="shopId"
                        disabled={this.state.disabled}
                        employeeId={inputValues.employeeId ? inputValues.employeeId : 0}
                        onChange={this.handleChange}
                        value={inputValues.shopId ? inputValues.shopId : 0}
                    // disabled={nameAction === 'Update' ? true : false}
                    />
                </div> */}
        <CategoryApp {...this} />
        <div className="p-field p-col-12 p-md-3">
          <label htmlFor="basic">
            {this.props.language["ProductName"] || "l_ProductName"}
          </label>
          <div>
            <ProductDropDownList
              value={inputValues.productId}
              id="productId"
              onChange={(id, value) => handleProductDropdown(id, value)}
              brandId={this.state.brandId}
              divisionId={this.state.divisionId}
            ></ProductDropDownList>
            <small style={{ color: "red" }} className="p-invalid p-d-block">
              {inputValues.errorProductCode || ""}
            </small>
          </div>
        </div>
        {getLogin().accountName === "MARICO MT" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["Price"] || "l_Price"}
            </label>
            <div>
              <InputNumber
                value={inputValues.price || ""}
                placeholder="Price"
                onValueChange={(e) => handleInput(e, stateName, "price")}
                minFractionDigits={2}
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorPrice || ""}
              </small>
            </div>
          </div>
        )}
        {getLogin().accountName === "MARICO MT" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["barrel_price"] || "l_barrel_price"}
            </label>
            <div>
              <InputNumber
                value={inputValues.barrelPrice || ""}
                placeholder="barrelPrice"
                onValueChange={(e) => handleInput(e, stateName, "barrelPrice")}
                minFractionDigits={2}
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorBarrelPrice || ""}
              </small>
            </div>
          </div>
        )}
        {getLogin().accountName === "Fonterra" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["recommend_sheft_price"] ||
                "l_recommend_sheft_price"}
            </label>
            <div>
              <InputNumber
                value={inputValues.recommendSheftPrice || ""}
                placeholder="recommend sheft price"
                onValueChange={(e) =>
                  handleInput(e, stateName, "recommendSheftPrice")
                }
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorRecommendSheftPrice || ""}
              </small>
            </div>
          </div>
        )}
        {getLogin().accountName === "Fonterra" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["retailer_price"] || "l_retailer_price"}
            </label>
            <div>
              <InputNumber
                value={inputValues.retailerPrice || ""}
                placeholder="retailer price"
                onValueChange={(e) =>
                  handleInput(e, stateName, "retailerPrice")
                }
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorRetailerPrice || ""}
              </small>
            </div>
          </div>
        )}
        {getLogin().accountName === "Fonterra" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["retailer_price_non_vat"] ||
                "l_retailer_price_non_vat"}
            </label>
            <div>
              <InputNumber
                value={inputValues.retailerPriceNonVAT || ""}
                placeholder="retailer price non vat"
                onValueChange={(e) =>
                  handleInput(e, stateName, "retailerPriceNonVAT")
                }
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorRetailerPriceNonVAT || ""}
              </small>
            </div>
          </div>
        )}
        {getLogin().accountName === "Fonterra" && (
          <div className="p-field p-col-12 p-md-3">
            <label htmlFor="basic">
              {this.props.language["barrel_price"] || "l_barrel_price"}
            </label>
            <div>
              <InputNumber
                value={inputValues.barrelPrice || ""}
                placeholder="barrelPrice"
                onValueChange={(e) => handleInput(e, stateName, "barrelPrice")}
              />
              <small style={{ color: "red" }} className="p-invalid p-d-block">
                {inputValues.errorBarrelPrice || ""}
              </small>
            </div>
          </div>
        )}
      </div>
    );
    return (
      <React.Fragment>
        <Dialog
          header="Header"
          visible={displayDialog}
          style={{ width: "80vw" }}
          footer={footerAction("displayBasics")}
          onHide={() => displayOnHide("false")}
        >
          {htmlFilter}
        </Dialog>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    categories: state.products.categories,
    usedivision: true,
    usecate: true,
    usesubcate: false,
    usesegment: false,
    usesubsegment: false,
    usebrand: true,
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductPriceDialog);
