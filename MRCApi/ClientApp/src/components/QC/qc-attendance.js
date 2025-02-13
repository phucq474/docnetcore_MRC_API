import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreatorsQC } from '../../store/QCController.js';
import { ProgressSpinner } from 'primereact/progressspinner';
import QCStatus from './qc-status.js'
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

class QCAttendance extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            activeIndex: 0,
            loading: false,
            details: []
        }
    }
    componentDidMount() {
        let data = {
            shopId: this.props.dataInput.shopId,
            employeeId: this.props.dataInput.employeeId,
            workDate: this.props.dataInput.workDate,
            qcId: this.props.dataInput.qcId,
            kpiId: 1
        }
        this.props.QCController.GetByKPI(data)
            .then(() => {
                const result = this.props.qcKPI
                if (result && result.length > 0) {
                    this.setState({ details: result })
                }
            });
    }
    handleImage = (image, event) => {
        let index = image.findIndex(e => e.photo === event.target.currentSrc)
        this.setState({ itemImage: image, isOpen: true, indexActive: index })
    }
    render() {
        const result = this.state.details;
        let detail = []
        // if (result.length === 0)
        //     return (
        //         <ProgressSpinner key={'loading'} style={{ left: '45%', top: 10 }} />
        //     );
        result.forEach(element => {
            detail.push(
                <div className="p-lg-3" style={{ textAlign: 'center' }}>
                    <div >
                        <label>Time: </label> <strong>{element.photoTime}</strong> <br></br>
                        <label>Distance: </label> <strong style={{ color: element.distance > 200 ? 'red' : '' }} >{element.distance} (m)</strong>
                    </div>
                    <img src={element.photo} alt="Check In" height={350} onClick={(e) => this.handleImage(result, e)} />
                    <div>
                        <strong style={{ color: 'red' }}>{element.note}</strong>
                    </div>
                </div>
            )
        });
        return (
            <>
                <div className="p-grid p-justify-center" >
                    {detail}
                </div>
                <QCStatus dataInput={this.props.dataInput} pageId={this.props.pageId} dataItems={result}></QCStatus>
                {this.state.isOpen &&
                    <Lightbox
                        images={result}
                        onClose={() => this.setState({ isOpen: false })}
                        startIndex={this.state.indexActive}
                        title="Image Title" />}
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        qcKPI: state.qc.qcKPI,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        QCController: bindActionCreators(actionCreatorsQC, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QCAttendance);