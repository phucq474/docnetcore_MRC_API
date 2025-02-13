/*global google*/
import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionDigitalMapping} from "../../store/DigitalMappingController";
import {Growl} from 'primereact/growl';
import moment from 'moment';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FcCalculator} from "react-icons/fc";
import {URL,getToken,download} from '../../Utils/Helpler';
import {FaEye} from 'react-icons/fa';
import {Dialog} from 'primereact/dialog';
import "../AuditResults/customcss.css";
import 'bootstrap/dist/css/bootstrap.css';
class MappingDetail extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedItem: null,
            visibleModal: false
        }
        this.Bind_Data = this.Bind_Data.bind(this);
        this.toolTemplate = this.toolTemplate.bind(this);
        this.calculateDistanceByEmployee = this.calculateDistanceByEmployee.bind(this);
        this.DirectionService = new google.maps.DirectionsService();
        this.CalcRoute = this.CalcRoute.bind(this);
        this.CallBack = this.CallBack.bind(this);
        this.resultToSave = [];
        this.storeResult = this.storeResult.bind(this);
        this.Count = 0;
        this.viewRouteDetail = this.viewRouteDetail.bind(this)
    }

    componentDidMount() {
        this.Bind_Data()
    }

    Bind_Data() {
        var data = {
            FromDate: this.props.FromDate,
            ToDate: this.props.ToDate,
            EmployeeId: this.props.EmployeeId
        }
        this.props.DigitalMappingActions.DetailByEmployee(data)
    }

    SaveDistance = async (data) => {
        const url = URL + 'digitalmapping/SaveDistance';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url,requestOptions);
            if(response.status === 200) {
                const result = await response.json();
                return result;
            }
        }
        catch(error) {
            console.log(error);
        }
        finally {}
    }

    calculateDistanceByEmployee(EmployeeId,WorkDate) {
        this.resultToSave = [];
        this.props.DigitalMappingActions.CalculateByEmployee(EmployeeId,WorkDate)
            .then(
                () => {
                    var arrResult = this.props.resultToCalculate;
                    for(var i = 0;i < arrResult.length;i++) {
                        var arrLocation = JSON.parse(arrResult[i].routeLocation);
                        if(arrLocation.length === 1) {
                            this.Count = this.Count + 1;
                            continue;
                        }
                        if(arrLocation.length <= 25) {
                            let waypoints = [];
                            var startPoint = new google.maps.LatLng(arrLocation[0].Lat,arrLocation[0].Lng);
                            var endPoint = new google.maps.LatLng(arrLocation[arrLocation.length - 1].Lat,arrLocation[arrLocation.length - 1].Lng);
                            if(arrLocation.length > 2) {
                                for(var j = 1;j < arrLocation.length - 1;j++) {
                                    waypoints.push({
                                        location: new google.maps.LatLng(arrLocation[j].Lat,arrLocation[j].Lng),
                                        stopover: true
                                    })
                                }
                            }
                            this.CalcRoute(startPoint,endPoint,waypoints,this.CallBack,arrResult[i],arrResult.length);
                        }
                    }
                }
            )
    }

    CallBack(response,EmployeeAndDate,size) {
        const routeInfo = [];
        let route = response.routes[0];
        let totaldistance = null;
        route.legs.forEach(element => {
            totaldistance += parseFloat(element.distance.value);
            var objRoute = {
                Distance: element.distance,
                Duration: element.duration,
                Start_Address: element.start_address,
                End_Address: element.end_address
            }
            routeInfo.push(objRoute);
        });
        var objResultOfEmployee = {
            EmployeeId: EmployeeAndDate.employeeId,
            WorkDate: EmployeeAndDate.auditDate,
            Distance: parseFloat(totaldistance / 1000),
            RouteInfo: JSON.stringify(routeInfo)
        }
        this.storeResult(objResultOfEmployee,size)
    }

    CalcRoute(startPoint,endPoint,waypoints,callback,EmployeeAndDate,size) {
        this.DirectionService.route({
            origin: startPoint,
            destination: endPoint,
            waypoints: waypoints,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING,
        },(result,status) => {
            if(status === google.maps.DirectionsStatus.OK) {
                callback(result,EmployeeAndDate,size);
            }
            //Handle the limit of 10 queries per sec
            else if(status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                setTimeout(() => {
                    this.CalcRoute(startPoint,endPoint,waypoints,callback,EmployeeAndDate,size);
                },1100);
            }
            else {
                // a result could not found due to any one of the following errors: 
                //UNKNOWN_ERROR or REQUEST_DENIED or INVALID_REQUEST or MAX_WAYPOINTS_EXCEEDED
                this.growl.show({severity: 'error',summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: status});
                this.Count = this.Count + 1;
                for(var i = 0;i < this.resultToSave.length;i++) {
                    if(this.resultToSave[i].EmployeeId === EmployeeAndDate.employeeId &&
                        this.resultToSave[i].WorkDate === EmployeeAndDate.auditDate) {
                        this.Count = this.Count + 1;
                        this.resultToSave.splice(i,1);
                        break;
                    }
                }
                if(this.resultToSave.length === size - this.Count) {
                    this.SaveDistance(this.resultToSave).
                        then(
                            (val) => {
                                if(parseInt(val,10) !== -1) {
                                    if(parseInt(val,10) > 0) {
                                        this.growl.show({severity: 'success',summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: `${this.props.language["success"] || "l_success"}`});
                                        this.Bind_Data();
                                    }
                                    else
                                        this.growl.show({severity: 'error',summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: `${this.props.language["fail"] || "l_fail"}`});
                                }
                            }
                        )
                }
            }
        });
    }

    storeResult(data,size) {
        this.resultToSave.push(data);
        if((this.resultToSave.length === size - this.Count)) {
            this.SaveDistance(this.resultToSave).
                then(
                    (val) => {
                        if(parseInt(val,10) !== -1) {
                            if(parseInt(val,10) > 0) {
                                this.growl.show({severity: 'success',summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: `${this.props.language["success"] || "l_success"}`});
                                this.Bind_Data();
                            }
                            else
                                this.growl.show({severity: 'error',summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: `${this.props.language["fail"] || "l_fail"}`});
                        }
                    }
                )
        }
    }

    toolTemplate(rowData) {
        return (
            <FcCalculator
                size={20}
                onClick={() => {this.calculateDistanceByEmployee(this.props.EmployeeId,rowData.dateInt)}}
            />
        )
    }

    viewRouteDetail(rowData) {
        return (
            <FaEye
                size={20}
                onClick={() => {
                    this.setState({
                        selectedItem: rowData,
                        visibleModal: true,
                        headerModal: rowData.employeeName + ' ' + moment(rowData.attendantDate).format("DD/MM/YYYY").toString("DD/MM/YYYY")
                    })
                }}
            />
        )
    }

    renderCarDialogContent() {
        let html = '';
        if(this.state.selectedItem) {
            let objRoute = JSON.parse(this.state.selectedItem.routingInfo);
            let i = 0;
            if(objRoute !== null) {
                objRoute.forEach(item => {
                    html += `<div className="routeinfo"><h6 className="distance">${this.props.language["distance"] || "l_distance"} ` + (i + 1) + ' : ' + item.Distance.text + '</h6>' +
                        `<p className="duration">${this.props.language["notification.timer"] || "notification.timer"}: ` + item.Duration.text + '<p/>' +
                        `<p className="start_address"> -${this.props.language["timestart"] || "timestart"}: ` + item.Start_Address + '<p/>' +
                        `<p className="end_address"> -${this.props.language["timeend"] || "timeend"}: ` + item.End_Address + '<p/></div>'
                    i++;
                });
            }
            return (
                <div>
                    <span dangerouslySetInnerHTML={{__html: html}}></span>
                </div>
            )
        }
        else
            return null;
    }

    render() {
        let mappingDetail = this.props.MappingDetail;
        let html = null;
        if(mappingDetail !== undefined && mappingDetail.length > 0) {
            html = <DataTable
                key="rowNum"
                value={mappingDetail}
                scrollable={true} scrollHeight="365px"
                style={{fontSize: "13px",marginTop: "10px"}}>
                <Column filter field={(e) => moment(e.attendantDate,"YYYYMMDD").format("DD").toString()} header={this.props.language["date"] || "l_date"} style={{width: '300px',textAlign: 'center'}} />
                <Column field={(e) => moment(e.startTime).format("DD-MM-YYYY HH:mm:ss").toString()} header={this.props.language["timestart"] || "timestart"} style={{textAlign: 'center'}} />
                <Column field={(e) => e.endTime !== null ? moment(e.endTime).format("DD-MM-YYYY HH:mm:ss").toString() : null} header={this.props.language["timeend"] || "timeend"} style={{textAlign: 'center'}} />
                <Column field="distance" header={this.props.language["result"] + "(km)" || "result" + "(km)"} style={{width: 120,textAlign: 'center'}} />
                <Column field="actualShop" header={this.props.language["shop_actual"] || "l_shop_actual"} style={{width: 120,textAlign: 'center'}} />
                <Column field="targetShop" header={this.props.language["shop_checked_in"] || "l_shop_checked_in"} style={{width: 120,textAlign: 'center'}} />
                <Column header={this.props.language["distance_detail"] || "l_distance_detail"} style={{width: 100,textAlign: 'center'}} body={this.viewRouteDetail} />
                <Column header={this.props.language["distance"] || "l_distance"} style={{width: 120,textAlign: 'center'}} body={this.toolTemplate} />
            </DataTable>
        }
        return (
            <div>
                <Growl ref={(el) => {this.growl = el;}}></Growl>
                {html}
                <Dialog
                    contentStyle={{height: "30vw",width: '30vw'}}
                    visible={this.state.visibleModal}
                    modal={true}
                    onHide={() => this.setState({visibleModal: false})}
                    blockScroll
                    header={this.state.headerModal}
                >
                    {this.renderCarDialogContent()}
                </Dialog>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        MappingDetail: state.mapping.MappingDetail,
        resultToCalculate: state.mapping.CalculateByEmployee,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DigitalMappingActions: bindActionCreators(actionDigitalMapping,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MappingDetail)
