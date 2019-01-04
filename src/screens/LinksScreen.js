import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Touchable from 'react-native-platform-touchable';
import {WebBrowser} from "expo";

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <ExpoLinksView />
{/*        <Touchable
            style={styles.option}
            background={Touchable.Ripple('#ccc', false)}
            onPress={this._handlePressDocs}>
          <View style={{ flexDirection: 'row' }}>
          </View>
        </Touchable>*/}
      </ScrollView>
    );
  }

  _handlePressDocs = () => {
    WebBrowser.openBrowserAsync('http://docs.expo.io');
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
