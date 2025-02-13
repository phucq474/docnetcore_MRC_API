
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PhotoCreateAction } from '../../store/PhotoController';
import PropTypes from 'prop-types';
import {
    LightgalleryProvider,
    LightgalleryItem,
    withLightgallery,
    useLightgallery,

} from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

const PhotoItem = ({ image, thumb, group }) => (
    <div style={{ padding: "5px", display: 'flex' }}>
        <LightgalleryItem group={group} src={image} thumb={thumb}>
            <img alt={image} src={image} style={{ height: '100px' }} />
        </LightgalleryItem>
    </div>
);
PhotoItem.propTypes = {
    image: PropTypes.string.isRequired,
    thumb: PropTypes.string,
    group: PropTypes.string.isRequired
};

class LightGalary extends PureComponent {
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
                if (this.props.list.length > 0) {
                    if (this.props.photoType === null)
                        this.setState({ photos: this.props.list })
                    else
                        this.setState({ photos: this.props.list.filter(item => item.photoType === this.props.photoType) })
                }
            });
    }
    render() {
        return (
            <div className="p-fluid">
                <LightgalleryProvider  >
                    <div className='p-grid'
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        {this.state.photos.map((p, idx) => (
                            <PhotoItem key={idx} image={p.photoPath} thumb={p.photoPath} />
                        ))}
                    </div>
                </LightgalleryProvider>
            </div>
        )
    }
}
LightGalary.defaultProps = {
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
export default connect(mapstateToProps, mapDispatchToProps)(LightGalary);