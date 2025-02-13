import React, { createRef, PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { ProgressBar } from "primereact/progressbar";
import { bindActionCreators } from "redux";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import ShiftListDialog from "./ShiftListDialog";
import { download, getLogin, HelpPermission } from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class ShiftList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groupId: null,
      permission: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        import: true,
        export: true,
      },
      datas: [],
      loading: false,
      insertDialog: false,
      updateDialog: false,
      inputValues: {},
      status: true,
      accId: null,
      shiftLists: [],
    };
    this.fileUpload = React.createRef();
    this.pageId = getLogin().accountName === "MARICO MT" ? 3163 : 3070;
    this.handleChange = this.handleChange.bind(this);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  // handle change
  handleChange = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
    if (id === "accId") {
      this.props.WorkingPlanController.GetShiftList(this.state.accId).then(
        () => {
          this.setState({
            shiftLists: this.props.shiftLists,
            shiftGroup: null,
          });
        }
      );
    }
  };
  handleChangeForm = async (value, stateName, subStateName = null) => {
    if (subStateName === null) {
      await this.setState({ [stateName]: value });
    } else {
      await this.setState({
        [stateName]: { ...this.state[stateName], [subStateName]: value },
      });
      if (subStateName === "refCode" && !value)
        await this.setState({
          [stateName]: { ...this.state[stateName], from: 0, to: 0, value: 0 },
        });
    }
  };
  onChange = (id, value) => {
    this.setState({ [id]: value ? value : null });
  };
  // search
  handleSearch = async () => {
    const state = this.state;
    const data = {
      shiftGroup: state.shiftGroup,
      status: state.status ? 1 : 0,
    };
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.FilterShiftList(
      data,
      this.state.accId
    );
    const result = this.props.filterShiftLists;
    if (result && result.length > 0) {
      await this.Alert("Tìm kiếm thành công", "info");
    } else await this.Alert("Không có dữ liệu", "info");
    await this.setState({ loading: false, datas: result });
  };

  actionButtons = (rowData, event) => {
    return (
      <div>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
            onClick={() =>
              this.handleUpdateDialog(true, rowData, event.rowIndex)
            }
          />
        )}
      </div>
    );
  };
  /// Insert
  handleInsertDialog = (boolean) => {
    if (boolean) {
      this.setState({
        insertDialog: true,
        inputValues: {
          ...this.state.inputValues,
          refCode: true,
          status: true,
          from: 0,
        },
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
  handleValid = async () => {
    let check = true;
    const inputValues = this.state.inputValues;
    // if (!inputValues.shift) {
    //     await this.setState({ inputValues: { ...this.state.inputValues, errorShift: "Input Required!" } })
    //     check = false
    // } else await this.setState({ inputValues: { ...this.state.inputValues, errorShift: "" } })

    if (!inputValues.groupName) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorGroupName: "Input Required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorGroupName: "" },
      });

    if (!inputValues.shiftGroup) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShiftGroup: "Input Required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShiftGroup: "" },
      });

    if (inputValues.refCode && !inputValues.value) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorValue: "Input Required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorValue: "" },
      });

    if (!inputValues.shiftCode) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShiftCode: "Input Required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShiftCode: "" },
      });

    if (!inputValues.shiftName) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShiftName: "Input Required!",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShiftName: "" },
      });

    if (inputValues.refCode) {
      if (inputValues.from || inputValues.to) {
        if (!inputValues.to) {
          await this.setState({
            inputValues: {
              ...this.state.inputValues,
              errorTo: "Input Required",
            },
          });
          check = false;
        } else
          await this.setState({
            inputValues: { ...this.state.inputValues, errorTo: "" },
          });
        if (!inputValues.from) {
          await this.setState({
            inputValues: {
              ...this.state.inputValues,
              errorFrom: "Input Required",
            },
          });
          check = false;
        } else
          await this.setState({
            inputValues: { ...this.state.inputValues, errorFrom: "" },
          });
      } else
        await this.setState({
          ...this.state.inputValues,
          errorFrom: "",
          errorTo: "",
        });

      if (inputValues.from && inputValues.to) {
        let hourFrom = await parseInt(inputValues.from.substring(0, 2));
        let minuteFrom = await parseInt(inputValues.from.substring(3, 5));
        let hourTo = await parseInt(inputValues.to.substring(0, 2));
        let minuteTo = await parseInt(inputValues.to.substring(3, 5));
        if (hourFrom >= hourTo && minuteFrom >= minuteTo) {
          await this.setState({
            inputValues: { ...this.state.inputValues, errorTo: "Error Time" },
          });
          check = false;
        } else
          await this.setState({
            inputValues: { ...this.state.inputValues, errorTo: "" },
          });
      }
    }
    if (
      inputValues.refCode &&
      inputValues.value !== 0 &&
      inputValues.value < 0
    ) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorValue: "Value is not nagative!",
        },
      });
      check = false;
    }
    if (!check) return false;
    else return true;
  };
  handleInsert = async () => {
    await this.setState({ isLoading: true });
    await this.handleValid("insert").then(async (valid) => {
      if (valid) {
        const inputValues = this.state.inputValues;
        const data = {
          groupName: inputValues.groupName,
          shiftGroup: inputValues.shiftGroup,
          // groupName: inputValues.shift.groupName,
          // shiftGroup: inputValues.shift.shiftGroup,
          refCode: inputValues.refCode ? "ON" : "OFF",
          from: inputValues.from || null,
          to: inputValues.to || null,
          value: inputValues.value || 0,
          order: inputValues.order || null,
          note: inputValues.note || null,
          shiftCode: inputValues.shiftCode,
          shiftName: inputValues.shiftName,
        };
        await this.props.WorkingPlanController.InsertShiftList(
          data,
          this.state.accId
        );
        let response = await this.props.insertShiftLists;
        if (
          typeof response === "object" &&
          response[0] &&
          response[0].alert == "1"
        ) {
          await this.setState({
            datas: this.props.filterShiftLists,
            insertDialog: false,
            inputValues: {},
          });
          await this.highlightParentRow(0);
          await this.Alert("Thêm thành công", "info");
        } else {
          await this.Alert("Thêm thất bại", "error");
          await this.setState({ inputValues: {} });
        }
      }
    });
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
  handleUpdateDialog = async (boolean, rowData, index) => {
    if (boolean) {
      await this.setState({
        updateDialog: true,
        inputValues: {
          ...this.state.inputValues,
          index: index,
          // shift: rowData.groupName && rowData.shiftGroup ? { groupName: rowData.groupName, shiftGroup: rowData.shiftGroup } : null,
          id: rowData.id,
          shiftCode: rowData.shiftCode,
          shiftName: rowData.shiftName,
          from: rowData.from ? rowData.from : 0,
          to: rowData.to ? rowData.to : 0,
          refCode: rowData.refCode === "ON" ? true : false,
          value: rowData.value,
          order: rowData.order,
          status: rowData.status ? true : false,
          note: rowData.note,
          shiftGroup: rowData.shiftGroup,
          groupName: rowData.groupName,
        },
      });
    } else {
      this.setState({ updateDialog: false, inputValues: {} });
    }
  };
  handleUpdate = async () => {
    await this.setState({ isLoading: true });
    await this.handleValid().then(async (valid) => {
      if (valid) {
        const inputValues = this.state.inputValues;
        const data = {
          groupName: inputValues.groupName,
          shiftGroup: inputValues.shiftGroup,
          // groupName: inputValues.shift.groupName,
          // shiftGroup: inputValues.shift.shiftGroup,
          refCode: inputValues.refCode ? "ON" : "OFF",
          from: inputValues.from,
          to: inputValues.to || null,
          value: inputValues.value || null,
          order: inputValues.order || null,
          note: inputValues.note || null,
          shiftCode: inputValues.shiftCode,
          shiftName: inputValues.shiftName,
          status: inputValues.status ? 1 : 0,
          id: inputValues.id,
        };
        await this.props.WorkingPlanController.UpdateShiftList(
          data,
          inputValues.index,
          this.state.accId
        );
        let response = await this.props.updateShiftLists;
        if (
          typeof response === "object" &&
          response[0] &&
          response[0].alert == "1"
        ) {
          await this.setState({
            datas: this.props.filterShiftLists,
            inputValues: {},
            updateDialog: false,
          });
          await this.highlightParentRow(inputValues.index);
          await this.Alert("Cập nhập thành công", "info");
        } else {
          await this.Alert("Cập nhập thất bại", "error");
        }
      }
    });
    await this.setState({ isLoading: false });
  };
  /// export
  handleExport = async () => {
    const state = this.state;
    const data = {
      shiftGroup: state.shiftGroup,
      status: state.status ? 1 : 0,
    };
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.ExportShiftList(
      data,
      this.state.accId
    );
    const result = this.props.exportShiftLists;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  // template
  handleGetTemplate = async () => {
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.TemplateShiftList(this.state.accId);
    const result = this.props.templateShiftLists;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  /// import
  handleImport = async (event) => {
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.ImportShiftList(
      event.files[0],
      this.state.accId
    );
    const result = this.props.importShiftList;
    if (result && result.status === 1) await this.Alert(result.message, "info");
    else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
    await this.fileUpload.current.clear();
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
  showGroup = (rowData) => {
    return (
      <Button
        className="p-button-warning p-button-outlined btn__hover"
        label={rowData.groupName}
        style={{ width: "max-content", float: "left", cursor: "auto" }}
      />
    );
  };
  componentDidMount() {
    this.props.WorkingPlanController.GetShiftList(this.state.accId).then(() => {
      this.setState({ shiftLists: this.props.shiftLists });
    });
  }
  render() {
    const shiftgetlist = this.state.shiftLists;
    let result = [];
    if (shiftgetlist.length > 0) {
      shiftgetlist.forEach((element) => {
        result.push({
          name: element.shiftGroup + " - " + element.groupName,
          value: element.shiftGroup,
        });
      });
    }
    let dialogInsert = null,
      dialogUpdate = null;
    const leftContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.view && (
          <Button
            icon="pi pi-search"
            label={this.props.language["search"] || "l_search"}
            onClick={() => this.handleSearch()}
            style={{ marginRight: "15px" }}
            className="p-button-info"
          />
        )}
        {this.state.permission && this.state.permission.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["export"] || "l_export"}
            onClick={this.handleExport}
            style={{ marginRight: "15px" }}
          />
        )}
        {this.state.permission && this.state.permission.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["template"] || "l_template"}
            onClick={this.handleGetTemplate}
            style={{ marginRight: "15px" }}
          />
        )}
      </React.Fragment>
    );
    const rightContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.create && (
          <Button
            label={this.props.language["insert"] || "l_insert"}
            icon="pi pi-file-o"
            onClick={() => this.handleInsertDialog(true)}
            style={{ marginRight: "15px" }}
          />
        )}
        {this.state.permission && this.state.permission.import && (
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            ref={this.fileUpload}
            mode="basic"
            customUpload={true}
            accept=".xlsx,.xls"
            maxFileSize={10000000}
            style={{ marginRight: "15px" }}
            onClear={this.clear}
            uploadHandler={this.handleImport}
          />
        )}
        {this.state.permission && this.state.permission.import && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
              this.fileUpload.current.fileInput = { value: "" };
              this.fileUpload.current.clear();
            }}
          />
        )}
      </React.Fragment>
    );
    if (this.state.insertDialog) {
      // * INSERT DIALOG
      dialogInsert = (
        <ShiftListDialog
          stateName={"inputValues"}
          actionName={"Insert"}
          inputValues={this.state.inputValues}
          handleChangeForm={this.handleChangeForm}
          handleChange={this.handleChange}
          //dialog
          displayDialog={this.state.insertDialog}
          footerAction={this.footerInsertDialog}
          handleActionDialog={this.handleInsertDialog}
          shiftLists={this.props.shiftLists}
          accId={this.state.accId}
        />
      );
    }
    if (this.state.updateDialog) {
      // * UPDATe DIALOG
      dialogUpdate = (
        <ShiftListDialog
          stateName={"inputValues"}
          actionName={"Update"}
          inputValues={this.state.inputValues}
          handleChangeForm={this.handleChangeForm}
          handleChange={this.handleChange}
          //dialog
          displayDialog={this.state.updateDialog}
          footerAction={this.footerUpdateDialog}
          handleActionDialog={this.handleUpdateDialog}
          shiftLists={this.props.shiftLists}
          accId={this.state.accId}
        />
      );
    }
    return this.state.permission.view ? (
      <Card>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-fluid p-formgrid p-grid">
              <AccountDropDownList
                id="accId"
                className="p-field p-col-12 p-md-3"
                onChange={this.handleChange}
                filter={true}
                showClear={true}
                value={this.state.accId}
              />
              <div className="p-field p-col-12 p-md-6">
                <label>{this.props.language["shift"] || "l_shift"} </label>
                <Dropdown
                  value={this.state.shiftGroup}
                  options={result}
                  id="shiftGroup"
                  onChange={(e) => this.onChange(e.target.id, e.target.value)}
                  optionLabel="name"
                  filter
                  showClear
                  filterBy="name"
                  placeholder={
                    this.props.language["select_shift_group_name"] ||
                    "l_select_shift_group_name"
                  }
                />
              </div>
              <div className="p-col-3 p-md-1 p-sm-6">
                <label>{this.props.language["status"] || "l_status"} </label>
                <br />
                <div style={{ paddingTop: 10 }}>
                  <Checkbox
                    inputId="status"
                    checked={this.state.status}
                    onChange={(e) => this.setState({ status: e.checked })}
                  />
                  <small htmlFor="status">
                    {this.state.status ? " Active" : " InActive"}
                  </small>
                </div>
              </div>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
          </AccordionTab>
        </Accordion>
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
          <Column filter header="No." field="rowNum" style={{ width: 50 }} />
          <Column
            filter
            field="shiftGroup"
            header={this.props.language["shift_group"] || "l_shift_group"}
            style={{ width: "120px", textAlign: "center" }}
          />
          <Column
            filter
            field="groupName"
            header={
              this.props.language["group_name_shift"] || "l_group_name_shift"
            }
            style={{ width: 200, textAlign: "center" }}
          />
          <Column
            field="shiftCode"
            filter={true}
            style={{ width: "110px", textAlign: "center" }}
            header={this.props.language["shift_code"] || "l_shift_code"}
          />
          <Column
            field="shiftName"
            header={this.props.language["shift_name"] || "l_shift_name"}
            style={{ textAlign: "center", width: "150px" }}
            filter={true}
          />
          <Column
            field="from"
            header={this.props.language["from"] || "l_from"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="to"
            header={this.props.language["to"] || "l_to"}
            style={{ width: "80px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="value"
            header={this.props.language["value"] || "l_value"}
            style={{ width: "80px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="refCode"
            header={this.props.language["ref_code"] || "l_ref_code"}
            style={{ width: 80, textAlign: "center" }}
            filter={true}
          />
          <Column
            field="note"
            header={this.props.language["note"] || "l_note"}
            style={{ width: "300px" }}
            filter={true}
          />
          <Column
            body={this.actionButtons}
            header="#"
            style={{ width: 70, textAlign: "center" }}
          ></Column>
        </DataTable>
        {dialogInsert}
        {dialogUpdate}
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
    filterShiftLists: state.workingPlans.filterShiftLists,
    exportShiftLists: state.workingPlans.exportShiftLists,
    insertShiftLists: state.workingPlans.insertShiftLists,
    updateShiftLists: state.workingPlans.updateShiftLists,
    templateShiftLists: state.workingPlans.templateShiftLists,
    importShiftList: state.workingPlans.importShiftList,
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
export default connect(mapStateToProps, mapDispatchToProps)(ShiftList);
