import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { actionCreatorsQC } from '../../../store/QCController.js';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import QCStatus from '../qc-status.js'
import { Toast } from 'primereact/toast';
import PhotoGallery from '../../Controls/Gallery/PhotoGallery.js';

class QCSOS extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
        this.qcResultTemplate = this.qcResultTemplate.bind(this);
        this.qcValueTemplate = this.qcValueTemplate.bind(this);
        this.qcTotalTemplate = this.qcTotalTemplate.bind(this);
    }
    rowClass(data) {

        switch (data.rowNum) {
            case 100:
                return { 'row-group-level1': data.rowNum === 100 };
            case 1000:
                return { 'row-group-level2': data.rowNum === 1000 };
            case 10000:
                return { 'row-group-level3': data.rowNum === 10000 };
            default:
                break;
        }

    }
    componentDidMount() {
        let data = {
            shopId: this.props.dataInput.shopId,
            employeeId: this.props.dataInput.employeeId,
            workDate: this.props.dataInput.workDate,
            qcId: this.props.dataInput.qcId,
            kpiId: 3
        }
        this.props.QCController.GetByKPI(data)
            .then(() => {
                const result = this.props.qcKPI
                if (result && result.length > 0) {
                    this.setState({ details: result })
                }
            });
    }
    qcResultTemplate(rowData) {
        if (rowData.id > 0)
            return (
                <Checkbox
                    checked={rowData.qcResult === 1 ? true : false}
                    onChange={(e) => this.onChangeByQC(rowData.id, e.target.checked, 'qcResult')}
                    style={{ opacity: 1 }} />
            )
    }
    qcValueTemplate(rowData) {
        if (rowData.id > 0)
            return (
                <InputNumber value={rowData.qcValue}
                    onChange={(e) => this.onChangeByQC(rowData.id, e.value, 'qcValue')} >
                </InputNumber>
            );
    }
    qcTotalTemplate(rowData) {
        if (rowData.id > 0)
            return (
                <InputNumber value={rowData.qcTotal}
                    onChange={(e) => this.onChangeByQC(rowData.id, e.value, 'qcTotal')} >
                </InputNumber>
            );
    }
    onChangeByQC(id, value, type) {
        let qcDetail = [...this.state.details];
        let index = qcDetail.findIndex(item => item.id === id);

        switch (type) {
            case 'qcResult':
                qcDetail[index].qcResult = value === true ? 1 : null;

                break;
            case 'qcValue':
                qcDetail[index].qcValue = (value === '' || value === null) ? null : value;

                break;
            case 'qcTotal':
                qcDetail[index].qcTotal = (value === '' || value === null) ? null : value;

                break;
            default:
                break;
        }
        this.setState({ details: qcDetail });
    }
    render() {
        const result = this.state.details;
        // if (result.length === 0)
        //     return (
        //         <ProgressSpinner key={'loading'} style={{ left: '45%', top: 10 }} />
        //     );
        return (
            <>
                <div className="p-grid">
                    <div className="p-col-12 p-md-7 p-sm-12">
                        <DataTable className="p-datatable-striped"
                            key="id"
                            scrollable
                            rowClassName={this.rowClass}
                            value={this.state.details}
                            scrollHeight="450px"
                            style={{ fontSize: "13px", marginTop: "10px", display: 'a' }}
                        >
                            <Column filter header={this.props.language["name"] || "l_name"} field="name" />
                            <Column filter header={this.props.language["actual"] || "l_actual"} field="actual" style={{ width: 100 }} />
                            <Column filter header={this.props.language["total"] || "l_total"} field="total" style={{ width: 120 }} />
                            <Column filter header="%" field="percent" style={{ width: 80, textAlign: 'center' }} />
                            <Column body={this.qcValueTemplate} filter={true} field='qcValue' header="QC Actual" style={{ width: 90, textAlign: 'center' }} />
                            <Column body={this.qcTotalTemplate} filter={true} field='qcTotal' header="QC Total" style={{ width: 100, textAlign: 'center' }} />
                            <Column body={this.qcResultTemplate} filter={true} field='qcResult' header="Fail" style={{ width: 60, textAlign: 'center' }} />
                        </DataTable>
                    </div>
                    <div className="p-col-12 p-md-5 p-sm-12">
                        <PhotoGallery
                            {...this}
                            dataInput={this.props.dataInput}
                            photoType={"SOS"}
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
export default connect(mapStateToProps, mapDispatchToProps)(QCSOS);