import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomerCreateAction } from '../../store/CustomerController';

class NewCustomertDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details: []
        }
    }

    async componentDidMount() {
        await this.setState({
            loading: true,
            details: []
        })
        const data = this.props.dataInput;
        await this.props.CustomerController.NewCustomer_Detail(data.id)
        const result = await this.props.newCustomer_Detail
        if(result.status === 200){
            await this.setState({
                details: result.data
            })
        }else{
            await this.setState({
                details: []
            })
        }
        await this.setState({
            loading: false
        })
    }
    render() {
        return (
            <div className="p-fluid" style={{ height: "80%" }}>
                {this.state.loading && <ProgressSpinner style={{ left: "47%", top: '45%', width: '50px', height: '50px' }} strokeWidth="5" fill="#EEEEEE" animationDuration=".5s" />}
                {this.state.details.length > 0 &&
                    <DataTable className="p-datatable-striped"
                        scrollable
                        value={this.state.details} scrollHeight="400px"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                    >
                        <Column header="No." field="rowNum" style={{ width: "3%", textAlign: 'center' }} />
                        <Column filter field="shopCode" header={this.props.language["shop_code"] || "l_shop_code"}  style={{ width: "6%", textAlign: 'center' }} />
                        <Column filter field="shopName" header={this.props.language["shop_name"] || "l_shop_name"}  style={{ width: "10%" }} />
                        <Column filter field="custName" header={this.props.language["customer_name"] || "l_customer_name"}  style={{ width: "10%" }} />
                        <Column filter field="brand" header={this.props.language["brand"] || "l_brand"}  style={{ width: "5%", textAlign: 'center' }} />
                        <Column filter field="mobile" header={this.props.language["mobile"] || "l_mobile"}  style={{ width: "5%" }} />
                        <Column filter field="address" header={this.props.language["address"] || "l_address"}  style={{ width: "20%" }} />
                        {/* <Column filter field="town" header={this.props.language["town"] || "l_town"}  style={{ width: "8%" }} />
                        <Column filter field="distict" header={this.props.language["distict"] || "l_distict"}  style={{ width: "8%" }} />
                        <Column filter field="province" header={this.props.language["province"] || "l_province"}  style={{ width: "8%" }} /> */}
                    </DataTable>
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        newCustomer_Detail: state.customer.newCustomer_Detail
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CustomerController: bindActionCreators(CustomerCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewCustomertDetail);