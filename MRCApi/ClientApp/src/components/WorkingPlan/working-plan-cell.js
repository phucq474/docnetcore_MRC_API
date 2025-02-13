import React, { Component } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import ShiftDropDownList from "../Controls/ShiftDropDownList";
import { SelectButton } from "primereact/selectbutton";
import { Panel } from "primereact/panel";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { bindActionCreators } from "redux";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { getToken, URL } from "../../Utils/Helpler";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const lstConfirm = [
  { value: 1, name: "Confirm" },
  { value: -1, name: "Reject" },
];
class WorkingPlanCell extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      loading: true,
    };
    this.handleBindData = this.handleBindData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.renderChangeShift = this.renderChangeShift.bind(this);
    this.renderTaskList = this.renderTaskList.bind(this);
  }
  showError(value) {
    this.toast.show({
      life: 5000,
      severity: "error",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  }
  showSuccess(value) {
    this.toast.show({
      severity: "success",
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: value,
    });
  }
  handleChange(id, value) {
    this.setState({ [id]: value });
  }
  handleChangeForm(e) {
    this.setState({ [e.target.id]: e.target.value });
  }
  handleBindData() {
    this.setState({ shiftDefault: this.props.dataInput.shiftDefault });
    let shiftCode = this.props.dataInput.shiftDefault;
    if (this.props.dataInput.shiftCode !== null) {
      let key = this.props.dataInput.shiftCode.split("_");
      if (key.length === 4) {
        if (parseInt(key[1]) !== 0) {
          shiftCode = this.props.dataInput.shiftDefault;
        } else {
          shiftCode = key[0];
        }
      }
    }
    if (this.props.dataInput.workDate !== "shiftName") {
      let data = {
        shopId: this.props.dataInput.shopId,
        employeeId: this.props.dataInput.employeeId,
        workDate: this.props.dataInput.workDate,
        shiftCode: shiftCode,
      };
      this.props.WorkingPlanController.GetDetail(data, this.props.accId).then(
        () => {
          if (this.props.details[0]) {
            this.setState({
              loading: false,
              dataDetails: this.props.details[0],
              isOff: this.props.details[0].isOff,
              id: this.props.details[0].id,
              shiftCode: this.props.details[0].shiftType,
              shiftType: this.props.details[0].shiftType,
              lastChanged: this.props.details[0].lastChanged,
              refId: this.props.details[0].refId,
              changeNote: this.props.details[0].changeNote,
              confirm: this.props.details[0].confirm,
              confirmNote: this.props.details[0].confirmNote,
              timeLate: this.props.details[0].timeLate,
              noteLate: this.props.details[0].noteLate,
              confirmLate: this.props.details[0].confirmLate,
              confirmNoteLate: this.props.details[0].confirmNoteLate,
              timeEarlier: this.props.details[0].timeEarlier,
              noteEarlier: this.props.details[0].noteEarlier,
              confirmEarlier: this.props.details[0].confirmEarlier,
              confirmNoteEarlier: this.props.details[0].confirmNoteEarlier,
              shopCode: this.props.details[0].shopCode,
              shopName: this.props.details[0].shopName,
              taskList: this.props.details[0]?.taskList,
            });
            if (this.props.details[0]?.isOff === 1) {
              this.setState({
                shiftCode: this.props.details[1].shiftType,
                shiftType: this.props.details[1].shiftType,
                lastChanged: this.props.details[0].shiftType,
                refId: this.props.details[1].refId,
                changeNote: this.props.details[1].changeNote,
                shopCode: this.props.details[1].shopCode,
                shopName: this.props.details[1].shopName,
              });
            }
          }
        }
      );
    } else if (this.props.dataInput.workDate === "shiftName") {
      this.setState({
        loading: false,
        shiftCode: this.props.dataInput.shiftCode,
      });
    }
  }
  async handleChangeShift() {
    let type = "Confirm";
    if (this.props.dataInput.workDate === "shiftName") type = "ChangeShift";
    else if (
      (this.state.confirm === 0 || this.state.confirm === null) &&
      this.state.confirmLate === null &&
      this.state.confirmEarlier === null
    )
      type = "ChangeDate";
    else if (this.state.isOff === 1) type = "OFF";

    let data = {
      type: type,
      id: this.state.id,
      year: this.props.dataInput.year,
      week: this.props.dataInput.week,
      shopId: this.props.dataInput.shopId,
      employeeId: this.props.dataInput.employeeId,
      workDate: type === "ChangeShift" ? null : this.props.dataInput.workDate,
      shiftOld: this.props.dataInput.shiftCode,
      shiftCode: this.state.shiftCode,
      shiftDefault: this.state.shiftDefault,
      lastChanged: this.state.lastChanged,
      confirm: this.state.confirm,
      confirmNote: this.state.confirmNote,
      confirmLate: this.state.confirmLate,
      confirmNoteLate: this.state.confirmNoteLate,
      confirmEarlier: this.state.confirmEarlier,
      confirmNoteEarlier: this.state.confirmNoteEarlier,
    };
    await this.props.WorkingPlanController.WP_ChangeShift(
      data,
      this.props.accId
    ).then(() => {
      const result = this.props.wpChangeShift;
      if (result?.result === 1) {
        this.showSuccess("Xác nhận thành công");
        this.props.parentMethod(data);
      } else return this.showError("Xác nhận thất bại");
    });
  }
  componentDidMount() {
    this.handleBindData();
  }

  renderChangeShift() {
    //let data = this.props.details;
    if (
      this.state.dataDetails.confirm !== 0 &&
      this.state.dataDetails.confirm !== null
    )
      return (
        <div className="p-col-12">
          <Panel
            header={
              this.props.language["change_work_shift"] || "l_change_work_shift"
            }
          >
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <label>
                  {this.props.language["change_shift_to"] ||
                    "l_change_shift_to"}
                </label>
                <ShiftDropDownList
                  id="lastChanged"
                  disabled={true}
                  accId={this.props.accId}
                  value={this.state.lastChanged}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="note"
                  disabled={true}
                  value={this.state.changeNote || ""}
                />
              </div>
              <div className="p-col-12 p-md-4">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <SelectButton
                  id="confirm"
                  optionLabel="name"
                  optionValue="value"
                  //disabled={data[0].confirm < 3 ? true : false}
                  value={this.state.confirm}
                  options={lstConfirm}
                  onChange={this.handleChangeForm}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNote"
                  //disabled={data[0].confirm < 3 ? true : false}
                  value={this.state.confirmNote || ""}
                  onChange={this.handleChangeForm}
                />
              </div>
            </div>
          </Panel>
        </div>
      );
  }
  renderBeLate() {
    let data = this.props.details;
    if (this.state.dataDetails.confirmLate !== null)
      return (
        <div className="p-col-12">
          <Panel header={this.props.language["go_late"] || "l_go_late"}>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <label>
                  {this.props.language["time_for_go_late"] ||
                    "l_time_for_go_late"}
                </label>
                <InputText
                  id="timeLate"
                  disabled={true}
                  defaultValue={this.state.timeLate + " phút"}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="noteLate"
                  disabled={true}
                  defaultValue={this.state.noteLate}
                />
              </div>
              <div className="p-col-12 p-md-4">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <SelectButton
                  id="confirmLate"
                  optionLabel="name"
                  optionValue="value"
                  value={this.state.confirmLate}
                  //disabled={data[0].confirmLate < 3 ? true : false}
                  options={lstConfirm}
                  onChange={this.handleChangeForm}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNoteLate"
                  //disabled={data[0].confirmLate < 3 ? true : false}
                  value={
                    this.state.confirmNoteLate === null
                      ? ""
                      : this.state.confirmNoteLate
                  }
                  onChange={this.handleChangeForm}
                />
              </div>
            </div>
          </Panel>
        </div>
      );
  }
  renderBeEarly() {
    let data = this.props.details;
    if (this.state.dataDetails.confirmEarlier !== null)
      return (
        <div className="p-col-12">
          <Panel
            header={this.props.language["come_back_soon"] || "l_come_back_soon"}
          >
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <label>
                  {this.props.language["time_for_come_back_soon"] ||
                    "l_time_for_come_back_soon"}
                </label>
                <InputText
                  id="timeEarlier"
                  disabled={true}
                  defaultValue={this.state.timeEarlier + " phút"}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="noteEarlier"
                  disabled={true}
                  defaultValue={this.state.noteEarlier}
                />
              </div>
              <div className="p-col-12 p-md-4">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <SelectButton
                  id="confirmEarlier"
                  optionLabel="name"
                  optionValue="value"
                  value={this.state.confirmEarlier}
                  //disabled={data[0].confirmEarlier < 3 ? true : false}
                  options={lstConfirm}
                  onChange={this.handleChangeForm}
                />
              </div>
              <div className="p-col-12 p-md-8">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNoteEarlier"
                  //disabled={data[0].confirmEarlier < 3 ? true : false}
                  value={
                    this.state.confirmNoteEarlier === null
                      ? ""
                      : this.state.confirmNoteEarlier
                  }
                  onChange={this.handleChangeForm}
                />
              </div>
            </div>
          </Panel>
        </div>
      );
  }
  renderTaskList() {
    if (this.state.taskList !== null && this.state.taskList !== undefined) {
      return (
        <div className="p-col-12">
          <Panel header={this.props.language["task_list"] || "l_task_list"}>
            <div className="p-grid">
              <DataTable
                value={JSON.parse(this.state.taskList)}
                key="RowNum"
                responsiveLayout="scroll"
              >
                <Column field="RowNum" header="No."></Column>
                <Column field="Group" header="Group"></Column>
                <Column field="SubGroup" header="Task Name"></Column>
              </DataTable>
            </div>
          </Panel>
        </div>
      );
    }
  }
  renderDetail() {
    let data = this.props.details;
    if (this.props.dataInput.workDate === "shiftName") {
      return (
        <div className="p-fluid" style={{ minHeight: "400px" }}>
          <div className="p-grid">
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["employee"] || "employee"}</label>
              <InputText
                id="employee"
                disabled
                defaultValue={this.props.dataInput.employeeName}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["shop_name"] || "shop_name"}</label>
              <InputText
                id="shop"
                disabled
                defaultValue={this.props.dataInput.shopName}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["week"] || "l_week"}</label>
              <InputText
                id="week"
                disabled
                defaultValue={"Week " + this.props.dataInput.week}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["shift"] || "l_shift"}</label>
              <ShiftDropDownList
                id="shiftCode"
                type="ON"
                shiftDefault={null}
                accId={this.props.accId}
                //disabled={true}
                typeId={this.props.dataInput.typeId}
                onChange={this.handleChange}
                value={this.state.shiftCode}
              />
            </div>
          </div>
        </div>
      );
    }
    if (data.length > 0) {
      return (
        <div className="p-fluid" style={{ minHeight: "400px" }}>
          <div className="p-grid">
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["employee"] || "employee"}</label>
              <InputText
                id="employee"
                disabled
                defaultValue={data[0].employeeCode + " - " + data[0].fullName}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["shop_name"] || "shop_name"}</label>
              <InputText
                id="shop"
                disabled
                defaultValue={this.state.shopCode + " - " + this.state.shopName}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["date"] || "l_date"}</label>
              <InputText
                id="date"
                disabled
                defaultValue={moment(data[0].date).format("YYYY-MM-DD")}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <label>{this.props.language["shift"] || "l_shift"}</label>
              <ShiftDropDownList
                id="shiftCode"
                type="OFF"
                disabled={true}
                shiftDefault={this.state.shiftDefault}
                typeId={this.props.dataInput.typeId}
                accId={this.props.accId}
                onChange={this.handleChange}
                value={this.state.shiftCode}
              />
            </div>
            {this.renderTaskList()}
            {this.renderChangeShift()}
            {this.renderBeLate()}
            {this.renderBeEarly()}
          </div>
        </div>
      );
    }
    // else
    //     return (
    //         <div className="p-fluid" style={{ minHeight: '400px' }}>
    //             <div className="p-grid">
    //                 {this.props.language["not_pc"] || "l_not_pc"}
    //             </div>
    //         </div>
    //     );
  }
  render() {
    if (this.state.loading) {
      return (
        <Dialog
          header="Loading..."
          visible
          style={{ width: "80vw" }}
          modal={true}
          onHide={this.props.parentMethod}
        >
          <ProgressSpinner style={{ height: "50px", width: "100%" }} />
        </Dialog>
      );
    }
    // const user = JSON.parse(localStorage.getItem("USER"));
    const result = this.props.details;
    let footer = null,
      btnSave = null;
    if (
      (this.state.dataDetails.confirm !== 0 &&
        this.state.dataDetails.confirm !== null) ||
      this.state.dataDetails.confirmEarlier !== null ||
      this.state.dataDetails.confirmLate !== null
    ) {
      btnSave = (
        <Button
          className="p-button-success"
          label={this.props.language["save"] || "save"}
          icon="pi pi-check"
          onClick={() =>
            this.handleChangeShift(
              this.props.dataInput.workDate === "shiftName"
                ? "ChangeShift"
                : "ChangeDate"
            )
          }
        />
      );
    }
    if (result.length > 0 || this.props.dataInput.workDate === "shiftName") {
      footer = (
        <div>
          {btnSave}
          <Button
            className="p-button-danger"
            label={this.props.language["l_close"] || "close"}
            icon="pi pi-times"
            onClick={this.props.parentMethod}
          />
        </div>
      );
      return (
        <div>
          <Toast ref={(el) => (this.toast = el)} />
          <Dialog
            header={this.props.language["workingplan"] || "workingplan"}
            footer={footer}
            visible
            style={{ width: "80vw" }}
            modal={true}
            onHide={this.props.parentMethod}
          >
            {this.renderDetail()}
          </Dialog>
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    shiftLists: state.workingPlans.shiftLists,
    workingPlans: state.workingPlans.workingPlans,
    wpChangeShift: state.workingPlans.wpChangeShift,
    details: state.workingPlans.details,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkingPlanCell);
