import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ActionCreators from '../actions';
import { Hideo } from 'react-native-textinput-effects';
import SearchResults from './SearchResults';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class HomeScreen extends React.Component {
  state = {
    searchQuery: '',
    page: 'search'
  };

  render() {
    return (
     <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.searchInputContainer}>
                <Hideo
                    iconClass={FontAwesome}
                    iconName={'search'}
                    iconColor={'white'}
                    iconBackgroundColor={'#c8c3c3'}
                    inputStyle={{ color: '#464949' }}
                    placeholder="Song name"
                    value={this.state.searchQuery}
                    onChangeText={searchQuery => this.setState({searchQuery})}
                    onSubmitEditing={() => this.props.searchSong(this.state.searchQuery)}
                />
            </View>
            <SearchResults />
        </ScrollView>
     </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
    return {
        songs: store.playlist
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  searchInputContainer: {
    width,
    height: 60
  }
});
