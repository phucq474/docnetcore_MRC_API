import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { PureComponent } from "react";
import imageprofile from "../../asset/images/img_nhanvien.png";
import RegionDropDownList from "../Controls/RegionDropDownList";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { connect } from "react-redux";

const lstGender = [
  { value: 1, name: "Female" },
  { value: 2, name: "Male" },
];
const lstmarital = [
  { value: 1, name: "Single" },
  { value: 2, name: "Married" },
];
const w100 = { width: "100%" };

class EmployeePersonalInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickImage = this.onClickImage.bind(this);
  }
  onClickImage() {
    this.inputElement.click();
  }
  render() {
    const info = this.props.EmployeeInfo;
    console.log("info.imageUrl", info.imageUrl);
    return (
      <Card
        className="p-shadow-10"
        title="Thông tin cá nhân"
        style={{ height: "100%", display: "flex", justifyContent: "center" }}
      >
        <div className="p-grid">
          <div className="p-col-12 p-md-3 p-sm-12">
            <input
              style={{ width: "100%" }}
              onClick={this.onClickImage}
              src={info.imageUrl ? info.imageUrl : imageprofile}
              type="image"
              id="imgProfile"
              alt="imgProfile"
            ></input>
            <input
              type="file"
              ref={(input) => (this.inputElement = input)}
              onChange={this.props.onChangeImgHandler}
              style={{ display: "none" }}
            ></input>
          </div>
          <div className="p-col-12 p-md-9 p-sm-12">
            <div className="p-fluid p-formgrid p-grid">
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["lastname"] || "l_lastname"}
                </label>
                <InputText
                  className="w-100"
                  id="lastName"
                  value={info.lastName || ""}
                  onChange={this.props.handerchangeInput}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["firstname"] || "l_firstname"}
                </label>
                <InputText
                  className="w-100"
                  id="fisrtName"
                  value={info.fisrtName || ""}
                  onChange={this.props.handerchangeInput}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["fullname"] || "l_fullname"}
                </label>
                <InputText
                  className="w-100"
                  disabled={true}
                  id="fullName"
                  value={info.fullName || ""}
                  onChange={this.props.handerchangeInput}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["gender"] || "l_gender"}
                </label>
                <Dropdown
                  className="w-100"
                  id="gender"
                  key={lstGender.value}
                  value={info.gender}
                  options={lstGender}
                  placeholder="Select an Option"
                  optionLabel="name"
                  filter={true}
                  filterPlaceholder="Select an Option"
                  filterBy="name"
                  showClear={true}
                  onChange={this.props.handlerchangeDropDown}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["birthday"] || "l_birthday"}
                </label>
                <Calendar
                  monthNavigator
                  yearNavigator
                  yearRange="1900:2021"
                  dateFormat="yy-mm-dd"
                  id="birthday"
                  showIcon
                  value={info.birthday ? new Date(info.birthday) : null}
                  onChange={this.props.handerchangeInput}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["employee_marital_status"] ||
                    "employee_marital_status"}
                </label>
                <Dropdown
                  className="w-100"
                  id="marital"
                  key={lstmarital.value}
                  options={lstmarital}
                  value={info.marital}
                  placeholder="Select an Option"
                  optionLabel="name"
                  filterBy="name"
                  showClear={true}
                  onChange={this.props.handlerchangeDropDown}
                ></Dropdown>
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>Email</label>
                <InputText
                  className="w-100"
                  id="email"
                  value={info.email || ""}
                  onChange={this.props.handerchangeInput}
                ></InputText>
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["phone"] || "phone"}
                </label>
                <InputMask
                  mask="(9999) 999 999"
                  className="w-100"
                  id="mobile"
                  value={info.mobile || ""}
                  onChange={this.props.handerchangeInput}
                ></InputMask>
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["permanent_address"] ||
                    "l_permanent_address"}
                </label>
                <InputText
                  className="w-100"
                  id="address"
                  value={info.address || ""}
                  onChange={this.props.handerchangeInput}
                ></InputText>
              </div>
              {/* <div className="p-field p-col-12 p-md-4 p-sm-6" style={{ overflow: 'hidden', }}>
                                <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["temporary_address"] || "l_temporary_address"}</label>
                                <InputText
                                    className="w-100"
                                    id="temporaryAddress"
                                    value={info.temporaryAddress || ""}
                                    onChange={this.props.handerchangeInput}
                                />
                            </div> */}
              {/* <div className="p-field p-col-12 p-md-4 p-sm-6" style={{ overflow: 'hidden', }}>
                                <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["current_city"] || "l_current_city"}</label>
                                <InputText
                                    className="w-100"
                                    id="city"
                                    value={info.city || ""}
                                    onChange={this.props.handerchangeInput} />
                            </div> */}
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["current_city"] || "l_current_city"}
                </label>
                <Dropdown
                  id="cityId"
                  key={this.props.listCity.value}
                  options={this.props.listCity}
                  onChange={this.props.handlerchangeDropDown}
                  value={info.cityId}
                  placeholder={
                    this.props.language["select_an_option"] ||
                    "l_select_an_option"
                  }
                  optionLabel="name"
                  autoWidth={true}
                  filter={true}
                  filterPlaceholder={
                    this.props.language["select_an_option"] ||
                    "l_select_an_option"
                  }
                  filterBy="name"
                  showClear={true}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["start_date"] || "l_start_date"}
                </label>
                <Calendar
                  monthNavigator
                  yearNavigator
                  yearRange="1900:2021"
                  dateFormat="yy-mm-dd"
                  id="startDate"
                  showIcon
                  value={info.startDate ? new Date(info.startDate) : null}
                  onChange={this.props.handerchangeInput}
                />
              </div>
              <div
                className="p-field p-col-12 p-md-4 p-sm-6"
                style={{ overflow: "hidden" }}
              >
                <label style={{ whiteSpace: "nowrap" }}>
                  {this.props.language["old_code"] || "l_old_code"}
                </label>
                <InputText
                  className="w-100"
                  id="oldCode"
                  value={info.oldCode || ""}
                  onChange={this.props.handerchangeInput}
                ></InputText>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeePersonalInfo);
