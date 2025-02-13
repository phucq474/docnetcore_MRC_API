import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { getToken, URL } from "../../Utils/Helpler";
import { actionCreatorsTimesheet } from '../../store/TimesheetController';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
// import LightGalary from '../Controls/light-gallery';
import { ProgressSpinner } from 'primereact/progressspinner';
import moment from 'moment';
import PhotoGalary from '../Controls/PhotoGalary';

const lstConfirm = [
    { value: 1, name: 'Confirm' },
    { value: 0, name: 'Reject' },
]
const lstReject = [
    { value: 1, name: 'Reject' },
]
const user = JSON.parse(localStorage.getItem("USER"));

class TimesheetFinalDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: null,
            selected: 0,
            selectedDetail: [],
            showComponent: false,
            dataDetail: [],
            loading: true
        }
        this.clear = this.clear.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.BindData = this.BindData.bind(this);
        this.headerTemplate = this.headerTemplate.bind(this);
        this.footerTemplate = this.footerTemplate.bind(this);
        this.evidenceTemplate = this.evidenceTemplate.bind(this);
        this.detailTemplate = this.detailTemplate.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.Confirm = this.Confirm.bind(this);
    }
    BindData() {
        const para = this.props.dataInput;
        this.props.TimesheetController.GetList_Final_Detail(para)
            .then(() => {
                this.setState({
                    loading: false,
                    dataDetail: this.props.finalDetail
                })
                const data = this.props.finalDetail.filter(item => (item.status === 'NotOut' || item.status === 'NotEnoughTime'));
                if (data.length > 0) {
                    data.forEach(element => {
                        this.setState({
                            ["reject" + element.workDate]: element.reject,
                            ["rejectNote" + element.workDate]: element.rejectNote,
                        });
                    });
                }
            });
    }
    clear() {
        this.toastBC.clear();
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value });
    }
    showConfirm(rowData) {
        this.toastBC.show({
            severity: 'warn', sticky: true, content: (
                <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                    <div className="p-text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <p>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</p>
                    </div>
                    <div className="p-grid p-fluid">
                        <div className="p-col-6">
                            <Button type="button" label={this.props.language["yes"] || "l_yes"} className="p-button-success" onClick={(e) => this.Confirm(rowData)} />
                        </div>
                        <div className="p-col-6">
                            <Button type="button" label={this.props.language["no"] || "l_no"} className="p-button-secondary" onClick={this.clear} />
                        </div>
                    </div>
                </div>
            )
        });
    }
    async Confirm(rowData) {
        let data = {
            employeeId: rowData.employeeId,
            workDate: rowData.workDate,
            reject: this.state["reject" + rowData.workDate],
            rejectNote: this.state["rejectNote" + rowData.workDate],
            type: "Final"
        }
        const url = URL + 'timesheet/update';
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
                    this.showSuccess(`${this.props.language["save_successful"] || "l_save_successful"}`);
                }
                else {
                    this.showError(result.messenger)
                }
            this.clear();
        }
        catch (error) {
            this.showError("Error")
            this.clear();
        }
    }
    componentDidMount() {
        this.BindData();
    }
    headerTemplate(data) {
        let color = "#ffff00", header = `${this.props.language["not_check_out"] || "l_not_check_out"}`;
        if (data.status === 'NotEnoughTime') { color = '#e53242'; header = `${this.props.language["not_enough_time"] || "l_not_enough_time"}` }
        return (
            <div>
                <Button
                    icon="pi pi-calendar"
                    label={data.date.substring(0, 10)}
                    style={{ color: color }}
                    className="p-button-outlined" />
                <Button
                    label={header}
                    style={{ color: color }}
                    className="p-button-text" />
            </div>
        );
    }
    footerTemplate(data) {
        return null
    }
    checkInTemplate(rowData) {
        return (
            <div>
                <label style={{ display: "block" }}> {moment(rowData.checkIn).format('HH:mm:ss')}</label>
                <img src={rowData.photoIn} alt={rowData.photoIn} style={{ maxHeight: '100px', maxWidth: '100%' }} />
            </div>
        );
    }
    checkOutTemplate(rowData) {
        if (rowData.checkOut === null)
            return (<div></div>);
        else
            return (<div>
                <label style={{ display: "block" }}> {moment(rowData.checkOut).format('HH:mm:ss')}</label>
                <img src={rowData.photoOut} alt={rowData.photoOut} style={{ maxHeight: '100px', maxWidth: '100%' }} />

            </div>);
    }
    detailTemplate(rowData) {
        let detail = [], lock = true;
        if (user.id === 10323 || user.positionId === 119) lock = false; else lock = true;
        detail.push(rowData);
        return (
            <div id={detail.workDate}>
                <div className='p-grid'>
                    <div className="p-col-12">
                        <DataTable
                            value={detail}
                            style={{ fontSize: "13px" }}
                            dataKey="employeeId">
                            <Column body={this.checkInTemplate} header={this.props.language["check_in"] || "l_check_in"} style={{ width: "100px", textAlign: "center" }} />
                            <Column body={this.checkOutTemplate} header={this.props.language["check_out"] || "l_check_out"} style={{ width: "100px", textAlign: "center" }} />
                            <Column field="shift" header={this.props.language["shift"] || "l_shift"} style={{ width: "80px", textAlign: "center" }} />
                            <Column field="totalTime" header={this.props.language["total_time"] || "l_total_time"} style={{ width: "80px", textAlign: "center" }} />
                        </DataTable>
                    </div>
                    <div className="p-col-12 p-md-4">
                        <label>{this.props.language["supplier_confirm"] || "l_supplier_confirm"}</label>
                        <SelectButton
                            id={"confirmed" + rowData.workDate}
                            optionLabel="name"
                            optionValue="value"
                            disabled={true}
                            value={rowData.confirmed}
                            options={lstConfirm} />
                    </div>
                    <div className="p-col-12 p-md-8">
                        <label>{this.props.language["supplier_note"] || "l_supplier_note"}</label>
                        <InputText
                            id={"note" + rowData.workDate}
                            disabled={true}
                            value={rowData.note === null ? '' : rowData.note} />
                    </div>
                    <div className="p-col-12 p-md-4">
                        <label>{this.props.language["reject"] || "l_reject"}</label>
                        <SelectButton
                            id={"reject" + rowData.workDate}
                            optionLabel="name"
                            optionValue="value"
                            disabled={lock}
                            value={this.state["reject" + rowData.workDate]}
                            onChange={this.handleChangeForm}
                            options={lstReject} />
                    </div>
                    <div className="p-col-12 p-md-8">
                        <label>{this.props.language["reason_of_reject"] || "l_reason_of_reject"}</label>
                        <InputText
                            id={"rejectNote" + rowData.workDate}
                            onChange={this.handleChangeForm}
                            disabled={lock}
                            value={this.state["rejectNote" + rowData.workDate] === null ? '' : this.state["rejectNote" + rowData.workDate]} />
                    </div>
                    <div className="p-col-12">
                        {(rowData.lock === 100 || lock) ? null : <Button className='p-button-success' style={{ float: "right" }} label={this.props.language["save"] || "l_save"} icon="pi pi-check" onClick={(e) => this.showConfirm(rowData)} />}
                    </div>
                </div>

            </div>

        );
    }
    evidenceTemplate(rowData) {
        let data = {
            employeeId: rowData.employeeId,
            shopId: 0,
            workDate: rowData.workDate
        }
        return (
            <div>
                <PhotoGalary dataInput={data} photoType='ISSUE_FILE' />
                {/* <LightGalary dataInput={data} photoType='ISSUE_FILE' /> */}
            </div>
        );
    }
    render() {
        if (this.state.loading) {
            return (
                <ProgressSpinner style={{ height: '50px', width: '100%' }} />
            );
        }
        const data = this.state.dataDetail.filter(item => (item.status === 'NotOut' || item.status === 'NotEnoughTime'));
        if (data.length > 0)
            return (<div id='divResult'>
                <Toast ref={(el) => this.toast = el} />
                <Toast ref={(el) => this.toastBC = el} position="top-center" />
                <DataTable ref={(el) => this.dt = el}
                    value={data}
                    dataKey="_Id"
                    key={data.rowNum}
                    style={{ fontSize: "13px", paddingTop: "10px" }}
                    scrollable
                    scrollHeight="700px"
                    rowGroupMode="subheader"
                    groupField="date"
                    rowGroupHeaderTemplate={this.headerTemplate}
                    rowGroupFooterTemplate={this.footerTemplate}>
                    <Column body={this.detailTemplate} header={this.props.language["detail"] || "l_detail"} style={{ width: "60%" }} />
                    <Column body={this.evidenceTemplate} header={this.props.language["evidence"] || "l_evidence"} style={{ width: "40%" }} />
                </DataTable>
            </div>
            );
        else
            return (<div>{this.props.language["data_null"] || "l_data_null"}</div>)
    }
}
function mapStateToProps(state) {
    return {
        finalDetail: state.timesheets.finalDetail,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        TimesheetController: bindActionCreators(actionCreatorsTimesheet, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimesheetFinalDetail);
