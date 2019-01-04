import React, { Component } from 'react';
import {View, Text, Platform, StyleSheet} from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import TabBarIcon from '../components/TabBarIcon';
import reducer from '../reducers';
// TODO - add Player, MiniPlayer, Downloads
import Search from '../screens/SearchScreen';

const store = createStore(reducer, applyMiddleware(thunk));
const RouterWithRedux = connect()(Router);

export default class AppNavigator extends Component {
  render() {
    return (
        <Provider store={store}>
          <View style={styles.container}>
            <RouterWithRedux>
                <Scene
                    key="home"
                    initial tabs={true}>
                  <Scene
                      key="search"
                      name={Platform.OS === 'ios'? `ios-search`: 'md-search'}
                      component={Search}
                      title="Search"
                      duration={0}
                      icon={TabBarIcon}
                      animation="fade"/>
                </Scene>
            </RouterWithRedux>
          </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});