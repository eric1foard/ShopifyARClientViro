import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlane,
  ViroImage,
  ViroBox,
  ViroNode
} from 'react-viro';
import { API_KEY } from '../../env.js';

const MIN_PLANE_DIMENSION = 0.05;
const ROTATION_START = 1, ROTATION_END = 3;
let currRotation = 0;
let wallDist = 0;
let placementTimeout = null;

// TODO: this will not be needed when store dimensions in meters
const formatDimension = dim => {
  const INCH_TO_METER = 0.0254; // inches => meters
  return dim * INCH_TO_METER;
};

const pointCloudOpts = {
  imageSource: require("../res/pointCloudPoint.png"),
  imageScale: [.02, .02, .02],
  maxPoints: 100
};

class ARView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorPt: [0, 0, 0],
      showPointClound: true,
      viroNode: null,
      showImage: false
    }

    this.renderScene = this.renderScene.bind(this);
    this.handleAnchorFound = this.handleAnchorFound.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleCameraTransform = this.handleCameraTransform.bind(this);
  }

  render() {
    return (
      <ViroARSceneNavigator
        apiKey={API_KEY}
        initialScene={{ scene: this.renderScene }}
      />
    );
  }

  renderScene() {
    // setTimeout(() => { this.setState({ showImage: true }) }, 15000)
    const { height, width, image } = this.props.product;
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
        displayPointCloud={this.state.showPointClound && pointCloudOpts}
        anchorDetectionTypes={'PlanesHorizontal'}
        handleCameraTransform={this.handleCameraTransform}
      >
        <ViroARPlane
          minHeight={MIN_PLANE_DIMENSION}
          minWidth={MIN_PLANE_DIMENSION}
          alignment={'Horizontal'}
          onAnchorFound={this.handleAnchorFound}>
          <ViroNode
            ref={c => this.state.viroNode = c}
            onDrag={this.handleDrag}
            dragType='FixedToPlane'
            dragPlane={{
              planePoint: this.state.anchorPt,
              planeNormal: [0, 1, 0],
              maxDistance: 5
            }}>
            <ViroBox
              height={0.01}
              length={0.01}
              width={5}
              visible={!this.state.showImage}
            />
            <ViroImage
              source={{ uri: image }}
              height={heightFormatted}
              width={widthFormatted}
              position={[0, 1.5, 0]}
              visible={this.state.showImage}
            />
          </ViroNode>
        </ViroARPlane>
      </ViroARScene>
    );
  }

  handleCameraTransform({ cameraTransform: { rotation } }) {
    console.warn('calling handleCameraTransform');
    const rot = currRotation + rotation[2];
    currRotation = rot;
    // const dist = wallDist + (rotation[0] > lastX ? 0.1 : (rotation[0] < lastX ? -0.1 : 0))
    this.state.viroNode.setNativeProps({
      // position: [0, 0, dist],
      rotation: [0, rot, 0]
    });
  }

  handleDrag(pos) {
    wallDist = pos[2];
    if (placementTimeout) {
      clearTimeout(placementTimeout);
    }
    placementTimeout = setTimeout(() => { this.setState({ showImage: true }) }, 250);
  }

  handleAnchorFound({ position, rotation }) {
    this.setState({
      anchorPt: position,
      showPointClound: false
    });
    let y = rotation[1];
    currRotation = y;
    wallDist = position[2];
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);