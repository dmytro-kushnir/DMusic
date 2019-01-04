import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
// TODO - add Player, MiniPlayer, Downloads
import Search from '../screens/HomeScreen'; // TODO - rename to Search
import Icon from 'react-native-vector-icons/FontAwesome';

const TabIcon = (props) => <Icon size={24} name={props.name} color={props.selected? "black": "#c8c3c3"}/>;
const store = createStore(reducer, applyMiddleware(thunk));
const RouterWithRedux = connect()(Router);

export default class AppNavigator extends Component {
  render() {
    return (
        <Provider store={store}>
          <View style={{flex: 1}}>
            <RouterWithRedux>
              <Scene key="root">
                <Scene key="home" initial tabs={true}>
                  <Scene key="search" component={Search} title="Search" duration={0} icon={TabIcon} animation="fade"/>
                </Scene>
              </Scene>
            </RouterWithRedux>
          </View>
        </Provider>
    );
  }
}