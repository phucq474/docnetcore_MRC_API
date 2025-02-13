import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import Search from '../Controls/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Toast } from 'primereact/toast';
import { HelpPermission, getLogin } from '../../Utils/Helpler'
import Page403 from '../ErrorRoute/page403';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { ChartBar as NationWideBar } from "./ChartBar";
import { ProgressSpinner } from 'primereact/progressspinner';
import { CreateDashboardAction } from '../../store/DashboardController';
import moment from 'moment';
import { ChartColumnMultiLabel } from './ChartColumnMultiLabel'
import { ChartCirle } from './ChartCirle';
import { ChartBar } from './ChartBar';
import { Dropdown } from 'primereact/dropdown';
import { ChartColum } from './ChartColumn';
import { ChartLine } from './ChartLine';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Option = [
    { "code": "1", "name": "Ngày" },
    // { "code": "2", "name": "Tuần" },
    // { "code": "3", "name": "Tháng" },
    // { "code": "4", "name": "Qúy" },
    // { "code": "5", "name": "Năm" }
]
const lstColor = ["#045DEC", "#FA8E05", "#E32D32", "#FFCC00", "#21A30D", "#566D6E"]
class DashboardAttendantForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,

            data: [],
            permission: {},
            reportype: "1",
            viewMode: 'date',
            formatDate: 'dd/MM/yy',
            todate: new Date(),
            activeIndex: 0,
            isFetchedAttendant: false,
            mainData1: [],
            mainData2: [],
            initMainData1: [],
            initMainData2: [],
            detail1: {},
            detail2: {},
            headerDetail1: [],
            headerDetail2: [],
            selectedDetail1: "",
            selectedDetail2: "",
            byMonth: [],
            byKASDataEmp: [],
            byKASDataStatus: []
        }
        this.pageId = 1047
        this.styleSpinner = {
            width: "50px",
            height: "50px",
            position: "absolute",
            zIndex: 100,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }
    }

    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }

    componentDidMount() {
        this.Search();
    }
    Search = async (tabIndex) => {
        this.setState({ loading: true, })
        const iState = this.state;
        if (iState.todate.undefined || iState.todate === null) {
        } else {
            let fromDate;
            switch (iState.reportype) {
                case "1"://daily
                    fromDate = moment(iState.todate).format("YYYY-MM-DD");
                    break;
                case "2"://weekly
                    fromDate = moment(iState.todate.setDate(-6)).format("YYYY-MM-DD");
                    break;
                case "3"://Monthly
                    fromDate = iState.todate.getFullYear() + "" + (iState.todate.getMonth() > 9 ? iState.todate.getMonth() : ("0" + iState.todate.getMonth())) + "01"
                    break;
                case "4"://Quaterly
                    fromDate = moment(iState.todate.setDate(-90)).format("YYYY-MM-DD");
                    break;
                case "5"://Yearly
                    fromDate = iState.todate.getFullYear() + "01" + "01"
                    break;
                default:
                    fromDate = moment(iState.todate).format("YYYY-MM-DD");
            }
            const data = {
                reporType: this.state.reportype,
                fromDate: fromDate,
                toDate: moment(iState.todate).format('YYYY-MM-DD')
            }
            // if (this.state.activeIndex === 0 && tabIndex !== 1) {
            const userInfo = await getLogin();
            await Promise.all([
                // this.props.DashboardController.GetAttendantbyArea(data.fromDate),
                // this.props.DashboardController.GetAttendantbyMonth(data.fromDate),
                // this.props.DashboardController.GetAttendantbyUserByLeader(data.fromDate),
                // this.props.DashboardController.GetStatusbyArea(data.fromDate),
                // this.props.DashboardController.GetStatusbyLeader(data.fromDate),
                // this.props.DashboardController.GetAttendantbyWeek(data.fromDate),

                //Attendant
                this.props.DashboardController.GetAttendantDaily_V2(data.fromDate),
                this.props.DashboardController.GetAttendant_ByKAS_Employee(data.fromDate),
                this.props.DashboardController.GetAttendant_ByMonth_Compare(data.fromDate),
                //Employee
                this.props.DashboardController.GetEmployee_Chart(data.fromDate),

            ])
            // const dataByWeek = await this.props.byWeek
            const dataByKASEmp = await this.props.getAttendant_ByKAS_Employee
            // const detail1 = {}, detail2 = {}
            // this.handleMapDetailData(dataByWeek.table, detail1);
            // this.handleMapDetailData(dataByWeek.table1, detail2);
            this.setState({
                // detail1, detail2,
                // mainData1: JSON.parse(JSON.stringify(dataByWeek?.table || [])),
                // mainData2: JSON.parse(JSON.stringify(dataByWeek?.table1 || [])),
                // initMainData1: JSON.parse(JSON.stringify(dataByWeek?.table || [])),
                // initMainData2: JSON.parse(JSON.stringify(dataByWeek?.table1 || [])),
                // headerDetail1: Object.keys(detail1),
                // headerDetail2: Object.keys(detail2),
                // refreshAttendant2: !this.state.refreshAttendant2,
                byKASDataEmp: JSON.parse(JSON.stringify(dataByKASEmp?.table || [])),
                byKASDataStatus: JSON.parse(JSON.stringify(dataByKASEmp?.table1 || [])),
                // isSaleSup: userInfo?.positionId === 22,
            })
            // }
        }
        this.setState({ loading: false, })
    }
    handleMapDetailData = (arrayTable, detailArray) => {
        for (let i = 0, lenTable = arrayTable?.length; i < lenTable; ++i) {
            const { detail, ly0, ly1, lyline2, title, xLable, yTitle, } = arrayTable[i] || {}
            const detailParse = JSON.parse(detail || "[]")
            for (let j = 0, lenDetail = detailParse?.length; j < lenDetail; ++j) {
                const { EmployeeName, } = detailParse[j]
                const objectDetail = detailParse[j]
                objectDetail.detail = detail
                objectDetail.ly0 = ly0
                objectDetail.ly1 = ly1
                objectDetail.lyline2 = lyline2
                objectDetail.title = title
                objectDetail.xLable = xLable
                objectDetail.yTitle = yTitle
                if (detailArray[EmployeeName]) {
                    detailArray[EmployeeName].push(objectDetail)
                } else {
                    detailArray[EmployeeName] = [objectDetail]
                }
            }
        }
    }
    handleChangeForm = async (value, keySelected, keyMainData) => {
        const dictDetail = keyMainData === "mainData1" ? this.state.detail1 : this.state.detail2
        const initData = keyMainData === "mainData1" ? this.state.initMainData1 : this.state.initMainData2
        if (value) {
            await this.setState({
                [`${keySelected}`]: value,
                [`${keyMainData}`]: dictDetail[`${value}`] || []
            });
        } else {
            await this.setState({
                [`${keySelected}`]: value,
                [`${keyMainData}`]: initData
            });
        }
    }
    onChangeMode = (e) => {
        let view, formatDate;
        switch (e.value) {
            case "1":
                view = "date";
                formatDate = "dd/MM/yy";
                break;
            case "2"://weekly
                view = "date";
                formatDate = "dd/MM/yy";
                break;
            case "3"://Monthly
                view = "month";
                formatDate = "MM/yy";
                break;
            case "4"://Quaterly
                view = "month";
                formatDate = "MM/yy";
                break;
            case "5"://Yearly
                view = "month";
                formatDate = "MM/yy";
                break;
            default:
                break;
        }
        this.setState({ reportype: e.value, viewMode: view, formatDate: formatDate });
    }

    ExportPDF = async () => {
        await this.setState({ loading: true });
        let pdf = new jsPDF('l', 'mm', 'a4');
        const byarea = document.getElementById('chartarea');
        let canvas = await html2canvas(byarea)
        let imgWidth = 208;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        const page1 = canvas.toDataURL('img/jpeg', 0.2);
        pdf.addImage(page1, 'JPG', 40, 10, imgWidth, imgHeight, true);
        //page 2
        const byleader = document.getElementById('chartleader');
        canvas = await html2canvas(byleader)
        const page2 = canvas.toDataURL('img/jpeg', 0.2);
        pdf.addPage();
        pdf.addImage(page2, 'JPG', 40, 10, imgWidth, imgHeight, true);
        //save
        pdf.save("dashboard-attendant.pdf");
        await this.setState({ loading: false });

    }

    onSeletedTab = (e) => {
        if (!this.state.isFetchedAttendant) {
            this.setState({ activeIndex: e.index });
            this.setState({ isFetchedAttendant: true });
            this.Search(1);
        } else {
            this.setState({ activeIndex: e.index });
            this.setState({ isFetchedAttendant: true });
        }
    }

    render() {
        // //Chart Tab 0 
        // const byMonth = this.props.byMonth !== undefined ? this.props.byMonth : [];
        // //byarea
        // const user_nw = this.props.area?.table !== undefined ? this.props.area?.table : [];
        // const user_area = this.props.area?.table1 !== undefined ? this.props.area?.table1 : [];
        // const attendant_status = this.props.area?.table2 !== undefined ? this.props.area?.table2 : [];
        // const legitArea_user_area = user_area.length <= 5
        // //By leader
        // const user_ld_nw = this.props.userld?.table !== undefined ? this.props.userld?.table : [];
        // const user_ld = this.props.userld?.table1 !== undefined ? this.props.userld?.table1 : [];
        // const legitLeader_user_ld_nw = user_ld_nw.length <= 5
        // //Status by area
        // const status_nw = this.props.statusbyarea?.table !== undefined ? this.props.statusbyarea?.table : [];
        // const status_active = this.props.statusbyarea?.table1 !== undefined ? this.props.statusbyarea?.table1 : [];
        // const status_area = this.props.statusbyarea?.table2 !== undefined ? this.props.statusbyarea?.table2 : [];
        // const legitStatus_status_active = status_active.length <= 5
        // //statu leader 

        // const status_ld_nw = this.props.statusbyleader?.table !== undefined ? this.props.statusbyleader?.table : [];
        // const status_ld = this.props.statusbyleader?.table1 !== undefined ? this.props.statusbyleader?.table1 : [];
        // const legitTusLeader_status_ld_nw = status_ld_nw.length <= 5

        //Attendant
        const attendant_daily_off = this.props.getAttendantDaily_V2?.table !== undefined ? this.props.getAttendantDaily_V2?.table : [];
        const byMonth_Compare = this.props.getAttendant_ByMonth_Compare?.table !== undefined ? this.props.getAttendant_ByMonth_Compare?.table : [];
        const byMonth_MTD = this.props.getAttendant_ByMonth_Compare?.table1 !== undefined ? this.props.getAttendant_ByMonth_Compare?.table1 : [];
        const byMonth_WorkTime = this.props.getAttendant_ByMonth_Compare?.table2 !== undefined ? this.props.getAttendant_ByMonth_Compare?.table2 : [];
        //Employee
        const employee_total = this.props.getEmployee_Chart?.table !== undefined ? this.props.getEmployee_Chart?.table : [];
        const employee_position = this.props.getEmployee_Chart?.table1 !== undefined ? this.props.getEmployee_Chart?.table1 : [];
        return (
            this.state.permission.view ? (
                <div className="p-fluid">
                    <Toast ref={(el) => this.toast = el} baseZIndex={135022} />
                    {
                        this.state.loading && (
                            <ProgressSpinner style={this.styleSpinner} strokeWidth="8" fill="none" animationDuration=".5s" />
                        )
                    }
                    <div style={{ paddingBottom: 10, paddingTop: 10, textAlign: "right" }}>
                        <div className="p-grid">
                            <div className="p-col-6"></div>
                            <div className="p-col-6">
                                <div className="p-d-inline-flex">
                                    <div className="p-mr-2">
                                        <SelectButton className="p-d-inline"
                                            options={Option} optionLabel="name"
                                            optionValue="code" onChange={(e) => this.onChangeMode(e)}
                                            value={this.state.reportype}></SelectButton>
                                    </div>
                                    <div className="p-mr-2">
                                        <Calendar view={this.state.viewMode}
                                            dateFormat={this.state.formatDate}
                                            onChange={(e) => this.setState({ todate: e.value })}
                                            monthNavigator showIcon
                                            value={this.state.todate} />
                                    </div>
                                    <div className="p-mr-2">
                                        <Button icon="pi pi-search" style={{ marginRight: 10 }} onClick={() => this.Search()} />
                                        <Button className="p-button p-button-danger" icon="pi pi-file-pdf" onClick={() => this.ExportPDF()}></Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <TabView style={{ marginLeft: 2, height: 46 }}
                        activeIndex={this.state.activeIndex}
                        onTabChange={(e) => this.onSeletedTab(e)}>
                        {/* <TabPanel header="TÌNH HÌNH NHÂN SỰ">
                            <div id="dashboardUser" style={{ paddingLeft: 10, paddingRight: 10 }}  >
                                <div id="chartarea" className="p-grid">
                                    <div style={{ textAlign: 'center' }} className="p-col-12 p-md-12 p-sm-12">
                                        {user_nw.length > 0 ?
                                            <NationWideBar key="1" chartHeight={200}
                                                groupBar={["4", "3", "2", "1", "0"]} datachart={user_nw} /> :
                                            <ProgressSpinner style={{ width: '50px', height: '50px' }}
                                                strokeWidth="8" fill="#EEEEEE" animationDuration=".35s" />
                                        }
                                    </div>
                                    <div style={{ textAlign: 'center' }} className="p-col-12 p-md-12 p-sm-12">
                                        {byMonth.length > 0 ?
                                            <ChartColumnMultiLabel groupColumn={["0", "1", "2", "3", "4", "line5"]}
                                                grouping={false} stacking="normal" multiLabel={false} lineWidth={2}
                                                datachart={byMonth} titleXLeft={"Số lượng"} titleXRight={"Số lượng SR"} />
                                            : null}
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-5 p-sm-12`}>
                                        {user_area.length > 0 && <ChartCirle datachart={user_area} useLegend={false} />}
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-7 p-sm-12`}>
                                        {attendant_status.length > 0 ?
                                            <ChartBar groupBar={["0", "1", "2", "3", "4"]} datachart={attendant_status} /> :
                                            null
                                        }
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-5 p-sm-12`}>
                                        {user_ld_nw.length > 0 && <ChartCirle useLegend={false} datachart={user_ld_nw} />}
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-7 p-sm-12`}>
                                        {user_ld.length > 0 ?
                                            <ChartBar key="3" groupBar={["0", "1", "2", "3", "4"]} datachart={user_ld} /> : null
                                        }
                                    </div>
                                </div>
                                <div id="chartleader" className="p-grid">
                                    <div style={{ textAlign: 'center' }} className="p-col-12">
                                        {status_nw.length > 0 &&
                                            <ChartBar chartHeight={200} groupBar={['3', '2', '1', '0']} datachart={status_nw} />
                                        }
                                    </div>
                                </div>
                                <div id="chartleader" className="p-grid">
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-${legitStatus_status_active ? '8' : '12'} p-sm-12`}>
                                        {status_area.length > 0 ?
                                            <ChartBar groupBar={['3', '2', '1', '0']} datachart={status_area} /> : null
                                        }
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-${legitTusLeader_status_ld_nw ? '8' : '12'} p-sm-12`}>
                                        {status_ld.length > 0 ?
                                            <ChartBar groupBar={['3', '2', '1', '0']} datachart={status_ld} /> : null
                                        }
                                    </div>
                                </div>
                                <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <div className="p-grid">
                                        {(Object.keys(this.state.detail1)?.length > 0) && (
                                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                                <div style={{ position: 'absolute', cursor: 'pointer', top: 5, right: 5, zIndex: 100, }}>
                                                    <Dropdown value={this.state.selectedDetail1} showClear={this.state.selectedDetail1} placeholder="Toàn bộ"
                                                        options={this.state.headerDetail1} onChange={(e) => this.handleChangeForm(e.value, 'selectedDetail1', "mainData1")} />
                                                </div>
                                                <div style={{ width: '100%', }}>
                                                    <ChartColum groupColumn={['0', '1', 'line2', 'line3']} datachart={this.state.mainData1} titleXLeft={"Số lượng"} titleXRight={"Phần trăm (%)"} />
                                                </div>
                                            </div>
                                        )}
                                        {Object.keys(this.state.detail2)?.length > 0 && (
                                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                                <div style={{ position: 'absolute', cursor: 'pointer', top: 5, right: 5, zIndex: 100, }}>
                                                    <Dropdown value={this.state.selectedDetail2} showClear={this.state.selectedDetail2} placeholder="Toàn bộ"
                                                        options={this.state.headerDetail2} onChange={(e) => this.handleChangeForm(e.value, 'selectedDetail2', "mainData2")} />
                                                </div>
                                                <div style={{ width: '100%', }}>
                                                    <ChartColum groupColumn={['0', '1', 'line2', 'line3']} datachart={this.state.mainData2} titleXLeft={"Số lượng"} titleXRight={"Phần trăm (%)"} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabPanel> */}

                        <TabPanel header="TÌNH HÌNH NHÂN SỰ">
                            <div id="dashboardUser" style={{ paddingLeft: 10, paddingRight: 10 }}  >
                                <div id="chartarea" className="p-grid">
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-3 p-sm-12`}>
                                        {employee_total.length > 0 &&
                                            <div style={{textAlign:"center",}}>
                                                <text style={{fontWeight:"bold", fontSize:"18px", display:"block"}}>{employee_total[0].title}</text>
                                                <br/>
                                                <text style={{fontWeight:"bold", fontSize:"150px"}}>{employee_total[0].quantity}</text>
                                            </div>
                                        }
                                    </div>
                                    <div style={{ textAlign: 'center' }} className={`p-col-12 p-md-3 p-sm-12`}>
                                        {employee_position.length > 0 && <ChartCirle datachart={employee_position} useLegend={false} />}
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="TÌNH HÌNH CHẤM CÔNG">
                            <div id="dashboardAttendant" style={{ paddingLeft: 10, paddingRight: 10 }}  >
                                <div id="chartAttendant" className="p-grid">
                                    <div style={{ textAlign: 'center' }} className="p-col-12 p-md-12 p-sm-12">
                                        {attendant_daily_off.length > 0 ?
                                            //Tình hình chấm công
                                            <NationWideBar key="1" chartHeight={200}
                                                groupBar={["11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"]} datachart={attendant_daily_off} listColorCol={lstColor} /> :
                                            <ProgressSpinner style={{ width: '50px', height: '50px' }}
                                                strokeWidth="8" fill="#EEEEEE" animationDuration=".35s" />
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="p-grid">
                                        <div className="p-col-12 p-md-6 p-sm-12">
                                            {(Object.keys(this.state.byKASDataEmp)?.length > 0) && (
                                                //Thống kê nhân viên chấm công theo KAS
                                                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                                    <div style={{ width: '100%', }}>
                                                        <ChartColum groupColumn={['0', '1']} datachart={this.state.byKASDataEmp} titleXLeft={"Số lượng"} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-col-12 p-md-6 p-sm-12">
                                            {(Object.keys(this.state.byKASDataStatus)?.length > 0) && (
                                                //Thống kê tình trạng chấm công theo KAS
                                                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                                    <div style={{ width: '100%', }}>
                                                        <ChartColum groupColumn={['0', '1', '2', '3', '4', '5']} datachart={this.state.byKASDataStatus} titleXLeft={"Số lượng"} listColorCol={lstColor} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }} className="p-col-12 p-md-12 p-sm-12">
                                    {byMonth_Compare.length > 0 ?
                                        //So sánh tình trạng chấm công - Tháng
                                        <ChartBar groupBar={["5", "4", "3", "2", "1", "0"]} datachart={byMonth_Compare} listColorCol={lstColor} /> : null
                                    }
                                </div>
                                <div style={{ textAlign: 'center' }} className="p-col-12 p-md-12 p-sm-12">
                                    {(Object.keys(byMonth_MTD)?.length > 0) && (
                                        //Thống kê tình trạng chấm công theo KAS - Tháng
                                        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                            <div style={{ width: '100%', }}>
                                                <ChartColum groupColumn={['0', '1', '2', '3', '4', '5']} datachart={byMonth_MTD} titleXLeft={"Số lượng"} listColorCol={lstColor} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {(Object.keys(byMonth_WorkTime)?.length > 0) && (
                                        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', }}>
                                            <div style={{ width: '100%', }}>
                                                <ChartColum groupColumn={['line0', 'line1', 'line2', 'line3']} datachart={byMonth_WorkTime} titleXLeft={"Số lượng"} listColorCol={lstColor} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>) : (this.state.permission.view !== undefined && (
                    <Page403 />
                ))

        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        area: state.dashboard.byarea,
        byMonth: state.dashboard.byMonth,
        byWeek: state.dashboard.byWeek,
        userbyleader: state.dashboard.userbyleader,
        statusbyarea: state.dashboard.statusbyarea,
        statusbyleader: state.dashboard.statusbyleader,

        getAttendantDaily_V2: state.dashboard.getAttendantDaily_V2,
        getAttendant_ByKAS_Employee: state.dashboard.getAttendant_ByKAS_Employee,
        getAttendant_ByMonth_Compare: state.dashboard.getAttendant_ByMonth_Compare,

        getEmployee_Chart: state.dashboard.getEmployee_Chart
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DashboardController: bindActionCreators(CreateDashboardAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardAttendantForm);