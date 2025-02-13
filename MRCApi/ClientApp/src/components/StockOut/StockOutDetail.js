import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { actionCreatorStockOut } from "../../store/StockOutController";
import { formatCurrency, getLogin } from "../../Utils/Helpler";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";
class OOLResultDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      details: [],
    };
  }
  componentDidMount() {
    const data = this.props.dataInput;
    this.props.StockOutController.DetailStockOut(data, this.props.accId).then(
      () => {
        this.setState({
          details: this.props.detailStockOut,
        });
      }
    );
  }
  priceBodyTemplate(rowData) {
    return <label>{formatCurrency(rowData.price)}</label>;
  }
  amountBodyTemplate(rowData) {
    return <label>{formatCurrency(rowData.amount)}</label>;
  }
  templateQuantity = (options, colName) => {
    return (
      <div>
        <InputNumber
          value={options.rowData[`${colName}`]}
          id={colName}
          onValueChange={(e) =>
            this.handleChangeQuantity(
              options.rowData,
              e.target.value,
              options.rowIndex,
              colName
            )
          }
        />
      </div>
    );
  };
  handleChangeQuantity = (rowData, value, index, colName) => {
    let data = this.state.details;
    data[index][`${colName}`] = value;
    this.setState({
      details: data,
    });
  };
  actionButtons = (rowData, event) => {
    return (
      <div>
        {
          // this.state.permission.edit &&
          <Button
            icon="pi pi-save"
            className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
            onClick={() =>
              this.props.handleUpdateRowDialog(true, rowData, event.rowIndex)
            }
          />
        }
      </div>
    );
  };

  render() {
    if (this.state.details.length === 0)
      return (
        <ProgressSpinner
          style={{ left: "47%", top: "45%", width: "50px", height: "50px" }}
          strokeWidth="5"
          fill="#EEEEEE"
          animationDuration=".5s"
        />
      );

    return (
      <div className="p-fluid" style={{ height: 450 }}>
        <DataTable
          className="p-datatable-striped"
          scrollable
          rowGroupMode="subheader"
          groupField="brand"
          sortMode="single"
          rowGroupHeaderTemplate={(rowData) => {
            return (
              <Button
                className="p-button-success p-button-outlined btn__hover"
                label={rowData.brand}
                style={{ width: "max-content", float: "left", cursor: "auto" }}
              />
            );
          }}
          rowGroupFooterTemplate={() => {}}
          value={this.state.details}
          scrollHeight="360px"
          style={{ fontSize: "13px", marginTop: "10px" }}
          // onSelectionChange={(e) => setSelectedRow(e.value, rowDataChild)}
          // selection={rowSelection}
          key={this.props.dataInput.rowNum}
        >
          <Column header="No." field="rowNum" style={{ width: "60px" }} />
          <Column
            filter
            header={this.props.language["category"] || "l_category"}
            field="category"
            style={{ width: 120 }}
          />
          <Column
            filter
            header={this.props.language["subcategory"] || "l_subcategory"}
            field="subCategory"
            style={{ width: 120 }}
          />
          <Column
            filter
            header={this.props.language["product_code"] || "l_product_code"}
            field="productCode"
            style={{ width: "100px" }}
          />
          <Column
            filter
            header={this.props.language["product_name"] || "l_product_name"}
            field="productName"
          />
          <Column
            filter
            header={this.props.language["price"] || "l_price"}
            field="price"
            body={this.priceBodyTemplate}
            style={{ width: "100px" }}
          />
          {getLogin()?.accountName === "Fonterra" ? (
            <Column
              field="quantity"
              editor={(options) => this.templateQuantity(options, "quantity")}
              filter={true}
              style={{ width: 60, textAlign: "center" }}
              header={this.props.language["quantity"] || "l_quantity"}
            />
          ) : (
            <Column
              filter
              header={this.props.language["quantity"] || "l_quantity"}
              field="quantity"
              style={{ width: "100px" }}
            />
          )}
          <Column
            filter
            header={this.props.language["amount"] || "l_amount"}
            field="amount"
            body={this.amountBodyTemplate}
            style={{ width: "120px" }}
          />
          {getLogin()?.accountName === "Fonterra" ? (
            <Column
              body={this.actionButtons}
              header="#"
              style={{ width: 70, textAlign: "center" }}
            ></Column>
          ) : null}
        </DataTable>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    detailStockOut: state.stockout.detailStockOut,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    StockOutController: bindActionCreators(actionCreatorStockOut, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OOLResultDetail);
