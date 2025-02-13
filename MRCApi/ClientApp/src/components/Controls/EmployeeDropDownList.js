import React, { PureComponent } from "react";
import { MultiSelect } from "primereact/multiselect";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";

class EmployeeDropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }
  static propTypes = {
    typeId: PropTypes.number,
    type: PropTypes.string,
    parentId: PropTypes.any,
  };
  handleChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }
  componentDidMount() {
    this.props.EmployeeController.GetEmployeeDDL(this.props.accId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.accId !== this.props.accId) {
      this.props.EmployeeController.GetEmployeeDDL(nextProps.accId);
    }
  }

  render() {
    const employeeDDL = this.props.employeeDDL ? this.props.employeeDDL : [];
    let result = [],
      str = "";
    if (employeeDDL.length > 0) {
      if (this.props.typeId > 0) {
        if (
          this.props.parentId !== null &&
          this.props.parentId !== "" &&
          this.props.parentId !== 0
        ) {
          if (this.props.mode === "single") {
            employeeDDL
              .filter((i) => i.typeId === this.props.typeId)
              .forEach((element) => {
                if (element.parentId === parseInt(this.props.parentId))
                  result.push({
                    name: element.fullName,
                    value: element.id,
                    key: element.id,
                  });
              });
          } else {
            let lstParent = "";
            if (this.props.parentId && this.props.parentId.length > 0) {
              this.props.parentId.forEach((element) => {
                lstParent = lstParent + element + " ";
              });
            }

            employeeDDL
              .filter((i) => i.typeId === this.props.typeId)
              .forEach((element) => {
                if (lstParent.trim().includes(element.parentId))
                  result.push({
                    name: element.fullName,
                    value: element.id,
                    key: element.id,
                  });
              });
          }
        } else {
          employeeDDL.forEach((element) => {
            if (element.typeId === this.props.typeId)
              result.push({
                name: element.fullName,
                value: element.id,
                key: element.id,
              });
          });
        }
      }
      else if (this.props.parentId !== null && this.props.parentId !== "" && this.props.parentId !== 0) {
        if (this.props.mode === "single") {
          employeeDDL.forEach((element) => {
            // if (element.parentId === this.props.parentId)
            if (element.parentId === parseInt(this.props.parentId))
              result.push({
                name: element.fullName,
                value: element.id,
                key: element.id,
              });
          });
        } else {
          let lstParent = "";
          if (this.props.parentId && this.props.parentId.length > 0) {
            this.props.parentId.forEach((element) => {
              lstParent = lstParent + element + " ";
            });
            employeeDDL.forEach((element) => {
              // if (element.parentId === this.props.parentId)
              if (lstParent.trim().includes(element.parentId))
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
          } else {
            employeeDDL.forEach((element) => {
              // if (element.parentId === this.props.parentId)
              if (element.parentId === parseInt(this.props.parentId))
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
          }
        }
      } else {
        switch (this.props.type) {
          case "SR":
            employeeDDL.forEach((element) => {
              if (element.group === "SR")
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "PG":
            employeeDDL.forEach((element) => {
              if (element.group === "PG")
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "Leader":
            employeeDDL.forEach((element) => {
              if (element.group === "Leader")
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "SUP":
            employeeDDL.forEach((element) => {
              if (element.group === "SUP")
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "SUP-Leader":
            str = "SUP Leader KAM KAS";
            employeeDDL.forEach((element) => {
              if (str.includes(element.group))
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "SR-PG-Leader-SUP":
            str = "SR PG Leader SUP KAS MER";
            employeeDDL.forEach((element) => {
              if (str.includes(element.group))
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          case "PG-SR":
            str = "PG SR KAS MER";
            employeeDDL.forEach((element) => {
              if (str.includes(element.group))
                result.push({
                  name: element.fullName,
                  value: element.id,
                  key: element.id,
                });
            });
            break;
          default:
            employeeDDL.forEach((element) => {
              result.push({
                name: element.fullName,
                value: element.id,
                key: element.id,
              });
            });
        }
      }
    }
    if (this.props.mode === "single")
      return (
        <Dropdown
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
          filterInputAutoFocus={false}
          disabled={this.props.disabled}
          filterPlaceholder={
            this.props.language["search_an_employee"] || "l_search_an_employee"
          }
          filterBy="name"
          showClear={true}
        />
      );
    else
      return (
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
      );
  }
}
EmployeeDropDownList.defaultProps = {
  disabled: false,
  mode: "single",
};
function mapStateToProps(state) {
  return {
    employeeDDL: state.employees.employeeDDL,
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
)(EmployeeDropDownList);
