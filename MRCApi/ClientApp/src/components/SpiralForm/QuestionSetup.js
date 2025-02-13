import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { PureComponent } from "react";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { connect } from "react-redux";
import { ToggleButton } from "primereact/togglebutton";
import { AiOutlineClear } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import { FaCamera, FaFileAudio } from "react-icons/fa";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import { Chips } from "primereact/chips";
import moment from "moment";

const lstOption = [
  { name: "Select one", value: 101, class: "pi pi-check-circle" },
  { name: "Select multi", value: 102, class: "pi pi-check-square" },
  { name: "Text", value: 103, class: "pi pi-align-left" },
  { name: "Number", value: 104, class: "pi pi-sort-numeric-down" },
  { name: "Date", value: 105, class: "pi pi-calendar" },
  { name: "Dropdown", value: 106, class: "pi pi-list" },
];

class QuestionSetup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qtItem: this.props.question,
      questionList: this.props.listItem,
      //logicList: [],
      answer: "",
    };
  }
  componentDidMount() {
    //this.LogicList();
  }
  Goto = (steps, row) => {
    //  alert(row.anwserName + '-' + steps.indexRow + '-' + steps.questionName);
    let question = this.props.question;
    let answers = question.anwserItem;
    answers.forEach((update) => {
      if (update.id === row.id) {
        update.stepName = steps.questionName;
        update.nextStep = steps.indexRow;
      } else if (update.anwserType === 4) {
        update.stepName = null;
        update.nextStep = -1;
      }
    });

    question.anwserItem = answers;
    this.setState({ qtItem: question });
    this.props.addAnwser(question);
  };

  LogicList = (row) => {
    let lst = this.props.listItem;
    let step = {
      indexRow: 9999,
      questionName: "Kết thúc",
    };
    let itemList = [
      {
        label: "Kết thúc",
        command: () => {
          this.Goto(step, row);
        },
      },
    ];
    lst.forEach((i) => {
      if (i.indexRow > this.state.qtItem.indexRow)
        itemList.push({
          label: i.indexRow + ". " + i.questionName,
          command: () => {
            this.Goto(i, row);
          },
        });
    });
    return itemList;
  };
  AnswerInput = (row) => {
    return (
      <>
        <div style={{ marginBottom: 5 }}>
          <InputText
            placeholder={this.props.language["input_text"] || "input_text"}
            disabled={true}
          />
          {/* <Menu model={this.LogicList(row)} popup ref={el => this.ans = el} id="ans" />
                    <Button className="p-button-help"
                        icon="pi pi-chevron-down"
                        style={{ margin: 'auto', height: 'fit-content', float: 'right', right: 50, top: 15 }}
                        onClick={(event) => this.ans.toggle(event)} aria-controls="ans" aria-haspopup /> */}
        </div>
        {row.nextStep > 0 ? (
          <div style={{ float: "right", paddingLeft: 120 }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  AnswerInputArea = (row) => {
    return (
      <>
        <div className="p-grid">
          <div className="p-col p-d-flex">
            <InputTextarea
              style={{ resize: "none" }}
              placeholder={
                this.props.language["input_text_area"] || "input_text_area"
              }
              disabled={true}
            />
          </div>
          <div
            className="p-col-fixed"
            style={{ width: 100, margin: "auto" }}
          ></div>
        </div>
        {row.nextStep > 0 ? (
          <div style={{ width: "100%", textAlign: "end" }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  AnswerDate = (row, item) => {
    return (
      <>
        <div className="p-grid">
          <div className="p-col p-d-flex">
            <div className="p-field p-grid">
              <div className="p-col-12 p-md-6 p-lg-4">
                <Calendar
                  disabled={true}
                  placeholder={
                    this.props.language["select_date"] || "l_select_date"
                  }
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="p-col-12 p-md-6 p-lg-4">
                <label>Min: </label>
                <Calendar
                  showIcon={true}
                  value={item.min ? new Date(item.min) : null}
                  style={{ width: 150 }}
                  onChange={(e) =>
                    this.props.handleChangeQuestion(
                      e.value ? moment(e.value).format("YYYY-MM-DD") : null,
                      "min",
                      this.props.index
                    )
                  }
                  placeholder={
                    this.props.language["select_date_min"] ||
                    "l_select_date_min"
                  }
                  dateFormat="yy-mm-dd"
                />
              </div>
              <div className="p-col-12 p-md-6 p-lg-4">
                <label>Max: </label>
                <Calendar
                  showIcon={true}
                  value={item.max ? new Date(item.max) : null}
                  style={{ width: 150 }}
                  onChange={(e) =>
                    this.props.handleChangeQuestion(
                      e.value ? moment(e.value).format("YYYY-MM-DD") : null,
                      "max",
                      this.props.index
                    )
                  }
                  placeholder={
                    this.props.language["select_date_max"] ||
                    "l_select_date_max"
                  }
                  dateFormat="yy-mm-dd"
                />
              </div>
            </div>
          </div>
          <div className="p-col-fixed" style={{ width: 100 }}></div>
        </div>
        {row.nextStep > 0 ? (
          <div style={{ width: "100%", textAlign: "end" }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  AnswerNumber = (row, item) => {
    return (
      <>
        <div className="p-grid">
          <div className="p-d-flex">
            <div className="p-grid">
              <div className="p-col-12 p-md-6 p-lg-4">
                <InputNumber
                  disabled={true}
                  id="number"
                  placeholder={
                    this.props.language["input_number"] || "input_number"
                  }
                />
              </div>
              <div className="p-col-12 p-md-6 p-lg-4">
                <label>Min: </label>
                <InputNumber
                  useGrouping={true}
                  id="min"
                  min={0}
                  placeholder={this.props.language["min"] || "l_min"}
                  value={item.min}
                  onChange={(e) =>
                    this.props.handleChangeQuestion(
                      e.value,
                      "min",
                      this.props.index
                    )
                  }
                  style={{ marginRight: 10, width: 130 }}
                />
              </div>
              <div className="p-col-12 p-md-6 p-lg-4">
                <label>Max: </label>
                <InputNumber
                  useGrouping={true}
                  id="max"
                  min={0}
                  placeholder={this.props.language["max"] || "l_max"}
                  value={item.max}
                  onChange={(e) =>
                    this.props.handleChangeQuestion(
                      e.value,
                      "max",
                      this.props.index
                    )
                  }
                  style={{ width: 130 }}
                />
              </div>
            </div>
          </div>
          {/* <div className="p-col-fixed" style={{ width: 60 }}>
                    </div> */}
        </div>
        {row.nextStep > 0 ? (
          <div style={{ width: "100%", textAlign: "end" }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  onClickInput = (anwserType, type) => {
    let question = this.props.question;
    let anwserItem = question.anwserItem;
    switch (anwserType) {
      case 4:
      case 5:
        let index = anwserItem.length;
        const item = {
          id: index,
          anwserName: "Options " + index,
          anwserType: anwserType,
          Add: false,
          nextStep: -1,
          stepName: "",
        };
        anwserItem.push(item);
        anwserItem.sort((a, b) => a.id - b.id);
        question.anwserItem = anwserItem;
        this.props.addAnwser(question);
        break;
      case 9:
      case 10:
        let anwserName = JSON.parse(anwserItem[0].anwserName);
        let rowItems = anwserName.row,
          columnItems = anwserName.column;
        let rowIndex = rowItems.length,
          colIndex = columnItems.length;
        if (type === "row") {
          rowItems.push({
            rowId: rowIndex,
            rowName: "Row " + rowIndex,
            rowValue: "",
            required: false,
          });
          rowItems.sort((a, b) => a.rowId - b.rowId);
          anwserName.row = rowItems;
        } else if (type === "column") {
          columnItems.push({
            colId: colIndex,
            colName: "Column " + colIndex,
            colValue: "",
          });
          columnItems.sort((a, b) => a.colId - b.colId);
          anwserName.column = columnItems;
        }
        anwserItem[0].anwserName = JSON.stringify(anwserName);
        question.anwserItem = anwserItem;
        this.props.addAnwser(question);
        break;
      default:
        break;
    }
  };
  AnswerImage = (row, item) => {
    return (
      <div className="p-field p-grid">
        <div className="p-col-12 p-md-6 p-lg-3">
          <BsImages size={50}></BsImages>
        </div>
        <div className="p-col-12 p-md-6 p-lg-3">
          <label>Min: </label>
          <InputNumber
            useGrouping={true}
            id="minImages"
            min={0}
            placeholder={this.props.language["min"] || "l_min"}
            value={item.min}
            onChange={(e) =>
              this.props.handleChangeQuestion(e.value, "min", this.props.index)
            }
            style={{ marginRight: 10, width: 100 }}
          />
        </div>
        <div className="p-col-12 p-md-6 p-lg-3">
          <label>Max: </label>
          <InputNumber
            useGrouping={true}
            id="maxImage"
            min={0}
            placeholder={this.props.language["max"] || "l_max"}
            value={item.max}
            onChange={(e) =>
              this.props.handleChangeQuestion(e.value, "max", this.props.index)
            }
            style={{ width: 100 }}
          />
        </div>
      </div>
    );
  };
  AnswerCamera = (row, item) => {
    return (
      <div className="p-field p-grid">
        <div className="p-col-12 p-md-6 p-lg-3">
          <FaCamera size={50}></FaCamera>
        </div>
        <div className="p-col-12 p-md-6 p-lg-3">
          <label>Min: </label>
          <InputNumber
            useGrouping={true}
            id="minCamera"
            min={0}
            placeholder={this.props.language["min"] || "l_min"}
            value={item.min}
            onChange={(e) =>
              this.props.handleChangeQuestion(e.value, "min", this.props.index)
            }
            style={{ marginRight: 10, width: 100 }}
          />
        </div>
        <div className="p-col-12 p-md-6 p-lg-3">
          <label>Max: </label>
          <InputNumber
            useGrouping={true}
            id="maxCamera"
            min={0}
            placeholder={this.props.language["max"] || "l_max"}
            value={item.max}
            onChange={(e) =>
              this.props.handleChangeQuestion(e.value, "max", this.props.index)
            }
            style={{ width: 100 }}
          />
        </div>
      </div>
    );
  };
  AnswerMultiChoose = (row) => {
    let images = [];
    if (row?.images?.length > 0) {
      row.images.forEach((element) => {
        images.push(
          <div style={{ display: "inline-flex" }}>
            <img
              alt="banner"
              style={{ height: 125, marginRight: 5, marginBottom: 5 }}
              src={element.imageData || element.imageURL}
            ></img>
            <Button
              onClick={(e) => {
                this.onChangeItem(e, row.id, "removeImagesA");
              }}
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
      <>
        <div className="p-grid">
          <div className="p-col p-d-flex" style={{ margin: "auto" }}>
            <Checkbox className="p-mr-2" key="chk" style={{ margin: "auto" }} />
            <InputTextarea
              value={row.anwserName}
              autoResize
              row={1}
              onKeyUp={(e) =>
                row.id === 100 && e.target.keyCode === 13
                  ? this.onClickInput(row.anwserType)
                  : this.noAction()
              }
              onClick={() => {
                row.id === 100
                  ? this.onClickInput(row.anwserType)
                  : this.noAction();
              }}
              onChange={(e) => this.onChangeItem(e, row.id)}
              className="p-mr-2"
              placeholder={this.props.language["options"] || "l_options"}
            />
            <i
              style={{
                display: row.id === 100 ? "none" : "flex",
                position: "absolute",
                float: "right",
                right: 155,
                width: 40,
                marginTop: 5,
              }}
              onClick={() => this.removeItem(row)}
              className="pi pi-times"
            />
          </div>
          <div className="p-col-fixed" style={{ width: 50, margin: "auto" }}>
            {row.id !== 100 ? (
              <>
                <Button
                  icon="pi pi-image"
                  tooltip="Add image"
                  onClick={() => this.onChooseImage("imagesA" + row.id)}
                  className="p-button-rounded p-button-primary p-button-text p-button-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={(input) => (this["imagesA" + row.id] = input)}
                  onChange={(e) => {
                    this.onChangeItem(e, row.id, "imagesA");
                  }}
                  style={{ display: "none" }}
                ></input>
              </>
            ) : null}
          </div>
          <div className="p-col-fixed" style={{ width: 100, margin: "auto" }}>
            {row.id !== 100 ? (
              //<SplitButton tooltipOptions={row} className="p-d-flex p-button-help p-mr-2" model={this.LogicList(row)} />
              <>
                <Menu
                  model={this.LogicList(row)}
                  popup
                  ref={(el) => (this["op" + row.id] = el)}
                  id={"overlay_panel_" + row.id.toString()}
                />
                <Button
                  className="p-button-help"
                  icon="pi pi-chevron-down"
                  style={{ margin: "auto", height: "fit-content" }}
                  onClick={(event) => this["op" + row.id].toggle(event)}
                  aria-controls={"overlay_panel_" + row.id.toString()}
                  aria-haspopup
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="p-grid">
          <div
            className="p-col p-d-flex"
            style={{ margin: "auto", marginLeft: 30 }}
          >
            {images}
          </div>
          <div
            className="p-col-fixed"
            style={{ width: 150, margin: "auto" }}
          ></div>
        </div>
        {row.nextStep > 0 ? (
          <div style={{ width: "100%", textAlign: "end" }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  noAction = () => {};
  AnswerSelected = (row) => {
    let images = [];
    if (row?.images?.length > 0) {
      row.images.forEach((element) => {
        images.push(
          <div style={{ display: "inline-flex" }}>
            <img
              alt="banner"
              style={{ height: 125, marginRight: 5, marginBottom: 5 }}
              src={element.imageData || element.imageURL}
            ></img>
            <Button
              onClick={(e) => {
                this.onChangeItem(e, row.id, "removeImagesA");
              }}
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
      <>
        <div className="p-grid">
          <div className="p-col p-d-flex" style={{ margin: "auto" }}>
            <RadioButton
              className="p-mr-2"
              id="rad"
              style={{ margin: "auto" }}
            />
            <InputTextarea
              value={row.anwserName}
              autoResize
              row={1}
              onKeyUp={(e) =>
                row.id === 100 && e.target.keyCode === 13
                  ? this.onClickInput(row.anwserType)
                  : this.noAction()
              }
              onClick={() => {
                row.id === 100
                  ? this.onClickInput(row.anwserType)
                  : this.noAction();
              }}
              onChange={(e) => this.onChangeItem(e, row.id)}
              className="p-mr-2"
              placeholder={this.props.language["options"] || "l_options"}
            />
            <i
              style={{
                display: row.id === 100 ? "none" : "flex",
                position: "absolute",
                float: "right",
                right: 155,
                width: 40,
                marginTop: 5,
              }}
              onClick={() => this.removeItem(row)}
              className="pi pi-times"
            />
          </div>
          <div className="p-col-fixed" style={{ width: 50, margin: "auto" }}>
            {row.id !== 100 ? (
              <>
                <Button
                  icon="pi pi-image"
                  tooltip="Add image"
                  onClick={() => this.onChooseImage("imagesA" + row.id)}
                  className="p-button-rounded p-button-primary p-button-text p-button-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={(input) => (this["imagesA" + row.id] = input)}
                  onChange={(e) => {
                    this.onChangeItem(e, row.id, "imagesA");
                  }}
                  style={{ display: "none" }}
                ></input>
              </>
            ) : null}
          </div>
          <div className="p-col-fixed" style={{ width: 100, margin: "auto" }}>
            {row.id !== 100 ? (
              <>
                <Menu
                  model={this.LogicList(row)}
                  popup
                  ref={(el) => (this["op" + row.id] = el)}
                  id={"overlay_panel_" + row.id.toString()}
                />
                <Button
                  className="p-button-help"
                  icon="pi pi-chevron-down"
                  style={{ margin: "auto", height: "fit-content" }}
                  onClick={(event) => this["op" + row.id].toggle(event)}
                  aria-controls={"overlay_panel_" + row.id.toString()}
                  aria-haspopup
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="p-grid">
          <div
            className="p-col p-d-flex"
            style={{ margin: "auto", marginLeft: 30 }}
          >
            {images}
          </div>
          <div
            className="p-col-fixed"
            style={{ width: 150, margin: "auto" }}
          ></div>
        </div>
        {row.nextStep > 0 ? (
          <div style={{ width: "100%", textAlign: "end" }}>
            <AiOutlineClear
              title="Clear go to"
              height={30}
              onClick={() => this.removeGoTo(row)}
              style={{ color: "#e93838", marginRight: 10 }}
            />
            <label
              style={{
                width: "100%",
                textAlign: "right",
                fontStyle: "italic",
                fontSize: 12,
              }}
            >
              {row.nextStep === 9999
                ? "Kết thúc"
                : "Go to --> " + row.nextStep + ". " + row.stepName}
            </label>
          </div>
        ) : null}
      </>
    );
  };
  onChooseImage(name) {
    this[name].click();
  }
  async readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }
  onChangeItem = async (e, id, type) => {
    let question = this.props.question;
    let anwserItem = question.anwserItem;

    switch (type) {
      case "dropdownQ":
        let filteredArray = e.target.value.filter(function (item, pos) {
          return e.target.value.indexOf(item) === pos;
        });
        anwserItem[0].anwserName = JSON.stringify(filteredArray);
        break;
      case "row":
        let anwserName = JSON.parse(anwserItem[0].anwserName);
        let rowItems = anwserName.row;
        rowItems.forEach((update) => {
          if (update.rowId === id && update.rowId !== 100) {
            update.rowName = e.target.value;
          }
        });
        anwserName.row = rowItems;
        anwserItem[0].anwserName = JSON.stringify(anwserName);
        break;
      case "column":
        anwserName = JSON.parse(anwserItem[0].anwserName);
        let columnItems = anwserName.column;
        columnItems.forEach((update) => {
          if (update.colId === id && update.colId !== 100) {
            update.colName = e.target.value;
          }
        });
        anwserName.column = columnItems;
        anwserItem[0].anwserName = JSON.stringify(anwserName);
        break;
      case "questionType":
        question.questionType = e.value;
        // this.setState({ questionType: e.value });
        break;
      case "dropdown":
        filteredArray = e.target.value.filter(function (item, pos) {
          return e.target.value.indexOf(item) === pos;
        });
        anwserItem[0].dropdown = filteredArray;
        // this.setState({ dropdown: e.target.value });
        break;
      case "imagesQ":
        let result = [];
        if (e.target.files && e.target.files.length > 0) {
          for (let index = 0; index < e.target.files.length; index++) {
            const element = e.target.files[index];
            const imageDataUrl = await this.readFile(element);
            result.push({
              imageId: index + 1,
              imageURL: "",
              imageData: imageDataUrl,
            });
          }
          question.images = result;
        }
        break;
      case "removeImagesQ":
        result = question.images;
        result.splice(
          question.images.findIndex((i) => i.imageId === id),
          1
        );
        question.images = result;
        break;
      case "imagesA":
        result = [];
        if (e.target.files && e.target.files.length > 0) {
          const element = e.target.files[0];
          const imageDataUrl = await this.readFile(element);
          result.push({
            imageId: 1,
            imageURL: "",
            imageData: imageDataUrl,
          });
          anwserItem.forEach((update) => {
            if (update.id === id && update.colId !== 100) {
              update.images = result;
            }
          });
        }
        break;
      case "removeImagesA":
        anwserItem.forEach((update) => {
          if (update.id === id && update.colId !== 100) {
            update.images = [];
          }
        });

        break;
      default:
        anwserItem.forEach((update) => {
          if (update.id === id && update.colId !== 100) {
            update.anwserName = e.target.value;
          }
        });
        break;
    }

    question.anwserItem = anwserItem;
    this.setState({ qtItem: question });
    this.props.addAnwser(question);
  };
  removeItem = (row, type) => {
    let question = this.props.question;
    let removeList = question.anwserItem;

    let index = 1;
    switch (type) {
      case "row":
        let anwserName = JSON.parse(removeList[0].anwserName);
        let rowItems = anwserName.row;
        // let id=rowItems.indexOf(e=>e.rowId===row.rowId);
        rowItems.splice(row.rowId - 1, 1);
        rowItems.forEach((u) => {
          if (u.rowId !== 100) u.rowId = index;
          index++;
        });
        anwserName.row = rowItems;
        removeList[0].anwserName = JSON.stringify(anwserName);
        break;
      case "column":
        anwserName = JSON.parse(removeList[0].anwserName);
        let columnItems = anwserName.column;
        columnItems.splice(row.colId - 1, 1);
        columnItems.forEach((u) => {
          if (u.colId !== 100) u.colId = index;
          index++;
        });
        anwserName.column = columnItems;
        removeList[0].anwserName = JSON.stringify(anwserName);
        break;
      default:
        removeList.splice(removeList.indexOf(row), 1);
        removeList.forEach((u) => {
          if (u.id < 99) u.id = index;
          index++;
        });
        break;
    }

    question.anwserItem = removeList;
    this.props.addAnwser(question);
  };
  AnswerGridSelect = (row) => {
    const rowItems = JSON.parse(row.anwserName).row,
      columnItems = JSON.parse(row.anwserName).column;
    let rows = [],
      columns = [];
    rowItems.forEach((element) => {
      rows.push(
        <div style={{ marginTop: 5 }} className="p-d-flex">
          <InputText
            value={element.rowName}
            // onKeyUp={(e) => (row.id === 100 && e.target.keyCode === 13) ? this.onClickInput(row.anwserType) : this.noAction()}
            onClick={() => {
              element.rowId === 100
                ? this.onClickInput(row.anwserType, "row")
                : this.noAction();
            }}
            onChange={(e) => this.onChangeItem(e, element.rowId, "row")}
            className="p-mr-2"
            placeholder={this.props.language["options"] || "l_options"}
          />
          <i
            style={{
              display: element.rowId === 100 ? "none" : "flex",
              position: "absolute",
              float: "right",
              left: "50%",
              marginTop: 8,
            }}
            onClick={() => this.removeItem(element, "row")}
            className="pi pi-times"
          />
        </div>
      );
    });
    columnItems.forEach((element) => {
      columns.push(
        <div style={{ marginTop: 5 }} className="p-d-flex">
          <InputText
            value={element.colName}
            // onKeyUp={(e) => (row.id === 100 && e.target.keyCode === 13) ? this.onClickInput(row.anwserType) : this.noAction()}
            onClick={() => {
              element.colId === 100
                ? this.onClickInput(row.anwserType, "column")
                : this.noAction();
            }}
            onChange={(e) => this.onChangeItem(e, element.colId, "column")}
            className="p-mr-2"
            placeholder={this.props.language["options"] || "l_options"}
          />
          <i
            style={{
              display: element.colId === 100 ? "none" : "flex",
              position: "absolute",
              float: "right",
              right: 26,
              marginTop: 8,
            }}
            onClick={() => this.removeItem(element, "column")}
            className="pi pi-times"
          />
        </div>
      );
    });
    return (
      <div className="p-grid">
        <div className="p-col-6">
          <div className="p-col-12" style={{ textAlign: "center" }}>
            <strong>Hàng</strong>{" "}
          </div>
          {rows}
        </div>
        <div className="p-col-6">
          <div className="p-col-12" style={{ textAlign: "center" }}>
            <strong>Cột</strong>{" "}
          </div>
          {columns}
        </div>
      </div>
    );
  };
  AnswerAddress = (row) => {
    // ?
    return (
      <div style={{ margin: 5 }} className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-12 p-md-12" style={{ marginBottom: 10 }}>
          <label>{row.anwserName}</label>
          {row?.id === 1 ? (
            <InputText
              value={row.anwserName}
              disabled
              placeholder={this.props.language["address"] || "l_address"}
            />
          ) : (
            <Dropdown
              disabled
              value={row.anwserName}
              showClear
              placeholder={row.anwserName}
            />
          )}
        </div>
      </div>
    );
  };
  AnswerDropdown = (row) => {
    // ?
    return (
      <div style={{ margin: 5 }} className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-12 p-md-12" style={{ marginBottom: 10 }}>
          <Chips
            style={{ width: "100%" }}
            onChange={(e) => {
              this.onChangeItem(e, null, "dropdownQ");
            }}
            value={row.anwserName !== "" ? JSON.parse(row.anwserName) : ""}
          ></Chips>
        </div>
      </div>
    );
  };
  AnswerAudio = (row, item) => {
    return (
      <div className="field grid">
        <div className="col-12 md:col-6 lg:col-3">
          <FaFileAudio size={50}></FaFileAudio>
        </div>
      </div>
    );
  };
  onClickItem = (typeId) => {
    // ?
    const item = {
      id: 1,
      anwserName: "",
      anwserType: typeId,
      Add: false,
      anwserValue: "",
      nextStep: -1,
      stepName: "",
      max: null,
      min: null,
      images: [],
    };
    const itemOther = {
      id: 99,
      anwserName: "Other",
      anwserType: typeId,
      Add: true,
      anwserValue: "",
      ortherValue: "",
      nextStep: -1,
      stepName: "",
      max: null,
      min: null,
    };
    const itemAdd = {
      id: 100,
      anwserName: "Add new",
      anwserType: typeId,
      Add: true,
      anwserValue: "",
      nextStep: -1,
      stepName: "",
      max: null,
      min: null,
    };

    let anwserName = {
      row: [
        { rowId: 1, rowName: "Row 1", rowValue: "", required: false },
        { rowId: 100, rowName: "add row", rowValue: "" },
      ],
      column: [
        { colId: 1, colName: "Column 1", colValue: "" },
        { colId: 100, colName: "add column", colValue: "" },
      ],
    };
    const itemGrid = {
      id: 1,
      anwserName: JSON.stringify(anwserName),
      anwserType: typeId,
      dropdown: [],
      Add: false,
      anwserValue: [],
      required: null,
    };

    let question = this.props.question;
    let anwserItem = [];
    switch (typeId) {
      case 4:
      case 5:
        anwserItem.push(item, itemAdd, itemOther);
        break;
      case 9:
      case 10:
        anwserItem.push(itemGrid);
        question.questionType = 101;
        break;
      case 11:
        const item2 = JSON.parse(JSON.stringify(item));
        const item3 = JSON.parse(JSON.stringify(item));
        const item4 = JSON.parse(JSON.stringify(item));
        item.anwserName = "address";
        item2.id = 2;
        item2.anwserName = "province";
        item3.id = 3;
        item3.anwserName = "district";
        item4.id = 4;
        item4.anwserName = "town";
        anwserItem.push(item, item2, item3, item4);
        break;
      default:
        anwserItem.push(item);
        break;
    }

    question.anwserItem = anwserItem;
    this.props.addAnwser(question);
  };
  removeGoTo = (row) => {
    let question = this.props.question;
    let answers = question.anwserItem;
    answers[row.id - 1].nextStep = -1;
    answers[row.id - 1].stepName = "";
    question.anwserItem = answers;
    this.props.addAnwser(question);
  };
  optionGridTypeTemplate(option) {
    return (
      <>
        <i style={{ marginLeft: 5 }} className={option.class} />
        <div style={{ display: "inline", marginLeft: 15 }}>{option.name}</div>
      </>
    );
  }
  selectedGridTypeTemplate(option, props) {
    if (option) {
      return (
        <div>
          <i style={{ marginLeft: 5 }} className={option.class} />
          <div style={{ display: "inline", marginLeft: 15 }}>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  }
  render() {
    const item = this.props.question;
    const anwserItem = item.anwserItem;

    let images = [];
    if (item?.images?.length > 0) {
      item.images.forEach((element) => {
        images.push(
          <div style={{ display: "inline-flex" }}>
            <img
              alt="banner"
              style={{ height: 125, marginRight: 5, marginBottom: 5 }}
              src={element.imageData || element.imageURL}
            ></img>
            <Button
              style={{ position: "absolute" }}
              onClick={(e) => {
                this.onChangeItem(e, element.imageId, "removeImagesQ");
              }}
              tooltip="Remove"
              icon="pi pi-trash"
              className="p-button-sm p-button-rounded p-button-text p-button-danger"
            />
          </div>
        );
      });
    }

    let uiAnwser = [];
    anwserItem.forEach((e) => {
      switch (e.anwserType) {
        case 1:
          uiAnwser.push(this.AnswerInput(e));
          break;
        case 2:
          uiAnwser.push(this.AnswerInputArea(e));
          break;
        case 3:
          uiAnwser.push(this.AnswerNumber(e, item));
          break;
        case 4:
          uiAnwser.push(this.AnswerMultiChoose(e));
          break;
        case 5:
          uiAnwser.push(this.AnswerSelected(e));
          break;
        case 6:
          uiAnwser.push(this.AnswerDate(e, item));
          break;
        case 7:
          uiAnwser.push(this.AnswerImage(e, item));
          break;
        case 8:
          uiAnwser.push(this.AnswerCamera(e, item));
          break;
        case 10:
          uiAnwser.push(this.AnswerGridSelect(e));
          break;
        case 11:
          uiAnwser.push(this.AnswerAddress(e));
          break;
        case 12:
        case 13:
          uiAnwser.push(this.AnswerDropdown(e));
          break;
        case 14:
          uiAnwser.push(this.AnswerVideo(e, item));
          break;
        case 15:
          uiAnwser.push(this.AnswerAddVideo(e, item));
          break;
        case 16:
          uiAnwser.push(this.AnswerAudio(e, item));
          break;
        default:
          break;
      }
    });
    let questionType = [];
    questionType.push(
      {
        label: `${this.props.language["show_answer"] || "l_show_answer"}`,
        id: 1,
        icon: "pi pi-ellipsis-h",
        command: () => {
          this.onClickItem(1);
        },
      },
      {
        label: `${this.props.language["paragraph"] || "l_paragraph"}`,
        id: 2,
        icon: "pi pi-align-left",
        command: () => {
          this.onClickItem(2);
        },
      },
      {
        label: `${this.props.language["number"] || "l_number"}`,
        id: 3,
        icon: "pi pi-align-left",
        command: () => {
          this.onClickItem(3);
        },
      },
      {
        label: `${this.props.language["multi_select"] || "l_multi_select"}`,
        id: 4,
        icon: "pi pi-check-square",
        command: () => {
          this.onClickItem(4);
        },
      },
      {
        label: `${this.props.language["select_one"] || "l_select_one"}`,
        id: 5,
        icon: "pi pi-check-circle",
        command: () => {
          this.onClickItem(5);
        },
      },
      {
        label: `${this.props.language["date"] || "l_date"}`,
        id: 6,
        icon: "pi pi-calendar-plus",
        command: () => {
          this.onClickItem(6);
        },
      },
      {
        label: `${this.props.language["audio"] || "l_audio"}`,
        id: 16,
        icon: "pi pi-volume-up",
        command: () => {
          this.onClickItem(16);
        },
      },
      {
        label: `${this.props.language["images"] || "l_images"}`,
        id: 7,
        icon: "pi pi-images",
        command: () => {
          this.onClickItem(7);
        },
      },
      //   {
      //     label: `${this.props.language["webcam"] || "l_webcam"}`,
      //     id: 8,
      //     icon: "pi pi-camera",
      //     command: () => {
      //       this.onClickItem(8);
      //     },
      //   },
      {
        label: `${this.props.language["grid_data"] || "l_grid_data"}`,
        id: 10,
        icon: "pi pi-th-large",
        command: () => {
          this.onClickItem(10);
        },
      },
      // { label: `${this.props.language["grid_multi_select"] || "l_grid_multi_select"}`, id: 10, icon: 'pi pi-th-large', command: () => { this.onClickItem(10) } },
      {
        label: `${this.props.language["address"] || "l_address"}`,
        id: 11,
        icon: "pi pi-directions",
        command: () => {
          this.onClickItem(11);
        },
      },
      {
        label: `${this.props.language["dropdown"] || "l_dropdown"}`,
        id: 11,
        icon: "pi pi-list",
        command: () => {
          this.onClickItem(12);
        },
      },
      {
        label: `${this.props.language["multiselect"] || "l_multi_select"}`,
        id: 11,
        icon: "pi pi-list",
        command: () => {
          this.onClickItem(13);
        },
      }
    );
    return (
      <div className="p-grid" key={item.questionId}>
        <div className="p-col-12">
          <div className="p-grid">
            <div className="p-col-fixed" style={{ width: 25, margin: "auto" }}>
              <Button
                key={item.indexRow}
                style={{ paddingLeft: 0, width: 31 }}
                className="p-button-rounded  p-button-text"
                label={item.indexRow}
              />
            </div>
            <div className="p-col">
              <span
                style={{ width: "100%" }}
                className="p-mr-2 p-input-icon-right"
              >
                <i
                  className="pi pi-times"
                  onClick={() => this.props.removeQuestion(item)}
                ></i>
                <InputTextarea
                  id={item.questionId}
                  rows={2}
                  autoResize
                  onChange={(e) => this.props.onTextChanged(e, item.questionId)}
                  value={item.questionName}
                />
              </span>
            </div>
            <div className="p-col-fixed" style={{ width: 50, margin: "auto" }}>
              <Button
                icon="pi pi-images"
                tooltip="Add images"
                onClick={() => this.onChooseImage("imagesQ" + item.questionId)}
                className="p-button-rounded p-button-primary p-button-text p-button-lg"
              />
              <input
                type="file"
                accept="image/*"
                multiple
                ref={(input) => (this["imagesQ" + item.questionId] = input)}
                onChange={(e) => {
                  this.onChangeItem(e, null, "imagesQ");
                }}
                style={{ display: "none" }}
              ></input>
            </div>
            <div className="p-col-fixed" style={{ width: 50, margin: "auto" }}>
              <Menu
                model={questionType}
                popup
                ref={(el) => (this.menu = el)}
                id="popup_menu"
              />
              <Button
                className="p-button-secondary"
                icon="pi pi-sliders-h"
                style={{ margin: "auto", height: "fit-content" }}
                onClick={(event) => this.menu.toggle(event)}
                aria-controls="popup_menu"
                aria-haspopup
              />
            </div>
          </div>
        </div>
        {images.length !== 0 && (
          <div className="p-col-12">
            <div className="p-grid">
              <div
                className="p-col-fixed"
                style={{ width: 25, margin: "auto" }}
              ></div>
              <div className="p-col">{images}</div>
              <div
                className="p-col-fixed"
                style={{ width: 100, margin: "auto" }}
              ></div>
            </div>
          </div>
        )}
        <div className="p-col-12" style={{ paddingLeft: 30 }}>
          {uiAnwser}
        </div>
        <div
          className="p-col-12"
          style={{ borderTop: "solid 1px #CDDEFF", marginRight: 15 }}
        >
          <div className="p-grid">
            <div className="p-col-3">
              {this.props.question.anwserItem[0]?.anwserType === 10 ? (
                <Dropdown
                  value={this.props.question.questionType}
                  options={lstOption}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    this.onChangeItem(e, null, "questionType");
                  }}
                  optionLabel="name"
                  placeholder="Select a type"
                  valueTemplate={this.selectedGridTypeTemplate}
                  itemTemplate={this.optionGridTypeTemplate}
                />
              ) : null}
            </div>
            <div className="p-col-4">
              {this.props.question.questionType === 106 ? (
                <Chips
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    this.onChangeItem(e, null, "dropdown");
                  }}
                  value={this.props.question.anwserItem[0]?.dropdown}
                />
              ) : null}
            </div>
            <div className="p-col-5">
              <div className="p-d-flex" style={{ float: "right" }}>
                <div className="p-mr-2">
                  <label>
                    {" "}
                    {item.required ? "Bắt buộc" : "Không bắt buộc"}
                  </label>
                </div>
                <div className="p-mr-2">
                  <InputSwitch
                    checked={item.required}
                    className="p-button-success"
                    onChange={(e) =>
                      this.props.handleChangeRequired(e, this.props.index)
                    }
                  />
                </div>
                <div
                  className="p-mr-2"
                  style={{ borderLeft: "solid 1px #CDDEFF", marginRight: 15 }}
                >
                  <label style={{ paddingLeft: 5 }}> Kết thúc </label>
                </div>
                <div className="p-mr-2">
                  <ToggleButton
                    className="p-button-sm"
                    checked={item.isEnd}
                    onChange={(e) =>
                      this.props.handleChangeIsEnd(e, this.props.index)
                    }
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning p-button-outlined" /> */}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(QuestionSetup);
