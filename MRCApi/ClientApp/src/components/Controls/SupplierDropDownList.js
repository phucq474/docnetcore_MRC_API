import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {getListDealer} from '../../store/DealerController';
import { actionCreatorsSuppliers } from '../../store/SuppliersController';

class SupplierDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const suppliers = [...this.props.getListSuppliers];
        if (suppliers.length === 0)
            this.props.SupplierController.GetListSuppliers();
    }
    render() {
        const suppliers = [...this.props.getListSuppliers];
        let result = [];
        if (suppliers.length > 0) {
            suppliers.forEach(element => {
                result.push({ name: element.supplierName, value: element.id });
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
        getListSuppliers: state.suppliers.getListSuppliers,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SupplierController: bindActionCreators(actionCreatorsSuppliers, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SupplierDropDownList);