import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import QuestionSetup from './QuestionSetup';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { CreateActionSpiralForm } from '../../store/SpiralFormController';
//import Banner from './Banner';
import Banner from './banner-v2.js';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { GetDateFrom } from '../../Utils/Helpler';
import { SelectButton } from 'primereact/selectbutton';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import Permission from './permission.js';
import EmployeesNotification from './employees-notification.js';
import SendNotification from './send-notification.js';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from "primereact/menu";
const user = JSON.parse(localStorage.getItem("USER"));

class FormSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit_question: {},
            question: [{
                "indexRow": 1,
                "questionId": 1,
                "questionName": "Add new question",
                "questionType": 0,
                "anwserItem": [],
                "required": true,
                "min": null,
                "max": null,
                "isEnd": null,
                "images": []
            }],
            title: '',
            subtitle: '',
            systemCode: [],
            repeatDate: null,
            dates: [new Date(), null],
            banner: null,
            activeDate: new Date(),
            public: 0
        }
        this.pageId = 4047;
        this.scroll_last = React.createRef();
        this.scroll_first = React.createRef();
        this.handleCreateForm = this.handleCreateForm.bind(this);
        this.onHidePermission = this.onHidePermission.bind(this);
        this.handleGetEmployees = this.handleGetEmployees.bind(this);
        this.handleSaveAndPermission = this.handleSaveAndPermission.bind(this);
        this.handleSaveAndSendNotify = this.handleSaveAndSendNotify.bind(this)
    }

    AddNewQuestion = (position) => {
        let question = [];
        if (position === 'first') {
            let lst = [...this.state.question];
            question.push({
                "indexRow": 1,
                "questionId": 1,
                "questionName": "Question " + 1,
                "questionType": 0,
                "anwserItem": [],
                "required": true,
                "min": null,
                "max": null,
                "isEnd": null,
                "images": []
            });
            lst.forEach(element => {
                question.push({
                    "indexRow": element.indexRow + 1,
                    "questionId": element.questionId + 1,
                    "questionName": element.questionName,
                    "questionType": element.questionType,
                    "anwserItem": element.anwserItem,
                    "required": element.required,
                    "min": element.min,
                    "max": element.max,
                    "isEnd": null,
                    "images": []
                });
            });
        }
        else {
            question = [...this.state.question];
            const indexNew = question.length + 1;
            question.push({
                "indexRow": indexNew,
                "questionId": indexNew,
                "questionName": "Question " + indexNew,
                "questionType": 0,
                "anwserItem": [],
                "required": true,
                "min": null,
                "max": null,
                "isEnd": null,
                "images": []
            });
        }
        this.setState({ question: question });

        if (position === 'last')
            this.scroll_last.scrollIntoView({ behavior: "smooth" });
        else
            this.scroll_first.scrollIntoView({ behavior: "smooth" });
    }
    handlerBanner = (imageInfo) => {
        this.setState({ banner: JSON.stringify(imageInfo) });
    }
    onTextChanged = (e, id) => {
        let question = [...this.state.question];
        question.forEach(update => {
            if (update.questionId === id) {
                update.questionName = e.target.value;
            }
        })
        this.setState({ question: question });
    }
    addAnwser = (question) => {
        let qsList = [...this.state.question];
        qsList.forEach(item => {
            if (item.questionId === question.questionId) {
                item.min = null;
                item.max = null;
                item.anwserItem = question.anwserItem;
                item.required = true;
            }
        })
        this.setState({ question: qsList });
    }
    handleGetEmployees(data) {
        this.setState({
            employeesNotification: data,
            showComponentSendNotification: true
        })
    }
    handleChange = (id, value) => {
        this.setState({
            [id]: value === null ? "" : value,
        });
        if (id === 'position' || id === 'supId') this.setState({ employee: 0 });
    }
    handlerChangeForm = (e) => {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    handleChangeRequired = async (e, index) => {
        let qsList = await JSON.parse(JSON.stringify(this.state.question))
        qsList[index].required = await e.value
        await this.setState({ question: qsList })
    }
    handleChangeIsEnd = async (e, index) => {
        let qsList = await JSON.parse(JSON.stringify(this.state.question))
        qsList[index].isEnd = await e.value
        await this.setState({ question: qsList })
    }
    handleChangeQuestion = async (value, id, index) => {
        let qsList = await JSON.parse(JSON.stringify(this.state.question))
        qsList[index][id] = await value
        await this.setState({ question: qsList })
    }
    handleCreateForm = async () => {
        const mState = await this.state;
        if (!mState?.dates?.[0]) {
            this.ShowAlert(`${this.props.language["please_select_date_active"] || "l_please_select_date_active"}`, 'warn');
            return;
        }
        if (mState.title === null || mState.title === '') {
            this.ShowAlert(`${this.props.language["please_input_title"] || "l_please_input_title"}`, 'warn');
            return
        }
        if (mState.subtitle === null || mState.subtitle === '') {
            this.ShowAlert(`${this.props.language["please_input_description"] || "l_please_input_description"}`, 'warn');
            return
        }
        if (mState.question === undefined || mState.length < 1) {
            this.ShowAlert("Chưa có câu hỏi nào", 'warn');
            return;
        }
        //Check Anwser
        let iSave = true;
        let usedEmployees = 0, usedStore = 0, usedMobile = 0;
        mState.systemCode.forEach(s => {
            if (s === 1)
                usedStore = 1;
            if (s === 2)
                usedEmployees = 1;
            if (s === 3)
                usedMobile = 1
        })
        mState.question.forEach(item => {
            if (item.anwserItem.length === 0) {
                this.ShowAlert("Câu hỏi: (" + item.questionName + ") chưa thực hiện xong phần trả lời");
                iSave = false;
                return;
            }
            if (typeof item.min === 'number' && typeof item.max === 'number') {
                if (item.min > item.max) {
                    this.ShowAlert("Giá trị Max phải lớn hơn hoặc bằng giá trị Min", 'error')
                    iSave = false;
                    return;
                }
            }
            if (item.min && item.max && (typeof item.min == 'string' && typeof item.max == 'string') && item.anwserItem[0].anwserType === 6) {
                let min = +moment(item.min).format('YYYYMMDD')
                let max = +moment(item.max).format('YYYYMMDD')
                if (min >= max) {
                    this.ShowAlert("Giá trị date-Max phải lớn hơn giá trị date-Min", 'error');
                    iSave = false;
                    return;
                }
            }
            if (item.anwserItem[0].anwserType === 10) {
                let anwserValue = [];
                const anwserName = JSON.parse(item.anwserItem[0].anwserName);
                const rows = anwserName.row.filter(e => e.rowId !== 100), columns = anwserName.column.filter(e => e.colId !== 100);
                rows.forEach(row => {
                    row.rowValue = columns;
                    anwserValue.push(row);
                });
                let questionIndex = mState.question.findIndex(q => q.questionId === item.questionId);
                mState.question[questionIndex].anwserItem[0].anwserValue = JSON.stringify(anwserValue);
            }
        })
        if (iSave) {
            let repeatNumber = mState.repeatDate
            if (repeatNumber === -1) {
                repeatNumber = mState.inputRepeatDate || 1
            }
            const data = await {
                id: mState.edit_question !== undefined ? mState.edit_question.id : 0,
                accessKey: mState.edit_question !== undefined ? mState.edit_question.accessKey : 0,
                title: mState.title,
                subtitle: mState.subtitle,
                banner: mState.banner,
                usedEmployees: usedEmployees,
                usedStores: usedStore,
                repeatDate: repeatNumber,
                fromdate: new moment(mState.dates[0]).format('YYYYMMDD'),
                todate: mState.dates[1] !== null ? new moment(mState.dates[1]).format("YYYYMMDD") : '',
                formdata: JSON.stringify(mState.question),
                positionList: mState.position ? "[" + mState.position + "]" : null,
                MMobile: usedMobile,
                public: mState.public,
                activeDate: mState.repeatDate === 0 ? new moment(mState.activeDate).format('YYYYMMDD') : null,
            }
            await this.props.SpiralFormController.CreateForm(data)
                .then(() => {
                    const result = this.props.createForm
                    if (result) {
                        this.ShowAlert('Đã lưu', 'info')
                        this.setState({
                            formDetail: result,
                            edit_question: result,
                            question: JSON.parse(result.formData),
                            title: result.title,
                            subtitle: result.subTitle,
                            banner: result.banner,
                            dates: [new Date(GetDateFrom(result.fromDate)), result.toDate !== null ? new Date(GetDateFrom(result.toDate)) : null]
                        });
                        // if (this.state.activeNow) {
                        //     this.setState({ showComponentNotify: true })
                        // }

                    } else {
                        this.ShowAlert('Lưu thất bại', 'error')
                    }
                }
                );
        }
    }
    ShowAlert = (messager, style) => {
        let mStyle = (style === undefined) ? "info" : style;
        this.toast.show({ severity: mStyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: messager });
    }
    removeQuestion = (item) => {
        let lremove = [...this.state.question];
        lremove.splice(lremove.indexOf(item), 1);
        let index = 1;
        //ReUpdate IndexId
        lremove.forEach(u => {
            u.questionId = index;
            u.indexRow = index;
            index++;
        })
        this.setState({ question: lremove });
    }
    onRowReorder = (e) => {
        let orderlist = e.value;
        let m_index = 1;
        orderlist.forEach((i) => {
            if (i.indexRow !== 100) {
                i.questionId = m_index;
                i.indexRow = m_index;
            }
            m_index++;
        })
        this.setState({ question: orderlist });
    }
    rowTemplate = (item, event) => {
        return (
            <QuestionSetup
                removeQuestion={() => this.removeQuestion(item)}
                addAnwser={() => this.addAnwser(item)}
                onTextChanged={(e) => this.onTextChanged(e, item.questionId)}
                listItem={this.state.question}
                key={item.indexRow}
                index={event.rowIndex}
                handleChangeRequired={this.handleChangeRequired}
                handleChangeQuestion={this.handleChangeQuestion}
                handleChangeIsEnd={this.handleChangeIsEnd}
                question={item} />
        )
    }

    componentDidMount() {
        let query = new URLSearchParams(this.props.location.search);
        // let permission = await HelpPermission(this.pageId);
        // await this.setState({ permission })
        const accessKey = query.get('publicKey');
        if (accessKey != null && accessKey.length > 2)
            this.props.SpiralFormController.GetByKey(accessKey)
                .then(() => {
                    const result = this.props.spiralForm;
                    this.setState({
                        formDetail: result,
                        edit_question: result,
                        question: JSON.parse(result.formData),
                        title: result.title,
                        subtitle: result.subTitle,
                        banner: result.banner,
                        dates: [new Date(GetDateFrom(result.fromDate)), (result.toDate !== null || result.toDate === undefined) ? new Date(GetDateFrom(result.toDate)) : null],
                        systemCode: [(result.usedStores === true ? 1 : 0), (result.usedEmployees === true ? 2 : 0), (result.mMobile === true ? 3 : 0)],
                        repeatDate: result.repeatDate,
                        public: result.public,
                        activeDate: result.activeDate !== null ? new Date(GetDateFrom(result.activeDate)) : new Date()
                    })
                });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.errors !== prevProps.errors) {
            this.ShowAlert(this.props.errors);
        }
    }
    onHidePermission() {
        this.setState({ showComponent: false });
    }
    handleSaveAndPermission = async () => {
        // await this.setState({ public: 0 });
        await this.handleCreateForm();
        await this.setState({ showComponent: true });
    }
    handleSaveAndSendNotify = async () => {
        // await this.setState({ public: 0 });
        await this.handleCreateForm();
        await this.setState({ showComponentNotify: true });
    }
    handleChangePublic = async (e) => {
        if (e.value !== null) {
            await this.setState({ public: e.value });
            // if (e.value === 0) {
            //     await this.handleCreateForm();
            //     if (this.state.formDetail !== null && this.state.formDetail !== undefined) {
            //         // await this.setState({ public: e.value });
            //         await this.setState({ showComponent: true });
            //     }

            // }
        }
    }

    render() {
        let formName = "Spiral Form";
        if (user.accountId === 15) formName = "Acacy Form"

        const lstPublic =
            [
                { name: 'Public', value: 1 },
                { name: 'Private', value: 0 }
            ];
        const items = [
            {
                label: 'Save',
                icon: 'pi pi-save',
                command: (e) => { this.handleCreateForm() }
            },
            {
                label: 'Save & Permission',
                icon: 'pi pi-sitemap',
                command: (e) => { this.handleSaveAndPermission() }
            },
            {
                label: 'Save & Send notify',
                icon: 'pi pi-bell',
                command: (e) => { this.handleSaveAndSendNotify() }
            }
        ]

        const header = <div className="p-grid">
            <div style={{ padding: 10, paddingLeft: 30, width: '40%', fontSize: 30, fontWeight: 'bold', textAlign: "left" }}>{formName}</div>
            <div style={{ padding: 10, paddingRight: 30, width: '60%', textAlign: 'right', }}>
                <Calendar showButtonBar
                    value={this.state.dates}
                    onChange={(e) => this.setState({ dates: e.value })}
                    dateFormat="yy-mm-dd"
                    inputClassName='p-inputtext'
                    id="dates"
                    selectionMode="range"
                    showIcon />
                <SelectButton
                    value={this.state.public}
                    className="p-d-inline"
                    style={{ marginRight: 10, marginLeft: 10 }}
                    options={lstPublic}
                    onChange={(e) => { this.handleChangePublic(e) }}
                    optionLabel="name"
                />
                {/* <Button
                    //style={{ marginRight: 10, marginLeft: 10 }}
                    label="View"
                    icon="pi pi-eye"
                    style={{ marginRight: 10 }}
                    className="p-button-warning"
                    onClick={() => this.setState({ isView: true })} /> */}
                <Menu model={items} popup ref={(el) => this.menu = (el)} />
                <Button
                    label="Save"
                    className="p-button-success"
                    onClick={(e) => this.menu.toggle(e)} />

            </div>
        </div>;
        const SystemOption =
            [
                { name: 'Sử Dụng Cửa Hàng', value: 1 },
                { name: 'Sử Dụng Nhân Viên', value: 2 },
                { name: 'Sử Dụng Cho App', value: 3 },
            ];

        const RepeatOption =
            [
                { name: 'Now', value: 0, },
                { name: 'Daily', value: 1, },
                { name: 'Weekly', value: 7, },
                { name: 'Other', value: -1, },
            ];

        return (
            <div className="p-grid" style={{ backgroundColor: '#000' }}>
                <Toast ref={(el) => this.toast = el} />
                {this.state.showComponent ? <Permission parentMethod={this.onHidePermission} formDetail={this.state.formDetail} /> : null}
                {/* {this.state.isView ? <Dialog maximizable
                    header={null}
                    blockScroll visible={this.state.isView}
                    onHide={() => this.setState({ isView: false })}
                    contentClassName='p_spiral_form_dialog'	>
                    <div key="container" className="p-grid ">
                        <div className={this.state.width > 700 ? "p-col-8 p-offset-2" : "p-col-12"}>
                            <FormResult mode="view" dataInput={this.state} />
                        </div>
                    </div>
                </Dialog> : null} */}
                <Sidebar visible={this.state.showComponentNotify} modal={false} style={{ width: 600, overflowY: 'none !important' }} position="left" onHide={() => this.setState({ showComponentNotify: false })}>
                    <EmployeesNotification formDetail={this.state.formDetail} parentMethod={this.handleGetEmployees} />
                </Sidebar>
                <Sidebar visible={this.state.showComponentSendNotification} modal={false} style={{ marginLeft: 600, width: 400, overflowY: 'none !important' }} position="left" onHide={() => this.setState({ showComponentNotify: true, showComponentSendNotification: false })}>
                    <SendNotification formDetail={this.state.formDetail} dataInput={this.state.employeesNotification} />
                </Sidebar>
                <div className="p-col-12 p-md-2 p-sm-12"></div>
                <div className="p-col-12 p-md-8 p-sm-12">
                    <Card style={{ paddingTop: 1 }} header={header}>
                        {/* <Banner banner={this.state.banner} handlerBanner={this.handlerBanner} /> */}
                        <Banner banner={this.state.banner} handlerBanner={this.handlerBanner} />
                        <br />
                        <div className="p-shadow-1">
                            <InputText
                                onChange={(e) => this.handlerChangeForm(e)}
                                style={{ fontSize: 18, marginBottom: 10 }}
                                id="title"
                                value={this.state.title}
                                placeholder="Form Title" />
                            <InputTextarea
                                value={this.state.subtitle}
                                onChange={(e) => this.handlerChangeForm(e)}
                                id="subtitle"
                                rows={2}
                                autoResize
                                style={{ fontSize: 13 }}
                                placeholder="Form description" />
                        </div>
                    </Card>
                    <Card style={{ margin: "10px 0px" }}>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-4 p-lg-4">
                                <SelectButton
                                    value={this.state.repeatDate}
                                    className="p-d-inline"
                                    style={{ float: 'left' }}
                                    options={RepeatOption}
                                    onChange={(e) => { this.setState({ repeatDate: e.value, }) }}
                                    optionLabel="name"
                                />
                                {this.state.repeatDate === -1 && (
                                    <InputNumber value={this.state.inputRepeatDate || 1} onValueChange={(e) => this.setState({ inputRepeatDate: e.value })}
                                        style={{ width: 100, paddingTop: 10 }}
                                        min={1} max={9999} showButtons />
                                )}
                                {this.state.repeatDate === 0 ?
                                    <Calendar showIcon showButtonBar
                                        value={this.state.activeDate}
                                        onChange={(e) => this.setState({ activeDate: e.value })}
                                        style={{ width: 180, paddingTop: 10 }}
                                        dateFormat="yy-mm-dd" /> : null
                                }
                            </div>
                            <div className="p-col-12 p-md-8 p-lg-8" style={{ textAlign: "right" }}>
                                <SelectButton
                                    value={this.state.systemCode}
                                    className="p-d-inline"
                                    options={SystemOption}
                                    onChange={(e) => {
                                        let arr = e.value ? e.value.filter((e) => e === 3) : [];
                                        this.setState({
                                            systemCode: e.value,
                                            isUsingForApp: arr.length > 0 ? true : null
                                        })
                                    }}
                                    optionLabel="name"
                                    multiple />
                                {/* <Menu model={addQuestion} popup ref={el => this.menu = el} id="popup_menu" />
                                <Button className="p-button-warning" icon="pi pi-plus" onClick={(event) => this.menu.toggle(event)} aria-controls="popup_menu" aria-haspopup /> */}
                                {this.state.isUsingForApp && <div className="p-col-6" style={{ float: 'right', display: 'flex' }} >
                                    <div style={{ marginTop: 7, marginRight: 5 }}>
                                        <label >{this.props.language["position"] || "position"}</label>
                                    </div>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        typeDropDown='multiple'
                                        type={this.state.position}
                                        onChange={this.handleChange}
                                        value={this.state.position} />
                                </div>}
                            </div>
                        </div>
                    </Card>
                    <div ref={(el) => { this.scroll_first = el; }}></div>
                    <Card>
                        <DataTable value={this.state.question}
                            reorderableColumns
                            onRowReorder={this.onRowReorder} >
                            <Column field="id" rowReorder style={{ width: '3em' }} />
                            <Column body={(rowData, e) => this.rowTemplate(rowData, e)} />
                        </DataTable>
                    </Card>
                    <div style={{ marginTop: 10 }} ref={(el) => { this.scroll_last = el; }}></div>
                </div>
                <div className="p-col-12 p-md-2 p-sm-12">
                    <div style={{ position: 'fixed', top: '45%', display: 'inline-grid' }}>
                        <Button
                            icon="pi pi-sort-numeric-up"
                            style={{ width: 50, height: 50 }}
                            tooltip={this.props.language["add_first"] || "l_add_first"}
                            onClick={() => this.AddNewQuestion('first')}
                            className="p-button-lg p-button-rounded p-button-warning" />
                        <Button
                            icon="pi pi-sort-numeric-down"
                            style={{ marginTop: 8, width: 50, height: 50 }}
                            tooltip={this.props.language["add_last"] || "l_add_last"}
                            onClick={() => this.AddNewQuestion('last')}
                            className="p-button-lg p-button-rounded  p-button-warning" />
                    </div>

                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.spiralform.loading,
        errors: state.spiralform.errors,
        language: state.languageList.language,
        spiralForm: state.spiralform.spiralForm,
        createForm: state.spiralform.createForm,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FormSetup);