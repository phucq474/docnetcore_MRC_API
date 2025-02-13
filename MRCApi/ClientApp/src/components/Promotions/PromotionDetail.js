import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { actionCreatorsPromotion } from "../../store/PromotionController";
import { ProgressBar } from "primereact/progressbar";

class PromotionDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      details: [],
    };
  }
  // componentWillReceiveProps(nextProps) {
  //     if (nextProps.reCall !== this.props.reCall) {
  //         const data = nextProps.dataInput;
  //         this.props.DisplayController.GetDisplayDetail(data)
  //             .then(
  //                 () => {
  //                     this.setState({
  //                         details: this.props.details
  //                     })
  //                 }
  //             )
  //     }
  // }
  showProduct = (rowData) => {
    return (
      <div>
        <label>
          <strong>{rowData.shopCode}</strong>
        </label>{" "}
        <br></br>
        <label>{rowData.shopName} </label>
      </div>
    );
  };
  showCheckBox = (rowData, id) => {
    return <Checkbox checked={rowData[id] ? true : false} />;
  };
  componentDidMount() {
    this.setState({
      loading: true,
    });
    const data = this.props.dataInput;
    this.props.PromotionController.DetailPromotion(data).then(() => {
      this.setState({
        details: this.props.detailPromotion,
      });
    });
    this.setState({
      loading: false,
    });
  }
  render() {
    const {
      handleActionRow,
      insertDataRow,
      rowDataChild,
      setSelectedRow,
      rowSelection,
    } = this.props;
    return (
      <div className="p-fluid" style={{ height: 550 }}>
        {this.state.loading == true ? (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "5px" }}
          ></ProgressBar>
        ) : null}
        <DataTable
          className="p-datatable-striped"
          scrollable
          rowGroupMode="subheader"
          groupField="catInfo"
          sortMode="single"
          rowGroupHeaderTemplate={(rowData) => {
            return (
              <Button
                className="p-button-success p-button-outlined btn__hover"
                label={rowData.catInfo}
                style={{ width: "max-content", float: "left", cursor: "auto" }}
              />
            );
          }}
          rowGroupFooterTemplate={() => {}}
          value={this.state.details}
          scrollHeight="450px"
          style={{ fontSize: "13px", marginTop: "10px" }}
          // onSelectionChange={(e) => setSelectedRow(e.value, rowDataChild)}
          // selection={rowSelection}
          // key={rowDataChild.stt}
        >
          {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
          <Column header="No." field="rowNum" style={{ width: "60px" }} />
          <Column
            filter
            header={this.props.language["promotion_name"] || "l_promotion_name"}
            field="promotionName"
          />
          <Column
            filter
            header={this.props.language["promotion_type"] || "l_promotion_type"}
            field="promotionType"
            style={{ width: 100 }}
          />
          <Column
            filter
            header={this.props.language["from_date"] || "l_from_date"}
            field="fromDate"
            style={{ width: 100 }}
          />
          <Column
            filter
            header={this.props.language["to_date"] || "l_to_date"}
            field="toDate"
            style={{ width: 100 }}
          />
          <Column
            filter
            body={(rowData) => this.showCheckBox(rowData, "promotion")}
            header={this.props.language["promotion"] || "l_promtion"}
            style={{ width: 80, textAlign: "center" }}
          />
          <Column
            filter
            //body={(rowData) => this.showCheckBox(rowData, "locationValue")}
            header={this.props.language["location_value"] || "l_location_value"}
            field="locationValue"
            style={{ width: 80, textAlign: "center" }}
          />
          <Column
            filter
            header={this.props.language["comment"] || "l_comment"}
            field="comment"
            style={{ width: 100 }}
          />
          {/* <Column filter header={insertDataRow} body={(rowData) => handleActionRow(rowData, rowDataChild, this.props.details)} style={{ width: '70px' }} /> */}
        </DataTable>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    detailPromotion: state.promotion.detailPromotion,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    PromotionController: bindActionCreators(actionCreatorsPromotion, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
