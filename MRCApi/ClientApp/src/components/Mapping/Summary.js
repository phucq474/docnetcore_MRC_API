import React, { PureComponent } from 'react';
import { actionCreatorsShop } from "../../store/ShopController";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const colorrand = {
    red: '#dc3545',
    green: '#28a745',
    yellow: '#ffc107',
}
class Summary extends PureComponent {
    constructor(props) {
        super(props);
        this.Bind_Data = this.Bind_Data.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.AuditId !== nextProps.AuditId) {
            this.Bind_Data(nextProps.AuditId, nextProps.AuditDate);
        }
    }
    componentDidMount() {
        this.Bind_Data(this.props.AuditId, this.props.AuditDate);
    }
    Bind_Data(AuditId, AuditDate) {
        var data = {
            AuditId: AuditId,
            FromDate: parseInt(moment(AuditDate).format("YYYYMMDD")),
            ToDate: parseInt(moment(AuditDate).format("YYYYMMDD")),
        }
        this.props.KPISummaryActions.GetDetailAuditReusltSummary(data).then(
            () => {
                this.props.KPISummaryActions.GetListReject(data).then(
                    () => {
                        //console.log(this.props.listRejectByAuditId);
                    }
                );
            }
        )
    }
    render() {
        const data = [...this.props.detailSummary];
        const lstReject = [...this.props.listRejectByAuditId];
        //console.log(lstReject);
        //console.log(this.props.AuditId);
        let isReject = this.props.IsReject;
        const User = JSON.parse(localStorage.getItem("USER"));
        let PositionUser = parseInt(User.positonId);
        let view = [];
        let items = [];
        let visibleData = false, visiblebtnReject = false, enabletxtReject = false;
        let viewTable = true;
        let QCStatus = null;
        if (parseInt(isReject) === 1)//1: QC,2: Du an,3: Customer
            visiblebtnReject = false;
        else if (parseInt(isReject) === 2)
            visiblebtnReject = true;
        else
            visibleData = true;
        if (data.length > 0 && data !== null) {
            if ((PositionUser === 8 || PositionUser === 9 || PositionUser === 10
                || PositionUser === 11) && (QCStatus === "Chưa QC") || QCStatus === "Reject") {
                visiblebtnReject = true;
                enabletxtReject = true;
                viewTable = false;
            }
            data.forEach(item => {
                let color = item.actual > item.target ? colorrand.green : item.actual === item.target ? colorrand.yellow : colorrand.red;
                view.push(
                    <Card style={{ background: color }} title={item.reportName}>
                        <div  className="p-grid">
                            <div sm="4">
                                <p style={{ fontStyle: "italic", textAlign: 'center' }}>#{this.props.language["actual"] || "l_actual"}</p>
                                <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>{item.actual} </p>
                            </div>
                            <div className="p-col-12 p-md-4 p-sm-6">
                                <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                                    #{this.props.language["target"] || "l_target"} {item.exclusive > 0 ? <i className="pi pi-minus-circle" style={{ color: 'white', 'fontSize': '30' }}></i> : ''}
                                </p>
                                <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>{item.target}</p>
                                </div>
                            <div className="p-col-12 p-md-4 p-sm-6">
                                <p style={{ fontStyle: "italic", textAlign: 'center' }}>#{this.props.language["result"] || "result"}</p>
                                <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>{item.percentText}</p>
                            </div>
                        </div>
                    </Card>
                )
            });
        }
        if (lstReject.length > 0 && lstReject !== null) {
            //visiblebtnReject = true;
            //enabletxtReject = true;
            items = lstReject.map((item) => {
                return (
                    <div className="row" key={item.code}>
                        <div className="col-md-4">
                            <Checkbox
                                value={item.name}
                                checked={item.refId !== null && item.refId.toString() === '7'}
                            />
                            <label
                                htmlFor={item.name}
                                className="p-checkbox-label">
                                {item.name}
                            </label>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div style={{ width: '100%', overflow: 'hidden' }}>
                {view}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        detailSummary: state.auditResultList.detailSummary,
        listRejectByAuditId: state.auditResultList.listRejectByAuditId,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        KPISummaryActions: bindActionCreators(actionCreatorsShop, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Summary);