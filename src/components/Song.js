import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator, StyleSheet
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ActionCreators from '../actions';

let {height, width} = Dimensions.get('window');

class Song extends Component {

    state = {
        songImage: "http://raptorrrrrrrrr.pythonanywhere.com/music_ico/",
        downloading: false
    };

    swipeBtns = [{
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => { this.props.deleteMusic() }
    }];

    async downloadMusic(song) {
        this.setState({downloading: true});
        await this.props.downloadMusic(song, song.pathChanged);
        this.setState({downloading: false});
    }

    render() {
        return this.props.search? SearchedSong.call(this): DownloadedSong.call(this);
    }
}

function SearchedSong() {
    let song = this.props.searchResults[this.props.songIndex];
    return (
        <TouchableOpacity style={styles.searchSongContainer} onPress={() => this.props.onPress(song.downloaded)}>
            <View style={[styles.songView, {width: width - 60}]}>
                <Image
                    source={{uri: this.props.songImage || this.state.songImage}}
                    style={styles.songTitleImage}>
                </Image>
                <View style={styles.songTitleContainer}>
                    <Text style={styles.songArtistText} numberOfLines={1}>
                        {this.props.artistName || "Unknown Artist"}
                    </Text>
                    <Text style={styles.songTitleText} numberOfLines={1}>
                        {this.props.songName || "Unknown Song"}
                    </Text>
                </View>
            </View>
            {renderProgressBar.call(this)}
        </TouchableOpacity>
    )
}


function DownloadedSong() {
    this.props.songImage = Platform.OS == 'android'?'file://': "" + this.props.songImage;
    return (
        <Swipeout
            right={this.swipeBtns}
            backgroundColor= 'transparent'
            autoClose={true}>
            <TouchableOpacity style={styles.downloadSongContainer} onPress={this.props.onPress}>
                <View style={styles.songView}>
                    <Image
                        source={{uri: this.props.songImage || this.state.songImage}}
                        style={styles.songTitleImage}>
                    </Image>
                    <View style={styles.songTitleContainer}>
                        <Text style={styles.songArtistText} numberOfLines={1}>
                            {this.props.artistName || "Unknown Artist"}
                        </Text>
                        <Text style={styles.songTitleText} numberOfLines={1}>
                            {this.props.songName || "Unknown Song"}
                        </Text>
                    </View>
                    {renderProgressBar.call(this, true)}
                </View>
            </TouchableOpacity>
        </Swipeout>
    )
}

function renderProgressBar(downloads) {
    let song = this.props[downloads? 'songs': 'searchResults'][this.props.songIndex];
    if (song.preparing) {
        return <ActivityIndicator animating={true} size='small'/>
    }

    if (song.downloaded && !downloads) {
        return (
            <View style={{width: 60, paddingLeft: 20}}>
                <Icon name='md-play' size={40}/>
            </View>)
    }

    let progress = this.props.progreses[this.props.id];
    if (song.downloading || this.state.downloading) {
        return (
            <AnimatedCircularProgress
                size={40}
                width={3}
                fill={progress?progress * 100: 0}
                tintColor="#00e0ff"
                backgroundColor="#3d5875">
            </AnimatedCircularProgress>
        )
    }

    if (downloads) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => !song.downloading && this.downloadMusic(song)}
            style={{width: 60, paddingLeft: 20}}>
            <Icon
                name='md-download'
                size={40}>
            </Icon>
        </TouchableOpacity>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
    return {
        progreses: store.progreses,
        searchResults: store.searchResults,
        songs: store.songs
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Song);

const styles = StyleSheet.create({
    songView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    songTitleImage: {
        height: 50,
        width: 50
    },
    songTitleContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: 10,
        justifyContent: "space-around"
    },
    songArtistText: {
        fontSize: 16,
        color: "#333"
    },
    songTitleText: {
        fontSize: 12,
        color: "#c8c3c3"
    },
    searchSongContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f0f0"
    },
    downloadSongContainer: {
        width,
        height: 60,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f0f0"
    }
});
