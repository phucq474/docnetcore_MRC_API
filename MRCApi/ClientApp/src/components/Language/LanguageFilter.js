
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from 'primereact/progressbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { AccountDropDownList } from '../Controls/AccountDropDownList';
class LanguageFilter extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { handleInput, handleSearch, handleInsertDisplay, isLoading, handleLink, importFile, clear, permission } = this.props
        const leftContents = (
            <React.Fragment>
                {permission.view === true && <Button style={{ marginRight: '10px' }} label={this.props.language["search"] || "l_search"} onClick={handleSearch} />}
                {permission.export === true && <Button icon="pi-file-excel" className="p-button-danger" label={this.props.language["export"] || "l_export"} onClick={handleLink} />}
            </React.Fragment>)
        const rightContents = (
            <React.Fragment>
                {permission.create === true && <Button style={{ marginRight: '10px' }} icon="pi pi-plus" label={this.props.language["insert"] || "l_insert"} className="p-button-info" onClick={() => handleInsertDisplay('true')} />}
                {permission.import === true && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={clear} name="name[]" mode="basic" uploadHandler={importFile} customUpload={true} accept=".xlsx,.xls" maxFileSize={1000000} />}
                {permission.import === true &&
                    <Button icon="pi pi-times" style={{ marginLeft: 10 }} className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                        clear.current.fileInput = { "value": '' };
                        clear.current.clear()
                    }} />}
            </React.Fragment>)
        return (
            <Accordion activeIndex={0}>
                <AccordionTab header={this.props.language["search"] || "l_search"}>
                    <div className="p-fluid p-formgrid p-grid">
                        <AccountDropDownList
                            id="accId"
                            className='p-field p-col-12 p-md-2'
                            onChange={this.props.handleChangeDropdown}
                            filter={true}
                            showClear={true}
                            value={this.props.accId} />
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="basic">{this.props.language["keywords"] || "l_keywords"}</label>
                            <InputText id='searchEnglish' placeholder="Select Your Keywords" onChange={e => handleInput(e.target.value, '', e.target.id)} />
                        </div>
                    </div>
                    <Toolbar left={leftContents} right={rightContents} />
                    {isLoading && (<ProgressBar mode="indeterminate" style={{ height: '10px' }}></ProgressBar>)}
                </AccordionTab>
            </Accordion>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {

}
export default connect(mapStateToProps, mapDispatchToProps)(LanguageFilter);