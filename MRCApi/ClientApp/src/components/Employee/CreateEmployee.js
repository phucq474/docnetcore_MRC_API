import get from "lodash";
import { Button } from "primereact/button";
import React, { Component } from "react";
import { GoPencil, GoTrash } from "react-icons/go";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ProductCreateAction } from "../../store/ProductController";
import { getToken, HelpPermission } from "../../Utils/Helpler";
import UserInfo from "../Employee/EmployeeInfoUser";
import EmployeePersonalInfo from "../Employee/EmployeePersonalInfo";
import EmployeeWorkingInfo from "../Employee/EmployeeWorkingInfo";
import EmployeeWorkingStatus from "../Employee/EmployeeWorkingStatus";
import EmployeeIdCard from "./EmployeeIdCard";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import { Toast } from "primereact/toast";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class CreateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeDetail: {},
      employeeWorkingStatus: [],
      CanEdit: true,
      selectedFile: null,
      maternityStatus: {},
      viewIdCardDialog: false,
      confirmDialog: false,
      noUserFound: false,
      parentDetail: [],
      parentCurrent: {
        Id: 0,
        FromDate: new Date(),
        ToDate: null,
      },
      positionDetail: [],
      positionCurrent: {
        Id: 0,
        FromDate: new Date(),
        ToDate: null,
      },
      listCity: [],
      accId: null,
    };
    this.MaternityStatus = [
      { value: 1, name: `${this.props.language["solved"] || "l_solved"}` },
      { value: 2, name: `${this.props.language["solving"] || "l_solving"}` },
      { value: 3, name: `${this.props.language["comment"] || "l_comment"}` },
    ];
    this.pageId = 3;
    this.BindData = this.BindData.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.ActionWorkingStatus = this.ActionWorkingStatus.bind(this);
    this.handleChangeFormDetail = this.handleChangeFormDetail.bind(this);
    this.handleChangeDropdownlistDetail =
      this.handleChangeDropdownlistDetail.bind(this);
    this.handleChangeFormWorkingStatus =
      this.handleChangeFormWorkingStatus.bind(this);
    this.handleChangeDropdownListWorkingStatus =
      this.handleChangeDropdownListWorkingStatus.bind(this);
    this.onChangeWorkingStatus = this.onChangeWorkingStatus.bind(this);
    this.typingTimeoutRef = React.createRef();
    this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
    this.handlerChangeDate = this.handlerChangeDate.bind(this);
    this.buildFormData = this.buildFormData.bind(this);
    // this.handleChangeDropdownlistPosition =
    //   this.handleChangeDropdownlistPosition.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.BindData();
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.employeeDetail !== this.props.employeeDetail) {
      const data = nextprops.employeeDetail;
      if (data !== undefined && data.table !== undefined) {
        if (data.table[0] && !data.table[0]?.fromDate)
          data.table[0].fromDate = new Date();
        this.setState({
          employeeDetail: data.table[0],
          typeIdOld: data.table[0]?.typeId,
          positionDetail: JSON.parse(data.table[0].positionDetail),
          positionCurrent: JSON.parse(data.table[0].positionDetail)[0],
          CCCD:
            data.table[0] && data.table[0]?.identityCardNumber.length > 9
              ? true
              : false,
          parentDetail: JSON.parse(data.table[0].parentDetail),
          parentCurrent: JSON.parse(data.table[0].parentDetail)[0],
          accId:
            data.table[0].accountId !== undefined
              ? data.table[0].accountId
              : null,
        });
      }
      if (data !== undefined && data.table1 !== undefined)
        this.setState({ employeeWorkingStatus: data.table1 });
    }
  }

  async componentDidMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
    const employeeDDL = [...this.props.employeeDDL];
    if (employeeDDL.length === 0)
      await this.props.EmployeeController.GetEmployeeDDL(0);

    await this.GetListCity(this.state.accId);
  }

  GetListCity = async (accId) => {
    await this.props.EmployeeController.GetListCity(accId);
    const result = await this.props.getListCity;
    if (result.status === 200) {
      this.setState({
        listCity: result.data,
      });
    } else {
      this.setState({
        listCity: [],
      });
    }
  };

  async BindData() {
    if (this.props.match.params.id) {
      const employeeId = this.props.match.params.id;
      await this.props.EmployeeController.getEmployeeById(employeeId);
      const result = await this.props.employeeDetail;
      if (
        result?.table?.length === 0 &&
        result?.table1?.length === 0 &&
        result?.table2?.length === 0
      ) {
        this.setState({ noUserFound: true });
      }
    } else {
      this.setState({
        employeeDetail: { fromDate: new Date() },
        noUserFound: true,
      });
    }
  }

  actionTemplate(rowData, column) {
    return (
      <div>
        <GoPencil
          size={20}
          title={this.props.language["edit"] || "edit"}
          onClick={(e) => this.EditWorkingStatus(column)}
        />
        <GoTrash
          size={20}
          title={this.props.language["delete"] || "l_delete"}
        />
      </div>
    );
  }

  EditWorkingStatus = (EmployeeWorkingId) => {};
  timer = null;

  onChangeImgHandler = (event) => {
    if (event.target.files[0]) {
      this.setState({
        employeeDetail: {
          ...this.state.employeeDetail,
          imageUrl: URL.createObjectURL(event.target.files[0]),
          ImageProfile: event.target.files[0],
        },
      });
    }
  };
  onChangeImgFront = (event) => {
    if (event.target.files[0]) {
      this.setState({
        employeeDetail: {
          ...this.state.employeeDetail,
          cmndBefore: URL.createObjectURL(event.target.files[0]),
          FileCMNDBefore: event.target.files[0],
        },
      });
    }
  };
  onChangeImgBack = (event) => {
    if (event.target.files[0]) {
      this.setState({
        employeeDetail: {
          ...this.state.employeeDetail,
          cmndAfter: URL.createObjectURL(event.target.files[0]),
          FileCMNDAfter: event.target.files[0],
        },
      });
    }
  };

  async handleChangeDropdownlistDetail(e, value) {
    if (e === "typeId" && this.props.match.params.id) {
      await this.setState({ confirmDialog: true, e, value });
    } else {
      if (e.value) {
        await this.setState({
          employeeDetail: {
            ...this.state.employeeDetail,
            [e.target.id]: e.value == null ? "" : e.value,
          },
        });
      } else {
        await this.setState({
          employeeDetail: {
            ...this.state.employeeDetail,
            [e]: value == null ? "" : value,
          },
        });
      }
    }
  }

  handleChangeDropdownInfo = (id, value) => {
    this.setState({
      employeeDetail: { ...this.state.employeeDetail, [id]: value ? value : 0 },
    });
  };

  handleChangeFormDetail(e, id) {
    const idInput = e.target.id ? e.target.id : id;
    const value = e.target.value;
    const newEmpDetailState = { ...this.state.employeeDetail };
    newEmpDetailState[idInput] = value;
    if (idInput === "fisrtName" || idInput === "lastName") {
      newEmpDetailState.fullName =
        (newEmpDetailState.lastName || "") +
        " " +
        (newEmpDetailState.fisrtName || "");
    }
    this.setState({ employeeDetail: newEmpDetailState });
  }

  handleChangeFormWorkingStatus(e) {
    const newEmployeeWorkingStatusState = {
      ...this.state.employeeWorkingStatus,
    };
    newEmployeeWorkingStatusState[e.target.id] = e.target.value;
    this.setState({
      employeeWorkingStatus: newEmployeeWorkingStatusState,
    });
  }

  handleChangeDropdownListWorkingStatus(id, value) {
    const newEmployeeWorkingStatusState = {
      ...this.state.employeeWorkingStatus,
    };
    if (id.value) {
      newEmployeeWorkingStatusState[id.target.id] =
        id.value === null ? "" : id.value.value;
      this.setState({
        employeeWorkingStatus: newEmployeeWorkingStatusState,
      });
      this.setState({
        employeeWorkingStatus: newEmployeeWorkingStatusState,
      });
    } else {
      newEmployeeWorkingStatusState[id] = value === null ? "" : value.value;
      this.setState({
        employeeWorkingStatus: newEmployeeWorkingStatusState,
      });
    }
  }

  handlerChangeDate(e, type) {
    let newEmployeeDetailState = { ...this.state.employeeDetail };
    if (type === "WorkingStatus") {
      if (e.value) {
        newEmployeeDetailState.fromDate = e.value[0] || e.value;
        newEmployeeDetailState.toDate = e.value[1] || null;
      } else {
        newEmployeeDetailState.fromDate = null;
        newEmployeeDetailState.toDate = null;
      }
    } else if (type === "WorkingInfo") {
      newEmployeeDetailState.parentDates = e.value;
    } else {
      if (e.value) {
        newEmployeeDetailState.fromDateCat = e.value[0];
        newEmployeeDetailState.toDateCat = e.value[1];
      } else {
        newEmployeeDetailState.fromDateCat = null;
        newEmployeeDetailState.toDateCat = null;
      }
    }
    this.setState({
      employeeDetail: newEmployeeDetailState,
    });
  }

  onChangeWorkingStatus(rownum, value, inputId) {
    let lst = [...this.state.employeeWorkingStatus];
    for (let index = 0; index < lst.length; index++) {
      if (lst[index].rowNum === rownum) {
        lst[index][inputId] = value === null ? "" : value;
        break;
      }
    }
    this.setState({ employeeWorkingStatus: lst });
  }

  ActionWorkingStatus(employeeWorkingId, Action, obj) {
    if (Action === "Edit") {
      let lst = [...this.state.employeeWorkingStatus];
      for (let index = 0; index < lst.length; index++) {
        if (lst[index].employeeWorkingId === employeeWorkingId) {
          lst[index].isEditing = 1;
          break;
        }
      }
      this.setState({ employeeWorkingStatus: lst });
    } else if (Action === "Update") {
      if (obj.fromDate === null || obj.fromDate === "") {
        alert(
          `${
            this.props.language["date_must_not_be_null"] ||
            "l_date_must_not_be_null"
          }`
        );
        return;
      }
      let data = {
        EmployeeWorkingId: obj.employeeWorkingId,
        FromDate: obj.fromDate,
        ToDate: obj.toDate,
        ActualDate: obj.actualDate,
        Status: obj.status,
        Comment: obj.comment,
      };
      this.props.EmployeeController.EmployeeWorkingUpdate(data)
        .then(() => {
          this.BindData();
        })
        .then(() => {
          alert(`${this.props.language["success"] || "l_success"}`);
        });
      // let lst = [...this.state.employeeWorkingStatus];
      // for (let index = 0; index < lst.length; index++) {
      //     if (lst[index].employeeWorkingId === employeeWorkingId) {
      //         lst[index].isEditing = 0;
      //         break;
      //     }
      // }
      // this.setState({ employeeWorkingStatus: lst });
    } else if (Action === "Delete") {
      let data = {
        EmployeeWorkingId: employeeWorkingId,
      };
      this.props.DeletEmployeeWorkingAction.DeleteEmployeeWorking(data);
      let lst = [...this.state.employeeWorkingStatus];
      for (let i = 0; i < lst.length; i++) {
        if (lst[i].employeeWorkingId === employeeWorkingId) {
          lst.splice(i, 1);
          break;
        }
      }
      this.setState({ employeeWorkingStatus: lst });
    }
  }

  // getUserByUserName = async (UserName) => {
  //   const url = "api/users/GetUserByUserName";
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: getToken(),
  //       UserName: UserName,
  //     },
  //   };
  //   try {
  //     const request = new Request(url, requestOptions);
  //     const response = await fetch(request);
  //     const result = await response.json();
  //     return result;
  //   } catch (error) {
  //     alert(error);
  //     return;
  //   } finally {
  //   }
  // };

  ToastShow = (message, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: message,
    });
  };

  // GetEmployeeByEmployeeCode = async (EmployeeCode) => {
  //   const url = "employee/EmployeeByCode";
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: getToken(),
  //       EmployeeCode: EmployeeCode,
  //     },
  //   };
  //   try {
  //     const response = await fetch(url, requestOptions);
  //     const employeeByCode = await response.json();
  //     return employeeByCode;
  //   } catch (error) {
  //     alert(error);
  //     return;
  //   }
  // };
  functionSaveData = async () => {
    const state = this.state;
    let employeeDetail = this.state.employeeDetail;
    const parentCurrent = this.state.parentCurrent;
    const positionCurrent = this.state.positionCurrent;

    employeeDetail.parentId = employeeDetail.ParentId
      ? employeeDetail.ParentId
      : parentCurrent.ParentId
      ? parentCurrent.ParentId
      : 0;
    employeeDetail.fromDateParent = employeeDetail.fromDateParent
      ? employeeDetail.fromDateParent
      : parentCurrent.FromDate
      ? parentCurrent.FromDate
      : null;
    employeeDetail.toDateParent = employeeDetail.toDateParent
      ? employeeDetail.toDateParent
      : parentCurrent.ToDate
      ? parentCurrent.ToDate
      : null;

    employeeDetail.positionCurrent = positionCurrent;
    employeeDetail.typeId = !state.typeIdOld
      ? employeeDetail.typeId
      : state.typeIdOld;
    employeeDetail.typeId_new = employeeDetail.typeId_new
      ? employeeDetail.typeId_new
      : state.typeIdOld;

    employeeDetail.isDelete = false;
    employeeDetail.status =
      employeeDetail.status === 0 || employeeDetail.status === 1
        ? employeeDetail.status
        : null;
    employeeDetail.imageUrl = employeeDetail.imageUrl
      ? employeeDetail.imageUrl
      : null;
    employeeDetail.birthday = employeeDetail.birthday
      ? moment(employeeDetail.birthday).format("YYYY-MM-DD")
      : null;
    employeeDetail.fromDate =
      employeeDetail.fromDate && employeeDetail.fromDate !== "####-##-##"
        ? moment(employeeDetail.fromDate).format("YYYY-MM-DD")
        : null;
    employeeDetail.toDate = employeeDetail.toDate
      ? moment(employeeDetail.toDate).format("YYYY-MM-DD")
      : null;
    employeeDetail.actualDate = employeeDetail.actualDate
      ? moment(employeeDetail.actualDate).format("YYYY-MM-DD")
      : null;
    employeeDetail.workingDate = employeeDetail.workingDate
      ? moment(employeeDetail.workingDate).format("YYYY-MM-DD")
      : null;
    employeeDetail.identityCardDate = employeeDetail.identityCardDate
      ? moment(employeeDetail.identityCardDate).format("YYYY-MM-DD")
      : null;
    employeeDetail.ImageProfile = employeeDetail.ImageProfile
      ? employeeDetail.ImageProfile
      : null;
    employeeDetail.startDate = employeeDetail.startDate
      ? moment(employeeDetail.startDate).format("YYYY-MM-DD")
      : null;
    if (employeeDetail.workingStatusId === 3) {
      employeeDetail.resignedDate = moment(employeeDetail.fromDate).format(
        "YYYY-MM-DD"
      );
    }
    if (!this.props.match.params.id) {
      employeeDetail.type = "insert";
      employeeDetail.id = -1;
    } else employeeDetail.type = "update";
    // if (employeeDetail.parentDates) {
    //     employeeDetail.fromDateParent = moment(employeeDetail.parentDates[0]).format('YYYY-MM-DD')
    //     employeeDetail.toDateParent = employeeDetail.parentDates && employeeDetail.parentDates[1] ? moment(employeeDetail.parentDates[1]).format('YYYY-MM-DD') : null
    // }
    let objEmployeeToSave = {};
    objEmployeeToSave.JsonData = JSON.stringify(employeeDetail);
    objEmployeeToSave.ImageProfile = employeeDetail.ImageProfile
      ? employeeDetail.ImageProfile
      : null;

    objEmployeeToSave.FileCMNDBefore = employeeDetail.FileCMNDBefore
      ? employeeDetail.FileCMNDBefore
      : null;
    objEmployeeToSave.FileCMNDAfter = employeeDetail.FileCMNDAfter
      ? employeeDetail.FileCMNDAfter
      : null;

    objEmployeeToSave.Password = employeeDetail.passWord
      ? employeeDetail.passWord
      : null;
    const formData = new FormData();
    this.buildFormData(formData, objEmployeeToSave);
    const result = await this.props.EmployeeController.updateEmployee(
      formData,
      state.accId
    );
    if (result.status === 200) {
      await this.btnSaveParent();
      await this.btnSavePosition();
    }
  };

  buildFormData = (formData, data, parentKey) => {
    if (
      data &&
      typeof data === "object" &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach((key) => {
        this.buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      const value = data == null ? "" : data;

      formData.append(parentKey, value);
    }
  };

  btnSaveOnClick = async () => {
    const accId = this.state.accId;
    let employeeDetail = this.state.employeeDetail;
    const parentCurrent = this.state.parentCurrent;
    if (!this.props.match.params.id) {
      employeeDetail.status = 1;
    }
    if (employeeDetail.workingStatusId === 4 && !employeeDetail.toDate) {
      this.ToastShow(
        `${
          this.props.language["input_the_maternity_end_date"] ||
          "l_input_the_maternity_end_date"
        }`,
        "error"
      );
      return;
    }
    if (!employeeDetail.fullName) {
      this.ToastShow(
        `${this.props.language["input_full_name"] || "l_input_full_name"}`,
        "error"
      );
      return;
    }
    if (!employeeDetail.employeeCode) {
      this.ToastShow(
        `${
          this.props.language["input_employee_code"] || "l_input_employee_code"
        }`,
        "error"
      );
      return;
    }
    // if (!employeeDetail.customerCode) {
    //     this.ToastShow(`${this.props.language["input_customer_code"] || "l_input_customer_code"}`, 'error');
    //     return;
    // }
    if (!employeeDetail.typeId) {
      this.ToastShow(
        `${this.props.language["choose_position"] || "l_choose_position"}`,
        "error"
      );
      return;
    }
    // if (!employeeDetail.parentId) {
    //     this.ToastShow(`${this.props.language["choose_manager"] || "l_choose_manager"}`, 'error');
    //     return;
    // }
    if (!parentCurrent.ParentId && !employeeDetail.isAdmin) {
      await this.ToastShow(
        `${this.props.language["choose_manager"] || "l_choose_manager"}`,
        "error"
      );
      return;
    }
    if (!employeeDetail.fromDate) {
      this.ToastShow(
        `${
          this.props.language["input_date_start_to_work"] ||
          "l_input_date_start_to_work"
        }`,
        "error"
      );
      return;
    }
    if (employeeDetail.status !== 0 && employeeDetail.status !== 1) {
      this.ToastShow(
        `${this.props.language["invalid_status"] || "l_invalid_status"}`,
        "error"
      );
      return;
    }
    if (!parentCurrent.FromDate && !parentCurrent.FromDate) {
      this.ToastShow("Chưa chọn khoảng thời gian cho cấp quản lý", "error");
      return;
    }
    // if (!employeeDetail.fromDateParent && !employeeDetail.parentDates) {
    //     this.ToastShow('Chưa chọn khoảng thời gian cho cấp quản lý', 'error');
    //     return;
    // }
    if (
      employeeDetail.passWord !== null &&
      employeeDetail.passWord !== "" &&
      employeeDetail.passWord !== undefined
    ) {
      if (employeeDetail.passWord.length < 6) {
        this.ToastShow(
          `${
            this.props.language["password_length_must_longer_6"] ||
            "l_password_length_must_longer_6"
          }`,
          "error"
        );
        return;
      }
      if (!employeeDetail.rePassword) {
        this.ToastShow(
          `${
            this.props.language["repassword_is_not_empty"] ||
            "l_repassword_is_not_empty"
          }`,
          "error"
        );
        return;
      }
      if (employeeDetail.passWord !== employeeDetail.rePassword) {
        this.ToastShow(
          `${
            this.props.language["password_and_repassword_is_not_match"] ||
            "l_password_and_repassword_is_not_match"
          }`,
          "error"
        );
        return;
      }
    }
    if (employeeDetail.cmndBefore || employeeDetail.cmndAfter) {
      if (!employeeDetail.cmndBefore)
        return await this.Alert("Please complete Front ID", "warn");
      if (!employeeDetail.cmndAfter)
        return await this.Alert("Please complete Back ID card", "warn");
    }
    if (!this.props.match.params.id) {
      if (!employeeDetail.username) {
        this.ToastShow(
          `${this.props.language["input_username"] || "l_input_username"}`,
          "error"
        );
        return;
      }
      if (!employeeDetail.passWord) {
        this.ToastShow(
          `${this.props.language["retype_password"] || "l_retype_password"}`,
          "error"
        );
        return;
      } else {
        if (employeeDetail.passWord < 6) {
          this.ToastShow(
            `${
              this.props.language["password_length_must_longer_6"] ||
              "l_password_length_must_longer_6"
            }`,
            "error"
          );
          return;
        }
      }
    }

    try {
      this.functionSaveData(accId).then(() => {
        const result = this.props.updateEmployee;
        if (result.status === 200) {
          this.ToastShow(`${this.props.language["success"] || "l_success"} `);
          this.BindData();
          return;
        } else {
          this.ToastShow(result.message, "error");
          return;
        }
      });
    } catch (error) {
      this.ToastShow(error);
      return;
    }
  };

  _handleInputChange = (event) => {
    const field = get(event, "target.id", "").trim();
    const newState = get(event, "target.value", "");
    if (field) {
      this.setState({ [field]: newState });
    }
  };

  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };

  dateActive = (rowData, event) => {
    return (
      <Calendar
        monthNavigator
        yearNavigator
        yearRange="2000:2030"
        id="fromDateEmployee"
        value={new Date(rowData.fromDate)}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDateActive(rowData, e.value, event.rowIndex)
        }
      />
    );
  };

  dateExpire = (rowData, event) => {
    return (
      <Calendar
        monthNavigator
        yearNavigator
        yearRange="2000:2030"
        id="toDateEmployee"
        value={rowData.toDate ? new Date(rowData.toDate) : null}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDateExpire(rowData, e.value, event.rowIndex)
        }
        disabled={rowData.workingStatusId === 3 ? true : false}
      />
    );
  };

  actualDate = (rowData, event) => {
    return (
      <Calendar
        monthNavigator
        yearNavigator
        yearRange="2000:2030"
        id="actualDateEmployee"
        value={rowData.actualDate ? new Date(rowData.actualDate) : null}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeActualDate(rowData, e.value, event.rowIndex)
        }
        disabled={rowData.workingStatusId === 4 ? false : true}
      />
    );
  };

  maternityStatus = (rowData, event) => {
    return (
      <Dropdown
        id="maternityStatus"
        key={this.MaternityStatus.value}
        options={this.MaternityStatus}
        disabled={rowData.workingStatusId === 4 ? false : true}
        placeholder={
          this.props.language["select_a_status"] || "l_select_a_status"
        }
        optionLabel="name"
        value={rowData.workingStatusId === 4 ? rowData.status || "" : ""}
        onChange={(e) =>
          this.handleChangeMaternity(e.target.id, e.value, event.rowIndex)
        }
      ></Dropdown>
    );
  };

  Notes = (rowData, event) => {
    return (
      <InputText
        id="comment"
        value={rowData.comment}
        onChange={(e) =>
          this.handleInput(e.target.id, e.target.value, event.rowIndex)
        }
        disabled={rowData.workingStatusId === 4 ? false : true}
      />
    );
  };

  handleChangeDateActive = (rowData, value, index) => {
    let temp = this.state.employeeWorkingStatus;
    temp[index].fromDate = moment(value).format();
    this.setState({ employeeWorkingStatus: temp });
  };

  handleChangeDateExpire = (rowData, value, index) => {
    let temp = this.state.employeeWorkingStatus;
    temp[index].toDate = value ? moment(value).format() : null;
    this.setState({ employeeWorkingStatus: temp });
  };

  handleChangeActualDate = (rowData, value, index) => {
    let temp = this.state.employeeWorkingStatus;
    temp[index].actualDate = value ? moment(value).format() : null;
    this.setState({ employeeWorkingStatus: temp });
  };

  handleChangeMaternity = (id, value, index) => {
    let temp = this.state.employeeWorkingStatus;
    temp[index].status = value;
    this.setState({ employeeWorkingStatus: temp });
  };

  handleInput = (id, value, index) => {
    let temp = this.state.employeeWorkingStatus;
    temp[index][id] = value ? value : null;
    this.setState({ employeeWorkingStatus: temp });
  };

  renderAction = (rowData, event) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          style={{ marginRight: 10 }}
          icon="pi pi-save"
          className="p-button-success"
          onClick={() => this.handleSave(rowData, event.rowIndex)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() =>
            this.handleDeleteWorkingDialog(true, rowData, event.rowIndex)
          }
        />
      </div>
    );
  };

  handleDeleteWorkingDialog = (boolean, rowData, index) => {
    if (boolean) {
      this.setState({
        deleteDialog: true,
        idWorking: rowData.employeeWorkingId,
        indexWorking: index,
      });
    } else {
      this.setState({ deleteDialog: false });
    }
  };

  renderFooterDeleteDialog = () => {
    return (
      <div>
        <Button
          style={{ marginRight: 10 }}
          label="Cancel"
          className="p-button-info"
          onClick={() => this.handleDeleteWorkingDialog(false)}
        />
        <Button
          label="Delete"
          className="p-button-danger"
          onClick={() => this.handleDeleteWorking()}
        />
      </div>
    );
  };

  handleDeleteWorking = async () => {
    const state = this.state;
    await this.props.EmployeeController.EmployeeWorkingDelete(state.idWorking);
    const result = this.props.employeeWorkingDelete;
    if (result && result && result.status === 200) {
      let employeeWorkingStatus = await this.state.employeeWorkingStatus;
      await employeeWorkingStatus.splice(state.indexWorking, 1);
      await this.BindData();
      await this.Alert(result.message, "success");
    } else {
      await this.Alert(result.message, "error");
    }
    await this.setState({ deleteDialog: false });
  };

  handleSave = async (rowData) => {
    if (rowData.fromDate === "Invalid date" || rowData.fromDate === null) {
      return await this.Alert("Active Date is not NULL", "warn");
    }
    const data = {
      id: rowData.employeeWorkingId,
      fromDate: parseInt(moment(new Date(rowData.fromDate)).format("YYYYMMDD")),
      toDate: rowData.toDate
        ? parseInt(moment(new Date(rowData.toDate)).format("YYYYMMDD"))
        : 0,
      actualDate: rowData.actualDate
        ? parseInt(moment(new Date(rowData.actualDate)).format("YYYYMMDD"))
        : 0,
      comment: rowData.comment ? rowData.comment : "",
      maternityStatus: rowData.status || 0,
    };
    await this.props.EmployeeController.EmployeeWorkingUpdate(data);
    const result = this.props.employeeWorkingUpdate;
    if (result.status === 200) {
      await this.Alert(result.message, "success");
    } else {
      await this.Alert(result.message, "error");
    }
  };

  dateActivePermission = (rowData, event) => {
    return (
      <Calendar
        monthNavigator
        yearNavigator
        yearRange="2000:2030"
        id="fromDatePermission"
        value={new Date(rowData.fromDate)}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.ChangeDateActivePermission(rowData, e.value, event.rowIndex)
        }
      />
    );
  };

  dateExpirePermission = (rowData, event) => {
    return (
      <Calendar
        monthNavigator
        yearNavigator
        yearRange="2000:2030"
        id="toDatePermission"
        value={rowData.toDate ? new Date(rowData.toDate) : null}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.ChangeDateExpertPermission(rowData, e.value, event.rowIndex)
        }
      />
    );
  };

  renderActionPermission = (rowData, event) => {
    return (
      <Button
        icon="pi pi-save"
        className="p-button-success"
        onClick={() => this.handleSavePermission(rowData, event.rowIndex)}
      />
    );
  };

  handleDialogViewID = (boolean, info) => {
    if (boolean) {
      this.setState({ viewIdCardDialog: true, info: info });
    } else {
      this.setState({ viewIdCardDialog: false });
    }
  };

  clearFrontImage = () => {
    this.setState({
      employeeDetail: {
        ...this.state.employeeDetail,
        FileCMNDBefore: null,
        cmndBefore: null,
      },
    });
  };

  clearBackImage = () => {
    this.setState({
      employeeDetail: {
        ...this.state.employeeDetail,
        FileCMNDAfter: null,
        cmndAfter: null,
      },
    });
  };
  footerConfirm = () => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.handleConfirmDialog(false)}
          className="p-button-info"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => this.Accept()}
          className="p-button-danger"
        />
      </div>
    );
  };
  handleConfirmDialog = (boolean) => {
    if (boolean) {
      this.setState({ confirmDialog: true });
    } else {
      this.setState({ confirmDialog: false });
    }
  };
  Accept = () => {
    const e = this.state.e;
    const value = this.state.value;
    this.setState({
      confirmDialog: false,
      employeeDetail: {
        ...this.state.employeeDetail,
        [e]: value == null ? "" : value,
        typeId_new: value === null ? "" : value,
      },
    });
  };
  handleChangeModeID = (id, value) => {
    this.setState({ [id]: value ? value : false });
  };

  // Parent
  handleChangeDropdownlistParent = async (e, value) => {
    const employeeDDL = await this.props.employeeDDL;
    const employeeDetail = await this.state.employeeDetail;
    let parentDetail = this.state.parentDetail;
    let parentFirst = parentDetail[0];
    let parentLast = parentDetail[parentDetail.length - 1];
    let parentCurrent = this.state.parentCurrent;
    const emp = employeeDDL.find((a) => a.id === value);
    if (emp === undefined) {
      return;
    }

    if (
      parentFirst === undefined ||
      parentFirst === null ||
      parentCurrent.ParentId !== value
    ) {
      parentCurrent = {
        ...parentCurrent,
        Id: 0,
        RN: 0,
        IsDelete: 0,
        ParentId: value,
        ParentCode: emp.employeeCode,
        ParentName: emp.employeeName,
        EmployeeCode: employeeDetail.employeeCode,
      };
      if (parentLast?.Id === 0) {
        parentDetail[parentDetail.length - 1] = parentCurrent;
      } else {
        parentDetail.push(parentCurrent);
      }
      await this.setState({ parentDetail: parentDetail });
    } else {
      parentCurrent = {
        ...parentCurrent,
        ParentId: value,
        ParentCode: emp.employeeCode,
        ParentName: emp.employeeName,
      };
    }
    await this.setState({
      parentCurrent: parentCurrent,
    });
  };

  handleChangeDateParent_Group = (e, type) => {
    let parentDetail = this.state.parentDetail;
    let parentCurrent = this.state.parentCurrent;
    if (e.value) {
      parentCurrent.FromDate = e.value[0];
      parentCurrent.ToDate = e.value[1];

      let parentFirst = parentDetail[0];
      if (parentFirst !== undefined && parentFirst !== null) {
        if (
          parentCurrent.Id === parentFirst.Id &&
          parentCurrent.ParentId === parentFirst.ParentId
        ) {
          parentFirst.FromDate = parentCurrent.FromDate;
          parentFirst.ToDate = parentCurrent.ToDate;

          parentDetail[0] = parentFirst;
          this.setState({ parentDetail: parentDetail });
        }
      }
    } else {
      parentCurrent.FromDate = null;
      parentCurrent.ToDate = null;
    }
    this.setState({ parentCurrent: parentCurrent });
  };

  handleChangeDateParent = (rowData, value, index, para) => {
    let result = this.state.parentDetail;
    result[index][para] = moment(value).format();
    this.setState({ parentDetail: result });
  };
  // employee parent
  dateFrom = (rowData, event) => {
    return (
      <Calendar
        id="FromDate"
        value={new Date(rowData.FromDate)}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDateParent(
            rowData,
            e.value,
            event.rowIndex,
            "FromDate"
          )
        }
      />
    );
  };
  dateTo = (rowData, event) => {
    return (
      <Calendar
        id="ToDate"
        value={rowData.ToDate ? new Date(rowData.ToDate) : null}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDateParent(
            rowData,
            e.value,
            event.rowIndex,
            "ToDate"
          )
        }
      />
    );
  };

  onChangeCheckboxParent = (rowData, value, index) => {
    let result = this.state.parentDetail;
    result[index].IsDelete = value === true ? 1 : 0;
    this.setState({ parentDetail: result });
  };

  checkBoxParent = (rowData, event) => {
    return (
      <Checkbox
        inputId="binary"
        checked={rowData.IsDelete === 1 ? true : false}
        onChange={(e) =>
          this.onChangeCheckboxParent(rowData, e.checked, event.rowIndex)
        }
      />
    );
  };

  btnSaveParent = async () => {
    let data = await this.state.parentDetail;
    const employeeDetail = await this.state.employeeDetail;

    await data.forEach((element) => {
      element.FromDate =
        element.FromDate !== undefined && element.FromDate !== "Invalid date"
          ? moment(element.FromDate).format("YYYY-MM-DD")
          : null;
      element.ToDate =
        element.ToDate !== undefined &&
        element.ToDate !== null &&
        element.ToDate !== "Invalid date"
          ? moment(element.ToDate).format("YYYY-MM-DD")
          : null;
      element.EmployeeCode = employeeDetail.employeeCode;
    });

    const listParent = await data.find((a) => a.IsDelete === 0);
    if (listParent === undefined) {
      await this.Alert("Không thể xóa hết Quản lý", "error");
      return;
    }

    await this.props.EmployeeController.ParentSave(data);
    const result = await this.props.parentSave;
    if (result?.status === 200) {
      this.setState({
        parentDetail: JSON.parse(result?.data[0].parentDetail),
        parentCurrent: JSON.parse(result?.data[0].parentDetail)[0],
      });
      await this.Alert(result.message, "success");
    } else {
      this.setState({
        parentDetail:
          result?.data !== null && result?.data !== undefined
            ? JSON.parse(result?.data[0].parentDetail)
            : data,
        parentCurrent:
          result?.data !== null && result?.data !== undefined
            ? JSON.parse(result?.data[0].parentDetail)[0]
            : this.state.parentCurrent,
      });
      await this.Alert(result.message, "error");
    }
  };
  // employee position
  handleChangeDropdownlistPosition = async (e, value) => {
    //this.setState({ confirmDialog: true, e, value });
    this.setState({
      employeeDetail: {
        ...this.state.employeeDetail,
        typeId: value,
        typeId_new: value,
      },
    });
    const employeeTypes = await this.props.employeeTypes;
    //const employeeDetail = await this.state.employeeDetail;

    let positionDetail = this.state.positionDetail;
    let positionFirst = positionDetail[0];
    let positionLast = positionDetail[positionDetail.length - 1];
    let positionCurrent = this.state.positionCurrent;
    const emp = employeeTypes.find((a) => a.id === value);
    if (emp === undefined) {
      return;
    }

    if (
      positionFirst === undefined ||
      positionFirst === null ||
      positionCurrent.PositionId !== value
    ) {
      positionCurrent = {
        ...positionCurrent,
        Id: 0,
        RN: 0,
        IsDelete: 0,
        PositionId: value,
        PositionName: emp.typeName,
      };
      if (positionLast?.Id === 0) {
        positionDetail[positionDetail.length - 1] = positionCurrent;
      } else {
        positionDetail.push(positionCurrent);
      }
      await this.setState({ positionDetail: positionDetail });
    } else {
      positionCurrent = {
        ...positionCurrent,
        PositionId: value,
        PositionName: emp.typeName,
      };
    }
    await this.setState({
      positionCurrent: positionCurrent,
    });
  };
  handleChangeDatePosition_Group = (e, type) => {
    let positionDetail = this.state.positionDetail;
    let positionCurrent = this.state.positionCurrent;
    if (e.value) {
      positionCurrent.FromDate = e.value[0];
      positionCurrent.ToDate = e.value[1];

      let parentFirst = positionDetail[0];
      if (parentFirst !== undefined && parentFirst !== null) {
        if (
          positionCurrent.Id === parentFirst.Id &&
          positionCurrent.PositionId === parentFirst.PositionId
        ) {
          parentFirst.FromDate = positionCurrent.FromDate;
          parentFirst.ToDate = positionCurrent.ToDate;

          positionDetail[0] = parentFirst;
          this.setState({ positionDetail: positionDetail });
        }
      }
    } else {
      positionCurrent.FromDate = null;
      positionCurrent.ToDate = null;
    }
    this.setState({ positionCurrent: positionCurrent });
  };
  handleChangeDatePosition = (rowData, value, index, para) => {
    let result = this.state.positionDetail;
    result[index][para] = moment(value).format();
    this.setState({ positionDetail: result });
  };
  dateFromPosition = (rowData, event) => {
    return (
      <Calendar
        id="FromDate"
        value={new Date(rowData.FromDate)}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDatePosition(
            rowData,
            e.value,
            event.rowIndex,
            "FromDate"
          )
        }
      />
    );
  };
  dateToPosition = (rowData, event) => {
    return (
      <Calendar
        id="ToDate"
        value={rowData.ToDate ? new Date(rowData.ToDate) : null}
        showIcon
        dateFormat="yy-mm-dd"
        onChange={(e) =>
          this.handleChangeDatePosition(
            rowData,
            e.value,
            event.rowIndex,
            "ToDate"
          )
        }
      />
    );
  };

  onChangeCheckboxPosition = (rowData, value, index) => {
    let result = this.state.positionDetail;
    result[index].IsDelete = value === true ? 1 : 0;
    this.setState({ positionDetail: result });
  };

  checkBoxPosition = (rowData, event) => {
    return (
      <Checkbox
        inputId="binary"
        checked={rowData.IsDelete === 1 ? true : false}
        onChange={(e) =>
          this.onChangeCheckboxPosition(rowData, e.checked, event.rowIndex)
        }
      />
    );
  };

  btnSavePosition = async () => {
    let data = await this.state.positionDetail;
    const employeeDetail = await this.state.employeeDetail;

    await data.forEach((element) => {
      element.FromDate =
        element.FromDate !== undefined && element.FromDate !== "Invalid date"
          ? moment(element.FromDate).format("YYYY-MM-DD")
          : null;
      element.ToDate =
        element.ToDate !== undefined &&
        element.ToDate !== null &&
        element.ToDate !== "Invalid date"
          ? moment(element.ToDate).format("YYYY-MM-DD")
          : null;
      element.EmployeeCode = employeeDetail.employeeCode;
    });

    const listPosition = await data.find((a) => a.IsDelete === 0);
    if (listPosition === undefined) {
      await this.Alert("Không thể xóa hết Vị trí", "error");
      return;
    }
    const result = await this.props.EmployeeController.PositionSave(data);
    if (result?.status === 200) {
      this.setState({
        positionDetail: JSON.parse(result?.data[0].positionDetail),
        positionCurrent: JSON.parse(result?.data[0].positionDetail)[0],
      });
      await this.Alert(result.message, "success");
    } else {
      this.setState({
        positionDetail:
          result?.data !== null && result?.data !== undefined
            ? JSON.parse(result?.data[0].positionDetail)
            : data,
        positionCurrent:
          result?.data !== null && result?.data !== undefined
            ? JSON.parse(result?.data[0].positionDetail)[0]
            : this.state.positionCurrent,
      });
      await this.Alert(result.message, "error");
    }
  };

  handleChangeDropdown = (id, value) => {
    this.setState({ [id]: value === null ? "" : value });
    if (id === "accId") {
      this.GetListCity(value);
    }
  };

  render() {
    const employeeDetail = this.state.employeeDetail || {};
    return (
      <>
        <Toast ref={(el) => (this.toast = el)} />
        <Dialog
          header="Xác nhận"
          visible={this.state.confirmDialog}
          style={{ width: "40vw" }}
          modal={true}
          footer={this.footerConfirm()}
          onHide={() => this.handleConfirmDialog(false)}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>Nếu thay đổi vị trí sẽ bị mất lịch làm việc hiện tại</span>
          </div>
        </Dialog>
        <Dialog
          header="Confirmation"
          visible={this.state.viewIdCardDialog}
          modal
          style={{ width: "70vw" }}
          onHide={() => this.handleDialogViewID(false)}
        >
          <div className="p-fluid" style={{ display: "flex", height: 400 }}>
            <div
              style={{
                cursor: "pointer",
                textAlign: "center",
                width: "45%",
                border: "white 1px ",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "space-around",
              }}
            >
              <div style={{ position: "absolute", right: 0 }}>
                <Button
                  icon="pi pi-times"
                  className="btn__hover p-button-danger p-button-text"
                  onClick={() => this.clearFrontImage()}
                  style={{ cursor: "default" }}
                  tooltip="clear"
                />
              </div>
              <label style={{ height: "10%", marginBottom: 15 }}>
                Front Display
              </label>
              <div>
                <img
                  alt="cmndBefore"
                  style={{ width: "80%", height: "90%" }}
                  src={
                    employeeDetail.cmndBefore
                      ? employeeDetail.cmndBefore
                      : "https://cdn1.iconfinder.com/data/icons/symbol-color-common-5/32/gallery-add-512.png"
                  }
                  onClick={() => this.fileInputFront.click()}
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  ref={(ref) => {
                    this.fileInputFront = ref;
                  }}
                  onChange={(e) => this.onChangeImgFront(e)}
                />
              </div>
            </div>
            <div style={{ width: "10%" }}></div>
            <div
              style={{
                cursor: "pointer",
                textAlign: "center",
                width: "45%",
                border: "white 1px ",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "space-around",
              }}
            >
              <div style={{ position: "absolute", right: 0 }}>
                <Button
                  icon="pi pi-times"
                  className="btn__hover p-button-danger p-button-text"
                  onClick={() => this.clearBackImage()}
                  style={{ cursor: "default" }}
                  tooltip="clear"
                />
              </div>
              <label style={{ height: "10%", marginBottom: 15 }}>
                Back Display
              </label>
              <div>
                <img
                  alt="cmndAfter"
                  style={{ width: "80%", height: "90%" }}
                  onClick={() => this.fileInputBack.click()}
                  src={
                    employeeDetail.cmndAfter
                      ? employeeDetail.cmndAfter
                      : "https://cdn1.iconfinder.com/data/icons/symbol-color-common-5/32/gallery-add-512.png"
                  }
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  ref={(ref) => (this.fileInputBack = ref)}
                  onChange={(e) => this.onChangeImgBack(e)}
                />
              </div>
            </div>
          </div>
        </Dialog>
        <div className="p-grid">
          <AccountDropDownList
            id="accId"
            className="p-field p-col-12 p-md-3"
            onChange={this.handleChangeDropdown}
            filter={true}
            showClear={true}
            value={this.state.accId}
            disabled={this.props.match.params.id > 0 ? true : false}
          />
        </div>

        <div className="p-grid" style={{ margin: 0 }}>
          <div className="p-col-12 p-md-7 p-sm-12">
            <EmployeePersonalInfo
              handerchangeInput={this.handleChangeFormDetail}
              handlerchangeDropDown={this.handleChangeDropdownlistDetail}
              onChangeImgHandler={this.onChangeImgHandler}
              EmployeeInfo={employeeDetail}
              onInputChange={this._handleInputChange}
              listCity={this.state.listCity}
              accId={this.state.accId}
            />
          </div>
          <div className="p-col-12 p-md-5 p-sm-12">
            <EmployeeWorkingInfo
              handlerchangeInput={this.handleChangeFormDetail}
              handlerchangeDropDown={this.handleChangeDropdownlistDetail}
              WorkInfo={{
                employeeCode: employeeDetail.employeeCode,
                customerCode: employeeDetail.customerCode,
                typeId: employeeDetail.typeId,
                deviceAddress: employeeDetail.deviceAddress
                  ? employeeDetail.deviceAddress
                  : null,
                parentId: employeeDetail.parentId
                  ? employeeDetail.parentId
                  : null,
                parentDates: employeeDetail.parentDates
                  ? employeeDetail.parentDates
                  : [
                      new Date(employeeDetail.fromDateParent),
                      employeeDetail.toDateParent
                        ? new Date(employeeDetail.toDateParent)
                        : null,
                    ],
              }}
              CanEdit={this.state.CanEdit}
              handlerChangeDate={this.handlerChangeDate}
              ParentDetail={this.state.parentDetail}
              positionDetail={this.state.positionDetail}
              handleChangeDropdownlistParent={
                this.handleChangeDropdownlistParent
              }
              dateFrom={this.dateFrom}
              dateTo={this.dateTo}
              checkBoxParent={this.checkBoxParent}
              btnSaveParent={this.btnSaveParent}
              handleChangeDateParent_Group={this.handleChangeDateParent_Group}
              isSaveParent={this.props.match.params.id > 0 ? true : false}
              ParentInfo={{
                ParentId: this.state.parentCurrent?.ParentId,
                fromtodate: [
                  this.state.parentCurrent?.FromDate
                    ? new Date(this.state.parentCurrent?.FromDate)
                    : new Date(),
                  this.state.parentCurrent?.ToDate
                    ? new Date(this.state.parentCurrent?.ToDate)
                    : null,
                ],
              }}
              accId={this.state.accId}
              dateFromPosition={this.dateFromPosition}
              dateToPosition={this.dateToPosition}
              checkBoxPosition={this.checkBoxPosition}
              btnSavePosition={this.btnSavePosition}
              isSavePosition={this.props.match.params.id > 0 ? true : false}
              handleChangeDatePosition_Group={
                this.handleChangeDatePosition_Group
              }
              handleChangeDropdownlistPosition={
                this.handleChangeDropdownlistPosition
              }
              PositionInfo={{
                ParentId: this.state.positionCurrent?.PositionId,
                fromtodate: [
                  this.state.positionCurrent?.FromDate
                    ? new Date(this.state.positionCurrent?.FromDate)
                    : new Date(),
                  this.state.positionCurrent?.ToDate
                    ? new Date(this.state.positionCurrent?.ToDate)
                    : null,
                ],
              }}
              // confirmDialog={this.state.confirmDialog}
              // handleConfirmDialog={this.handleConfirmDialog}
              // Accept={this.Accept}
            />
          </div>
          <div className={`p-col-12 p-md-6 p-sm-12`}>
            <EmployeeIdCard
              handerchangeInput={this.handleChangeFormDetail}
              EmployeeInfo={employeeDetail}
              handleDialogViewID={this.handleDialogViewID}
              CCCD={this.state.CCCD ? true : false}
              handleChangeModeID={this.handleChangeModeID}
              accId={this.state.accId}
            />
          </div>
          <div className="p-col-12 p-md-6 p-sm-12">
            <UserInfo
              noUserFound={this.state.noUserFound}
              EmployeeInfo={employeeDetail}
              Alert={this.Alert}
              handlerchangeInput={this.handleChangeFormDetail}
              handlerchangeDropDown={this.handleChangeDropdownInfo}
              CanEdit={this.state.CanEdit}
              accId={this.state.accId}
            />
          </div>
          <div className="p-col-12 p-md-12">
            <EmployeeWorkingStatus
              Infor={{
                workingStatusId: employeeDetail.workingStatusId,
                fromDate: employeeDetail.fromDate,
                toDate: employeeDetail.toDate,
                actualDate: employeeDetail.actualDate,
                maternityStatus: employeeDetail.maternityStatus,
                maternityComment: employeeDetail.maternityComment,
                fromtodate: [
                  this.state.employeeDetail.fromDate
                    ? new Date(this.state.employeeDetail.fromDate)
                    : new Date(),
                  this.state.employeeDetail.toDate
                    ? new Date(this.state.employeeDetail.toDate)
                    : null,
                ],
              }}
              employeeWorkingStatus={this.state.employeeWorkingStatus}
              handlerchangeDropDown={this.handleChangeDropdownlistDetail}
              handlerchangeInput={this.handleChangeFormDetail}
              onChangeWorkingStatus={this.onChangeWorkingStatus}
              ActionWorkingStatus={this.ActionWorkingStatus}
              handlerChangeDate={this.handlerChangeDate}
              dateActive={this.dateActive}
              dateExpire={this.dateExpire}
              renderAction={this.renderAction}
              actualDate={this.actualDate}
              Notes={this.Notes}
              maternityStatus={this.maternityStatus}
              handleDeleteWorkingDialog={this.handleDeleteWorkingDialog}
              deleteDialog={this.state.deleteDialog}
              renderFooterDeleteDialog={this.renderFooterDeleteDialog}
              accId={this.state.accId}
            />
          </div>
          <div
            className="p-col-12 p-shadow-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              label={this.props.language["save"] || "l_save"}
              className="p-button-success"
              icon="pi pi-save"
              onClick={() => this.btnSaveOnClick()}
            ></Button>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    employeeDetail: state.employees.employeeDetail,
    employeeWorkingUpdate: state.employees.employeeWorkingUpdate,
    updateEmployee: state.employees.updateEmployee,
    listWorkingStatus: state.listWorkingStatus,
    loading: state.employees.loading,
    errors: state.employees.errors,
    language: state.languageList.language,
    employeeWorkingDelete: state.employees.employeeWorkingDelete,
    parentSave: state.employees.parentSave,
    positionSave: state.employees.positionSave,
    employeeDDL: state.employees.employeeDDL,
    employeeTypes: state.employees.employeeTypes,
    getListCity: state.employees.getListCity,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployee);
