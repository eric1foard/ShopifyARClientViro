import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlaneSelector,
  ViroImage
} from 'react-viro';
import { API_KEY } from '../../env.js';

const MIN_PLANE_DIMENSION = 0.05;

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
    this.renderScene = this.renderScene.bind(this);
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
    const { height, width, image } = this.props.product;
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
        displayPointCloud={pointCloudOpts}
        anchorDetectionTypes={'PlanesVertical'}>
        <ViroARPlaneSelector
        // minHeight={heightFormatted}
        // minWidth={widthFormatted}
        alignment={'Vertical'}
        onPlaneSelected={() => console.warn('plane selected!!!!')}>
          <ViroImage
            source={{ uri: image }}
            height={heightFormatted}
            width={widthFormatted}
            rotation={[270,0,0]}
          // position={[0,0,-1]}
          />
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);