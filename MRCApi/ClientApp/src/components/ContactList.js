import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {actionCreators} from '../store/Contact';

class ContactList extends Component {

    constructor() {
        super();
        this.state = {};
        this.onContactSelect = this.onContactSelect.bind(this);
        this.dialogHide = this.dialogHide.bind(this);
        this.addNew = this.addNew.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.pageId = 0
    }
    componentDidMount() {
        this.fetchData();
        let permission = JSON.parse(sessionStorage.getItem("permission"))
        this.setState({permission: permission[this.pageId]})
    }
    componentDidUpdate() {
        // This method is called when the route parameters change
        if(this.props.forceReload) {
            this.fetchData();
        }
    }

    fetchData() {
        this.props.requestContacts();
    }

    updateProperty(property,value) {
        let contact = this.state.contact;
        contact[property] = value;
        this.setState({contact: contact});
    }

    onContactSelect(e) {
        this.newContact = false;
        this.setState({
            displayDialog: true,
            contact: Object.assign({},e.data)
        });
    }

    dialogHide() {
        this.setState({displayDialog: false});
    }

    addNew() {
        this.newContact = true;
        this.setState({
            contact: {firstName: 'Oeky1',lastName: 'na ma',email: '@nma.com',phone: '11'},
            displayDialog: true
        });
    }

    save() {
        this.props.saveContact(this.state.contact);
        this.dialogHide();
        this.growl.show({severity: 'success',detail: this.newContact ? `${this.props.language["data_saved_successfully"] || "l_data_saved_successfully"}` : `${this.props.language["data_updated_successfully"] || "l_data_updated_successfully"}`});
    }

    delete() {
        this.props.deleteContact(this.state.contact.contactId);
        this.dialogHide();
        this.growl.show({severity: 'error',detail: `${this.props.language["data_deleted_successfully"] || "l_data_deleted_successfully"}`});
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight: '1.87em'}}>{this.props.language["crud_for_contact"] || "l_crud_for_contact"}</div>;
        let footer = <div className="p-clearfix" style={{width: '100%'}}>
            {this.state.permission !== undefined && <Button style={{float: 'left'}} label={this.props.language["add"] || "l_add"} icon="pi pi-plus" onClick={this.addNew} />}
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label={this.props.language["close"] || "l_close"} icon="pi pi-times" onClick={this.dialogHide} />
            <Button label={this.props.language["delete"] || "l_delete"} disabled={this.newContact ? true : false} icon="pi pi-times" onClick={this.delete} />
            <Button label={this.newContact ? `${this.props.language["save"] || "l_save"}` : `${this.props.language["update"] || "l_update"}`} icon="pi pi-check" onClick={this.save} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <DataTable value={this.state.contact}
                    selectionMode="single" header={header}
                    footer={footer} selection={this.state.selectedContact}
                    onSelectionChange={e => this.setState({selectedContact: e.value})}
                    onRowSelect={this.onContactSelect}>
                    <Column field="contactId" header="ID" />
                    <Column field="firstName" header={this.props.language["first_name"] || "l_first_name"} />
                    <Column field="lastName" header={this.props.language["last_name"] || "l_last_name"} />
                    <Column field="email" header={this.props.language["email"] || "l_email"} />
                    <Column field="phone" header={this.props.language["phone"] || "l_phone"} />
                </DataTable>
                <Dialog visible={this.state.displayDialog} style={{'width': '380px'}} header="Contact Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                    {
                        this.state.contact &&

                        <div className="p-grid p-fluid">

                            <div><label htmlFor="firstName">{this.props.language["first_name"] || "l_first_name"}</label></div>
                            <div>
                                <InputText id="firstName" onChange={(e) => {this.updateProperty('firstName',e.target.value)}} value={this.state.contact.firstName} />
                            </div>

                            <div style={{paddingTop: '10px'}}><label htmlFor="lastName">{this.props.language["last_name"] || "l_last_name"}</label></div>
                            <div>
                                <InputText id="lastName" onChange={(e) => {this.updateProperty('lastName',e.target.value)}} value={this.state.contact.lastName} />
                            </div>

                            <div style={{paddingTop: '10px'}}><label htmlFor="lastName">{this.props.language["email"] || "l_email"}</label></div>
                            <div>
                                <InputText id="email" onChange={(e) => {this.updateProperty('email',e.target.value)}} value={this.state.contact.email} />
                            </div>

                            <div style={{paddingTop: '10px'}}><label htmlFor="lastName">{this.props.language["phone"] || "l_phone"}</label></div>
                            <div>
                                <InputText id="phone" onChange={(e) => {this.updateProperty('phone',e.target.value)}} value={this.state.contact.phone} />
                            </div>
                        </div>
                    }
                </Dialog>
            </div>
        )
    }
}
// Make contacts array available in  props
function mapStateToProps(state) {
    return {
        contacts: state.contacts.contacts,
        loading: state.contacts.loading,
        errors: state.contacts.errors,
        forceReload: state.contacts.forceReload,
        language: state.languageList.language
    }
}

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(actionCreators,dispatch)
)(ContactList);