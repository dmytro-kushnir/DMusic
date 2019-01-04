import React, { Component } from 'react';
import {View, Text, Platform, StyleSheet} from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import TabBarIcon from '../components/TabBarIcon';
import reducer from '../reducers';
// TODO - add Player, MiniPlayer
import Search from '../screens/SearchScreen';
import Downloads from '../screens/DownloadsScreen';

const store = createStore(reducer, applyMiddleware(thunk));
const RouterWithRedux = connect()(Router);

export default class AppNavigator extends Component {
  render() {
    return (
        <Provider
            store={store}>
          <View
              style={styles.container}>
            <RouterWithRedux>
                <Scene
                    key="root"
                    initial tabs={true}>
                    <Scene
                        animation="fade"
                        component={Search}
                        duration={0}
                        icon={TabBarIcon}
                        key="search"
                        name={Platform.OS === 'ios'? `ios-search`: 'md-search'}
                        title="Search">
                    </Scene>
                    <Scene
                        animation="fade"
                        component={Downloads}
                        duration={0}
                        icon={TabBarIcon}
                        initial title="Downloads"
                        key="download"
                        name={Platform.OS === 'ios'? `ios-download`: 'md-download'}>
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
    }
});