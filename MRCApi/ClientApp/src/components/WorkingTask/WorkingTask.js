import React, { useState } from "react";
import FullCalendar, { constrainPoint } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Page403 from "../ErrorRoute/page403";
import {
  HelpPermission,
  getEmployeeId,
  getAccountId,
  download,
} from "../../Utils/Helpler";
import { WorkingTaskCreateAction } from "../../store/WorkingTaskController";
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch";
import { Checkbox } from "primereact/checkbox";

import _ from "lodash";

const loginJson = localStorage.getItem("USER");
const UserId = JSON.parse(loginJson)?.id;

class WorkingTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventsAdd: [],
      eventsAdding: [],
      htmlOption: [],
      loading: true,
      isWeekConfirmable: false,
      listEmployeeSelected: {},
      rowFilterSelected: {},
      dataGroupByEmployee: [],
      permission: {},
      htmlCollection: [],
      displayBasic: false,
      dates: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      activeIndex: 0,
      displayDetailDialog: false,
      dialogInfo: null,
      listTask: [],
      isDialogAdd: false,
      listSelectTask: [],
      isDialogExport: false,
      detailPercent: [],
      detailSummary: [],
      currentStart: null,
      currentEnd: null,
      fromDate: null,
      toDate: null,
      tabDetail: false,
      getEmployee: [],
      getShopByEmployee: [],
      shopList: null,
      employeeList: null,
    };
    this.pageId = 3160;
    this.splitButtonRejectItems = [];
  }

  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    this.setState({ permission: permission });
  }

  handleGetEmployee = async (employeeId, workDate) => {
    await this.props.EmployeeController.GetEmployeeDDL(null, employeeId);
    const employeeDDL = await this.props.employeeDDL;
    let list = await employeeDDL.filter(
      (p) =>
        (p.group === "SR" || p.group === "PG") &&
        new Date(p.workingDate) <= workDate &&
        (p.resignedDate === null || new Date(p.resignedDate) >= workDate)
    );
    this.setState({ getEmployee: list ? list : [] });
  };

  handleGetShop = async (employeeId, workDate) => {
    await this.props.EmployeeController.GetShopByEmployee(employeeId, workDate);
    const rs = await this.props.getShopByEmployee;
    if (rs.status === 200) {
      this.setState({ getShopByEmployee: rs.data });
    } else {
      this.setState({ getShopByEmployee: [] });
    }
  };

  getFilter = (rangeInfo) => {
    const employees = this.state.employee;
    const currentStart = new Date(rangeInfo.view.currentStart);
    const currentEnd = new Date(rangeInfo.view.currentEnd);
    let lstEmp = null;
    if (employees) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }

    const data = {
      fromDate: +moment(rangeInfo.start).format("YYYYMMDD"),
      toDate: +moment(moment(rangeInfo.end).subtract(1, "day")).format(
        "YYYYMMDD"
      ),
      currentStart: moment(currentStart).format("YYYYMMDD"),
      currentEnd: moment(currentEnd.setDate(currentEnd.getDate() - 1)).format(
        "YYYYMMDD"
      ),
      position: this.state.typeId ? this.state.typeId : null,
      supId: this.state.supId ? this.state.supId : null,
      employeeId: employees ? lstEmp : null,
    };

    this.setState({
      fromDate: data.fromDate,
      toDate: data.toDate,
      currentStart: data.currentStart,
      currentEnd: data.currentEnd,
    });

    return data;
  };

  handleDates = async (rangeInfo) => {
    this.setState({
      loading: true,
      htmlOption: [],
      dataGroupByEmployee: [],
      rowFilterSelected: null,
    });
    const data = this.getFilter(rangeInfo);
    await this.props.WorkingTaskController.WorkingTask_Filter(data);
    const results = await this.props.wkt_filter;

    const htmlEmployee = [];
    if (results?.table) {
      const tb_listem = await results?.table;
      if (Array.isArray(tb_listem)) {
        for (let i = 0, lenDatas = tb_listem.length; i < lenDatas; i++) {
          htmlEmployee.push({
            label: tb_listem[i]?.fullName,
            value: tb_listem[i]?.employeeId,
          });
        }
        await this.setState({
          htmlOption: htmlEmployee,
        });
      }

      // Date Add
      var start = new Date(moment(data.currentStart).format("YYYY-MM-DD"));
      var end = new Date(moment(data.currentEnd).format("YYYY-MM-DD"));
      const eventsAdd = [];
      const dictIdAdd = {};
      const dataGroupByEmployee = [];

      // Data Calendar
      if (results?.table1) {
        const tb_listCal = await results?.table1;
        const dictId = {};
        for (let i = 0, lenFilters = tb_listCal.length; i < lenFilters; i++) {
          const {
            employeeId,
            id,
            content,
            workDate,
            color,
            rowName,
            dateInt,
            shops,
            employees,
            employeeDetail,
            shopDetail,
          } = tb_listCal[i];
          if (rowName === "Date") {
            const contentList = JSON.parse(content);
            contentList.forEach((item) => {
              const keyDict = `${id}_${employeeId}_${item.Id}`;
              let tmpColor = color;
              let tmpPlan = [],
                tmpActual = [];
              let plan = 0,
                actual = 0;

              if (employeeDetail && item.Id === 6) {
                tmpPlan = JSON.parse(employeeDetail).filter(
                  (p) => p.Plan === 1
                );
                tmpActual = JSON.parse(employeeDetail).filter(
                  (p) => p.Plan === 1 && p.Actual === 1
                );
                plan = tmpPlan ? tmpPlan.length : 0;
                actual = tmpActual ? tmpActual.length : 0;
              }

              if (shopDetail && item.Id === 8) {
                tmpPlan = JSON.parse(shopDetail).filter((p) => p.Plan === 1);
                tmpActual = JSON.parse(shopDetail).filter(
                  (p) => p.Plan === 1 && p.Actual === 1
                );
                plan = tmpPlan ? tmpPlan.length : 0;
                actual = tmpActual ? tmpActual.length : 0;
              }

              if (plan > 0 && actual < plan) {
                tmpColor = "#EBA83A";
              }

              const objEvents = {
                key: keyDict,
                id: id || 0,
                employeeId: employeeId || 0,
                workDate: workDate || null,
                start: workDate || null,
                title: `${item.Group}_${item.SubGroup}`,
                color: tmpColor,
                group: item.Group || null,
                subGroup: item.subGroup || null,
                taskId: item.Id || 0,
                employees: employees || null,
                shops: shops || null,
                employeeDetail: employeeDetail
                  ? JSON.parse(employeeDetail)
                  : null,
                shopDetail: shopDetail ? JSON.parse(shopDetail) : null,
              };

              if (dictId[keyDict] === undefined) {
                if (dataGroupByEmployee[employeeId] !== undefined) {
                  dataGroupByEmployee[employeeId].push(objEvents);
                } else {
                  dataGroupByEmployee[employeeId] = [objEvents];
                }
              }
              dictId[keyDict] = true;
            });
          } else {
            if (
              this.state.permission.create ||
              this.state.permission.edit ||
              this.state.permission.delete
            ) {
              let iddate = -parseInt(`${dateInt}${employeeId}${id}`);
              const keyDict = `${dateInt}_${employeeId}_${id}`;
              let objAddEvent = {
                key: keyDict,
                id: iddate || 0,
                employeeId: employeeId || 0,
                workDate: workDate || null,
                start: workDate || null,
                title: rowName,
                color: color || null,
                group: null,
                subGroup: null,
                taskId: 0,
                employees: employees || null,
                shops: shops || null,
              };
              if (dictIdAdd[iddate] === undefined) {
                eventsAdd.push(objAddEvent);
              }
              dictIdAdd[iddate] = true;
            }
          }
        }
      }
      this.setState({
        rangeInfo: rangeInfo,
        loading: false,
        dataGroupByEmployee: dataGroupByEmployee,
        currentStart: data.currentStart,
        currentEnd: data.currentEnd,
        eventsAdd: eventsAdd || [],
      });

      if (this.state.rowFilterSelected?.value === undefined) {
        this.handlerChangeEmployee(this.state.htmlOption?.[0] || {}, true);
      }
      this.toast.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Thành công",
        life: 5000,
      });
    } else {
      this.setState({
        htmlOption: [],
      });
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Không có dữ liệu",
        life: 5000,
      });
    }

    this.setState({ loading: false });

    // console.log('dataGroupByEmployee', this.state.dataGroupByEmployee)
    // console.log('eventsAdd', this.state.eventsAdd)
    // console.log('events', this.state.events)
    // console.log('htmlCollection', this.state.htmlCollection)


  };

  // handlers for user actions
  // ------------------------------------------------------------------------------------------

  handleEventAdd = (addInfo) => { };

  handleEventChange = (changeInfo) => { };

  handleEventRemove = (removeInfo) => { };

  handleDisplayOverlay = (e, eventInfo) => {
    try {
      this["op" + eventInfo].toggle(e);
    } catch { }
  };

  renderEventContent = (eventInfo) => {
    if (eventInfo.event.id < 0) {
      return (
        <div
          onClick={(e) => this.handleDateAdd(eventInfo)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "initial",
            wordBreak: "break-word",
            padding: "2px 2px",
            cursor: "pointer",
          }}
        >
          <i className="pi pi-plus" style={{ paddingRight: 5 }} />
          <span>{eventInfo.event?.title}</span>
        </div>
      );
    } else {
      const rowData = eventInfo.event.extendedProps;
      let dataShow = null;
      let plan = 0;
      let actual = 0;
      let actualPlan = 0;

      if (
        rowData.employeeDetail &&
        rowData.employeeDetai?.length > 0 &&
        rowData?.taskId === 6
      ) {
        const tmpPlan = rowData.employeeDetail?.filter((p) => p.Plan === 1);
        plan = tmpPlan ? tmpPlan.length : 0;
        const tmpActualPlan = rowData.employeeDetail?.filter(
          (p) => p.Actual === 1 && p.Plan === 1
        );
        actualPlan = tmpActualPlan ? tmpActualPlan.length : 0;
        const tmpActual = rowData.employeeDetail?.filter((p) => p.Actual === 1);
        actual = tmpActual ? tmpActual.length : 0;

        dataShow = (
          <DataTable value={rowData.employeeDetail}>
            <Column
              field="Code"
              header="Code"
              style={{ width: "30%" }}
            ></Column>
            <Column
              field="Name"
              header="Employee name"
              style={{ width: "50%" }}
            ></Column>
            <Column
              field="Actual"
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={rowData.Actual === 1 ? true : false}
                  ></Checkbox>
                );
              }}
              header="Actual"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
            <Column
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={
                      rowData.Actual === 1 && rowData.Plan === 1 ? true : false
                    }
                  ></Checkbox>
                );
              }}
              header="Actual on plan"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
            <Column
              field="Plan"
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={rowData.Plan === 1 ? true : false}
                  ></Checkbox>
                );
              }}
              header="Plan"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
          </DataTable>
        );
      }
      if (
        rowData.shopDetail &&
        rowData.shopDetail?.length > 0 &&
        rowData?.taskId === 8
      ) {
        const tmpPlan = rowData.shopDetail?.filter((p) => p.Plan === 1);
        plan = tmpPlan ? tmpPlan.length : 0;
        const tmpActualPlan = rowData.shopDetail?.filter(
          (p) => p.Actual === 1 && p.Plan === 1
        );
        actualPlan = tmpActualPlan ? tmpActualPlan.length : 0;
        const tmpActual = rowData.shopDetail?.filter((p) => p.Actual === 1);
        actual = tmpActual ? tmpActual.length : 0;

        dataShow = (
          <DataTable value={rowData.shopDetail}>
            <Column
              field="Code"
              header="Code"
              style={{ width: "30%" }}
            ></Column>
            <Column
              field="Name"
              header="Shop name"
              style={{ width: "50%" }}
            ></Column>
            <Column
              field="Actual"
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={rowData.Actual === 1 ? true : false}
                  ></Checkbox>
                );
              }}
              header="Actual"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
            <Column
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={
                      rowData.Actual === 1 && rowData.Plan === 1 ? true : false
                    }
                  ></Checkbox>
                );
              }}
              header="Actual on plan"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
            <Column
              field="Plan"
              body={(rowData) => {
                return (
                  <Checkbox
                    checked={rowData.Plan === 1 ? true : false}
                  ></Checkbox>
                );
              }}
              header="Plan"
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
          </DataTable>
        );
      }

      if (rowData?.taskId === 6 || rowData?.taskId === 8) {
        return (
          <div>
            <div
              onClick={(e) => this.handleDisplayOverlay(e, rowData.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                whiteSpace: "initial",
                wordBreak: "break-word",
                padding: "2px 5px",
              }}
            >
              <div style={{ fontFamily: "sans-serif" }}>
                <span style={{ fontSize: 10 }}>
                  {eventInfo.event?.title +
                    " (" +
                    actual +
                    "/" +
                    actualPlan +
                    "/" +
                    plan +
                    ")"}
                </span>
              </div>
            </div>
            {dataShow && (
              <OverlayPanel
                showCloseIcon
                dismissable
                style={{ width: "50%" }}
                ref={(el) => (this["op" + rowData.key] = el)}
                id={"id_" + rowData.key}
              >
                {dataShow}
              </OverlayPanel>
            )}
          </div>
        );
      } else {
        return (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                whiteSpace: "initial",
                wordBreak: "break-word",
                padding: "2px 5px",
              }}
            >
              <div style={{ fontFamily: "sans-serif" }}>
                <span style={{ fontSize: 10 }}>{eventInfo.event?.title}</span>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  onSelectEmployee = async (rowData) => {
    const { value } = rowData;
    let visibleRejectButton = false;
    if (this.state.listEmployeeSelected[value] === undefined) {
      this.state.listEmployeeSelected[value] = true;
      if (value === UserId) visibleRejectButton = true;
    } else {
      if (value === UserId) visibleRejectButton = false;
      delete this.state.listEmployeeSelected[value];
    }
    this.setState({ loading: false, visibleRejectButton: visibleRejectButton });
  };

  handlerChangeEmployee = async (rowData, isFirstTime) => {
    await this.handleGetDetailByEmployee(rowData);
    const visibleRejectButton =
      rowData.value === getEmployeeId() ? true : false;
    const eventsAdd = await this.state.eventsAdd?.filter(
      (p) => p.employeeId === rowData?.value
    );
    const dataByEmployee =
      eventsAdd?.concat(
        this.state.dataGroupByEmployee?.[rowData.value] || []
      ) || [];
    let htmlCollection = this.state.htmlCollection;
    if (isFirstTime === true) {
      let elementHeaders =
        document.getElementsByClassName("fc-col-header-cell");
      if (elementHeaders.length > 0) {
        for (let element of elementHeaders) {
          var date = element.getAttribute("data-date");
          var elementLabelDateCalendar = element.getElementsByTagName("a")[0];
          let currentText = element.getElementsByTagName("a")[0].text;
          htmlCollection.push({
            element: elementLabelDateCalendar,
            date: date,
            defaultTextDisplay: currentText,
          });
        }
      }
    }
    let countValidPlan = 0;
    htmlCollection.forEach((objCollection) => {
      countValidPlan = 0;
      var dateOfLabel = objCollection.date;
      dataByEmployee.forEach((item) => {
        if (item.start === dateOfLabel)
          if (item.id > 0) {
            if (item.status === 1) {
              countValidPlan++;
            }
          }
      });
      objCollection.element.text = objCollection.defaultTextDisplay;
    });
    await this.setState({
      events:
        eventsAdd?.concat(
          this.state.dataGroupByEmployee?.[rowData.value] || []
        ) || [],
      rowFilterSelected: rowData,
      htmlCollection: htmlCollection,
      visibleRejectButton: visibleRejectButton,
    });
  };

  handleChange = async (id, value) => {
    await this.setState({ [id]: value || "" });
  };

  handleChangeDropdown = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
  };

  handleGetTask = async (data) => {
    await this.props.WorkingTaskController.WorkingTask_GetTask(data);
    const result = await this.props.wkt_getTask;
    return result;
  };

  handleSave = async () => {
    this.setState({ loading: true });
    const states = this.state;

    let shops = null;
    if (states.shopList && states.shopList.length > 0) {
      shops = "";
      for (let i = 0; i < states.shopList.length; i++) {
        if (i !== states.shopList.length - 1) {
          shops += states.shopList[i] + ",";
        } else {
          shops += states.shopList[i];
        }
      }
    }
    let employees = null;
    if (states.employeeList && states.employeeList.length > 0) {
      employees = "";
      for (let i = 0; i < states.employeeList.length; i++) {
        if (i !== states.employeeList.length - 1) {
          employees += states.employeeList[i] + ",";
        } else {
          employees += states.employeeList[i];
        }
      }
    }

    const listTask = states.listTask;
    let listId = null;
    if (listTask.length > 0) {
      listId = "";
      for (let i = 0; i < listTask.length; i++) {
        if (listTask[i].isCheck === 1) {
          if (listTask[i].id === 6 && employees === null) {
            this.toast.show({
              severity: "error",
              summary: "Thông báo",
              detail: "Vui lòng chọn Nhân viên để Huấn luyện thực địa",
              life: 5000,
            });
            this.setState({ loading: false });
            return;
          }

          if (listTask[i].id === 8 && shops === null) {
            this.toast.show({
              severity: "error",
              summary: "Thông báo",
              detail: "Vui lòng chọn Cửa hàng để Kiểm tra thị trường",
              life: 5000,
            });
            this.setState({ loading: false });
            return;
          }
          listId += listTask[i].id + ",";
        }
      }
    }

    const data = {
      employeeId: this.state.employeeIdAdd,
      workDate: moment(this.state.addDate).format("YYYY-MM-DD"),
      listId: listId,
      shops: shops,
      employees: employees,
    };

    await this.props.WorkingTaskController.WorkingTask_Save(data);
    const results = await this.props.wkt_save;
    if (results.status === 200) {
      let dataGroupByEmployee = await this.state.dataGroupByEmployee;
      let dataItem = (await dataGroupByEmployee[data.employeeId])
        ? dataGroupByEmployee[data.employeeId]
        : [];
      let htmlOption = this.state.htmlOption;
      let selectInfo = htmlOption.findIndex((p) => p.value === data.employeeId);

      if (dataItem !== undefined) {
        if (dataItem.length > 0) {
          dataItem = await dataItem.filter((p) => p.workDate !== data.workDate);
        }
      }

      if (results.data && results.data[0].content) {
        const tb_listCal = await results.data[0];
        const dictId = {};
        const {
          employeeId,
          id,
          content,
          workDate,
          color,
          shops,
          employees,
          employeeDetail,
          shopDetail,
        } = await tb_listCal;
        if (content !== null) {
          const contentList = await JSON.parse(content);
          await contentList.forEach((item) => {
            let tmpColor = color;
            let tmpPlan = [],
              tmpActual = [];
            let plan = 0,
              actual = 0;

            if (employeeDetail && item.Id === 6) {
              tmpPlan = JSON.parse(employeeDetail).filter((p) => p.Plan === 1);
              tmpActual = JSON.parse(employeeDetail).filter(
                (p) => p.Plan === 1 && p.Actual === 1
              );
              plan = tmpPlan ? tmpPlan.length : 0;
              actual = tmpActual ? tmpActual.length : 0;
            }

            if (shopDetail && item.Id === 8) {
              tmpPlan = JSON.parse(shopDetail).filter((p) => p.Plan === 1);
              tmpActual = JSON.parse(shopDetail).filter(
                (p) => p.Plan === 1 && p.Actual === 1
              );
              plan = tmpPlan ? tmpPlan.length : 0;
              actual = tmpActual ? tmpActual.length : 0;
            }

            if (plan > 0 && actual < plan) {
              tmpColor = "#EBA83A";
            }

            const keyDict = `${id}_${employeeId}_${item.Id}`;
            const objEvents = {
              key: keyDict,
              id: id || 0,
              employeeId: employeeId || 0,
              workDate: workDate || null,
              start: workDate || null,
              title: `${item.Group}_${item.SubGroup}`,
              color: tmpColor || null,
              group: item.Group || null,
              subGroup: item.subGroup || null,
              taskId: item.Id || 0,
              shops: shops || null,
              employees: employees || null,
              employeeDetail: employeeDetail
                ? JSON.parse(employeeDetail)
                : null,
              shopDetail: shopDetail ? JSON.parse(shopDetail) : null,
            };

            if (dictId[keyDict] === undefined) {
              if (dataItem !== undefined) {
                dataItem.push(objEvents);
              } else {
                dataItem = [objEvents];
              }
            }
            dictId[keyDict] = true;
          });
        }
      }

      if (dataItem.length > 0) {
        dataGroupByEmployee[data.employeeId] = dataItem;
      } else {
        dataGroupByEmployee[data.employeeId] = null;
      }
      this.setState({
        dataGroupByEmployee: dataGroupByEmployee,
      });

      this.handlerChangeEmployee(
        this.state.htmlOption?.[selectInfo] || {},
        true
      );

      this.toast.show({
        severity: "success",
        summary: "Thông báo",
        detail: results.message,
        life: 5000,
      });
    } else {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: results.message,
        life: 5000,
      });
    }

    this.setState({ loading: false, isDialogAdd: false });
  };

  renderFooter = (type) => {
    if (type === "isDialogAdd") {
      return (
        <div>
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => this.setState({ isDialogAdd: false })}
            className="p-button-text"
          />
          <Button
            label="Save"
            icon="pi pi-success"
            onClick={() => this.handleSave()}
            autoFocus
          />
        </div>
      );
    } else {
      return (
        <div>
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => this.setState({ isDialogExport: false })}
            className="p-button-text"
          />
          <Button
            label="Export"
            icon="pi pi-download"
            onClick={() => this.handleExport()}
            autoFocus
          />
        </div>
      );
    }
  };

  templateShopDDL = (rowData) => {
    const getShopByEmployee = this.state.getShopByEmployee
      ? this.state.getShopByEmployee
      : [];
    let result = [];
    getShopByEmployee.forEach((element) => {
      result.push({
        name: element.shopCode + " - " + element.shopName,
        value: element.id,
        key: element.id,
      });
    });

    let disabled = rowData.id === 8 && rowData.isCheck === 1 ? false : true;

    return (
      <MultiSelect
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        id="shopList"
        onChange={(e) => this.handleChange("shopList", e.target.value)}
        value={this.state.shopList}
        placeholder={"Chọn cửa hàng"}
        optionLabel="name"
        filter={true}
        filterPlaceholder={"Chọn cửa hàng"}
        filterBy="name"
        showClear={true}
        disabled={disabled}
      />
    );
  };

  templateEmployeeDDL = (rowData) => {
    const getEmployee = this.state.getEmployee ? this.state.getEmployee : [];
    let result = [];
    getEmployee.forEach((element) => {
      result.push({
        name: element.fullName,
        value: element.id,
        key: element.id,
      });
    });

    let disabled = rowData.id === 6 && rowData.isCheck === 1 ? false : true;

    return (
      <MultiSelect
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        id="employeeList"
        onChange={(e) => this.handleChange("employeeList", e.target.value)}
        value={this.state.employeeList}
        placeholder={"Chọn nhân viên"}
        optionLabel="name"
        filter={true}
        filterPlaceholder={"Chọn nhân viên"}
        filterBy="name"
        showClear={true}
        disabled={disabled}
      />
    );
  };

  templateBody = (rowData) => {
    if (rowData.id === 6) {
      return this.templateEmployeeDDL(rowData);
    } else if (rowData.id === 8) {
      return this.templateShopDDL(rowData);
    } else {
      return null;
    }
  };

  handleChangeTask = (rowData, checked) => {
    let listTask = this.state.listTask;
    const ind = listTask.findIndex((p) => p.id === rowData.id);
    if (ind > -1) {
      listTask[ind].isCheck = checked ? 1 : 0;
    }
    this.setState({ listTask: listTask });
  };

  templateCheck = (rowData) => {
    return (
      <InputSwitch
        checked={rowData.isCheck === 1 ? true : false}
        onChange={(e) => this.handleChangeTask(rowData, e.value)}
      />
    );
  };

  templateDialogAdd = () => {
    let htmlOption = this.state.htmlOption;
    let selectInfo = htmlOption.find(
      (p) => p.value === this.state.employeeIdAdd
    );
    let header = moment(this.state.addDate).format("YYYY-MM-DD");
    if (selectInfo !== undefined) {
      header = `${moment(this.state.addDate).format("YYYY-MM-DD")} | ${selectInfo.label
        }`;
    }

    return (
      <Dialog
        header={header}
        visible={this.state.isDialogAdd}
        style={{ width: "90%" }}
        footer={this.renderFooter("isDialogAdd")}
        blockScroll={true}
        onHide={() => this.setState({ isDialogAdd: false })}
      >
        <DataTable
          value={this.state.listTask}
          dataKey="id"
          responsiveLayout="scroll"
        >
          <Column
            field="group"
            header={"Group"}
            headerStyle={{ textAlign: "center", width: "10%" }}
          ></Column>
          <Column
            field="subGroup"
            header={"Task"}
            headerStyle={{ textAlign: "center", width: "20%" }}
          ></Column>
          <Column
            field="isCheck"
            header={"Choose"}
            body={(rowData) => this.templateCheck(rowData)}
            style={{ textAlign: "center", width: "7%" }}
          ></Column>
          <Column
            header={"Employee/Shop"}
            body={(rowData) => this.templateBody(rowData)}
            style={{ textAlign: "center" }}
          ></Column>
        </DataTable>
      </Dialog>
    );
  };

  handleDateAdd = async (selectInfo) => {
    await this.setState({ loading: true, listTask: [], listSelectTask: [] });
    const employeeIdSelected = (await this.state.rowFilterSelected?.value) || 0;
    const dataEvent = selectInfo.event.extendedProps;
    const data = await {
      employeeId: employeeIdSelected,
      workDate: moment(selectInfo.event.start).format("YYYY-MM-DD"),
    };
    const listTask = await this.handleGetTask(data);
    const workDate = new Date(
      moment(selectInfo.event.start).format("YYYY-MM-DD")
    );
    await this.handleGetEmployee(employeeIdSelected, workDate);
    await this.handleGetShop(
      employeeIdSelected,
      moment(workDate).format("YYYYMMDD")
    );

    let shopList = [];
    let employeeList = [];
    let shops = null;
    let employees = null;

    shops = listTask.find((p) => p.id === 8).shops;
    employees = listTask.find((p) => p.id === 6).employees;

    if (shops) {
      const tmp = shops.split(",");
      if (tmp.length === 0) {
        shopList.push(parseInt(shops));
      } else {
        tmp.forEach((p) => {
          shopList.push(parseInt(p));
        });
      }
    }

    if (employees) {
      const tmp = employees.split(",");
      if (tmp.length === 0) {
        employeeList.push(parseInt(employees));
      } else {
        tmp.forEach((p) => {
          employeeList.push(parseInt(p));
        });
      }
    }

    this.setState({
      isDialogAdd: true,
      addDate: new Date(selectInfo.event.start),
      employeeIdAdd: employeeIdSelected || 0,
      loading: false,
      listTask: listTask,
      employeeList: employeeList,
      shopList: shopList,
    });
  };

  handleExport = async () => {
    this.setState({
      loading: true,
    });
    const fromdate = this.state.dates[0];
    const todate = this.state.dates[1];

    const employees = await this.state.employee;
    let lstEmp = null;
    if (employees) {
      lstEmp = "";
      employees.forEach((element) => {
        lstEmp = lstEmp + element + ",";
      });
    }

    var data = {
      fromDate: parseInt(moment(fromdate).format("YYYYMMDD"), 0),
      toDate: parseInt(moment(todate).format("YYYYMMDD"), 0),
      fromdate: moment(fromdate).format("YYYY-MM-DD"),
      todate: moment(todate).format("YYYY-MM-DD"),
      position: this.state.typeId ? this.state.typeId : null,
      supId: this.state.supId ? this.state.supId : null,
      employeeId: employees ? lstEmp : null,
    };

    await this.props.WorkingTaskController.WorkingTask_Export(data);
    const result = await this.props.wkt_export;
    if (result.status === 1 || result.status === 200) {
      download(result.fileUrl);
      this.toast.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Xuất file thành công",
        life: 4000,
      });
    } else {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: result.message,
        life: 4000,
      });
    }
    this.setState({
      loading: false,
      isDialogExport: false,
    });
  };

  dialogExport = () => {
    return (
      <Dialog
        header="Export"
        visible={this.state.isDialogExport}
        style={{ width: "30vw" }}
        footer={this.renderFooter("isDialogExport")}
        onHide={() => this.setState({ isDialogExport: false })}
      >
        <div>
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
      </Dialog>
    );
  };

  handleGetDetailByEmployee = async (rowData) => {
    await this.setState({ detailPercent: [], detailSummary: [] });
    let data = {
      employeeId: rowData.value,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      currentStart: this.state.currentStart,
      currentEnd: this.state.currentEnd,
    };
    await this.props.WorkingTaskController.WorkingTask_GetDetailByEmployee(
      data
    );
    const result = await this.props.wkt_GetDetailByEmployee;

    await this.setState({
      detailPercent: result?.table !== undefined ? result?.table : [],
      detailSummary: result?.table1 !== undefined ? result?.table1 : [],
    });
  };

  templateDetail = () => {
    return (
      <div className="p-grid" style={{ width: "100%", margin: "auto" }}>
        <div>
          <DataTable
            value={this.state.detailSummary}
            responsiveLayout="scroll"
            headerStyle={{ textAlign: "center", backgroundColor: "#C65911" }}
            rowGroupMode="rowspan"
            groupRowsBy="group"
            sortField="group"
            sortMode="single"
          >
            <Column
              field="group"
              header="Group"
              headerStyle={{
                textAlign: "center",
                width: "20%",
                backgroundColor: "#C65911",
              }}
            ></Column>
            <Column
              field="subGroup"
              header="Task"
              headerStyle={{ textAlign: "center", backgroundColor: "#C65911" }}
            ></Column>
            <Column
              field="total"
              header="Quantity"
              headerStyle={{
                textAlign: "center",
                backgroundColor: "#C65911",
                width: "12%",
              }}
              style={{ textAlign: "center" }}
            ></Column>
            <Column
              field="actual"
              header="Actual"
              headerStyle={{
                textAlign: "center",
                backgroundColor: "#C65911",
                width: "12%",
              }}
              style={{ textAlign: "center" }}
            ></Column>
            <Column
              field="actualOnPlan"
              header="Actual on plan"
              headerStyle={{
                textAlign: "center",
                backgroundColor: "#C65911",
                width: "12%",
              }}
              style={{ textAlign: "center" }}
            ></Column>
            <Column
              field="plan"
              header="Plan"
              headerStyle={{
                textAlign: "center",
                backgroundColor: "#C65911",
                width: "12%",
              }}
              style={{ textAlign: "center" }}
            ></Column>
          </DataTable>
        </div>
      </div>
    );
  };

  templateActual = (rowData) => {
    if (rowData?.color !== null) {
      return <div style={{ color: rowData.color }}> {rowData.yourPlan}</div>;
    } else {
      return <div> {rowData.yourPlan}</div>;
    }
  };

  render() {
    return this.state.permission.view ? (
      <div>
        {this.state.loading && (
          <div className="loading_container">
            <ProgressSpinner
              style={{ width: 100, height: 100, marginLeft: 400 }}
              strokeWidth="3"
              animationDuration=".8s"
            />
          </div>
        )}
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <AccordionTab header={this.props.language["search"] || "search"}>
            <div className="p-grid">
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["position"] || "l_position"}</label>
                <EmployeeTypeDropDownList
                  id="typeId"
                  type={"SUP"}
                  value={this.state.typeId}
                  onChange={this.handleChangeDropdown}
                />
              </div>
              <div className="p-col-12 p-md-3 p-sm-6">
                <label>{this.props.language["sup"] || "l_sup"}</label>
                <EmployeeDropDownList
                  mode="single"
                  type="SUP"
                  typeId={0}
                  id="supId"
                  parentId={null}
                  value={this.state.supId}
                  onChange={this.handleChangeDropdown}
                />
              </div>
              <div className="p-col-12 p-md-2 p-sm-6">
                <div
                  style={{
                    backgroundColor: "#00cc33",
                    margin: "3px",
                    width: "100%",
                    fontSize: "9pt",
                    padding: "3px",
                  }}
                >
                  Thực tế đúng như kế hoạch
                </div>
                <div
                  style={{
                    backgroundColor: "#EBA83A",
                    margin: "3px",
                    width: "100%",
                    fontSize: "9pt",
                    padding: "3px",
                  }}
                >
                  Thực tế thiếu so với kế hoạch
                </div>
              </div>

              {/* <div className="p-col-12 p-md-3 p-sm-6" style={{ fontSize: '10pt' }}>
                                    <div style={{ paddingLeft: '10px', marginTop: '3px', width: '70%', backgroundColor: '#00cc33', color: 'white', borderRadius: '5px' }}>
                                        Có LLV và có check-in
                                    </div>
                                    <div style={{ paddingLeft: '10px', marginTop: '3px', width: '70%', backgroundColor: '#ffcc00', color: 'white', borderRadius: '5px' }}>
                                        Có LLV nhưng không check-in
                                    </div>
                                    <div style={{ paddingLeft: '10px', marginTop: '3px', width: '70%', backgroundColor: '#007ad9', color: 'white', borderRadius: '5px' }}>
                                        Có lịch nghỉ
                                    </div>
                                </div> */}
            </div>
          </AccordionTab>
        </Accordion>
        <div
          className="p-fluid p-grid"
          style={{ marginRight: 0, marginTop: "10px", height: "100%" }}
        >
          <div
            className="p-field p-col-12 p-md-6 p-lg-3"
            style={{ height: "100%" }}
          >
            <div className="p-field p-grid p-justify-left">
              <div className="p-col-12 p-md-6">
                <Button
                  className="p-button-success"
                  label={this.props.language["search"] || "l_search"}
                  icon="pi pi-search"
                  onClick={() => {
                    this.handleDates(this.state.rangeInfo);
                  }}
                />
              </div>
              {this.state.permission.export && (
                <div className="p-col-12 p-md-6">
                  <Button
                    className="p-button-warning"
                    label={this.props.language["export"] || "l_export"}
                    icon="pi pi-download"
                    onClick={() => this.setState({ isDialogExport: true })}
                  />
                </div>
              )}
            </div>
            <DataTable
              value={this.state.htmlOption}
              className="p-datatable-striped"
              dataKey="value"
              rowHover
              scrollable
              scrollHeight="750px"
              resizableColumns
              columnResizeMode="expand"
              rowGroupFooterTemplate={() => { }}
            >
              <Column
                field="label"
                filter
                filterField="label"
                filterMatchMode="contains"
                header={this.props.language["employee"] || "l_employee"}
                style={{ textAlign: "center", padding: 0 }}
                body={(rowData) => {
                  const isSelected =
                    this.state.rowFilterSelected?.label === rowData.label;
                  return (
                    <div
                      onClick={() => this.handlerChangeEmployee(rowData)}
                      style={{
                        background: isSelected ? "LightCoral" : "inherit",
                        color: rowData.color,
                        height: 40,
                        paddingLeft: 10,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span onClick={() => this.handlerChangeEmployee(rowData)}>
                        {rowData.label}
                      </span>
                      {isSelected && (
                        <i
                          className="pi pi-chevron-right"
                          style={{
                            color: isSelected ? "lightgreen" : "inherit",
                            paddingRight: 10,
                          }}
                        />
                      )}
                    </div>
                  );
                }}
              />
            </DataTable>
          </div>
          <div className="p-field p-col-12 p-md-6 p-lg-9" style={{ zIndex: 0 }}>
            <div id="fullcalendar" style={{ fontFamily: "Calibri" }}>
              <FullCalendar
                key="fc_workingtask"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth",
                }}
                dayMaxEventRows={4}
                // eventMaxStack={6}
                firstDay={1}
                height="auto"
                stickyHeaderDates={true}
                ref={this.fc}
                initialView="dayGridMonth"
                editable
                //selectable
                selectMirror
                datesSet={this.handleDates}
                eventDisplay="block"
                events={this.state.events}
                eventContent={this.renderEventContent} // custom render function
              />
            </div>
            <div className="p-grid" style={{ marginTop: "20px" }}>
              <div className="p-col-12 p-md-6 p-sm-6">
                <DataTable
                  value={this.state.detailPercent}
                  responsiveLayout="scroll"
                >
                  <Column
                    field="group"
                    header="Group"
                    headerStyle={{
                      textAlign: "center",
                      backgroundColor: "#C65911",
                    }}
                  ></Column>
                  <Column
                    field="request"
                    header="Request"
                    style={{ textAlign: "center", width: "20%" }}
                    headerStyle={{
                      textAlign: "center",
                      backgroundColor: "#C65911",
                    }}
                  ></Column>
                  <Column
                    field="yourPlan"
                    header="Your Plan"
                    headerStyle={{
                      textAlign: "center",
                      backgroundColor: "#C65911",
                    }}
                    body={this.templateActual}
                    style={{ textAlign: "center", width: "20%" }}
                  ></Column>
                  <Column
                    field="activity"
                    header="Activity"
                    headerStyle={{
                      textAlign: "center",
                      backgroundColor: "#C65911",
                    }}
                    style={{ textAlign: "center", width: "20%" }}
                  ></Column>
                  <Column
                    field="matchPlan"
                    header="Match Plan"
                    style={{ textAlign: "center", width: "20%" }}
                    headerStyle={{
                      textAlign: "center",
                      backgroundColor: "#C65911",
                    }}
                  ></Column>
                </DataTable>
              </div>
              <div className="p-col-12 p-md-1 p-sm-6">
                <Button
                  icon="pi pi-external-link"
                  aria-controls="tabDetail"
                  onClick={(e) => this.op.toggle(e)}
                  className="mr-2"
                />
              </div>
              <OverlayPanel
                ref={(el) => (this.op = el)}
                id="tabDetail"
                style={{ width: "60%" }}
              >
                {this.templateDetail()}
              </OverlayPanel>
            </div>
          </div>
        </div>
        {this.templateDialogAdd()}
        {this.dialogExport()}
      </div>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    wkt_filter: state.workingTask.wkt_filter,
    wkt_getTask: state.workingTask.wkt_getTask,
    wkt_save: state.workingTask.wkt_save,
    wkt_export: state.workingTask.wkt_export,
    wkt_GetDetailByEmployee: state.workingTask.wkt_GetDetailByEmployee,
    getShopByEmployee: state.employees.getShopByEmployee,
    employeeDDL: state.employees.employeeDDL,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    WorkingTaskController: bindActionCreators(
      WorkingTaskCreateAction,
      dispatch
    ),
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkingTask);
