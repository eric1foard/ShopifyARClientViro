import React, { Component } from 'react';
import { Text, View } from 'react-native';

class StoreView extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Sort!</Text>
      </View>
    );
  }
}

export default StoreView;