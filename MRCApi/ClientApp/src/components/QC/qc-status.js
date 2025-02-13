import React, { PureComponent } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreatorsQC } from "../../store/QCController";
import { URL, getToken, HelpPermission, getLogin } from '../../Utils/Helpler';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
class QCStatus extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            status: null,
            dataDetail: null,
            qcStatus: null,
            qcComment: null,
            permission: {},
            dataStatus: this.props.dataNote
        };
        this.handleOnSaveChange = this.handleOnSaveChange.bind(this);
        this.onChangeQCComment = this.onChangeQCComment.bind(this);
        this.onChangeCommentKPI = this.onChangeCommentKPI.bind(this);
        this.onCheckedKPI = this.onCheckedKPI.bind(this);
    }

    onChangeQCStatus(e) {
        let data = this.state.dataDetail;
        if (data !== null) {
            data.kpiStatus = e.target.value;
            this.setState({ dataDetail: data, qcStatus: data.kpiStatus })
        }
    }
    onChangeQCComment(e) {
        let data = this.state.dataDetail;
        if (data !== null) {
            data.comment = e.target.value;
            this.setState({ dataDetail: data, qcComment: data.comment })
        }
    }
    handleOnSaveChange() {
        let dataQC = this.state.dataDetail;

        if (dataQC.kpiStatus === '' || dataQC.kpiStatus === null) {
            this.Alert('error', 'Error Message', "Chưa chọn kết quả QC");
            return;
        }
        else {
            this.setState({ loading: true });
            let dataItems = [];
            this.props.dataItems.forEach(element => {
                let item = null;
                switch (dataQC.kpiId) {
                    case 2:
                        item = {
                            id: element.id,
                            qcNoImage: element.qcNoImage,
                            qcValue1: element.qcValue,
                            qcValue2: null
                        }
                        dataItems.push(item);
                        break;
                    case 3:
                        {getLogin().accountName === "Fonterra" ?
                            item = {
                                id: element.id,
                                qcpog: element.qcpog
                            } 
                            :
                            item = {
                                id: element.id,
                                qcValue1: element.qcValue,
                                qcValue2: element.qcTotal,
                                qcNoImage: element.qcResult
                            }
                        }
                       
                        dataItems.push(item);
                        break;
                    case 4:
                        if (element.qcValue !== null && element.qcValue !== undefined) {
                            item = {
                                id: element.id,
                                brandId: element.brandId,
                                itemId: element.itemId,
                                typeId: element.typeId,
                                qcValue1: element.qcValue,
                                qcValue2: null,
                                qcNoImage: null
                            }
                            dataItems.push(item);
                        }
                        break;
                    default:
                        break;
                }

            });
            var data = {
                id: dataQC.id,
                qcId: dataQC.qcId,
                kpiId: dataQC.kpiId,
                remark: JSON.parse(dataQC.remark),
                comment: dataQC.comment,
                kpiStatus: dataQC.kpiStatus,
                dataItems: dataItems
            }
            this.props.QCController.QCDetailUpdate(data)
                .then(() => {
                    if (this.props.kpiStatus.status === 1)
                        this.Alert('success', 'Success Message', 'Successful');
                    else
                        this.Alert('error', 'Error Message', 'Failed ' + this.props.kpiStatus.fileUrl);

                    this.setState({ loading: false })
                });
        }
    }
    Alert(typestyle, summary, messager) {
        this.toast.show({ severity: typestyle, summary: summary, detail: messager });
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.props.pageId);
        await this.setState({ permission })
    }
    componentDidMount() {
        this.setState({ dataDetail: this.props.dataInput })
    }
    onCheckedKPI(e) {

        const data = this.state.dataDetail;
        let remark;
        if (data !== null) {
            remark = JSON.parse(data.remark);
            if (remark.length > 0) {
                const index = remark.findIndex(item => item.Id === e.target.value);
                remark[index].Value = e.target.checked ? 'True' : 'False';
                if (e.target.checked === false) {
                    remark[index].Note = '';
                }
                data.remark = JSON.stringify(remark);
                this.setState({ qcRemark: data.remark, dataDetail: data })
            }
        }
    }
    onChangeCommentKPI(note, key) {
        let data = this.state.dataDetail;
        let remark;
        if (data !== null) {
            remark = JSON.parse(data.remark);
            if (remark.length > 0) {
                const index = remark.findIndex(item => item.Id === key);
                remark[index].Note = note;
                data.remark = JSON.stringify(remark);
                this.setState({ qcRemark: data.remark, dataDetail: data });
            }
        }
    }
    render() {
        const data = this.state.dataDetail;
        if (data === null) {
            return <ProgressSpinner style={{ height: '50px', width: '100%' }} ></ProgressSpinner>
        }
        let divSave = [], qcItems = [];
        if (this.state.permission?.edit)
            divSave = (
                <div className="p-col-12">
                    <Button label="Save" icon="pi pi-check"
                        className="p-button-success"
                        style={{ marginRight: '.25em', width: 'auto' }}
                        onClick={this.handleOnSaveChange} />

                </div>
            )
        var objRemark = JSON.parse(data.remark);
        if (objRemark != null) {
            qcItems = objRemark.map((item) => {
                return (
                    <div className="p-col-6" key={'divQCItem_' + item.Id}>
                        <Checkbox
                            key={'cb' + item.Id}
                            value={item.Id}
                            onChange={(e) => this.onCheckedKPI(e)}
                            checked={item.Value === "True"}
                            inputId={item.Id}
                            style={{ marginRight: 10 }}
                        ></Checkbox>
                        <label
                            htmlFor={item.Name}
                            className="p-checkbox-label">
                            {item.Name}
                        </label>
                        <InputTextarea
                            key={'txt' + item.Id}
                            style={{ width: '100%', marginTop: 5 }}
                            value={item.Note}
                            rows={1}
                            autoResize
                            onChange={(e) => this.onChangeCommentKPI(e.target.value, item.Id)}
                        />
                    </div>
                );
            })
        }

        return (
            <div style={{ marginTop: '10px' }}>
                <Toast ref={(el) => this.toast = el} />
                <Accordion activeIndex={0} >
                    <AccordionTab header="QC Status"  >
                        <div className="p-grid" style={{ display: "flex", justifyContent: "center" }} >
                            {this.state.loading && <ProgressSpinner style={{ height: '100px', width: '100%', display: 'flex', position: 'fixed', top: '45%' }} ></ProgressSpinner>}
                        </div>
                        <div className="p-grid" >
                            {qcItems.length > 0 &&
                                <div className="p-col-12">
                                    <div className="p-grid" style={{ border: 'solid 1px #888', marginTop: '10px', padding: '10px', overflowX: 'hidden', maxHeight: 400 }}>
                                        {qcItems}
                                    </div>
                                </div>}
                            <div className="p-col-12">
                                <div className="card" style={{ width: '800px', margin: '5px', display: 'flex' }}>
                                    <div className="p-field-radiobutton">
                                        <RadioButton
                                            inputId="rb1" name="qcStatus" value="Pass"
                                            onChange={(e) => this.onChangeQCStatus(e)}
                                            checked={data.kpiStatus === 'Pass'} />
                                        <strong htmlFor="rb1" style={{ marginRight: '10px' }} className="p-radiobutton-label">Pass</strong>
                                    </div>
                                    <div className="p-field-radiobutton">
                                        <RadioButton inputId="rb9" name="qcStatus" value="Fail"
                                            onChange={(e) => this.onChangeQCStatus(e)}
                                            checked={data.kpiStatus === 'Fail'} />
                                        <strong htmlFor="rb9" style={{ marginRight: '10px' }} className="p-radiobutton-label">Fail</strong>
                                    </div>

                                </div>
                            </div>
                            <div className="p-col-12">
                                <strong><i>Ghi chú</i></strong>
                                <InputTextarea
                                    value={data.comment || ''}
                                    onChange={(e) => this.onChangeQCComment(e)}
                                    rows={2}
                                    autoResize
                                    style={{ width: '100%', }} />
                            </div>
                            {divSave}

                        </div>
                    </AccordionTab>
                </Accordion>
            </div >
        )
    }
}

function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        qcDetails: state.qc.qcDetails,
        qcKPI: state.qc.qcKPI,
        kpiStatus: state.qc.kpiStatus
    }
}
function mapDispatchToProps(dispatch) {
    return {
        QCController: bindActionCreators(actionCreatorsQC, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QCStatus);
