import React, { Component } from "react";
import { IoMdImages } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { CreateActionSpiralForm } from "../../store/SpiralFormController";
import { bindActionCreators } from "redux";
import { getLogin, formatCurrency } from "./../../Utils/Helpler.js";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { AutoComplete } from "primereact/autocomplete";
import { FaCamera, FaFileAudio, FaLessThan } from "react-icons/fa";
import moment from "moment";
import dvhcvn from "../../asset/filedata/dvhcvn.json";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { Sidebar } from "primereact/sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import expired from "./../../asset/images/EXPIRED.jpg";
import NumberFormat from "react-number-format";

// import WebcamCapture from './../Controls/react-webcam/WebcamCapture';

const isLogin = getLogin();
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const parameters = createBrowserHistory({ basename: baseUrl });
const dataByDomain = parameters.location.search;

const dataProvince = dvhcvn?.data || [];

class FormResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      formData: "",
      images: [],
      shops: [],
      employees: [],
      filteredEmployee: null,
      filteredShop: null,
      employeeId: null,
      resultId: "",
      workDate: moment(new Date()).format("YYYYMMDD"),
      shopId: null,
      sended: false,
      checkList: [],
      imageQuestion: [],
      isCamera: false,
      loading: true,
      dataDistrict: [],
      dataTown: [],
      expired: 0,
      selectedEmployee: null,
    };
    this.AnswerMultiChoose = this.AnswerMultiChoose.bind(this);
    this.AnswerSelected = this.AnswerSelected.bind(this);
    this.AnswerDate = this.AnswerDate.bind(this);
    this.AnswerInput = this.AnswerInput.bind(this);
    this.AnswerInputArea = this.AnswerInputArea.bind(this);
    this.AnswerNumber = this.AnswerNumber.bind(this);
    this.AnswerImage = this.AnswerImage.bind(this);
    this.AnswerCamera = this.AnswerCamera.bind(this);
    this.AnswerGrid = this.AnswerGrid.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeEmployee = this.handleOnChangeEmployee.bind(this);
    this.searchEmployee = this.searchEmployee.bind(this);
    this.searchShop = this.searchShop.bind(this);
    this.clearLD = this.clearLD.bind(this);
    this.onHideCamera = this.onHideCamera.bind(this);
    this.getImageFromCamera = this.getImageFromCamera.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.commify = this.commify.bind(this);
  }
  showError(value) {
    this.toast.show({
      severity: "error",
      summary: "Thông báo lỗi",
      detail: value,
    });
  }
  showSuccess(value) {
    this.toast.show({
      severity: "success",
      summary: "Thông báo thành công",
      detail: value,
    });
  }
  clearLD() {
    this.toastLD.clear();
  }
  showLoading() {
    this.toastLD.show({
      severity: "warn",
      sticky: true,
      content: (
        <div className="p-flex p-flex-column" style={{ flex: "1" }}>
          <div className="p-text-center">
            <i className="pi-cloud-upload" style={{ fontSize: "3rem" }}></i>
            <h4>Đang gửi dữ liệu.........</h4>
          </div>
          <div className="p-grid p-fluid">
            <ProgressSpinner style={{ height: "50px", width: "100%" }} />
          </div>
        </div>
      ),
    });
  }
  clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  };
  componentDidMount() {
    const host = window.location.search.substring(1);
    this.clearCacheData();
    if (this.props.mode === "view") {
      const result = this.props.dataInput;
      let lst = [];
      result.question.forEach((element) => {
        lst.push({
          questionId: element.questionId,
          isShow: true,
          isEnd: element.isEnd,
        });
      });
      this.setState({
        formData: result,
        checkList: lst,
        employees: [],
      });
    } else {
      if (isLogin === null) {
        let user = {
          accountId: 100000,
          accountName: "Anonymous",
          employeeCode: "Anonymous",
          fullName: "Anonymous",
          id: 0,
          positionId: 0,
          expriedDate: parseInt(moment(new Date()).format("YYYYMMDD"), 0) + 1,
          username: "Anonymous",
          token: "Bearer Anonymous",
        };
        localStorage.setItem("USER", JSON.stringify(user));
      }
      this.props.SpiralFormController.GetById(dataByDomain)
        .then(() => {
          this.setState({ loading: false });
          const result = this.props.spiralForm;

          if (result.id === 0) {
            this.showError(result.title);
          } else {
            if (result.toDate !== null) {
              if (
                result.toDate <
                parseInt(moment(new Date()).format("YYYYMMDD"), 0)
              ) {
                this.setState({
                  expired: 1,
                  loading: false,
                });
                return;
              }
            }

            let lst = [];
            JSON.parse(result.formData).forEach((element) => {
              let isBreak = element.anwserItem.findIndex((i) => i.nextStep > 0);
              lst.push({
                questionId: element.questionId,
                isShow: true,
                isBreak: isBreak > -1 ? true : false,
                isEnd: element.isEnd,
              });
            });
            this.setState({
              formDefault: result,
              formData: result,
              checkList: lst,
            });
            // có employees
            if (result.employees !== null && result.employees?.length > 0) {
              this.setState({
                employees: JSON.parse(result.employees),
                selectedEmployee:
                  JSON.parse(result.employees).length === 1
                    ? JSON.parse(result.employees)[0]
                    : null,
                employeeId:
                  JSON.parse(result.employees).length === 1
                    ? JSON.parse(result.employees)[0]
                    : null,
              });
            }

            if (result.usedStores) {
              let data = {
                accountId: result.accountId,
                employeeId: result.createBy > 0 ? result.createBy : 0,
              };
              this.props.SpiralFormController.GetShops(data).then(() => {
                this.setState({ shops: this.props.shops });
              });
            }
          }
        })
        .catch((e) => {
          console.log({ "error ": e });
        });
    }
  }
  onHideCamera() {
    this.setState({ isCamera: false });
  }
  renderHeader() {
    return (
      <Card key="header" style={{ background: "aliceblue" }}>
        <div style={{ display: "flex" }}>
          <img
            alt="logo"
            height={100}
            style={{ margin: "-2rem 0rem" }}
            src="images/logo_spiral.png"
          ></img>
          <div style={{ textAlign: "center", color: "#252525", width: "100%" }}>
            <strong>Công ty TNHH Sức Bật</strong>
            <br></br>
            <label> 27B Nguyễn Đình Chiểu, P.Đakao, Q.1, TP.Hồ Chí Minh</label>
          </div>
        </div>
        {/* <img alt="logo" height={100} style={{ margin: "-2rem 0rem" }} src="images/logo_aca.jpg"></img> */}
      </Card>
    );
  }
  renderBanner() {
    const banner = this.props.spiralForm.banner;
    if (banner === null || banner === "" || banner === undefined) return null;
    else {
      const data = JSON.parse(banner);
      return (
        <div style={{ marginTop: 10, marginBottom: -5 }} key="banner">
          <img
            alt="logo"
            style={{ maxHeight: data.imageHeight, width: "100%" }}
            src={data.imageURL}
          ></img>
        </div>
      );
    }
  }
  renderTitle() {
    const formData = this.state.formData;
    return (
      <Card
        key="title"
        title={formData.title}
        style={{ margin: "10px 0px", borderTop: "10px solid #2196f3" }}
      >
        <p
          className="p-m-0"
          style={{ lineHeight: "1.5", whiteSpace: "pre-wrap" }}
        >
          {formData.subTitle}
        </p>
        <h4>
          Bắt Buộc: (<label style={{ color: "red" }}>*</label>)
        </h4>
      </Card>
    );
  }

  getImageFromCamera(data) {
    let images = [...this.state.imageQuestion];
    images.push({
      index: images.length + 1,
      questionId: data.questionId,
      imageData: data.imageData,
    });
    this.setState({ imageQuestion: images });
  }
  handleDeleteImage(questionId, item, type) {
    if (type === "images") {
      let result = this.state.formData;
      let formData = JSON.parse(this.state.formData.formData);
      let indexQuestion = formData.findIndex(
        (item) => item.questionId === questionId
      );
      let anwser = formData[indexQuestion].anwserItem[0].anwserValue;
      formData[indexQuestion].anwserItem[0].anwserValue = JSON.stringify(
        JSON.parse(anwser).filter((element) => element !== item)
      );
      result.formData = JSON.stringify(formData);
      this.setState({ formData: result });
    } else {
      let images = [...this.state.imageQuestion];
      let result = images.filter((element) => element.index !== item);
      this.setState({ imageQuestion: result });
    }
  }
  handleOnChangeEmployee(e) {
    this.setState({
      selectedEmployee: e.value,
      visibleEmployee: false,
      employeeId: e.value,
      shopId: null,
    });
    if (e.value.Id > 0) {
      let data = {
        accountId: this.props.spiralForm.accountId,
        employeeId: e.value.Id,
      };
      // this.handleGetResult(e.value.Id);
      this.props.SpiralFormController.GetShops(data).then(() => {
        this.setState({ shops: this.props.shops });
      });
    }
  }
  handleOnChange(question, e, answer) {
    try {
      // ?
      let checkList = this.state.checkList;
      let result = this.state.formData;
      let formData = JSON.parse(this.state.formData.formData);
      let indexQuestion = formData.findIndex(
        (item) => item.questionId === question.questionId
      );
      let questionResult = question;
      let answerType = question.anwserItem[0].anwserType,
        questionType = question.questionType;
      let endQuestion = 0;
      let goTo = 0;
      let maxGoTo = 0;

      switch (answerType) {
        case 1:
        case 2: // text area
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          questionResult.anwserItem[0].anwserValue = e.target.value;
          break;
        case 3: // number
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          // if (questionResult.max !== null && questionResult.max !== undefined)
          //     if (e.target.value > questionResult.max) {
          //         this.showError("Giá trị tối đa là: " + questionResult.max);
          //         return;
          //     }
          questionResult.anwserItem[0].anwserValue = e.target.value.replaceAll(
            ",",
            ""
          );
          break;
        case 4: // checkbox
          if (answer) {
            let index = question.anwserItem.findIndex(
              (item) => item.id === answer.id
            );
            questionResult.anwserItem[index].ortherValue = e.target.value;
          } else {
            let index = question.anwserItem.findIndex(
              (item) => item.id === e.value.id
            );
            questionResult.anwserItem[index].anwserValue = e.target.checked
              ? true
              : "";
            if (!e.target.checked)
              questionResult.anwserItem[index].ortherValue = "";

            let goTo = question.questionId + 1;
            let maxGoTo = question.questionId + 1;

            question.anwserItem.forEach((element) => {
              maxGoTo = element.nextStep > maxGoTo ? element.nextStep : maxGoTo;

              if (element.anwserValue) {
                if (element.nextStep > 0) goTo = element.nextStep;
              }
            });
            if (question.questionId < checkList.length)
              //for (let index = question.questionId; index < (maxGoTo === 9999 ? checkList.length : maxGoTo); index++) {
              for (
                let index = question.questionId;
                index < checkList.length;
                index++
              ) {
                if (checkList[index].questionId < goTo)
                  checkList[index].isShow = false;
                else checkList[index].isShow = true;
              }
          }
          break;
        case 5: // radio
          if (answer) {
            let index = question.anwserItem.findIndex(
              (item) => item.id === answer.id
            );
            questionResult.anwserItem[index].ortherValue = e.target.value;
          } else {
            goTo = question.questionId;
            maxGoTo = question.questionId;

            // goTo = question.questionId + 1;
            // maxGoTo = question.questionId + 1;
            console.log(goTo);
            console.log(maxGoTo);

            question.anwserItem.forEach((element) => {
              maxGoTo = element.nextStep > maxGoTo ? element.nextStep : maxGoTo;
              if (element.id === e.value.id) {
                let index = question.anwserItem.findIndex(
                  (item) => item.id === element.id
                );
                questionResult.anwserItem[index].anwserValue = true;
                if (element.nextStep > 0 && element.nextStep < 9999) {
                  goTo = element.nextStep;
                  checkList[question.questionId - 1].isBreak = false;
                }
                if (element.nextStep === 9999) {
                  endQuestion = question.questionId;
                }
              } else {
                let index = question.anwserItem.findIndex(
                  (item) => item.id === element.id
                );
                questionResult.anwserItem[index].anwserValue = "";
              }
            });

            if (question.questionId < maxGoTo) {
              let maxIndex = maxGoTo === 9999 ? checkList.length : maxGoTo;
              for (
                let index = question.questionId;
                index < checkList.length;
                index++
              ) {
                if (checkList[index].questionId < goTo) {
                  checkList[index].isShow = false;
                } else {
                  checkList[index].isShow = true;
                }

                if (
                  endQuestion > 0 &&
                  checkList[index].questionId > endQuestion
                ) {
                  checkList[index].isShow = false;
                }
              }
            }
          }
          break;

        case 6: // date
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          questionResult.anwserItem[0].anwserValue = e.value
            ? moment(e.value).format("YYYY-MM-DD")
            : null;
          break;
        case 7: // images
        case 8: // camera
        case 16: // audio
          const max = question.max;
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          if (e.value === "clear") {
            questionResult.anwserItem[0].anwserValue = "";
            break;
          }
          const image = question.anwserItem[0].anwserValue;
          let imageValue = [];
          if (Number(max) > 0) {
            if (image !== "" && image !== null && e.value !== "") {
              imageValue = JSON.parse(image);
              let count = imageValue.length;
              JSON.parse(e.value).forEach((element) => {
                if (count < Number(max)) imageValue.push(element);
                count++;
              });
              questionResult.anwserItem[0].anwserValue =
                JSON.stringify(imageValue);
            } else {
              let count = 0;
              JSON.parse(e.value).forEach((element) => {
                if (count < Number(max)) imageValue.push(element);
                count++;
              });
              questionResult.anwserItem[0].anwserValue =
                JSON.stringify(imageValue);
            }
          } else {
            if (image !== "" && image !== null && e.value !== "") {
              imageValue = JSON.parse(image);
              JSON.parse(e.value).forEach((element) => {
                imageValue.push(element);
              });
              questionResult.anwserItem[0].anwserValue =
                JSON.stringify(imageValue);
            } else questionResult.anwserItem[0].anwserValue = e.value;
          }
          break;
        case 10:
          // let rowItems = question.anwserItem[0].anwserName.row, columnItems = question.anwserItem[0].anwserName.column;
          let anwserValue = JSON.parse(question.anwserItem[0].anwserValue);
          let id = e.target.id.split("_"),
            colIndex = undefined;
          let rowIndex = anwserValue.findIndex(
            (row) => row.rowId === parseInt(id[0])
          );
          if (rowIndex !== undefined)
            colIndex = anwserValue[rowIndex]?.rowValue.findIndex(
              (col) => col.colId === parseInt(id[1])
            );

          let valueResult = JSON.parse(
            questionResult.anwserItem[0].anwserValue
          );
          switch (questionType) {
            case 101:
              let rowValue = anwserValue[rowIndex].rowValue;
              for (let index = 0; index < rowValue.length; index++) {
                const element = rowValue[index];
                if (element.colId === parseInt(id[1]))
                  valueResult[rowIndex].rowValue[index].colValue = true;
                else valueResult[rowIndex].rowValue[index].colValue = "";
              }
              break;
            case 102:
              valueResult[rowIndex].rowValue[colIndex].colValue = e.target
                .checked
                ? true
                : "";
              break;
            case 103:
              valueResult[rowIndex].rowValue[colIndex].colValue =
                e.target.value;
              break;
            case 104:
              valueResult[rowIndex].rowValue[colIndex].colValue =
                e.target.value.replaceAll(",", "");
              break;
            case 105:
              valueResult[rowIndex].rowValue[colIndex].colValue = e.value
                ? moment(e.value).format("YYYY-MM-DD")
                : null;
              break;
            case 106:
              valueResult[rowIndex].rowValue[colIndex].colValue = e.value;
              break;
            default:
              break;
          }
          questionResult.anwserItem[0].anwserValue =
            JSON.stringify(valueResult);
          break;
        case 11: //address
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          let index = question.anwserItem.findIndex(
            (item) => item.id === answer.id
          );
          if (answer.id === 2) {
            this.setState({
              dataDistrict: e.value?.level2s || [],
              dataTown: [],
            });
            questionResult.anwserItem[2].anwserValue = "";
            questionResult.anwserItem[2].selectedItem = "";
            questionResult.anwserItem[3].anwserValue = "";
            questionResult.anwserItem[3].selectedItem = "";
          } else if (answer.id === 3) {
            this.setState({ dataTown: e.value?.level3s || [] });
            questionResult.anwserItem[3].anwserValue = "";
            questionResult.anwserItem[3].selectedItem = "";
          }
          if (answer.id === 1)
            questionResult.anwserItem[index].anwserValue = e.target?.value;
          else questionResult.anwserItem[index].anwserValue = e.value?.name;
          questionResult.anwserItem[index].selectedItem = e.value;
          break;
        case 12:
        case 13:
          if (question.anwserItem[0].nextStep === 9999) {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = false;
            }
          } else {
            for (
              let index = question.questionId;
              index < checkList.length;
              index++
            ) {
              checkList[index].isShow = true;
            }
          }
          questionResult.anwserItem[0].anwserValue = JSON.stringify(e.value);
          break;
        default:
          break;
      }
      formData[indexQuestion] = questionResult;

      // reset value
      //const questionDefault = JSON.parse(this.state.formDefault.formData);

      for (let index = 0; index < checkList.length; index++) {
        if (checkList[index].isShow === false) {
          let element = formData[index].anwserItem;
          if (formData[index].questionType === 0) {
            for (let i = 0; i < element.length; i++) {
              element[i].anwserValue = "";
            }
          } else {
            let ansValue = JSON.parse(element[0].anwserValue);
            ansValue.forEach((row) => {
              row.rowValue.forEach((col) => {
                col.colValue = "";
              });
            });
            element[0].anwserValue = JSON.stringify(ansValue);
          }
          //formData[index].anwserItem = questionDefault[index].anwserItem;
        }
      }
      let questionEnd = 9999;
      for (let index = 0; index < checkList.length; index++) {
        if (
          checkList[index].isEnd &&
          checkList[index].isShow &&
          questionEnd === 9999
        ) {
          questionEnd = checkList[index].questionId;
        }
        if (checkList[index].questionId > questionEnd) {
          checkList[index].isShow = false;
        }
      }

      result.formData = JSON.stringify(formData);
      this.setState({
        formData: result,
        checkList: checkList,
      });
    } catch (error) {
      console.error(error);
    }
  }

  AnswerInput = (question) => {
    const answers = question.anwserItem[0];
    return (
      <InputText
        id="inputText"
        style={{ width: "100%" }}
        key={question.questionId}
        value={answers.anwserValue === "" ? undefined : answers.anwserValue}
        onChange={(e) => this.handleOnChange(question, e)}
        placeholder="Nhập câu trả lời"
      />
    );
  };
  AnswerInputArea = (question) => {
    const answers = question.anwserItem[0];
    return (
      <InputTextarea
        id="inputText"
        style={{ width: "100%" }}
        key={question.questionId}
        value={answers.anwserValue === "" ? undefined : answers.anwserValue}
        onChange={(e) => this.handleOnChange(question, e)}
        placeholder="Nhập câu trả lời"
        autoResize
      />
    );
  };
  AnswerDate = (question) => {
    const answers = question.anwserItem[0];
    // let result = answers.anwserValue === '' ? undefined : answers.anwserValue;
    let dates = answers.anwserValue ? new Date(answers.anwserValue) : null;
    return (
      <div key={question.questionId}>
        <Calendar
          id="inputDate"
          showIcon
          key={question.questionId}
          value={dates}
          monthNavigator
          yearNavigator
          yearRange="1930:2030"
          onChange={(e) => this.handleOnChange(question, e)}
          maxDate={question.max ? new Date(question.max) : null}
          minDate={question.min ? new Date(question.min) : null}
          placeholder="Chọn ngày"
          dateFormat="yy-mm-dd"
        />
        {/* <label>{result}</label> */}
      </div>
    );
  };
  // numberWithCommas = (x) => {
  //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // }
  commify(value) {
    var chars = value.replace(",", "").split("").reverse();
    var withCommas = [];
    for (var i = 1; i <= chars.length; i++) {
      withCommas.push(chars[i - 1]);
      if (i % 3 === 0 && i !== chars.length) {
        withCommas.push(",");
      }
    }
    var val = withCommas.reverse().join("");
    var reg = /^-?\d*\.?\d*$/;
    let check = value.match(reg);
    if (!check) return "";
    else return val;
  }
  AnswerNumber = (question) => {
    const answers = question.anwserItem[0];
    // return (
    //     <div >
    //         <input type='text' className='p-inputtext p-component'
    //             max={question.max ? question.max : null}
    //             min={question.min ? question.min : null}
    //             id='inputNumber'
    //             style={{ width: '50%' }}
    //             key={question.questionId}
    //             digitGroupSeparator
    //             value={answers.anwserValue === '' ? undefined : answers.anwserValue}
    //             onChange={e => this.handleOnChange(question, e)}
    //             placeholder="Nhập câu trả lời (Number)"
    //         ></input>
    //     </div>
    // )
    return (
      <NumberFormat
        className="p-inputtext p-component"
        style={{ width: "50%" }}
        key={question.questionId}
        thousandSeparator={true}
        value={answers.anwserValue === "" ? undefined : answers.anwserValue}
        onChange={(e) => this.handleOnChange(question, e)}
        placeholder="Nhập câu trả lời (Number)"
      />
    );
  };
  AnswerSelected = (question) => {
    const answers = question.anwserItem.filter((item) => item.id < 100);
    let result = [];
    answers.forEach((ans) => {
      let images = [];
      if (ans?.images?.length > 0) {
        ans.images.forEach((element) => {
          images.push(
            <img
              alt="imageA"
              onClick={(e) => this.handleImage(ans.images, e)}
              style={{ height: 125, marginRight: 5, marginBottom: 5 }}
              src={element.imageURL}
            ></img>
          );
        });
      }
      result.push(
        <>
          <div>
            <div
              key={question.questionId + ans.id}
              className="p-field-radiobutton"
            >
              <RadioButton
                id="radio"
                inputId={question.questionId + ans.anwserName}
                value={ans}
                checked={
                  ans.anwserValue === true || ans.anwserValue === "true"
                    ? true
                    : false
                }
                onChange={(e) => this.handleOnChange(question, e)}
              />
              <label htmlFor={question.questionId + ans.anwserName}>
                {ans.anwserName}
              </label>
            </div>
            {ans.id === 99 && ans.anwserValue && (
              <div>
                <InputText
                  value={ans.ortherValue}
                  onChange={(e) => this.handleOnChange(question, e, ans)}
                />
              </div>
            )}
          </div>
          <div style={{ marginLeft: 25 }}>{images}</div>
        </>
      );
    });
    return result;
  };
  AnswerMultiChoose = (question) => {
    const answers = question.anwserItem.filter((item) => item.id < 100);
    let result = [];
    answers.forEach((ans) => {
      let images = [];
      if (ans?.images?.length > 0) {
        ans.images.forEach((element) => {
          images.push(
            <img
              alt="imageA"
              onClick={(e) => this.handleImage(ans.images, e)}
              style={{ height: 125, marginRight: 5, marginBottom: 5 }}
              src={element.imageURL}
            ></img>
          );
        });
      }
      result.push(
        <>
          <div>
            <div
              key={question.questionId + ans.id}
              className="p-field-checkbox"
            >
              <Checkbox
                id="checkbox"
                value={ans}
                inputId={question.questionId + ans.anwserName}
                checked={
                  ans.anwserValue === true || ans.anwserValue === "true"
                    ? true
                    : false
                }
                onChange={(e) => this.handleOnChange(question, e)}
              />
              <label htmlFor={question.questionId + ans.anwserName}>
                {ans.anwserName}
              </label>
            </div>
            {ans.id === 99 && ans.anwserValue && (
              <div>
                <InputText
                  value={ans.ortherValue}
                  onChange={(e) => this.handleOnChange(question, e, ans)}
                />
              </div>
            )}
          </div>
          <div style={{ marginLeft: 25 }}>{images}</div>
        </>
      );
    });
    return result;
  };
  AnswerAudio = (question) => {
    const answers = question.anwserItem[0].anwserValue;
    let data = {
      value: "",
    };
    let divImages = [];
    if (answers !== "") {
      let images = JSON.parse(answers);
      images.forEach((item) => {
        divImages.push(
          <div key={item} style={{ display: "inline-flex" }}>
            <audio controls>
              <source src={item} />
              Your browser does not support the audio element.
            </audio>
            {/* <Button
              onClick={() =>
                this.handleDeleteImage(question.questionId, item, "images")
              }
              style={{ position: "absolute" }}
              tooltip="Remove"
              icon="pi pi-trash"
              className="p-button-sm p-button-rounded p-button-text p-button-danger"
            /> */}
          </div>
        );
      });
    }
    return (
      <div
        key={question.questionId}
        className="p-grid"
        style={{ minHeight: 98, marginTop: 0 }}
      >
        <div
          key="right"
          className="p-col"
          style={{ marginRight: "5px", border: "1px solid #2196f1" }}
        >
          {divImages}
        </div>
        <div
          key="left"
          className="p-col-fixed"
          style={{ float: "right", width: "50px" }}
        >
          <div key="icon" style={{ float: "right" }}>
            <label
              htmlFor={question.questionId}
              style={{ height: "32px", width: "32px" }}
            >
              <FaFileAudio size={32}></FaFileAudio>
            </label>
            <input
              id={question.questionId}
              key={question.questionId}
              type="file"
              style={{ display: "none" }}
              accept=".m4a, .mp3, .mp4, .wav, .wma, .aac"
              multiple
              onChange={(e) => this.handleUploadAudio(e.target.files, question)}
            />
            <FiDelete
              size={28}
              style={{ marginTop: 10 }}
              display="block"
              onClick={(e) => this.handleOnChange(question, { value: "clear" })}
            >
              {" "}
            </FiDelete>
          </div>
        </div>
      </div>
    );
  };
  AnswerImage = (question) => {
    const answers = question.anwserItem[0].anwserValue;
    let data = {
      value: "",
    };
    let divImages = [];
    if (answers !== "") {
      let images = JSON.parse(answers);
      images.forEach((item) => {
        divImages.push(
          <div key={item} style={{ display: "inline-flex" }}>
            <img
              key={item}
              alt="images"
              style={{ marginRight: 5 }}
              height={70}
              src={item}
            ></img>
            <Button
              onClick={() =>
                this.handleDeleteImage(question.questionId, item, "images")
              }
              style={{ position: "absolute" }}
              tooltip="Remove"
              icon="pi pi-trash"
              className="p-button-sm p-button-rounded p-button-text p-button-danger"
            />
          </div>
        );
      });
    }
    return (
      <div
        key={question.questionId}
        className="p-grid"
        style={{ minHeight: 98, marginTop: 0 }}
      >
        <div
          key="right"
          className="p-col"
          style={{ marginRight: "5px", border: "1px solid #2196f1" }}
        >
          {divImages}
        </div>
        <div
          key="left"
          className="p-col-fixed"
          style={{ float: "right", width: "50px" }}
        >
          <div key="icon" style={{ float: "right" }}>
            <label
              htmlFor={question.questionId}
              style={{ height: "32px", width: "32px" }}
            >
              <IoMdImages size={32}></IoMdImages>
            </label>
            <input
              id={question.questionId}
              key={question.questionId}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={(e) =>
                this.handleUploadImages(e.target.files, question)
              }
            />
            <FiDelete
              size={28}
              style={{ marginTop: 10 }}
              display="block"
              onClick={(e) => this.handleOnChange(question, { value: "clear" })}
            >
              {" "}
            </FiDelete>
          </div>
        </div>
      </div>
    );
  };
  AnswerCamera = (question) => {
    const answers = question.anwserItem[0].anwserValue;
    let data = {
      value: "",
    };
    let divImages = [];
    // if (answers !== "") {
    //     let images = JSON.parse(answers);
    //     images.forEach(item => {
    //         divImages.push(
    //             <div key={item} style={{ display: 'inline-flex' }}>
    //                 <img key={item} alt="images" style={{ marginRight: 5 }} height={70} src={item}></img>
    //                 <i style={{ display: "flex", position: 'absolute', float: 'left', marginTop: 5, marginLeft: 5, color: 'red' }}
    //                     className="pi pi-times" onClick={() => this.handleDeleteImage(question.questionId, item, 'images')} />
    //             </div>
    //         );
    //     });
    // }
    if (this.state.imageQuestion.length > 0) {
      this.state.imageQuestion.forEach((element) => {
        if (element.questionId === question.questionId) {
          divImages.push(
            <div key={element.index} style={{ display: "inline-flex" }}>
              <img
                key={element.index}
                alt="images"
                style={{ marginRight: 5 }}
                height={70}
                src={element.imageData}
              ></img>
              <Button
                onClick={() =>
                  this.handleDeleteImage(
                    question.questionId,
                    element.index,
                    "camera"
                  )
                }
                style={{ position: "absolute" }}
                tooltip="Remove"
                icon="pi pi-trash"
                className="p-button-sm p-button-rounded p-button-text p-button-danger"
              />
            </div>
          );
        }
      });
    }
    return (
      <div
        key={question.questionId}
        className="p-grid"
        style={{ minHeight: 98, marginTop: 0 }}
      >
        <div
          key="right"
          className="p-col"
          style={{ marginRight: "5px", border: "1px solid #2196f1" }}
        >
          {divImages}
        </div>
        <div
          key="left"
          className="p-col-fixed"
          style={{ float: "right", width: "50px" }}
        >
          <div key="icon" style={{ float: "right" }}>
            <FaCamera
              size={32}
              onClick={() =>
                this.setState({ isCamera: true, cameraId: question.questionId })
              }
            ></FaCamera>
          </div>
        </div>
      </div>
    );
  };
  AnswerAddress = (question) => {
    // ?
    return (
      <div style={{ margin: 5 }} className="p-fluid p-formgrid p-grid">
        {question.anwserItem?.map((item, idx) => {
          return (
            <div
              key={idx}
              className="p-field p-col-12 p-md-12"
              style={{ marginBottom: 10 }}
            >
              <label>
                {this.props.language[item.anwserName] || item.anwserName}
              </label>
              {item.id === 1 ? (
                <InputText
                  value={item.anwserValue}
                  onChange={(e) => this.handleOnChange(question, e, item)}
                  placeholder={
                    this.props.language[item.anwserName] || item.anwserName
                  }
                />
              ) : item.id === 2 ? (
                <AutoComplete
                  disabled={false}
                  value={item.selectedItem}
                  suggestions={this.state.filteredProvince || []}
                  forceSelection
                  completeMethod={this.searchProvince}
                  field="name"
                  dropdown
                  onChange={(e) => this.handleOnChange(question, e, item)}
                />
              ) : item.id === 3 ? (
                <AutoComplete
                  disabled={this.state.dataDistrict?.length === 0}
                  value={item.selectedItem}
                  forceSelection
                  suggestions={this.state.filtererDistrict || []}
                  completeMethod={this.searchDistrict}
                  field="name"
                  dropdown
                  onChange={(e) => this.handleOnChange(question, e, item)}
                />
              ) : (
                item.id === 4 && (
                  <AutoComplete
                    disabled={this.state.dataTown?.length === 0}
                    value={item.selectedItem}
                    forceSelection
                    suggestions={this.state.filteredTown || []}
                    completeMethod={this.searchTown}
                    field="name"
                    dropdown
                    onChange={(e) => this.handleOnChange(question, e, item)}
                  />
                )
              )}
            </div>
          );
        })}
      </div>
    );
  };
  AnswerDropdown = (question) => {
    let answerName = JSON.parse(question.anwserItem[0].anwserName),
      options = [],
      answerValue = "";
    answerName.forEach((element) => {
      options.push({ name: element, value: element });
    });
    if (question.anwserItem[0].anwserValue !== "")
      answerValue = JSON.parse(question.anwserItem[0].anwserValue);
    return (
      <div style={{ margin: 5 }} className="p-fluid p-formgrid p-grid">
        <AutoComplete
          id={"questionId_" + question.questionId}
          style={{ width: "100%" }}
          value={answerValue}
          suggestions={options}
          completeMethod={(e) => this.searchDropdown(e, options)}
          field="name"
          onChange={(e) => this.handleOnChange(question, e)}
          dropdown
        />
      </div>
    );
  };
  AnswerMultiSelect = (question) => {
    let answerName = JSON.parse(question.anwserItem[0].anwserName),
      options = [],
      answerValue = "";
    answerName.forEach((element) => {
      options.push({ name: element, value: element });
    });
    if (question.anwserItem[0].anwserValue !== "")
      answerValue = JSON.parse(question.anwserItem[0].anwserValue);
    return (
      <div style={{ margin: 5 }} className="p-fluid p-formgrid p-grid">
        <AutoComplete
          id={"questionId_" + question.questionId}
          style={{ width: "100%" }}
          value={answerValue}
          suggestions={options}
          completeMethod={(e) => this.searchDropdown(e, options)}
          field="name"
          onChange={(e) => this.handleOnChange(question, e)}
          multiple
        />
      </div>
    );
  };
  AnswerGrid = (question) => {
    let result = [];
    const anwserItem = question.anwserItem[0];
    const anwserName = JSON.parse(anwserItem.anwserName);
    const rowItems = anwserName.row,
      columnItems = anwserName.column;
    const anwserValue = JSON.parse(anwserItem.anwserValue);
    let resultHeader = [],
      resultBody = [];

    if (this.state.width > 700) {
      resultHeader.push(<div className="p-col"></div>);
      columnItems.forEach((col) => {
        if (col.colId !== 100)
          resultHeader.push(
            <div className="p-col" style={{ margin: "auto" }}>
              {col.colName}
            </div>
          );
      });
      rowItems.forEach((row) => {
        if (row.rowId !== 100) {
          let rowIndex = anwserValue.findIndex((e) => e.rowId === row.rowId);
          let rowResult = [];
          rowResult.push(
            <div
              className="p-col"
              style={{ textAlign: "left", margin: "auto" }}
            >
              {row.rowName}
            </div>
          );
          for (let col = 0; col < columnItems.length - 1; col++) {
            const element = columnItems[col];
            if (element.colId !== 100) {
              let colIndex = anwserValue[rowIndex].rowValue.findIndex(
                (e) => e.colId === element.colId
              );
              let value = anwserValue[rowIndex].rowValue[colIndex].colValue;
              switch (question.questionType) {
                case 101:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <RadioButton
                        id={row.rowId + "_" + element.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        checked={value === true ? true : false}
                      />
                    </div>
                  );
                  break;
                case 102:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Checkbox
                        id={row.rowId + "_" + element.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        checked={value === true ? true : false}
                      />
                    </div>
                  );
                  break;
                case 103:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <InputText
                        id={row.rowId + "_" + element.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        placeholder="Nhập câu trả lời"
                      />
                    </div>
                  );
                  break;
                case 104:
                  let formatValue = this.commify(value);
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <input
                        type="text"
                        className="p-inputtext p-component"
                        id={row.rowId + "_" + element.colId}
                        style={{ width: "100%" }}
                        pattern="[0-9]*"
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value === "" ? undefined : formatValue}
                        placeholder="Nhập câu trả lời (Number)"
                      ></input>
                    </div>
                  );
                  break;
                case 105:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Calendar
                        id={row.rowId + "_" + element.colId}
                        showIcon
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        monthNavigator
                        yearNavigator
                        yearRange="1930:2030"
                        placeholder="Chọn ngày"
                        dateFormat="yy-mm-dd"
                      />
                    </div>
                  );
                  break;
                case 106:
                  const dropdown = anwserItem.dropdown;
                  if (dropdown === "")
                    rowResult.push(
                      <div
                        className="p-col"
                        style={{ margin: "auto", color: "red" }}
                      >
                        {" "}
                        Câu hỏi setup bị lỗi{" "}
                      </div>
                    );
                  let options = [];
                  dropdown.forEach((element) => {
                    options.push({ name: element, value: element });
                  });

                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Dropdown
                        fluid
                        id={row.rowId + "_" + element.colId}
                        style={{ width: "100%" }}
                        options={options}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        placeholder="Chọn câu trả lời"
                        optionLabel="name"
                        showClear={true}
                      />
                    </div>
                  );
                  break;
                default:
                  break;
              }
            }
          }
          resultBody.push(
            <div
              className="p-grid"
              style={{
                textAlign: "center",
                border: "solid 1px #CCD1E4",
                margin: "2px -8px",
              }}
            >
              {rowResult}
            </div>
          );
        }
      });

      result = (
        <>
          <div className="p-grid" style={{ textAlign: "center" }}>
            {resultHeader}
          </div>
          {resultBody}
        </>
      );
    } else {
      rowItems.forEach((row) => {
        if (row.rowId !== 100) {
          let rowIndex = anwserValue.findIndex((e) => e.rowId === row.rowId);

          resultBody.push(
            <div
              className="p-grid"
              style={{
                textAlign: "left",
                padding: 6,
                margin: "0px -14px",
                backgroundColor: "#2F3A8F",
                color: "#FFF9F9",
              }}
            >
              {row.rowName}
            </div>
          );

          columnItems.forEach((col) => {
            if (col.colId !== 100) {
              let colIndex = anwserValue[rowIndex].rowValue.findIndex(
                (e) => e.colId === col.colId
              );
              let value = anwserValue[rowIndex].rowValue[colIndex].colValue;
              let rowResult = [];
              //rowResult.push(<div className='p-col' style={{ margin: 'auto' }}>{col.colName}</div>);

              switch (question.questionType) {
                case 101:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <RadioButton
                        id={row.rowId + "_" + col.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        style={{ float: "right" }}
                        checked={value === true ? true : false}
                      />
                    </div>
                  );
                  break;
                case 102:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Checkbox
                        id={row.rowId + "_" + col.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        style={{ float: "right" }}
                        checked={value === true ? true : false}
                      />
                    </div>
                  );
                  break;
                case 103:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <InputText
                        id={row.rowId + "_" + col.colId}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        placeholder="Nhập câu trả lời"
                      />
                    </div>
                  );
                  break;
                case 104:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <input
                        type="text"
                        className="p-inputtext p-component"
                        id={row.rowId + "_" + col.colId}
                        style={{ width: "100%" }}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        digitGroupSeparator
                        placeholder="Nhập câu trả lời (Number)"
                      ></input>
                    </div>
                  );
                  break;
                case 105:
                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Calendar
                        id={row.rowId + "_" + col.colId}
                        showIcon
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        monthNavigator
                        yearNavigator
                        yearRange="1930:2030"
                        placeholder="Chọn ngày"
                        dateFormat="yy-mm-dd"
                      />
                    </div>
                  );
                  break;
                case 106:
                  const dropdown = anwserItem.dropdown;
                  if (dropdown === "")
                    rowResult.push(
                      <div
                        className="p-col"
                        style={{ margin: "auto", color: "red" }}
                      >
                        {" "}
                        Câu hỏi setup bị lỗi{" "}
                      </div>
                    );
                  let options = [];
                  dropdown.forEach((element) => {
                    options.push({ name: element, value: element });
                  });

                  rowResult.push(
                    <div className="p-col" style={{ margin: "auto" }}>
                      <Dropdown
                        fluid
                        id={row.rowId + "_" + col.colId}
                        style={{ width: "100%" }}
                        options={options}
                        onChange={(e) => this.handleOnChange(question, e)}
                        value={value}
                        placeholder="Chọn câu trả lời"
                        optionLabel="name"
                        showClear={true}
                      />
                    </div>
                  );
                  break;
                default:
                  break;
              }

              resultBody.push(
                <div className="p-grid" style={{ textAlign: "left" }}>
                  <div className="p-col" style={{ margin: "auto" }}>
                    {col.colName}
                  </div>
                  {rowResult}
                </div>
              );
            }
          });
        }
      });
      result = resultBody;
    }

    return result;
  };
  handleUploadAudio(files, question) {
    let value = [],
      data = {
        value: "",
      };
    if (files.length > 0) {
      this.props.SpiralFormController.UploadAudio(files).then(() => {
        if (this.props.images.length > 0) {
          this.props.images.forEach((item) => {
            if (item.message === "Successful") value.push(item.fileUrl);
          });
          data.value = JSON.stringify(value);
          this.handleOnChange(question, data);
        }
      });
    }
  }
  handleUploadImages(files, question) {
    let value = [],
      data = {
        value: "",
      };
    if (files.length > 0) {
      this.props.SpiralFormController.UploadImages(files).then(() => {
        if (this.props.images.length > 0) {
          this.props.images.forEach((item) => {
            if (item.message === "Successful") value.push(item.fileUrl);
          });
          data.value = JSON.stringify(value);
          this.handleOnChange(question, data);
        }
      });
    }
  }
  handleOnSubmit() {
    let dataResult = this.state.formData;
    let formData = JSON.parse(this.state.formData.formData);
    let isCheck = true;
    if (formData.length > 0) {
      formData.forEach((question) => {
        let noAnswer = question.anwserItem.filter(
          (item) => item.id < 100
        ).length;
        let questionEnd = 99999;
        let count = 0;
        let check = false;
        let required = question.required;
        // if (question.isEnd && required) questionEnd = question.questionId;

        // if (question.questionId <= questionEnd)
        question.anwserItem.forEach((answers) => {
          let isCheckItem = this.state.checkList.find(
            (item) => item.questionId === question.questionId
          );
          //if (isCheckItem.isEnd) questionEnd = isCheckItem.questionId;

          if (
            answers.id < 100 &&
            isCheckItem.isShow &&
            required &&
            question.questionId <= questionEnd
          ) {
            switch (answers.anwserType) {
              case 3:
                let min = parseFloat(question.min),
                  max = parseFloat(question.max);
                if (!answers.anwserValue) {
                  this.showError(
                    "Chưa trả lời câu hỏi: " + question.questionName
                  );
                  isCheck = false;
                  return;
                }
                const numValue = parseFloat(answers.anwserValue);
                if (numValue && min && (numValue > max || numValue < min)) {
                  this.showError(
                    `${question.questionName}: phải thuộc khoảng ${min} đến ${max}`
                  );
                  isCheck = false;
                  return;
                }
                if (!max && numValue < min) {
                  this.showError(
                    `${question.questionName}: nhập thấp nhất là ${min} `
                  );
                  isCheck = false;
                  return;
                }
                break;
              case 4:
              case 5:
                if (answers.anwserValue) {
                  if (answers.id === 100 && !answers.ortherValue) {
                    this.showError(
                      "Chưa trả lời câu hỏi: " + question.questionName
                    );
                    isCheck = false;
                    return;
                  } else check = true;
                } else {
                  count++;
                  if (noAnswer === count && !check) {
                    this.showError(
                      "Chưa trả lời câu hỏi: " + question.questionName
                    );
                    isCheck = false;
                    return;
                  }
                }
                break;
              // case 5:
              //     if (answers.anwserValue) {
              //         if (answers.id === 99 && !answers.ortherValue) {
              //             this.showError("Chưa trả lời câu hỏi: " + question.questionName);
              //             isCheck = false;
              //             return;
              //         }
              //         else
              //             check = true;
              //     }
              //     else {
              //         count++;
              //         if (noAnswer === count && !check) {
              //             this.showError("Chưa trả lời câu hỏi: " + question.questionName);
              //             isCheck = false;
              //             return;
              //         }
              //     }
              //     break;
              case 6:
                if (question.min && question.max && answers.anwserValue) {
                  let minDate = +moment(question.min).format("YYYYMMDD");
                  let maxDate = +moment(question.max).format("YYYYMMDD");
                  let answerDate = +moment(answers.anwserValue).format(
                    "YYYYMMDD"
                  );
                  if (
                    answers.anwserValue &&
                    (answerDate > maxDate || answerDate < minDate)
                  ) {
                    this.showError(
                      `${question.questionName}: phải thuộc khoảng ${min} đến ${max}`
                    );
                    isCheck = false;
                    return;
                  }
                }
                if (!answers.anwserValue) {
                  this.showError(
                    "Chưa trả lời câu hỏi: " + question.questionName
                  );
                  isCheck = false;
                  return;
                }
                break;
              case 7:
              case 8:
                let imageCamera = [...this.state.imageQuestion];
                if (imageCamera.length > 0) {
                  let result = imageCamera.filter(
                    (item) => item.questionId === question.questionId
                  );
                  if (result.length > 0)
                    answers.anwserValue = JSON.stringify(result);
                }
                if (
                  answers.anwserValue === "" ||
                  answers.anwserValue === "[]"
                ) {
                  isCheck = false;
                  this.showError(
                    "Chưa trả lời câu hỏi: " + question.questionName
                  );
                  return;
                } else if (Number(question.min) > 0) {
                  const value = JSON.parse(answers.anwserValue).length;
                  if (value < Number(question.min)) {
                    isCheck = false;
                    this.showError(
                      "Câu hỏi: " +
                        question.questionName +
                        ". Yêu cầu số lượng hình tối thiểu là: " +
                        question.min
                    );
                    return;
                  }
                }
                break;
              case 10:
                let anwserValue = JSON.parse(
                  question.anwserItem[0].anwserValue
                );
                count = 0;
                anwserValue.forEach((row) => {
                  row.rowValue.forEach((col) => {
                    if (col.colValue === true || col.colValue !== "") {
                      count++;
                    }
                  });
                });
                if (count === 0) {
                  this.showError(
                    "Chưa trả lời câu hỏi: " + question.questionName
                  );
                  isCheck = false;
                  return;
                }
                break;
              default:
                if (answers.anwserValue === "") {
                  isCheck = false;
                  this.showError(
                    "Chưa trả lời câu hỏi: " + question.questionName
                  );
                  return;
                }
            }
          } else {
            if (
              answers.anwserType === 3 &&
              question.min &&
              question.max &&
              answers.anwserValue
            ) {
              let min = parseFloat(question.min),
                max = parseFloat(question.max);
              if (answers.anwserValue > max || answers.anwserValue < min) {
                this.showError(
                  `${question.questionName}: phải thuộc khoảng ${min} đến ${max}`
                );
                isCheck = false;
                return;
              }
              if (!max && answers.anwserValue < min) {
                this.showError(
                  `${question.questionName}: nhập thấp nhất là ${min} `
                );
                isCheck = false;
                return;
              }
            }

            if (
              answers.anwserType === 6 &&
              question.min &&
              question.max &&
              answers.anwserValue
            ) {
              let minDate = +moment(question.min).format("YYYYMMDD");
              let maxDate = +moment(question.max).format("YYYYMMDD");
              let answerDate = +moment(answers.anwserValue).format("YYYYMMDD");
              if (answerDate > maxDate || answerDate < minDate) {
                this.showError(
                  `${question.questionName}: phải thuộc khoảng ${minDate} đến ${maxDate}`
                );
                isCheck = false;
                return;
              }
            }
          }
        });
      });
    }
    if (this.state.formData.usedEmployees === true) {
      if (
        this.state.formData.usedEmployees === true &&
        this.state.employeeId !== null
      ) {
        if (this.state.employeeId.Id > 0) {
          dataResult.employeeId = this.state.employeeId.Id;
        } else {
          isCheck = false;
          this.showError("Bạn chưa chọn nhân viên");
          return;
        }
      } else {
        isCheck = false;
        this.showError("Bạn chưa chọn nhân viên");
        return;
      }
    }
    if (this.state.formData.usedStores === true) {
      if (
        this.state.formData.usedStores === true &&
        this.state.shopId !== null
      ) {
        if (this.state.shopId.shopId > 0) {
          dataResult.shopId = this.state.shopId.shopId;
        } else {
          isCheck = false;
          this.showError("Bạn chưa chọn cửa hàng");
          return;
        }
      } else {
        isCheck = false;
        this.showError("Bạn chưa chọn cửa hàng");
        return;
      }
    }
    if (isCheck) {
      // console.log(formData);
      // console.log(JSON.stringify(formData));
      dataResult.formData = JSON.stringify(formData);
      this.showLoading();
      let data = {
        dataByDomain: dataByDomain,
        formData: dataResult,
      };
      // formData.forEach(element => {
      //     this.showSuccess(element.anwserItem[0].anwserValue);
      // });
      this.props.SpiralFormController.InsertResult(data).then(() => {
        if (this.props.result !== undefined) {
          if (this.props.result.result === 1) {
            this.setState({
              sended: true,
              resultId: parseInt(this.props.result.error),
            });
            this.showSuccess(this.props.result.messenger);
            this.clearLD();
            // this.handleGetResult();
          } else {
            this.showError(this.props.result.messenger);
            this.clearLD();
          }
        } else this.showError("Lỗi");
      });
    } else {
      this.clearLD();
    }
  }
  renderQuestion(item) {
    let uiAnswer = [],
      uiHeader = [],
      uiMin = [],
      labelMin = "Giá trị",
      ansType = 0;
    if (item.anwserItem.length === 0)
      uiAnswer.push(<span>Không có câu trả lời</span>);
    else {
      switch (item.anwserItem[0].anwserType) {
        case 1:
          uiAnswer.push(this.AnswerInput(item));
          break;
        case 2:
          uiAnswer.push(this.AnswerInputArea(item));
          break;
        case 3:
          uiAnswer.push(this.AnswerNumber(item));
          break;
        case 4:
          uiAnswer.push(this.AnswerMultiChoose(item));
          break;
        case 5:
          uiAnswer.push(this.AnswerSelected(item));
          break;
        case 6:
          uiAnswer.push(this.AnswerDate(item));
          break;
        case 16:
          uiAnswer.push(this.AnswerAudio(item));
          break;
        case 7:
          labelMin = "Số lượng hình";
          uiAnswer.push(this.AnswerImage(item));
          break;
        case 8:
          labelMin = "Số lượng hình";
          uiAnswer.push(this.AnswerCamera(item));
          break;
        case 10:
          uiAnswer.push(this.AnswerGrid(item));
          break;
        case 11:
          uiAnswer.push(this.AnswerAddress(item));
          break;
        case 12:
          uiAnswer.push(this.AnswerDropdown(item));
          break;
        case 13:
          uiAnswer.push(this.AnswerMultiSelect(item));
          break;
        default:
          uiAnswer.push(<span>Không có loại câu hỏi này.</span>);
          break;
      }
    }
    if (item.required) {
      uiHeader.push(
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.3" }}>
          {" "}
          <label>
            {item.questionName} <label style={{ color: "red" }}>*</label>
          </label>{" "}
        </div>
      );
    } else
      uiHeader.push(
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.3" }}>
          <label>{item.questionName}</label>
        </div>
      );

    if (item.min !== null && item.min !== "")
      uiMin.push(
        <i>
          {labelMin} tối thiểu:{" "}
          {item.anwserItem[0].anwserType === 3
            ? formatCurrency(item.min)
            : item.min}
        </i>
      );
    if (
      item.max !== null &&
      item.max !== "" &&
      item.min !== null &&
      item.min !== ""
    )
      uiMin.push(<i> - </i>);
    if (item.max !== null && item.max !== "")
      uiMin.push(
        <i>
          {labelMin} tối đa:{" "}
          {item.anwserItem[0].anwserType === 3
            ? formatCurrency(item.max)
            : item.max}
        </i>
      );
    if (uiMin.length > 0)
      uiHeader.push(
        <div style={{ fontWeight: 400, fontSize: 14 }}>( {uiMin} )</div>
      );

    if (item.images?.length > 0) {
      let images = [];
      item.images.forEach((element) => {
        images.push(
          <img
            alt="imageQ"
            onClick={(e) => this.handleImage(item.images, e)}
            style={{ height: 125, marginRight: 5, marginBottom: 5 }}
            src={element.imageURL}
          ></img>
        );
      });
      uiHeader.push(<div style={{ marginTop: 10 }}>{images}</div>);
    }
    return (
      <Panel key={item.indexRow} style={{ marginBottom: 5 }} header={uiHeader}>
        {uiAnswer}
      </Panel>
    );
  }
  handleImage = (image, event) => {
    let results = [],
      count = 1,
      total = image.length;
    let index = image.findIndex(
      (e) =>
        e.imageURL === event.target.currentSrc.replace(event.target.baseURI, "")
    );

    image.forEach((element) => {
      results.push({
        url: element.imageURL,
        title: "Image " + count + "/" + total,
      });
      count++;
    });
    this.setState({ itemImage: results, isOpen: true, indexActive: index });
  };
  renderBody() {
    let result = [];
    if (this.state.formData !== "") {
      const formData = JSON.parse(this.state.formData.formData);
      if (formData.length > 0) {
        for (let index = 0; index < formData.length; index++) {
          const element = formData[index];
          const isCheck = this.state.checkList.find(
            (item) => item.questionId === element.questionId
          );

          if (isCheck.isShow) {
            const isEnd = this.state.checkList.find(
              (item) => item.isShow === true && (item.isEnd || item.isBreak)
            );
            if (isEnd !== undefined) {
              if (
                element.anwserItem.length > 0 &&
                element.questionId <= isEnd?.questionId
              ) {
                result.push(this.renderQuestion(element));
              }
            } else if (element.anwserItem.length > 0)
              result.push(this.renderQuestion(element));
          }
        }
      }
    } else {
      result = (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <ProgressSpinner style={{ width: "100px", height: "100px" }} />
        </div>
      );
    }
    return result;
  }
  searchEmployee(event) {
    setTimeout(() => {
      let filteredEmployee;
      if (!event.query.trim().length) {
        filteredEmployee = [...this.state.employees];
      } else {
        filteredEmployee = this.state.employees.filter((e) => {
          return e.FullName.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      this.setState({ filteredEmployee });
    }, 100);
  }
  searchShop(event) {
    setTimeout(() => {
      let filteredShop;
      if (!event.query.trim().length) {
        filteredShop = [...this.state.shops];
      } else {
        filteredShop = this.state.shops.filter((e) => {
          return e.shopNameVN.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      this.setState({ filteredShop });
    }, 100);
  }
  searchDropdown(event, options) {
    setTimeout(() => {
      let filteredOption;
      if (!event.query.trim().length) {
        filteredOption = options;
      } else {
        filteredOption = options.filter((e) => {
          return e.name.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      this.setState({ [event.id]: filteredOption });
    }, 100);
  }
  searchProvince = (event) => {
    try {
      setTimeout(() => {
        let filteredProvince;
        if (!event.query.trim().length) {
          filteredProvince = [...dataProvince];
        } else {
          filteredProvince = dataProvince.filter((e) => {
            return e.name?.toLowerCase()?.includes(event.query?.toLowerCase());
          });
        }
        this.setState({ filteredProvince });
      }, 100);
    } catch (e) {}
  };
  searchDistrict = (event) => {
    try {
      setTimeout(() => {
        let filtererDistrict;
        if (!event.query.trim().length) {
          filtererDistrict = [...this.state.dataDistrict];
        } else {
          filtererDistrict = this.state.dataDistrict.filter((e) => {
            return e.name?.toLowerCase()?.includes(event.query?.toLowerCase());
          });
        }
        this.setState({ filtererDistrict });
      }, 100);
    } catch (e) {}
  };
  searchTown = (event) => {
    try {
      setTimeout(() => {
        let filteredTown;
        if (!event.query.trim().length) {
          filteredTown = [...this.state.dataTown];
        } else {
          filteredTown = this.state.dataTown.filter((e) => {
            return e.name?.toLowerCase()?.includes(event.query?.toLowerCase());
          });
        }
        this.setState({ filteredTown });
      }, 100);
    } catch (e) {}
  };
  renderUserInfo() {
    const spiralForm = this.props.spiralForm;

    let divEmployees = [],
      divShops = [];

    let labelShop = "Chọn 1 cửa hàng";
    if (
      this.state.selectedShop !== null &&
      this.state.selectedShop !== undefined
    ) {
      labelShop = this.state.selectedShop.shopNameVN;
    }
    let labelEmployee = "Chọn 1 nhân viên";
    if (
      this.state.selectedEmployee !== null &&
      this.state.selectedEmployee !== undefined
    ) {
      labelEmployee = this.state.selectedEmployee.FullName;
    }

    if (spiralForm.usedEmployees && spiralForm.employees.length > 0) {
      divEmployees.push(
        <div className="p-col-12 p-md-6">
          <label>Tên nhân viên</label>
          <Button
            label={labelEmployee}
            style={{ width: "100%", fontWeight: 600, fontSize: 14 }}
            className="p-button-success"
            onClick={() => this.setState({ visibleEmployee: true })}
          />
        </div>
      );
    }
    if (spiralForm.usedStores && this.state.shops.length > 0) {
      divShops.push(
        <div className="p-col-12 p-md-6">
          <label>Tên cửa hàng</label>
          <Button
            label={labelShop}
            style={{ width: "100%", fontWeight: 600, fontSize: 14 }}
            className="p-button-warning"
            onClick={() => this.setState({ visibleShop: true })}
          />
        </div>
      );
    }

    if (spiralForm.usedEmployees || spiralForm.usedStores) {
      let header = "";
      if (spiralForm.usedEmployees && spiralForm.usedStores)
        header = "Thông tin nhân viên & cửa hàng";
      else if (spiralForm.usedEmployees && !spiralForm.usedStores)
        header = "Thông tin nhân viên";
      else if (!spiralForm.usedEmployees && spiralForm.usedStores)
        header = "Thông tin cửa hàng";
      return (
        <Panel key={spiralForm.id} style={{ marginBottom: 5 }} header={header}>
          <div className="p-grid">
            {divEmployees}
            {divShops}
          </div>
        </Panel>
      );
    }
    return null;
  }
  renderExpired() {
    return (
      <div style={{ marginTop: 5, marginBottom: 10 }} key="expired">
        <img alt="expired" style={{ width: "100%" }} src={expired}></img>
      </div>
    );
  }
  renderFooter() {
    return (
      <div
        className={this.state.width > 700 ? "p-col-8" : "p-col-12"}
        style={{ position: "fixed", bottom: -8 }}
      >
        {/* <Panel key='footer' style={{ background: "aliceblue",height:55 }}> */}
        <div
          key="divFooter"
          style={{
            background: "#e4f0fb",
            height: 55,
            borderRadius: 3,
            border: "solid 1px #677777",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            label="Gửi"
            style={{ width: 100, fontWeight: 600, fontSize: 14 }}
            icon="pi pi-cloud-upload"
            className="p-button-info"
            onClick={this.handleOnSubmit}
          />
        </div>
        {/* </Panel> */}
      </div>
    );
  }
  render() {
    let header = this.renderHeader(),
      expired = this.renderExpired();
    if (this.state.expired === 1) {
      return (
        <div key="container" className="p-d-flex p-jc-center">
          <div
            className={this.state.width > 700 ? "p-col-8" : "p-col-12"}
            style={{ marginBottom: 50 }}
          >
            {expired}
            {header}
          </div>
        </div>
      );
    }
    const formData = this.state.formData;
    let body = this.renderBody(),
      footer = this.renderFooter(),
      banner = this.renderBanner(),
      title = this.renderTitle(),
      userInfo = this.renderUserInfo();
    if (formData.id === 0) {
      return (
        <div>
          <Toast ref={(el) => (this.toast = el)} />
          <h5>{formData.title}</h5>
        </div>
      );
    }
    return (
      <div key="container" className="p-d-flex p-jc-center">
        <Toast ref={(el) => (this.toast = el)} />
        <Toast ref={(el) => (this.toastLD = el)} position="top-center" />
        <Sidebar
          visible={this.state.visibleEmployee}
          modal={false}
          position="bottom"
          style={{ height: "70%" }}
          onHide={() => this.setState({ visibleEmployee: false })}
        >
          <DataTable
            value={this.state.employees}
            selectionMode="single"
            selection={this.state.selectedEmployee}
            //onSelectionChange={e => this.setState({ selectedEmployee: e.value, visibleEmployee: false,employeeId: e.value  })}
            onSelectionChange={(e) => this.handleOnChangeEmployee(e)}
            dataKey="Id"
            header={null}
            esponsiveLayout="scroll"
          >
            <Column field="FullName" filter filterMatchMode="contains"></Column>
          </DataTable>
        </Sidebar>
        <Sidebar
          visible={this.state.visibleShop}
          modal={false}
          position="bottom"
          style={{ height: "70%" }}
          onHide={() => this.setState({ visibleShop: false })}
        >
          <DataTable
            value={this.state.shops}
            selectionMode="single"
            selection={this.state.selectedShop}
            onSelectionChange={(e) =>
              this.setState({
                selectedShop: e.value,
                visibleShop: false,
                shopId: e.value,
              })
            }
            dataKey="shopId"
            header={null}
            esponsiveLayout="scroll"
          >
            <Column
              field="shopNameVN"
              filter
              filterMatchMode="contains"
            ></Column>
          </DataTable>
        </Sidebar>
        <div
          className={this.state.width > 700 ? "p-col-8" : "p-col-12"}
          style={{ marginBottom: 50 }}
        >
          {banner}
          {formData === 0 || formData === "" ? null : title}
          {formData === 0 || formData === "" ? null : userInfo}
          {body}
          {header}
        </div>
        {this.state.sended ||
        formData === 0 ||
        formData === "" ||
        this.props.mode === "view"
          ? null
          : footer}
        <Dialog
          blockScroll={true}
          visible={this.state.isCamera}
          showHeader={false}
          maximized={true}
          contentStyle={{ padding: 0 }}
          style={{ width: "100%", height: "100%" }}
          onHide={() => this.setState({ isCamera: false })}
        >
          {/* <WebcamCapture parentMethod={this.onHideCamera} saveImage={this.getImageFromCamera} questionId={this.state.cameraId}></WebcamCapture> */}
        </Dialog>
        {this.state.isOpen ? (
          <Lightbox
            images={this.state.itemImage}
            style={{ width: "100% !important" }}
            onClose={() => this.setState({ isOpen: false })}
            startIndex={this.state.indexActive}
            title="Image Title"
          />
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    spiralForm: state.spiralform.spiralForm,
    images: state.spiralform.images,
    language: state.languageList.language,
    result: state.spiralform.result,
    shops: state.spiralform.shops,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(FormResult);
