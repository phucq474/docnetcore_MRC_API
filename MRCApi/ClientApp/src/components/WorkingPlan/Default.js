import React, { Component } from "react";

import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import {
  getToken,
  URL,
  download,
  HelpPermission,
  getLogin,
} from "../../Utils/Helpler";
import { bindActionCreators } from "redux";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { Accordion, AccordionTab } from "primereact/accordion";
import { connect } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ShiftDropDownList from "../Controls/ShiftDropDownList";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import { RegionActionCreate } from "../../store/RegionController";
import { RegionApp } from "../Controls/RegionMaster";
import { Checkbox } from "primereact/checkbox";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class WorkingPlanDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      shopAvailable: [],
      shopPlan: [],
      selectedAvailable: null,
      selectedPlan: null,
      planDate: new Date(),
      TypeId: 0,
      lisEmployee: [],
      accId: null,
      Employee: null,
      Sup: null,
      TypeId: null,
    };
    this.PageId = 3087;
    this.arrRandomId = [];
    this.handleChange = this.handleChange.bind(this);
    this.LoadData = this.LoadData.bind(this);
    this.onMoveToPlan = this.onMoveToPlan.bind(this);
    this.onMoveToAvailable = this.onMoveToAvailable.bind(this);
    this.onMoveAllToPlan = this.onMoveAllToPlan.bind(this);
    this.onMoveAllToAvailable = this.onMoveAllToAvailable.bind(this);
    this.LoadShift = this.LoadShift.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.CheckValidShift = this.CheckValidShift.bind(this);
  }

  async componentDidMount() {
    await this.LoadShift(this.state.accId);
  }

  SavePlan = async (data) => {
    this.setState({ loading: true });
    const url = URL + "WorkingPlan/SaveWorkingPlanDaily";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        accId: this.state.accId || "",
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: error,
      });
      this.setState({ loading: false });
    }
  };

  LoadShift = (accId) => {
    this.props.WorkingPlanController.GetShiftList(accId);
    this.props.RegionController.GetListRegion(accId);
    this.props.EmployeeController.GetEmployeeDDL(accId).then(() =>
      this.setState({ lisEmployee: this.props.employeeDDL })
    );
  };

  handleChange(id, value) {
    if (id === "Employee") {
      const listEm = this.state.lisEmployee;
      const tmpEm = listEm.find((p) => p.id === value);
      this.setState({
        [id]: value === null ? "" : value,
        TypeId: tmpEm ? tmpEm.typeId : null,
        shopPlan: [],
        shopAvailable: [],
      });
    } else if (id === "TypeId") {
      this.setState({
        shopPlan: [],
        shopAvailable: [],
        Employee: id === "TypeId" ? null : value,
        [id]: value === null ? "" : value,
      });
    } else if (id === "accId") {
      this.setState({
        [id]: value === null || value === undefined ? "" : value,
        shopPlan: [],
        shopAvailable: [],
        TypeId: null,
        Employee: null,
        Sup: null,
      });
      this.LoadShift(value);
    } else {
      this.setState({ [id]: value === null ? "" : value });
    }
  }

  LoadData() {
    if (!this.state.TypeId) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: `${
          this.props.language["please_select_position"] ||
          "l_please_select_position"
        }`,
      });
      return;
    }
    if (!this.state.Employee) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: `${
          this.props.language["please_select_employee"] ||
          "l_please_select_employee"
        }`,
      });
      return;
    }
    this.arrRandomId = [];
    this.setState({ loading: true });
    let ProvinceId = "";
    if (this.state.province) {
      this.state.province.forEach((item) => {
        ProvinceId += "," + item;
      });
    }
    var data = {
      EmployeeId: this.state.Employee ? this.state.Employee : null,
      CustomerId: this.state.customerId ? this.state.customerId : null,
      Area: this.state.area ? this.state.area : null,
      ProvinceId: ProvinceId ? ProvinceId : null,
      ShopCode: this.state.shopCode ? this.state.shopCode : null,
      PlanDate: parseInt(moment(this.state.planDate).format("YYYYMMDD"), 0),
    };
    this.props.WorkingPlanController.FilterDefault(data, this.state.accId).then(
      (val) => {
        if (
          this.props.resultFilter.table.length > 0 ||
          this.props.resultFilter.table1.length > 0
        ) {
          this.toast.show({
            severity: "success",
            summary: "Thông báo",
            detail: "Thành công",
          });
        } else {
          this.toast.show({
            severity: "error",
            summary: "Thông báo",
            detail: "Không có dữ liệu",
          });
        }
        this.setState({
          shopAvailable: this.props.resultFilter.table,
          shopPlan: this.props.resultFilter.table1,
          selectedAvailable: null,
          selectedPlan: null,
          loading: false,
        });
      }
    );
  }

  CheckValidShift(planFrom, planTo, addFrom, addTo) {
    if (planFrom && planTo && addFrom && addTo) {
      let hourPlanFrom = planFrom.substring(0, 2);
      let minutePlanFrom = planFrom.substring(4, 2);

      let hourPlanTo = planTo.substring(0, 2);
      let minutePlanTo = planTo.substring(4, 2);

      let hourAddFrom = addFrom.substring(0, 2);
      let minuteAddFrom = addFrom.substring(4, 2);

      let hourAddTo = addTo.substring(0, 2);
      let minuteAddTo = addTo.substring(2, 4);

      if (hourAddFrom >= hourPlanFrom && hourAddFrom < hourPlanTo) return false;
      if (hourAddTo > hourPlanFrom && hourAddTo <= hourPlanTo) return false;
      if (hourAddTo === hourPlanFrom && minuteAddTo >= minutePlanFrom)
        return false;
      return true;
    } else return true;
  }

  onClickSave() {
    if (!this.state.Employee) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn nhân viên",
      });
      return;
    }
    if (!this.state.planDate) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn ngày làm việc",
      });
      return;
    } else if (
      moment(this.state.planDate).format("YYYYMMDD") <
        moment(new Date()).format("YYYYMMDD") &&
      !getLogin().isAdmin
    ) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Không thể thêm lịch cho ngày quá khứ",
      });
      return;
    }
    var User = JSON.parse(localStorage.getItem("USER"));
    if (User.accountId === 3) {
      if (User.groupPosition === "PG") {
        var weekNow = moment(new Date()).format("W");
        var weekPlanDate = moment(this.state.planDate).format("W");
        if (weekNow === weekPlanDate) {
          this.toast.show({
            severity: "warn",
            summary: "Thông báo",
            detail: `${
              this.props.language["invalid_schedule"] || "l_invalid_schedule"
            }`,
          });
          return;
        }
      }
    }
    let ProvinceId = "";
    if (this.state.province) {
      this.state.province.forEach((item) => {
        ProvinceId += "," + item;
      });
    }
    var data = {
      EmployeeId: this.state.Employee ? this.state.Employee : null,
      CustomerId: this.state.customerId ? this.state.customerId : null,
      Area: this.state.area ? this.state.area : null,
      ProvinceId: ProvinceId ? ProvinceId : null,
      ShopCode: this.state.shopCode ? this.state.shopCode : null,
      PlanDate: parseInt(moment(this.state.planDate).format("YYYYMMDD"), 0),
      ShopSave: JSON.stringify(this.state.shopPlan),
    };
    this.SavePlan(data).then((result) => {
      if (result.status === 200) {
        this.toast.show({
          severity: "success",
          summary: "Thông báo",
          detail: result.message,
        });
      } else if (result.status === 500)
        this.toast.show({
          severity: "error",
          summary: "Thông báo",
          detail: result.message,
        });
      this.setState({
        loading: false,
      });
    });
  }

  onMoveToPlan() {
    let infoShiftAdd = this.props.shiftLists.find(
      (a) => a.shiftCode === this.state.shiftType
    );
    if (!this.state.planDate) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn ngày làm việc",
      });
      return;
    } else if (
      moment(this.state.planDate).format("YYYYMMDD") <
        moment(new Date()).format("YYYYMMDD") &&
      !getLogin().isAdmin
    ) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Không thể thêm lịch cho ngày quá khứ",
      });
      return;
    }
    if (!this.state.shiftType) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn ca làm việc",
      });
      return;
    }
    let shopAvailable = this.state.shopAvailable;
    let shopPlan = this.state.shopPlan;
    let selectedAvailable = this.state.selectedAvailable;
    var i = shopAvailable.length;
    let position = this.state.TypeId;

    if (selectedAvailable && selectedAvailable.length > 0) {
      selectedAvailable.forEach((item) => {
        let obj = {};
        obj.shopId = item.shopId;
        obj.shopCode = item.shopCode;
        obj.shopName = item.shopName;
        obj.shiftName = infoShiftAdd.shiftName;
        obj.shiftType = this.state.shiftType;
        obj.from = infoShiftAdd.from;
        obj.to = infoShiftAdd.to;
        obj.dataKey = `${item.shopId}_${this.state.shiftType}`;
        obj.checkIn = null;
        shopPlan.push(obj);
      });

      this.setState({
        shopAvailable: shopAvailable,
        shopPlan: shopPlan,
        selectedPlan: null,
        selectedAvailable: null,
      });
    } else {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: `${
          this.props.language["not_select_shop_yet"] || "l_not_select_shop_yet"
        }`,
      });
      return;
    }
  }

  async onMoveToAvailable() {
    let shopavailable = this.state.shopAvailable;
    let shopplan = this.state.shopPlan;
    let selectedplan = this.state.selectedPlan;
    let checkShop = "";
    let position = this.state.TypeId;
    let planDate = this.state.planDate;
    let dayPlan = planDate.getDate();
    let monthPlan = planDate.getMonth() + 1;
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let monthPresent = time.getMonth() + 1;
    let dayPresent = time.getDate();
    if (selectedplan && selectedplan.length > 0) {
      await selectedplan.forEach(async (itemPlan) => {
        if (!itemPlan.checkIn) {
          let check = false;
          await shopavailable.forEach((itemAvailable) => {
            if (itemPlan.shopId !== itemAvailable.shopId) {
              check = true;
            }
          });
          let indexOfItemAvailable = shopplan.indexOf(itemPlan);
          await shopplan.splice(indexOfItemAvailable, 1);
          if (check === true) {
            let obj = {};
            obj.shopCode = itemPlan.shopCode;
            obj.shopName = itemPlan.shopName;
            obj.shopId = itemPlan.shopId;
            shopavailable.push(itemPlan);
          }
          if (
            position === 12 &&
            (hours > 17 ||
              (hours === 17 && minutes > 0) ||
              monthPresent > monthPlan ||
              (monthPresent === monthPlan && dayPresent > dayPlan))
          )
            checkShop = "Overtime";
          if (
            monthPresent > monthPlan ||
            (monthPresent === monthPlan && dayPresent > dayPlan)
          )
            checkShop = "Overtime";
        } else checkShop = "availableShop";
      });
      switch (checkShop) {
        case "availableShop": {
          return await this.Alert(
            "Cửa hàng đã CHECKIN không thể rút lịch làm việc",
            "error"
          );
        }
        case "Overtime": {
          return await this.Alert("hết thời gian để rút lịch", "error");
        }
        default:
          await this.setState({
            shopAvailable: shopavailable,
            shopPlan: shopplan,
            selectedAvailable: null,
            selectedPlan: null,
          });
      }
    } else {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: `${
          this.props.language["not_select_shop_yet"] || "l_not_select_shop_yet"
        }`,
      });
      return;
    }
  }

  onMoveAllToPlan() {
    let infoShiftAdd = this.props.shiftLists.find(
      (a) => a.shiftCode === this.state.shiftType
    );
    if (!this.state.planDate) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn ngày làm việc",
      });
      return;
    } else if (
      moment(this.state.planDate).format("YYYYMMDD") <
        moment(new Date()).format("YYYYMMDD") &&
      !getLogin().isAdmin
    ) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Không thể thêm lịch cho ngày quá khứ",
      });
      return;
    }
    if (!this.state.shiftType) {
      this.toast.show({
        severity: "warn",
        summary: "Thông báo",
        detail: "Vui lòng chọn ca làm việc",
      });
      return;
    }
    let shopavailable = this.state.shopAvailable;
    let shopplan = this.state.shopPlan;
    var i = shopavailable.length;
    let position = this.state.TypeId;

    while (i--) {
      let item = shopavailable[i];
      let obj = {};
      obj.shopId = item.shopId;
      obj.shopCode = item.shopCode;
      obj.shopName = item.shopName;
      obj.shiftName = infoShiftAdd.shiftName;
      obj.shiftType = this.state.shiftType;
      obj.from = infoShiftAdd.from;
      obj.to = infoShiftAdd.to;
      shopplan.push(obj);
    }
    this.setState({
      shopAvailable: shopavailable,
      shopPlan: shopplan,
      selectedAvailable: null,
      selectedPlan: null,
    });
  }

  async onMoveAllToAvailable() {
    let shopavailable = this.state.shopAvailable;
    let shopplan = this.state.shopPlan;
    let checkShop = null;
    let position = this.state.TypeId;
    let planDate = this.state.planDate;
    let dayPlan = planDate.getDate();
    let monthPlan = planDate.getMonth() + 1;
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let monthPresent = time.getMonth() + 1;
    let dayPresent = time.getDate();
    await shopplan.forEach(async (itemPlan) => {
      if (!itemPlan.checkIn) {
        let check = false;
        await shopavailable.forEach((itemAvailable) => {
          if (itemPlan.shopId !== itemAvailable.shopId) {
            check = true;
          }
        });
        let indexOfItemAvailable = shopplan.indexOf(itemPlan);
        await shopplan.splice(indexOfItemAvailable, 1);
        if (check === true) {
          let obj = {};
          obj.shopCode = itemPlan.shopCode;
          obj.shopName = itemPlan.shopName;
          obj.shopId = itemPlan.shopId;
          shopavailable.push(itemPlan);
        }
      }
      if (
        position === 12 &&
        (hours > 17 ||
          (hours === 17 && minutes > 0) ||
          monthPresent > monthPlan ||
          (monthPresent === monthPlan && dayPresent > dayPlan))
      )
        checkShop = "Overtime";
      if (
        monthPresent > monthPlan ||
        (monthPresent === monthPlan && dayPresent > dayPlan)
      )
        checkShop = "Overtime";
      // else if (position === 12 && ((hours > 17 || (hours === 17 && minutes > 0)) || (monthPresent > monthPlan || (monthPresent === monthPlan && dayPresent > dayPlan)))) {
      //     checkShop = 'overTime'
      //     console.log(position, time, hours, minutes)
      // }
    });
    if (checkShop)
      return await this.Alert("Đã hết thời gian rút lịch", "error");
    await this.setState({
      shopAvailable: shopavailable,
      shopPlan: shopplan,
      selectedAvailable: null,
      selectedPlan: null,
    });
  }
  Alert = (messager, typestyle) => {
    this.setState({ loading: false });
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: "Thông báo",
      detail: messager,
    });
  };
  showCheckIn = (rowData) => {
    return <Checkbox checked={rowData.checkIn ? true : false} />;
  };
  render() {
    let leftSearch = [],
      rightSearch = [],
      rightSave = [];
    leftSearch.push(
      <Button
        label={this.props.language["search"] || "search"}
        icon="pi pi-search"
        style={{ marginRight: ".25em" }}
        onClick={this.LoadData}
      />
    );
    rightSave.push(
      <Button
        tooltip={this.props.language["save"] || "save"}
        icon="pi pi-save"
        className="p-button-success"
        onClick={this.onClickSave}
      />
    );
    return (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-grid">
              <AccountDropDownList
                id="accId"
                className="p-field p-col-12 p-md-3"
                onChange={this.handleChange}
                filter={true}
                showClear={true}
                value={this.state.accId}
              />
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>
                  {this.props.language["date_plan"] || "l_date_plan"}
                </label>
                <Calendar
                  fluid
                  value={this.state.planDate}
                  onChange={(e) =>
                    this.setState({
                      planDate: e.value,
                      shopPlan: [],
                      shopAvailable: [],
                    })
                  }
                  dateFormat="yy-mm-dd"
                  inputClassName="p-inputtext"
                  id="planDate"
                  inputStyle={{ width: "91.5%", visible: false }}
                  style={{ width: "100%" }}
                  showIcon
                />
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["position"] || "position"}</label>
                <EmployeeTypeDropDownList
                  id="TypeId"
                  type=""
                  value={this.state.TypeId}
                  accId={this.state.accId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["employee"] || "employee"}</label>
                <EmployeeDropDownList
                  type=""
                  typeId={this.state.TypeId ? this.state.TypeId : 0}
                  id="Employee"
                  mode="single"
                  parentId={null}
                  value={this.state.Employee}
                  accId={this.state.accId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["customer"] || "l_customer"}</label>
                <CustomerDropDownList
                  id="customerId"
                  mode="single"
                  accId={this.state.accId}
                  value={this.state.customerId}
                  onChange={this.handleChange}
                />
              </div>
              <RegionApp {...this} />
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>
                  {this.props.language["storelist.shopcode"] ||
                    "storelist.shopcode"}
                </label>
                <InputText
                  type="text"
                  style={{ width: "100%" }}
                  placeholder={
                    this.props.language["storelist.shopcode"] ||
                    "storelist.shopcode"
                  }
                  value={this.state.shopCode || ""}
                  onChange={(e) => {
                    this.setState({
                      shopCode: e.target.value,
                    });
                  }}
                  id="shopCode"
                />
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["shift"] || "l_shift"}</label>
                <ShiftDropDownList
                  id="shiftType"
                  typeId={this.state.TypeId ? this.state.TypeId : 0}
                  onChange={this.handleChange}
                  accId={this.state.accId}
                  value={this.state.shiftType}
                />
              </div>
            </div>
            <br />
            <Toolbar left={leftSearch} right={rightSearch}></Toolbar>
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>
        <div className="p-picklist p-component" style={{ marginTop: "10px" }}>
          <div className="p-picklist-list-wrapper p-picklist-source-wrapper">
            <div className="p-picklist-header">
              {this.props.language["numberofstore"] || "numberofstore"}:{" "}
              {this.state.shopAvailable.length}
            </div>
            <ul
              className="p-picklist-list p-picklist-source"
              role="listbox"
              aria-multiselectable="true"
              style={{ height: 450 }}
            >
              <DataTable
                dataKey="shopId"
                value={this.state.shopAvailable}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 30, 50]}
                scrollable
                scrollHeight="200px"
                selection={this.state.selectedAvailable}
                onSelectionChange={(e) =>
                  this.setState({ selectedAvailable: e.value })
                }
              >
                <Column
                  selectionMode="multiple"
                  field="shopId"
                  style={{ width: "3em" }}
                />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopcode"] ||
                    "l_storelist.shopcode"
                  }
                  field="shopCode"
                  style={{ width: "10em" }}
                />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopname"] ||
                    "storelist.shopname"
                  }
                  field="shopName"
                />
              </DataTable>
            </ul>
          </div>
          <div className="p-picklist-buttons p-picklist-transfer-buttons">
            <Button
              icon="pi pi-angle-right"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveToPlan}
            />
            <Button
              icon="pi pi-angle-double-right"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveAllToPlan}
            />
            <Button
              icon="pi pi-angle-left"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveToAvailable}
            />
            <Button
              icon="pi pi-angle-double-left"
              className="p-button p-component p-button-icon-only"
              onClick={this.onMoveAllToAvailable}
            />
            {rightSave}
          </div>
          <div className="p-picklist-list-wrapper p-picklist-target-wrapper">
            <div className="p-picklist-header">
              {this.props.language["distributed"] || "l_distributed"}:{" "}
              {this.state.shopPlan.length}{" "}
              {this.props.language["menu.store"] || "menu.store"}
            </div>
            <ul
              className="p-picklist-list p-picklist-target"
              role="listbox"
              aria-multiselectable="true"
              style={{ height: 450 }}
            >
              <DataTable
                dataKey="dataKey"
                value={this.state.shopPlan}
                paginator
                rows={20}
                rowsPerPageOptions={[20, 30, 50]}
                scrollable
                scrollHeight="200px"
                selection={this.state.selectedPlan}
                onSelectionChange={(e) =>
                  this.setState({ selectedPlan: e.value })
                }
              >
                <Column selectionMode="multiple" style={{ width: "5%" }} />
                <Column
                  filter
                  header={this.props.language["shift"] || "l_shift"}
                  style={{ width: "20%", textAlign: "center" }}
                  field="shiftName"
                />
                <Column
                  filter
                  filterMatchMode="contains"
                  header={
                    this.props.language["storelist.shopname"] ||
                    "storelist.shopname"
                  }
                  field="shopName"
                  headerStyle={{ textAlign: "center" }}
                />
                <Column
                  header="Đã CheckIn"
                  style={{ width: "10%", textAlign: "center" }}
                  body={this.showCheckIn}
                />
              </DataTable>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    resultFilter: state.workingPlans.resultFilter,
    language: state.languageList.language,
    usearea: true,
    useprovince: true,
    regions: state.regions.regions,
    shiftLists: state.workingPlans.shiftLists,
    employeeDDL: state.employees.employeeDDL,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
    RegionController: bindActionCreators(RegionActionCreate, dispatch),
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkingPlanDefault);
