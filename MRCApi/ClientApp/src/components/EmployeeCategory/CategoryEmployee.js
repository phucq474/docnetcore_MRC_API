import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { download } from "../../Utils/Helpler";
import { FileUpload } from "primereact/fileupload";
import { HelpPermission } from "../../Utils/Helpler";
import { ProgressSpinner } from "primereact/progressspinner";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import { CategoryApp } from "../Controls/CategoryMaster";
import { EmployeeCategoryCreateAction } from "../../store/EmployeeCategoryController";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import "../../css/highlight.css";
import Page403 from "../ErrorRoute/page403";
import CategoryEmployeeDialog from "./CategoryEmployeeDialog";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { ProductCreateAction } from "../../store/ProductController";
import { AccountDropDownList } from "../Controls/AccountDropDownList";
import { Dropdown } from "primereact/dropdown";

class CategoryEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      updateDialog: false,
      insertDialog: false,
      deleteDialog: false,
      rowData: {},
      inputValues: {},
      yearData: [],
      monthData: [],
      isLoading: false,
      permission: {},
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      accId: null,
      categories: [],
    };
    this.pageId = 3104;
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.actionButtons = this.actionButtons.bind(this);
    this.fileUpload = React.createRef();
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
      life: style === "error" ? 10000 : 3000,
    });
  };

  getFilter = () => {
    const states = this.state;
    const fromdate = states.dates[0];
    const todate = states.dates[1];
    let lstEm = null;
    if (states.employee !== null && states.employee !== undefined)
      if (states.employee.length > 0) {
        lstEm = "";
        states.employee.forEach((element) => {
          lstEm = lstEm + element.id + ",";
        });
      }
    const data = {
      categoryId: states.categoryId ? states.categoryId : null,
      employeeId: lstEm,
      supId: states.supId ? states.supId : null,
      fromDate: moment(new Date(fromdate)).format("YYYYMMDD"),
      toDate:
        todate === undefined || todate === null
          ? moment(fromdate).format("YYYYMMDD")
          : moment(todate).format("YYYYMMDD"),
      fromdate: moment(fromdate).format("YYYY-MM-DD"),
      todate: moment(todate).format("YYYY-MM-DD"),
    };
    return data;
  };

  handleSearch = async () => {
    this.setState({ isLoading: true, datas: [] });
    const data = this.getFilter();
    await this.props.EmployeeCategoryController.EC_Filter(
      data,
      this.state.accId
    ).then(() => {
      const rs = this.props.ec_filter;
      if (rs.status === 200) {
        this.setState({
          datas: rs.data,
          isLoading: false,
        });
        this.Alert(rs.message, "success");
      } else {
        this.setState({
          isLoading: false,
        });
        this.Alert(rs.message, "error");
      }
    });
  };
  //////// Insert
  handleInsertDialog = (boolean) => {
    if (boolean) {
      this.setState({ insertDialog: true, inputValues: {} });
    } else {
      this.setState({ insertDialog: false, inputValues: {} });
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
    if (!this.state.inputValues.categoryId) {
      await this.Alert("Please choose category", "error");
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorCategoryId: "" },
      });
    if (!this.state.inputValues.employeeId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorEmployeeId: "Input Required!",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorEmployeeId: "" },
      });
    if (!this.state.inputValues.fromDate) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorFromDate: "Input Required!",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorFromDate: "" },
      });

    if (!check) return false;
    else return true;
  };
  async handleInsert() {
    await this.setState({ isLoading: true });
    let { employeeId, categoryId, fromDate, toDate } = await this.state
      .inputValues;
    await this.handleValid().then(async (valid) => {
      if (valid) {
        const data = {
          categoryId: categoryId || null,
          employeeId: employeeId || null,
          fromDate: fromDate,
          toDate: toDate || null,
          id: 0,
        };
        await this.props.EmployeeCategoryController.EC_Save(
          data,
          this.state.accId
        );
        let result = await this.props.ec_save;
        if (result.status === 200) {
          await this.setState({
            datas: result.data,
            insertDialog: false,
            inputValues: {},
            isLoading: false,
          });
          await this.highlightParentRow(0);
          await this.Alert(result.message, "info");
        } else {
          await this.Alert(result.message, "error");
          await this.setState({ isLoading: false });
        }
      }
    });
    await this.setState({ isLoading: false });
  }
  ///////// Update
  handleUpdateDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        updateDialog: true,
        inputValues: {
          ...this.state.inputValues,
          employeeId: rowData ? rowData.employeeId : "",
          dates: [
            new Date(moment(rowData.fromDate).format("YYYY/MM/DD")),
            rowData.toDate
              ? new Date(moment(rowData.toDate).format("YYYY/MM/DD"))
              : null,
          ],
          fromDate: rowData
            ? parseInt(moment(rowData.fromDate).format("YYYYMMDD"))
            : null,
          toDate: rowData.toDate
            ? parseInt(moment(rowData.toDate).format("YYYYMMDD"))
            : null,
          id: rowData ? rowData.id : "",
          categoryId: rowData ? rowData.categoryId : "",
          index: index,
        },
      });
    } else {
      this.setState({ updateDialog: false, inputValues: {} });
    }
  };
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
  async handleUpdate() {
    await this.setState({ isLoading: true });
    let { employeeId, categoryId, fromDate, toDate, index, id } = await this
      .state.inputValues;
    const data = {
      categoryId: categoryId || null,
      employeeId: employeeId || null,
      id: id || null,
      fromDate: fromDate,
      toDate: toDate || null,
    };
    await this.handleValid().then(async (valid) => {
      if (valid) {
        await this.props.EmployeeCategoryController.EC_Save(
          data,
          this.state.accId
        );
        let response = await this.props.ec_save;
        if (response.status === 200) {
          let datas = this.state.datas;
          let newData = response.data[0];
          let ind = datas.findIndex((p) => p.id === id);
          newData.rowNum = datas[ind].rowNum;
          datas[ind] = newData;
          await this.setState({
            datas: datas,
            isLoading: false,
            updateDialog: false,
            inputValues: {},
          });
          await this.highlightParentRow(index);
          await this.Alert(response.message, "info");
        } else {
          await this.Alert(response.message, "error");
        }
      }
    });
    await this.setState({ isLoading: false });
  }
  //////// Delete
  handleDeleteDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        deleteDialog: true,
        inputValues: {
          ...this.state.inputValues,
          id: rowData ? rowData.id : "",
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
              className="p-button-info"
              onClick={() => this.handleDeleteDialog(false)}
            />
            <Button
              label={this.props.language["delete"] || "l_delete"}
              className="p-button-danger"
              onClick={() => this.handleDelete()}
            />
          </div>
        )}
      </div>
    );
  };
  async handleDelete() {
    await this.setState({ isLoading: true });
    await this.props.EmployeeCategoryController.EC_Delete(
      this.state.inputValues.id,
      this.state.accId
    );
    const response = await this.props.ec_delete;
    if (response.status === 200) {
      let datas = this.state.datas;
      let ind = datas.findIndex((p) => p.id === this.state.inputValues.id);
      datas.splice(ind, 1);
      await this.setState({
        datas: datas,
        isLoading: false,
        inputValues: {},
        deleteDialog: false,
      });
      // await this.handleSearch()
      await this.Alert(response.message, "info");
    } else {
      await this.Alert(response.message, "error");
    }
    await this.setState({ isLoading: false });
  }
  async handleExport() {
    this.setState({ isLoading: true });
    const data = this.getFilter();
    await this.props.EmployeeCategoryController.EC_Export(
      data,
      this.state.accId
    ).then(() => {
      const rs = this.props.ec_export;
      if (rs.status === 200) {
        download(rs.fileUrl);
        this.setState({
          isLoading: false,
        });
        this.Alert(rs.message, "success");
      } else {
        this.setState({
          isLoading: false,
        });
        this.Alert(rs.message, "error");
      }
    });
  }
  async handleImport(event) {
    await this.setState({ isLoading: true });
    await this.props.EmployeeCategoryController.EC_Import(
      event.files[0],
      this.state.accId
    );
    let response = await this.props.ec_import;
    if (response.status === 200) {
      await this.Alert(response.message, "info");
    } else {
      await this.Alert(response.message, "error");
    }
    this.fileUpload.current.fileInput = await { value: "" };
    await this.fileUpload.current.clear();
    await this.setState({ isLoading: false });
  }
  handleGetTemplate = async () => {
    this.setState({ isLoading: true });
    await this.props.EmployeeCategoryController.EC_Template(
      this.state.accId
    ).then(() => {
      const rs = this.props.ec_template;
      if (rs.status === 200) {
        download(rs.fileUrl);
        this.setState({
          isLoading: false,
        });
        this.Alert(rs.message, "success");
      } else {
        this.setState({
          isLoading: false,
        });
        this.Alert(rs.message, "error");
      }
    });
  };
  actionButtons(rowData, event) {
    return (
      <div a>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-info p-button-outlined btn__hover"
            style={{ marginRight: "10px" }}
            onClick={() =>
              this.handleUpdateDialog(true, rowData, event.rowIndex)
            }
          />
        )}
        {this.state.permission.delete && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-outlined btn__hover"
            onClick={() =>
              this.handleDeleteDialog(true, rowData, event.rowIndex)
            }
          />
        )}
      </div>
    );
  }
  ///////// handle Change
  handleCalendar = async (id, value) => {
    await this.setState({
      inputValues: { ...this.state.inputValues, [id]: value ? value : "" },
    });
    if (id === "dates") {
      let dates = this.state.inputValues.dates;
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          fromDate: dates
            ? parseInt(moment(dates[0]).format("YYYYMMDD"))
            : null,
          toDate:
            dates && dates[1]
              ? parseInt(moment(dates[1]).format("YYYYMMDD"))
              : null,
        },
      });
    }
  };
  handleChangeDropDown = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  };
  handleChange = async (id, value) => {
    if (id === "position" || id === "supId") {
      this.setState({ employee: 0, [id]: value === null ? "" : value });
    } else if (id === "accId") {
      await this.props.ProductController.GetCategory(value).then(() => {
        const categories = this.props.categories ? this.props.categories : [];
        const groupDivision = categories.reduce((unique, o) => {
          if (!unique.some((obj) => obj.value === o.divisionId)) {
            unique.push({
              name: o.division,
              value: o.divisionId,
              key: o.divisionId,
            });
          }
          return unique;
        }, []);
        this.setState({
          categories: groupDivision,
          [id]: value === null ? "" : value,
        });
      });
    } else {
      this.setState({
        [id]: value === null ? "" : value,
      });
    }
  };
  async componentDidMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
    await this.props.ProductController.GetCategory(this.state.accId).then(
      () => {
        const categories = this.props.categories ? this.props.categories : [];
        const groupDivision = categories.reduce((unique, o) => {
          if (!unique.some((obj) => obj.value === o.divisionId)) {
            unique.push({
              name: o.division,
              value: o.divisionId,
              key: o.divisionId,
            });
          }
          return unique;
        }, []);
        this.setState({ categories: groupDivision });
      }
    );
  }
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
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    let dataTable = null,
      dialogInsert = null,
      dialogUpdate = null,
      dialogConfirm = null;
    const leftContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.view && (
          <Button
            icon="pi pi-search"
            label={this.props.language["search"] || "l_search"}
            onClick={() => this.handleSearch(false)}
            style={{ marginRight: "15px" }}
            className="p-button-success"
          />
        )}
        {this.state.permission && this.state.permission.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["export"] || "l_export"}
            onClick={this.handleExport}
            style={{ marginRight: "15px" }}
            className="p-button-info"
          />
        )}
      </React.Fragment>
    );
    const rightContents = (
      <React.Fragment>
        {this.state.permission && this.state.permission.create && (
          <Button
            label={this.props.language["insert"] || "l_insert"}
            icon="pi pi-plus"
            onClick={() => this.handleInsertDialog(true)}
            style={{ marginRight: "15px" }}
            className="p-button-danger"
          />
        )}
        {this.state.permission && this.state.permission.import && (
          <Button
            icon="pi pi-download"
            label={this.props.language["template"] || "l_template"}
            onClick={this.handleGetTemplate}
            style={{ marginRight: "15px" }}
            className="p-button-warning"
          />
        )}
        {this.state.permission && this.state.permission.import && (
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            ref={this.fileUpload}
            mode="basic"
            onClear={this.clear}
            uploadHandler={this.handleImport}
            customUpload={true}
            accept=".xlsx,.xls"
            maxFileSize={10000000}
            style={{ marginRight: "15px" }}
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
    if (this.state.datas.length > 0) {
      // * Datatable
      dataTable = (
        <DataTable
          value={this.state.datas}
          paginator
          rows={20}
          resizableColumns
          columnResizeMode="expand"
          rowsPerPageOptions={[10, 20, 50]}
          paginatorPosition={"both"}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowHover
        >
          <Column
            field="rowNum"
            header="No."
            style={{ width: "5%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="supName"
            header={this.props.language["manager"] || "l_manager"}
            style={{ width: "10%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="employeeCode"
            header={this.props.language["employee_code"] || "l_employee_code"}
            style={{ width: "10%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="employeeName"
            header={this.props.language["employee_name"] || "l_employee_name"}
            style={{ width: "15%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="category"
            header={this.props.language["category"] || "l_category"}
            style={{ width: "10%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="fromDate"
            header={this.props.language["from_date"] || "l_from_date"}
            style={{ width: "10%", textAlign: "center" }}
          ></Column>
          <Column
            filter
            field="toDate"
            header={this.props.language["to_date"] || "l_to_date"}
            style={{ width: "10%", textAlign: "center" }}
          ></Column>
          <Column
            body={this.actionButtons}
            header="#"
            style={{ width: "5%", textAlign: "center" }}
          ></Column>
        </DataTable>
      );
    }
    if (this.state.insertDialog) {
      // * INSERT DIALOG
      dialogInsert = (
        <CategoryEmployeeDialog
          stateName={"inputValues"}
          actionName={"Insert"}
          handleChangeDropDown={this.handleChangeDropDown}
          displayDialog={this.state.insertDialog}
          footerAction={this.footerInsertDialog}
          handleActionDialog={this.handleInsertDialog}
          inputValues={this.state.inputValues}
          handleChange={this.handleChange}
          handleCalendar={this.handleCalendar}
          accId={this.state.accId}
          categories={this.state.categories}
        />
      );
    }
    if (this.state.updateDialog) {
      // * UPDATE DIALOG
      dialogInsert = (
        <CategoryEmployeeDialog
          stateName={"inputValues"}
          actionName={"Update"}
          handleChangeDropDown={this.handleChangeDropDown}
          displayDialog={this.state.updateDialog}
          footerAction={this.footerUpdateDialog}
          handleActionDialog={this.handleUpdateDialog}
          inputValues={this.state.inputValues}
          handleChange={this.handleChange}
          handleCalendar={this.handleCalendar}
          accId={this.state.accId}
          categories={this.state.categories}
        />
      );
    }
    if (this.state.deleteDialog) {
      // * CONFIRM DIALOG
      dialogConfirm = (
        <Dialog
          header="Confirmation"
          visible={this.state.deleteDialog}
          modal
          style={{ width: "350px" }}
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
      <React.Fragment>
        <Toast ref={(el) => (this.toast = el)} />
        {this.state.isLoading && (
          <div className="loading_container">
            <ProgressSpinner
              className="loading_spinner"
              strokeWidth="8"
              fill="none"
              animationDuration=".5s"
            />
          </div>
        )}
        <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
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
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["from_to_date"] || "l_from_to_date"}
                </label>
                <Calendar
                  fluid
                  value={this.state.dates}
                  onChange={(e) => this.setState({ dates: e.value })}
                  dateFormat="yy-mm-dd"
                  inputClassName="p-inputtext"
                  id="fromDate"
                  selectionMode="range"
                  inputStyle={{ width: "91.5%", visible: false }}
                  style={{ width: "100%" }}
                  showIcon
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["supervisor"] || "l_supervisor"}
                </label>
                <EmployeeDropDownList
                  type="SUP-Leader"
                  typeId={0}
                  id="supId"
                  parentId={null}
                  mode="single"
                  accId={this.state.accId}
                  onChange={this.handleChange}
                  value={this.state.supId || ""}
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["position"] || "position"}</label>
                <EmployeeTypeDropDownList
                  id="position"
                  type={this.state.position}
                  accId={this.state.accId}
                  onChange={this.handleChange}
                  value={this.state.position}
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["employee"] || "l_employee"}</label>
                <EmployeeDropDownList
                  type={this.state.position}
                  id="employee"
                  accId={this.state.accId}
                  typeId={this.state.position === "" ? 0 : this.state.position}
                  parentId={null}
                  onChange={this.handleChange}
                  value={this.state.employee}
                />
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["category"] || "l_category"}</label>
                <Dropdown
                  id="categoryId"
                  style={{ width: "100%" }}
                  options={this.state.categories}
                  onChange={(e) =>
                    this.handleChange("categoryId", e.target.value)
                  }
                  value={this.state.categoryId}
                  placeholder={
                    this.props.language["select_an_option"] ||
                    "l_select_an_option"
                  }
                  optionLabel="name"
                  filterPlaceholder={
                    this.props.language["select_an_option"] ||
                    "l_select_an_option"
                  }
                  filterBy="name"
                  filter
                  showClear={true}
                />
              </div>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
          </AccordionTab>
        </Accordion>
        {dataTable}
        {dialogInsert}
        {dialogUpdate}
        {dialogConfirm}
      </React.Fragment>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    employeeDDL: state.employees.employeeDDL,
    ec_filter: state.employeeCategory.ec_filter,
    ec_export: state.employeeCategory.ec_export,
    ec_template: state.employeeCategory.ec_template,
    ec_import: state.employeeCategory.ec_import,
    ec_save: state.employeeCategory.ec_save,
    ec_delete: state.employeeCategory.ec_delete,
    categories: state.products.categories,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    EmployeeCategoryController: bindActionCreators(
      EmployeeCategoryCreateAction,
      dispatch
    ),
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoryEmployee);
