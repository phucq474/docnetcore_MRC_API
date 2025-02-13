import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { actionCreatorsQC } from '../../../store/QCController.js';
import { ProgressSpinner } from 'primereact/progressspinner';
import QCStatus from '../qc-status.js'
import { Toast } from 'primereact/toast';
import PhotoGallery from '../../Controls/Gallery/PhotoGallery.js';
import { MdSave, MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'
import { getAccountId, getLogin } from '../../../Utils/Helpler.js';

class QCOSA extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            loading: false,
            details: []
        }
        this.qcOSATemplate = this.qcOSATemplate.bind(this);
        this.qcNoImageTemplate = this.qcNoImageTemplate.bind(this);
        this.onChangeByQC = this.onChangeByQC.bind(this);
    }
    componentDidMount() {
        let data = {
            shopId: this.props.dataInput.shopId,
            employeeId: this.props.dataInput.employeeId,
            workDate: this.props.dataInput.workDate,
            qcId: this.props.dataInput.qcId,
            kpiId: 2
        }
        this.props.QCController.GetByKPI(data)
            .then(() => {
                const result = this.props.qcKPI
                if (result && result.length > 0) {
                    this.setState({ details: result })
                }
            });
    }
    onChangeByQC(id, value, type) {
        let qcDetail = [...this.state.details];
        let index = qcDetail.findIndex(item => item.id === id);
        switch (type) {
            case 'qcNoImage':
                qcDetail[index].qcNoImage = value === true ? 1 : null;
                if (value)
                    qcDetail[index].qcValue = 0;
                break;
            case 'qcValue':
                qcDetail[index].qcValue = value === true ? 1 : (qcDetail[index].qcValue === 1 && value !== true) ? 0 : null;
                if (value)
                    qcDetail[index].qcNoImage = null;
                break;
            default:
                break;
        }
        this.setState({ details: qcDetail });
    }
    qcOSATemplate(rowData) {

        return (
            <Checkbox
                checked={rowData.qcValue === 1 ? true : false}
                onChange={(e) => this.onChangeByQC(rowData.id, e.target.checked, 'qcValue')}
                style={{ opacity: 1 }} />
        )
    }
    qcNoImageTemplate(rowData) {
        return (
            <Checkbox
                checked={rowData.qcNoImage === 1 ? true : false}
                onChange={(e) => this.onChangeByQC(rowData.id, e.target.checked, 'qcNoImage')}
                style={{ opacity: 1 }} />
        )
    }
    osaTemplate(rowData) {
        if (rowData.osa === 1)
            return <MdRadioButtonChecked size={25} color={'#007ad9'} />
        else
            return <MdRadioButtonUnchecked size={25} />
    }
    Alert(typestyle, summary, messager) {
        this.toast.show({ severity: typestyle, summary: summary, detail: messager });
    }
    render() {
        const result = this.state.details;
        // if (result.length === 0)
        //     return (
        //         <ProgressSpinner key={'loading'} style={{ left: '45%', top: 10 }} />
        //     );
        return (
            <>
                <Toast ref={(el) => this.toast = el} />
                <div className="p-grid">
                    <div className="p-col-12 p-md-7 p-sm-12">
                        <DataTable className="p-datatable-striped"
                            scrollable
                            rowGroupMode="subheader"
                            groupField="brand"
                            sortMode="single"
                            sortField="brand"
                            rowGroupHeaderTemplate={rowData => {
                                return (
                                    <Button className="p-button-info p-button-outlined" label={rowData.brand}
                                        style={{ width: 'max-content', float: 'left', fontWeight: 400 }} />
                                )
                            }}
                            rowGroupFooterTemplate={() => { }}
                            value={result} scrollHeight="400px"
                            style={{ fontSize: "13px" }}
                            key="rowNum">
                            <Column header="No." field="rowNum" style={{ width: "50px" }} />
                            <Column filter filterMatchMode="contains" header={this.props.language["category"] || "l_category"} field="category" style={{ width: 100 }} />
                            {/* <Column header={this.props.language["subCategory"] || "l_subCategory"} field="subCategory" style={{ width: 100 }} />
                            <Column header={this.props.language["productCode"] || "l_productCode"} field="productCode" style={{ width: 100 }} /> */}
                            <Column filter filterMatchMode="contains" header={this.props.language["productName"] || "l_productName"} field="productName" />
                            <Column filter header={this.props.language["stock"] || "l_stock"} field="stock" style={{ width: 60 }} />
                            <Column filter filterMatchMode="contains" body={this.osaTemplate} header="OSA" field="osa" style={{ width: 50 }} />
                            <Column filter={true} body={this.qcOSATemplate} field='qcValue' style={{ width: 70, textAlign: 'center' }} header="QC OSA" />
                            <Column body={this.qcNoImageTemplate} filter={true} field='qcNoImage' header="Không thể hiện" style={{ width: 70, textAlign: 'center' }} />

                        </DataTable>
                    </div>
                    <div className="p-col-12 p-md-5 p-sm-12">
                        <PhotoGallery
                            {...this}
                            dataInput={this.props.dataInput}
                            photoType={"OSA"}
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
export default connect(mapStateToProps, mapDispatchToProps)(QCOSA);