/*global google*/
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionDigitalMapping } from "../../store/DigitalMappingController";
import { Growl } from 'primereact/growl';
import { Container, Row, Col } from 'react-bootstrap';
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import { Calendar } from 'primereact/calendar';
import { AccordionTab, Accordion } from 'primereact/accordion';
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MappingDetail from './MappingDetail';
import { download, URL, getToken } from '../../Utils/Helpler';
class MappingResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            activeIndex: 0,
            employeeId: 0,
            supId: 0,
            expandedRows: null,
            month: null,
            fromDate: null,
            toDate: null
        }
        this.Alert = this.Alert.bind(this);
        this.LoadList = this.LoadList.bind(this);
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.monthTemplate = this.monthTemplate.bind(this);
        this.exportDistance = this.exportDistance.bind(this);
        this.DirectionService = new google.maps.DirectionsService();
        this.CalcRoute = this.CalcRoute.bind(this);
        this.CallBack = this.CallBack.bind(this);
        this.resultToSave = [];
        this.storeResult = this.storeResult.bind(this);
        this.Size = 0;
        this.Count = 0;
    }

    componentDidMount() {
        this.resultToSave = [];
        this.props.DigitalMappingActions.CalculateDistance()
            .then(
                () => {
                    var arrResult = this.props.listEmployeeToCalculateDistance;
                    this.Size = 0;
                    for (var i = 0; i < arrResult.length; i++) {
                        var arrLocation = JSON.parse(arrResult[i].routeLocation);
                        if (arrLocation.length === 1) {
                            this.Count = this.Count + 1;
                            continue;
                        }
                        if (arrLocation.length <= 25) {
                            let waypoints = [];
                            var startPoint = new google.maps.LatLng(arrLocation[0].Lat, arrLocation[0].Lng);
                            var endPoint = new google.maps.LatLng(arrLocation[arrLocation.length - 1].Lat, arrLocation[arrLocation.length - 1].Lng);
                            if (arrLocation.length > 2) {
                                for (var j = 1; j < arrLocation.length - 1; j++) {
                                    waypoints.push({
                                        location: new google.maps.LatLng(arrLocation[j].Lat, arrLocation[j].Lng),
                                        stopover: true
                                    })
                                }
                            }
                            this.CalcRoute(startPoint, endPoint, waypoints, this.CallBack, arrResult[i], arrResult.length);
                        }
                    }
                }
            )
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ loading: false });
    }

    LoadList() {
        this.setState({ loading: true });
        var data = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            EmployeeId: (this.state.employeeId === 0 || this.state.employeeId === '') ? null : this.state.employeeId,
            SupId: (this.state.supId === 0 || this.state.supId === '') ? null : this.state.supId,
        }
        this.props.DigitalMappingActions.GetListResult(data)
            .then(
                () => {
                    this.Alert(`${this.props.language["success"] || "l_success"}`);
                }
            );
    }

    exportDistance() {
        this.setState({ loading: true });
        var data = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            EmployeeId: (this.state.employeeId === 0 || this.state.employeeId === '') ? 0 : this.state.employeeId,
            SupId: (this.state.supId === 0 || this.state.supId === '') ? 0 : this.state.supId,
        }
        this.props.DigitalMappingActions.ExportDistance(data.FromDate, data.ToDate, data.SupId, data.EmployeeId);
    }

    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }

    Alert(messager, typestyle) {
        this.growl.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: messager });
    }

    rowExpansionTemplate(data) {
        return (
            <MappingDetail
                EmployeeId={data.employeeId}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
            />
        )
    }

    monthTemplate() {
        return (
            <label>{moment(this.state.month).format("MM/YYYY").toString("MM/YYYY")}</label>
        )
    }

    onSelectedChange(rowData) {
        this.setState({ loading: false });
        var selected = rowData;
        var lastselect = this.state.expandedRows;
        if (lastselect != null)
            for (var key in selected) {
                // skip loop if the property is from prototype
                if (!selected.hasOwnProperty(key))
                    continue;
                // var obj = selected[key];
                for (var prop in lastselect) {
                    // skip loop if the property is from prototype
                    if (selected.hasOwnProperty(prop))
                        delete selected[prop];
                    //selected[prop]=false;
                }
            }
        this.setState({ expandedRows: selected });
    }

    CallBack(response, EmployeeAndDate, size) {
        const routeInfo = [];
        let route = response.routes[0];
        let totaldistance = null;
        let timesecond = null;
        route.legs.forEach(element => {
            totaldistance += parseFloat(element.distance.value);
            timesecond += parseInt(element.duration.value);
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
        this.storeResult(objResultOfEmployee, size)
    }

    CalcRoute(startPoint, endPoint, waypoints, callback, EmployeeAndDate, size) {
        this.DirectionService.route({
            origin: startPoint,
            destination: endPoint,
            waypoints: waypoints,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                callback(result, EmployeeAndDate, size);
            }
            //Handle the limit of 10 queries per sec
            else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                setTimeout(() => {
                    this.CalcRoute(startPoint, endPoint, waypoints, callback, EmployeeAndDate, size);
                }, 1100);
            }
            else {
                // a result could not found due to any one of the following errors: 
                //UNKNOWN_ERROR or REQUEST_DENIED or INVALID_REQUEST or MAX_WAYPOINTS_EXCEEDED
                this.Count = this.Count + 1;
                for (var i = 0; i < this.resultToSave.length; i++) {
                    if (this.resultToSave[i].EmployeeId === EmployeeAndDate.employeeId &&
                        this.resultToSave[i].WorkDate === EmployeeAndDate.auditDate) {
                        this.Count = this.Count + 1;
                        this.resultToSave.splice(i, 1);
                        break;
                    }
                }
                if (this.resultToSave.length === size - this.Count) {
                    this.SaveDistance(this.resultToSave)
                }
            }
        });
    }

    storeResult(data, size) {
        this.resultToSave.push(data);
        if ((this.resultToSave.length === size - this.Count)) {
            this.SaveDistance(this.resultToSave)
        }
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
            const response = await fetch(url, requestOptions);
            if (response.status === 200) {
                const result = await response.json();
                return result;
            }
        }
        catch (error) {
            console.log(error);
        }
        finally { }
    }

    render() {
        let result = [];
        let MappingResult = [];
        let urlExport = null;
        if (this.props.urlExport !== undefined && this.props.urlExport.length > 10)
            urlExport = (
                <Button
                    className="p-button-success p-button-rounded"
                    onClick={() => download(this.props.urlExport)} label='Download file' />
            );
        if (this.props.MappingResult !== undefined) {
            MappingResult = this.props.MappingResult;
        }
        if (MappingResult !== undefined && MappingResult.length > 0) {
            result.push(<div key="totalrow" style={{ textAlign: "center", width: '100%', fontWeight: 'bold' }}>{this.props.language["found"] || "l_found"}  {MappingResult.length} </div>)
            result.push(
                <DataTable
                    key="rowNum"
                    value={MappingResult} rows={50}
                    responsive rowHover paginator
                    rowsPerPageOptions={[20, 50, 100]}
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    onRowToggle={(e) => this.onSelectedChange(e.data)}
                    expandedRows={this.state.expandedRows}
                    rowExpansionTemplate={this.rowExpansionTemplate}>
                    <Column expander={true} style={{ width: '3em', textAlign: 'center' }} />
                    <Column field="rowNum" style={{ width: "50px", textAlign: 'center' }} header="No." />
                    <Column style={{ width: '50px' }} body={this.monthTemplate} header={this.props.language["month"] || "month"} />
                    <Column filter field="supName" style={{ width: '300px' }} header={this.props.language["supplier"] || "supplier"} />
                    <Column filter field="employeeName" header={this.props.language["employee"] || "employee"} style={{ width: '300px' }} />
                    <Column filter field="totalDistance" header={this.props.language["result"] + "(km)" || "result" + "(km)"} style={{ width: 120, textAlign: 'center' }} />
                    <Column filter field="actualShop" header={this.props.language["shop_actual"] || "l_shop_actual"} style={{ width: 120, textAlign: 'center' }} />
                    <Column filter field="targetShop" header={this.props.language["shop_checked_in"] || "l_shop_checked_in"} style={{ width: 120, textAlign: 'center' }} />
                </DataTable>
            )
        }
        return (
            <Container fluid >
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header={this.props.language["search"] || "l_search"}>
                        <Container fluid>
                            <Row>
                                <Col sm="3">
                                    <label>{this.props.language["month"] || "month"}</label>
                                    <Calendar fluid
                                        value={this.state.month}
                                        onChange={(e) => {
                                            let date = new Date(e.value);
                                            let fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
                                            let toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                                            this.setState({
                                                month: e.value,
                                                fromDate: parseInt(moment(fromDate).format("YYYYMMDD")),
                                                toDate: parseInt(moment(toDate).format("YYYYMMDD"))
                                            });
                                        }}
                                        view="month"
                                        dateFormat="mm/yy" yearNavigator
                                        yearRange="2010:2030"
                                        style={{ width: '100%' }}
                                        inputStyle={{ width: '91.5%', visible: false }}
                                    />
                                </Col>
                                <Col sm="3">
                                    <label>{this.props.language["supplier"] || "supplier"}</label>
                                    <EmployeeDropDownList
                                        positionId={2}
                                        parentId={0}
                                        id="supId"
                                        onChange={this.handleChange}
                                        value={this.state.supId.value}
                                    />
                                </Col>
                                <Col sm="3">
                                    <label>{this.props.language["employee"] || "employee"}</label>
                                    <EmployeeDropDownList
                                        positionId={3}
                                        parentId={0}
                                        id="employeeId"
                                        onChange={this.handleChange}
                                        value={this.state.employeeId.value}
                                    />
                                </Col>
                            </Row>
                        </Container>
                        <br />
                        <Toolbar>
                            <div className="p-toolbar-group-left">
                                <Button
                                    label={this.props.language["search"] || "search"}
                                    icon="pi pi-search"
                                    style={{ marginRight: '.25em' }}
                                    onClick={this.LoadList} />
                                <Button
                                    label={this.props.language["menu.export_report"] || "menu.export_report"}
                                    icon="pi pi-download"
                                    className="p-button-warning"
                                    style={{ marginRight: '.25em' }}
                                    onClick={this.exportDistance} />
                                {urlExport}
                            </div>
                        </Toolbar>
                        {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    </AccordionTab>
                </Accordion>
                <Growl ref={(el) => { this.growl = el; }}></Growl>
                {result}
            </Container>
        )
    }
}
function mapStateToProps(state) {
    return {
        MappingResult: state.digitalmappingResult.MappingResult,
        urlExport: state.digitalmappingResult.urlExport,
        listEmployeeToCalculateDistance: state.digitalmappingResult.listEmployeeToCalculate,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DigitalMappingActions: bindActionCreators(actionDigitalMapping, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MappingResult)