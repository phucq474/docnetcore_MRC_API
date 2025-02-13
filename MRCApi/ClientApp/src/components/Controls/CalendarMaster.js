import React, { Component } from "react"
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CalendarCreateAction } from '../../store/CalendarController';
import PropTypes from 'prop-types';
import moment from 'moment'
class CalendarMaster extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minYear: 2021,
            maxYear: new Date().getFullYear() + 1,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            week: parseInt(moment(new Date()).format('W'))
        }
        this.handleChange = this.handleChange.bind(this);
    }

    static propTypes = {
        year: PropTypes.number.isRequired,
        month: PropTypes.number.isRequired,
        week: PropTypes.number.isRequired
    };

    componentDidMount() {
        const calendars = [...this.props.calendars];
        if (calendars.length === 0)
            this.props.CalendarCreateAction.GetCalendar()
    }

    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }

    getDateRangeOfWeek = function (weekNo, y) {
        let data = this.props.calendars.filter(item => item.year === this.props.year)
        let rangeIsFrom = this.props.calendars.filter(item => item.year === this.props.year && item.weekByYear === weekNo).sort();
        let rangeIsTo = this.props.calendars.filter(item => item.year === this.props.year && item.weekByYear === weekNo).sort();
        return moment(rangeIsFrom[0].date).format("DD/MM/yyyy") + " to " + moment(rangeIsTo[rangeIsTo.length - 1].date).format("DD/MM/yyyy");
    };

    render() {
        let dataYear = this.props.calendars.filter(item => item.year === this.props.year);
        let uiYear = [], uiWeek = [];
        let yearValues = [], weekValues = [];
        let uniqueValue = [];
        for (let index = this.state.minYear; index < this.state.maxYear + 1; index++) {
            var objValue = {
                name: index,
                value: index
            }
            yearValues.push(objValue);
        }
        uniqueValue.forEach(element => {
            if (element.year >= this.state.minYear && element.year <= this.state.maxYear) {
                var objValue = {
                    name: element.year,
                    value: element.year
                }
                yearValues.push(objValue);
            }
        });
        uniqueValue = dataYear.reduce((unique, o) => {
            if (!unique.some(obj => obj.weekByYear === o.weekByYear)) {
                unique.push(o);
            }
            return unique;
        }, []);

        uniqueValue.sort();

        uniqueValue.forEach(element => {
            var objValue = {
                name: 'W' + element.weekByYear + ' (' + this.getDateRangeOfWeek(element.weekByYear, this.props.year) + ')',
                value: element.weekByYear
            }
            weekValues.push(objValue);
        });
        uiYear = <div className="p-field p-col-12 p-md-3  p-sm-6">
            <label>Year</label>
            <Dropdown
                value={this.props.year}
                options={yearValues}
                optionLabel="name"
                id="year"
                style={{ width: '100%' }}
                showClear
                onChange={this.handleChange}
                placeholder={this.props.language["select_a_year"] || "l_select_a_year"} />
        </div>
        uiWeek = <div className="p-field p-col-12 p-md-3  p-sm-6">
            <label>Week</label>
            <Dropdown
                value={this.state.week}
                options={weekValues}
                optionLabel="name"
                style={{ width: '100%' }}
                showClear
                id="week"
                onChange={this.handleChange}
                placeholder={this.props.language["select_a_week"] || "l_select_a_week"}
            />
        </div>
        var controls = [];
        if (this.props.useYear)
            controls.push(uiYear);
        if (this.props.useWeek)
            controls.push(uiWeek);
        return (controls)
    }
}

function mapStateToProps(state) {
    return {
        calendars: state.calendars.calendars,
        language: state.languageList.language
    }
}

function mapDispatchToProps(dispatch) {
    return {
        CalendarCreateAction: bindActionCreators(CalendarCreateAction, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarMaster);
