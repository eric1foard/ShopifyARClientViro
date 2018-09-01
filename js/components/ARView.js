import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlane,
  ViroImage,
  ViroNode,
  ViroQuad,
} from 'react-viro';
import { API_KEY } from '../../env.js';
import { handleFoundAnchor, handleDrag } from '../actions';

const MIN_PLANE_DIMENSION = 0.1;

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

// TODO: implement onTrackingInitialized for when AR is warming up
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
    const { product } = this.props;
    return (
      <ViroARScene
        displayPointCloud={pointCloudOpts}
        anchorDetectionTypes={'PlanesHorizontal'}
        onCameraTransformUpdate={this.handleCameraTransformUpdate}
      >
        {this.renderHorizPlaneSelector(product)}
      </ViroARScene>
    );
  }

  handleCameraTransformUpdate(transform) {

  }

  renderHorizPlaneSelector(product) {
    return <ViroARPlane
      minHeight={MIN_PLANE_DIMENSION}
      minWidth={MIN_PLANE_DIMENSION}
      alignment={'Horizontal'}
      onAnchorFound={anchor => this.props.handleFoundAnchor(anchor)}>
      {product.visible && this.renderDraggableNode(product)}
    </ViroARPlane>
  }

  renderDraggableNode(product) {
    const { height, width, image, position, rotation } = product;
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      <ViroNode
        // onDrag={this.props.handleDrag}
        transformBehaviors="billboard"
        rotation={rotation}
        position={position}
      >
        <ViroImage
            source={{ uri: image }}
            height={heightFormatted}
            width={widthFormatted}
          />
      </ViroNode>
    )
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

const mapDispatchToProps = dispatch => {
  const actions = { handleFoundAnchor, handleDrag };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ARView);