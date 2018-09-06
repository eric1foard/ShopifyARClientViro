import { API_KEY } from '../../env.js';
import React, { Component } from 'react';
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

const MIN_PLANE_DIMENSION = 0.05;
const ROTATION_START = 1, ROTATION_END = 3;
let currRotation = null;
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
    this.state = {
      anchorPt: [0, 0, 0],
      showPointClound: true,
      viroNode: null,
      showImage: false
    }

    this.renderScene = this.renderScene.bind(this);
    this.handleAnchorFound = this.handleAnchorFound.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  render() {
    return (
      <View style={localStyles.outer}>
        <ViroARSceneNavigator
          style={localStyles.arView}
          apiKey={API_KEY}
          initialScene={{ scene: this.renderScene }}
        />
        {<InstructionCard />}
        {/* <View style={localStyles.InstructionCard}>
          <Text>wow!</Text>
        </View> */}
      </View>
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
        onRotate={this.handleRotate}
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

  handleDrag(pos) {
    if (placementTimeout) {
      clearTimeout(placementTimeout);
    }
    placementTimeout = setTimeout(() => { this.setState({ showImage: true }) }, 250);
  }

  handleRotate(rotateState, rotationFactor) {
    switch (rotateState) {
      case ROTATION_START:
        break;
      case ROTATION_END:
        break;
      default: // otherwise, rotation in progress
        this.state.viroNode.setNativeProps({
          rotation: [currRotation[0], currRotation[1] + rotationFactor, currRotation[2]]
        });
        break;
    }
  }

  handleAnchorFound({ position, rotation }) {
    this.setState({
      anchorPt: position,
      showPointClound: false
    });
    let y = rotation[1];
    currRotation = [0, y, 0];
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

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);