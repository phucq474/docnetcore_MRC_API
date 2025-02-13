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

const lstConfirm = [
  { value: 1, name: "Confirm" },
  { value: -1, name: "Reject" },
];
class WorkingPlanCell_IMV extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      loading: true,
      dataDetail: null,
    };
    this.hanldeBindData = this.hanldeBindData.bind(this);
    this.handleRemoveChangeShift = this.handleRemoveChangeShift.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.renderChangeShift = this.renderChangeShift.bind(this);
    this.handleGetDataUpdate = this.handleGetDataUpdate.bind(this);
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
  handleGetDataUpdate() {
    let data = {
      view: this.props.dataInput.view,
      year: this.props.dataInput.year,
      week: this.props.dataInput.week,
      employeeId: this.props.dataInput.employeeId.toString(),
    };
    this.props.WorkingPlanController.GetList(data, this.props.accId).then(
      () => {
        if (this.props.workingPlans.length > 0) {
          //this.setState({ dataUpdated: this.props.workingPlans });
          //console.log(this.props.timesheetResult);
          this.props.parentMethod(this.props.workingPlans);
        }
      }
    );
  }

  hanldeBindData() {
    this.setState({ shiftDefault: this.props.dataInput.shiftDefault });
    // let shiftCode = this.props.dataInput.shiftDefault;
    // if (this.props.dataInput.shiftCode !== null) {
    //     let key = this.props.dataInput.shiftCode.split('_');
    //     if (key.length === 4) {
    //         if (parseInt(key[1]) !== 0) {
    //             shiftCode = this.props.dataInput.shiftDefault;
    //         }
    //         else {
    //             shiftCode = key[0];
    //         }
    //     }
    // }
    let data = {
      shopId: this.props.dataInput.shopId,
      employeeId: this.props.dataInput.employeeId,
      workDate: this.props.dataInput.workDate,
      shiftCode: this.props.dataInput.shiftDefault,
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
            changeDate: this.props.details[0].changeDate,
            confirm: this.props.details[0].confirm,
            confirmNote: this.props.details[0].confirmNote,
            confirmDate: this.props.details[0].confirmDate,
            timeLate: this.props.details[0].timeLate,
            noteLate: this.props.details[0].noteLate,
            confirmLate: this.props.details[0].confirmLate,
            confirmLateDate: this.props.details[0].confirmLateDate,
            confirmNoteLate: this.props.details[0].confirmNoteLate,
            timeEarlier: this.props.details[0].timeEarlier,
            noteEarlier: this.props.details[0].noteEarlier,
            confirmEarlier: this.props.details[0].confirmEarlier,
            confirmEarlierDate: this.props.details[0].confirmEarlierDate,
            confirmNoteEarlier: this.props.details[0].confirmNoteEarlier,
            shopCode: this.props.details[0].shopCode,
            shopName: this.props.details[0].shopName,
          });
          const itemOff = this.props.details.find((item) => item.isOff === 1);

          if (itemOff !== null && itemOff !== undefined) {
            this.setState({
              // shiftCode: this.props.details[1].shiftType,
              // shiftType: this.props.details[1].shiftType,
              isOff: 1,
              dataOff: itemOff,
              lastChanged: itemOff.shiftType,
              refId: itemOff.refId,
              changeNote: itemOff.changeNote,
              changeDate: itemOff.changeDate,
              shopCode: itemOff.shopCode,
              shopName: itemOff.shopName,
              confirm: itemOff.confirm,
              confirmNote: itemOff.confirmNote,
              confirmDate: itemOff.confirmDate,
            });
          }
        }
      }
    );
  }
  handleRemoveChangeShift(type) {
    let data = {
      type: this.state.isOff === 1 ? "OFF" : type,
      id: this.state.id,
      shopId: this.props.dataInput.shopId,
      employeeId: this.props.dataInput.employeeId,
      workDate: this.props.dataInput.workDate,
      shiftCode: this.props.dataInput.shiftDefault,
    };
    this.props.WorkingPlanController.RemoveChangeShift(
      data,
      this.props.accId
    ).then(() => {
      if (this.props.wpRemoveChangeShift.result === 1) {
        this.hanldeBindData();
        this.handleGetDataUpdate();
        this.showSuccess("Xoá đề xuất thành công");
      } else return this.showError("Xoá đề xuất thất bại");
    });
  }
  hanldeChangeShift() {
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
    this.props.WorkingPlanController.ChangeShift(data, this.props.accId).then(
      () => {
        if (this.props.wpChangeShift.result === 1) {
          this.showSuccess("Xác nhận thành công");
          this.props.parentMethod(data);
        } else return this.showError("Xác nhận thất bại");
      }
    );
  }
  componentDidMount() {
    this.hanldeBindData();
  }
  renderConfirmStatus(confirm) {
    switch (confirm) {
      case 3:
        return (
          <Button
            label="Chờ duyệt"
            className="p-button-secondary"
            disabled={true}
          />
        );
      case 1:
        return (
          <Button label="Đồng ý" className="p-button-success" disabled={true} />
        );
      case -1:
        return (
          <Button label="Từ chối" className="p-button-danger" disabled={true} />
        );
      case -2:
        return (
          <Button
            label="Không xác nhận"
            className="p-button-warning"
            disabled={true}
          />
        );
      default:
        break;
    }
  }
  renderChangeShift() {
    let data = this.props.details;
    if (
      (this.state.dataDetails.confirm !== 0 &&
        this.state.dataDetails.confirm !== null) ||
      this.state.isOff === 1
    )
      return (
        <div className="p-col-12">
          <Panel
            header={
              this.props.language["change_work_shift"] || "l_change_work_shift"
            }
          >
            <div className="p-grid">
              <div className="p-col-12 p-md-3">
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
              <div className="p-col-12 p-md-7">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="note"
                  disabled={true}
                  value={this.state.changeNote || ""}
                />
              </div>
              <div className="p-col-12 p-md-2">
                <label>
                  {this.props.language["create_time"] || "l_create_time"}
                </label>
                <InputText
                  id="create_time"
                  disabled={true}
                  value={moment(this.state.changeDate).format(
                    "DD/MM/yyyy HH:mm:ss"
                  )}
                />
              </div>
              <div className="p-col-12 p-md-3">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <div>{this.renderConfirmStatus(this.state.confirm)}</div>
              </div>
              <div className="p-col-12 p-md-7">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNote"
                  disabled={true}
                  value={this.state.confirmNote || ""}
                  onChange={this.handleChangeForm}
                />
              </div>
              <div className="p-col-12 p-md-2">
                <label>
                  {this.props.language["confirm_time"] || "l_confirm_time"}
                </label>
                <InputText
                  id="confirmDate"
                  disabled={true}
                  value={
                    this.state.confirmDate !== null
                      ? moment(this.state.confirmDate).format(
                          "DD/MM/yyyy HH:mm:ss"
                        )
                      : ""
                  }
                />
              </div>
              {this.props.permission.delete ? (
                <div className="p-col-12" style={{ textAlign: "right" }}>
                  <Button
                    icon="pi pi-trash"
                    label="Xoá đề xuất"
                    onClick={(e) => this.handleRemoveChangeShift("ChangeShift")}
                    className="p-button-danger"
                  />
                </div>
              ) : null}
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
              <div className="p-col-12 p-md-2">
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
              <div className="p-col-12 p-md-10">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="noteLate"
                  disabled={true}
                  defaultValue={this.state.noteLate}
                />
              </div>
              <div className="p-col-12 p-md-2">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <div>{this.renderConfirmStatus(this.state.confirmLate)}</div>
                {/* <SelectButton
                                id="confirmLate"
                                optionLabel="name"
                                optionValue="value"
                                value={this.state.confirmLate}
                                //disabled={data[0].confirmLate < 3 ? true : false}
                                options={lstConfirm}
                                onChange={this.handleChangeForm} /> */}
              </div>
              <div className="p-col-12 p-md-8">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNoteLate"
                  disabled={true}
                  value={
                    this.state.confirmNoteLate === null
                      ? ""
                      : this.state.confirmNoteLate
                  }
                  onChange={this.handleChangeForm}
                />
              </div>
              {/* <div className="p-col-12 p-md-2">
                            <label>{this.props.language["confirmDate"] || "l_confirmDate"}</label>
                            <InputText
                                id="confirmLateDate"
                                value={this.state.confirmLateDate !== null ? moment(this.state.confirmLateDate).format('DD/MM/yyyy HH:mm:ss') : ''}
                            />
                        </div> */}
              {this.props.permission.delete ? (
                <div className="p-col-12" style={{ textAlign: "right" }}>
                  <Button
                    icon="pi pi-trash"
                    label="Xoá đề xuất"
                    onClick={(e) => this.handleRemoveChangeShift("Late")}
                    className="p-button-danger"
                  />
                </div>
              ) : null}
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
              <div className="p-col-12 p-md-2">
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
              <div className="p-col-12 p-md-10">
                <label>
                  {this.props.language["employee_note"] || "l_employee_note"}
                </label>
                <InputText
                  id="noteEarlier"
                  disabled={true}
                  defaultValue={this.state.noteEarlier}
                />
              </div>
              <div className="p-col-12 p-md-2">
                <label>{this.props.language["confirm"] || "l_confirm"}</label>
                <div>{this.renderConfirmStatus(this.state.confirmLate)}</div>
                {/* <SelectButton
                                id="confirmEarlier"
                                optionLabel="name"
                                optionValue="value"
                                value={this.state.confirmEarlier}
                                //disabled={data[0].confirmEarlier < 3 ? true : false}
                                options={lstConfirm}
                                onChange={this.handleChangeForm} /> */}
              </div>
              <div className="p-col-12 p-md-8">
                <label>{this.props.language["note"] || "l_note"}</label>
                <InputText
                  id="confirmNoteEarlier"
                  disabled={true}
                  value={
                    this.state.confirmNoteEarlier === null
                      ? ""
                      : this.state.confirmNoteEarlier
                  }
                  onChange={this.handleChangeForm}
                />
              </div>
              {/* <div className="p-col-12 p-md-2">
                            <label>{this.props.language["confirmDate"] || "l_confirmDate"}</label>
                            <InputText
                                id="confirmEarlierDate"
                                value={this.state.confirmEarlierDate !== null ? moment(this.state.confirmEarlierDate).format('DD/MM/yyyy HH:mm:ss') : ''}
                            />
                        </div> */}
              {this.props.permission.delete ? (
                <div className="p-col-12" style={{ textAlign: "right" }}>
                  <Button
                    icon="pi pi-trash"
                    label="Xoá đề xuất"
                    onClick={(e) => this.handleRemoveChangeShift("Earlier")}
                    className="p-button-danger"
                  />
                </div>
              ) : null}
            </div>
          </Panel>
        </div>
      );
  }
  renderDetail() {
    let data = this.props.details;

    if (data.length > 0) {
      return (
        <div className="p-grid">
          <div className="p-col-12">
            <Panel header="Thông tin nhân viên">
              <div className="p-grid">
                <div className="p-col-12 p-md-4">
                  <label>{this.props.language["employee"] || "employee"}</label>
                  <div className="p-text-bold">
                    {data[0].employeeCode + " - " + data[0].fullName}
                  </div>
                  {/* <InputText
                                id="employee" disabled
                                defaultValue={data[0].employeeCode + ' - ' + data[0].fullName} /> */}
                </div>
                <div className="p-col-12 p-md-4">
                  <label>{this.props.language["date"] || "l_date"}</label>
                  <div className="p-text-bold">
                    {moment(data[0].date).format("YYYY-MM-DD")}
                  </div>
                  {/* <InputText
                                id="date" disabled
                                defaultValue={moment(data[0].date).format('YYYY-MM-DD')} /> */}
                </div>
                <div className="p-col-12 p-md-4">
                  <label>{this.props.language["shift"] || "l_shift"}</label>
                  <div className="p-text-bold">
                    {data[0].shiftType + " (" + data[0].shiftName + ")"}
                  </div>
                  {/* <ShiftDropDownList
                                id="shiftCode"
                                type="OFF"
                                disabled={true}
                                shiftDefault={this.state.shiftDefault}
                                typeId={this.props.dataInput.typeId}
                                onChange={this.handleChange}
                                value={this.state.shiftCode} /> */}
                </div>
                <div className="p-col-12 p-md-12">
                  <label>
                    {this.props.language["shop_name"] || "shop_name"}
                  </label>
                  <div className="p-text-bold">
                    {data[0].shopCode + " - " + data[0].shopName}
                  </div>
                  {/* <InputText
                                id="shop" disabled
                                defaultValue={this.state.shopCode + ' - ' + this.state.shopName} /> */}
                </div>
                <div className="p-col-12 p-md-12">
                  <label>Ngày tạo lịch:</label>
                  <div className="p-text-bold">{data[0].createdDate}</div>
                </div>
              </div>
            </Panel>
          </div>
          {this.renderChangeShift()}
          {this.renderBeLate()}
          {this.renderBeEarly()}
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
    const user = JSON.parse(localStorage.getItem("USER"));
    const result = this.props.details;
    let footer = null,
      btnSave = null;
    if (
      (this.state.dataDetails.confirm !== 0 &&
        this.state.dataDetails.confirm !== null &&
        this.props.permission.edit) ||
      this.state.dataDetails.confirmEarlier !== null ||
      this.state.dataDetails.confirmLate !== null
    ) {
      btnSave = (
        <Button
          className="p-button-success"
          label={this.props.language["save"] || "save"}
          icon="pi pi-check"
          onClick={() =>
            this.hanldeChangeShift(
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
            header="LỊCH LÀM VIỆC"
            maximized
            //footer={footer}
            visible
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
    wpRemoveChangeShift: state.workingPlans.wpRemoveChangeShift,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingPlanCell_IMV);
