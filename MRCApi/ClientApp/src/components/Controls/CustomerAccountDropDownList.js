import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {getListDealer} from '../../store/DealerController';
import { CustomerCreateAction } from '../../store/CustomerController';
import { MultiSelect } from 'primereact/multiselect';
import e from '@toast-ui/react-image-editor';

class CustomerAccountDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }

    componentDidMount() {
        this.props.CustomerController.GetAccountList(this.props.accId)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.accId !== this.props.accId) {
            this.props.CustomerController.GetAccountList(nextProps.accId)
        }
    }

    render() {
        const accounts = this.props.accountList ? this.props.accountList : [];
        let result = [];
        if (accounts.length > 0) {
            accounts.forEach(element => {
                result.push({
                    name: element.name,
                    value: {
                        name: element.name,
                        code: element.code,
                        id: element.id,
                        key: element.id
                    }
                });
            });
        }
        return (
            this.props.mode === 'single' ?
                <Dropdown
                    key={result.value}
                    style={{ width: '100%' }}
                    options={result}
                    onChange={(e) => this.handleChange(e)}
                    value={this.props.value}
                    placeholder={this.props.language["select_an_account"] || "l_select_an_account"}
                    optionLabel="name"
                    filter={true}
                    filterPlaceholder={this.props.language["select_an_account"] || "l_select_an_account"}
                    filterBy="name"
                    showClear={true}
                    editable={this.props.edit}
                />
                :
                <MultiSelect
                    key={result.value}
                    style={{ width: '100%' }}
                    options={result}
                    onChange={this.handleChange}
                    value={this.props.value}
                    placeholder={this.props.language["select_an_account"] || "l_select_an_account"}
                    optionLabel="name"
                    filter={true}
                    disabled={this.props.disabled}
                    filterPlaceholder={this.props.language["search_an_account"] || "l_search_an_account"}
                    filterBy="name"
                    showClear={true}
                    editable={this.props.edit}
                />

        );
    }
}
function mapStateToProps(state) {
    return {
        accountList: state.customer.accountList,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerAccountDropDownList);