import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Search from "../Controls/Search";
import { bindActionCreators } from "redux";
import { AttendantCreateAction } from "../../store/AttendantController";
import { actionCreatorsShop } from "../../store/ShopController";
import { connect } from "react-redux";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Carousel } from "primereact/carousel";
import {
  HelpPermission,
  getImageUpdateName,
  download,
  getLogin,
} from "../../Utils/Helpler";
import AttendantDialog from "./AttendantDialog";
import AttendantSideBar from "./AttendantSideBar";
import EditorTools from "../Controls/Tools/ImageEditor";
import moment from "moment";
import "../../css/highlight.css";
import Page403 from "../ErrorRoute/page403";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Card } from "primereact/card";

class Attendant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImage: false,
      rowSelected: {},

      datas: [],
      inputValues: {},
      rowData: {},

      displayDialogInsert: false,
      displayDialogUpdate: false,
      displayDialogDeleteAttendant: false,
      displayDialogDeleteItem: false,
      displayImageEditor: false,
      checkKpiDialog: false,
      employeeValue: 0,
      shopId: 0,
      dataCheckKPI: [],

      emptyImage: "https://i.ibb.co/qCQ6RZW/c23498b124bf.png",

      payload: {},
      permission: {},
      isLoading: false,
      shiftOption: [],
      accId: null,
    };
    this.dateTemplate = this.dateTemplate.bind(this);
    this.imageTemplate = this.imageTemplate.bind(this);
    this.distanceTemplate = this.distanceTemplate.bind(this);
    this.actionButtons = this.actionButtons.bind(this);
    this.handleDialogAttendant = this.handleDialogAttendant.bind(this);
    this.handleInsertAttendant = this.handleInsertAttendant.bind(this);
    this.handleUpdateAttendant = this.handleUpdateAttendant.bind(this);
    this.handleDeleteAttendant = this.handleDeleteAttendant.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.renderFooterDialog = this.renderFooterDialog.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);

    this.handleDialogConfirmAttendant =
      this.handleDialogConfirmAttendant.bind(this);
    this.handleDisplayImageEditor = this.handleDisplayImageEditor.bind(this);
    this.pageId = 1018;
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  Search = async (data) => {
    await this.setState({ datas: [] });
    await this.props.AttendantController.GetAttendants(data, data.accId);
    await this.Alert(`Results ${this.props.attendants.length}`, "info");
    await this.setState({ datas: this.props.attendants });
  };
  // Export
  Export = async (data) => {
    await this.props.AttendantController.ReportAttendant(data, data.accId);
    const result = this.props.reportAttendant;
    if (result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
  };
  imageTemplate(rowData) {
    let checkIn = null,
      checkOut = null,
      checkIn1 = null,
      checkOut1 = null,
      checkIn2 = null,
      checkOut2 = null;
    if (rowData.date1 !== null) {
      checkIn = (
        <div>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              tooltip={rowData.noteIn}
              label={rowData.date1}
              className={
                rowData.timeInLate > 5
                  ? "p-button-text p-button-danger"
                  : "p-button-text p-button-secondary"
              }
            />
          </div>
          <div>
            <img src={rowData.image1} alt="Check In" width="60" />
          </div>
        </div>
      );
    } else if (rowData.date2 !== null && rowData.date1 === null) {
      checkIn = (
        <div>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              tooltip={rowData.noteIn}
              label={rowData.date1}
              className={
                rowData.timeInLate > 5
                  ? "p-button-text p-button-danger"
                  : "p-button-text p-button-secondary"
              }
            />
          </div>
          <div>
            <img src="/images/no_in.png" alt="Check In" width="60" />
          </div>
        </div>
      );
    }
    if (rowData.date2 !== null) {
      checkOut = (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              tooltip={rowData.noteOut || ""}
              label={rowData.date2}
              className={
                rowData.timeOutLate > 5
                  ? "p-button-text p-button-danger"
                  : "p-button-text p-button-secondary"
              }
            />
          </div>
          <div>
            <img src={rowData.image2} alt="Check Out" width="60" />
          </div>
        </div>
      );
    }
    if (rowData.date3 !== null && rowData.date3 !== undefined) {
      checkIn1 = (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              label={rowData.date3}
              className="p-button-text p-button-secondary"
            />
          </div>
          <div>
            <img src={rowData.image3} alt="Check In 2" width="60" />
          </div>
        </div>
      );
    }
    if (rowData.date4 !== null && rowData.date4 !== undefined) {
      checkOut1 = (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              tooltip={rowData.noteOut}
              label={rowData.date4}
              className={
                rowData.timeOutLate > 5
                  ? "p-button-text p-button-danger"
                  : "p-button-text p-button-secondary"
              }
            />
          </div>
          <div>
            <img src={rowData.image4} alt="Check Out 2" width="60" />
          </div>
        </div>
      );
    }
    if (
      rowData.date5 !== null &&
      rowData.date5 !== undefined &&
      getLogin().accountName === "MARICO MT"
    ) {
      checkIn2 = (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              label={rowData.date5}
              className="p-button-text p-button-secondary"
            />
          </div>
          <div>
            <img src={rowData.image5} alt="Check In 2" width="60" />
          </div>
        </div>
      );
    }
    if (
      rowData.date6 !== null &&
      rowData.date6 !== undefined &&
      getLogin().accountName === "MARICO MT"
    ) {
      checkOut2 = (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <Button
              style={{ padding: "0px 8px", fontWeight: 700 }}
              tooltip={rowData.noteOut}
              label={rowData.date6}
              className={
                rowData.timeOutLate > 5
                  ? "p-button-text p-button-danger"
                  : "p-button-text p-button-secondary"
              }
            />
          </div>
          <div>
            <img src={rowData.image6} alt="Check Out 2" width="60" />
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
        style={{ display: "inline-flex", float: "left" }}
      >
        {checkIn}
        {checkOut}
        {checkIn1} {checkOut1}
        {checkIn2} {checkOut2}
      </div>
    );
  }
  distanceTemplate(rowData) {
    return (
      <div>
        <label
          onClick={(e) =>
            window.open(
              "https://www.google.com/maps/dir/" +
                rowData.latitude1 +
                "+" +
                rowData.longitude1 +
                "/" +
                rowData.latitudeShop +
                "+" +
                rowData.longitudeShop,
              "_blank"
            )
          }
          style={{
            color: rowData.distanceIn > 500 ? "#f6546a" : "",
            cursor: "grab",
          }}
        >
          In: {rowData.distanceIn} (m)
        </label>
        <br></br>
        <label
          onClick={(e) =>
            window.open(
              "https://www.google.com/maps/dir/" +
                rowData.latitude2 +
                "+" +
                rowData.longitude2 +
                "/" +
                rowData.latitudeShop +
                "+" +
                rowData.longitudeShop,
              "_blank"
            )
          }
          style={{
            color: rowData.distanceOut > 500 ? "#f6546a" : "",
            cursor: "grab",
          }}
        >
          Out: {rowData.distanceOut} (m)
        </label>
      </div>
    );
  }
  showTotalTime = (rowData) => {
    return (
      <div>
        {rowData.totalTime !== null
          ? moment(new Date(rowData.totalTime)).format("HH:mm:ss")
          : ""}
      </div>
    );
  };
  shopNameTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <label>
          <strong>{rowData.shopCode}</strong>
        </label>{" "}
        <br></br>
        <label>{rowData.shopName} </label>
      </div>
    );
  }
  supNameTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <strong>{rowData.supCode}</strong>
        <br></br>
        <label>{rowData.supName}</label>
        <br></br>
        <label>{rowData.supType}</label>
      </div>
    );
  }
  employeeNameTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }}>
        <label>
          <strong>{rowData.employeeCode}</strong>{" "}
        </label>
        <br></br>
        <label>{rowData.fullName}</label>
        <br></br>
        <label>{rowData.typeName}</label>
      </div>
    );
  }
  dateTemplate(rowData) {
    let timeShift = null,
      shiftType = null;
    // if (rowData.shiftType !== null) shiftType = <label>{rowData.shiftType}</label>
    if (rowData.timeShift !== null)
      timeShift = <label>{rowData.timeShift}</label>;
    return (
      <div>
        <label>{moment(rowData.photoDate).format("YYYY-MM-DD")}</label>
        <br></br>
        {timeShift}
      </div>
    );
  }
  itemImages = (data) => {
    return (
      <img
        style={{ textAlign: "center", height: 400 }}
        alt="img"
        src={data.imageUrl}
      />
    );
  };
  async handleInsertAttendant(index) {
    await this.setState({ isLoading: true });
    await this.handleValidInput("insert", index).then(async (valid) => {
      if (valid) {
        const inputValues = this.state.inputValues;
        const { dateTime, checkType, imageFile, shiftCode } = await this.state
          .inputValues;
        const data = await {
          employeeId: this.state.employeeValue || "",
          shopId: this.state.shopId || "",
          photoType: inputValues.checkType.id,
          longitude: 0,
          latitude: 0,
          photoTime: moment(inputValues.dateTime).format("YYYY-MM-DD HH:mm"),
          shiftCode: inputValues.shiftCode,
        };
        try {
          await this.props.AttendantController.InsertAttendant(
            imageFile[index] && imageFile[index],
            data
          );
          let response = await this.props.insertAttendant;
          await this.handleDialogAttendant(false, "displayDialogInsert");
          if (
            typeof response === "object" &&
            response[0] &&
            response[0].alert === "1"
          ) {
            await this.setState({
              datas: this.props.attendants,
            });
            await this.Alert("Thêm thành công", "info");
          } else {
            await this.Alert("Thêm thất bại", "error");
          }
          await this.setState({ isLoading: false });
        } catch (e) {
          console.log(e);
          await this.Alert("Thêm thất bại", "error");
          await this.setState({ isLoading: false });
        }
      }
    });
    await this.setState({ isLoading: false });
  }
  async handleUpdateAttendant(index, shouldImageUpdate) {
    await this.setState({ isLoading: true });
    await this.handleValidInput("update", index).then(async (valid) => {
      if (valid) {
        let { cardDatas, imageFile, savedImage, indexRow, shiftCode } =
          await this.state.inputValues;
        if (shouldImageUpdate) {
          /**
           * * Update available item.
           */
          let photoName = await getImageUpdateName(cardDatas[index].photo);
          const data = await {
            employeeId: cardDatas[index].employeeId,
            shopId: cardDatas[index].shopId,
            photoType: index,
            photoTime: this.state.inputValues[`date${index}`],
            photoDate: cardDatas[index].photoDate,
            photoID: cardDatas[index].photoID,
            photo: !(imageFile && imageFile[index])
              ? cardDatas[index].photo
              : "",
            photoName: photoName,
            shiftCode: shiftCode,
          };
          await this.props.AttendantController.UpdateAttendant(
            imageFile && imageFile[index] ? imageFile[index] : "",
            data,
            indexRow
          );
          const response = await this.props.updateAttendant;
          if (
            typeof response === "object" &&
            response[0] &&
            response[0].alert === "1"
          ) {
            savedImage[index] = await true;
            cardDatas[index].shouldImageUpdate = await true;
            cardDatas[index].photo = await response[0].photo;
            await this.setState({
              datas: this.props.attendants,
              savedImage: savedImage,
              cardDatas: cardDatas,
            });
            await this.Alert("Cập nhập thành công", "info");
          } else {
            await this.Alert("Cập nhập thất bại", "error");
          }
        } else {
          /**
           * * Insert new item.
           */
          const { employeeId, shopId, photoDate, shiftCode } = await this.state
            .rowData;
          const data = await {
            shiftCode: shiftCode,
            employeeId: employeeId,
            shopId: shopId,
            photoDate: +moment(photoDate).format("YYYYMMDD"),
            photoTime: this.state.inputValues[`date${index}`],
            photoType: index,
            photo: cardDatas[index].isClone ? cardDatas[index].photo : "",
          };
          await this.props.AttendantController.InsertItem(
            imageFile && imageFile[index] ? imageFile[index] : "",
            data,
            indexRow
          );
          const response = await this.props.insertItem;
          if (
            typeof response === "object" &&
            response[0] &&
            response[0].alert === "1"
          ) {
            cardDatas[index].id = await response[0].id;
            cardDatas[index].shouldImageUpdate = await true;
            cardDatas[index].photo = await response[0].photo;
            cardDatas[index].photoDate = await response[0].photoDate;
            cardDatas[index].photoTime = await response[0].photoTime;

            /**
             * * Set saved image for drag and drog to true
             */
            savedImage[index] = await true;

            await this.setState({
              datas: this.props.attendants,
              inputValues: {
                ...this.state.inputValues,
                savedImage: savedImage,
                cardDatas: cardDatas,
              },
            });

            await this.Alert("Thêm thành công", "info");
          } else {
            await this.Alert("Thêm thất bại", "error");
          }
        }
      }
    });
    await this.setState({ isLoading: false });
  }
  async handleDeleteAttendant() {
    await this.setState({ isLoading: true });
    const { shopId, employeeId, photoDate, rowIndex, shiftCode } = await this
      .state.rowData;
    const dateFormat = +moment(photoDate).format("YYYYMMDD");
    await this.props.AttendantController.DeleteAttendant(
      shiftCode,
      shopId,
      employeeId,
      dateFormat,
      rowIndex
    );
    const response = await this.props.deleteAttendant;
    await this.handleDialogConfirmAttendant(
      false,
      "displayDialogDeleteAttendant"
    );
    if (response && response.result === 1) {
      await this.setState({
        datas: this.props.attendants,
      });
      await this.Alert("Xóa thành công", "info");
    } else {
      await this.Alert("Xóa thất bại", "error");
    }
    await this.setState({ isLoading: false });
  }
  async handleDeleteImage(indexForSwap = -1, idForSwap = -1) {
    if (idForSwap === -1) await this.setState({ isLoading: true });
    let { index } = await this.state.rowData;
    index = (await indexForSwap) === -1 ? index : indexForSwap;
    const { cardDatas, savedImage, indexRow } = await this.state.inputValues;
    const data = await {
      photoID: idForSwap === -1 ? cardDatas[index].photoID : idForSwap,
    };
    await this.props.AttendantController.DeleteItem(data, indexRow, index);
    const response = await this.props.deleteItem;
    await this.handleDialogConfirmAttendant(false, "displayDialogDeleteItem");
    if (response && response.result === 1) {
      /**
       * * Clear image file input if successful.
       */
      const preview = await document.querySelectorAll(".attendant_image");
      if (preview[index]) preview[index].src = await this.state.emptyImage;
      const file = await document.querySelectorAll(
        ".attendant_container input[type=file]"
      );
      if (file[index]) file[index].value = await null;

      /**
       * * Change should update image state to false.
       */
      cardDatas[index].shouldImageUpdate = await false;

      /**
       * * Change image's state.
       */
      cardDatas[index].isImageChanged = await true;

      /**
       * * Set id's image to null
       */
      cardDatas[index].id = await "";

      /**
       * * Change savedImage's state to false
       */
      savedImage[index] = await false;

      await this.setState({
        datas: this.props.attendants,
        inputValues: {
          ...this.state.inputValues,
          cardDatas: cardDatas,
          savedImage: savedImage,
          [`date${index}`]: "",
        },
      });

      if (idForSwap === -1) await this.Alert("Delete Item Successful", "info");
    } else {
      if (idForSwap === -1) await this.Alert("Delete Item Failed", "error");
    }
    if (idForSwap === -1) await this.setState({ isLoading: false });
  }
  async handleValidInput(actionName, index) {
    let check = await true;
    if (actionName === "insert") {
      const { checkType, dateTime, imageFile, shiftCode } = await this.state
        .inputValues;
      if (!checkType) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorCheckType: "Check Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorCheckType: "" },
        });

      if (!dateTime) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorDateTime: "Date Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorDateTime: "" },
        });

      if (this.state.employeeValue === 0) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorEmployee: "Employee Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorEmployee: "" },
        });

      if (
        this.state.shopId === 0 ||
        this.state?.shopId === undefined ||
        this.state.shopId === null ||
        this.state.shopId === ""
      ) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorStoreName: "Store Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorStoreName: "" },
        });

      if (!imageFile) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorImage: "Image Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorImage: "" },
        });

      if (!shiftCode) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorShiftCode: "Shift Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, errorShiftCode: "" },
        });
    } else if (actionName === "update") {
      if (!this.state.inputValues[`date${index}`]) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            [`errorDate${index}`]: "Time Required",
          },
        });
        check = await false;
      } else
        await this.setState({
          inputValues: { ...this.state.inputValues, [`errorDate${index}`]: "" },
        });
    }
    if (!check) return false;
    else return true;
  }
  async handleDialogAttendant(boolean, stateName, rowData = {}, indexRow = -1) {
    if (boolean) {
      // await this.setState({ isLoading: true })
      if (stateName === "displayDialogInsert") {
        const checkTypes = await [
          { name: "Over-View", id: 0 },
          { name: "Check-in", id: 1 },
          { name: "Check-out", id: 2 },
        ];
        await this.setState({
          [stateName]: true,
          inputValues: {
            ...this.state.inputValues,
            checkTypes: checkTypes,
            emptyImage: this.state.emptyImage,
            classImage: "attendant_image",
            classInputFile: "attendant_input_file",
          },
        });
      } else if (stateName === "displayDialogUpdate") {
        const {
          fullName,
          shopName,
          shopCode,
          shopId,
          employeeId,
          photoDate,
          shiftCode,
        } = await rowData;
        await this.props.AttendantController.GetShiftListAttendant(
          shopId,
          employeeId,
          moment(photoDate).format("YYYY-MM-DD"),
          this.state.accId
        );
        await this.setState({ shiftOption: this.props.getListShift });
        const checkTypes = await [
          { name: "Over View", id: 0 },
          { name: "Check-in 1", id: 1 },
          { name: "Check-out 1", id: 2 },
          { name: "Check-in 2", id: 3 },
          { name: "Check-out 2", id: 4 },
          { name: "Check-in 3", id: 5 },
          { name: "Check-out 3", id: 6 },
        ];
        const dateFormat = +moment(photoDate).format("YYYYMMDD");
        await this.props.AttendantController.FilterDataUpdate(
          shopId,
          employeeId,
          dateFormat,
          shiftCode
        );
        const arr = await this.props.filterDataUpdate;

        const cardDatas = await [];
        const savedImage = await {};
        let numOfTypes = await -1;
        // if (rowData.date1 !== undefined) {
        //     numOfTypes = await 5
        // } else numOfTypes = await 2
        if (rowData.date3 !== undefined) {
          numOfTypes = await 5;
          if (
            rowData.date5 !== undefined &&
            getLogin().accountName === "MARICO MT"
          ) {
            numOfTypes = await 7;
          }
        } else numOfTypes = await 3;

        for (let i = 0; i < numOfTypes; i++) {
          const checkFilter = this.filter(arr, "photoType", i)[0]
            ? true
            : false;
          await cardDatas.push({
            photo: checkFilter
              ? this.filter(arr, "photoType", i)[0].photo
              : this.state.emptyImage,
            photoTime: checkFilter
              ? this.filter(arr, "photoType", i)[0].photoTime
              : "",
            photoID: checkFilter
              ? this.filter(arr, "photoType", i)[0].photoID
              : "",
            photoType: i,
            photoDate: checkFilter
              ? this.filter(arr, "photoType", i)[0].photoDate
              : "",
            isImageChanged: !checkFilter,
            shouldImageUpdate: checkFilter,
            shopId: shopId,
            employeeId: employeeId,
            idDragDrop: "dnd" + i,
            shiftCode: shiftCode,
          });
          if (checkFilter) savedImage[i] = true;
          else savedImage[i] = false;
        }
        await this.setState({
          [stateName]: true,
          rowData: rowData,
          inputValues: {
            ...this.state.inputValues,
            fullName: fullName || "",
            shopName: `${shopCode}-${shopName}` || "",
            checkType0: checkTypes[0].name,
            checkType1: checkTypes[1].name,
            checkType2: checkTypes[2].name,
            checkType3: checkTypes[3].name,
            checkType4: checkTypes[4].name,
            checkType5: checkTypes[5].name,
            checkType6: checkTypes[6].name,

            date0: this.filter(arr, "photoType", 0)[0]
              ? this.filter(arr, "photoType", 0)[0].photoTime
              : "",
            date1: this.filter(arr, "photoType", 1)[0]
              ? this.filter(arr, "photoType", 1)[0].photoTime
              : "",
            date2: this.filter(arr, "photoType", 2)[0]
              ? this.filter(arr, "photoType", 2)[0].photoTime
              : "",
            date3: this.filter(arr, "photoType", 3)[0]
              ? this.filter(arr, "photoType", 3)[0].photoTime
              : "",
            date4: this.filter(arr, "photoType", 4)[0]
              ? this.filter(arr, "photoType", 4)[0].photoTime
              : "",
            date5: this.filter(arr, "photoType", 5)[0]
              ? this.filter(arr, "photoType", 5)[0].photoTime
              : "",
            date6: this.filter(arr, "photoType", 6)[0]
              ? this.filter(arr, "photoType", 6)[0].photoTime
              : "",

            checkTypes: checkTypes,
            cardDatas: cardDatas,
            savedImage: savedImage,
            classImage: "attendant_image",
            classInputFile: "attendant_input_file",

            shiftCode: shiftCode,
            indexRow: indexRow,
          },
        });
      }
      await this.setState({ isLoading: false });
    } else {
      let imagesContainer = await document.querySelectorAll(
        ".attendant_container"
      );
      let images = await document.querySelectorAll(".attendant_image");
      for (let i = 0; i < imagesContainer.length; i++) {
        await imagesContainer[i].classList.remove("attendant_container");
        await images[i].classList.remove("attendant_image");
        await images[i].classList.remove("attendant_input_file");
      }
      if (stateName === "displayDialogUpdate") {
        let copyButtonContainer = await document.querySelectorAll(
          ".copy_button_container"
        );
        let copyButton = await document.querySelectorAll(".copy_button");
        for (let i = 0; i < copyButtonContainer.length; i++) {
          await copyButtonContainer[i].classList.remove(
            "copy_button_container"
          );
          await copyButton[i].classList.remove("copy_button");
        }
      }
      await this.setState({
        [stateName]: false,
        rowData: {},
        inputValues: {},
        employeeValue: 0,
        shopId: 0,
      });
    }
  }

  async handleDialogConfirmAttendant(
    boolean,
    stateName,
    rowData,
    rowIndex = null
  ) {
    const additionRowData = await Object.assign(this.state.rowData, rowData, {
      rowIndex,
    });
    if (boolean) {
      await this.setState({
        [stateName]: true,
        rowData: additionRowData,
      });
    } else {
      await this.setState({
        [stateName]: false,
      });
    }
  }
  async handleDisplayImageEditor(boolean, stateName, payload = {}) {
    if (boolean) {
      await this.setState({
        [stateName]: true,
        payload: payload,
      });
    } else {
      await this.setState({ isLoading: true });
      if (payload && payload.imageBase64 !== undefined) {
        const { imageBase64 } = await payload;
        const { indexImage } = await this.state.payload;
        if (this.state[this.state.payload.dialog]) {
          let imageName = await "";
          const images = await document.querySelectorAll(".attendant_image");
          /**
           * * Bind Edited Image
           */
          if (images[indexImage]) images[indexImage].src = await imageBase64;

          if (!this.state.payload.insertAll) {
            const { cardDatas } = await this.state.inputValues;
            cardDatas[indexImage].isImageChanged = await false;
            cardDatas[indexImage].prevEditedImage = await imageBase64;
            await this.setState({
              inputValues: {
                ...this.state.inputValues,
                cardDatas: cardDatas,
                savedImage: {
                  ...this.state.inputValues.savedImage,
                  [indexImage]: false,
                },
              },
            });
            imageName = await this.state.payload.photo.match(
              /([\w\-\_\(\)]+)(?=\.[\w]+).+$/g
            )[0];
          } else {
            imageName = await "image.png";
          }
          /**
           * * Convert base64 image to file.
           */
          const fetchBase64 = await fetch(imageBase64);
          const toBlob = await fetchBase64.blob();
          const imageFile = await new File([toBlob], imageName, {
            type: "image/jpeg",
          });

          await this.setState({
            inputValues: {
              ...this.state.inputValues,
              imageFile: {
                ...this.state.inputValues.imageFile,
                [indexImage]: imageFile,
              },
            },
          });
        }
      }
      await this.setState({
        [stateName]: false,
        payload: {},
        isLoading: false,
      });
    }
  }
  actionButtons(rowData, event) {
    return (
      <div>
        {this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            style={{ marginBottom: 5 }}
            className="p-button-rounded p-button-info p-button-outlined p-mr-2"
            onClick={() =>
              this.handleDialogAttendant(
                true,
                "displayDialogUpdate",
                rowData,
                event.rowIndex
              )
            }
          />
        )}
        {this.state.permission.delete && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-outlined"
            onClick={() =>
              this.handleDialogConfirmAttendant(
                true,
                "displayDialogDeleteAttendant",
                rowData,
                event.rowIndex
              )
            }
          />
        )}
      </div>
    );
  }
  renderFooterDialog(handleFunction, stateName, boolean) {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => this.handleDialogAttendant(false, stateName)}
          className="p-button-text"
        />
        {!boolean && (
          <Button
            label="Yes"
            icon="pi pi-check"
            onClick={handleFunction}
            autoFocus
          />
        )}
      </div>
    );
  }
  renderFooterDialogConfirm = (handleProceedFunction, handleCancelFunction) => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => handleCancelFunction()}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => handleProceedFunction()}
          autoFocus
        />
      </div>
    );
  };
  handleChange = async (id, value) => {
    await this.setState({
      [id]: value === null ? "" : value,
    });
    // if (id === 'position' || id === 'supId')
    //     await this.setState({ inputValues: { ...this.state.inputValues, employeeValue: 0 } });

    if (id === "shopId") {
      this.handleGetShift(value);
    }
  };

  handleGetShift = (shopId) => {
    const state = this.state;
    const inputValues = this.state.inputValues;
    this.props.AttendantController.GetShiftListAttendant(
      shopId,
      state.employeeValue,
      moment(inputValues.dateTime).format("YYYY-MM-DD"),
      this.state.accId
    ).then(() => {
      this.setState({ shiftOption: this.props.getListShift });
    });
  };

  async handleChangeForm(value, stateName, subStateName = null) {
    if (subStateName === null) {
      await this.setState({ [stateName]: value });
    } else {
      await this.setState({
        [stateName]: { ...this.state[stateName], [subStateName]: value },
      });
    }
  }
  handleChangeDropDown = async (id, value) => {
    await this.setState({
      inputValues: { ...this.state.inputValues, [id]: value ? value : null },
    });
  };
  handleInputFileChange = async (index, action = null) => {
    const preview = await document.querySelectorAll(".attendant_image");
    const file = await document.querySelectorAll(
      ".attendant_container input[type=file]"
    );
    const reader = await new FileReader();
    reader.onloadend = () => {
      if (preview[index]) preview[index].src = reader.result;
    };
    if (file[index] && file[index].files[0]) {
      await reader.readAsDataURL(file[index].files[0]);
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          imageFile: {
            ...this.state.inputValues.imageFile,
            [index]: file[index].files[0],
          },
        },
      });
      if (action === "update") {
        // * change image state
        const cardDatas = await this.state.inputValues.cardDatas;
        cardDatas[index].isImageChanged = await false;
        await delete cardDatas[index].prevEditedImage;
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            cardDatas: cardDatas,
            savedImage: {
              ...this.state.inputValues.savedImage,
              [index]: false,
            },
          },
        });
      }
    }
  };
  handleCloneImage = async (index, photoUrl) => {
    const preview = await document.querySelectorAll(".attendant_image");
    preview[index].src = await photoUrl;
    let copyButton = await document.querySelectorAll(".copy_button");
    copyButton[index].style.display = await "none";

    let cardDatas = await this.state.inputValues.cardDatas;
    cardDatas[index].isImageChanged = await false;
    cardDatas[index].photo = await photoUrl;
    cardDatas[index].isClone = await true;
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        cardDatas: cardDatas,
        savedImage: {
          ...this.state.inputValues.savedImage,
          [index]: false,
        },
      },
    });
  };
  filter = (arr, id, key) => {
    return arr.filter((e) => e[id] === key);
  };
  onDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index)
      return;
    const startIndex = await result.source.index;
    const endIndex = await result.destination.index;
    const { cardDatas, savedImage, indexRow } = await this.state.inputValues;
    /**
     * * if not updated or inserted yet!
     */
    if (!this.state.inputValues.savedImage[startIndex]) {
      this.Alert(`Image ${startIndex + 1} is unavailable!`, "warn");
      return;
    }
    if (
      this.state.inputValues.savedImage[startIndex] &&
      this.state.inputValues.savedImage[endIndex]
    ) {
      this.Alert("Swap Failed", "warn");
      return;
    }
    await this.setState({ isLoading: true });
    /**
     * * Swap card's position and sort by type.
     */
    cardDatas[startIndex].photoType =
      (await cardDatas[endIndex].photoType) ^ cardDatas[startIndex].photoType;
    cardDatas[endIndex].photoType =
      (await cardDatas[endIndex].photoType) ^ cardDatas[startIndex].photoType;
    cardDatas[startIndex].photoType =
      (await cardDatas[endIndex].photoType) ^ cardDatas[startIndex].photoType;
    await cardDatas.sort((a, b) => a.photoType - b.photoType);
    /**
     * * Swap card's time.
     */
    let dateStart = await this.state.inputValues[`date${startIndex}`];
    let dateEnd = await this.state.inputValues[`date${endIndex}`];
    let tempDate = await dateStart;
    dateStart = await dateEnd;
    dateEnd = await tempDate;

    /**
     * * Swap savedImage's state.
     */
    let tempSavedState = await savedImage[startIndex];
    savedImage[startIndex] = await savedImage[endIndex];
    savedImage[endIndex] = await tempSavedState;

    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        cardDatas: cardDatas,
        [`date${startIndex}`]: dateStart,
        [`date${endIndex}`]: dateEnd,
        savedImage: savedImage,
      },
    });

    const dataDrag = await {
      employeeId: cardDatas[endIndex].employeeId,
      shopId: cardDatas[endIndex].shopId,
      photoType: endIndex,
      photoTime: cardDatas[endIndex].photoTime,
      photoDate: cardDatas[endIndex].photoDate,
      photo: cardDatas[endIndex].shouldImageUpdate
        ? cardDatas[endIndex].photoID
          ? cardDatas[endIndex].photo
          : ""
        : "",
      photoID: cardDatas[endIndex].photoID,
      // shiftCode: cardDatas[endIndex].shiftCode,
    };

    if (!cardDatas[startIndex].photoID && cardDatas[endIndex].photoID) {
      /**
       * * In Case Of Available Swap To Unavailable.
       */
      await this.props.AttendantController.UpdateAttendant(
        null,
        dataDrag,
        indexRow,
        startIndex
      );
      const response = await this.props.updateAttendant;
      if (
        typeof response === "object" &&
        response[0] &&
        response[0].alert === "1"
      ) {
        await this.Alert("Chuyển thành công", "info");
        await this.setState({ datas: this.props.attendants });
      } else {
        await this.Alert("Chuyển thất bại", "error");
      }
    }
    await this.setState({ isLoading: false });
  };
  base64ToFile = async (dataurl, filename) => {
    if (dataurl) return;
    let arr = await dataurl.split(",");
    let mime = await arr[0].match(/:(.*?);/)[1];
    let bstr = await atob(arr[1]);
    let n = await bstr.length;
    let u8arr = await new Uint8Array(n);
    while (n--) u8arr[n] = await bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };
  render() {
    const rowSelected = this.state.rowSelected;
    let dataTable = null;
    let deleteImageDialog = null,
      deleteRowDialog = null,
      displaySlideShow = null,
      checkKpiDialog = null;
    let images = [];
    let headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="No." />
          <Column
            header={this.props.language["kpi_name"] || "l_kpi_name"}
            style={{ textAlign: "center" }}
            colSpan={2}
          />
          <Column
            header={this.props.language["created_by"] || "l_created_by"}
          />
          <Column
            header={this.props.language["create_date"] || "l_create_date"}
          />
          <Column
            header={this.props.language["note"] || "l_note"}
            style={{ textAlign: "center" }}
          />
          <Column header="#" style={{ textAlign: "center" }} />
        </Row>
      </ColumnGroup>
    );
    if (rowSelected != null && rowSelected.shopName !== undefined) {
      if (rowSelected.overView !== null && rowSelected.overView !== undefined)
        images.push({ imageUrl: rowSelected.overView });
      if (rowSelected.image1 !== null)
        images.push({ imageUrl: rowSelected.image1 });
      if (rowSelected.image2 !== null)
        images.push({ imageUrl: rowSelected.image2 });
      if (rowSelected.image3 !== null)
        images.push({ imageUrl: rowSelected.image3 });
      if (rowSelected.image4 !== null)
        images.push({ imageUrl: rowSelected.image4 });
    }
    let widthInOut = getLogin().accountName === "MARICO MT" ? 450 : 300;

    if (this.state.datas.length > 0) {
      // * DATATABLE
      dataTable = (
        <Card>
          <DataTable
            value={this.state.datas}
            rows={20}
            rowHover
            paginator
            resizableColumns
            columnResizeMode="expand"
            style={{ fontSize: "13px", marginTop: "10px" }}
            dataKey="rowNum"
            rowsPerPageOptions={[20, 50, 100]}
            paginatorPosition={"both"}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          >
            <Column field="rowNum" style={{ width: "50px" }} header="No." />
            <Column
              filter
              field="areaName"
              style={{ width: "80px" }}
              header={this.props.language["area"] || "l_area"}
            />
            <Column
              filterMatchMode="contains"
              filter
              field="customerName"
              header={this.props.language["customer"] || "customer"}
              style={{ width: "80px" }}
            />
            <Column
              filterMatchMode="contains"
              filter
              field="shopName"
              body={this.shopNameTemplate}
              style={{ width: "180px" }}
              header={
                this.props.language["storelist_shopname"] ||
                "storelist_shopname"
              }
            />
            <Column
              filterMatchMode="contains"
              filter
              field="address"
              header={this.props.language["address"] || "address"}
            />
            <Column
              filterMatchMode="contains"
              filter
              field="supName"
              body={this.supNameTemplate}
              header={this.props.language["l_manager"] || "manager"}
              style={{ width: "180px" }}
            />
            <Column
              filterMatchMode="contains"
              filter
              field="employeeName"
              body={this.employeeNameTemplate}
              header={
                this.props.language["lblemployeename"] || "lblemployeename"
              }
              style={{ width: "180px" }}
            />
            <Column
              body={this.dateTemplate}
              header={this.props.language["date"] || "l_date"}
              style={{ width: "150px", textAlign: "center" }}
            />
            <Column
              body={this.imageTemplate}
              header={this.props.language["check_in_out"] || "l_check_in_out"}
              style={{ width: { widthInOut }, textAlign: "center" }}
            />
            <Column
              body={this.distanceTemplate}
              header={this.props.language["distance"] || "l_distance"}
              style={{ width: "100px" }}
            />
            <Column
              field="totalTime"
              body={this.showTotalTime}
              header={this.props.language["totaltime"] || "totaltime"}
              style={{ width: "70px", textAlign: "center" }}
            />
            <Column
              body={this.actionButtons}
              header="#"
              style={{ width: "65px", textAlign: "center" }}
            ></Column>
          </DataTable>
        </Card>
      );
    }
    if (this.state.displayDialogDeleteItem) {
      // * DELETE IMAGE DIALOG
      deleteImageDialog = (
        <Dialog
          header="Delete Image "
          visible={this.state.displayDialogDeleteItem}
          modal
          style={{ width: "350px" }}
          footer={this.renderFooterDialogConfirm(
            () => this.handleDeleteImage(),
            () =>
              this.handleDialogConfirmAttendant(
                false,
                "displayDialogDeleteItem"
              )
          )}
          onHide={() =>
            this.handleDialogConfirmAttendant(false, "displayDialogDeleteItem")
          }
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["confirm_to_delete"] ||
                "l_confirm_to_delete"}
              ?
            </span>
          </div>
        </Dialog>
      );
    }
    if (this.state.displayDialogDeleteAttendant) {
      // * DELETE ROW DIALOG
      deleteRowDialog = (
        <Dialog
          header="Delete Row"
          visible={this.state.displayDialogDeleteAttendant}
          modal
          style={{ width: "350px" }}
          footer={this.renderFooterDialogConfirm(
            () => this.handleDeleteAttendant(),
            () =>
              this.handleDialogConfirmAttendant(
                false,
                "displayDialogDeleteAttendant"
              )
          )}
          onHide={() =>
            this.handleDialogConfirmAttendant(
              false,
              "displayDialogDeleteAttendant"
            )
          }
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {this.props.language["confirm_to_delete"] ||
                "l_confirm_to_delete"}
              ?
            </span>
          </div>
        </Dialog>
      );
    }
    if (this.state.showImage) {
      // * DISPLAY SLIDE SHOW
      displaySlideShow = (
        <Dialog
          header={
            `${this.props.language["shop"] || "shop"}: ` +
            rowSelected.shopCode +
            " - " +
            rowSelected.shopName +
            ` | ${this.props.language["employee"] || "employee"}: ` +
            rowSelected.employeeCode +
            " - " +
            rowSelected.fullName +
            " (" +
            rowSelected.typeName +
            ")"
          }
          onHide={() => this.setState({ showImage: false })}
          style={{ width: "100%" }}
          visible={this.state.showImage}
        >
          <Carousel
            numVisible={2}
            numScroll={1}
            value={images}
            itemTemplate={this.itemImages}
          ></Carousel>
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
        {this.state.permission !== undefined && (
          <Search
            {...this}
            isVisibleQCStatus={false}
            isVisibleReport={false}
            pageType="attendant"
            permission={this.state.permission}
          ></Search>
        )}
        {dataTable}
        {deleteImageDialog}
        {deleteRowDialog}
        {displaySlideShow}
        {checkKpiDialog}
        {this.state.displayDialogInsert && (
          <AttendantSideBar // * INSERT
            stateName={"inputValues"}
            actionName={"Insert"}
            dialogStateName={"displayDialogInsert"}
            displayDialog={this.state.displayDialogInsert}
            displayFooterAction={this.renderFooterDialog}
            handleActionFunction={this.handleInsertAttendant}
            inputValues={this.state.inputValues}
            handleChangeForm={this.handleChangeForm}
            handleChange={this.handleChange}
            handleDialog={this.handleDialogAttendant}
            handleDeleteImage={this.handleDeleteImage}
            employeeValue={this.state.employeeValue}
            shopId={this.state.shopId}
            handleInputFileChange={this.handleInputFileChange}
            handleDisplayImageEditor={this.handleDisplayImageEditor}
            shiftOption={this.state.shiftOption}
            accId={this.state.accId}
            position={this.state.position}
          />
        )}
        {this.state.displayDialogUpdate && (
          <AttendantDialog // * UPDATE
            stateName={"inputValues"}
            actionName={"Update"}
            dialogStateName={"displayDialogUpdate"}
            displayDialog={this.state.displayDialogUpdate}
            displayFooterAction={this.renderFooterDialog}
            handleActionFunction={this.handleUpdateAttendant}
            inputValues={this.state.inputValues}
            handleChangeForm={this.handleChangeForm}
            handleChange={this.handleChange}
            handleDialog={this.handleDialogAttendant}
            handleDialogConfirm={this.handleDialogConfirmAttendant}
            handleDeleteImage={this.handleDeleteImage}
            handleInputFileChange={this.handleInputFileChange}
            handleCloneImage={this.handleCloneImage}
            handleDisplayImageEditor={this.handleDisplayImageEditor}
            onDragEnd={this.onDragEnd}
            isLoading={this.state.isLoading}
            handleChangeDropDown={this.handleChangeDropDown}
            shiftOption={this.state.shiftOption}
            accId={this.state.accId}
          />
        )}

        <EditorTools
          dialogStateName={"displayImageEditor"}
          displaySideBar={this.state.displayImageEditor}
          imageForEdit={
            this.state.payload.imageForEdit || this.state.emptyImage
          }
          handleDisplayImageEditor={this.handleDisplayImageEditor}
          isVisible={false}
        />
      </React.Fragment>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}
function mapStateToProps(state) {
  return {
    attendants: state.attendants.attendants,
    reportAttendant: state.attendants.reportAttendant,
    employeeShops: state.shops.employeeShops,
    language: state.languageList.language,
    filterDataUpdate: state.attendants.filterDataUpdate,
    insertAttendant: state.attendants.insertAttendant,
    insertItem: state.attendants.insertItem,
    updateAttendant: state.attendants.updateAttendant,
    deleteItem: state.attendants.deleteItem,
    deleteAttendant: state.attendants.deleteAttendant,
    getlistKPI: state.attendants.getlistKPI,
    updateListKPI: state.attendants.updateListKPI,
    getListShift: state.attendants.getListShift,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    AttendantController: bindActionCreators(AttendantCreateAction, dispatch),
    ShopController: bindActionCreators(actionCreatorsShop, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Attendant);
