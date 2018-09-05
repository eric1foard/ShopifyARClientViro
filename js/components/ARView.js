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
      ARScene: null,
      showImage: false
    }

    this.renderScene = this.renderScene.bind(this);
    this.handleAnchorFound = this.handleAnchorFound.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleCameraTransform = this.handleCameraTransform.bind(this);
  }

  render() {
    return (
      // <View>
      <ViroARSceneNavigator
        apiKey={API_KEY}
        initialScene={{ scene: this.renderScene }}
      />
      // </View>
    );
  }

  renderScene() {
    // setTimeout(() => { this.setState({ showImage: true }) }, 15000)
    const { height, width, image } = this.props.product;
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
        ref={c => this.ARScene = c}
        displayPointCloud={this.state.showPointClound && pointCloudOpts}
        anchorDetectionTypes={'PlanesHorizontal'}
        onCameraTransformUpdate={this.handleCameraTransform}
      >
        <ViroARPlane
          minHeight={MIN_PLANE_DIMENSION}
          minWidth={MIN_PLANE_DIMENSION}
          alignment={'Horizontal'}
          onAnchorFound={this.handleAnchorFound}>
          <ViroNode
            ref={c => this.state.viroNode = c}
            onDrag={() => { }}
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

  handleCameraTransform({ cameraTransform: { rotation, position, forward } }) {
    // this.ARScene.getCameraOrientationAsync().then(res => console.warn('camera ', res));
    // console.warn('camera angle ', rotation[0], ' camera height ', position[1]);
    // const z = forward[2] * ((this.anchorPt[1] * -1) / Math.sin(90 - rotation[0])) // law of sines
    this.state.viroNode.setNativeProps({
      rotation: [rotation[0], rotation[1], 0], // gimbal lock
      position: [position[0], position[1], position[2]-1]
    });
  }

  handleDrag(pos) {
    if (placementTimeout) {
      clearTimeout(placementTimeout);
    }
    placementTimeout = setTimeout(() => { this.setState({ showImage: true }) }, 250);
  }

  handleAnchorFound({ position }) {
    console.warn('position ', position);
    this.setState({
      anchorPt: position,
      showPointClound: false
    });
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);