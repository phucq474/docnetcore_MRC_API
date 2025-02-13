import React, { PureComponent } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
export default class LightboxExample extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: true,
    };
  }
  render() {
    // let images = [...this.props.dataInput];
    let images = JSON.parse(localStorage.getItem("Images"));
    let result = null;
    const { photoIndex, isOpen } = this.state;
    if (images.length > 0)
      result = (
        <div>
          <Lightbox
            mainSrc={
              "https://aqua.spiral.com.vn/" + images[photoIndex].photoPath
            }
            nextSrc={images[(photoIndex + 1) % images.length].photoPath}
            prevSrc={
              images[(photoIndex + images.length - 1) % images.length].photoPath
            }
            imageTitle={
              images[photoIndex].photoType +
              "   (" +
              (this.state.photoIndex + 1) +
              "/" +
              images.length +
              ")"
            }
            //onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        </div>
      );
    return <div style={{ background: "white" }}>{result}</div>;
  }
}
