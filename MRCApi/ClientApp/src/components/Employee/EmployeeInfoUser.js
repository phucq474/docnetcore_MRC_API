import React, { PureComponent } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { bindActionCreators } from "redux";
import { Password } from "primereact/password";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import { connect } from "react-redux";
import _ from "lodash";

class EmployeeInfoUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imeiActive: null,
      mutate: false,
      employeeDetail: [],
    };
    this.lstStatus = [
      { value: 1, name: `${this.props.language["active"] || "l_active"}` },
      { value: 0, name: `${this.props.language["locked"] || "l_locked"}` },
    ];
  }

  static getDerivedStateFromProps(props, state) {
    if (props.employeeDetail !== state.employeeDetail) {
      return {
        employeeDetail: props.employeeDetail,
        imeiActive: props.employeeDetail?.table2?.[0]?.checkIMEI,
      };
    }
    return null;
  }

  onSaveIMEI = async () => {
    const dataIMEI = _.cloneDeep(this.props.employeeDetail.table2 || []);
    for (let i = 0, lenIMEI = dataIMEI.length; i < lenIMEI; ++i) {
      if (this.state.imeiActive) {
        if (dataIMEI[i].status === 1 && !dataIMEI[i].imei) {
          this.props.Alert(
            `Vui lòng nhập imei thiết bị ${dataIMEI[i].colName}!`,
            "warn"
          );
          return;
        }
        dataIMEI[i].checkIMEI = 1;
      } else {
        dataIMEI[i].checkIMEI = 0;
      }
    }
    await this.props.EmployeeController.EmployeeIMEISave(dataIMEI);
    const result = await this.props.employeeIMEISave;
    if (result.status === 200) {
      this.props.employeeDetail.table2 = dataIMEI;
      this.props.Alert(result.message, "info");
    } else {
      this.props.Alert(result.message, "error");
    }
  };

  onChangeInfoIMEI = (value, rowIndex) => {
    try {
      this.props.employeeDetail.table2[rowIndex].imei = value;
      this.setState({ mutate: !this.state.mutate });
    } catch (e) {}
  };

  onChangeCheckbox = (rowData) => {
    rowData.status = rowData.status === 1 ? 0 : 1;
    this.setState({ mutate: !this.state.mutate });
  };

  onChangeActiveIMEI = (e) => {
    this.setState({
      imeiActive: e.value,
    });
  };

  renderIMEIInput = (rowData, event) => {
    try {
      return (
        <InputText
          value={rowData.imei}
          onChange={(e) =>
            this.onChangeInfoIMEI(e.target.value, event.rowIndex)
          }
        ></InputText>
      );
    } catch (e) {}
  };

  renderIMEICheckbox = (rowData) => {
    try {
      return (
        <Checkbox
          checked={rowData.status === 1}
          onChange={() => this.onChangeCheckbox(rowData)}
        />
      );
    } catch (e) {}
  };

  render() {
    const info = this.props.EmployeeInfo;
    const { handlerchangeDropDown } = this.props;
    return (
      <Card
        className="p-shadow-10"
        title={
          this.props.language["employee_user_info"] || "employee_user_info"
        }
        style={{ height: "100%", display: "flex", justifyContent: "center" }}
      >
        <div className="p-fluid p-formgrid p-grid">
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["employee.username"] || "employee.username"}
            </label>
            <InputText
              id="username"
              className="w-100"
              disabled={!this.props.CanEdit}
              value={info.username || ""}
              onChange={this.props.handlerchangeInput}
            ></InputText>
          </div>
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["employee.password"] || "employee.password"}
            </label>
            <Password
              id="passWord"
              value={info.passWord || ""}
              onChange={(e) => this.props.handlerchangeInput(e, "passWord")}
            />
          </div>
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["employee.repassword"] ||
                "employee.repassword"}
            </label>
            <Password
              id="rePassword"
              value={info.rePassword || ""}
              onChange={(e) => this.props.handlerchangeInput(e, "rePassword")}
            />
          </div>
          <div
            className="p-field p-col-12 p-md-6 p-sm-6"
            style={{ overflow: "hidden" }}
          >
            <label style={{ whiteSpace: "nowrap" }}>
              {this.props.language["status"] || "status"}
            </label>
            <Dropdown
              id="status"
              className="w-100"
              key={this.lstStatus}
              options={this.lstStatus}
              optionLabel="name"
              value={
                info.status !== null && info.status !== undefined
                  ? info.status
                  : 1
              }
              onChange={(e) =>
                handlerchangeDropDown(e.target.id, e.target.value)
              }
            ></Dropdown>
          </div>
        </div>
        {/* {!this.props.noUserFound && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                            <h2 style={{ whiteSpace: 'nowrap', width: '50%', }}>{this.props.language["device_info"] || "l_device_info"}</h2>
                            <div style={{ width: '50%%', }}>
                                <SelectButton value={this.state.imeiActive} options={[{ name: 'Check', value: 1 }, { name: 'Uncheck', value: 0 },]}
                                    optionLabel="name" onChange={this.onChangeActiveIMEI} />
                            </div>
                        </div>
                        <BlockUI blocked={this.state.imeiActive === 0} template={<i className="pi pi-lock" style={{ 'fontSize': '3rem' }} />}>
                            <DataTable scrollHeight={'300px'} rowHover scrollable
                                value={this.props.employeeDetail?.table2 || []}>
                                <Column field="colName" header={this.props.language["device"] || "l_device"} style={{ width: '30%', textAlign: 'center' }}></Column>
                                <Column header={this.props.language["imei"] || "l_imei"} body={this.renderIMEIInput} style={{ width: '50%', textAlign: 'center' }}></Column>
                                <Column header={this.props.language["status"] || "l_status"} body={this.renderIMEICheckbox} style={{ width: '20%', textAlign: 'center' }}></Column>
                            </DataTable>
                        </BlockUI>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 20, }}>
                            <div style={{ width: '50%', }}>
                                <Button icon="pi pi-save" label={this.props.language["save_imei"] || "l_save_imei"} className="btn__hover p-button-info"
                                    onClick={this.onSaveIMEI} />
                            </div>
                        </div>
                    </div>
                )} */}
      </Card>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    employeeDetail: state.employees.employeeDetail,
    employeeIMEISave: state.employees.employeeIMEISave,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeInfoUser);
