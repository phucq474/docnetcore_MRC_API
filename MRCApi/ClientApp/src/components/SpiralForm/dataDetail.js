import React, { Component } from "react";
import { ProgressBar } from "primereact/progressbar";
import { connect } from "react-redux";
import { CreateActionSpiralForm } from "../../store/SpiralFormController";
import { bindActionCreators } from "redux";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { FaCamera, FaFileAudio } from "react-icons/fa";
import { Toast } from "primereact/toast";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import "../../css/formResult.css";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { FiDelete } from "react-icons/fi";
import ResultDetail from "./result-detail.js";

class DataDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      html: [],
      result: false,
      formData: {},
      itemImage: "",
      isOpen: false,
      indexActive: 0,
    };
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  handleResult = (boolean, data) => {
    if (boolean) {
      this.setState({
        result: true,
        dataSelected: data,
      });
    } else {
      this.setState({
        result: false,
      });
    }
  };
  handleDeleteDialog = async (boolean, data) => {
    if (boolean) {
      await this.setState({
        deleteDialog: true,
        id: data.id,
        empployeeName: data.empployee,
      });
    } else {
      this.setState({
        deleteDialog: false,
      });
    }
  };
  footerDeleteDialog = () => {
    return (
      <div>
        <Button
          className="p-button-info"
          label="Cancel"
          style={{ marginRight: "10px" }}
          onClick={() => this.handleDeleteDialog(false)}
        />
        <Button
          className="p-button-danger"
          label="Delete"
          icon="pi pi-trash"
          onClick={() => this.handleDelete()}
        />
      </div>
    );
  };
  handleDelete = async () => {
    await this.setState({ isLoading: true });
    await this.props.SpiralFormController.DeleteSpiralForm(this.state.id);
    const result = this.props.deleteFormResult;
    if (result && result[0].alert === "1") {
      let html = await this.state.html;
      let newhtml = [];
      for (let i = 0; i < html.length; i++) {
        if (parseInt(html[i].key) !== this.state.id) {
          newhtml.push(html[i]);
        }
      }
      await this.setState({ deleteDialog: false, html: newhtml });
      await this.Alert("Delete Successful", "info");
    } else {
      await this.setState({ deleteDialog: false });
      await this.Alert("Delete Failed", "error");
    }
    await this.setState({ isLoading: false });
  };
  async componentDidMount() {
    const rowData = this.props.dataInput;
    const permission = this.props.permission;
    let workDate = new Date(rowData.workDate);
    let year = workDate.getFullYear().toString();
    let month = ("0" + (workDate.getMonth() + 1)).slice(-2);
    let day = ("0" + workDate.getDate()).slice(-2);
    workDate = parseInt(year + month + day);
    await this.props.SpiralFormController.TabTableDetail(
      workDate,
      rowData.formId,
      rowData.employeeId,
      rowData.listEm
    );
    await this.setState({ datas: this.props.tableDetails });
    let html = [];
    for (let i = 0; i < this.state.datas.length; i++) {
      let data = this.state.datas[i].empployee;
      let button = (
        <div>
          <Button
            className="p-button-success"
            style={{ marginRight: "10px" }}
            icon="pi pi-eye"
            onClick={() => this.handleResult(true, this.state.datas[i])}
          />
          {permission?.delete === true && (
            <Button
              className="p-button-danger"
              icon="pi pi-trash"
              onClick={() => this.handleDeleteDialog(true, this.state.datas[i])}
            />
          )}
        </div>
      );
      html.push(
        <div key={this.state.datas[i].id}>
          <Toolbar left={data} right={button} />
          <hr style={{ border: "solid 1px gray" }} />
        </div>

        /* {this.state.datas[i].empployee} */
      );
    }
    await this.setState({ html });
  }
  renderDetail() {
    let result = [];
    const permission = this.props.permission;
    for (let i = 0; i < this.state.datas.length; i++) {
      let data =
        this.state.datas[i].empployee +
        (this.state.datas[i]?.shopName === null
          ? ""
          : " | " + this.state.datas[i]?.shopName);
      let button = (
        <div>
          <Button
            className="p-button-success"
            style={{ marginRight: "10px" }}
            icon="pi pi-eye"
            onClick={() => this.handleResult(true, this.state.datas[i])}
          />
          {permission?.delete === true && (
            <Button
              className="p-button-danger"
              icon="pi pi-trash"
              onClick={() => this.handleDeleteDialog(true, this.state.datas[i])}
            />
          )}
        </div>
      );
      result.push(
        <div key={this.state.datas[i].id}>
          <Toolbar left={data} right={button} />
          <hr style={{ border: "solid 1px gray" }} />
        </div>

        /* {this.state.datas[i].empployee} */
      );
    }
    return result;
  }
  render() {
    let LightBox = null;
    if (this.state.isOpen) {
      LightBox = (
        <Lightbox
          images={this.state.itemImage}
          onClose={() => this.setState({ isOpen: false })}
          startIndex={this.state.indexActive}
          title="Image Title"
        />
      );
    }
    return (
      <div>
        {this.state.isLoading && (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "10px" }}
          ></ProgressBar>
        )}
        <Toast ref={(el) => (this.toast = el)} />
        {this.state.datas.length > 0 && this.renderDetail()}
        <Dialog
          maximizable
          header={
            this.state.dataSelected?.empployee +
            " | " +
            (this.state.dataSelected?.shopName || "")
          }
          blockScroll
          visible={this.state.result}
          onHide={() => this.handleResult(false)}
          style={{ width: "50vw" }}
          //contentClassName="p_spiral_form_dialog"
        >
          <ResultDetail
            permission={this.props.permission}
            dataInput={this.state.dataSelected}
          ></ResultDetail>
        </Dialog>
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
            <span>Are you sure you want to proceed?</span>
          </div>
        </Dialog>
        {LightBox}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tableDetails: state.spiralform.tableDetails,
    deleteFormResult: state.spiralform.deleteFormResult,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DataDetail);
