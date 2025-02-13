import React, { Component } from 'react';
import Search from './../Controls/Search';
import { connect } from 'react-redux';
import { HelpPermission } from '../../Utils/Helpler'
import Page403 from '../ErrorRoute/page403';
class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: {},
        }
        this.pageId = 3056
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    render() {
        return (
            this.state.permission.view ? (
                <div>
                    {(this.state.permission) !== undefined &&
                        <Search
                            isVisibleFilter={false}
                            isVisibleReport={true}
                            pageType="report"
                            permission={this.state.permission} />}
                </div>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        );
    }
}
export default Report;