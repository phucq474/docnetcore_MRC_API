import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
// import { SelectButton } from 'primereact/selectbutton';
// import ShiftDropDownList from '../Controls/ShiftDropDownList';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { ProgressSpinner } from 'primereact/progressspinner';
import { bindActionCreators } from "redux";
import { actionCreatorsTimesheet } from '../../store/TimesheetController';
// import { ShiftListsActionCreate } from '../../store/ShiftListsController';
import PhotoGalary from '../Controls/PhotoGalary';
import { getToken, URL, download } from "../../Utils/Helpler";
import { FileUpload } from 'primereact/fileupload';
import { PhotoCreateAction } from '../../store/PhotoController';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { confirmPopup } from 'primereact/confirmpopup';
import { ProgressBar } from 'primereact/progressbar';
import TimeField from 'react-simple-timefield';

import moment from 'moment';
const lstOT = [
    { value: 'OT1', name: 'OT1: Tăng ca ngày thường' },
    { value: 'OT2', name: 'OT2: Tăng ca ngày nghỉ' },
    { value: 'OT3', name: 'OT3: Tăng ca ngày lễ' }
]

const user = JSON.parse(localStorage.getItem("USER"));

class TimesheetCellFonterra extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            note: null,
            shift: null,
            confirmed: null,
            loading: true,
            photos: [],
            showBNTUnlock: true,
            shiftLists: [],
            details: [],
            ot_shift: null,
            ot_day: null,
            ot_night: null,
            ot_note: null
        }
        this._child = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.hanldeBindData = this.hanldeBindData.bind(this);
        this.hanldeBindPhoto = this.hanldeBindPhoto.bind(this);
        this.hanldeSave = this.hanldeSave.bind(this);
        this.handleSendNotify = this.handleSendNotify.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    handleChange(id, value) {
        this.setState({ [id]: value });
    }
    handleChangeForm(e) {
        if (e.target.id === "shift") {
            let confirmed = null;
            if (e.target.value) {
                if (e.target.value === "0") {
                    confirmed = 0;
                }
                else {
                    confirmed = 1;
                }
            }
            this.setState({
                [e.target.id]: e.target.value,
                confirmed: confirmed
            })
        }
        else {
            this.setState({ [e.target.id]: e.target.value });

        }
    }


    hanldeSave() {
        // console.console.log(this._child);
        if (this.state.shift === null && this.state.ot_shift === null) {
            this.showError("Vui lòng chọn ca làm việc");
            return;
        }
        else {
            if (this.state.shift) {
                if (this.state.note === null || this.state.note === undefined) {
                    this.showError("Bạn chưa nhập ghi chú");
                    return;
                }
                else if (this.state.note.trim().length < 2) {
                    this.showError("Ghi chú phải nhiều hơn 2 ký tự");
                    return;
                }
            }

            if (this.state.ot_shift) {
                if ((this.state.ot_day === null || this.state.ot_day === "00:00")
                    && (this.state.ot_night == null || this.state.ot_night === "00:00")
                ) {
                    this.showError("Vui lòng chọn thời gian tăng ca");
                    return;
                }
            }
        }

        // if ((this.state.ot_day && this.state.ot_day !== "00:00")
        //     || (this.state.ot_night && this.state.ot_night !== "00:00")
        // ) {
        //     if (this.state.ot_shift === null) {
        //         this.showError("Vui lòng chọn Danh mục tăng ca");
        //         return;
        //     }
        // }

        this.Confirm();
        this.setState({ loadingSave: true });
    }

    handleSendNotify() {
        // this.showSuccess("Test");
        let data = {
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate
        }
        this.props.TimesheetController.SendNotify(data, this.props.accId)
            .then(() => {
                if (this.props.result.result === 1) {
                    this.props.parentMethod();
                    //this.showSuccess("Gửi thông  báo thành công");
                }
                else {
                    this.showError(this.props.result.messenger);
                }
            });
    }
    async hanldeBindData() {
        this.setState({
            data: this.props.data,
            workDate: this.props.workDate
        });
        if (this.props.data.employeeId > 0 && this.props.workDate > 0) {
            let data = {
                employeeId: this.props.data.employeeId,
                shopId: 0,
                workDate: this.props.workDate
            }
            await this.props.TimesheetController.GetDetail(data, this.props.accId)
                .then(() => {
                    const details = this.props.details[0];
                    this.setState({
                        loading: false,
                        shift: details.shiftCode,
                        totalTime: details.totalTime,
                        confirmed: details.confirmed,
                        note: details.note,
                        dataInput: data,
                        details: details,
                        ot_shift: details.ot_shift,
                        ot_day: details.ot_day,
                        ot_night: details.ot_night,
                        ot_note: details.ot_note
                    })
                });
            this.hanldeBindPhoto();
        }
    }

    async hanldeBindPhoto() {
        if (this.props.data.employeeId > 0 && this.props.workDate > 0) {
            let data = {
                employeeId: this.props.data.employeeId,
                shopId: 0,
                workDate: this.props.workDate
            }
            await this.props.PhotoController.GetPhotoByShop(data, this.props.accId)
            const list = await this.props.list;
            let photos = await list.filter(item => item.photoType === "ISSUE_FILE");
            await this.setState({ photos: photos })
        }

    }
    uploadFileImage = (e) => {
        if (e.files === null && e.files.length === 0) {
            this.showError(`${this.props.language["please_select_image_to_upload"] || "l_please_select_image_to_upload"}`);
            return;
        }
        this.setState({ photos: [] });
        const data = {
            shopId: 0,
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate,
            files: e.files,
            photoType: "ISSUE_FILE"
        }
        this.props.TimesheetController.TimeSheetDeleteImage(data)
        this.props.TimesheetController.UploadFiles(data).then(() => {
            if (this.props.result.result === 1) {
                this.hanldeBindPhoto();
                this.showSuccess(`${this.props.language["upload_successful"] || "l_upload_successful"}`);
                this._child.current.clear();
            }
            else {
                this.showError(this.props.messenger);
            }
        });
    }
    async componentDidMount() {
        this.hanldeBindData();
        this.handleGetShiftList(this.props.accId);
    }

    handleGetShiftList = (accId) => {
        this.setState({ shiftLists: [] })
        this.props.TimesheetController.GetShiftList(this.props.data.employeeId, accId).then(() => {
            const rs = this.props.getShiftList;
            if (rs.status === 200) {
                this.setState({ shiftLists: rs.data })
            }
        })
    }

    Confirm = async () => {
        let data = {
            EmployeeId: this.props.data.employeeId,
            WorkDate: this.props.workDate,
            Shift: this.state.shift,
            Confirmed: this.state.confirmed,
            Note: this.state.note,
            Evidence: this.state.evidence,
            Type: 'Sup',
            files: this._child.current.files,
            OT_Shift: this.state.ot_shift,
            OT_Note: this.state.ot_note,
            OT_Day: this.state.ot_day,
            OT_Night: this.state.ot_night
        }

        const formData = new FormData();
        if (data.files !== undefined)
            data.files.forEach(element => {
                formData.append('files', element);
            });

        const item = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'JsonData': item.toString(),
                accId: this.props.accId || ""
            },
            body: formData
        };
        const url = URL + 'timesheet/update';

        try {
            const request = new Request(url, requestOptions);
            const response = await fetch(request);
            const result = await response.json();
            if (response.status === 200)
                if (result.result === 1) {
                    this.showSuccess(`${this.props.language["save_successful"] || "l_save_successful"}`);
                    this._child.current.clear();
                    ///-----get new data
                    await this.handleGetDataUpdate();
                    this.setState({ loadingSave: false });
                }
                else {
                    this.showError(result.messenger)
                }
        }
        catch (error) {
            this.showError("Error")
        }
    }

    handleGetDataUpdate = async () => {
        let dataFilter = await this.props.getFilter();
        dataFilter.employeeId = await this.props.data.employeeId;
        await this.props.TimesheetController.GetList(dataFilter, this.props.accId).then(() => {
            if (this.props.timesheetResult.length > 0) {
                let timesheetResult = this.props.timesheetResult;
                let dataUpdated = timesheetResult.filter(p => p.employeeId === this.props.data.employeeId);
                this.setState({ dataUpdated: dataUpdated });
                this.props.parentMethod(dataUpdated);
            }
        });
    }

    dateTemplate = (rowData) => {
        let timeShift = [];
        if (rowData.Shift !== null) {
            timeShift.push(<br></br>);
            timeShift.push(<label>{rowData.ShiftName}</label>);
        }
        return (
            <div>
                <label>{rowData.Date}</label>
                <br></br>
                {timeShift}
            </div>
        );
    }
    showTotalTime = (rowData) => {
        return (
            <div>
                {rowData.TimeInStore !== null && rowData.TimeInStore !== undefined
                    ? rowData.TimeInStore
                    : ""}
            </div>
        );
    };
    showTotal = (rowData) => {
        return (
            <div>
                <strong style={{ fontSize: 15 }}>
                    {rowData.Total !== null && rowData.Total !== undefined
                        ? rowData.Total
                        : ""}
                </strong>
                <br />
                <strong style={{ fontSize: 15 }}>
                    {rowData.TotalInStore !== null && rowData.TotalInStore !== undefined
                        ? rowData.TotalInStore
                        : ""}
                </strong>
            </div>
        );
    };
    showTimeLate = (rowData) => {
        if (rowData.TimeLate)
            return (
                <div>
                    <strong>{rowData.TimeLate} phút</strong>
                    <br></br>
                    <label>{rowData.NoteLate}</label>
                </div>
            );
        else return null;
    };
    showTimeEarlier = (rowData) => {
        if (rowData.TimeEarlier)
            return (
                <div>
                    <strong>{rowData.TimeEarlier} phút</strong>
                    <br></br>
                    <label>{rowData.NoteEarlier}</label>
                </div>
            );
        else return null;
    };
    shopNameTemplate = (rowData) => {
        return (
            <div style={{ textAlign: "center" }}>
                <strong>{rowData.ShopCode}</strong> <br></br>
                <strong>{rowData.ShopName} </strong> <br></br>
                <label>{rowData.Address} </label> <br></br>
            </div>
        );
    }
    imageTemplate = (rowData) => {
        let checkIn = null,
            checkOut = null;
        if (rowData.CheckIn !== null && rowData.CheckIn !== undefined) {
            checkIn = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut !== null &&
            rowData.CheckIn === null &&
            rowData.CheckOut !== undefined
        ) {
            checkIn = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut !== null && rowData.CheckOut !== undefined) {
            checkOut = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn}
                {checkOut}
            </div>
        );
    }

    imageTemplate2 = (rowData) => {
        let checkIn2 = null,
            checkOut2 = null;
        if (rowData.CheckIn2 !== null && rowData.CheckIn2 !== undefined) {
            checkIn2 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn2}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn2}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut2 !== null &&
            rowData.CheckIn2 === null &&
            rowData.CheckOut2 !== undefined
        ) {
            checkIn2 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn2}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut2 !== null && rowData.CheckOut2 !== undefined) {
            checkOut2 = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut2}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut2}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn2}
                {checkOut2}
            </div>
        );
    }

    imageTemplate3 = (rowData) => {
        let checkIn3 = null,
            checkOut3 = null;
        if (rowData.CheckIn3 !== null && rowData.CheckIn3 !== undefined) {
            checkIn3 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn3}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn3}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut3 !== null &&
            rowData.CheckIn3 === null &&
            rowData.CheckOut3 !== undefined
        ) {
            checkIn3 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn3}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut3 !== null && rowData.CheckOut3 !== undefined) {
            checkOut3 = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut3}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut3}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn3}
                {checkOut3}
            </div>
        );
    }

    renderActual = () => {
        let data = this.state.details;
        if (data !== null && data.actual !== null) {
            const items = JSON.parse(data.actual);
            return (
                <DataTable
                    value={items}
                    scrollable
                    scrollHeight="380px"
                    rowHover
                    rowGroupMode="rowspan"
                    groupField="Total"
                    sortField="Total"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    dataKey="rowNum"
                >
                    <Column field="RowNum" style={{ width: "50px" }} header="STT" />
                    <Column
                        field="ShopName"
                        body={this.shopNameTemplate}
                        header={this.props.language["storelist_shopname"] || "storelist_shopname"}
                        style={{ textAlign: "center" }}
                    />
                    <Column
                        body={this.dateTemplate}
                        header={this.props.language["shift"] || "shift"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate}
                        header={this.props.language["check_in_out"] || "l_check_in_out"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate2}
                        header={this.props.language["check_in_out2"] || "l_check_in_out2"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate3}
                        header={this.props.language["check_in_out3"] || "l_check_in_out3"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        field="TimeInStore"
                        body={this.showTotalTime}
                        header={this.props.language["time_in_store"] || "time_in_store"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        field="Total"
                        body={this.showTotal}
                        header={this.props.language["total_day"] || "total_day"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                </DataTable>
            );
        } else return <strong>Không có dữ liệu</strong>;
    }

    imageTemplateLog = () => {
        let imageList = []
        if (this.props.details.length > 0) {
            let data = JSON.parse(this.state.details.logDetail ? this.state.details.logDetail : null)
            if (data !== null) {
                data.forEach(e => {
                    imageList.push(<div >
                        <a href={e.PhotoPath ? e.PhotoPath : null} target="_blank">{e.PhotoType ? e.PhotoType : null}</a>
                    </div>)
                })
            }
        }
        return (
            <div>
                {imageList}
            </div>

        );
    }

    renderDetail() {
        const data = this.state.details;
        let actual = this.renderActual();
        let disabled = true;
        if (this.props.permission.edit) disabled = false;
        return (
            <Accordion multiple activeIndex={[0, 1, 2]} style={{ width: "100%" }}>
                <AccordionTab header="Chấm công">
                    {actual}
                </AccordionTab>
                <AccordionTab header="Xác nhận công">
                    <div className="p-grid">
                        <div className="p-field p-col-4">
                            <label htmlFor="shift">Ca làm việc</label>
                            <Dropdown fluid
                                style={{ width: '100%' }}
                                value={this.state.shift}
                                options={this.state.shiftLists}
                                onChange={this.handleChangeForm}
                                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                optionLabel="name"
                                id="shift"
                                showClear={true}
                                disabled={disabled}
                            />
                        </div>
                        <div className="p-field p-col-8">
                            <label htmlFor="note">Ghi chú</label>
                            <InputTextarea
                                id="note"
                                style={{ width: '100%' }}
                                value={this.state.note === null ? '' : this.state.note}
                                onChange={this.handleChangeForm}
                                disabled={disabled}
                                rows={1}
                                placeholder='Nhập ghi chú'
                            />
                        </div>
                        {data.lock === 1 ? null : <div className="p-col-12 ">
                            <FileUpload name="demo[]"
                                ref={this._child}
                                chooseLabel={this.props.language["import"] || "l_import"}
                                customUpload={true}
                                //uploadHandler={this.uploadFileImage}
                                //multiple
                                accept="image/*,.pdf"
                                maxFileSize={10000000} />
                        </div>}
                        <div className="p-col-12 ">
                            {this.renderEvidence()}
                        </div>
                    </div>
                </AccordionTab>
                {this.props.accId !== 1 && <AccordionTab header="Xác nhận tăng ca">
                    <div className="p-grid">
                        <div className="p-field p-col-2">
                            <label htmlFor="shift">Danh mục tăng ca</label>
                            <Dropdown
                                style={{ width: '100%' }}
                                value={this.state.ot_shift}
                                options={lstOT}
                                onChange={this.handleChangeForm}
                                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                optionLabel="name"
                                id="ot_shift"
                                showClear={true}
                            />
                        </div>
                        <div className="p-field p-col-1">
                            <label htmlFor="timeOT">Thời gian tăng ca ban ngày</label>
                            <div style={{ textAlign: 'center', }}>
                                <TimeField style={{ textAlign: 'center', width: "100%", height: '33px', color: 'red', fontWeight: "bold", fontSize: "20pt" }}
                                    value={this.state.ot_day || "00:00"}
                                    onChange={(e) => this.setState({ ot_day: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-field p-col-1">
                            <label htmlFor="timeOT">Thời gian tăng ca ban đêm</label>
                            <div style={{ textAlign: 'center', }}>
                                <TimeField style={{ textAlign: 'center', width: "100%", height: '33px', color: 'red', fontWeight: "bold", fontSize: "20pt" }}
                                    value={this.state.ot_night || "00:00"}
                                    onChange={(e) => this.setState({ ot_night: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-field p-col-8">
                            <label htmlFor="note">Ghi chú</label>
                            <InputTextarea
                                id="ot_note"
                                style={{ width: '100%' }}
                                value={this.state.ot_note === null ? '' : this.state.ot_note}
                                onChange={this.handleChangeForm}
                                rows={1}
                                placeholder='Nhập ghi chú'
                            />
                        </div>

                    </div>
                </AccordionTab>}
            </Accordion>
        );
    }
    renderEvidence = () => {
        let data = this.state.details;
        let result = null;
        if (data && data.evidence !== null) {
            const evidence = JSON.parse(data.evidence);
            // this.setState({
            //     evidence: evidence[0].Url
            // })
            if (evidence[0].FileType === '.pdf') {
                result = <div className="p-col-12">
                    <label>{evidence[0].FileName}</label>
                    <Button icon="pi pi-download"
                        style={{ float: 'right' }}
                        className="p-button-rounded p-button-primary p-mr-2"
                        onClick={() => download(evidence[0].Url)} />
                </div>
            }
            else {
                result = <div className="p-col-12">
                    <img src={evidence[0].Url} alt="Evidence" height='220' />
                </div>
            }
            return (
                <div className="p-grid" style={{ textAlign: 'center', paddingTop: 10 }}>
                    <div className="p-col-12">
                        <strong>File xác nhận công</strong>
                    </div>
                    {result}
                </div>);
        }
        else
            return null;
    }
    renderPhoto() {
        const data = {
            shopId: 0,
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate,
        }
        if (this.state.photos.length > 0)
            return <PhotoGalary
                dataInput={data}
                photoType='ISSUE_FILE'
                listPhoto={this.state.photos}
                handleDeleteImageIssue={this.handleDeleteImageIssue}
            />
    }
    handleDeleteImageIssue = async (item) => {
        if (item !== null && item !== undefined) {
            if (item.photoType === "ISSUE_FILE") {
                await this.setState({ loading: true })
                await this.props.PhotoController.DeletePhoto(item.photoID)
                await this.setState({ loading: false })
            }
        }

    }
    handleUnLock = async () => {
        let data = {
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate
        }
        await this.props.TimesheetController.UnLock(data, this.props.accId);
        const result = await this.props.unLock;
        if (result.status === 200) {
            await this.showSuccess(result.message);
            await this.hanldeBindData();
        }
        else {
            this.showError(result.message);
        }
    }

    accept = () => {
        this.handleUnLock();
    }

    reject = () => {
        this.toast.show({ severity: 'warn', summary: 'Cancel', detail: 'You have cancel', life: 1000 });
    }

    popupUnlock = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Bạn có muốn mở khóa thêm 1 ngày?',
            icon: 'pi pi-key',
            accept: this.accept,
            reject: this.reject
        });
    }


    templateLock = (rowData) => {
        if (rowData.StatusId === 5) {
            return (
                <Button onClick={this.popupUnlock} icon="pi pi-lock-open" className="p-button-danger p-button-outlined"></Button>
            )
        }
        else {
            return (<></>)
        }
    }

    renderFooter = () => {
        const result = this.state.details;
        let footer = [];
        if (result && (result.lock === 1 && user.isAdmin === true && this.state.showBNTUnlock === true)) {
            footer.push(
                <Button className='p-button-warning' label={this.props.language["unlock_timesheet"] || "l_unlock_timesheet"} icon="pi pi-unlock" onClick={this.handleUnLock} />
            )
        }

        if (result && (result.lock === 1 || this.props.permission.edit !== true)) {
            footer.push(<Button
                className='p-button-danger'
                label="Close"
                icon="pi pi-times"
                onClick={this.props.parentMethod} />
            )
        }
        else {
            footer.push(
                <div>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}

                    <Button
                        className='p-button-danger'
                        label={"Close"}
                        icon="pi pi-times"
                        onClick={this.props.parentMethod} />
                    <Button className='p-button-success' label="Save" icon="pi pi-check" onClick={this.hanldeSave} />
                </div>
            )
        }
        return footer;
    }

    render() {
        if (this.state.loading) {
            return (
                <Dialog header='Loading...'
                    visible
                    style={{ width: '80vw' }}
                    modal={true}
                    onHide={this.props.parentMethod}>
                    <ProgressSpinner style={{ height: '50px', width: '100%' }} />
                </Dialog>
            );
        }

        const result = this.state.details;
        let details = this.renderDetail();
        // let footer = [];
        let footer = this.renderFooter();
        if (result) {
            return (
                <div>
                    <Toast ref={(el) => this.toast = el} />

                    <Dialog header={moment(this.props.workDate?.toString()).format('YYYY-MM-DD') + ' | ' + this.props.data.employeeCode + ' - ' + this.props.data.fullName + ' (' + this.props.data.position + ')'}
                        footer={footer}
                        visible
                        maximized modal={true}
                        onHide={this.props.parentMethod}>
                        {details}
                    </Dialog>
                </div >
            );
        }
        else {
            return (
                <div>
                    <Dialog header="Timesheet detail"
                        maximized modal={true}
                        onHide={this.props.parentMethod}>
                        <div className="p-grid" style={{ minHeight: '400px' }}>
                            <div className="p-col-12 p-md-6 p-sm-6">
                                {this.props.language["no_date"] || "l_no_date"}
                            </div>
                        </div>
                    </Dialog>
                </div>
            );
        }
    }
}
function mapStateToProps(state) {
    return {
        list: state.photos.photo,
        deletePhoto: state.photos.deletePhoto,
        details: state.timesheets.details,
        result: state.timesheets.result,
        unLock: state.timesheets.unLock,
        language: state.languageList.language,
        getShiftList: state.timesheets.getShiftList,
        timesheetResult: state.timesheets.timesheetResult,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        TimesheetController: bindActionCreators(actionCreatorsTimesheet, dispatch),
        PhotoController: bindActionCreators(PhotoCreateAction, dispatch),
        // ShiftListsController: bindActionCreators(ShiftListsActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimesheetCellFonterra);