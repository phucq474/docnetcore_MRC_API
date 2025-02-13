import React, { createRef, PureComponent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { ProgressBar } from "primereact/progressbar";
import { bindActionCreators } from "redux";
import { FileUpload } from "primereact/fileupload";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { download, HelpPermission } from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import { SOSListActionCreators } from "../../store/SOSListController";
import { AccountDropDownList } from "../Controls/AccountDropDownList";
class SOSList extends PureComponent {
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
      dataSOSList: [],
      loading: false,
      status: true,
      accId: null,
    };
    this.fileUpload = React.createRef();
    this.pageId = 3102;
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
  handleChange(id, value) {
    this.setState({ [id]: value === null ? "" : value });
  }
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
    await this.setState({ loading: true });
    await this.props.SOSListController.GetList(this.state.accId);
    const result = this.props.sosList;
    if (result && result.length > 0) {
      await this.Alert("Tìm kiếm thành công", "info");
    } else await this.Alert("Không có dữ liệu", "info");
    await this.setState({ loading: false, dataSOSList: result });
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
  /// export
  handleExport = async () => {
    await this.setState({ loading: true });
    await this.props.SOSListController.Export(this.state.accId);
    const result = this.props.exported;
    if (result && result.status === 200) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  // template
  handleGetTemplate = async () => {};
  /// import
  handleImport = async (event) => {
    await this.setState({ loading: true });
    await this.props.WorkingPlanController.ImportShiftList(event.files[0]);
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
  async componentDidMount() {
    await this.props.SOSListController.GetList(this.state.accId);
    const result = this.props.sosList;
    if (result.length > 0) {
      await this.Alert("Tìm kiếm thành công", "info");
      await this.setState({ dataSOSList: result });
    } else await this.Alert("Không có dữ liệu", "error");
  }
  render() {
    let dialogInsert = null,
      dialogUpdate = null;
    const leftContents = (
      <React.Fragment>
        {this.state.permission?.view && (
          <Button
            icon="pi pi-search"
            label={this.props.language["search"] || "l_search"}
            onClick={() => this.handleSearch()}
            style={{ marginRight: "15px" }}
            className="p-button-info"
          />
        )}
        {this.state.permission?.export && (
          <Button
            icon="pi pi-download"
            label={this.props.language["export"] || "l_export"}
            onClick={this.handleExport}
            style={{ marginRight: "15px" }}
          />
        )}
        {/* {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />} */}
      </React.Fragment>
    );
    const rightContents = (
      <React.Fragment>
        {this.state.permission?.create && (
          <Button
            label={this.props.language["insert"] || "l_insert"}
            icon="pi pi-file-o"
            onClick={() => this.handleInsertDialog(true)}
            style={{ marginRight: "15px" }}
          />
        )}
        {/* {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic"
                    customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }}
                    onClear={this.clear} uploadHandler={this.handleImport}
                />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />} */}
      </React.Fragment>
    );

    return this.state.permission.view ? (
      <>
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
            </div>
            <Toolbar left={leftContents} right={rightContents} />
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>

        <DataTable
          paginatorPosition={"both"}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          value={this.state.dataSOSList}
          paginator={true}
          rows={50}
          rowsPerPageOptions={[20, 50, 100]}
          style={{ fontSize: "13px", marginTop: 10 }}
        >
          <Column
            filter
            header="No."
            field="rowNum"
            style={{ width: 50, textAlign: "center" }}
          />
          <Column
            filter
            field="division"
            header={this.props.language["division_"] || "l_division_"}
            style={{ width: 100 }}
          />
          <Column
            filter
            field="groupName"
            header={this.props.language["group_name"] || "l_group_name"}
            style={{ width: 200 }}
          />
          <Column
            filter
            field="brand"
            header={this.props.language["brand"] || "l_brand"}
            style={{ width: 150 }}
          />
          <Column
            field="category"
            filter={true}
            header={this.props.language["item_name"] || "l_item_name"}
          />
          <Column
            field="categoryVN"
            filter={true}
            header={this.props.language["item_name_vn"] || "l_item_name_vn"}
          />
          <Column
            field="fromDate"
            header={this.props.language["apply_date"] || "l_apply_date"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />

          <Column
            field="toDate"
            header={this.props.language["end_date"] || "l_end_date"}
            style={{ width: "100px", textAlign: "center" }}
            filter={true}
          />
          <Column
            field="active"
            header={this.props.language["status_name"] || "l_status_name"}
            style={{ width: "100px", textAlign: "center" }}
            body={(rowData) => {
              <label>{rowData.active === 1 ? "Active" : "Inactive"}</label>;
            }}
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
      </>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    sosList: state.sosList.sosList,
    exported: state.sosList.exported,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SOSListController: bindActionCreators(SOSListActionCreators, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SOSList);
