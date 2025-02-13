import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { bindActionCreators } from 'redux';
import { CreateActionSpiralForm } from '../../store/SpiralFormController';
import { Chips } from 'primereact/chips';
import { InputTextarea } from 'primereact/inputtextarea';


class SendEmail extends Component {
    constructor() {
        super();
        this.state = {
            mailTo: [],
            mailCc: [],
            bodyMail: "",
            subject: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }

    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    componentDidMount() {

    }
    handleSendEmail = () => {
        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.subject === null || this.state.subject === "") {
            return this.showError("Chưa nhập Subject");
        }
        if (this.state.bodyMail === null || this.state.bodyMail === "") {
            return this.showError("Chưa nhập body email");
        }
        if (this.state.mailTo.length === 0) {
            return this.showError("Chưa nhập email To");
        }
        else {
            this.state.mailTo.forEach(element => {
                const result = element.match(mailFormat);
                if (!result)
                    return this.showError('Email To: "' + element + '" không hợp lệ.');
            });
        }
        if (this.state.mailCc.length === 0) {
            return this.showError("Chưa nhập email Cc");
        }
        else {
            this.state.mailCc.forEach(element => {
                const result = element.match(mailFormat);
                if (!result)
                    return this.showError('Email Cc: "' + element + '" không hợp lệ.');
            });
        }
        let mailTo = "", mailCc = "";
        this.state.mailCc.forEach(element => {
            mailCc += element + ",";
        });
        this.state.mailTo.forEach(element => {
            mailTo += element + ",";
        });
        const data = {
            To: mailTo,
            Cc: mailCc,
            Subtitle: this.state.subject,
            Body: this.state.bodyMail,
            Link: window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + this.props.formDetail.accessKey
        }
        this.props.SpiralFormController.SendEmail(data)
            .then(() => {
                const result = this.props.sendEmail;
                if (result.status === 1) {
                    this.showSuccess("Successful");
                }
                else {
                    this.showError("Error");
                }

            });
    }
    render() {
        const hyperlink = window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + this.props.formDetail.accessKey
        return (
            <>
                <Toast ref={(el) => this.toast = el} />
                <div className="p-grid" style={{marginRight:0}}>
                    <div className="p-col-12" style={{ borderBottom: "solid 2px" }} >
                        <div className="p-grid">
                            <div className="p-col-fixed" style={{ width: 70, margin: 'auto' }}>
                                <div style={{ padding: '12px 7px', border: "solid 2px #94DAFF", borderRadius: '10%' }} onClick={() => this.handleSendEmail()} >
                                    <i className="pi pi-send" style={{ fontSize: '1.5em', paddingLeft: 5, color: "#94DAFF" }}></i>
                                    <label>Send</label>
                                </div>
                            </div>
                            <div className="p-col">
                                <div className="p-grid">
                                    <div className="p-col-fixed" style={{ width: 65 }}>
                                        <Button
                                            className="p-button-sm p-button-outlined p-button-secondary"
                                            label='To' />
                                    </div>
                                    <div className="p-col">
                                        <Chips id="to" style={{ fontSize: 14, width: '100%' }} value={this.state.mailTo} onChange={(e) => this.setState({ mailTo: e.value })} />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-fixed" style={{ width: 65 }}>
                                        <Button
                                            className=" p-button-sm p-button-outlined p-button-secondary"
                                            label='Cc' />
                                    </div>
                                    <div className="p-col">
                                        <Chips id="cc" style={{ fontSize: 14, width: '100%' }} value={this.state.mailCc} onChange={(e) => this.setState({ mailCc: e.value })} />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-fixed" style={{ width: 65 }}>
                                        <label>Subject</label>
                                    </div>
                                    <div className="p-col">
                                        <InputTextarea id="subject" style={{ fontSize: 15 }} value={this.state.subject} rows={1} autoResize onChange={(e) => this.setState({ subject: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='p-col-12'>
                        <div className="p-grid">
                            <div className='p-col-12'>
                                <p>Dear Anh/Chị,</p>
                            </div>
                            <div className="p-col-10 p-offset-1">
                                <div className="box">
                                    <InputTextarea value={this.state.bodyMail} placeholder='Body email' rows={10} autoResize onChange={(e) => this.setState({ bodyMail: e.target.value })} />
                                </div>
                            </div>
                            <div className='p-col-12'>
                                <a href={hyperlink} target="_blank" >Link khảo sát</a>
                                <br></br>
                                <p style={{ color: "#F05454" }}> Đây là email tự động, Anh/Chị vui lòng không phản hồi vào email này.</p>
                                <p> Thank & Best Regard,</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        sendEmail: state.spiralform.sendEmail,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SendEmail);