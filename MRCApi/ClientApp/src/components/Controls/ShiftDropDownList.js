import React, { PureComponent } from "react";
import { Dropdown } from "primereact/dropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { WorkingPlanCreateAction } from "../../store/WorkingPlanController";
import { EmployeeActionCreate } from "../../store/EmployeeController";
import { getAccountId } from "../../Utils/Helpler";

class ShiftDropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { employeeTypes: [], shiftLists: [] };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }
  componentDidMount() {
    this.props.WorkingPlanController.GetShifts(this.props.accId);
    this.props.EmployeeController.GetEmployeeType(this.props.accId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accId !== this.props.accId) {
      this.props.WorkingPlanController.GetShifts(nextProps.accId);
      this.props.EmployeeController.GetEmployeeType(nextProps.accId);
    }
  }

  render() {
    let typeName = null;
    const shiftLists = this.props.shiftLists ? this.props.shiftLists : [];

    let result = [];
    if (shiftLists.length > 0) {
      let shifts = [];
      // if (this.props.typeId > 0 && (getAccountId() === 3 || this.props.accId === 3)) {
      //     const employeeTypes = this.props.employeeTypes ? this.props.employeeTypes : [];
      //     employeeTypes.forEach(element => {
      //         if (this.props.typeId === element.id) {
      //             typeName = element.group;
      //         }
      //     });
      //     shifts = shiftLists.filter(item => (item.shiftGroup === typeName || item.shiftGroup === null)
      //         && (item.refCode === this.props.type || this.props.type === null));

      // }
      // else {
      //     shifts = shiftLists;
      // }

      shifts = shiftLists;

      shifts.forEach((element) => {
        result.push({
          name: element.shiftCode + " (" + element.shiftName + ")",
          value: element.shiftCode,
          shiftName: element.shiftName,
        });
      });
    }
    if (this.props.type === "OFF")
      result.push({ name: "None", value: "-1", shiftName: "None" });
    if (this.props.shifDefault !== null) {
      const shifDefault = shiftLists.filter(
        (item) => item.shiftCode === this.props.shiftDefault
      );
      shifDefault.forEach((element) => {
        result.push({
          name: element.shiftCode + " (" + element.shiftName + ")",
          value: element.shiftCode,
          shiftName: element.shiftName,
        });
      });
    }
    return (
      <Dropdown
        key={result.value}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_an_option"] || "l_select_an_option"
        }
        optionLabel="name"
        disabled={this.props.disabled}
        filterPlaceholder={
          this.props.language["select_an_option"] || "l_select_an_option"
        }
        filterBy="name"
        filter
        showClear={true}
      />
    );
  }
}
ShiftDropDownList.defaultProps = {
  type: null,
  disabled: false,
  typeId: 0,
  shiftDefault: null,
};
function mapStateToProps(state) {
  return {
    shiftLists: state.workingPlans.shiftLists,
    language: state.languageList.language,
    employeeTypes: state.employees.employeeTypes,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    WorkingPlanController: bindActionCreators(
      WorkingPlanCreateAction,
      dispatch
    ),
    EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ShiftDropDownList);
