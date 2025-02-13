import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Accordion, AccordionTab } from 'primereact/accordion';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import TimesheetCell from './timesheet-cell';
import { bindActionCreators } from 'redux';
import { AttendantCreateAction } from '../../store/AttendantController';
import { connect } from 'react-redux';
import { download, getToken, URL, HelpPermission, getAccountId } from '../../Utils/Helpler';
import { actionCreatorsTimesheet } from '../../store/TimesheetController';
import moment from 'moment';
import Page403 from '../ErrorRoute/page403';
import { getLogin } from '../../Utils/Helpler';

const lstStatus = [
    { value: 'supUnlock', name: 'Details' },
    { value: 'supLocked', name: 'Sup locked' },
    { value: 'lockedFinal', name: 'Locked final' }
];
const lstSumDefault = [
    { field: 'x/2', dayName: 'X/2', month: 'SUMMARY', width: '60px' },
    { field: 'actual', dayName: 'Ngày công thực tế', month: 'SUMMARY', width: '60px' },
    { field: 'offPaid', dayName: 'Nghỉ hưởng lương', month: 'SUMMARY', width: '60px' },
    { field: 'h', dayName: 'Holliday', month: 'SUMMARY', width: '60px' },
    { field: 'offline', dayName: 'Chấm công offline', month: 'SUMMARY', width: '60px' },
    { field: 'off', dayName: 'OFF', month: 'SUMMARY', width: '60px' },
    { field: 'totalWork', dayName: 'Tổng số ngày công', month: 'SUMMARY', width: '60px' },
    { field: 'ncc', dayName: 'Ngày công chuẩn', month: 'SUMMARY', width: '60px' },
    { field: 'diff', dayName: 'Chênh lệch', month: 'SUMMARY', width: '60px' },
    { field: 'phepTon', dayName: 'Phép tồn', month: 'SUMMARY', width: '60px' },
    { field: 'al', dayName: 'Nghỉ phép', month: 'SUMMARY', width: '60px' },
    { field: 'phepConLai', dayName: 'Ngày phép còn lại', month: 'SUMMARY', width: '60px' },
    { field: 'nbTon', dayName: 'Nghỉ bù tồn', month: 'SUMMARY', width: '60px' },
    { field: 'nb', dayName: 'Nghỉ bù', month: 'SUMMARY', width: '60px' },
    { field: 'nbConLai', dayName: 'Nghỉ bù còn lại', month: 'SUMMARY', width: '60px' },

];
const user = JSON.parse(localStorage.getItem("USER"));
class TimesheetResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            employeeId: [],
            dealerId: null,
            supId: null,
            confirmed: null,
            type: null,
            position: null,
            categoryId: null,
            showComponent: false,
            employeeIdCell: 0,
            workDateCell: 0,
            otCell: null,
            // dateMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            status: 'supUnlock',
            computedHeaderHeight: '150px',
            lock: null,
            permission: {},
        }
        this.pageId = 33
        this.columns = [];
        this.getFilter = this.getFilter.bind(this);
        this.hanldeGetColumn = this.hanldeGetColumn.bind(this);
        this.columnTemplate = this.columnTemplate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.LoadList = this.LoadList.bind(this);
        this.hanldeExportData = this.hanldeExportData.bind(this);
        this.Lock = this.Lock.bind(this);
        this.handleLockData = this.handleLockData.bind(this);
        this.showCellDetail = this.showCellDetail.bind(this);
        this.onHideCellDetail = this.onHideCellDetail.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.clear = this.clear.bind(this);
        this.clearLD = this.clearLD.bind(this);
    }

    showCellDetail




        (data, workDate, ot) {
        // console.log('data', data)
        // console.log('workdate', workDate)
        this.setState({
            showComponent: true,
            dataCell: data,
            workDateCell: workDate,
            otCell: ot
        });
    }
    onHideCellDetail() {
        this.setState({ showComponent: false });
    }
    handleChange(id, value) {
        this.setState({ [id]: value });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value });
    }
    getFilter() {
        this.setState({ loading: true });
        if (this.state.status === null || this.state.status === undefined) {
            this.showError(`${this.props.language["please_select_status_report"] || "l_please_select_status_report"}`);
            return;
        }
        const employees = this.state.employeeId;
        let lstEmp = null;
        if (employees) {
            lstEmp = '';
            employees.forEach(element => {
                lstEmp = lstEmp + element + ',';
            });
        }
        let dates = this.state.dates;

        var data = {
            fromDate: parseInt(moment(dates[0]).format("YYYYMMDD"), 0),
            toDate: parseInt(moment(dates[1]).format("YYYYMMDD"), 0),
            fromdate: moment(dates[0]).format("YYYY-MM-DD"),
            todate: (dates[1] === undefined || dates[1] === null) ? '' : moment(dates[1]).format("YYYY-MM-DD"),
            position: this.state.position ? this.state.position : null,
            supId: this.state.supId,
            employeeId: lstEmp === "" ? null : lstEmp,
            lock: this.state.status === "supLocked" ? 1 : this.state.status === "lockedFinal" ? 100 : null,
            accountName: getLogin().accountName
        }
        return data;
    }
    showError(value) {
        this.toast.show({ severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    clear() {
        this.toastBC.clear();
    }
    clearLD() {
        this.toastLD.clear();
    }
    showConfirm(type) {
        this.toastBC.show({
            severity: 'warn', sticky: true, content: (
                <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                    <div className="p-text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <p>{this.props.language["are_you_sure_to_lock"] || "l_are_you_sure_to_lock"}?</p>
                    </div>
                    <div className="p-grid p-fluid">
                        <div className="p-col-6">
                            <Button type="button" label={this.props.language["yes"] || "l_yes"} className="p-button-success" onClick={(e) => this.handleLockData(type)} />
                        </div>
                        <div className="p-col-6">
                            <Button type="button" label={this.props.language["no"] || "l_no"} className="p-button-secondary" onClick={this.clear} />
                        </div>
                    </div>
                </div>
            )
        });
    }
    showLoading() {
        this.toastLD.show({
            severity: 'warn', sticky: true, content: (
                <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                    <div className="p-text-center">
                        <i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>
                        <h4>{this.props.language["locking"] || "l_locking"}.........</h4>
                    </div>
                    <div className="p-grid p-fluid">
                        <ProgressSpinner style={{ height: '50px', width: '100%' }} />
                    </div>
                </div>
            )
        });
    }
    LoadList() {
        let data = this.getFilter();
        if (this.state.status === "supUnlock") {
            this.hanldeGetColumn();
            this.props.TimesheetController.GetList(data)
                .then(() => {
                    this.setState({ loading: false });
                    this.showSuccess(this.props.timesheetResult.length === 0 ? `${this.props.language["data_null"] || "l_data_null"}` : `${this.props.language["found"] || "l_found"}: ` + this.props.timesheetResult.length + ` ${this.props.language["rows"] || "l_rows"}`);
                    this.getComputedHeaderHeight()
                });
        } else {
            this.props.TimesheetController.GetList_Final(data)
                .then(() => {
                    this.setState({ loading: false });
                    this.showSuccess(this.props.timesheetFinal.length === 0 ? `${this.props.language["data_null"] || "l_data_null"}` : `${this.props.language["found"] || "l_found"}: ` + this.props.timesheetFinal.length + ` ${this.props.language["rows"] || "l_rows"}`);
                    this.getComputedHeaderHeight()
                });
        }
    }
    getComputedHeaderHeight = () => {
        setTimeout(() => {
            try {
                if (document.querySelector('div.timesheet_result')) {
                    const domHeaderQuery = "div.timesheet_result div.p-datatable-scrollable-view.p-datatable-unfrozen-view > div.p-datatable-scrollable-header"
                    let computedHeaderHeight = window.getComputedStyle?.(document.querySelector(domHeaderQuery))?.getPropertyValue('height')
                    if (computedHeaderHeight.includes("px")) {
                        computedHeaderHeight = (+(computedHeaderHeight.slice(0, -2)) - 1) + "px"
                    }
                    this.setState({ computedHeaderHeight: computedHeaderHeight || "150px" });
                }
            } catch (e) { }
        }, 100)
    }
    hanldeExportData() {
        let data = this.getFilter();
        this.props.TimesheetController.ExportTimeSheet(data)
            .then(() => {
                this.setState({ loading: false });
                if (this.props.exportTimeSheet.status === 1 || this.props.exportTimeSheet.status === 200) {
                    download(this.props.exportTimeSheet.fileUrl);
                    this.showSuccess(this.props.exportTimeSheet.message);
                }
                else {
                    this.showError(this.props.exportTimeSheet.message);
                }
            }
            );

    }
    handleLockData(type) {
        this.clear();
        this.showLoading();
        let data = this.getFilter();
        data = {
            ...data,
            type: "Lock"
        }
        this.Lock(JSON.stringify(data));
    }
    async Lock(data) {
        const url = URL + 'timesheet/lockASM';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        try {
            const request = new Request(url, requestOptions);
            const response = await fetch(request);
            const result = await response.json();
            if (response.status === 200)
                if (result.result === 1) {
                    this.showSuccess(`${this.props.language["lock_data_successful"] || "l_lock_data_successful"}`);
                    this.LoadList();
                    this.clearLD();
                }
                else {
                    this.showError(result.messenger);
                    this.clearLD();
                }
        }
        catch (error) {
            this.showError("Error");
            this.clearLD();
        }
    }

    renderHeader() {
        // this.hanldeGetColumn();
        const days = this.hanldeGetColumn();
        const accountId = user.accountId;
        let lstSummary = [];
        switch (accountId) {
            case 3:
                lstSummary = lstSumDefault;
            default:
                lstSummary = lstSumDefault;
                break;
        }
        let headerMonth = [], headerDayName = [], headerDay = [], result = [], background = "#f8f8f8", fontColor = "#000000";
        this.columns.forEach((item, index) => {
            if (index > 2) {
                if (item.month === undefined) {
                    headerMonth.push(
                        <Column key={item.header}
                            header={item.header}
                            style={{ height: 36, textAlign: "center", fontSize: 16, backgroundColor: "#606060" }} // #191919
                            rowSpan={3} />);
                }
                else {
                    if (item.dayName === 'Sun') {
                        background = "#7d2f0d";
                        fontColor = "#ffffff"
                    }
                    else {
                        background = "#f8f8f8";
                        fontColor = "#000000"
                    }
                    headerDayName.push(
                        <Column key={item.dayName}
                            header={item.dayName}
                            style={{ height: 50, textAlign: "center", backgroundColor: item.month === 'SUMMARY' ? "#00a3f6" : background, color: item.month === 'SUMMARY' ? "#ffffff" : fontColor, fontWeight: 700 }}
                            rowSpan={item.month === 'SUMMARY' ? 2 : 1} />);
                    if (item.month !== 'SUMMARY')
                        headerDay.push(
                            <Column key={item.header}
                                header={item.header}
                                style={{ height: 50, textAlign: "center", backgroundColor: background, color: fontColor, fontWeight: 700 }} />);

                }
            }
        });

        headerMonth.push(
            <Column key={this.columns[4].month}
                header={this.columns[4].month}
                style={{ height: 36, textAlign: "center", backgroundColor: "#2F75B5", color: 'white' }}
                colSpan={lstSummary.length} />);

        if (days > 0) {
            result = this.columns.filter(element => element.month === this.columns[lstSummary.length + 3].month);
            headerMonth.push(
                <Column key={this.columns[lstSummary.length + 3].month}
                    header={this.columns[lstSummary.length + 3].month}
                    style={{ height: 36, textAlign: "center", backgroundColor: "#606060", color: 'white' }}
                    colSpan={result.length} />);
        }

        return (
            <ColumnGroup>
                <div>{headerMonth}</div>
                <div>{headerDayName}</div>
                <div>{headerDay}</div>
            </ColumnGroup>
        )
    }
    hanldeGetColumn() {
        const accountId = user.accountId;
        let lstSummary = [];
        switch (accountId) {
            case 3:
                lstSummary = lstSumDefault;
                break;
            default:
                lstSummary = lstSumDefault;
                break;
        }
        let days = 0;
        this.columns = [];
        this.columns.push({ field: 'rowNum', header: 'No.', name: 'rowNum', width: '3%' });
        this.columns.push({ field: 'supName', header: `${this.props.language["supplier"] || "supplier"}`, name: 'supName', width: '7%' });
        this.columns.push({ field: 'fullName', header: `${this.props.language["employee"] || "employee"}`, name: 'fullName', width: '10%' });
        const fromdate = new Date(this.state.dates?.[0]);
        const todate = new Date(this.state.dates?.[1]);
        lstSummary.forEach(element => {
            this.columns.push(element);
        });
        for (let day = fromdate; day <= todate; day.setDate(day.getDate() + 1)) {
            this.columns.push({
                field: moment(day).format('YYYYMMDD').toString(),
                header: day.getDate().toString(),
                dayName: moment(day).format('ddd').toString(),
                month: moment(day).format('MMMM').toString(),
                width: '50px'
            });
            days++;

        }
        return days;
    }
    columnTemplate(rowData, cell) {
        let finalHeight = "80px"
        if (document.querySelector('div.timesheet_result')) {
            const queryDOM = `div.timesheet_result div.p-datatable-scrollable-view.p-datatable-@@@@@@@-view > div.p-datatable-scrollable-body > table > tbody > tr:nth-child(${cell.rowIndex + 1}) > td:nth-child(1)`
            setTimeout(() => {
                try {
                    const leftHeight = window.getComputedStyle(document.querySelector(queryDOM.replace("@@@@@@@", 'frozen')))?.getPropertyValue('height')
                    const rightHeight = window.getComputedStyle(document.querySelector(queryDOM.replace("@@@@@@@", 'unfrozen')))?.getPropertyValue('height')
                    if (leftHeight && rightHeight) {
                        finalHeight = Math.max(+leftHeight.replace("px", ""), +rightHeight.replace("px", "")) + "px"
                    }
                } catch (e) { }
            }, 10)
        }
        switch (cell.field) {
            case 'rowNum':
                return (
                    <div style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <label>{rowData.rowNum}</label>
                    </div>
                );
            case 'supName':
                return (
                    <div style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <label>{rowData.supName}</label>
                    </div>
                );
            case 'fullName':
                return (
                    <div style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                        <strong>{rowData.employeeCode}</strong>
                        <label>{rowData.fullName} ({rowData.position})</label>
                        {user.accountId === 1008 ?
                            <div >
                                <strong>{rowData.shopCode}</strong>
                                <label> {rowData.shopName} </label>
                            </div> : null}
                    </div>
                );
            default:
                const value = rowData[cell.field];
                const data = rowData;
                if (!isNaN(cell.field) && Number.isInteger(parseInt(cell.field, 0))) {
                    if (value !== null && value !== undefined) {
                        //  Date_ShiftFinal_Shift_Color_TotalTime
                        let key = value.split('_');
                        if (key.length > 4) {
                            const workDate = Number(key[0]);
                            const shiftFinal = key[1];
                            const shift = key[2];
                            const color = key[3];
                            const totalTime = key[4];

                            const lock = '0';
                            let colorLock = '#ffb74d';

                            if (lock === '100')
                                colorLock = 'deepskyblue';

                            switch (shiftFinal) {
                                case 'status':
                                    return (
                                        <div
                                            style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                            <strong>{shift}</strong>
                                        </div>
                                    )
                                case '':
                                    if (color.length > 0) {
                                        return (
                                            <div onClick={e => this.showCellDetail(data, workDate, null)}
                                                style={{ backgroundColor: color, color: 'red', height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                                <strong>{shift}</strong>
                                                <strong> {totalTime} </strong>
                                                {lock === '1' || lock === '100' ? <i className="pi pi-lock" style={{ color: colorLock, position: 'absolute', paddingLeft: 5, paddingTop: 18 }} /> : null}
                                            </div>
                                        );
                                    }
                                    else {
                                        return (
                                            <div onClick={e => this.showCellDetail(data, workDate, null)}
                                                style={{ color: 'red', height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                                <strong>{shift}</strong>
                                                <strong> {totalTime} </strong>
                                                {lock === '1' || lock === '100' ? <i className="pi pi-lock" style={{ color: colorLock, position: 'absolute', paddingLeft: 5, paddingTop: 18 }} /> : null}
                                            </div>
                                        );
                                    }
                                default:
                                    if (color.length > 0) {
                                        return (
                                            <div onClick={e => this.showCellDetail(data, workDate, null)}
                                                style={{ backgroundColor: color, color: 'white', height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                                <strong>{shiftFinal}</strong>
                                                {lock === '1' || lock === '100' ? <i className="pi pi-lock" style={{ color: colorLock, position: 'absolute', paddingLeft: 5, paddingTop: 18 }} /> : null}
                                            </div>
                                        );
                                    }
                                    else {
                                        return (
                                            <div onClick={e => this.showCellDetail(data, workDate, null)}
                                                style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                                <strong>{shiftFinal}</strong>
                                                {lock === '1' || lock === '100' ? <i className="pi pi-lock" style={{ color: colorLock, position: 'absolute', paddingLeft: 5, paddingTop: 18 }} /> : null}
                                            </div>
                                        );
                                    }
                            }
                        }
                    }
                    else
                        return (
                            <div
                                style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                            </div>
                        );
                }
                else {
                    // summary
                    return (
                        <div style={{ height: finalHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <strong>{value}</strong>
                        </div>
                    );
                }
        }
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
    employeeBodyTemplate(rowData) {
        return (
            <div>
                <strong>{rowData.employeeCode}</strong><br />
                <label>{rowData.fullName}</label>
            </div>
        );
    }
    showShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }} >
                <strong>{rowData.shopCode}</strong><br></br>
                <label>{rowData.shopName} </label>
            </div>
        )
    }
    renderTableResult() {
        if (this.state.loading) {
            return (
                <div key='divLoading'>
                    <Toast ref={(el) => this.toast = el} />
                    <ProgressSpinner style={{ height: '50px', width: '100%' }} />
                </div>
            );
        }
        let result = [];
        if (this.props.timesheetResult.length > 0) {
            result.push(
                <div style={{ marginTop: 5 }}>
                    <div className="p-col-12">
                        <Button style={{ backgroundColor: '#00B0F0', width: 50, height: 30 }} tooltip='Sup xác nhận công' /> {this.props.language["confirm"] || "l_confirm"}
                        <Button style={{ backgroundColor: '#FF9900', width: 50, height: 30 }} tooltip='Từ chối xác nhận' /> {this.props.language["reject"] || "l_reject"}
                        <Button style={{ backgroundColor: '#e53242', width: 50, height: 30, marginLeft: 10 }} tooltip='Có ca làm việc nhưng không đi làm' />{this.props.language["dont_go_to_work"] || "l_dont_go_to_work"}
                        <Button style={{ backgroundColor: '#ffff00', width: 50, height: 30, marginLeft: 10 }} tooltip='Nhân viên có check in nhưng không check out' />{this.props.language["not_check_out"] || "l_not_check_out"}
                        <Button style={{ backgroundColor: '#38c742', width: 50, height: 30, marginLeft: 10 }} tooltip='Lịch OFF nhưng đi làm (có check in)' />{this.props.language["day_off_but_go_to_work"] || "l_day_off_but_go_to_work"}
                    </div>
                </div>
            )

            const dynamicColumns = this.columns.map((col, i) => {
                if (i > 2) {
                    return <Column body={this.columnTemplate} style={{ width: col.width, height: 68, padding: 0, wordBreak: 'break-word', textAlign: 'center', overflow: 'hidden', }} key={col.field} field={col.field} />;
                }
            });
            const header = this.renderHeader();
            result.push(
                <div key='divTable' className="p-col-12 timesheet_result">
                    <DataTable value={this.props.timesheetResult}
                        paginator={true}
                        rows={10} rowHover
                        paginatorPosition={"both"}
                        frozenWidth="30vw"
                        headerColumnGroup={header}
                        rowsPerPageOptions={[10, 50, 100, 200]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        scrollable={true}
                        scrollHeight="550px"
                        className="p-datatable-gridlines"
                        style={{ fontSize: "13px", maxWidth: '100%' }}
                        dataKey="rowNum">
                        <Column frozen body={(rowData, event) => this.columnTemplate(rowData, { field: 'rowNum', rowIndex: event.rowIndex })} header="No." headerStyle={{ height: this.state.computedHeaderHeight, width: '2%', textAlign: 'center', }} style={{ padding: 0, wordBreak: 'break-word', textAlign: 'center' }} />
                        <Column frozen body={(rowData, event) => this.columnTemplate(rowData, { field: 'supName', rowIndex: event.rowIndex })} header={this.props.language["sup"] || "l_sup"} headerStyle={{ height: this.state.computedHeaderHeight, width: '7%', textAlign: 'center', }} style={{ padding: 0, wordBreak: 'break-word', textAlign: 'center' }} />
                        <Column frozen body={(rowData, event) => this.columnTemplate(rowData, { field: 'fullName', rowIndex: event.rowIndex })} header={this.props.language["employee"] || "l_employee"} headerStyle={{ height: this.state.computedHeaderHeight, width: '7%', textAlign: 'center' }} style={{ padding: 0, wordBreak: 'break-word', textAlign: 'center' }} />
                        {dynamicColumns}
                    </DataTable>
                </div>
            );
        }
        return result;
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    render() {
        return (
            this.state.permission.view ? (
                <div>
                    <Toast ref={(el) => this.toast = el} />
                    <Toast ref={(el) => this.toastBC = el} position="top-center" />
                    <Toast ref={(el) => this.toastLD = el} position="top-center" />
                    <Accordion activeIndex={0} style={{ marginTop: '10px' }}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div >
                                <div className="p-grid" >
                                    <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                        <Calendar fluid
                                            value={this.state.dates}
                                            onChange={(e) => this.setState({ dates: e.value })}
                                            dateFormat="yy-mm-dd"
                                            inputClassName='p-inputtext'
                                            id="fromDate"
                                            selectionMode="range"
                                            inputStyle={{ width: '91.5%', visible: false }}
                                            style={{ width: '100%' }}
                                            showIcon />
                                    </div>
                                    <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["sup"] || "sup"}</label>
                                        <EmployeeDropDownList
                                            type="SUP-Leader"
                                            typeId={0}
                                            id="supId"
                                            parentId={0}
                                            mode="single"
                                            onChange={this.handleChange}
                                            value={this.state.supId === null ? 0 : this.state.supId} />
                                    </div>
                                    <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["position"] || "position"}</label>
                                        <EmployeeTypeDropDownList
                                            id="position"
                                            type="PG-SR"
                                            onChange={this.handleChange}
                                            value={this.state.position} />
                                    </div>
                                    <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["employee"] || "employee"}</label>
                                        <EmployeeDropDownList
                                            type="PG-SR"
                                            typeId={this.state.position === null ? 0 : this.state.position}
                                            id="employeeId"
                                            parentId={this.state.supId === null ? 0 : this.state.supId}
                                            onChange={this.handleChange}
                                            value={this.state.employeeId === null ? 0 : this.state.employeeId} 
                                            mode="multi"
                                            />
                                    </div>
                                    {/* <div className="p-col-12 p-md-3 p-sm-6">
                                        <label>{this.props.language["status"] || "l_status"}</label>
                                        <Dropdown fluid
                                            id="status"
                                            style={{ width: '100%' }}
                                            placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                            optionLabel="name"
                                            key={lstStatus.value}
                                            showClear={true}
                                            options={lstStatus}
                                            onChange={this.handleChangeForm}
                                            value={this.state.status} />
                                    </div> */}
                                </div>
                                <Toolbar left={
                                    <div >
                                        {this.state.permission !== undefined && (this.state.permission.view === true && <Button
                                            key="search"
                                            label={this.props.language["search"] || "search"}
                                            icon="pi pi-search"
                                            style={{ marginRight: '.25em' }}
                                            onClick={this.LoadList} />)}

                                        {this.state.permission !== undefined && (this.state.permission.view === true && this.state.permission.export === true && <Button
                                            label="Export excel"
                                            icon="pi pi-file-excel"
                                            style={{ marginRight: '.25em' }}
                                            className="p-button-success"
                                            onClick={this.hanldeExportData} />)}
                                        {/* {this.state.permission !== undefined && (this.state.permission.view === true && this.state.permission.delete === true && <Button
                                            key="lock"
                                            label={this.props.language["lock_all"] || "l_lock_all"}
                                            style={{ marginRight: '.25em' }}
                                            icon="pi pi-lock"
                                            iconPos="right"
                                            className="p-button-danger"
                                            onClick={(e) => this.showConfirm('LockAll')} />)} */}
                                    </div>
                                }
                                />
                                {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                            </div>
                        </AccordionTab>
                    </Accordion>
                    {this.state.showComponent ?
                        <TimesheetCell
                            parentMethod={this.onHideCellDetail}
                            data={this.state.dataCell}
                            ot={this.state.otCell}
                            workDate={this.state.workDateCell}
                            permission={this.state.permission}
                        />
                        : null}
                    {this.renderTableResult()}
                </div>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        );
    }
}
function mapStateToProps(state) {
    return {
        timesheetResult: state.timesheets.timesheetResult,
        timesheetFinal: state.timesheets.timesheetFinal,
        language: state.languageList.language,
        exportTimeSheet: state.timesheets.exportTimeSheet,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        TimesheetController: bindActionCreators(actionCreatorsTimesheet, dispatch),
        AttendantController: bindActionCreators(AttendantCreateAction, dispatch),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimesheetResult);
