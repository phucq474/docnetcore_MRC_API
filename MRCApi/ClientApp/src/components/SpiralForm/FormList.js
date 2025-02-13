import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CreateActionSpiralForm } from '../../store/SpiralFormController';
import { bindActionCreators } from 'redux';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import moment from 'moment';
import { HelpPermission } from '../../Utils/Helpler';
import QRCode from 'qrcode.react';
import { Sidebar } from 'primereact/sidebar';
import Permission from './permission.js';
import SendEmail from './send-email.js';
import EmployeesNotification from './employees-notification.js';
import SendNotification from './send-notification.js'
import Page403 from '../ErrorRoute/page403';
import { ProgressBar } from 'primereact/progressbar';

class FormList extends PureComponent {
    constructor(props) {
        super(props)
        this.pageId = 29
        this.state = {
            permission: {},
            date: new Date(),
            showComponent: false,
            showComponentSendNotification: false,
            formDetail: null,
            employeesNotification: [],
            loading: false
        }
        this.onHidePermission = this.onHidePermission.bind(this);
        this.handleGetEmployees = this.handleGetEmployees.bind(this);
    }
    copyCodeToClipboard = (id) => {
        const context = this['textArea' + id];
        context.select();
        document.execCommand('copy');
        this.ShowAlert("Copy link success");
    }
    onHidePermission() {
        this.setState({ showComponent: false });
    }
    handleGetEmployees(data) {
        this.setState({
            employeesNotification: data,
            showComponentSendNotification: true
        })
    }
    ShowAlert = (messager, style) => {
        let mStyle = (style === undefined) ? "info" : style;
        this.toast.show({ severity: mStyle, summary: 'Thông báo', detail: messager });
    }
    onSelectItem = (item) => {
        window.open('/form/formsetup?publicKey=' + item.accessKey, 'edit');
    }
    itemTemplate = (data) => {
        if (data === null)
            return null;
        const footer = <div id="food" key={data.accessKey}>
            {this.state.permission.edit ?
                <>
                    <Button style={{ margin: 5 }}
                        icon="pi pi-pencil"
                        className="p-button-sm p-button-warning"
                        onClick={() => this.onSelectItem(data)}
                        label="Edit" />
                    <Button style={{ margin: 5 }}
                        className="p-button-sm p-button-success"
                        onClick={() => window.open('/form/formresult?publicKey=' + data.accessKey, "view")}
                        icon="pi pi-eye" label="View" />
                    <Button style={{ margin: 5 }}
                        className="p-button-sm p-button-info"
                        icon="pi pi-copy"
                        onClick={(e) => this.copyCodeToClipboard(data.id)}
                        label="Copy" />
                    <Button style={{ margin: 5 }}
                        icon="pi pi-trash"
                        label="Closed"
                        className="p-button-sm p-button-danger"
                        onClick={() => this.InactiveItem(data)} />
                    <Button style={{ margin: 5 }}
                        icon="pi pi-sitemap"
                        className="p-button-sm p-button-secondary"
                        onClick={() => this.setState({ showComponent: true, formDetail: data })}
                        label="Permission" />
                    <Button style={{ margin: 5 }}
                        icon="pi pi-bell"
                        className="p-button-sm p-button-primary"
                        onClick={() => this.setState({ showComponentNotify: true, formDetail: data })}
                        label="Send Notifications" />
                    <Button style={{ margin: 5 }}
                        icon="pi pi-at"
                        className="p-button-sm p-button-help"
                        onClick={() => this.setState({ showComponentEmail: true, formDetail: data })}
                        label="Send Emails" />
                </> : null}
        </div>
        const hyperlink = window.location.protocol + '//' + window.location.host + '/form/formresult?publicKey=' + data.accessKey
        return (
            <div style={{ padding: 5 }} className="p-col-12 p-md-4">
                <div style={{ minHeight: 215 }} className="p-shadow-10 p-p-3">
                    <div className="product-grid-item">
                        <div className="product-grid-item-top">
                            <div>
                                <i className="pi pi-tag product-category-icon"></i>
                                <span className="product-category">{data.title}</span>
                            </div>
                        </div>
                        <div className="product-grid-item-content">
                            <textarea style={{ width: 0, height: 0, resize: 'none' }} id={data.id}
                                ref={(textarea) => this['textArea' + data.id] = textarea}
                                value={hyperlink} />
                            <QRCode value={hyperlink}
                                size={130}
                                level={'H'}
                                includeMargin={true}
                            />
                            <div className="product-description">
                                <label>{data.subtitle}</label>
                            </div>
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        );
    }
    InactiveItem = async (data) => {
        await this.props.SpiralFormController.InActiveSpiralForm(data)
        const result = this.props.inActiveForm
        if (result[0].alert === '1') {
            await this.ShowAlert('InActive Successful', 'info');
            await this.Filter();
        }
        else
            await this.ShowAlert('InActive Failed', 'error')
    }
    async componentDidMount() {
        await this.Filter();
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Filter = () => {
        this.setState({ loading: true });
        let fdate = (this.state.date === undefined || this.state.date === null) ? '' : this.state.date;
        const data = {
            fromDate: fdate !== '' ? new moment(fdate).format('YYYYMMDD') : fdate,
            title: (this.state.title === undefined || this.state.title === null) ? '' : this.state.title
        }
        this.props.SpiralFormController.GetList(data)
            .then(() => {
                const result = this.props.list;
                this.setState({ loading: false });
                if (result.length > 0)
                    this.ShowAlert("Successful");
                else
                    this.ShowAlert("No data");
            }
            );
    }
    render() {
        const leftCom = [], rightCom = [];
        if (this.state.permission) {
            if (this.state.permission.view === true) {
                leftCom.push(<Button icon="pi pi-search" onClick={() => this.Filter()} label="Search" />)
            }
            if (this.state.permission.view === true && this.state.permission.create === true) {
                rightCom.push(<Button icon="pi pi-plus" className="p-button-success" onClick={() => { window.open('/form/formsetup', "new") }} label="Create Form" />)
            }
        }
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    {this.state.showComponent ? <Permission parentMethod={this.onHidePermission} formDetail={this.state.formDetail} /> : null}
                    <Sidebar visible={this.state.showComponentEmail} modal={false} style={{ width: 650, overflowY: 'none !important' }} position="right" onHide={() => this.setState({ showComponentEmail: false })}>
                        <SendEmail formDetail={this.state.formDetail} />
                    </Sidebar>
                    <Sidebar visible={this.state.showComponentNotify} modal={false} style={{ width: 600, overflowY: 'none !important' }} position="left" onHide={() => this.setState({ showComponentNotify: false })}>
                        <EmployeesNotification formDetail={this.state.formDetail} parentMethod={this.handleGetEmployees} />
                    </Sidebar>
                    <Sidebar visible={this.state.showComponentSendNotification} modal={false} style={{ marginLeft: 600, width: 400, overflowY: 'none !important' }} position="left" onHide={() => this.setState({ showComponentNotify: true, showComponentSendNotification: false })}>
                        <SendNotification formDetail={this.state.formDetail} dataInput={this.state.employeesNotification} />
                    </Sidebar>
                    <Accordion activeIndex={0} style={{ marginTop: '10px' }}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-3 p-sm-6">
                                    <label>Active Date</label><br />
                                    <Calendar showIcon showButtonBar
                                        value={this.state.date}
                                        onChange={(e) => this.setState({ date: e.value })}
                                        style={{ width: '91%' }}
                                        dateFormat="yy-mm-dd" />
                                </div>
                                <div className="p-col-12 p-md-3 p-sm-6">
                                    <label>Title</label>
                                    <InputText placeholder="Keyword" id="title" onChange={(e) => { this.setState({ title: e.target.value }) }} />
                                </div>
                                <div className="p-col-12 p-md-3 p-sm-6">

                                </div>
                                <div className="p-col-12 p-md-3 p-sm-6">

                                </div>
                                <div className="p-col-12 p-md-3 p-sm-6">

                                </div>
                                <div className="p-col-12 p-md-3 p-sm-6">

                                </div>
                            </div>
                            <Toolbar id="tb" left={leftCom} right={rightCom} />
                            {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                        </AccordionTab>
                    </Accordion>
                    <Card>
                        <DataView value={this.props.list}
                            layout='grid'
                            paginator
                            rows={12}
                            itemTemplate={this.itemTemplate}>
                        </DataView>
                    </Card>
                </Card>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.spiralform.loading,
        errors: state.spiralform.errors,
        list: state.spiralform.list,
        spiralForm: state.spiralform.spiralForm,
        language: state.languageList.language,
        inActiveForm: state.spiralform.inActiveForm,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FormList);