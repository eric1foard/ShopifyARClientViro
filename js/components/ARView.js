import { API_KEY } from '../../env.js';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlane,
  ViroImage,
  ViroBox,
  ViroNode
} from 'react-viro';
import InstructionCard from './InstructionCard';
import { foundAnchor, setPlanePoint } from '../actions';

const INITAL_IMAGE_HEIGHT = 1.5;
const MIN_PLANE_DIMENSION = 0.05;
const ROTATION_START = 1, ROTATION_END = 3;
let currRotation = 0;

// TODO: this will not be needed when store dimensions in meters
const formatDimension = dim => {
  const INCH_TO_METER = 0.0254; // inches => meters
  return dim * INCH_TO_METER;
};

const pointCloudOpts = {
  imageSource: require('../res/pointCloudPoint.png'),
  imageScale: [.01, .01, .01],
  maxPoints: 100
};

// using component state for this component rather than redux state
// because I encountered an odd bug with react-viro where the node
// jumps about 1 meter into the air. Also, the state for this component
// should not be needed externally, so should be fine
class ARView extends Component {
  static navigationOptions = {
    headerTransparent: true
  };

  constructor(props) {
    super(props);
    // these are refs and I don't think redux should need to know about them
    this.state = {
      viroBox: null,
      viroImage: null,
      ViroARSceneNavigator: null
    }

    this.renderScene = this.renderScene.bind(this);
    this.renderEmptyScene = this.renderEmptyScene.bind(this);
    this.handleAnchorFound = this.handleAnchorFound.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleCameraTransformUpdate = this.handleCameraTransformUpdate.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { showARScene, showImage } = this.props.meta;
    if (showARScene) {
      this.ViroARSceneNavigator.replace({ scene: this.renderScene });
    }
    if (showImage && !prevProps.meta.showImage) {
      this.state.viroBox.getTransformAsync()
        .then(({ rotation, position }) => {
          this.props.setPlanePoint({
            planePoint: position,
            planeRotation: rotation
          });
        });
    }
  }

  // TODO: support andriod Icon name
  render() {
    return (
      <View style={localStyles.outer}>
        <ViroARSceneNavigator
          ref={c => { this.ViroARSceneNavigator = c }}
          style={localStyles.arView}
          apiKey={API_KEY}
          initialScene={{ scene: this.renderEmptyScene }}
        />
        <InstructionCard />
      </View>
    );
  }

  renderEmptyScene() {
    return <ViroARScene />
  }

  renderScene() {
    const {
      product: { height, width, image },
      meta: { showPointClound, anchorPt, showImage, planePoint, planePointFound }
    } = this.props;

    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
        displayPointCloud={showPointClound && pointCloudOpts}
        anchorDetectionTypes={'PlanesHorizontal'}
        onRotate={this.handleRotate}
        onCameraTransformUpdate={(planePointFound || null) && this.handleCameraTransformUpdate}
      >
        <ViroARPlane
          minHeight={MIN_PLANE_DIMENSION}
          minWidth={MIN_PLANE_DIMENSION}
          alignment={'Horizontal'}
          onAnchorFound={this.handleAnchorFound}>
          <ViroNode
            ref={c => this.state.viroBox = c}
            onDrag={pos => { currPos = pos; }}
            dragType='FixedToPlane'
            dragPlane={{
              planePoint: anchorPt,
              planeNormal: [0, 1, 0],
              maxDistance: 5
            }}
          // position={planePoint}
          >
            <ViroBox
              height={0.01}
              length={0.01}
              width={widthFormatted}
              visible={!showImage}
            />
            <ViroImage
              ref={c => this.state.viroImage = c}
              source={{ uri: image }}
              height={heightFormatted}
              width={widthFormatted}
              position={[0, INITAL_IMAGE_HEIGHT, 0]}
              visible={showImage}
            />
          </ViroNode>
        </ViroARPlane>
      </ViroARScene>
    );
  }


  handleRotate(rotateState, rotationFactor) {
    switch (rotateState) {
      case ROTATION_START:
        break;
      case ROTATION_END:
        break;
      default: // otherwise, rotation in progress
        currRotation += rotationFactor / 20;
        this.state.viroBox.setNativeProps({
          rotation: [0, currRotation, 0]
        });
        break;
    }
  }

  handleAnchorFound({ position, rotation }) {
    currRotation = rotation[1];
    this.props.foundAnchor({
      anchorPt: position, // TODO: will this work, or needs to come from state?
    });
  }

  handleCameraTransformUpdate({ cameraTransform: { forward } }) {
    const { viroImage } = this.state;
    viroImage.getTransformAsync().then(({ position }) => {
      viroImage.setNativeProps({
        position: [0, -1 * forward[1] * position[2] + INITAL_IMAGE_HEIGHT, 0]
      })
    })
  }
}

var localStyles = StyleSheet.create({
  outer: {
    flex: 1
  },
  arView: {
    flex: 1
  }
});

const mapStateToProps = ({ selectedProduct, ARMeta }) => ({
  product: selectedProduct,
  meta: ARMeta
});

const mapDispatchToProps = dispatch => {
  const actions = { foundAnchor, setPlanePoint };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ARView);