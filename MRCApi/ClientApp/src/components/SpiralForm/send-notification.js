import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { bindActionCreators } from 'redux';
import { CreateActionSpiralForm } from '../../store/SpiralFormController';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';


class SendNotification extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            title: "",
        }
        this.hyperlink = React.createRef();
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        //this.copyCodeToClipboard=this.copyCodeToClipboard.bind(this);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    handleChangeForm = (e) => {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    copyCodeToClipboard = () => {
        const context = this.hyperlink.current;
        context.select();
        document.execCommand('copy');
        this.showSuccess("Copy successful");
    }
    SendNotification() {
        const hyperlink = window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + this.props.formDetail.accessKey;
        let dataInput = this.props.dataInput, data = [];
        dataInput.forEach(item => {
            data.push({
                typeReport: "Thong bao",
                title: this.state.title,
                body: this.state.content,
                hyperLinks: hyperlink,
                userId: item.employeeId,
                token: item.token
            })
        });
        this.props.SpiralFormController.SendNotification(data)
            .then(() => {
                const result = this.props.sendNotification;
                if (result.status === 1) {
                    this.showSuccess(result.message);
                }
                else {
                    this.showError(result.message);
                }
            })
    }
    render() {
        const hyperlink = window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + this.props.formDetail.accessKey;
        return (
            <>
                <Toast ref={(el) => this.toast = el} />
                {this.state.loading ? <ProgressSpinner style={{ zIndex: 1000, position: 'absolute', top: '60%', left: 750 }} /> : null}
                <div className='p-grid' style={{ marginRight: 0 }}>
                    <div className="p-col-12">
                        <label>{this.props.language["notify_group"] || "l_notify_group"}</label><br />
                        <InputText optionLabel="typeReport"
                            value="Thong bao"
                            disabled />
                    </div>
                    <div className="p-col-12">
                        <label>{this.props.language["title"] || "l_title"}</label>
                        <InputText onChange={this.handleChangeForm}
                            value={this.state.title}
                            id="title" />
                    </div>
                    <div className="p-col-12">
                        <label>{this.props.language["hyper_link"] || "l_hyper_link"}</label>
                        <div className="p-inputgroup">
                            <InputText onChange={this.handleChangeForm}
                                value={hyperlink}
                                id="hyperLink"
                                ref={this.hyperlink}
                                disabled />
                            <textarea style={{ width: 0, height: 0, resize: 'none', marginLeft: -10 }} id={"hyperlink"}
                                ref={this.hyperlink}
                                value={hyperlink} />
                            <Button icon="pi pi-copy" className="p-button-warning" onClick={() => this.copyCodeToClipboard()} />
                        </div>
                    </div>
                    <div className="p-col-12">
                        <label>{this.props.language["content"] || "l_content"}</label>
                        <InputTextarea onChange={this.handleChangeForm}
                            value={this.state.content}
                            style={{ minHeight: 300, resize: 'block' }} id="content" />
                    </div>
                    <div className="p-col-12" style={{ textAlign: 'center' }}>
                        <Button label={this.props.language["send_notification"] || "l_send_notification"}
                            onClick={() => this.SendNotification()}
                            className="p-button p-button-info"
                            iconPos='right'
                            icon="pi pi-send" />
                    </div>
                </div>

            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        employees: state.spiralform.employees,
        sendNotification: state.spiralform.sendNotification,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SendNotification);