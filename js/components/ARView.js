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
let currRotation = null;
let wallDist = 0;

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
    this.handleRotate = this.handleRotate.bind(this);
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
    setTimeout(() => { this.setState({ showImage: true }) }, 15000)
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
            onDrag={(pos) => { wallDist = pos[2] }}
            dragType='FixedToPlane'
            dragPlane={{
              planePoint: this.state.anchorPt,
              planeNormal: [0, 1, 0],
              maxDistance: 5
            }}>
            {!this.state.showImage && <ViroBox
              height={0.01}
              length={0.01}
              width={5}
            />}
            {this.state.showImage && <ViroImage
              source={{ uri: image }}
              height={heightFormatted}
              width={widthFormatted}
              position={[0, 1.5, 0]}
            />}
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
        // currRotation = null;
        break;
      default: // otherwise, rotation in progress
        // currRotation[1] -= rotationFactor;
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
    wallDist = position[2];
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);