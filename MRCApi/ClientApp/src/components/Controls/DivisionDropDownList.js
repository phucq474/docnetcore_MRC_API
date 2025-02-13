import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {getListDealer} from '../../store/DealerController';
import { actionCreatorsPromotion } from '../../store/PromotionController';
import { MultiSelect } from 'primereact/multiselect';

class DivisionDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const divisions = [...this.props.divisionList];
        if (divisions.length === 0)
            this.props.PromotionController.GetDivisionList(null);
    }
    render() {
        const divisions = [...this.props.divisionList];
        let result = [];
        if (divisions.length > 0) {
            divisions.forEach(element => {
                result.push({ name: element.name, value: element.id });
            });
        }
        return (
            this.props.mode === 'single' ?
                <Dropdown
                    key={result.id}
                    style={{ width: '100%' }}
                    options={result}
                    onChange={this.handleChange}
                    value={this.props.value}
                    placeholder={this.props.language["select_an_division"] || "l_select_an_division"}
                    optionLabel="name"
                    filter={true}
                    filterPlaceholder={this.props.language["select_an_division"] || "l_select_an_division"}
                    filterBy="name"
                    showClear={true}
                />
                :
                <MultiSelect
                    key={result.value}
                    style={{ width: '100%' }}
                    options={result}
                    onChange={this.handleChange}
                    value={this.props.value}
                    placeholder={this.props.language["select_an_division"] || "l_select_an_division"}
                    optionLabel="name"
                    filter={true}
                    disabled={this.props.disabled}
                    filterPlaceholder={this.props.language["select_an_division"] || "l_select_an_division"}
                    filterBy="name"
                    showClear={true}
                />

        );
    }
}
function mapStateToProps(state) {
    return {
        divisionList: state.promotion.divisionList,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        PromotionController: bindActionCreators(actionCreatorsPromotion, dispatch),   
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DivisionDropDownList);