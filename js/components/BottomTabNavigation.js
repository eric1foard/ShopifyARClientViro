import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import BrowseView from './BrowseView';
import SearchView from './SearchView';
import StoreView from './StoreView';
import ARView from './ARView';

const BROWSE = 'Browse';
const SEARCH = 'Search';
const STORE = 'Store';
const ARVIEW = 'ARView';
const PLATFORM = 'ios'; // TODO: switch based on platform to show correct icon

const BrowseStack = createStackNavigator({
  [BROWSE]: BrowseView,
  [ARVIEW]: ARView
});

const SearchStack = createStackNavigator({
  [SEARCH]: SearchView,
  [ARVIEW]: ARView
});

const routes = {
  [BROWSE]: BrowseStack,
  [SEARCH]: SearchStack,
  [STORE]: StoreView
  // TODO: add tab for link to store
};

const icons = {
  [BROWSE]: 'albums',
  [SEARCH]: 'search',
  [STORE]: 'basket'
  // TODO: icon for link to store
};

//`ios-information-circle${focused ? '' : '-outline'}`;
const resolveIconName = (iconName, focused, platform) =>
  iconName ? `${platform}-${iconName}${focused ? '' : '-outline'}` : '';

const navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused, tintColor }) => {
    const { routeName } = navigation.state;
    const iconNameFormatted = resolveIconName(icons[routeName], focused, PLATFORM);
    return (
      <Icon
        name={iconNameFormatted}
        type='ionicon'
        size={25}
        // color={tintColor}
      />
    );
  }
});

const config = {
  initialRouteName: 'Browse',
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray'
  },
  navigationOptions
};

export default createBottomTabNavigator(routes, config);