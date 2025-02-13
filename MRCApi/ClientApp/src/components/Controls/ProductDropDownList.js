import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ProductCreateAction } from '../../store/ProductController';

class ProductDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const productCates = [...this.props.productCates];
        if (productCates.length === 0)
            this.props.ProductController.GetProductCate();
    }
    render() {
        const productCates = [...this.props.productCates];
        let result = [];
        if (productCates.length > 0) {
            // if (this.props.categoryId > 0) {
            //     productCates.forEach(element => {
            //         if (element.categoryId === this.props.categoryId)
            //             result.push({ name: element.productCode + ' - ' + element.productName, value: element.id });
            //     });
            // }
            if (this.props.brandId > 0) {
                if (result && result.length > 0)
                    result.forEach(element => {
                        if (element.brandId === this.props.brandId)
                            result.push({ name: element.productCode + ' - ' + element.productName, value: element.id });
                    })
                else
                    productCates.forEach(element => {
                        if (element.brandId === this.props.brandId)
                            result.push({ name: element.productCode + ' - ' + element.productName, value: element.id });
                    });
            } else if (this.props.divisionId > 0) {
                productCates.forEach(element => {
                    if (element.divisionId === this.props.divisionId)
                        result.push({ name: element.productCode + ' - ' + element.productName, value: element.id });
                });
            } else {
                productCates.forEach(element => {
                    result.push({ name: element.productCode + ' - ' + element.productName, value: element.id });
                });
            }
        }
        return (
            <Dropdown
                key={result.id}
                style={{ width: '100%' }}
                options={result}
                onChange={this.handleChange}
                value={this.props.value}
                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                optionLabel="name"
                filter={true}
                filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                filterBy="name"
                showClear={true}
                disabled={this.props.disabled}
            />

        );
    }
}
ProductDropDownList.defaultProps = {
    brand: 0,
    division: '',
    categoryId: 0,
    subCateId: 0,
    segmentId: 0
}
function mapStateToProps(state) {
    return {
        productCates: state.products.productCates,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductDropDownList);