import React, { PureComponent } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import ReportDropDownList from "../Controls/ReportDropDownList";
import MasterListDataDropDownList from "../Controls/MasterListDataDropDownList.js";
import { RegionActionCreate } from "../../store/RegionController";
import { ReportCreateAction } from "../../store/ReportController";
import { RegionApp } from "./RegionMaster";
import { Toast } from "primereact/toast";
import { download, getLogin } from "../../Utils/Helpler";
import { FileUpload } from "primereact/fileupload";
import ChannelDropDownList from "./ChannelDropDownList";
import CustomerDropDownList from "./CustomerDropDownList";
import { AccountDropDownList } from "./AccountDropDownList";

//const USER = JSON.parse(localStorage.getItem("USER"));
const lstQCStatus = [
  { name: "No QC", value: "NoQC" },
  { name: "Progressing", value: "Progressing" },
  { name: "Pass", value: "Pass" },
  { name: "Fail", value: "Fail" },
];

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dates: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 1
        ),
        new Date(),
      ],
      // dates: [new Date(2020,2,1),new Date(2021,2,31)],
      dealerId: null,
      area: null,
      province: [],
      supId: null,
      position: null,
      employee: [],
      shopCode: null,
      result: null,
      reportType: null,
      status: this.props.statuses ? this.props.statuses[2] : null,
      qcStatus: null,
      loading: false,
      downloaded: 0,
      accId: null,
    };
    this.fileUpload = React.createRef();
    this.LoadList = this.LoadList.bind(this);
    this.handleExportData = this.handleExportData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
  }
  async componentDidMount() {
    await this.DefaultLoad();
  }
  static propTypes = {
    pageType: PropTypes.string.isRequired,
  };
  DefaultLoad = () => {
    const user = JSON.parse(localStorage.getItem("USER"));
    this.props.RegionController.GetListRegion();
  };

  fToast = async (messager, stylename) => {
    await this.toast.show({
      severity: stylename === undefined ? "success" : stylename,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: messager,
    });
    await this.setState({ loading: false, downloaded: 0 });
  };
  async handleGetData() {
    if (this.state.dates === undefined || this.state.dates === null) {
      await this.fToast(
        `${
          this.props.language["please_select_start_date"] ||
          "l_please_select_start_date"
        }`,
        "error"
      );
      return;
    }
    const fromdate = await this.state.dates[0];
    const todate = await this.state.dates[1];
    if (fromdate === undefined || fromdate === null) {
      await this.fToast(
        `${
          this.props.language["please_select_start_date"] ||
          "l_please_select_start_date"
        }`,
        "error"
      );
      return;
    }
    //
    const province = await this.state.province;
    let lstProvince = await null;
    if (province) {
      lstProvince = await "";
      await province.forEach((p) => {
        lstProvince += p + ",";
      });
    }
    //sup
    const sup = await this.state.supId;
    let lstSup = await null;
    if (sup) {
      lstSup = await "";
      await sup.forEach((p) => {
        lstSup += p + ",";
      });
    }
    // employee
    const employees = await this.state.employee;
    let lstEmp = await null;
    if (employees) {
      lstEmp = await "";
      if(employees.length >0){
        await employees.forEach((element) => {
          lstEmp = lstEmp + element + ",";
        });
      }else{
          lstEmp = lstEmp + employees;
      }
    }

    const positions = await this.state.position;
    let lstPosition = await null;
    if (
      getLogin().accountName === "Fonterra" &&
      this.props.pageType === "attendant"
    ) {
      if (positions) {
        lstPosition = await "";
        await positions.forEach((element) => {
          lstPosition = lstPosition + element + ",";
        });
      }
    }
    var data = await {
      fromDate: moment(fromdate).format("YYYYMMDD"),
      toDate:
        todate === undefined || todate === null
          ? moment(fromdate).format("YYYYMMDD")
          : moment(todate).format("YYYYMMDD"),
      fromdate: moment(fromdate).format("YYYY-MM-DD"),
      todate:
        todate === undefined || todate === null
          ? moment(fromdate).format("YYYY-MM-DD")
          : moment(todate).format("YYYY-MM-DD"),
      customerId: !this.state.customerId
        ? null
        : this.state.customerId?.join(","),
      channelId: !this.state.channelId ? null : this.state.channelId,
      area: this.state.area === "" ? null : this.state.area,
      province: lstProvince === "" ? null : lstProvince,
      supId: lstSup === "" ? null : lstSup,
      position: this.state.position === "" ? null : this.state.position,
      positionString: lstPosition === "" ? null : lstPosition,
      employeeId: lstEmp === "" ? null : lstEmp,
      shopCode: this.state.shopCode === "" ? null : this.state.shopCode,
      qcStatus: this.state.qcStatus === "" ? null : this.state.qcStatus,
      kpiQC: this.state.kpiQC === "" ? null : this.state.kpiQC,
      reportType: this.state.reportType,
      accountName: getLogin().accountName,
      accId: this.state.accId,
    };
    return data;
  }
  async LoadList() {
    await this.setState({ loading: true });
    let data = await this.handleGetData();
    await this.props.Search(data);
    await this.setState({ loading: false });
  }
  async handleExportData(type) {
    await this.setState({ loading: true });
    let data = await this.handleGetData();
    switch (this.props.pageType) {
      case "report":
        if (data.reportType === "" || data.reportType === null) {
          this.fToast(
            `${
              this.props.language["please_choose_a_type_of_report"] ||
              "l_please_choose_a_type_of_report"
            }`,
            "error"
          );
          await this.setState({ loading: false });
          return;
        }
        await this.props.ReportController.GetFileReport(data);
        break;
      default:
        if (type === "ppt") await this.props.ExportPPT(data);
        else await this.props.Export(data);
        break;
    }
    await this.setState({ downloaded: 1, loading: false });
  }
  handleChange(id, value) {
    this.setState({
      [id]: value === null ? "" : value,
      downloaded: 0,
    });
    if (id === "position" || id === "supId") this.setState({ employee: [] });
    if (id === "accId" && this.props.handleChange) {
      this.props.handleChange(id, value);
    }
  }
  handleChangeForm(e) {
    this.setState({
      [e.target.id]: e.target.value === null ? "" : e.target.value,
      downloaded: 0,
    });
  }
  renderToolbar() {
    const { permission } = this.props;
    const user = JSON.parse(localStorage.getItem("USER"));
    const positionId = user?.positionId;
    let urlFile;
    let leftSearch = [],
      rightSearch = [];
    if (this.props.isVisibleFilter === false);
    else if (permission && permission.view === true) {
      leftSearch.push(
        <Button
          label={this.props.language["search"] || "l_search"}
          icon="pi pi-search"
          style={{ width: "auto", marginRight: ".25em" }}
          onClick={this.LoadList}
        />
      );
    }
    if (this.props.isVisibleExport === false || positionId === 77);
    else if (permission?.export) {
      leftSearch.push(
        <Button
          label={this.props.language["export"] || "l_export"}
          icon="pi pi-file-excel"
          style={{ width: "auto", marginRight: ".25em" }}
          className="p-button-success"
          onClick={() => this.handleExportData()}
        />
      );
      if (this.props.isVisibleExportPPT)
        leftSearch.push(
          <Button
            label={this.props.language["export_ppt"] || "l_export_ppt"}
            icon="pi pi-file-export"
            style={{ width: "auto", marginRight: ".25em" }}
            className="p-button-warning"
            onClick={() => this.handleExportData("ppt")}
          />
        );
    }
    switch (this.props.pageType) {
      case "report":
        urlFile = this.props.urlFileReport;
        break;
      default:
        urlFile = this.props.urlFile;
        break;
    }

    if (urlFile !== "" && urlFile !== undefined && urlFile !== null) {
      if (urlFile.status === 1 || urlFile.status === 200) {
        if (this.state.downloaded === 1) {
          this.fToast(urlFile.message);
          download(urlFile.fileUrl);
        }
      } else if (
        (urlFile.status === 0 || urlFile.status > 200) &&
        this.state.downloaded === 1
      ) {
        this.fToast(urlFile.message, "error");
      }
      if (this.fileUpload.current) {
        this.fileUpload.current.fileInput = { value: "" };
        this.fileUpload.current.clear();
      }
    }

    if (this.props.haveTemplate) {
      rightSearch.push(
        <Button
          className="p-button-warning"
          label={this.props.language["template"] || "l_template"}
          icon="pi pi-download"
          style={{ marginRight: 10 }}
          onClick={() => {
            const data = this.handleGetData();
            this.setState({ loading: true });
            this.props.Template(data);
            this.setState({ loading: false });
          }}
        />
      );
    }

    switch (this.props.pageType) {
      case "working_plan_default": {
        const { handleInsertDialog } = this.props;
        if (permission && permission.create === true) {
          rightSearch.push(
            <Button
              className="p-button-danger"
              label={this.props.language["create"] || "create"}
              icon="pi pi-user-edit"
              style={{ width: "auto", marginRight: ".25em" }}
              onClick={() => handleInsertDialog(true)}
            />
          );
        }
        break;
      }
      case "attendant": {
        const { handleDialogAttendant, state } = this.props;
        // if (user.accountId === 10 && permission && permission.create === true && permission.view === true) {
        //     leftSearch.push(<Button
        //         label={this.props.language["sync_data"] || "l_sync_data"}
        //         icon="pi pi-sort-alt"
        //         className="p-button-danger"
        //         onClick={this.onClickSync}></Button>)
        // }
        if (state.permission.view && state.permission.create) {
          rightSearch.push(
            <Button
              label={this.props.language["insert"] || "l_insert"}
              icon="pi pi-user-edit"
              style={{ marginRight: ".25em" }}
              onClick={() => handleDialogAttendant(true, "displayDialogInsert")}
            />
          );
        }
        break;
      }
      default:
        break;
    }

    if (this.props.isImport && this.props.isImport === true) {
      rightSearch.push(
        <FileUpload
          chooseLabel={this.props.language["import"] || "l_import"}
          ref={this.fileUpload}
          mode="basic"
          onClear={this.clear}
          uploadHandler={(e) => {
            this.handleImport(e.files[0], this.fileUpload);
          }}
          customUpload={true}
          accept=".xlsx,.xls"
          maxFileSize={10000000}
          style={{ marginRight: "15px" }}
          className="p-button-danger"
        />
      );
      rightSearch.push(
        <Button
          icon="pi pi-times"
          style={{ marginLeft: 10 }}
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => {
            this.fileUpload.current.fileInput = { value: "" };
            this.fileUpload.current.clear();
          }}
        />
      );
    }

    if (this.props.urlTemplate) {
      let urlTemplate = this.props.urlTemplate;
      if (urlTemplate.status === 1 || urlTemplate.status === 200) {
        this.fToast(urlTemplate.message);
        download(urlTemplate.fileUrl);
      } else if (urlTemplate.status === 0 || urlTemplate.status > 200) {
        this.fToast(urlTemplate.message, "error");
      }
    }
    return <Toolbar left={leftSearch} right={rightSearch} />;
  }
  handleImport = (eFile, fileUpload) => {
    this.setState({ loading: true });
    this.props.Import(eFile, fileUpload);
    this.fileUpload.current.fileInput = { value: "" };
    this.fileUpload.current.clear();
    this.setState({ loading: false });
  };
  render() {
    let fromDate,
      channel,
      sup,
      position,
      employee,
      shopCode,
      qcStatus,
      kpiQC,
      reportType,
      customer = null;
    if (this.props.isVisibleFromDate === false) fromDate = null;
    else
      fromDate = (
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
      );
    if (this.props.isVisibleChannel === false) channel = null;
    else
      channel = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["channel"] || "channel"}</label>
          <ChannelDropDownList
            id="channelId"
            onChange={this.handleChange}
            value={this.state.channelId}
            accId={this.state.accId}
          />
        </div>
      );
    if (this.props.isVisibleReport === true)
      reportType = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["reporttype"] || "reporttype"}</label>
          <ReportDropDownList
            id="reportType"
            onChange={this.handleChange}
            positionId={0}
            accId={this.state.accId}
            value={this.state.reportType}
          />
        </div>
      );
    else reportType = null;

    if (this.props.isVisibleSup === false) sup = null;
    else
      sup = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["supervisor"] || "l_supervisor"}</label>
          <EmployeeDropDownList
            type="SUP-Leader"
            typeId={0}
            id="supId"
            mode="multi"
            parentId={""}
            onChange={this.handleChange}
            value={this.state.supId}
            accId={this.state.accId}
          />
        </div>
      );
    if (this.props.isVisiblePosition === false) position = null;
    else
      position = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["position"] || "position"}</label>
          <EmployeeTypeDropDownList
            id="position"
            type="PG-SR-Leader-SUP"
            onChange={this.handleChange}
            value={this.state.position}
            accId={this.state.accId}
            typeDropDown={"single"}
          />
        </div>
      );
    if (this.props.isVisibleEmployee === false) employee = null;
    else
      employee = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["employee"] || "employee"}</label>
          <EmployeeDropDownList
            id="employee"
            type="SR-PG-Leader-SUP"
            typeId={!this.state.position ? 0 : this.state.position}
            parentId={!this.state.supId ? "" : this.state.supId}
            onChange={this.handleChange}
            value={this.state.employee}
            accId={this.state.accId}
            mode={"multi"}
          />
        </div>
      );
    if (this.props.isVisibleCustomer === false) customer = null;
    else
      customer = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["customer"] || "l_customer"}</label>
          <CustomerDropDownList
            id="customerId"
            onChange={this.handleChange}
            accId={this.state.accId}
            value={this.state.customerId}
          />
        </div>
      );

    if (this.props.isVisibleShopCode) shopCode = null;
    else
      shopCode = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>
            {this.props.language["storelist_shopcode"] || "storelist_shopcode"}
          </label>
          <InputText
            type="text"
            style={{ width: "100%" }}
            placeholder={
              this.props.language["storelist_shopcode"] || "storelist_shopcode"
            }
            value={this.state.shopCode}
            onChange={this.handleChangeForm}
            id="shopCode"
          />
        </div>
      );
    if (this.props.isVisibleQCStatus) {
      qcStatus = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["qcstatus"] || "l_qcstatus"}</label>
          <Dropdown
            id="qcStatus"
            style={{ width: "100%" }}
            value={this.state.qcStatus}
            options={lstQCStatus}
            showClear
            onChange={this.handleChangeForm}
            optionLabel="name"
            placeholder={this.props.language["qcstatus"] || "l_qcstatus"}
          />
        </div>
      );
    }
    if (this.props.isVisibleKPIQC) {
      kpiQC = (
        <div className="p-field p-col-12 p-md-6 p-lg-3">
          <label>{this.props.language["kpiQC"] || "kpiQC"}</label>
          <MasterListDataDropDownList
            id="kpiQC"
            style={{ width: "100%" }}
            value={this.state.kpiQC}
            listCode="QCKPI"
            showClear
            onChange={this.handleChange}
            optionLabel="name"
            accId={this.state.accId}
            placeholder={this.props.language["kpiQC"] || "l_kpiQC"}
          />
        </div>
      );
    }

    return (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion activeIndex={0}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div key="7890">
              <div className="p-fluid p-grid p-formgrid">
                <AccountDropDownList
                  id="accId"
                  className="p-field p-col-12 p-md-3 p-sm-6"
                  onChange={this.handleChange}
                  filter={true}
                  showClear={true}
                  value={this.state.accId}
                />
                {reportType}
                {fromDate}
                {channel}
                {customer}
                {this.props.pageType !== "new-customer" &&
                  this.props.pageType !== "target-cover" && (
                    <RegionApp {...this} />
                  )}
                {sup}
                {position}
                {employee}
                {shopCode}
                {qcStatus}
                {kpiQC}
              </div>
              <br />
              {this.renderToolbar()}
              {this.state.loading ? (
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "5px" }}
                ></ProgressBar>
              ) : null}
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    );
  }
}
Search.defaultProps = {
  isVisibleQCStatus: false,
  isVisibleReport: false,
  isVisibleKPIQC: false,
};
function mapStateToProps(state) {
  return {
    urlFileReport: state.reportList.urlFileReport,
    usearea: true,
    useregion: false,
    useprovince: true,
    usedistrict: false,
    language: state.languageList.language,
    regions: state.regions.regions,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    RegionController: bindActionCreators(RegionActionCreate, dispatch),
    ReportController: bindActionCreators(ReportCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
