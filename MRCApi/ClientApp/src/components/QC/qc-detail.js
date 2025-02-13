import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabView, TabPanel } from 'primereact/tabview';
import { actionCreatorsQC } from '../../store/QCController.js';
import { ProgressSpinner } from 'primereact/progressspinner';
import QCAttendance from './qc-attendance.js';
import QCOSA from './FTR/qc-osa.js';
import QCSOS from './MRC/qc-sos.js';
import QCVisibility from './MRC/qc-visibility.js';
import { Button } from 'primereact/button';
import { getLogin } from '../../Utils/Helpler.js';
import QCPOG from './FTR/qc-pog.js';

class QCDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            loading: false,
            details: []
        }
        this.headerTemplate = this.headerTemplate.bind(this);
    }
    componentDidMount() {
        let data = {
            shopId: this.props.dataInput.shopId,
            employeeId: this.props.dataInput.employeeId,
            workDate: this.props.dataInput.workDate,
            qcId: this.props.dataInput.qcId
        }
        this.props.QCController.GetDetail(data)
            .then(() => {
                const result = this.props.qcDetails
                if (result && result.length > 0) {
                    this.setState({ details: result })
                }
            });
    }
    headerTemplate(item) {
        let status = null;
        if (item.kpiStatus === "Pass")
            status = <strong style={{ marginLeft: 10, padding: "0px 7px", backgroundColor: "green", border: "1px solid", borderRadius: "25px" }} >P</strong>
        else if (item.kpiStatus === "Fail")
            status = <strong style={{ marginLeft: 10, padding: "0px 7px", backgroundColor: "red", border: "1px solid", borderRadius: "25px" }} >F</strong>


        return (
            <Button className="p-button-info" onClick={() => this.setState({ activeIndex: item.index - 1 })} >
                {item.kpiName}
                {status}
            </Button>
        )
    }
    render() {
        const result = this.state.details;
        if (result && result.length === 0)
            return (
                <ProgressSpinner key={'loading'} style={{ left: '45%', top: 10 }} />
            );

        let tabPanel = [];
        result.forEach(element => {
            switch (element.kpiId) {
                case 1:
                    tabPanel.push(<TabPanel headerTemplate={this.headerTemplate(element)}  >
                        <QCAttendance key={'qca' + this.props.dataInput.rowNum} pageId={this.props.pageId} dataInput={element}></QCAttendance>
                    </TabPanel>);
                    break;
                case 2:
                    tabPanel.push(<TabPanel headerTemplate={this.headerTemplate(element)} >
                        <QCOSA key={'qcOSA' + this.props.dataInput.rowNum} pageId={this.props.pageId} dataInput={element}></QCOSA>
                    </TabPanel>);
                    break;
                case 3:
                    {getLogin().accountName === "Fonterra" ? 
                        tabPanel.push(<TabPanel headerTemplate={this.headerTemplate(element)} >
                                        <QCPOG key={'qcpog' + this.props.dataInput.rowNum} pageId={this.props.pageId} dataInput={element}></QCPOG>
                                    </TabPanel>)
                    :  tabPanel.push(<TabPanel headerTemplate={this.headerTemplate(element)} >
                                        <QCSOS key={'qcSOS' + this.props.dataInput.rowNum} pageId={this.props.pageId} dataInput={element}></QCSOS>
                                    </TabPanel>);
                    }
                    break;
                case 4:
                    tabPanel.push(<TabPanel headerTemplate={this.headerTemplate(element)} >
                        <QCVisibility key={'qcVi' + this.props.dataInput.rowNum} pageId={this.props.pageId} dataInput={element}></QCVisibility>
                    </TabPanel>);
                    break;
                default:
                    break;
            }

        });

        return (
            <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                {tabPanel}
            </TabView>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        qcDetails: state.qc.qcDetails,
        qcKPI: state.qc.qcKPI,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        QCController: bindActionCreators(actionCreatorsQC, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QCDetail);