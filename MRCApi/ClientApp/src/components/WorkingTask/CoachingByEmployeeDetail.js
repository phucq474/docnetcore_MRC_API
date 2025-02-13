import React, { useState } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import { ProgressBar } from 'primereact/progressbar'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { WorkingTaskCreateAction } from '../../store/WorkingTaskController';
import { TabView, TabPanel } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Timeline } from 'primereact/timeline';

class CoachingByEmployeeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailCoaching: [],
            details: [],
            isOpen: false,
            image: null,
            activeIndex: [0],
            listCoaching: [],
            isClick: 0
        }
    }

    componentDidMount() {
        this.handleGetList();
        this.handleCreateResult();
    }

    handleCreateResult = () => {
        const rowData = this.props.rowData;
        const details = rowData.details ? JSON.parse(rowData.details) : [];
        this.handleGetDataCoaching(details[0]?.ParentId);
        this.setState({ details: details, isClick: details[0]?.ParentId })
    }

    handleGetList = async () => {
        await this.setState({ listCoaching: [] });
        await this.props.WorkingTaskController.Coaching_GetList();
        const result = await this.props.coaching_GetList;
        if (result.status === 200 || result.status === 1) {
            await this.setState({ listCoaching: result.data });
        }
        await this.setState({ loading: false });
    }

    handleGetDataCoaching = async (parentId) => {
        await this.setState({ detailCoaching: [], isClick: parentId });
        const data = {
            employeeId: this.props.rowData.employeeId,
            parentId: parentId || null,
            uptodate: this.props.rowData.uptodate
        }
        await this.props.WorkingTaskController.Coaching_ByEmployee_Detail(data);
        const result = await this.props.coaching_ByEmployee_Detail;
        if (result.status === 200 || result.status === 1) {
            await this.setState({ detailCoaching: result.data });
        }

        await this.setState({ loading: false });
    }

    templateOppositeProgress = (item) => {
        if (this.state.isClick === item.id) {
            return (
                <div onClick={() => this.handleGetDataCoaching(item.id)} className="btn__hover"
                    style={{ borderBottom: '2px solid red', padding: '5px' }}
                >
                    <babel>
                        <small> {item.groupName}</small>
                    </babel>
                </div>
            )
        }
        else {
            return (
                <div onClick={() => this.handleGetDataCoaching(item.id)} className="btn__hover"
                >
                    <babel>
                        <small> {item.groupName}</small>
                    </babel>
                </div>
            )
        }

    }

    templateContentProgress = (item) => {
        const details = this.state.details ? this.state.details : [];
        const tmp = details.find(p => p.ParentId === item.id);
        if (tmp) {
            return (
                <div onClick={() => this.handleGetDataCoaching(item.id)} className="btn__hover" >
                    <babel>
                        Point: {tmp?.Coaching}
                    </babel>
                    <br />
                    <babel>
                        <small>Date: {tmp?.WorkDate}</small>
                    </babel>
                </div>
            )
        }
        else {
            return (
                <></>
            )
        }

    }


    rowClassTotal = (data) => {
        if (data.Id === 0) {
            return { 'row-group-level2': true };
        }
    }
    rowClassHeader = () => {
        return { 'row-group-level4': true };
    }

    templateCoaching = () => {
        const showBody = [];
        const details = this.state.detailCoaching;

        if (details.length > 0) {
            details.forEach(item => {
                const detailCoaching = item;
                const detailItem = detailCoaching ? JSON.parse(detailCoaching.detail) : []
                showBody.push(
                    <div className="p-grid" style={{ margin: '10px' }} >
                        <div className="p-col-12 p-md-3" style={{ height: '300px', paddingTop: '10px' }}>
                            <div className="p-grid" style={{ fontSize: '11px', borderRadius: '10px', border: '1px solid', borderColor: '#808080' }}>
                                <div className="p-col-12 p-md-12">
                                    <u>{this.props.language["create_time"] || "create_time"}:</u> {detailCoaching.createDate}
                                </div>
                                <div className="p-col-12 p-md-12">
                                    <u >{this.props.language["note"] || "note"}:</u> {detailCoaching.comment}
                                </div>
                                <div className="p-col-12 p-md-12" style={{ textAlign: 'center' }}
                                    onClick={() => this.setState({ image: detailCoaching.photo, isOpen: true, })}>
                                    <img src={detailCoaching.photo}
                                        style={{ maxWidth: '100%', width: '100%', height: '170px' }}
                                        onError={(e) => e.target.src = '/images/noimage.jpg'}
                                        alt={detailCoaching.comment} />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-9 ">
                            <DataTable value={detailItem}
                                resizableColumns
                                scrollable
                                style={{ fontSize: "10px" }}
                                rowHover
                                rowClassName={this.rowClassTotal}
                                dataKey="RN" >
                                <Column field="RN" header={"No."} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '7%', textAlign: 'center' }} />
                                <Column field="ItemName" header={this.props.language["coaching_item"] || "coaching_item"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1" }} />
                                <Column field="MinScore" header={this.props.language["min-point"] || "min-point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                                <Column field="MaxScore" header={this.props.language["max-point"] || "max-point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                                <Column field="Score" header={this.props.language["point"] || "point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                            </DataTable>
                        </div>
                    </div >
                )
            })

            return (
                <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar1">{showBody}</ScrollPanel>
            )
        }
        else {
            return (<div>No data</div>)
        }

    }


    render() {
        const listCoaching = this.state.listCoaching ? this.state.listCoaching : [];

        return (
            <div className='p-gird' style={{ height: '550px', display: 'flex' }} scrollable >
                <div className="p-col-12 p-md-4 p-sm-6 p-shadow-5"  >
                    <Timeline value={listCoaching} opposite={(item) => this.templateOppositeProgress(item)} content={(item) => this.templateContentProgress(item)} />
                </div>
                <div className="p-col-12 p-md-8 p-sm-6 p-shadow-5" >
                    {this.templateCoaching()}
                </div>
                {this.state.isOpen && (
                    <Lightbox
                        style={{ position: 'absolute' }}
                        mainSrc={this.state.image}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>

        )
    }

}

function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        coaching_ByEmployee_Detail: state.workingTask.coaching_ByEmployee_Detail,
        coaching_GetList: state.workingTask.coaching_GetList,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        WorkingTaskController: bindActionCreators(WorkingTaskCreateAction, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoachingByEmployeeDetail);
