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

class CoachingResultDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailCoaching: [],
            detailMarket: [],
            detailTask: [],
            isOpen: false,
            image: null,
            activeIndex: [0]
        }
    }

    async componentDidMount() {
        const data = await this.props.rowData;
        await this.props.WorkingTaskController.Coaching_Detail(data);
        const result = await this.props.coaching_Detail;
        this.setState({
            detailCoaching: result?.table ? result?.table : [],
            detailMarket: result?.table1 ? result?.table1 : [],
            detailTask: result?.table2 ? result?.table2 : [],
        })
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
        const detailCoaching = this.state.detailCoaching !== [] ? this.state.detailCoaching[0] : {};
        const detailItem = detailCoaching ? JSON.parse(detailCoaching.detail) : []

        if (detailCoaching) {
            return (
                <div className="p-grid" style={{ height: '600px' }}>
                    <div className="p-col-12 p-md-3 p-sm-6">
                        <div className="p-grid" style={{ marginTop: 10, borderRadius: '10px', border: '1px solid', borderColor: '#808080' }}>
                            <div className="p-col-12 p-md-12 p-grid p-justify-between"  >
                                <div className="p-col-12 p-md-4" style={{ textAlign: 'left', }}>
                                    <u>{this.props.language["total_point"] || "total_point"}:</u> <strong>{detailCoaching.total}</strong>
                                </div>
                                <div className="p-col-12 p-md-4" style={{ textAlign: 'center', }}>
                                    <u>{this.props.language["avg_point"] || "avg_point"}:</u> <strong>{detailCoaching.avgPoint}</strong>
                                </div>
                                <div className="p-col-12 p-md-4" style={{ textAlign: 'right', }}>
                                    <u>{this.props.language["rank"] || "rank"}:</u> <strong>{detailCoaching.rank}</strong>
                                </div>
                            </div>
                            <div className="p-col-12 p-md-12">
                                <u>{this.props.language["create_time"] || "create_time"}:</u> {detailCoaching.createDate}
                            </div>
                            <div className="p-col-12 p-md-12">
                                <u>{this.props.language["note"] || "note"}:</u> {detailCoaching.comment}
                            </div>
                            <div className="p-col-12 p-md-12" style={{ textAlign: 'center' }}
                                onClick={() => this.setState({ image: detailCoaching.photo, isOpen: true, })}>
                                <img src={detailCoaching.photo}
                                    style={{ maxWidth: '98%', maxHeight: '98%' }}
                                    onError={(e) => e.target.src = '/images/noimage.jpg'}
                                    alt={detailCoaching.comment} />
                            </div>
                        </div>
                    </div>
                    <div className="p-col-12 p-md-9 p-sm-6">
                        <DataTable value={detailItem}
                            resizableColumns
                            scrollable
                            scrollHeight="500px"
                            style={{ fontSize: "13px", marginTop: 10 }}
                            rowHover
                            rowClassName={this.rowClassTotal}
                            dataKey="RN" >
                            <Column field="RN" header={"No."} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '5%', textAlign: 'center' }} />
                            <Column field="ItemName" header={this.props.language["coaching_item"] || "coaching_item"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1" }} />
                            <Column field="MinScore" header={this.props.language["min-point"] || "min-point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                            <Column field="MaxScore" header={this.props.language["max-point"] || "max-point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                            <Column field="Score" header={this.props.language["point"] || "point"} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '10%', textAlign: 'center' }} />
                        </DataTable>
                    </div>
                </div >
            )
        }
        else {
            return (<div>No data</div>)
        }

    }

    templateShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700 }}>{rowData.shopName}</div>
                <div>({rowData.address})</div>
            </div>
        )
    }

    templateMarket = () => {
        const detailMarket = this.state.detailMarket;
        if (detailMarket?.length > 0) {
            let showBody = [];
            detailMarket.forEach(p => {
                const data = [{
                    shopName: p.shopName,
                    address: p.address,
                    total: p.total,
                    avgPoint: p.avgPoint,
                    rank: p.rank,
                    note: p.note,
                    createDate: p.createDate
                }]
                const detailItem = JSON.parse(p.detail);
                showBody.push(
                    <AccordionTab header={p.shopName}>
                        <div className='p-p-grid'>
                            <div className="p-col-12 p-md-12 p-sm-6">
                                <DataTable value={data}
                                    resizableColumns
                                    removableSort
                                    style={{ fontSize: "13px", marginTop: 10 }}
                                    rowHover
                                    rowClassName={this.rowClassHeader}
                                >
                                    <Column field="shopName" header={this.props.language["shopname"] || "shopname"}
                                        headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1" }}
                                        body={this.templateShop}
                                    />
                                    <Column field="createDate" header={this.props.language["create_time"] || "create_time"} style={{ textAlign: 'center', width: '20%' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '15%' }} />
                                    <Column field="total" header={this.props.language["total-point"] || "total-point"} style={{ textAlign: 'center', width: '10%', fontWeight: 700 }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="avgPoint" header={this.props.language["avg-point"] || "avg-point"} style={{ textAlign: 'center', width: '10%', fontWeight: 700 }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="rank" header={this.props.language["rank"] || "rank"} style={{ textAlign: 'center', width: '10%', fontWeight: 700 }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="note" header={this.props.language["note"] || "note"} style={{ textAlign: 'center', width: '20%' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '20%' }} />
                                </DataTable>
                            </div>
                            <div className="p-col-12 p-md-12 p-sm-6">
                                <DataTable value={detailItem}
                                    resizableColumns
                                    removableSort
                                    scrollable
                                    scrollHeight="320px"
                                    style={{ fontSize: "13px", marginTop: 10 }}
                                    rowHover
                                    dataKey="RN"
                                    rowClassName={this.rowClassTotal}
                                >
                                    <Column field="RN" header={"No."} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '5%', textAlign: 'center' }} />
                                    <Column field="ItemName" header={this.props.language["coaching_item"] || "coaching_item"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1" }} />
                                    <Column field="MinScore" header={this.props.language["min-point"] || "min-point"} style={{ textAlign: 'center' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="MaxScore" header={this.props.language["max-point"] || "max-point"} style={{ textAlign: 'center', width: '10%' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="ItemValue" header={this.props.language["point"] || "point"} style={{ textAlign: 'center', width: '10%' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '10%' }} />
                                    <Column field="ItemNote" header={this.props.language["note"] || "note"} style={{ textAlign: 'center', width: '20%' }} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '20%' }} />
                                </DataTable>
                            </div>
                        </div>

                    </AccordionTab>
                )
            })
            return (
                <div>
                    <ScrollPanel style={{ width: '100%' }}>
                        <Accordion multiple activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                            {showBody}
                        </Accordion>
                    </ScrollPanel>

                </div >
            )
        }
        else {
            return (<div>No data</div>)
        }

    }

    templateTask = () => {
        const detailTask = this.state.detailTask;
        if (detailTask) {
            return (
                <div>
                    <DataTable value={detailTask}
                        resizableColumns
                        scrollable
                        scrollHeight="500px"
                        style={{ fontSize: "13px", marginTop: 10 }}
                        rowHover
                        dataKey="rowNum" >
                        <Column field="rowNum" header={"No."} style={{ textAlign: 'center' }} headerStyle={{ backgroundColor: "#002366", color: "#f1f1f1", width: '5%', textAlign: 'center' }} />
                        <Column field="group" header={this.props.language["group_task"] || "group_task"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '15%' }} />
                        <Column field="subGroup" header={this.props.language["task"] || "task"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1", width: '25%' }} />
                        <Column field="description" header={this.props.language["description"] || "description"} headerStyle={{ textAlign: 'center', backgroundColor: "#002366", color: "#f1f1f1" }} />
                    </DataTable>
                </div >
            )
        }
        else {
            return (<div>No data</div>)
        }
    }

    render() {
        return (
            <div style={{ height: '600px' }}>
                <TabView>
                    <TabPanel header={this.props.language["coaching"] || "coaching"}>
                        {this.templateCoaching()}
                    </TabPanel>
                    <TabPanel header={this.props.language["coaching_market"] || "coaching_market"}>
                        {this.templateMarket()}
                    </TabPanel>
                    <TabPanel header={this.props.language["assessor_task"] || "assessor_task"}>
                        {this.templateTask()}
                    </TabPanel>
                </TabView>
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
        coaching_Detail: state.workingTask.coaching_Detail,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        WorkingTaskController: bindActionCreators(WorkingTaskCreateAction, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoachingResultDetail);
