import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreatorsShop } from '../../store/ShopController';
import PropTypes from 'prop-types';

class ShopDropDownList extends Component {
    constructor(props) {
        super(props)
        this.state = { employeeShops: [] }
        this.handleChange = this.handleChange.bind(this);
    }
    static propTypes = {
        employeeId: PropTypes.number.isRequired
    };
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    bindData = (props) => {
        let data = {
            workDate: props.workDate || null,
            position: props.positionId || null,
            supId: props.supId || null,
            employeeId: props.employeeId || null,
            area: props.area || null,
            region: props.region || null,
            province: props.province || null
        }
        this.props.ShopController.GetShopByEmployees(data, props.accId)
    }
    componentDidMount() {
        if (this.props.employeeId > 0 && !this.props.useBindData) {
            this.bindData(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.employeeId > 0 && nextProps.employeeId !== this.props.employeeId && !this.props.useBindData)
            || nextProps.accId !== this.props.accId)
            this.bindData(nextProps);

    }
    render() {
        const employeeShops = this.props.employeeShops ? this.props.employeeShops : [];
        let result = [];
        if (employeeShops.length > 0) {
            employeeShops.forEach(element => {
                result.push({ name: element.shopCode + ' - ' + element.shopName, value: element.shopId });
            });
        }
        return (
            <Dropdown
                key={result.value}
                style={{ width: '100%' }}
                options={result}
                onChange={this.handleChange}
                value={this.props.value}
                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                optionLabel="name"
                filter={true}
                disabled={this.props.disabled}
                filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                filterBy="name"
                showClear={true}
            />
        );
    }
}
ShopDropDownList.defaultProps = {
    workDate: 0,
    position: 0,
    supId: '',
    employeeId: 0,
    dealerId: 0,
    area: '',
    region: '',
    province: '',
    disabled: false
}
function mapStateToProps(state) {
    return {
        employeeShops: state.shops.employeeShops,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ShopController: bindActionCreators(actionCreatorsShop, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShopDropDownList);