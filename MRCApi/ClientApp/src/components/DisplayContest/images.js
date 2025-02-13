import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import Lightbox from "react-image-lightbox";
import { actionCreatorsDisplayContestResult } from "../../store/DisplayContestResultsController";

class Images extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      photoItems: [],
      isOpen: false,
      indexSlider: 1,
      activeIndex: 0,
    };
    this._child = React.createRef();
  }
  handleBindData(data) {
    this.props.DisplayContestResultController.GetPhotos({
      shopId: data.shopId,
      workDate: data.workDate,
    }).then(() => {
      const result = this.props.displayPhotos;
      if (result && result.length > 0) {
        this.setState({ photoItems: result });
      }
    });
  }
  componentDidMount() {
    this.handleBindData(this.props.dataInput);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataInput !== this.props.dataInput) {
      this.handleBindData(nextProps.dataInput);
    }
  }
  handleViewImage = async (item) => {
    // let photos = [];
    // let photoTitle = [];
    // if (this.state.photoItems) {
    //   for (let i = 0; i < this.state.photoItems.length; i++) {
    //     photos.push(this.state.photoItems[i].photoPath);
    //     photoTitle.push(this.state.photoItems[i].photoType);
    //   }
    //   await this.setState({ photoItems: photos, photoTitle: photoTitle });
    // }
    // let index = this.state.photoItems.indexOf(item.photoPath);
    await this.setState({
      isOpen: true,
      photoIndex: this._child.current.getCurrentIndex(),
    });
  };
  itemTemplate(item) {
    this.setState({ itemPhotoGallery: item });
    return (
      <img
        src={item ? item.photoPath : ""}
        alt={item ? item.photoType : ""}
        style={{ maxHeight: 432, display: "block", minHeight: 431 }}
      />
    );
  }
  itemTemplateThumb(item) {
    return (
      <img
        src={item ? item.photoPath : ""}
        alt={item ? item.photoType : ""}
        style={{ maxHeight: 88, display: "block" }}
      />
    );
  }
  changeImage(index) {
    this.setState({ indexSlider: index });
  }
  onItemChange = (event) => {
    this.setState({ activeIndex: event.index });
  };
  footer = () => {
    const activeIndex =
      "(" +
      (this.state.activeIndex + 1) +
      "/" +
      this.state.photoItems.length +
      ")" +
      "  ";
    return activeIndex;
  };
  render() {
    const array = this.state.photoItems.filter(
      (i) =>
        i.photoType === this.props.brand ||
        this.props.brand === null ||
        this.props.brand === undefined
    );
    let items = [],
      images = [];
    if (array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        let element = {
          original: array[index].photoPath,
          thumbnail: array[index].photoPath,
          originalAlt: array[index].photoType,
          description: array[index].photoType,
        };
        items.push(element);
      }
    }
    if (items) {
      images.push(
        <ImageGallery
          height={480}
          ref={this._child}
          showIndex={true}
          showPlayButton={false}
          showFullscreenButton={false}
          items={items}
          startIndex={this.state.indexSlider - 1}
        />
      );
      //   images.push(
      //     <div style={{ textAlign: "center" }}>
      //       <label>
      //         {this.state.indexSlider}/{items.length}
      //       </label>
      //        <div className="p-d-flex p-jc-center">
      //         <div style={{ width: items.length * 15, maxWidth: "100%" }}>
      //           <Slider
      //             min={1}
      //             max={items.length}
      //             value={this.state.indexSlider}
      //             onChange={(e) => this.changeImage(e.value)}
      //           />
      //         </div>
      //       </div>
      //     </div>
      //   );
    }
    return (
      <div style={{ margin: "10px 0px 0px 10px" }}>
        <div style={{ height: 450 }}>
          <div
            style={{
              float: "right",
              right: 100,
              position: "absolute",
              zIndex: 2,
            }}
          >
            <Button
              style={{ marginRight: 10 }}
              className="p-button-info p-button-outlined"
              icon="pi pi-window-maximize"
              onClick={() => this.handleViewImage(array)}
            />
          </div>
          {images}
          {this.state.isOpen && (
            <Lightbox
              mainSrc={this.state.photoItems[this.state.photoIndex].photoPath}
              imageTitle={
                this.state.photoItems[this.state.photoIndex].photoType
              }
              nextSrc={
                this.state.photoItems[
                  (this.state.photoIndex + 1) % this.state.photoItems.length
                ].photoPath
              }
              prevSrc={
                this.state.photoItems[
                  (this.state.photoIndex + this.state.photoItems.length - 1) %
                    this.state.photoItems.length
                ].photoPath
              }
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex:
                    (this.state.photoIndex + this.state.photoItems.length - 1) %
                    this.state.photoItems.length,
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex:
                    (this.state.photoIndex + 1) % this.state.photoItems.length,
                })
              }
            />
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    displayPhotos: state.displayContestResult.displayPhotos,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    DisplayContestResultController: bindActionCreators(
      actionCreatorsDisplayContestResult,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Images);
