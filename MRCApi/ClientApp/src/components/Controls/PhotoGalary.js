
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Galleria } from 'primereact/galleria';
import { bindActionCreators } from 'redux';
import { PhotoCreateAction } from '../../store/PhotoController';
class PhotoGalary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            photos: []
        }
        this.handleBindData = this.handleBindData.bind(this);
    }
    componentDidMount() {
        this.handleBindData();
    }
    handleBindData() {
        const data = this.props.dataInput;
        this.props.PhotoController.GetPhotoByShop(data)
            .then(() => {
                if (!this.props.ReportId)
                    this.setState({ photos: this.props.list })
                else
                    this.setState({ photos: this.props.list.filter(item => item.reportId === this.props.ReportId) })
            });
    }
    itemTemplate(item) {
        return <img src={item.photoPath} alt={item.photoType} style={{ maxHeight: 350, display: 'block' }} />;
    }
    itemTemplateThumb(item) {
        return <img src={item.photoPath} alt={item.photoType} style={{ maxHeight: 80, display: 'block' }} />;
    }
    render() {
        return (
            <div className="p-fluid">
                <div style={{ height: 460 }} className="p-shadow-8">
                    <Galleria value={this.state.photos}
                        showItemNavigators
                        showItemNavigatorsOnHover
                        numVisible={5}
                        thumbnailsPosition="bottom"
                        caption={(e) => e.photoType}
                        item={this.itemTemplate}
                        thumbnail={this.itemTemplateThumb} />
                </div>
            </div>
        )
    }
}
PhotoGalary.defaultProps = {
    photoType: null
}
function mapstateToProps(state) {
    return {
        loading: state.photos.loading,
        errors: state.photos.errors,
        list: state.photos.photo,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        PhotoController: bindActionCreators(PhotoCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(PhotoGalary);