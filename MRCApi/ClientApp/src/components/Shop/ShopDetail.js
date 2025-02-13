import React, { PureComponent } from "react";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import RegionDDL from "./../Controls/RegionDropDownList";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreatorsShop } from "../../store/ShopController";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import "./customcss.css";
import ChannelDropDownList from "../Controls/ChannelDropDownList";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import SupplierDropDownList from "../Controls/SupplierDropDownList";
import { getLogin } from "../../Utils/Helpler";

class ShopDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setShow: (ishow) => {
        this.setState({ show: ishow });
      },
      show: false,
      shop: {
        shopCode: "",
        shopName: "",
        shopAlias: "",
        address: "",
        addressVN: "",
        area: "",
        province: "",
      },
      datas: [],
      validated: {
        shopCode: true,
        shopAlias: true,
        shopNameVN: true,
        dealerId: true,
        monthlyFrequency: true,
      },
      visible: false,
      insertTable: false,
      updateTable: false,
      alert: {},
    };
    this.storeType = [
      { name: "GT", value: "GT" },
      { name: "MT", value: "MT" },
    ];
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(id, value) {
    this.setState({
      [id]: value === null ? "" : value,
      downloaded: 0,
    });
    this.props.handleChangeDropDown(id, value);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.actionName === "Update") {
      this.setState({
        channelId: nextProps.inputValues.channelId,
        customerId: nextProps.inputValues.customerId,
      });
      return true;
    }
  }
  ////
  render() {
    const footer = (
      <div>
        <Button
          label={this.props.language["close"] || "l_close"}
          className="p-button-danger"
          onClick={this.close}
        />
        <Button
          label={
            this.props.isEdit === true
              ? `${this.props.language["update"] || "l_update"}`
              : `${this.props.language["create"] || "create"}`
          }
          onClick={this.onCreate}
        ></Button>
      </div>
    );
    const {
      footerAction,
      displayAciton,
      handleActionDialog,
      actionName,
      stateName,
      handleChange,
      inputValues,
      handleChangeInput,
      onChange,
      handleBodyTableAction,
      handleCalendar,
      handleInsertTable,
      typeActionTable,
    } = this.props;
    return (
      <div className="p-fluid">
        <Toast ref={(el) => (this.toast = el)} />
        <Dialog
          baseZIndex={100}
          footer={footerAction(false)}
          onHide={() => handleActionDialog(false)}
          header={actionName}
          visible={displayAciton}
          className="p-dialog p-component p-dialog-maximized p-dialog-enter-done p-dialog-contents"
          modal={true}
        >
          <div className="p-grid">
            <div className="p-field p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["channel"] || "channel"}</label>
              <ChannelDropDownList
                id="channelId"
                accId={this.props.accId}
                onChange={this.handleChange}
                value={inputValues.channelId}
              />
            </div>
            <div className="p-field p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["customer"] || "l_customer"}</label>
              <CustomerDropDownList
                id="customerId"
                mode="single"
                accId={this.props.accId}
                onChange={this.handleChange}
                value={inputValues.customerId}
              />
            </div>
            {/* <div className="p-field p-col-3 p-md-3 p-sm-6">
                            <label>{this.props.language["supplier"] || "l_supplier"}</label>
                            <SupplierDropDownList
                                id='supplierId'
                                onChange={this.handleChange}
                                value={this.state.supplierId} />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label>{this.props.language["store_type"] || "l_store_type"}</label>
                            <div>
                                <Dropdown value={inputValues.storeType} options={this.storeType} filter showClear
                                    onChange={(e) => handleChangeInput(e.value, stateName, "storeType")} optionLabel="name"
                                    placeholder={this.props.language["select_store_type"] || "l_select_store_type"} />
                            </div>
                        </div> */}
            <div
              className="p-field p-col-3 p-md-3 p-sm-6"
              style={{
                display:
                  getLogin().accountName === "MARICO MT" ? "block" : "none",
              }}
            >
              <label>{this.props.language["code_KH"] || "l_code_KH"}</label>
              <span className="p-float-label">
                <div className="p-inputgroup">
                  <InputText
                    id="customerCode"
                    value={inputValues.customerCode}
                    onChange={(e) =>
                      handleChangeInput(
                        e.target.value,
                        stateName,
                        "customerCode"
                      )
                    }
                  />
                </div>
              </span>
            </div>
            <div className="p-field p-col-3 p-md-3 p-sm-6">
              <label>
                {this.props.language["shop_code"] || "l_shop_code"}*
              </label>
              <span className="p-float-label">
                <div className="p-inputgroup">
                  <InputText
                    disabled={!this.props.isEdit ? false : true}
                    className={
                      this.state.shop.shopCode
                        ? "w-100"
                        : "w-100 borderf-danger"
                    }
                    id="shopCode"
                    value={inputValues.shopCode}
                    onChange={(e) =>
                      handleChangeInput(e.target.value, stateName, "shopCode")
                    }
                  />
                  <Button
                    icon={inputValues.shopCode ? "pi pi-check" : "pi pi-times"}
                    className={
                      inputValues.shopCode
                        ? "p-button-success"
                        : "p-button-danger"
                    }
                  />
                </div>
              </span>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorShopCode || ""}
              </small>
            </div>
            <div className="p-field p-col-3 p-md-3 p-sm-6">
              <label>
                {this.props.language["shop_name"] || "l_shop_name"}*
              </label>
              <span className="p-float-label">
                <span className="p-float-label">
                  <div className="p-inputgroup">
                    <InputText
                      className={
                        inputValues.shopName ? "w-100" : "w-100 border-danger"
                      }
                      id="shopName"
                      value={inputValues.shopName}
                      onChange={(e) =>
                        handleChangeInput(e.target.value, stateName, "shopName")
                      }
                    />
                    <Button
                      icon={
                        inputValues.shopName ? "pi pi-check" : "pi pi-times"
                      }
                      className={
                        inputValues.shopName
                          ? "p-button-success"
                          : "p-button-danger"
                      }
                    />
                  </div>
                </span>
              </span>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorShopName || ""}
              </small>
            </div>
            <div className="p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["area"] || "l_area"}</label>
              <RegionDDL
                regionType="Area"
                parent=""
                id="area"
                onChange={handleChange}
                accId={this.props.accId}
                value={inputValues.area}
              ></RegionDDL>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorArea || ""}
              </small>
            </div>
            <div className="p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["province"] || "province"}</label>
              <RegionDDL
                regionType="Province"
                parent={inputValues.area}
                id="provinceId"
                onChange={handleChange}
                accId={this.props.accId}
                value={inputValues.provinceId}
              ></RegionDDL>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorProvinceId || ""}
              </small>
            </div>
            <div className="p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["district"] || "district"}</label>
              <RegionDDL
                regionType="District"
                parent={inputValues.provinceId}
                id="districtId"
                onChange={handleChange}
                accId={this.props.accId}
                value={inputValues.districtId}
              ></RegionDDL>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorDistrictId || ""}
              </small>
            </div>
            <div className="p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["town"] || "town"}</label>
              <RegionDDL
                regionType="Town"
                parent={inputValues.districtId}
                id="townId"
                onChange={handleChange}
                accId={this.props.accId}
                value={inputValues.townId}
              ></RegionDDL>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorTownId || ""}
              </small>
            </div>
            <div className=" p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["address"] || "address"}*</label>
              <div className="p-inputgroup">
                <InputText
                  className="w-100"
                  id="address"
                  value={inputValues.address}
                  onChange={(e) =>
                    handleChangeInput(e.target.value, stateName, "address")
                  }
                />
                <Button
                  icon={inputValues.address ? "pi pi-check" : "pi pi-times"}
                  className={
                    inputValues.address ? "p-button-success" : "p-button-danger"
                  }
                />
              </div>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorAddress || ""}
              </small>
            </div>
            <div className=" p-col-3 p-md-3 p-sm-6">
              <label>
                {this.props.language["close_date"] || "l_close_date"}
              </label>
              <div className="p-inputgroup">
                <Calendar
                  value={inputValues.closedDate}
                  onChange={(e) =>
                    handleChangeInput(e.value, stateName, "closedDate")
                  }
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
              <small className="p-invalid p-d-block" style={{ color: "red" }}>
                {inputValues.errorCloseDate || ""}
              </small>
            </div>

            <div className="p-field p-col-3 p-md-3 p-sm-6">
              <label>{this.props.language["frequency"] || "l_frequency"}</label>
              <div className="p-inputgroup">
                <InputText
                  keyfilter="int"
                  className={
                    inputValues.frequency >= 0 ? "w-100" : "w-100 border-danger"
                  }
                  id="frequency"
                  value={inputValues.frequency}
                  onChange={(e) =>
                    handleChangeInput(
                      parseInt(e.target.value),
                      stateName,
                      "frequency"
                    )
                  }
                />
                <Button
                  icon={
                    inputValues.frequency >= 0 ? "pi pi-check" : "pi pi-times"
                  }
                  className={
                    inputValues.frequency >= 0
                      ? "p-button-success"
                      : "p-button-danger"
                  }
                />
              </div>
              <Slider
                step={1}
                id="frequency"
                value={inputValues.frequency}
                max={8}
                onChange={(e) => handleChange("frequency", parseInt(e.value))}
              />
            </div>
            <div className="p-field p-col-3 p-md-2 p-sm-6">
              <label>{this.props.language["longitude"] || "l_longitude"}</label>
              <span className="p-float-label">
                <InputNumber
                  className="w-100"
                  id="longitude"
                  mode="decimal"
                  maxFractionDigits={10}
                  useGrouping={false}
                  minFractionDigits={8}
                  value={inputValues.longitude}
                  onValueChange={(e) =>
                    handleChangeInput(e.target.value, stateName, "longitude")
                  }
                />
              </span>
            </div>

            <div className="p-field p-col-3 p-md-2 p-sm-6">
              <label>{this.props.language["latitude"] || "l_latitude"}</label>
              <span className="p-float-label">
                <InputNumber
                  className="w-100"
                  id="latitude"
                  mode="decimal"
                  value={inputValues.latitude}
                  maxFractionDigits={10}
                  minFractionDigits={8}
                  useGrouping={false}
                  onValueChange={(e) =>
                    handleChangeInput(e.target.value, stateName, "latitude")
                  }
                />
              </span>
            </div>
            {actionName === "Update" && (
              <div className="p-field p-col-3 p-md-1 p-sm-6">
                <label>{this.props.language["status"] || "l_status"} : </label>
                <br />
                <div style={{ paddingTop: 6 }}>
                  <Checkbox
                    inputId="status"
                    checked={inputValues.status || false}
                    onChange={(e) =>
                      handleChangeInput(e.checked, stateName, "status")
                    }
                  />
                  <small htmlFor="status">
                    {inputValues.status ? " Active" : " InActive"}
                  </small>
                </div>
                <small className="p-invalid p-d-block" style={{ color: "red" }}>
                  {inputValues.errorStatus || ""}
                </small>
              </div>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    errors: state.shops.errors,
    loading: state.shops.loading,
    results: state.shops.results,
    language: state.languageList.language,
    shopFormat: state.shops.shopFormat,
    usearea: true,
    useprovince: true,
    regions: state.regions.regions,
  };
}
export default connect(mapStateToProps, (dispatch) =>
  bindActionCreators(actionCreatorsShop, dispatch)
)(ShopDetail);
