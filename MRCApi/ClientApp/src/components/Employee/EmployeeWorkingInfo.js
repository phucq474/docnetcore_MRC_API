import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { PureComponent } from "react";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { connect } from "react-redux";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
const lstUniform = [
  { value: "S", name: "S" },
  { value: "M", name: "M" },
  { value: "L", name: "L" },
  { value: "XL", name: "XL" },
];

class EmployeeWorkingInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.lstInsuranceStatusId = [
      {
        value: 1,
        name: `${this.props.language["not_joined_yet"] || "l_not_joined_yet"}`,
      },
      { value: 2, name: `${this.props.language["joined"] || "l_joined"}` },
    ];
  }
  parentBodyTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.ParentCode}</strong>
        <br></br>
        <label>{rowData.ParentName}</label>
      </div>
    );
  }
  render() {
    const info = this.props.WorkInfo;
    const {
      dateFrom,
      dateTo,
      checkBoxParent,
      isSaveParent,
      btnSaveParent,
      dateFromPosition,
      dateToPosition,
      checkBoxPosition,
      isSavePosition,
      btnSavePosition,
    } = this.props;

    return (
      <Card
        className="p-shadow-10"
        title="Thông tin làm việc"
        style={{ height: "100%", display: "flex", justifyContent: "center" }}
      >
        {/* <ConfirmPopup target={document.getElementById('typeId')} visible={confirmDialog} onHide={() => handleConfirmDialog(false)}
                    message="Are you sure you want to proceed?"
                    icon="pi pi-exclamation-triangle" accept={Accept} reject={() => handleConfirmDialog(false)} /> */}
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12" style={{ overflow: "hidden" }}>
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["employee_code"] || "employee_code"}
            </label>
            <InputText
              className="w-100"
              id="employeeCode"
              disabled={!this.props.CanEdit}
              value={info.employeeCode || ""}
              onChange={this.props.handlerchangeInput}
            ></InputText>
          </div>
          <div
            className="p-field p-col-12 p-md-4 p-sm-4"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["position"] || "l_position"}
            </label>
            <EmployeeTypeDropDownList
              id="typeId"
              type=""
              value={info.typeId}
              //onChange={this.props.handlerchangeDropDown}
              onChange={this.props.handleChangeDropdownlistPosition}
              accId={this.props.accId}
            ></EmployeeTypeDropDownList>
          </div>
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["from_to_date"] || "l_from_to_date"}
            </label>
            <Calendar
              showIcon
              monthNavigator
              yearNavigator
              yearRange="2010:2030"
              id="fromtodatePosition"
              selectionMode="range"
              dateFormat="yy-mm-dd"
              value={
                this.props.PositionInfo.fromtodate
                  ? this.props.PositionInfo.fromtodate
                  : [new Date(), new Date()]
              }
              // monthNavigator yearNavigator yearRange="2010:2030"
              onChange={(e) =>
                this.props.handleChangeDatePosition_Group(e, "EmployeePosition")
              }
            ></Calendar>
          </div>
          <div
            className="p-field p-col-12 p-md-2 p-sm-2"
            style={{ overflow: "hidden" }}
          >
            {isSavePosition && (
              <>
                <label>
                  {this.props.language["save_position"] || "l_save_position"}
                </label>
                <Button
                  label={this.props.language["save"] || "l_save"}
                  className="p-button-secondary"
                  icon="pi pi-save"
                  onClick={btnSavePosition}
                ></Button>
              </>
            )}
          </div>
          <div className="p-field p-col-12" style={{ overflow: "hidden" }}>
            <DataTable value={this.props.positionDetail} dataKey="RN">
              <Column style={{ width: 50 }} header="No." field="RN"></Column>
              <Column
                //body={this.parentBodyTemplate}
                header={this.props.language["position"] || "l_position"}
                field="PositionName"
              ></Column>
              <Column
                style={{ width: "30%" }}
                header={this.props.language["fromdate"] || "l_fromdate"}
                field="FromDate"
                body={(rowData, e) => dateFromPosition(rowData, e)}
              ></Column>
              <Column
                style={{ width: "30%" }}
                header={this.props.language["todate"] || "l_todate"}
                field="ToDate"
                body={(rowData, e) => dateToPosition(rowData, e)}
              ></Column>
              <Column
                header={this.props.language["delete"] || "l_delete"}
                body={(rowData, e) => checkBoxPosition(rowData, e)}
                style={{ textAlign: "center", width: "7%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
        <hr />
        <div className="p-fluid p-grid" style={{ marginTop: "10px" }}>
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["manager"] || "l_manager"}
            </label>
            <EmployeeDropDownList
              type=""
              typeId={0}
              mode="single"
              id="ParentId"
              parentId={null}
              showClear={false}
              value={this.props.ParentInfo.ParentId}
              onChange={this.props.handleChangeDropdownlistParent}
              accId={this.props.accId}
            />
          </div>
          <div
            className="p-field p-col-12 p-md-4 p-sm-4"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["from_to_date"] || "l_from_to_date"}
            </label>
            <Calendar
              showIcon
              monthNavigator
              yearNavigator
              yearRange="2010:2030"
              id="fromtodate"
              selectionMode="range"
              dateFormat="yy-mm-dd"
              value={
                this.props.ParentInfo.fromtodate
                  ? this.props.ParentInfo.fromtodate
                  : [new Date(), new Date()]
              }
              // monthNavigator yearNavigator yearRange="2010:2030"
              onChange={(e) =>
                this.props.handleChangeDateParent_Group(e, "EmployeeParent")
              }
            ></Calendar>
          </div>

          <div className="p-field p-col-12 p-md-2 p-sm-2">
            {isSaveParent && (
              <>
                {" "}
                <label>
                  {this.props.language["save_parent"] || "l_save_parent"}
                </label>
                <Button
                  label={this.props.language["save"] || "l_save"}
                  className="p-button-secondary"
                  icon="pi pi-save"
                  onClick={btnSaveParent}
                ></Button>{" "}
              </>
            )}
          </div>
        </div>
        <br />
        <div className="p-fluid">
          <DataTable value={this.props.ParentDetail} dataKey="RN">
            <Column style={{ width: 50 }} header="No." field="RN"></Column>
            <Column
              body={this.parentBodyTemplate}
              header={this.props.language["parentname"] || "l_parentname"}
              field="ParentName"
            ></Column>
            <Column
              style={{ width: "20%" }}
              header={this.props.language["fromdate"] || "l_fromdate"}
              body={(rowData, e) => dateFrom(rowData, e)}
            ></Column>
            <Column
              style={{ width: "20%" }}
              header={this.props.language["todate"] || "l_todate"}
              body={(rowData, e) => dateTo(rowData, e)}
            ></Column>
            <Column
              header={this.props.language["delete"] || "l_delete"}
              body={(rowData, e) => checkBoxParent(rowData, e)}
              style={{ textAlign: "center", width: "7%" }}
            ></Column>
          </DataTable>
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
)(EmployeeWorkingInfo);
