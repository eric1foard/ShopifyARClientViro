import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroImage
} from 'react-viro';
import { API_KEY } from '../../env.js';

// TODO: this will not be needed when store dimensions in meters
const formatDimension = dim => {
  const INCH_TO_METER = 0.0254; // inches => meters
  return dim * INCH_TO_METER;
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
    return (
      <ViroARScene>
        <ViroImage
          source={{ uri: image }}
          height={formatDimension(height)}
          width={formatDimension(width)}
          // position={[0,0,-1]}
        />
      </ViroARScene>
    );
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

export default connect(mapStateToProps)(ARView);