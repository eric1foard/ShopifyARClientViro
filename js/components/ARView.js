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
  ViroBox
} from 'react-viro';
import InstructionCard from './InstructionCard';
import { foundAnchor } from '../actions';

const MIN_PLANE_DIMENSION = 0.05;
const ROTATION_START = 1, ROTATION_END = 3;
let currRotation = 0;
let currPos = [0, 0, 0];

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
      viroNode: null,
      ViroARSceneNavigator: null
    }

    this.renderScene = this.renderScene.bind(this);
    this.renderEmptyScene = this.renderEmptyScene.bind(this);
    this.handleAnchorFound = this.handleAnchorFound.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { showARScene } = nextProps.meta;
    if (showARScene) {
      this.ViroARSceneNavigator.replace({ scene: this.renderScene });
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
      meta: { showPointClound, anchorPt, showImage }
    } = this.props;

    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
        displayPointCloud={showPointClound && pointCloudOpts}
        anchorDetectionTypes={'PlanesHorizontal'}
        onRotate={this.handleRotate}
      >
        <ViroARPlane
          minHeight={MIN_PLANE_DIMENSION}
          minWidth={MIN_PLANE_DIMENSION}
          alignment={'Horizontal'}
          onAnchorFound={this.handleAnchorFound}>
          <ViroBox
            ref={c => this.state.viroNode = c}
            onDrag={pos => { currPos = pos; }}
            dragType='FixedToPlane'
            dragPlane={{
              planePoint: anchorPt,
              planeNormal: [0, 1, 0],
              maxDistance: 5
            }}
            height={0.01}
            length={0.01}
            width={5}
            visible={!showImage}
          />
          {showImage && <ViroImage
            onDrag={() => {}}
            dragType='FixedToPlane'
            dragPlane={{
              planePoint: currPos,
              planeNormal: [0, 0, 1],
              maxDistance: 5
            }}
            source={{ uri: image }}
            height={heightFormatted}
            width={widthFormatted}
            position={[0, 1.5, 0]}
            rotation={[0, currRotation, 0]}
            visible={showImage}
          />}
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
        currRotation += rotationFactor/20;
        this.state.viroNode.setNativeProps({
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
  const actions = { foundAnchor };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ARView);