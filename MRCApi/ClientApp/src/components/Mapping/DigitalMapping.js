/*global google*/
//eslint-disable-line
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { GMap } from 'primereact/gmap';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { RegionApp } from '../Controls/RegionMaster';
import { Sidebar } from 'primereact/sidebar';
import { Calendar } from 'primereact/calendar';
import EmployeeDropDownList from "../Controls/EmployeeDropDownList";
import { MappingActionCreate } from "../../store/DigitalMappingController";
import { RegionActionCreate } from '../../store/RegionController';
import moment from 'moment';
import '../../css/panelLeft.css';
import noimage from '../../asset/images/noimage.jpeg'
import { SelectButton } from 'primereact/selectbutton';
import iconRed from "../../asset/images/marker_red.png";
import iconBlue from "../../asset/images/marker_blue.png";
import iconStart from "../../asset/images/start.png";
import iconEnd from "../../asset/images/end.png";
import './customcss.css'
import { URL, getToken, HelpPermission } from '../../Utils/Helpler';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AiFillEdit } from "react-icons/ai";
import Page403 from '../ErrorRoute/page403';
//const google = window.google;
let directionsRenderer = new google.maps.DirectionsRenderer();
let directionsService = new google.maps.DirectionsService();
const geocoder = new google.maps.Geocoder();
let markerclusterer = null;

class DigitalMapping extends PureComponent {
    constructor(props) {
        super(props);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.state = {
            options: { center: { lat: 10.7742703, lng: 106.699468 }, zoom: 16 },
            shopCode: undefined,
            visible: false,
            datefilter: new Date(),
            srID: 0,
            toogle: 'layout-wrapper',
            visibleModal: false,
            selectedItem: null,
            headerModal: '',
            optionFilter: 1,
            RouteInfo: [],
            stateLG: {
                visibleAddCustomerModal: false,
                CustomerInfo: {
                    customerName: null,
                    customerPhone: null,
                    customerAddress: null,
                    customerLat: null,
                    customerLng: null,
                    customerNote: null,
                    employeeId: null,
                    trackingDate: new Date(),
                    cusId: null
                },
                visibleListCustomerModal: false,
                dateListCustomer: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
                employeeIdInModalListCustomer: null,
                typeSaveCustomerData: 'Add'
            },
            permission: {},
        }
        this.pageId = 4044
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.CallBack = this.CallBack.bind(this);
        this.resultToSave = [];
        this.renderCarDialogContent = this.renderCarDialogContent.bind(this);
        this.optionsFilter = [
            { name: `${this.props.language["overview"] || "l_overview"}`, value: 1 },
            { name: `${this.props.language["route"] || "l_route"}`, value: 2 },
            { name: `${this.props.language["distance"] || "l_distance"}`, value: 3 }
        ]
        this.MarkerCustomerAddress = null;
        this.optionFilterTemplate = this.optionFilterTemplate.bind(this);
        this.drawRoute = this.drawRoute.bind(this);
        this.drawLongestRoute = this.drawLongestRoute.bind(this);
        this.arrayDirectionRenders = [];
        this.RouteInfo = [];
        this.renderAddCustomerModal = this.renderAddCustomerModal.bind(this);
        this.onClickSearchLatLng = this.onClickSearchLatLng.bind(this);
        this.CallBackSearchLatLng = this.CallBackSearchLatLng.bind(this);
        this.renderFooterCustomerModal = this.renderFooterCustomerModal.bind(this);
        this.onClickSaveCustomer = this.onClickSaveCustomer.bind(this);
        this.SaveCustomerInfo = this.SaveCustomerInfo.bind(this);
        this.renderListCustomerModal = this.renderListCustomerModal.bind(this);
        this.onClickFilterListCustomer = this.onClickFilterListCustomer.bind(this);
        this.templateToolModalListCustomer = this.templateToolModalListCustomer.bind(this);
        this.onClickSchedulePlan = this.onClickSchedulePlan.bind(this);
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    async componentDidMount() {
        await this.props.RegionController.GetListRegion();
    }

    componentWillReceiveProps(nextProps) {
        this.arrayDirectionRenders.forEach(directionRender => {
            directionRender.setMap(null);
        });
        if (this.MarkerCustomerAddress !== null)
            this.MarkerCustomerAddress.setMap(null);
        if (markerclusterer != null)
            markerclusterer.clearMarkers();
        if (nextProps.shoplist !== this.props.shoplist) {
            const shops = [];
            let pos = 0;
            nextProps.shoplist.forEach(shop => {
                if (pos === 0) {
                    this.gmap.map.setCenter(new google.maps.LatLng(shop.latitude, shop.longitude))
                }
                pos++;
                let marker = new google.maps.Marker({
                    position: { lat: shop.latitude, lng: shop.longitude },
                    title: shop.shopName.toString()
                })
                google.maps.event.addListener(marker, 'click', function (evt) {
                    this.setState({
                        selectedItem: shop,
                        visibleModal: true,
                        headerModal: shop.shopCode + '-' + shop.shopName,
                        toogle: "layout-wrapper layout-config-active"
                    })
                }.bind(this))
                shops.push(marker);
            });
            //Set Group
            markerclusterer = new window.MarkerClusterer(this.gmap.map, shops, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })
            this.setState({ overlays: shops });
        }
        if (nextProps.RouteFromStartPoint !== this.props.RouteFromStartPoint) {
        }
        if (nextProps.errors.length > 0)
            this.ShowToast(nextProps.errors);
    }

    optionFilterTemplate(option) {
        return <i>{option.name}</i>;
    }

    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }

    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }

    LoadList = () => {
        const iState = this.state;
        if (iState.optionFilter === null) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["option_required"] || "l_option_required"} ` });
            return;
        }
        const data = {
            ShopCode: iState.shopCode !== undefined ? iState.shopCode : null,
            Area: (iState.area !== undefined) ? iState.area : null,
            Region: (iState.region !== undefined) ? iState.region : null,
            Province: (iState.province !== undefined && iState.province !== null) ? iState.province.toString() : null,
            District: (iState.district !== undefined && iState.district !== null) ? iState.district.toString() : null,
            Employee: (iState.employee !== undefined && iState.employee !== null) ? iState.employee.toString() : null,
            MapDate: (iState.datefilter !== undefined && iState.datefilter !== null) ? new moment(iState.datefilter).format("YYYYMMDD") : null,
        }
        if (iState.optionFilter === 1) {
            this.props.MappingController.GetShops([data]);
            //this.onDirectionTwoPoint();
        }
        else if (iState.optionFilter === 2) {
            if (!iState.employee) {
                this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["employee_required"] || "l_employee_required"}` });
                return;
            }
            if (!iState.datefilter) {
                this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["date_required"] || "l_date_required"}` });
                return;
            }
            this.props.MappingController.RouteByEmployee([data])
                .then(
                    () => {
                        //console.log(this.props.RouteByEmployee);
                        this.drawRoute();
                    }
                )
        }
        else if (iState.optionFilter === 3) {
            if (!iState.employee) {
                this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["employee_required"] || "l_employee_required"}` });
                return;
            }
            if (!iState.datefilter) {
                this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["date_required"] || "l_date_required"}` });
                return;
            }
            this.props.MappingController.RouteFromStartPoint([data])
                .then(
                    () => {
                        this.drawLongestRoute();
                    }
                )
        }
    }

    drawRoute = () => {
        this.arrayDirectionRenders.forEach(directionRender => {
            directionRender.setMap(null);
        });
        if (this.MarkerCustomerAddress !== null)
            this.MarkerCustomerAddress.setMap(null);
        this.RouteInfo = [];
        if (!this.props.RouteByEmployee || this.props.RouteByEmployee.length === 0) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["data_null"] || "l_data_null"}` });
            return;
        }
        var result = this.props.RouteByEmployee;
        let option = this.state.optionFilter;
        var map = this.gmap.map;
        result.forEach(item => {
            var arrLocations = JSON.parse(item.routeLocation);
            let markers = [];
            let waypoints = [];
            var startPoint = new google.maps.LatLng(arrLocations[0].Lat, arrLocations[0].Lng);
            var endPoint = new google.maps.LatLng(arrLocations[arrLocations.length - 1].Lat, arrLocations[arrLocations.length - 1].Lng);
            var startMarker = new google.maps.Marker({
                position: startPoint,
                icon: {
                    url: iconStart,
                    scaledSize: new google.maps.Size(32, 32), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(16, 32) // anchor
                },
                Index: arrLocations[0].Index,
                Time: arrLocations[0].Time
            });
            var endMarker = new google.maps.Marker({
                position: endPoint,
                icon: {
                    url: iconEnd,
                    scaledSize: new google.maps.Size(32, 32), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(16, 32) // anchor
                },
                Index: arrLocations[arrLocations.length - 1].Index,
                Time: arrLocations[arrLocations.length - 1].Time
            });
            markers.push(startMarker);
            markers.push(endMarker);
            if (arrLocations.length > 2) {
                for (var j = 1; j < arrLocations.length - 1; j++) {
                    waypoints.push({
                        location: new google.maps.LatLng(arrLocations[j].Lat, arrLocations[j].Lng),
                        stopover: true
                    });
                    var latlng = new google.maps.LatLng(arrLocations[j].Lat, arrLocations[j].Lng);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        icon: {
                            url: iconBlue,
                            scaledSize: new google.maps.Size(32, 32), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(16, 32) // anchor
                        },
                        label: { text: j.toString(), color: "red", fontWeight: 'bold' },
                        Overview: arrLocations[j].Overview,
                        Index: arrLocations[j].Index,
                        ShopInfo: arrLocations[j].ShopInfo
                    })
                    markers.push(marker);
                }
            }
            markers.forEach(marker => {
                google.maps.event.addListener(marker, 'click', function (evt) {
                    var selectedItem = null;
                    var infoWindow = new google.maps.InfoWindow();
                    if (marker.Index === 0 && marker.ShopInfo) {
                        selectedItem = marker.ShopInfo[0];
                    }
                    if (marker.Overview && marker.Index === 0)
                        infoWindow.setContent("<div><img src= '" + marker.Overview + "' alt= 'OverView' height= '300px' ></div>");
                    else
                        infoWindow.setContent('<div>' + marker.Time + '<div>')
                    infoWindow.open(map, marker);
                    this.setState({
                        toogle: "layout-wrapper layout-config-active",
                        selectedItem: selectedItem
                    })
                }.bind(this))
            });
            let ds = new google.maps.DirectionsService();
            let dr = new google.maps.DirectionsRenderer(
                {
                    map: this.gmap.map,
                    polylineOptions: {
                        strokeColor: "blue",
                        icons: [
                            {
                                icon:
                                {
                                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                    scale: 3,
                                    fillOpacity: 1
                                }
                            }
                        ]
                    },
                    suppressMarkers: true
                }
            );
            this.arrayDirectionRenders.push(dr);
            ds.route(
                {
                    origin: startPoint,
                    destination: endPoint,
                    waypoints: waypoints,
                    optimizeWaypoints: false,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        dr.setDirections(result);
                        this.CallBack(result, null, null, option);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            )
            markerclusterer = new window.MarkerClusterer(this.gmap.map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })
        });
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["success"] || "l_success"}` });
        this.setState({
            visible: false
        })
    }

    drawLongestRoute = () => {
        this.arrayDirectionRenders.forEach(directionRender => {
            directionRender.setMap(null);
        });
        if (this.MarkerCustomerAddress !== null)
            this.MarkerCustomerAddress.setMap(null);
        this.RouteInfo = [];
        var result = this.props.RouteFromStartPoint;
        if (!result || result.length === 0) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["data_null"] || "l_data_null"}` });
            return;
        }
        let RouteInfo = [];
        var arrLocations = JSON.parse(result[0].routeLocation);
        let markers = [];
        var startPoint = new google.maps.LatLng(arrLocations[0].Lat, arrLocations[0].Lng);
        var startMarker = new google.maps.Marker({
            position: { lat: arrLocations[0].Lat, lng: arrLocations[0].Lng },
            icon: {
                url: iconStart,
                scaledSize: new google.maps.Size(32, 32), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(16, 32) // anchor
            },
            Index: arrLocations[0].Index
        });
        markers.push(startMarker);
        let option = this.state.optionFilter;
        if (arrLocations.length > 1) {
            for (var j = 1; j < arrLocations.length; j++) {
                let shopName = arrLocations[j].ShopName;
                let index = j;
                var endPoint = new google.maps.LatLng(arrLocations[j].Lat, arrLocations[j].Lng);
                var endMarker = new google.maps.Marker({
                    position: { lat: arrLocations[j].Lat, lng: arrLocations[j].Lng },
                    icon: {
                        url: iconBlue,
                        scaledSize: new google.maps.Size(32, 32), // scaled size
                        origin: new google.maps.Point(0, 0), // origin
                        anchor: new google.maps.Point(16, 32) // anchor
                    },
                    label: { text: j.toString(), color: "red", fontWeight: 'bold' },
                    ShopInfo: arrLocations[j].ShopInfo,
                    Index: arrLocations[j].Index,
                    Overview: arrLocations[j].Overview
                })
                markers.push(endMarker);
                let dr = new google.maps.DirectionsRenderer(
                    {
                        map: this.gmap.map,
                        polylineOptions: {
                            strokeColor: "blue",
                            icons: [
                                {
                                    icon:
                                    {
                                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                        scale: 3,
                                        fillOpacity: 1
                                    }
                                }
                            ]
                        },
                        suppressMarkers: true
                    }
                );
                this.arrayDirectionRenders.push(dr);
                directionsService.route(
                    {
                        origin: startPoint,
                        destination: endPoint,
                        optimizeWaypoints: false,
                        travelMode: google.maps.TravelMode.DRIVING
                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            dr.setDirections(result);
                            this.CallBack(result, shopName, index, option);
                        } else {
                            console.error(`error fetching directions ${result}`);
                        }
                    }
                )
            }
            markers.forEach(marker => {
                google.maps.event.addListener(marker, 'click', function (evt) {
                    var selectedItem = null;
                    var infoWindow = new google.maps.InfoWindow();
                    if (marker.Index === 0 && marker.ShopInfo) {
                        selectedItem = marker.ShopInfo[0];
                    }
                    if (marker.Overview && marker.Index === 0)
                        infoWindow.setContent("<div><img src= '" + marker.Overview + "' alt= 'OverView' height= '300px' ></div>");
                    else
                        infoWindow.setContent('<div>' + marker.Time + '<div>')
                    infoWindow.open(this.gmap.map, marker);
                    this.setState({
                        toogle: "layout-wrapper layout-config-active",
                        selectedItem: selectedItem
                    })
                }.bind(this))
            });
            markerclusterer = null;
            markerclusterer = new window.MarkerClusterer(this.gmap.map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })
        }
        else {
            var endPoint = new google.maps.LatLng(arrLocations[0].lat, arrLocations[0].lng);
            let dr = new google.maps.DirectionsRenderer(
                {
                    map: this.gmap.map,
                    polylineOptions: {
                        strokeColor: "blue",
                        icons: [
                            {
                                icon:
                                {
                                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                    scale: 3,
                                    fillOpacity: 1
                                }
                            }
                        ]
                    },
                    suppressMarkers: true
                }
            );
            this.arrayDirectionRenders.push(dr);
            directionsService.route(
                {
                    origin: startPoint,
                    destination: endPoint,
                    optimizeWaypoints: false,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        dr.setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            )
        }
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["success"] || "l_success"}` });
        this.setState({
            visible: false,
            selectedItem: null
        })
    }

    onDirectionTwoPoint = () => {
        let origin = { lat: 10.7789241, lng: 106.6880843 }
        let destination = [];
        destination.push({ lat: 10.7789241, lng: 106.6880843 });
        //destination.push({ lat: 10.779408, lng: 106.695182 });
        destination.forEach(itemDestination => {
            let ds = new google.maps.DirectionsService();
            let dr = new google.maps.DirectionsRenderer();
            this.arrayDirectionRenders.push(dr);
            ds.route(
                {
                    origin: origin,
                    destination: itemDestination,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        dr.setDirections(result);
                        dr.setMap(this.gmap.map);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            )
        });

    }

    CallBack(response, shopName, index, option) {
        if (option === 3) {
            var routeResult = response.routes[0].legs[0];
            var objRoute = {
                Distance: routeResult.distance.value,
                Duration: routeResult.duration.value,
                Start_Address: `${this.props.language["location_start"] || "l_location_start"} `,
                End_Address: shopName,
                Index: index
            }
            this.RouteInfo.push(objRoute);
        }
        else if (option === 2) {
            var routeResult = response.routes[0].legs;
            routeResult.forEach(element => {
                var objRoute = {
                    Distance: element.distance.value,
                    Duration: element.duration.value,
                    Start_Address: element.start_address,
                    End_Address: element.end_address
                }
                this.RouteInfo.push(objRoute);
            });
        }
    }

    ShowToast = (message, ToastStyle) => {
        if (ToastStyle === undefined)
            ToastStyle = 'success'
        this.toast.show({ severity: ToastStyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: message });
    }

    onOverlayClick(event) {
        let isMarker = event.overlay.getTitle !== undefined;
        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow = this.infoWindow || new google.maps.InfoWindow();
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            //event.map.setCenter(event.overlay.getPosition());
            this.toast.show({ severity: 'info', summary: `${this.props.language["marker_selected"] || "l_marker_selected"}`, detail: title });
        }
        else {
            this.toast.show({ severity: 'info', summary: `${this.props.language["shape_selected"] || "l_shape_selected"}`, detail: '' });
        }
    }

    openRight = () => {
        const toogleCss = this.state.toogle
        if (toogleCss === "layout-wrapper")
            this.setState({ toogle: "layout-wrapper layout-config-active" });
        else
            this.setState({ toogle: "layout-wrapper" });
    }

    renderCarDialogContent() {
        if (this.state.optionFilter !== null) {
            if (this.state.optionFilter === 1) {
                if (this.state.selectedItem) {
                    return (
                        <div>
                            <div style={{ opacity: '0.7', backgroundColor: 'gray', position: 'absolute', top: '0', padding: '5px', right: 0, width: '100%', height: '5%', textAlign: 'center' }}>
                                <label style={{ width: '100%', fontSize: '12px', color: '#72e2e7', fontWeight: 'bold', marginBottom: 0 }}>{this.state.selectedItem.shopCode + '-' + this.state.selectedItem.shopName}</label>
                                <label style={{ width: '100%', fontSize: '10px', color: '#72e2e7', fontWeight: 'bold', marginBottom: 0 }}>{this.state.selectedItem.shopAddress}</label>
                            </div>
                            <img style={{ width: '100%' }} src={this.state.selectedItem.imageUrl !== null ? this.state.selectedItem.imageUrl : noimage}></img>
                            <br></br>
                            <div style={{ borderTop: '1px inset', borderBottom: '1px inset', padding: '6px 10px' }}>
                                <p><strong>{this.props.language["channel"] || "channel"}: </strong>{this.state.selectedItem.channel}</p>
                                <p><strong>{this.props.language["address"] || "address"}: </strong>{this.state.selectedItem.addressVN}</p>
                                <p><strong>{this.props.language["storelist.town"] || "storelist.town"}: </strong>{this.state.selectedItem.town}</p>
                                <p><strong>{this.props.language["district"] || "district"}: </strong>{this.state.selectedItem.district}</p>
                                <p><strong>{this.props.language["province"] || "province"}: </strong>{this.state.selectedItem.province}</p>
                                <p><strong>{this.props.language["storelist_region"] || "storelist_region"}: </strong>{this.state.selectedItem.area}</p>
                                <p><strong>{this.props.language["shop_owner"] || "l_shop_owner"}: </strong>{this.state.selectedItem.contactName}</p>
                            </div>
                        </div>
                    )
                }
                else
                    return null;
            }
            else if (this.state.optionFilter === 3) {
                if ((this.props.RouteFromStartPoint && this.props.RouteFromStartPoint.length > 0) || this.state.selectedItem !== null) {
                    if (this.RouteInfo !== null)
                        this.RouteInfo.sort(function (a, b) {
                            return b.Distance - a.Distance
                        });
                    let html = '';
                    let objRoute = this.RouteInfo;
                    if (this.state.selectedItem) {
                        var shopInfo = this.state.selectedItem;
                        html += '<div style="color:#299AD4"><div><b>Store name: </b>' + shopInfo.ShopCode + '-' + shopInfo.ShopName + '</div>' +
                            '<div><p><b>Channel: </b>' + shopInfo.Channel + '</p></div>' +
                            '<div><p><b>Address: </b>' + shopInfo.Address + '</p></div>' +
                            '<div><p><b>Town: </b>' + shopInfo.Town + '</p></div>' +
                            '<div><p><b>District: </b>' + shopInfo.District + '</p></div>' +
                            '<div><p><b>Province/City: </b>' + shopInfo.Province + '</p></div>' +
                            '<div><p><b>Region: </b>' + shopInfo.Region + '</p></div>' +
                            '<div><p><b>Shop Owner: </b>' + shopInfo.ContactName + '</p></div>' +
                            '<div><p><b>Contact Phone: </b>' + shopInfo.ContactPhone + '</p></div></div>'
                    }
                    if (objRoute !== null) {
                        var totalKM = 0;
                        objRoute.forEach(item => {
                            totalKM += parseFloat(item.Distance / 1000);
                            html += `<div className="routeinfo"><p className="distance">${this.props.language["distance"] || "l_distance"}  ` + item.Index + ' : ' + parseFloat(item.Distance / 1000) + ' km' + '</p>' +
                                `<p className="duration">${this.props.language["notification.timer"] || "notification.timer"}: ` + (parseInt(item.Duration / 60, 10) >= 1 ? parseInt(item.Duration / 60, 10) + ` ${this.props.language["minute"] || "l_minute"}` : item.Duration + ` ${this.props.language["second"] || "l_second"}`) + '<p/>' +
                                `<p className="start_address"> -${this.props.language["timestart"] || "timestart"}: ` + item.Start_Address + '<p/>' +
                                `<p className="end_address"> -${this.props.language["timeend"] || "timeend"}: ` + item.End_Address + '<p/></div>'
                        });
                        html += '<p className="distance" style="width:100%">Tổng quãng đường :' + totalKM.toFixed(2) + ' KM' + '</p>'
                    }
                    return (
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: html }}></span>
                        </div>
                    )
                }
            }
            else if (this.state.optionFilter === 2) {
                if ((this.props.RouteByEmployee && this.props.RouteByEmployee.length > 0) || this.state.selectedItem !== null) {

                    let html = '';
                    let objRoute = this.RouteInfo;
                    let index = 1;
                    if (this.state.selectedItem) {
                        var shopInfo = this.state.selectedItem;
                        html += '<div style="color:#299AD4"><div><b>Store name: </b>' + shopInfo.ShopCode + '-' + shopInfo.ShopName + '</div>' +
                            '<div><p><b>Channel: </b>' + shopInfo.Channel + '</p></div>' +
                            '<div><p><b>Address: </b>' + shopInfo.Address + '</p></div>' +
                            '<div><p><b>Town: </b>' + shopInfo.Town + '</p></div>' +
                            '<div><p><b>District: </b>' + shopInfo.District + '</p></div>' +
                            '<div><p><b>Province/City: </b>' + shopInfo.Province + '</p></div>' +
                            '<div><p><b>Region: </b>' + shopInfo.Region + '</p></div>' +
                            '<div><p><b>Shop Owner: </b>' + shopInfo.ContactName + '</p></div>' +
                            '<div><p><b>Contact Phone: </b>' + shopInfo.ContactPhone + '</p></div></div>'
                    }
                    if (objRoute !== null) {
                        var totalKM = 0;
                        objRoute.forEach(item => {
                            totalKM += parseFloat(item.Distance / 1000);
                            html += `<div className="routeinfo"><p className="distance">${this.props.language["distance"] || "l_distance"}  ` + index + ' : ' + parseFloat(item.Distance / 1000) + ' km' + '</p>' +
                                `<p className="duration">${this.props.language["notification.timer"] || "notification.timer"}: ` + (parseInt(item.Duration / 60, 10) >= 1 ? parseInt(item.Duration / 60, 10) + ` ${this.props.language["minute"] || "l_minute"}` : item.Duration + ` ${this.props.language["second"] || "l_second"}`) + '<p/>' +
                                `<p className="start_address"> -${this.props.language["timestart"] || "timestart"}: ` + item.Start_Address + '<p/>' +
                                `<p className="end_address"> -${this.props.language["timeend"] || "timeend"}: ` + item.End_Address + '<p/></div>'
                            index++;
                        });
                        html += '<p className="distance" style="width:100%">Tổng quãng đường :' + totalKM.toFixed(2) + ' KM' + '</p>'
                    }
                    return (
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: html }}></span>
                        </div>
                    )
                }
            }
        }
    }

    CallBackSearchLatLng(lat, lng, address) {
        this.setState({
            stateLG: {
                ...this.state.stateLG,
                CustomerInfo: {
                    ...this.state.stateLG.CustomerInfo,
                    customerLat: lat,
                    customerLng: lng,
                    customerAddress: address
                }
            }
        });
    }

    onClickSearchLatLng() {
        if (this.MarkerCustomerAddress !== null)
            this.MarkerCustomerAddress.setMap(null);
        let stateInfo = this.state.stateLG;
        var address = stateInfo.CustomerInfo.customerAddress;
        let map = this.gmap.map;
        let lat = null;
        let lng = null;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                this.MarkerCustomerAddress = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                this.CallBackSearchLatLng(lat, lng, results[0].formatted_address);
            } else {
                this.Alert(`${this.props.language["geocode_was_not_successful_for_the_following_reason"] || "l_geocode_was_not_successful_for_the_following_reason"}: ` + status);
            }
        }.bind(this));
    }

    onClickSaveCustomer() {
        let customerInfo = this.state.stateLG.CustomerInfo;
        if (!customerInfo.customerPhone || customerInfo.customerPhone.length < 10) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["phone_number_option_required_and_longer_than_10_characters"] || "l_phone_number_option_required_and_longer_than_10_characters"}` });
            return;
        }
        if (!customerInfo.employeeId) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["employee_option_required"] || "l_employee_option_required"}` });
            return;
        }
        if (customerInfo.trackingDate < new Date()) {
            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["day_selected_must_higher_than_current_day"] || "l_day_selected_must_higher_than_current_day"}` });
            return;
        }
        let data = {
            EmployeeId: customerInfo.employeeId,
            CustomerPhone: customerInfo.customerPhone,
            CustomerName: customerInfo.customerName,
            CustomerAddress: customerInfo.customerAddress,
            CustomerDesc: customerInfo.customerNote,
            Lat: customerInfo.customerLat,
            Lng: customerInfo.customerLng,
            PlanDate: parseInt(moment(customerInfo.trackingDate).format("YYYYMMDD")),
            TypeSave: this.state.stateLG.typeSaveCustomerData,
            CusId: customerInfo.cusId
        }
        this.SaveCustomerInfo(data)
            .then(
                (val) => {
                    if (val) {
                        if (parseInt(val, 10) > 0) {
                            this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["save_successful"] || "l_save_successful"}` });
                            return;
                        }
                        else if (parseInt(val, 10) === 0) {
                            this.toast.show({ severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["save_failed"] || "l_save_failed"}` });
                            return;
                        }
                        else if (parseInt(val, 10) === -1) {
                            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["this_number_already_exists"] || "l_this_number_already_exists"}` });
                            return;
                        } else if (parseInt(val, 10) === -2) {
                            this.toast.show({ severity: 'warn', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["this_schedule_already_exists"] || "l_this_schedule_already_exists"}` });
                            return;
                        }
                    }
                }
            )
    }

    onClickFilterListCustomer() {
        let EmployeeId = this.state.stateLG.employeeIdInModalListCustomer === null ? 0 : this.state.stateLG.employeeIdInModalListCustomer;
        const fromdate = parseInt(moment(this.state.stateLG.dateListCustomer[0]).format("YYYYMMDD"));
        const todate = parseInt(moment(this.state.stateLG.dateListCustomer[1]).format("YYYYMMDD"));
        this.props.MappingController.GetListCustomer(fromdate, todate, EmployeeId)
            .then(
                () => {
                    if (this.props.listCustomer !== undefined && this.props.listCustomer.length > 0)
                        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["success"] || "l_success"}` });
                    else
                        this.toast.show({ severity: 'info', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: `${this.props.language["data_null"] || "l_data_null"}` })
                }
            )
    }

    onClickSchedulePlan(objCustomerInfo) {
        this.setState({
            stateLG: {
                ...this.state.stateLG,
                CustomerInfo: objCustomerInfo,
                visibleAddCustomerModal: true
            }
        })
    }

    SaveCustomerInfo = async (data) => {
        const url = URL + 'digitalmapping/SaveCustomerInfo';
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
            this.toast.show({ severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: error });
        }
        finally {

        }
    }

    renderAddCustomerModal() {
        return (
            <div className="p-grid">
                <div className="p-col-6">
                    <label>{this.props.language["employee"] || "employee"}</label>
                    <EmployeeDropDownList
                        parentId={0}
                        id="employeeCustomer"
                        onChange={(e, value) => { this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, employeeId: value } } }) }}
                        value={this.state.stateLG.CustomerInfo.employeeId}
                        mode="single"
                        type=""
                        typeId={144}
                    />
                </div>
                <div className="p-col-6">
                    <label>{this.props.language["date"] || "l_date"}</label>
                    <Calendar
                        dateFormat="yy-mm-dd"
                        id="trackingDate" showIcon
                        value={this.state.stateLG.CustomerInfo.trackingDate}
                        onChange={(e) => {
                            this.setState({
                                stateLG: {
                                    ...this.state.stateLG,
                                    CustomerInfo: {
                                        ...this.state.stateLG.CustomerInfo,
                                        trackingDate: e.value
                                    }
                                }
                            })
                        }
                        }
                    />
                </div>
                <div className="p-col-12">
                    <Fieldset legend={this.props.language["customer_information"] || "l_customer_information"}>
                        <div className="p-grid">
                            <div className="p-col-6">
                                <span className="p-float-label">
                                    <InputText id="CustomerName" value={this.state.stateLG.CustomerInfo.customerName || ""} onChange={(e) => { this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerName: e.target.value } } }) }} />
                                    <label htmlFor="CustomerName">{this.props.language["full_name"] || "l_full_name"}</label>
                                </span>
                            </div>
                            <div className="p-col-6">
                                <span className="p-float-label">
                                    <InputMask id="CustomerPhone" mask="9999999999" value={this.state.stateLG.CustomerInfo.customerPhone || ""} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerPhone: e.value } } })} />
                                    <label htmlFor="CustomerPhone">{this.props.language["phone"] || "phone"}</label>
                                </span>
                            </div>
                            <div className="p-col-11">
                                <span className="p-float-label">
                                    <InputText id="CustomerAddress" value={this.state.stateLG.CustomerInfo.customerAddress || ""} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerAddress: e.target.value } } })} />
                                    <label htmlFor="CustomerAddress">{this.props.language["address"] || "address"}</label>
                                </span>
                            </div>
                            <div className="p-col-1">
                                <Button className="p-button-primary" icon="pi pi-search" onClick={() => this.onClickSearchLatLng()} />
                            </div>
                            <div className="p-col-6">
                                <span className="p-float-label">
                                    <InputText id="CustomerLat" value={this.state.stateLG.CustomerInfo.customerLat || ""} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerLat: e.target.value } } })}></InputText>
                                    <label htmlFor="CustomerLat">{this.props.language["customer_lat"] || "l_customer_lat"}</label>
                                </span>
                            </div>
                            <div className="p-col-6">
                                <span className="p-float-label">
                                    <InputText id="CustomerLng" value={this.state.stateLG.CustomerInfo.customerLng || ""} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerLng: e.target.value } } })}></InputText>
                                    <label htmlFor="CustomerLng">{this.props.language["customer_lang"] || "l_customer_lang"}</label>
                                </span>
                            </div>
                            <div className="p-col-12">
                                <span className="p-float-label">
                                    <InputText id="CustomerNote" value={this.state.stateLG.CustomerInfo.customerNote || ""} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, CustomerInfo: { ...this.state.stateLG.CustomerInfo, customerNote: e.target.value } } })} />
                                    <label htmlFor="CustomerNote">{this.props.language["notes"] || "notes"}</label>
                                </span>
                            </div>
                        </div>
                    </Fieldset>
                </div>
            </div>)
    }


    renderFooterCustomerModal() {
        return (
            <div>
                <Button
                    label={this.props.language["cancel"] || "cancel"}
                    icon="pi pi-times"
                    onClick={
                        () => this.setState({
                            stateLG: {
                                ...this.state.stateLG,
                                visibleAddCustomerModal: false
                            }
                        })}
                    className="p-button-text" />
                <Button
                    label={this.props.language["save"] || "save"}
                    icon="pi pi-save"
                    onClick={this.onClickSaveCustomer}
                    autoFocus />
            </div>
        );
    }

    templateToolModalListCustomer(rowData) {
        let objCustomerInfo = {
            customerName: rowData.customerName,
            customerPhone: rowData.customerPhone,
            customerAddress: rowData.customerAddress,
            customerLat: rowData.customerLat,
            customerLng: rowData.customerLng,
            customerNote: rowData.customerNote,
            employeeId: rowData.employeeId,
            trackingDate: new Date(),
            cusId: rowData.customerId
        }
        return (
            <AiFillEdit
                size={20}
                title={this.props.language["filter_schedule"] || "l_filter_schedule"}
                onClick={() => this.onClickSchedulePlan(objCustomerInfo)}
            />
        )
    }

    renderListCustomerModal() {
        let listCustomer = this.props.listCustomer;
        let htmlTable = null;
        if (listCustomer !== undefined && listCustomer.length > 0) {
            htmlTable = <div>
                <div className="card">
                    <DataTable
                        value={this.props.listCustomer} rows={7}
                        scrollable scrollHeight="500px"
                        responsive rowHover paginator
                        rowsPerPageOptions={[7, 20, 50, 100]}
                        className="p-datatable-gridlines"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        dataKey="rowNum">
                        <Column field="rowNum" style={{ width: "40px" }} header="STT" />
                        <Column field="employeeName" header={this.props.language["employee"] || "employee"} style={{ width: '200px' }}></Column>
                        <Column field={(e) => moment(e.planDate, "YYYYMMDD").format("DD/MM/YYYY")} header={this.props.language["date"] || "l_date"} style={{ width: 100 }} />
                        <Column field="customerPhone" style={{ width: '100px' }} header={this.props.language["customer_phone"] || "l_customer_phone"} />
                        <Column filterMatchMode="contains" style={{ width: '100px' }} field="customerName" header={this.props.language["customer_name"] || "l_customer_name"} />
                        <Column filterMatchMode="contains" field="customerAddress" header={this.props.language["customer_address"] || "l_customer_address"} />
                        <Column body={this.templateToolModalListCustomer} style={{ width: "50px", textAlign: 'center', cursor: 'pointer' }} />
                    </DataTable>
                </div>
            </div>
        }
        return (
            <div>
                <div className="p-grid">
                    <div className="p-col-6">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={this.state.stateLG.dateListCustomer} onChange={(e) => this.setState({ stateLG: { ...this.state.stateLG, dateListCustomer: e.value } })}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="dateListCustomer" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon
                        />
                    </div>
                    <div className="p-col-6">
                        <label>{this.props.language["employee"] || "l_employee"}</label>
                        <EmployeeDropDownList
                            parentId={0}
                            id="employeeListCustomer"
                            onChange={(e, value) => this.setState({ stateLG: { ...this.state.stateLG, employeeIdInModalListCustomer: value } })}
                            value={this.state.stateLG.employeeIdInModalListCustomer}
                            mode="single"
                            type=""
                            typeId={144}
                        />
                    </div>
                    <div className="p-col-2">
                        {this.state.permission !== undefined && (this.state.permission.view === true && <Button
                            label={this.props.language["search"] || "search"}
                            icon="pi pi-search"
                            style={{ marginRight: '.25em' }}
                            onClick={this.onClickFilterListCustomer}
                        />)}

                    </div>
                </div>
                {htmlTable}
            </div>
        )
    }

    render() {
        let User = JSON.parse(localStorage.getItem("USER"))
        let buttonAddCustomer = null;
        let dialogAddCustomer = null;
        let dialogListCustomer = null;
        let buttonListCustomer = null;
        if (User.accountId !== 1006)
            this.optionsFilter.splice(2, 1);
        if (User.accountId === 3) {
            buttonAddCustomer = <Button
                onClick={
                    () => {
                        if (this.MarkerCustomerAddress !== null)
                            this.MarkerCustomerAddress.setMap(null);
                        this.arrayDirectionRenders.forEach(directionRender => { directionRender.setMap(null); });
                        if (markerclusterer != null)
                            markerclusterer.clearMarkers();
                        if (this.state.typeSaveCustomerData === 'Add') {
                            this.setState({
                                stateLG: {
                                    ...this.state.stateLG,
                                    visibleAddCustomerModal: true,
                                    typeSaveCustomerData: 'Add'
                                }
                            })
                        }
                        else {
                            this.setState({
                                stateLG: {
                                    ...this.state.stateLG,
                                    visibleAddCustomerModal: true,
                                    typeSaveCustomerData: 'Add',
                                    CustomerInfo: {
                                        trackingDate: new Date(),
                                    }
                                }
                            })
                        }
                    }}
                style={{ float: 'right', right: 110, top: 80, position: 'absolute' }}
                className="p-button-danger" icon="pi pi-user-plus"></Button>

            dialogAddCustomer = <Dialog
                header={this.props.language["add_new_customer"] || "l_add_new_customer"}
                visible={this.state.stateLG.visibleAddCustomerModal}
                style={{ width: '45vw' }}
                onHide={
                    () => this.setState({
                        stateLG: {
                            ...this.state.stateLG,
                            visibleAddCustomerModal: false
                        }
                    })}
                position="top-right"
                footer={this.renderFooterCustomerModal()}
            >
                {this.renderAddCustomerModal()}
            </Dialog>

            buttonListCustomer = <Button
                onClick={
                    () => {
                        this.arrayDirectionRenders.forEach(directionRender => { directionRender.setMap(null); });
                        if (markerclusterer != null)
                            markerclusterer.clearMarkers();
                        this.setState({
                            stateLG: {
                                ...this.state.stateLG,
                                visibleListCustomerModal: true,
                                typeSaveCustomerData: 'Update'
                            }
                        })
                    }
                }
                style={{ float: 'right', right: 157, top: 80, position: 'absolute' }}
                className="p-button-primary"
                icon="pi pi-list"
            ></Button>

            dialogListCustomer =
                <Dialog
                    header={this.props.language["customers_list"] || "l_customers_list"}
                    visible={this.state.stateLG.visibleListCustomerModal}
                    style={{ width: '60vw' }}
                    contentStyle={{ height: '700px' }}
                    onHide={
                        () => this.setState({
                            stateLG: {
                                ...this.state.stateLG,
                                visibleListCustomerModal: false
                            }
                        })}
                >
                    {this.renderListCustomerModal()}
                </Dialog>
        }
        return (
            this.state.permission.view ? (
                <React.Fragment className="p-fluid">
                    <Toast ref={(el) => this.toast = el} />
                    <GMap ref={(el) => this.gmap = el} key="AIzaSyCUJWK7xacDuRfikfamf_w1LlWA4brxeHU"
                        options={this.state.options} overlays={this.state.overlays}
                        style={{ top: 70, bottom: 0, position: 'absolute', width: '99%', }}>
                    </GMap>
                    {/* <Button onClick={this.openRight()} style={{ marginTop: "5px", marginLeft: 180 }} className="p-button-danger" icon="pi pi-list" /> */}
                    <div className={this.state.toogle === undefined ? "layout-wrapper" : this.state.toogle}>
                        <div className="layout-config" style={{ backgroundColor: 'white', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
                            <div className="layout-config-content-wrapper">
                                <Button style={{ top: 0 }} className="layout-config-close" icon="pi pi-times"
                                    onClick={() => this.openRight()} />
                                <div style={{ height: '95%' }} className="layout-config-content">
                                    {this.renderCarDialogContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {dialogAddCustomer}
                    {buttonAddCustomer}
                    {buttonListCustomer}
                    {dialogListCustomer}
                    {this.state.permission !== undefined && (this.state.permission.view === true && <Button onClick={() => this.setState({ visible: true })} style={{ float: 'right', right: 65, top: 80, position: 'absolute', }} className="p-button-primary" icon="pi pi-search" />)}

                    <Sidebar position="right" visible={this.state.visible} onHide={() => this.setState({ visible: false })}>
                        <div className="p-grid">
                            {<RegionApp  {...this} />}
                            <div className="p-col-12 p-md-12 p-sm-12">
                                <label>{this.props.language["date"] || "l_date"}</label>
                                <Calendar value={this.state.datefilter}
                                    onChange={(e) => this.setState({ datefilter: e.value })}
                                    dateFormat="dd/mm/yy"
                                    showIcon className="p-fluid"
                                />
                            </div>
                            <div className="p-col-12 p-md-12 p-sm-12">
                                <label>{this.props.language["employee"] || "employee"}</label>
                                <EmployeeDropDownList
                                    parentId={0}
                                    id="employee"
                                    onChange={this.handleChange}
                                    value={this.state.employee}
                                    mode="single"
                                    type=""
                                    typeId={0}
                                />
                            </div>
                            <div className="p-col-12 p-md-12 p-sm-12">
                                <label>{this.props.language["storelist.shopcode"] || "storelist.shopcode"}</label>
                                <InputText
                                    id="shopCode"
                                    type="text"
                                    style={{ width: '100%' }}
                                    placeholder={this.props.language["storelist.shopcode"] || "storelist.shopcode"}
                                    value={this.state.shopCode || ""}
                                    onChange={this.handleChangeForm}
                                />
                            </div>
                            <div className="p-col-12 p-md-12 p-sm-12">
                                <label>{this.props.language["option"] || "l_option"}</label>
                                <SelectButton
                                    value={this.state.optionFilter}
                                    options={this.optionsFilter}
                                    onChange={(e) => this.setState({ optionFilter: e.value })}
                                    itemTemplate={this.optionFilterTemplate} />
                            </div>
                            <div className="p-col-12 p-md-12 p-sm-12">
                                {this.state.permission !== undefined && (this.state.permission.view === true && <Button
                                    label={this.props.language["search"] || "search"}
                                    icon="pi pi-search"
                                    style={{ marginRight: '.25em' }}
                                    onClick={() => this.LoadList()} />)}
                            </div>
                        </div>
                    </Sidebar>
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}

function mapStateToProps(state) {
    return {
        shoplist: state.mapping.shoplist,
        listEmployeeToCalculateDistance: state.mapping.listEmployeeToCalculate,
        regions: state.regions.regions,
        errors: state.mapping.errors,
        loading: state.mapping.loading,
        usearea: true,
        useregion: true,
        RegionClass: "p-field p-col-12 p-md-12 p-sm-12",
        RouteByEmployee: state.mapping.routeResult,
        RouteFromStartPoint: state.mapping.routeFromStartPoint,
        listCustomer: state.mapping.listCustomer,
        language: state.languageList.language
    }
}

function mapDispatchToProps(dispatch) {
    return {
        MappingController: bindActionCreators(MappingActionCreate, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DigitalMapping)