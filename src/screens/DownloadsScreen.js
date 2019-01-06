import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    List, StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Song from '../components/Song';
import ActionCreators from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';

let self = null;
class DownloadsScreen extends Component {
    state = {
        page: 'download'
    };

    constructor(props) {
        super(props);
        self = this;
    }

    static renderRightButton(props) {
        return (
            <TouchableOpacity
                onPress={DownloadsScreen.onRight}>
                <Icon
                    name="refresh"
                    size={20} />
            </TouchableOpacity>
        );
    }

    static onRight() {
        self && self.props.recoverDeletedSongs(self.props.songs)
    }

    onSongPlay(index) {
        this.props.setPlayingSong(index, this.props.songs);
    }

    deleteSong(index) {
        this.props.deleteSong(index, this.props.songs[index]);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.homeContainer}>
                    <FlatList
                        data={this.props.songs}
                        renderItem={
                            ({item, index}) => (
                            <Song
                            onPress={this.onSongPlay.bind(this, index)}
                            songName={item.title}
                            artistName={item.artist}
                            songImage={item.thumb}
                            deleteMusic={this.deleteSong.bind(this, index)}
                            songIndex={index}
                            id={item.id}
                            />
                        )}
                    />
                </View>
            </View>);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
    return {
        songs: store.songs
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 100,
        paddingTop: 64
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});