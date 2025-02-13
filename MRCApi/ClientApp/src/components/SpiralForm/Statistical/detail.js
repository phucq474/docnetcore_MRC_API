import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateActionSpiralFormStatistical } from '../../../store/SpiralFormStatisticalController.js';
import { ChartCirle } from "../../Dashboard/ChartCirle.js";
import { ChartColumnSingle } from "../../Dashboard/ChartColumnSingle.js";
import DetailGrid from './detail-grid.js'

class Detail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detail: null,
            notDetail: [],
            doneDetail: []
        }
        //this.renderDetail=this.renderChart.bind(this);
        // this.renderChart=this.renderChart.bind(this);
    }
    componentDidMount() {
        let data = {
            fromDate: this.props.dataInput.fromDate,
            toDate: this.props.dataInput.toDate,
            formId: this.props.dataInput.formId,
        }

        const inp = this.props.dataInput;

        if (inp.notDetail) {
            this.setState({ notDetail: JSON.parse(inp?.notDetail) })
        }

        if (inp.doneDetail) {
            this.setState({ doneDetail: JSON.parse(inp?.doneDetail) })
        }

        this.props.SpiralFormStatisticalController.GetById(data)
            .then(() => {
                const result = this.props.detail;
                this.setState({
                    detail: result,
                })
            });
    }
    renderChart(element) {
        if (element.questionType === 0)
            switch (element.anwserType) {
                case 4:
                case 5:
                case 11:
                case 12:
                case 13:
                    return <ChartCirle key={element.questionId} datachart={JSON.parse(element.detail)} />
                case 3:
                    return <ChartColumnSingle key={element.questionId} datachart={JSON.parse(element.detail)} />
                default:
                    return null;
            }
        else if (element.questionType === 101 || element.questionType === 102) {
            let data = {
                fromDate: this.props.dataInput.fromDate,
                toDate: this.props.dataInput.toDate,
                formId: this.props.dataInput.formId,
                questionId: element.questionId,
                questionType: element.questionType,
                anwserType: element.anwserType
            }
            return <DetailGrid dataInput={data} />
        }
    }
    renderDetail(data) {
        let result = [], uiHeader = [], chart = [];

        data.forEach(element => {
            uiHeader = (<>
                <label>{element.questionName}</label><br></br>
                <i>{element.anwserValue} câu trả lời</i>
            </>);
            chart = this.renderChart(element);
            result.push(
                <div className='p-md-12'>
                    <Panel key={element.questionId} header={uiHeader} >
                        {chart}
                    </Panel >
                </div>

            );
        });
        return result;
    }
    render() {
        if (this.state.detail === null)
            return <ProgressSpinner style={{ left: '47%' }}></ProgressSpinner>

        let detail = this.renderDetail(this.state.detail);

        let totalNot = 0;
        let totalDone = 0;

        totalNot = this.state.notDetail.length;
        totalDone = this.state.doneDetail.length;

        return (
            <>
                <div>
                    <Accordion activeIndex={0} multiple style={{ marginTop: '10px' }}>
                        <AccordionTab header={"Chưa làm khảo sát: " + totalNot}>
                            <div className="p-grid">
                                <div className="p-fluid" >
                                    <DataTable value={this.state.notDetail} responsiveLayout="scroll"
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 20]}
                                        style={{ fontSize: "13px" }}
                                        rowHover
                                        dataKey="RN"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    >
                                        <Column field="RN" header={this.props.language["no"] || "l_no"} style={{ width: '5%', textAlign: 'center' }}></Column>
                                        <Column field="SupCode" header={this.props.language["supcode"] || "l_supcode"} style={{ width: '15%', textAlign: 'center' }}></Column>
                                        <Column field="SupName" header={this.props.language["supname"] || "l_supname"} style={{ width: '20%', textAlign: 'center' }}></Column>
                                        <Column field="Position" header={this.props.language["position"] || "l_position"} style={{ width: '10%', textAlign: 'center' }}></Column>
                                        <Column field="EmployeeCode" header={this.props.language["employee_code"] || "l_employee_code"} style={{ width: '15%', textAlign: 'center' }}></Column>
                                        <Column field="EmployeeName" header={this.props.language["employee_name"] || "l_employee_name"} style={{ textAlign: 'center' }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={"Đã làm khảo sát: " + totalDone}>
                            <div className="p-grid">
                                <div className="p-fluid" >
                                    <DataTable value={this.state.doneDetail} responsiveLayout="scroll"
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 20]}
                                        style={{ fontSize: "13px" }}
                                        rowHover
                                        dataKey="RN"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    >
                                        <Column field="RN" header={this.props.language["no"] || "l_no"} style={{ width: '5%', textAlign: 'center' }}></Column>
                                        <Column field="SupCode" header={this.props.language["supcode"] || "l_supcode"} style={{ width: '15%', textAlign: 'center' }}></Column>
                                        <Column field="SupName" header={this.props.language["supname"] || "l_supname"} style={{ width: '20%', textAlign: 'center' }}></Column>
                                        <Column field="Position" header={this.props.language["position"] || "l_position"} style={{ width: '10%', textAlign: 'center' }}></Column>
                                        <Column field="EmployeeCode" header={this.props.language["employee_code"] || "l_employee_code"} style={{ width: '15%', textAlign: 'center' }}></Column>
                                        <Column field="EmployeeName" header={this.props.language["employee_name"] || "l_employee_name"} style={{ textAlign: 'center' }}></Column>
                                        <Column field="CreatedDate" header={this.props.language["created_date"] || "l_created_date"} style={{ width: '10%', textAlign: 'center' }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>

                <br />
                <div className="p-grid" key={this.props.dataInput.formId}>
                    {detail}
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        detail: state.spiralFormStatistical.detail,
        questionData: state.spiralFormStatistical.questionData
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormStatisticalController: bindActionCreators(CreateActionSpiralFormStatistical, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Detail);