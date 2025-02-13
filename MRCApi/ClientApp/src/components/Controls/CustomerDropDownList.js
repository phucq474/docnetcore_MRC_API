import React, { PureComponent } from "react";
import { Dropdown } from "primereact/dropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import {getListDealer} from '../../store/DealerController';
import { CustomerCreateAction } from "../../store/CustomerController";
import { MultiSelect } from "primereact/multiselect";

class CustomerDropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }
  handleBindData() {
    this.props.CustomerController.GetCustomerList(this.state.accId);
  }
  componentDidMount() {
    this.props.CustomerController.GetCustomerList(this.props.accId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.accId !== this.props.accId) {
      this.props.CustomerController.GetCustomerList(nextProps.accId);
    }
  }

  render() {
    const customers = this.props.customerList ? this.props.customerList : [];
    let result = [];
    if (customers.length > 0) {
      customers.forEach((element) => {
        if (element.accountName) {
          result.push({
            name:
              element.customerCode +
              " - " +
              element.customerName +
              " - (" +
              element.accountName +
              ")",
            value: element.id,
          });
        } else {
          result.push({
            name: element.customerCode + " - " + element.customerName,
            value: element.id,
          });
        }
      });
    }
    return this.props.mode === "single" ? (
      <Dropdown
        key={result.id}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_an_customer"] || "l_select_an_customer"
        }
        optionLabel="name"
        filter={true}
        filterPlaceholder={
          this.props.language["select_an_customer"] || "l_select_an_customer"
        }
        filterBy="name"
        showClear={true}
        disabled={this.props.disabled}
      />
    ) : (
      <MultiSelect
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_an_customer"] || "l_select_an_customer"
        }
        optionLabel="name"
        filter={true}
        disabled={this.props.disabled}
        filterPlaceholder={
          this.props.language["search_an_customer"] || "l_search_an_customer"
        }
        filterBy="name"
        showClear={true}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    customerList: state.customer.customerList,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerDropDownList);
