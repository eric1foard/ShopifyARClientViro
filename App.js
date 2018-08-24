import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './js/store';
import BottomTabNavigation from './js/components/BottomTabNavigation';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BottomTabNavigation />
      </Provider>
    );
  }
}

console.ignoredYellowBox = ['Warning: component', 'Warning: isMounted'];