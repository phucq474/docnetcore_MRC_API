import React, {  PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MasterListActionCreate } from '../../store/MasterListDataController';

class BankDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const banklist = [...this.props.banklist];
        if (banklist.length === 0)
            this.props.MasterListDataController.GetBankList();
    }
    render() {
        const banklist = [...this.props.banklist];
        let result = [];
        if (banklist.length > 0) {
            banklist.forEach(element => {
                    result.push({ name: element.bankAlias, value: element.id });
            });
        }
        return (
            <Dropdown
                key={result.id} 
                style={{ width: '100%' }} 
                options={result}
                onChange={this.handleChange} 
                value={this.props.value}
                placeholder={this.props.language["select_an_option"] || "l_select_an_option"} 
                optionLabel="name"
                filter={true} 
                filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                filterBy="name" 
                showClear={true}
            />

        );
    }
}
function mapStateToProps(state) {
    return {
        banklist: state.masterListDatas.banklist,
        language: state.languageList.language,
        employeePermission: state.permission.employeePermission,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        MasterListDataController: bindActionCreators(MasterListActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BankDropDownList);