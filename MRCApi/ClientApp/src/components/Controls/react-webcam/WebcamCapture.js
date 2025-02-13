import React, { Component } from "react";
import Webcam from "react-webcam";
import PropTypes from 'prop-types';
import { IoCameraReverseOutline, IoExitOutline, IoRefresh, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { FaCamera } from 'react-icons/fa';


class WebcamCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoConstraints: {
        width: 1280,
        height: 720,
        facingMode: "user"
      },
      isShowCam: true,

    }
    this.webcamRef = React.createRef();
    this.capture = this.capture.bind(this);
    this.closeCamera = this.closeCamera.bind(this);
    this.saveImage = this.saveImage.bind(this);

    // const handleDevices = React.useCallback(
    //   mediaDevices =>
    //     setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    //   [setDevices]
    // );

  }
  static propTypes = {
    questionId: PropTypes.number.isRequired,
  };
  capture = () => {
    const data = this.webcamRef.current.getScreenshot();
    this.setState({ imageSrc: data, isShowCam: false });
  };
  closeCamera() {
    this.props.parentMethod();
  }
  saveImage() {
    let data = {
      questionId: this.props.questionId,
      imageData: this.state.imageSrc
    }
    this.props.saveImage(data);
    this.props.parentMethod();
  }
  changeCamera = () => {
    let item = this.state.videoConstraints;
    if (this.state.videoConstraints.facingMode === "user")
      item.facingMode = "environment";
    else if (this.state.videoConstraints.facingMode === "environment")
      item.facingMode = "user";
    this.setState({ videoConstraints: item });
  }

  // React.useEffect(
  //   () => {
  //     navigator.mediaDevices.enumerateDevices().then(handleDevices);
  //   },
  //   [handleDevices]
  // );
  render() {
    return (
      <div style={{ position: "relative", textAlign: "center", height: '100%' }} >
        <div style={{ display: "-ms-inline-flexbox", position: "fixed", width: '100%', padding: '10px 15px', zIndex: 9999 }}>
          <IoCameraReverseOutline size={32} style={{ float: "left" }} onClick={this.changeCamera} />
          <IoExitOutline size={32} style={{ float: "right" }} onClick={this.closeCamera} />
        </div>
        {/* {devices.map((device, key) => ( */}
        <div>
          {this.state.isShowCam ?
            <Webcam
              audio={false}
              ref={this.webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              //videoConstraints={{ deviceId: device.deviceId }}
              width={'100%'}
              height={'100%'}
              videoConstraints={this.state.videoConstraints}
            /> : null}
          {this.state.imageSrc && (<img alt='imgPreview' src={this.state.imageSrc} />)}
          {/* {device.label || `Device ${key + 1}`} */}
        </div>
        {/* ))} */}
        <div style={{ display: "-ms-inline-flexbox", position: "fixed", width: '100%', bottom: 0, padding: '10px 15px', zIndex: 9999 }}>
          {!this.state.isShowCam ? <IoRefresh style={{ float: "left" }} size={32} onClick={() => this.setState({ isShowCam: true, imageSrc: undefined })} /> : null}
          {this.state.isShowCam ? <FaCamera style={{}} onClick={this.capture} size={35} /> : null}
          {!this.state.isShowCam ? <IoCheckmarkCircleOutline size={35} style={{ float: "right", color: 'royalblue' }} onClick={this.saveImage} /> : null}
        </div>
      </div>
    );
  }
};
WebcamCapture.defaultProps = {
  questionId: 0
}
export default WebcamCapture;