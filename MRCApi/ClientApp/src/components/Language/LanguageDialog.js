import React, { Component } from 'react';
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';

class LanguageDialog extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        const { header, footerAction, inputValues, statename, handleInput, displayDialog, displayOnHide } = this.props
        return (
            <Dialog header={header} visible={displayDialog} style={{ width: '50vw' }} footer={footerAction('displayBasics')} onHide={() => displayOnHide('false')}>
                <div className="p-grid p-align-start vertical-container">
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="basic">{this.props.language["resource_name"] || "l_resource_name"}</label>
                        < InputText id='resourceName' value={inputValues.resourceName || ''} onChange={(e) => handleInput(e.target.value, statename, e.target.id)}
                            disabled={header === 'Edit Language' ? true : false} />
                        <small className="p-invalid p-d-block">{inputValues.errorResourceName || ''}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="basic">{this.props.language["vietnam"] || "l_vietnam"}</label>
                        <InputText id='vietNam' value={inputValues.vietNam || ''} onChange={(e) => handleInput(e.target.value, statename, e.target.id)} />
                        <small className="p-invalid p-d-block">{inputValues.errorVietNam || ''}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="basic">{this.props.language["english"] || "l_english"}</label>
                        <InputText id='english' value={inputValues.english || ''} onChange={(e) => handleInput(e.target.value, statename, e.target.id)} />
                        <small className="p-invalid p-d-block">{inputValues.errorEnglish || ''}</small>
                    </div>
                </div>
            </Dialog >
        )
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(LanguageDialog);