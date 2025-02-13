import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CalendarCreateAction } from '../../store/CalendarController';
import { TreeSelect } from 'primereact/treeselect';
import { Dropdown } from 'primereact/dropdown';

class CycleDropDownList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            selectDefault: {}
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }

    async componentDidMount() {
        await this.props.CalendarController.GetCycle();
        const getCycle = await this.props.getCycle;
        if (getCycle.status === 200) {
            const data = await getCycle.data;
            await this.createList(data);
        }
    }


    createList = (data) => {
        if (data && data !== []) {
            let groupList = [], selectDefault = {};
            groupList = data.reduce((unique, o) => {
                if (!unique.some(obj => obj.value === o.year)) {
                    unique.push({
                        value: o.year,
                        name: o.year
                    });
                }
                return unique;
            }, []);

            for (let i = 0; i < groupList.length; i++) {
                let tmpItem = data.filter(p => p.year === groupList[i].value);
                const itemList = [];
                tmpItem.forEach(item => {
                    itemList.push({
                        value: {
                            fromDate: item.fromDate,
                            toDate: item.toDate
                        },
                        name: item.label,
                        label: item.label
                    })

                    if (item.isDefault === 1) {
                        selectDefault = {
                            fromDate: item.fromDate,
                            toDate: item.toDate
                        }
                    }
                })
                groupList[i].items = itemList;
            }

            this.setState({ datas: groupList, selectDefault: selectDefault })
        }
    }

    groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center country-item">
                <div> {option.name}</div>
            </div>
        );
    }

    countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <div>{option.name}</div>
            </div>
        );
    }

    render() {
        return (
            <Dropdown
                id={this.props.id}
                style={{ width: '100%' }}
                options={this.state.datas}
                onChange={this.handleChange}
                value={this.props.value}
                placeholder={"Select a reason"}
                optionLabel="label"
                filter={true}
                filterPlaceholder={"Select a reason"}
                filterBy="name"
                showClear={false}
                disabled={this.props.disabled}
                optionGroupTemplate={this.groupedItemTemplate}
                optionGroupLabel="name"
                optionGroupChildren="items"
                itemTemplate={this.countryOptionTemplate}
            />

        );
    }
}
function mapStateToProps(state) {
    return {
        getCycle: state.calendars.getCycle,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CalendarController: bindActionCreators(CalendarCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CycleDropDownList);