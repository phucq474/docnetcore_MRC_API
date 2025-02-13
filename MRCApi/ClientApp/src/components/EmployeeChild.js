import React,{Component} from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
//React-redux
import {connect} from 'react-redux';

class EmployeeChild extends Component {
    constructor(props) {
        super();
        this.state = {
            dataInput: []
        };
        this.BindData = this.BindData.bind(this);
    }
    BindData() {
        this.setState({dataInput: this.props.dataEmployee});
    }
    componentDidMount() {
        this.BindData();
    }
    render() {

        return (
            <div className="carousel-demo">
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h3>{this.props.language["employee_detail"] || "l_employee_detail"}</h3>
                    </div>
                </div>

                <div className="content-section implementation">
                    <p>{this.state.dataInput.fullName} </p>
                </div>
            </div>
        );
    }
}
//export default connect(mapStateToProps, dispatch => bindActionCreators(getAttendant, dispatch))(KPIAttendant);
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(EmployeeChild);
