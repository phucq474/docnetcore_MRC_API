import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreatorsDisplayContestResult } from "../../store/DisplayContestResultsController";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Accordion, AccordionTab } from "primereact/accordion";
import { HelpPermission } from "../../Utils/Helpler";
import { ListBox } from "primereact/listbox";
import { TabView, TabPanel } from "primereact/tabview";
import Images from "./images";
import moment from "moment";

class ResultDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingImage: false,
      activeIndex: 0,
      loading: false,
      permission: {},
      details: [],
      itemDetail: null,
      lstBrand: JSON.parse(props.dataInput.listBrand),
      selectedBrand: JSON.parse(props.dataInput.listBrand)[0].Brand,
      selectedDate: null,
    };
    this.onChangeNumberPosition = this.onChangeNumberPosition.bind(this);
    this.onCheckedKPI = this.onCheckedKPI.bind(this);
    this.handleOnSaveChange = this.handleOnSaveChange.bind(this);
    this.Alert = this.Alert.bind(this);
    this.renderTabPanel = this.renderTabPanel.bind(this);
    this.renderItemTemplate = this.renderItemTemplate.bind(this);
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.props.pageId);
    await this.setState({ permission });
  }
  componentDidMount() {
    this.handleBindData();
  }
  handleBindData() {
    let data = {
      shopId: this.props.dataInput.shopId,
      employeeId: this.props.dataInput.employeeId,
      fromDate: this.props.dataInput.fromDate,
      toDate: this.props.dataInput.toDate,
      brand: this.props.brand || null,
    };
    this.props.DisplayContestResultController.GetDetail(data).then(() => {
      const result = this.props.resultStatus;
      if (result && result.length > 0) {
        if (this.state.itemDetail !== null) {
          // const index = result.filter(
          //   (i) =>
          //     i.workDate === this.state.itemDetail.workDate &&
          //     i.brand === this.state.itemDetail.brand
          // );
          this.setState({
            details: result,
            // itemDetail: index[0],
            // selectedDate: index[0].date,
          });
        } else {
          this.setState({
            details: result,
            itemDetail: result[0],
            selectedDate: result[0].date,
          });
        }
      }
    });
  }
  handleOnSaveChange(item) {
    const dataInput = this.state.details.find((i) => i.id === item.id);
    // if (dataInput.status === null) {
    //   return this.Alert("Chưa chọn kết quả", "error");
    // } else {
    let data = {
      id: dataInput.id,
      shopId: dataInput.shopId,
      employeeId: dataInput.employeeId,
      workDate: dataInput.workDate,
      status: dataInput.status,
      remark: JSON.parse(dataInput.remark),
      comment: dataInput.comment,
      numberOfPosition: dataInput.numberOfPosition,
    };
    this.props.DisplayContestResultController.Update(data).then(() => {
      const result = this.props.updated;
      if (result?.status === 1) {
        this.handleBindData();
        return this.Alert(result?.message);
      } else {
        return this.Alert(result?.message, "error");
      }
    });
    // }
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  onChangeNumberPosition(item, e) {
    let result = [...this.state.details];
    let ind = result.findIndex((i) => i.id === item.id);

    if (ind - 1) {
      result[ind].numberOfPosition = e.value;
      this.setState({ details: result });
    }
  }
  onCheckedKPI(item, e) {
    let result = [...this.state.details];
    let ind = result.findIndex((i) => i.id === item.id);

    let remark;
    if (ind > -1) {
      remark = JSON.parse(result[ind].remark);
      if (remark.length > 0) {
        const index = remark.findIndex((item) => item.Id === e.target.value);
        remark[index].Value = e.target.checked ? "True" : "False";
        // if (e.target.checked === false) {
        //   remark[index].Note = "";
        // }
        result[ind].remark = JSON.stringify(remark);
        this.setState({ details: result });
      }
    }
  }
  // onChangeCommentKPI( item, note, key) {
  //   let result=this.state.details;
  //   let ind = result.findIndex(i=>i.id===item.id);
  //   let remark;
  //   if (ind> -1) {
  //     remark = JSON.parse(result[ind].remark);
  //     if (remark.length > 0) {
  //       const index = remark.findIndex((item) => item.Id === key);
  //       remark[index].Note = note;
  //       result[ind].remark = JSON.stringify(remark);
  //       this.setState({ details: result });
  //     }
  //   }
  // }

  renderItemTemplate(brand) {
    const details = this.state.details;
    const lstUnique = details.reduce(
      (unique, item) =>
        unique.includes(item.date) ? unique : [...unique, item.date],
      []
    );
    let lstDate = [];
    lstUnique.forEach((element) => {
      lstDate.push({ name: element, value: element });
    });

    const result = this.state.details.find(
      (i) =>
        i.date === this.state.selectedDate &&
        i.brand === this.state.selectedBrand
    );

    let divSave = [],
      qcItems = [];
    if (result !== undefined) {
      if (this.state.permission?.edit)
        divSave = (
          <div className="p-col-12">
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-success"
              style={{ marginRight: "1rem", width: "auto" }}
              onClick={(e) => this.handleOnSaveChange(result)}
            />
            <i>
              {result?.createdBy &&
                moment(result.createdDate).format("HH:mm:ss DD/MM/YYYY")}
            </i>
          </div>
        );
      var objRemark = JSON.parse(result?.remark);
      if (objRemark != null) {
        qcItems = objRemark.map((item) => {
          return (
            <div className="p-col-3" key={"divQCItem_" + item.Id}>
              <Checkbox
                key={"cb" + item.Id}
                value={item.Id}
                onChange={(e) => this.onCheckedKPI(result, e)}
                checked={item.Value === "True"}
                inputId={item.Id}
                style={{ marginRight: 10 }}
              ></Checkbox>
              <label htmlFor={item.Name} className="p-checkbox-label">
                {item.Name}
              </label>
            </div>
          );
        });
      }
    }
    return (
      <div className="p-grid">
        <div className="p-field p-col-2">
          <label>{this.props.language["date"] || "l_date"}</label>
          <ListBox
            id="date"
            style={{ maxHeight: 460, overflowX: "auto" }}
            className="w-full md:w-14rem"
            value={this.state.selectedDate}
            options={lstDate}
            showClear
            onChange={(e) => {
              if (lstDate?.length > 1) {
                const item = this.state.details.find(
                  (i) =>
                    i.date === e.value && i.brand === this.state.selectedBrand
                );
                if (this.state.selectedDate !== e.value)
                  this.setState({ selectedDate: e.value, itemDetail: item });
              }
            }}
            optionLabel="name"
          />
        </div>
        <div
          className="p-col-10"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.itemDetail?.shopId > 0 && result !== undefined ? (
            <Images
              dataInput={this.state.itemDetail}
              brand={result.brand}
            ></Images>
          ) : (
            <strong> No data</strong>
          )}
        </div>
        {result !== undefined && (
          <div className="p-col-12">
            <Accordion activeIndex={0}>
              <AccordionTab header="Tiêu chí thi đua">
                <div
                  className="p-grid"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {this.state.loading && (
                    <ProgressSpinner
                      style={{
                        height: "100px",
                        width: "100%",
                        display: "flex",
                        position: "fixed",
                        top: "45%",
                      }}
                    ></ProgressSpinner>
                  )}
                </div>
                <div className="p-grid">
                  {qcItems.length > 0 && (
                    <div className="p-col-12">
                      <div
                        className="p-grid"
                        style={{
                          border: "solid 1px #888",
                          marginTop: "10px",
                          padding: "10px",
                          overflowX: "hidden",
                          maxHeight: 400,
                        }}
                      >
                        {qcItems}
                      </div>
                    </div>
                  )}
                  <div className="p-col-12">
                    <strong>
                      <i>Số lượng vị trí trưng bày: </i>
                    </strong>
                    <InputNumber
                      value={result.numberOfPosition || 0}
                      onChange={(e) => this.onChangeNumberPosition(result, e)}
                      style={{ width: 150, marginLeft: 15 }}
                    />
                  </div>
                  {divSave}
                  {/* {result.id} */}
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        )}
      </div>
    );
  }

  renderTabPanel() {
    let result = [];
    this.state.lstBrand.forEach((element) => {
      result.push(
        <TabPanel header={element.Brand}>
          {this.renderItemTemplate(element.Brand)}
        </TabPanel>
      );
    });
    return result;
  }
  render() {
    if (this.state.details?.length === 0)
      return (
        <ProgressSpinner key={"loading"} style={{ left: "45%", top: 10 }} />
      );
    else
      return (
        <>
          <Toast ref={(el) => (this.toast = el)} />
          <TabView
            activeIndex={this.state.activeIndex}
            onTabChange={(e) =>
              this.setState({
                activeIndex: e.index,
                selectedBrand: this.state.lstBrand[e.index].Brand,
              })
            }
          >
            {this.renderTabPanel()}
          </TabView>
        </>
      );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    resultStatus: state.displayContestResult.resultStatus,
    updated: state.displayContestResult.updated,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    DisplayContestResultController: bindActionCreators(
      actionCreatorsDisplayContestResult,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultDetail);
