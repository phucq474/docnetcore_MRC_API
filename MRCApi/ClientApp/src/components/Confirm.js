import React from 'react';
import {Button} from 'primereact/button';
import { connect } from 'react-redux';
const Confirm=(parent,textAlert,callbackYes)=>{
    parent.toast.show({severity: 'warn', sticky: true, content: (
        <div className="p-flex p-flex-column" style={{flex: '1'}}>
            <div className="p-text-center">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                <h4>{textAlert}</h4>
            </div>
            <div className="p-grid p-fluid">
                <div className="p-col-6">
                    <Button onClick={()=>callbackYes()} type="button" label={this.props.language["yes"] || "l_yes"} className="p-button-success" />
                </div>
                <div className="p-col-6">
                    <Button onClick={()=>parent.toast.clear()} type="button" label={this.props.language["no"] || "l_no"} className="p-button-secondary" />
                </div>
            </div>
        </div>
    ) });
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Confirm);