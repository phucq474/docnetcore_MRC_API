import React, { PureComponent } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { connect } from 'react-redux';
import { getToken } from './../Utils/Helpler';
import { Dialog } from 'primereact/dialog';
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import logo from '../asset/images/logo.png';
const stylePass = {
    background: {
        backgroundImage: "url('../images/Background04.svg')",
        backgroundRepeat: 'no',
        height: '100%'
    }
}
class UserChangePass extends PureComponent {
    constructor(props) {
        super(props)
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.ConfirmChange = this.ConfirmChange.bind(this);
        this.viewPass = this.viewPass.bind(this);
        this.Alert = this.Alert.bind(this);
        this.state = {
            oldpass: '',
            newpass: '',
            confirmpass: '',
        }
        this.pageId = 208
    }
    viewPass(e) {
        const idclass = ('h' + [e.target.id]);
        this.setState({ [idclass]: !this.state[idclass] });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    Alert(messager, typestyle) {
        this.growl.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: messager });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.ischange !== this.props.ischange) {
            this.setState({ show: nextProps.ischange });
        }
    }
    handleChangePass(event) {
        //event.preventDefault();
        let newpass = this.state.newpass;
        let oldpass = this.state.oldpass;
        let confirmpass = this.state.confirmpass;
        let alert = "";
        if (oldpass === undefined || oldpass === "")
            alert += `${this.props.language["please_input_old_password"] || "l_please_input_old_password"} \n`;
        if (newpass === undefined || newpass === "")
            alert += `${this.props.language["please_input_new_password"] || "l_please_input_new_password"} \n`;
        if (confirmpass === undefined || confirmpass === "")
            alert += `${this.props.language["please_input_confirm_new_password"] || "l_please_input_confirm_new_password"}\n`;
        if (alert.length > 1) {
            this.Alert(alert, "error");
        } else if (oldpass.toLowerCase() === newpass.toLowerCase()) {
            alert = `${this.props.language["new_password_must_be_different_from_the_old_one"] || "l_new_password_must_be_different_from_the_old_one"}\n`;
            this.Alert(alert, "error");
        } else if (newpass.toLowerCase() !== confirmpass.toLowerCase()) {
            alert = `${this.props.language["confirm_password_must_be_match_to_password"] || "l_confirm_password_must_be_match_to_password"} \n`;
            this.Alert(alert, "error");
        }
        else {
            this.setState({ visibleModal: true });
        }
    }
    ShowChange = () => {
        this.setState({ show: true });
    }
    renderFooterDialog() {
        return (
            <div>
                <Button
                    label={this.props.language["update"] || "l_update"}
                    icon="pi pi-check"
                    onClick={() => { this.ConfirmChange() }} />
                <Button
                    label={this.props.language["cancel"] || "l_cancel"}
                    icon="pi pi-times"
                    onClick={() => this.setState({ visibleModal: false })}
                    className="p-button-secondary" />
            </div>
        );
    }
    async ConfirmChange() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'oldpass': this.state.oldpass,
                'newpass': this.state.newpass,
            }
        }
        const response = await fetch('/employee/changepass', requestOptions);
        const results = await response.text();
        if (results > 0) {
            this.Alert(`${this.props.language["password_has_changed_please_login_again"] || "l_password_has_changed_please_login_again"}`);
            this.setState({ redirect: true, show: false });
        } else {
            this.Alert(`${this.props.language["incorrect_password"] || "l_incorrect_password"}`);
        }
        this.setState({ visibleModal: false });
    }
    render() {
        return (
            <div className="p-card">
                <div style={stylePass.background} >
                    <div className="p-grid">
                        <div className="p-col-12">
                            <img alt="logo" style={{ height: 160 }} src={logo}></img>
                        </div>
                        <div className="p-col-12 md-col-3">
                        </div>
                        <div className="p-col-12 md-col-6">
                            <header><h4 style={{ color: 'dark' }}>{this.props.language["change_password"] || "l_change_password"}</h4></header>

                            <label>{this.props.language["old_password"] || "l_old_password"}</label>
                            <div className="p-inputgroup">
                                <InputText type={this.state.serold === true ? "text" : "password"}
                                    id="oldpass"
                                    onChange={this.handleChangeForm}
                                    placeholder={this.props.language["old_password"] || "l_old_password"} />
                                <ToggleButton checked={this.state.serold}
                                    style={{ width: 40 }}
                                    onChange={(e) => this.setState({ serold: e.value })}
                                    onIcon="pi pi-eye success"
                                    onLabel=""
                                    offLabel=""
                                    offIcon="pi pi-eye-slash danger" />
                            </div>

                            <label>{this.props.language["new_password"] || "l_new_password"}</label>
                            <div className="p-inputgroup">
                                <InputText id="newpass"
                                    type={this.state.sernew === true ? "text" : "password"}
                                    onChange={this.handleChangeForm}
                                    placeholder={this.props.language["new_password"] || "l_new_password"} />
                                <ToggleButton checked={this.state.sernew}
                                    style={{ width: 40 }}
                                    onChange={(e) => this.setState({ sernew: e.value })}
                                    onIcon="pi pi-eye success"
                                    onLabel=""
                                    offLabel=""
                                    offIcon="pi pi-eye-slash" />
                            </div>
                            <label>{this.props.language["reinput_new_password"] || "l_reinput_new_password"}</label>
                            <div style={{ zIndex: 3000 }} className="p-inputgroup">
                                <InputText id="confirmpass" onChange={this.handleChangeForm} placeholder={this.props.language["reinput_new_password"] || "l_reinput_new_password"} />
                                <ToggleButton checked={this.state.serre}
                                    style={{ width: 40 }}
                                    onChange={(e) => this.setState({ serre: e.value })}
                                    onIcon="pi pi-eye success" onLabel="" offLabel="" offIcon="pi pi-eye-slash" />

                                <label> </label><br />
                                <Toast ref={(el) => this.growl = el} />
                                <Dialog
                                    header={this.props.language["annoucement"] || "l_annoucement"}
                                    visible={this.state.visibleModal}
                                    modal={true}
                                    onHide={() => this.setState({ visibleModal: false })}
                                    blockScroll
                                    footer={this.renderFooterDialog()}
                                ><p>{this.props.language["change_password_yesno"] || "change_password_yesno"}?</p></Dialog>
                            </div>
                            <Button onClick={() => this.handleChangePass()}
                                style={{ marginTop: '15px' }}
                                label={this.props.language["confirm_change_password"] || "l_confirm_change_password"}
                                className="p-button-danger"></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserChangePass);