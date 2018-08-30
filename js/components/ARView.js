import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, View } from 'react-native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroImage
} from 'react-viro';
import { API_KEY } from '../../env.js';
import { showProduct } from '../actions';

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
    const {
      product: { height, width, image, visible },
      showProduct,
    } = this.props;
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroARScene
      // displayPointCloud={pointCloudOpts}
      // anchorDetectionTypes={'PlanesVertical'}
      onClick={() => {console.log('click!!!!'); this.props.showProduct()}}
      >
        {visible &&
        <ViroImage
          source={{ uri: image }}
          height={heightFormatted}
          width={widthFormatted}
          // rotation={[180, 0, 0]}
        // position={[0,0,-1]}
        />}
      </ViroARScene>
    );
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ showProduct }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ARView);