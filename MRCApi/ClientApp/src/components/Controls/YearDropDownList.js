import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { connect } from 'react-redux';

class YearDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            minYear: 2021,
            maxYear: new Date().getFullYear() + 1,
            year: new Date().getFullYear()
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }

    render() {
        let result = [];
        for (let index = this.state.minYear; index < this.state.maxYear + 1; index++) {
            var objValue = {
                name: index,
                value: index
            }
            result.push(objValue);

        }

        return (
            <Dropdown
                value={this.props.value}
                options={result}
                optionLabel="name"
                id="year"
                style={{ width: '100%' }}
                showClear
                onChange={this.handleChange}
                placeholder={this.props.language["select_a_year"] || "l_select_a_year"}
                disabled={this.props.disabled} />

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
export default connect(mapStateToProps)(YearDropDownList);