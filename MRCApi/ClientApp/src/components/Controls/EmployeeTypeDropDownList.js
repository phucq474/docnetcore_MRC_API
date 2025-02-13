import React, { PureComponent } from "react";
import { Dropdown } from "primereact/dropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import PropTypes from "prop-types";
import { MultiSelect } from "primereact/multiselect";

class EmployeeTypeDropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }
  static propTypes = {
    type: PropTypes.string.isRequired,
  };
  handleChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }
  componentDidMount() {
    this.props.EmployeeController.GetEmployeeType(this.props.accId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accId !== this.props.accId) {
      this.props.EmployeeController.GetEmployeeType(nextProps.accId);
    }
  }

  render() {
    const employeeTypes = this.props.employeeTypes
      ? this.props.employeeTypes
      : [];
    let result = [],
      str = "";
    if (employeeTypes.length > 0) {
      switch (this.props.type) {
        case "SUP-KAM":
          str = "SUP KAM";
          employeeTypes.forEach((element) => {
            if (str.includes(element.group))
              result.push({
                name: element.typeName,
                value: element.id,
                key: element.id,
              });
          });
          break;
        case "PG-SR-Leader-SUP":
          str = "SR PG SUP Leader MER";
          employeeTypes.forEach((element) => {
            if (str.includes(element.group))
              result.push({
                name: element.typeName,
                value: element.id,
                key: element.id,
              });
          });
          break;
        case "PG-SR":
          str = "PG SR PG-Lashe MER";
          employeeTypes.forEach((element) => {
            if (str.includes(element.typeName))
              result.push({
                name: element.typeName,
                value: element.id,
                key: element.id,
              });
          });
          break;
        case "SUP":
          str = "SUP";
          employeeTypes.forEach((element) => {
            if (str.includes(element.group))
              result.push({
                name: element.typeName,
                value: element.id,
                key: element.id,
              });
          });
          break;
        default:
          employeeTypes.forEach((element) => {
            result.push({
              name: element.typeName,
              value: element.id,
              key: element.id,
            });
          });
        //result = employeeTypes;
      }
    }
    return this.props.typeDropDown === "multiple" ? (
      <MultiSelect
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_an_employee"] || "l_select_an_employee"
        }
        optionLabel="name"
        filter={true}
        disabled={this.props.disabled}
        filterPlaceholder={
          this.props.language["search_an_employee"] || "l_search_an_employee"
        }
        filterBy="name"
        showClear={true}
      />
    ) : (
      <Dropdown
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_a_position"] || "l_select_a_position"
        }
        optionLabel="name"
        filter={true}
        filterPlaceholder={
          this.props.language["select_a_position"] || "l_select_a_position"
        }
        filterBy="name"
        showClear={true}
        isDisabled={this.props.isDisabled}
        disabled={this.props.disabled}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    employeeTypes: state.employees.employeeTypes,
    loading: state.employees.loading,
    errors: state.employees.errors,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeTypeDropDownList);
