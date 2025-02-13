import React, { createRef, PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { bindActionCreators } from "redux";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { download, HelpPermission } from "../../Utils/Helpler";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import moment from "moment";
import Search from "../Controls/Search";
import { Checkbox } from "primereact/checkbox";
import WorkingPlanDefaultDialog from "./WorkingPlanDefault-Dialog";
import Page403 from "../ErrorRoute/page403";

class WorkingPlanDefault extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permission: {},
      datas: [],
      loading: false,
      insertDialog: false,
      updateDialog: false,
      deleteDialog: false,
      rowSelection: null,
      inputValues: { dataTableUpdate: [], dataTableInsert: [] },
      reCallDetail: 0,
      fromToDate: {},
    };
    this.fileUpload = React.createRef();
    this.pageId = 3120;
    this.handleChange = this.handleChange.bind(this);
    this.handleValid = this.handleValid.bind(this);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      life: 15000,
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  // handle change
  handleChange(id, value) {
    this.setState({ [id]: value === null ? "" : value });
  }
  handleChangeForm = (value, stateName, subStateName = null) => {
    if (subStateName === null) {
      this.setState({ [stateName]: value });
    } else {
      this.setState({
        [stateName]: { ...this.state[stateName], [subStateName]: value },
      });
    }
  };
  onChange = (id, value) => {
    this.setState({ [id]: value ? value : null });
  };
  handleChangeDropDown = async (id, value) => {
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value ? value : null,
      },
    });
    if (id === "positionId")
      await this.setState({
        inputValues: { ...this.state.inputValues, employeeId: 0 },
      });
  };
  handleChangeCheckBox = async (id, value, index, type) => {
    if (type === "Insert") {
      const inputValues = this.state.inputValues;
      let temp = JSON.parse(JSON.stringify(inputValues.dataTableInsert));
      temp[index][id] = value ? 1 : 0;
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          dataTableInsert: temp,
        },
      });
    }
  };
  handleChangeTable = (id, value, index, rowData) => {
    const inputValues = this.state.inputValues;
    let temp = JSON.parse(JSON.stringify(inputValues.dataTableInsert));
    if (id === "shiftCode") {
      let arr = this.props.shiftLists.filter((e) => e.shiftCode === value);
      if (arr && arr.length > 0) {
        temp[index]["from"] = arr[0].from;
        temp[index]["to"] = arr[0].to;
      }
    }
    temp[index][id] = value;
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        dataTableInsert: temp,
      },
    });
  };
  // search
  Search = async (data) => {
    await this.props.WorkingPlanController.FilterWorkingPlanDefault(data);
    const result = this.props.filterWorkingDefault;
    if (result.length > 0) {
      await this.setState({
        datas: this.props.filterWorkingDefault,
        // fromToDate: { fromDate: data.fromDate, toDate: data.toDate }
      });
      await this.Alert("Tìm kiếm thành công", "info");
    } else {
      await this.Alert("không có dữ liệu", "error");
      await this.setState({ datas: [] });
    }
  };
  // export
  Export = async (data) => {
    await this.props.WorkingPlanController.ExportWorkingPlanDefault(data);
    const result = this.props.exportWorkingDefault;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
  };
  /// Template
  Template = async (data) => {
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.TemplateWorkingPlanDefault(data);
    const result = this.props.templateWorkingDefault;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  /// Insert
  bindDataShop = async () => {
    const inputValues = this.state.inputValues;
    if (!inputValues.positionId)
      return await this.Alert("Chưa chọn Vị trí", "error");
    else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorPositionId: "" },
      });
    if (!inputValues.employeeId)
      return await this.Alert("Chưa chọn Nhân viên", "error");
    else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorEmployee: "" },
      });
    if (!inputValues.fromDate)
      return await this.Alert("Chưa chọn Từ ngày", "error");
    else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorFromDate: "" },
      });
    await this.props.WorkingPlanController.GetShopWorkingDefault(
      inputValues.employeeId,
      +moment(inputValues.fromDate).format("YYYYMMDD")
    );
    const result = this.props.getShopWorking;
    if (result && result.length > 0) {
      await this.Alert("Tìm kiếm thành công", "info");
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          dataTableInsert: result,
        },
      });
    } else {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          dataTableInsert: [],
        },
      });
      await this.Alert("Không có dữ liệu", "error");
    }
  };
  addDuplicate = async (rowData, index) => {
    let dataTableInsert = this.state.inputValues.dataTableInsert;
    rowData["duplicate"] = await true;
    await dataTableInsert.push(rowData);
    let sortTable = await dataTableInsert.sort((a, b) => {
      return a.rowNum - b.rowNum;
    });
    await this.setState({
      inputValues: { ...this.state.inputValues, dataTableInsert: sortTable },
    });
  };
  handleInsertDialog = (boolean) => {
    if (boolean) {
      this.setState({
        insertDialog: true,
      });
    } else {
      this.setState({ insertDialog: false });
    }
  };
  footerInsertDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.create && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleInsertDialog(false)}
            />
            <Button
              label={this.props.language["insert"] || "l_insert"}
              className="p-button-info"
              onClick={() => this.handleInsert()}
            />
          </div>
        )}
      </div>
    );
  };
  async handleValid(typeCheck) {
    let check = true;
    const inputValues = this.state.inputValues;
    const dataTableInsert = inputValues.dataTableInsert;
    let DuplicateArr = [];
    const shiftLists = this.props.shiftLists;
    if (typeCheck === "Update" && !inputValues.shiftCode) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShiftCode: "ShiftCode required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShiftCode: "" },
      });
    if (typeCheck === "Update" && !inputValues.fromToDate) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorFromToDate: "Choose FromDate required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorFromToDate: "" },
      });
    if (typeCheck === "Insert" && dataTableInsert.length === 0) {
      await this.Alert("Chưa lấy danh sách để Thêm", "error");
      check = false;
    }
    if (typeCheck === "Insert" && !inputValues.positionId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorPositionId: "Position required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorPositionId: "" },
      });
    if (typeCheck === "Insert" && !inputValues.fromDate) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorFromDate: "FromDate required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorFromDate: "" },
      });

    if (typeCheck === "Insert" && !inputValues.employeeId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorEmployee: "Employee required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorEmployee: "" },
      });
    if (typeCheck === "Insert" && dataTableInsert.length > 0) {
      let checkColumn = await [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      let annoucement = null;
      let checkDay = [];
      let day = {};
      for (let i = 0; i < dataTableInsert.length; i++) {
        let checkRow = await dataTableInsert[i];
        if (
          checkRow.monday === 1 &&
          checkRow.tuesday === 1 &&
          checkRow.wednesday === 1 &&
          checkRow.thursday === 1 &&
          checkRow.friday === 1 &&
          checkRow.saturday === 1 &&
          checkRow.sunday === 1
        ) {
          annoucement = "checkDayOff";
        }
        if (
          checkRow.isInsert === 1 &&
          checkRow.monday !== 1 &&
          checkRow.tuesday !== 1 &&
          checkRow.wednesday !== 1 &&
          checkRow.thursday !== 1 &&
          checkRow.friday !== 1 &&
          checkRow.saturday !== 1 &&
          checkRow.sunday !== 1
        ) {
          annoucement = "chooseDay";
        }
        if (checkRow.isInsert === 1 && !checkRow.shiftCode)
          annoucement = "errorshiftcode";
        if (checkRow.isInsert === 1 && !checkRow.fromDate)
          annoucement = "errorfromdate";
        if (checkRow.isInsert === 1) {
          for (let column = 0; column < checkColumn.length; column++) {
            if (dataTableInsert[i][checkColumn[column]] === 1) {
              day[checkColumn[column]] = 1;
            } else dataTableInsert[i][checkColumn[column]] = 0;
          }
          DuplicateArr = await dataTableInsert.filter(
            (e) => e.rowNum === checkRow.rowNum
          );
          let arr = await DuplicateArr.sort((a, b) => {
            return a.from > b.from ? 1 : -1;
          });
          let checkArr = await DuplicateArr.filter(
            (e) => e.shiftCode === arr[0].shiftCode
          );
          let n = arr.length;
          if (checkArr.length > 1) annoucement = "duplicate";
          if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
              if (i > 0) {
                if (
                  arr[i].from > arr[i - 1].from &&
                  arr[i].from < arr[i - 1].to
                )
                  annoucement = "duplicate";
                if (arr[i].to > arr[i - 1].from && arr[i].to < arr[i - 1].to)
                  annoucement = "duplicate";
                if (
                  arr[i].from === arr[i - 1].from &&
                  arr[i].to > arr[i - 1].to
                )
                  annoucement = "duplicate";
                if (
                  arr[i].to === arr[i - 1].to &&
                  arr[i].from < arr[i - 1].from
                )
                  annoucement = "duplicate";
                if (
                  arr[i].to === arr[i - 1].to &&
                  arr[i].from < arr[i - 1].from
                )
                  annoucement = "duplicate";
              }
            }
          }
        }
      }
      let checkWeek = await Object.values(day);
      if (checkWeek.length < 6) annoucement = "than2dayOff";
      if (checkWeek.length === 7) annoucement = "mustdayoff";
      switch (annoucement) {
        case "checkDayOff":
          await this.Alert("Xin chọn ngày nghỉ", "error");
          check = false;
          break;
        case "chooseDay":
          await this.Alert("Xin chọn ngày", "error");
          check = false;
          break;
        case "than2dayOff":
          await this.Alert("Không thể có nhiều hơn 2 ngày nghỉ", "error");
          check = false;
          break;
        case "errorshiftcode":
          await this.Alert("Xin chọn ca", "error");
          check = false;
          break;
        case "errorfromdate":
          await this.Alert("Xin chọn ngày", "error");
          check = false;
          break;
        case "mustdayoff":
          await this.Alert("Xin chọn ngày nghỉ", "error");
          check = false;
          break;
        case "duplicate":
          await this.Alert("Trùng ca làm việc,xin kiểm tra lại", "error");
          check = false;
          break;
        default:
          break;
      }
    }
    if (!check) return false;
    else return true;
  }
  handleInsert = async (rowData) => {
    await this.setState({ isLoading: true });
    if (await this.handleValid("Insert")) {
      const inputValues = this.state.inputValues;
      const dataTableInsert = inputValues.dataTableInsert;
      await this.props.WorkingPlanController.InsertWorkingPlanDefault(
        dataTableInsert
      );
      let response = await this.props.insertWorkingDefault;
      if (response && response.status === 1) {
        await this.Alert(response.message, "info");
        await this.setState({
          inputValues: { dataTableInsert: [], dataTableUpdate: [] },
        });
      } else await this.Alert(response.message, "error");
    }
    await this.setState({ isLoading: false });
  };
  /// Update
  footerUpdateDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleUpdateDialog(false)}
            />
            <Button
              label={this.props.language["update"] || "l_update"}
              className="p-button-info"
              onClick={() => this.handleUpdate()}
            />
          </div>
        )}
      </div>
    );
  };
  handleUpdateDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        updateDialog: true,
        rowData: rowData,
        inputValues: {
          ...this.state.inputValues,
          dataTableUpdate: [
            {
              monday: rowData.monday === 1 ? 1 : 0,
              tuesday: rowData.tuesday === 1 ? 1 : 0,
              wednesday: rowData.wednesday === 1 ? 1 : 0,
              thursday: rowData.thursday === 1 ? 1 : 0,
              friday: rowData.friday === 1 ? 1 : 0,
              saturday: rowData.saturday === 1 ? 1 : 0,
              sunday: rowData.sunday === 1 ? 1 : 0,
            },
          ],
          shopId: rowData.shopId,
          employeeId: rowData.employeeId,
          fromToDate: [
            new Date(moment(`${rowData.fromDate}`).format("YYYY-MM-DD")),
            rowData.toDate
              ? new Date(moment(`${rowData.toDate}`).format("YYYY-MM-DD"))
              : null,
          ],
          shiftCode: rowData.shiftCode,
          positionId: rowData.positionId,
          index: index,
          id: rowData.id,
        },
      });
    } else {
      this.setState({
        updateDialog: false,
        inputValues: { dataTableInsert: [], dataTableUpdate: [] },
      });
    }
  };
  handleUpdate = async () => {
    const dataDefault = JSON.parse(
      JSON.stringify(this.props.filterWorkingDefault)
    );
    await this.setState({ isLoading: true });
    let rowData = await this.state.rowData;
    if (await this.handleValid("Update")) {
      const inputValues = this.state.inputValues;
      const dataTableUpdate = inputValues.dataTableUpdate[0];
      const data = {
        monday: dataTableUpdate.monday ? 1 : 0,
        tuesday: dataTableUpdate.tuesday ? 1 : 0,
        wednesday: dataTableUpdate.wednesday ? 1 : 0,
        thursday: dataTableUpdate.thursday ? 1 : 0,
        friday: dataTableUpdate.friday ? 1 : 0,
        saturday: dataTableUpdate.saturday ? 1 : 0,
        sunday: dataTableUpdate.sunday ? 1 : 0,
        shiftCode: inputValues.shiftCode,
        fromDate: +moment(inputValues.fromToDate[0]).format("YYYYMMDD"),
        toDate: !inputValues.fromToDate[1]
          ? null
          : +moment(inputValues.fromToDate[1]).format("YYYYMMDD"),
      };
      await Object.assign(rowData, data);
      await this.props.WorkingPlanController.UpdateWorkingPlanDefault(
        rowData,
        inputValues.index
      );
      let response = await this.props.updateWorkingDefault;
      if (typeof response === "object" && response.status === 1) {
        await this.setState({ datas: this.props.filterWorkingDefault });
        await this.highlightParentRow(inputValues.index);
        await this.Alert("Cập nhập thành công", "info");
      } else {
        await this.Alert(response.message, "error");
        await this.setState({ datas: dataDefault });
      }
      await this.setState({
        isLoading: false,
        inputValues: { dataTableUpdate: [], dataTableInsert: [] },
        updateDialog: false,
      });
    }
  };
  /// delete
  handleDeleteDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        deleteDialog: true,
        inputValues: {
          id: rowData.id,
          index: index,
        },
      });
    } else {
      this.setState({
        deleteDialog: false,
        inputValues: {},
      });
    }
  };
  footerDeleteDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.delete && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-danger"
              onClick={() => this.handleDeleteDialog(false)}
            />
            <Button
              label={this.props.language["delete"] || "l_delete"}
              className="p-button-info"
              onClick={() => this.handleDelete()}
            />
          </div>
        )}
      </div>
    );
  };
  handleDelete = async () => {
    await this.setState({ isLoading: true });
    const inputValues = this.state.inputValues;
    await this.props.WorkingPlanController.DeleteWorkingDefault(
      inputValues.id,
      inputValues.index
    );
    const response = this.props.deleteWorkingDefault;
    if (response && response.status === 1) {
      await this.setState({ datas: this.props.filterWorkingDefault });
      await this.Alert(response.message, "info");
    } else {
      await this.Alert(response.message, "error");
    }
    await this.setState({
      isLoading: false,
      deleteDialog: false,
      inputValues: { dataTableInsert: [], dataTableUpdate: [] },
    });
  };
  /// import
  Import = async (file, fileTemp) => {
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.ImportWorkingPlanDefault(file);
    const result = this.props.importWorkingDefault;
    if (result && result.status === 1) {
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await fileTemp.current.clear();
    await this.setState({ loading: false });
  };
  highlightParentRow = async (rowIndex) => {
    try {
      const seconds = await 3000,
        outstanding = await "highlightText";
      let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0];
      if (
        rowUpdated &&
        !rowUpdated.children[rowIndex].classList.contains(outstanding)
      ) {
        rowUpdated.children[rowIndex].classList.add(outstanding);
        setTimeout(() => {
          if (rowUpdated.children[rowIndex].classList.contains(outstanding)) {
            rowUpdated.children[rowIndex].classList.remove(outstanding);
          }
        }, seconds);
      }
    } catch (e) {}
  };
  ///render
  actionButtons = (rowData, event) => {
    return (
      <div>
        {/* {this.state.permission.edit && <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2" onClick={() => this.handleUpdateDialog(true, rowData, event.rowIndex)} />} */}
        {this.state.permission.delete && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() =>
              this.handleDeleteDialog(true, rowData, event.rowIndex)
            }
          />
        )}
      </div>
    );
  };
  showLeaderName = (rowData) => {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <label>
            <strong>{rowData.leaderCode}</strong>
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>{rowData.leaderName}</label>
        </div>
      </div>
    );
  };
  showEmloyeeName = (rowData) => {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <label>
            <strong>{rowData.employeeCode}</strong>
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>{rowData.employeeName}</label>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>{rowData.position}</label>
        </div>
      </div>
    );
  };
  showShopName = (rowData) => {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <label>
            <i className="pi pi-shopping-cart"></i>{" "}
            <strong>
              {rowData.shopCode} - {rowData.shopName}
            </strong>
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>{rowData.address}</label>
        </div>
      </div>
    );
  };
  showNameCodeShift = (rowData) => {
    return (
      <div>
        <div>
          <label>
            <strong>{rowData.shiftCode}</strong>
          </label>
        </div>
        <label>{rowData.shiftName}</label>
      </div>
    );
  };
  showCheckBox = (value) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox checked={value === 1 ? true : false}></Checkbox>
      </div>
    );
  };
  componentDidMount() {}
  render() {
    const dataList = this.props.getKpiListDrop;
    let dialogInsert = null,
      dialogUpdate = null,
      dialogConfirm = null,
      result = [];
    if (dataList) {
      dataList.forEach((element) => {
        result.push({ name: element.kpi, value: element.kpiId });
      });
    }
    if (this.state.insertDialog) {
      // * INSERT DIALOG
      dialogInsert = (
        <WorkingPlanDefaultDialog
          stateName={"inputValues"}
          nameAction={"Insert"}
          inputValues={this.state.inputValues}
          dataTable={this.state.inputValues.dataTableInsert}
          handleChangeForm={this.handleChangeForm}
          handleChange={this.handleChange}
          //dialog
          displayDialog={this.state.insertDialog}
          footerAction={this.footerInsertDialog}
          handleActionDialog={this.handleInsertDialog}
          handleChangeDropDown={this.handleChangeDropDown}
          bindDataShop={this.bindDataShop}
          handleChangeTable={this.handleChangeTable}
          handleChangeCheckBox={this.handleChangeCheckBox}
          addDuplicate={this.addDuplicate}
        />
      );
    }
    if (this.state.updateDialog) {
      // * INSERT DIALOG
      dialogUpdate = (
        <WorkingPlanDefaultDialog
          stateName={"inputValues"}
          nameAction={"Update"}
          inputValues={this.state.inputValues}
          handleChangeForm={this.handleChangeForm}
          handleChange={this.handleChange}
          //dialog
          displayDialog={this.state.updateDialog}
          footerAction={this.footerUpdateDialog}
          handleActionDialog={this.handleUpdateDialog}
          handleChangeDropDown={this.handleChangeDropDown}
          handleChangeCheckBox={this.handleChangeCheckBox}
        />
      );
    }
    if (this.state.deleteDialog) {
      // * CONFIRM DIALOG
      dialogConfirm = (
        <Dialog
          header="Confirmation"
          modal
          style={{ width: "350px" }}
          visible={this.state.deleteDialog}
          footer={this.footerDeleteDialog()}
          onHide={() => this.handleDeleteDialog(false)}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["are_you_sure_to_delete"] ||
                "l_are_you_sure_to_delete"}
              ?
            </span>
          </div>
        </Dialog>
      );
    }
    return this.state.permission.view ? (
      <Card>
        <Toast ref={(el) => (this.toast = el)} />
        <Search
          {...this}
          isVisibleQCStatus={false}
          isVisibleReport={false}
          haveTemplate={this.state.permission.import}
          pageType="working_plan_default"
          permission={this.state.permission}
          isImport={this.state.permission.import}
        ></Search>
        {this.state.loading ? (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "5px" }}
          ></ProgressBar>
        ) : null}
        <DataTable
          paginatorPosition={"both"}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          value={this.state.datas}
          paginator={true}
          rows={50}
          rowsPerPageOptions={[20, 50, 100]}
          style={{ fontSize: "13px" }}
        >
          {/* <Column header='No.' filter='rowNum' /> */}
          <Column
            field="leaderName"
            body={this.showLeaderName}
            header={this.props.language["leader_name"] || "l_leader_name"}
            style={{ width: 100 }}
            filter={true}
          />
          <Column
            field="employeeName"
            body={this.showEmloyeeName}
            header={this.props.language["employee_name"] || "l_employee_name"}
            style={{ width: 90 }}
            filter={true}
          />
          <Column
            field="shopName"
            body={this.showShopName}
            style={{ width: 200 }}
            filter={true}
            header={this.props.language["shop_name"] || "l_shop_name"}
          />
          <Column
            body={(rowData) => (
              <div>{moment(`${rowData.fromDate}`).format("YYYY-MM-DD")}</div>
            )}
            header={this.props.language["from_date"] || "l_from_date"}
            style={{ textAlign: "center", width: 80 }}
            filter={true}
          />
          <Column
            body={(rowData) =>
              rowData.toDate ? (
                <div>{moment(`${rowData.toDate}`).format("YYYY-MM-DD")}</div>
              ) : null
            }
            header={this.props.language["to_date"] || "l_to_date"}
            filter={true}
            style={{ width: 80, textAlign: "center" }}
          />
          <Column
            field="shiftCode"
            body={this.showNameCodeShift}
            header={this.props.language["shift_code"] || "l_shift_code"}
            filter={true}
            style={{ width: 80, textAlign: "center" }}
          />
          <Column
            field="monday"
            body={(rowData) => this.showCheckBox(rowData.monday)}
            style={{ width: 40 }}
            header={this.props.language["mon"] || "l_mon"}
          />
          <Column
            field="tuesday"
            body={(rowData) => this.showCheckBox(rowData.tuesday)}
            style={{ width: 40 }}
            header={this.props.language["tue"] || "l_tue"}
          />
          <Column
            field="wednesday"
            body={(rowData) => this.showCheckBox(rowData.wednesday)}
            style={{ width: 40 }}
            header={this.props.language["wed"] || "l_wed"}
          />
          <Column
            field="thursday"
            body={(rowData) => this.showCheckBox(rowData.thursday)}
            style={{ width: 40 }}
            header={this.props.language["thu"] || "l_thu"}
          />
          <Column
            field="friday"
            body={(rowData) => this.showCheckBox(rowData.friday)}
            style={{ width: 40 }}
            header={this.props.language["fri"] || "l_fri"}
          />
          <Column
            field="saturday"
            body={(rowData) => this.showCheckBox(rowData.saturday)}
            style={{ width: 40 }}
            header={this.props.language["sat"] || "l_sat"}
          />
          <Column
            field="sunday"
            body={(rowData) => this.showCheckBox(rowData.sunday)}
            style={{ width: 40 }}
            header={this.props.language["sun"] || "l_sun"}
          />
          <Column
            body={(rowData, e) => this.actionButtons(rowData, e)}
            header="#"
            style={{ width: 80, textAlign: "center" }}
          ></Column>
        </DataTable>
        {dialogInsert}
        {dialogUpdate}
        {dialogConfirm}
      </Card>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    shiftLists: state.workingPlans.shiftLists,
    filterWorkingDefault: state.workingPlans.filterWorkingDefault,
    getShopWorking: state.workingPlans.getShopWorking,
    insertWorkingDefault: state.workingPlans.insertWorkingDefault,
    updateWorkingDefault: state.workingPlans.updateWorkingDefault,
    deleteWorkingDefault: state.workingPlans.deleteWorkingDefault,
    exportWorkingDefault: state.workingPlans.exportWorkingDefault,
    templateWorkingDefault: state.workingPlans.templateWorkingDefault,
    importWorkingDefault: state.workingPlans.importWorkingDefault,
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
export default connect(mapStateToProps, mapDispatchToProps)(WorkingPlanDefault);
