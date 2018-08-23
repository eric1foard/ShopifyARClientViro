import React, { Component } from 'react';
import { ViroARScene, ViroText } from 'react-viro';
import { API_KEY } from '../../env.js';

class ARView extends Component {
  render() {
    return (
      <ViroARSceneNavigator
        apiKey={API_KEY}
        initialScene={{ scene: this.renderScene() }}
      />
    );
  }

  renderScene() {
    return (
      <ViroARScene>
        <ViroText text={'testing!'} scale={[.5, .5, .5]} position={[0, 0, -1]} />
      </ViroARScene>
    );
  }
}

export default ARView;