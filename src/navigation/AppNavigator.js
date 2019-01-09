import React, { Component } from 'react';
import {View, Text, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import TabBarIcon from '../components/TabBarIcon';
import reducer from '../reducers';
import SearchScreen from '../screens/SearchScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import PlayerScreen from '../screens/PlayerScreen';
import MiniPlayerScreen from '../screens/MiniPlayerScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
const store = createStore(reducer, applyMiddleware(thunk));
const RouterWithRedux = connect()(Router);

export default class AppNavigator extends Component {
  render() {
    return (
        <Provider
            store={store}>
          <View
              style={styles.container}>
              <MiniPlayerScreen/>
            <RouterWithRedux>
                <Scene
                    key="root">
                    <Scene
                        key="home"
                        initial tabs={true}
                        hideNavBar>
                        <Scene
                            animation="fade"
                            component={SearchScreen}
                            duration={0}
                            icon={TabBarIcon}
                            key="search"
                            name={Platform.OS === 'ios'? `ios-search`: 'md-search'}
                            title="Search">
                        </Scene>
                        <Scene
                            animation="fade"
                            component={DownloadsScreen}
                            duration={0}
                            icon={TabBarIcon}
                            title="Downloads"
                            key="download"
                            name={Platform.OS === 'ios'? `ios-download`: 'md-download'}
                            navigationBarStyle={styles.navBarStyle}
                        >
                        </Scene>
                    </Scene>
                    <Scene
                        key="player"
                        component={PlayerScreen}
                        hideNavBar
                        hideTabBar
                        direction="vertical">
                    </Scene>
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
    },
    navBarStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1
    },
    hey: {
        width: 130, height: 30,
        paddingRight: 20
    }
});