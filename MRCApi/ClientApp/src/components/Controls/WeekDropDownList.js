import React, { PureComponent } from "react"
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CalendarCreateAction } from '../../store/CalendarController';
import PropTypes from 'prop-types';
import moment from 'moment'

class WeekDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear()
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const calendars = this.props.calendars;
        if (calendars.length === 0)
            this.props.CalendarCreateAction.GetCalendar()
                .then(() => {
                    const date = moment(new Date).format('YYYY-MM-DD').toString();
                    const calendar = this.props.calendars.find(item => moment(item.date).format('YYYY-MM-DD').toString() === date);
                    if (calendar !== null && calendar !== undefined)
                        this.setState({ week: calendar.weekByYear });
                });
    }
    getDateRangeOfWeek = function (weekNo) {
        let data = this.props.calendars.filter(item => item.year === this.props.year)
        let rangeIsFrom = this.props.calendars.filter(item => item.year === this.props.year && item.weekByYear === weekNo).sort();
        let rangeIsTo = this.props.calendars.filter(item => item.year === this.props.year && item.weekByYear === weekNo).sort();
        return moment(rangeIsFrom[0].date).format("DD/MM/yyyy") + " to " + moment(rangeIsTo[rangeIsTo.length - 1].date).format("DD/MM/yyyy");
    };
    render() {
        let dataYear = this.props.calendars.filter(item => item.year === this.props.year);
        let weekValues = [];
        let uniqueValue = [];
        uniqueValue = dataYear.reduce((unique, o) => {
            if (!unique.some(obj => obj.weekByYear === o.weekByYear)) {
                unique.push(o);
            }
            return unique;
        }, []);

        uniqueValue.sort();

        uniqueValue.forEach(element => {
            var objValue = {
                name: 'W' + element.weekByYear + ' (' + this.getDateRangeOfWeek(element.weekByYear) + ')',
                value: element.weekByYear
            }
            weekValues.push(objValue);
        });

        return (
            <Dropdown
                value={this.props.value || this.state.week}
                options={weekValues}
                optionLabel="name"
                style={{ width: '100%' }}
                showClear
                id="week"
                onChange={this.handleChange}
                placeholder={this.props.language["select_a_week"] || "l_select_a_week"}
            />
        );
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
export default connect(mapStateToProps, mapDispatchToProps)(WeekDropDownList);