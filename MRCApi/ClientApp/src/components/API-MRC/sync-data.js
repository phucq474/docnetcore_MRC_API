import React, { PureComponent } from "react";
import { download, HelpPermission } from "../../Utils/Helpler";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SyncDataCreateAction } from "../../store/SyncDataController";
import moment from "moment";

const lstAPI = [
  { value: "ATTENDANCE", name: "ATTENDANCE" },
  { value: "MCP", name: "MCP" },
  { value: "OSA", name: "OSA" },
  { value: "SALESBYMONTH", name: "SALESBYMONTH" },
  { value: "STAFF_INFORMATION", name: "STAFF_INFORMATION" },
  { value: "STORE_LIST", name: "STORE_LIST" },
  { value: "VISIBILITY", name: "VISIBILITY" },
  { value: "DATEJOIN_DATEQUIT", name: "DATEJOIN_DATEQUIT" },
  { value: "WORKING_HISTORY", name: "WORKING_HISTORY" },
  { value: "MTDashboard_ATTENDANCE", name: "MTDashboard - ATTENDANCE" },
  { value: "MTDashboard_Coverage", name: "MTDashboard - Coverage" },
  { value: "MTDashboard_Inventory", name: "MTDashboard - Inventory" },
  { value: "MTDashboard_MCP", name: "MTDashboard - MCP" },
  { value: "MTDashboard_OSA", name: "MTDashboard - OSA" },
  {
    value: "MTDashboard_STAFF_INFORMATION",
    name: "MTDashboard - STAFF_INFORMATION",
  },
  { value: "MTDashboard_STORE_LIST", name: "MTDashboard - STORE_LIST" },
  { value: "MTDashboard_Visibility", name: "MTDashboard - Visibility" },
  { value: "MTDashboard_PlanCall", name: "MTDashboard - PlanCall" },
];

class SyncData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      api: null,
      permission: {
        view: true,
        edit: true,
        delete: true,
        import: true,
        export: true,
      },
    };
    this.pageId = 3164;
    this.fileUpload = React.createRef();
    this.handleExportData = this.handleExportData.bind(this);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  Alert = (messager, typestyle) => {
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: messager,
    });
  };
  async handleImport(eFile) {
    await this.setState({ loading: true });
    await this.props.SyncDataController.Import(eFile);
    const result = this.props.result;
    if (result.status === 200) await this.Alert(result.message, "info");
    else await this.Alert(result.message, "error");

    this.fileUpload.current.fileInput = { value: "" };
    this.fileUpload.current.clear();

    await this.setState({ loading: false });
  }
  async handleExportData() {
    await this.setState({ loading: true });
    let data = {
      TypeReport: this.state.api,
      FromDate: moment(this.state.dates[0]).format("YYYY-MM-DD"),
      ToDate: moment(this.state.dates[1]).format("YYYY-MM-DD"),
    };
    await this.props.SyncDataController.Export(data);
    const result = this.props.fileExport;
    if (result.status === 200) {
      download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  }
  renderToolbar() {
    const { permission } = this.state;
    let leftSearch = [],
      rightSearch = [];
    // if (permission?.view) {
    //   leftSearch.push(
    //     <Button
    //       label={this.props.language["search"] || "l_search"}
    //       icon="pi pi-search"
    //       style={{ width: "auto", marginRight: ".25em" }}
    //       onClick={this.LoadList}
    //     />
    //   );
    // }
    if (permission?.export) {
      leftSearch.push(
        <Button
          label={this.props.language["export"] || "l_export"}
          icon="pi pi-file-excel"
          style={{ width: "auto", marginRight: ".25em" }}
          className="p-button-danger"
          onClick={this.handleExportData}
        />
      );
    }

    if (permission?.import) {
      rightSearch.push(
        <Button
          label={this.props.language["template"] || "l_template"}
          icon="pi pi-download"
          className="p-button-secondary"
          style={{ marginRight: 10 }}
          onClick={() =>
            download("/export/template_MRC/tmp_Working History.xlsx")
          }
        />
      );
    }

    if (permission?.import) {
      rightSearch.push(
        <FileUpload
          chooseLabel={this.props.language["import"] || "l_import"}
          ref={this.fileUpload}
          mode="basic"
          onClear={this.clear}
          uploadHandler={(e) => {
            this.handleImport(e.files[0]);
          }}
          customUpload={true}
          accept=".xlsx,.xls"
          maxFileSize={10000000}
        />
      );
      rightSearch.push(
        <Button
          icon="pi pi-times"
          style={{ marginLeft: -10 }}
          className="p-button-danger"
          onClick={() => {
            this.fileUpload.current.fileInput = { value: "" };
            this.fileUpload.current.clear();
          }}
        />
      );
    }
    return <Toolbar left={leftSearch} right={rightSearch} />;
  }
  render() {
    return (
      <React.Fragment>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-fluid p-grid p-formgrid">
              <div className="p-field p-col-12 p-md-6 p-lg-3">
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
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["api_name"] || "l_api_name"}</label>
                <Dropdown
                  id="api"
                  style={{ width: "100%" }}
                  value={this.state.api}
                  options={lstAPI}
                  showClear
                  onChange={(e) => this.setState({ api: e.value })}
                  optionLabel="name"
                  placeholder={this.props.language["api_name"] || "l_api_name"}
                />
              </div>
            </div>
            {this.renderToolbar()}
            {this.state.loading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            )}
          </AccordionTab>
        </Accordion>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    fileExport: state.syncData.fileExport,
    result: state.syncData.result,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SyncDataController: bindActionCreators(SyncDataCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SyncData);
