import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { actionCreatorsQC } from '../../../store/QCController.js';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';
import QCStatus from '../qc-status.js'
import { Toast } from 'primereact/toast';
import PhotoGallery from '../../Controls/Gallery/PhotoGallery.js';
import { Button } from 'primereact/button';

class QCVisibility extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: [],
            type: null
        }
        this.qcValueTemplate = this.qcValueTemplate.bind(this);
    }
    componentDidMount() {
        let data = {
            shopId: this.props.dataInput.shopId,
            employeeId: this.props.dataInput.employeeId,
            workDate: this.props.dataInput.workDate,
            qcId: this.props.dataInput.qcId,
            kpiId: 4
        }
        this.props.QCController.GetByKPI(data)
            .then(() => {
                const result = this.props.qcKPI
                if (result && result.length > 0) {
                    this.setState({ details: result })
                }
            });
    }
    qcValueTemplate(rowData) {
        return (
            <InputNumber value={rowData.qcValue}
                onChange={(e) => this.onChangeByQC(rowData.id, e.value, 'qcValue')} >
            </InputNumber>
        );
    }
    onChangeByQC(id, value, type) {
        let qcDetail = [...this.state.details];
        let index = qcDetail.findIndex(item => item.id === id);

        switch (type) {
            case 'qcValue':
                qcDetail[index].qcValue = (value === '' || value === null) ? null : value;

                break;
            default:
                break;
        }
        this.setState({ details: qcDetail });
    }
    render() {
        const result = this.state.details;
        let lstType = [], lstItem = [];
        if (result.length > 0) {
            result.forEach(element => {
                lstItem.push({ name: element.type, value: element.type });
            });
            lstType = lstItem.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                    unique.push(o);
                }
                return unique;
            }, []);
            if (this.state.type === null)
                this.setState({ type: lstType[0].name });

        }
        return (
            <>
                <div className="p-grid">
                    <div className="p-col-12 p-md-7 p-sm-12">

                        <SelectButton optionLabel="name" optionValue="value" value={this.state.type} options={lstType} onChange={(e) => this.setState({ type: e.value })} />
                        <DataTable className="p-datatable-striped"
                            key="id"
                            scrollable
                            value={this.state.details.filter(i => i.type === this.state.type)}
                            rowGroupMode="subheader"
                            groupField="brand"
                            sortMode="single"
                            rowGroupHeaderTemplate={rowData => {
                                return (
                                    <Button className="p-button-success p-button-outlined " label={rowData.brand}
                                        style={{ width: 'max-content', float: 'left' }} />
                                )
                            }}
                            rowGroupFooterTemplate={() => { }}
                            scrollHeight="450px"
                            style={{ fontSize: "13px", marginTop: "10px", }}
                        >
                            <Column filter header={this.props.language["no"] || "l_no"} field="rowNum" style={{ width: 80 }} />
                            <Column filter header={this.props.language["name"] || "l_name"} field="oolName" />
                            <Column filter header={this.props.language["actual"] || "l_actual"} field="oolValue" style={{ width: 100 }} />
                            <Column filter header={this.props.language["from_date"] || "l_from_date"} field="fromDate" style={{ width: 120 }} />
                            <Column filter header={this.props.language["to_date"] || "l_to_date"} field="toDate" style={{ width: 120 }} />
                            <Column body={this.qcValueTemplate} filter={true} field='qcValue' header="QC Value" style={{ width: 90, textAlign: 'center' }} />

                        </DataTable>
                    </div>
                    <div className="p-col-12 p-md-5 p-sm-12">
                        <PhotoGallery
                            {...this}
                            dataInput={this.props.dataInput}
                            photoType={"VISIBILITY"}
                            pageId={this.props.pageId}
                        />
                    </div>
                </div>
                <QCStatus dataInput={this.props.dataInput} pageId={this.props.pageId} dataItems={result}></QCStatus>
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        qcKPI: state.qc.qcKPI,
        kpiUpdate: state.qc.kpiUpdate
    }
}
function mapDispatchToProps(dispatch) {
    return {
        QCController: bindActionCreators(actionCreatorsQC, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QCVisibility);