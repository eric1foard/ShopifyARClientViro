import React, { Component } from 'react';
import { View, Dimensions, PixelRatio } from 'react-native';
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
let initialRotation = 0;
let wallDist = 0;
let placementTimeout = null;

const getWindowDimension = dim => (Dimensions.get('window')[dim] * PixelRatio.get()) / 2;
const WINDOW_HEIGHT_CENTER = getWindowDimension('height');
const WINDOW_WIDTH_CENTER = getWindowDimension('width');

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

const getPlanePosition = hitTestResults => {
  if (!(hitTestResults && hitTestResults.length)) {
    return null;
  }
  const result = hitTestResults.find(htr => htr.type === 'ExistingPlaneUsingExtent'); 
  return result && result.transform && result.transform.position;
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
            onDrag={() => {}}
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
    this.ARScene.performARHitTestWithPoint(WINDOW_WIDTH_CENTER, WINDOW_HEIGHT_CENTER)
    .then(results => {
      const position = getPlanePosition(results);
      // console.warn('position ',  position);
      const nativeProps = {
        rotation: [rotation[0], rotation[1], 0], // gimbal lock
      };
      if (position) {
        nativeProps.position = position;
      }
      this.state.viroNode.setNativeProps(nativeProps);  
    })
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
    initialRotation = y;
    wallDist = position[2];
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);