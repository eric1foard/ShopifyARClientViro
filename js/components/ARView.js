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
import { handleFoundAnchor } from '../actions';

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
      >
        {this.renderHorizPlaneSelector(product)}
      </ViroARScene>
    );
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
    const { height, width, image, anchorPos } = product;
    console.warn('anchorPos ',anchorPos);
    const widthFormatted = formatDimension(width);
    const heightFormatted = formatDimension(height);
    return (
      /* <ViroImage
            source={{ uri: image }}
            height={heightFormatted}
            width={widthFormatted}
            // rotation={[270,0,0]}
            position={[0,1.5,-1]}
          /> */
      <ViroNode
        dragType="FixedToPlane"
        onDrag={(pos)=> console.warn('pos ', pos)}
        dragPlane={{
          planePoint: anchorPos,
          planeNormal: [0,1,0],
          maxDistance: 5
        }}
      >
        <ViroQuad
          rotation={[270, 0, 0]}
          height={.1}
          width={1}
          // position={[0,0,0]}
        />
      </ViroNode>
    )
  }
}

const mapStateToProps = ({ selectedProduct }) => ({
  product: selectedProduct
});

const mapDispatchToProps = dispatch => {
  const actions = { handleFoundAnchor };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ARView);