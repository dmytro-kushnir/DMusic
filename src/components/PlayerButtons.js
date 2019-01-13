import React, {Component} from 'react';
import {
    Dimensions,
    Image, StyleSheet,
    Text,
    View
} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Slider from 'react-native-slider';
import * as Utils from '../helpers/utils';

let {height, width} = Dimensions.get('window');

export class PlayButton extends Component {
  render() {
    return <Icon
              color="#fff"
              name={this.props.playing ? "ios-pause" : "ios-play"}
              onPress={this.props.togglePlay}
              size={70}
              style={styles.play}>
          </Icon>;
  }
}

export class ForwardButton extends Component {
  render() {
    let forwardButton = null;
    if (!this.props.shuffle && this.props.songIndex + 1 === this.props.songs.length ) {
      forwardButton = <FontAwesome
                        color="#333"
                        name="forward" size={25}
                        style={styles.forward}
                      >
                      </FontAwesome>;
    } else {
      forwardButton = <FontAwesome
                        color="#fff"
                        name="forward"
                        onPress={this.props.goForward}
                        size={25}
                        style={styles.forward}>
                      </FontAwesome>;
    }

    return forwardButton;
  }
}

export class BackwardButton extends Component {
  render() {
    return <FontAwesome
              onPress={this.props.goBackward}
              style={styles.back}
              name="backward"
              size={25}
              color="#fff">
          </FontAwesome>;
  }
}

export class VolumeButton extends Component {
  render() {
    return <FontAwesome
              onPress={this.props.toggleVolume}
              style={styles.volume}
              name={this.props.volume?"volume-up": "volume-off"}
              size={18}
              color="#fff">
          </FontAwesome>;
  }
}

export class ShuffleButton extends Component {
  render() {
    return  <FontAwesome
              onPress={this.props.toggleShuffle}
              style={styles.shuffle}
              name="random"
              size={18}
              color={this.props.shuffle?"#f62976": "#fff"}>
            </FontAwesome>;
  }
}

export class DownloadButton extends Component {
  render() {
    if(this.props.downloading || this.props.downloaded) {
      return  <FontAwesome
                style={styles.downloadButton}
                name="download"
                size={25}
                color="#333">
              </FontAwesome>;
    }
    return  <FontAwesome
              onPress={this.props.downloadMusic}
              style={styles.downloadButton}
              name="download"
              size={25}
              color="#fff">
            </FontAwesome>;
  }
}

export class SongSlider extends Component {
  render() {
    return (
          <View style={ styles.sliderContainer }>
            <Slider
              {...this.props}
              minimumTrackTintColor='#fff'
              style={styles.slider}
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.sliderThumb}>
            </Slider>
            <View
                style={styles.timeInfo}>
                  <Text
                      style={styles.time }>
                        {Utils.formattedTime(this.props.currentTime)}
                  </Text>
                  <Text
                      style={styles.timeRight }>
                        - { Utils.formattedTime( this.props.songDuration - this.props.currentTime )}
                  </Text>
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    play: {
        marginLeft: 50,
        marginRight: 50,
    },
    forward: {
        marginTop: 22,
        marginRight: 45,
    },
    back: {
        marginTop: 22,
        marginLeft: 45,
    },
    volume: {
        marginTop: 26,
    },
    shuffle: {
        marginTop: 26,
    },
    downloadButton: {
        position: 'absolute',
        top: 10,
        left: width - 40,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
    },
    sliderContainer: {
        width: width - 40,
    },
    slider: {
        height: 20,
    },
    sliderTrack: {
        height: 2,
        backgroundColor: '#333',
    },
    sliderThumb: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 10 / 2,
        position: 'absolute',
        top: 10
    },
    timeInfo: {
        flexDirection: 'row',
    },
    time: {
        color: '#FFF',
        flex: 1,
        fontSize: 10,
    },
    timeRight: {
        color: '#FFF',
        textAlign: 'right',
        flex: 1,
        fontSize: 10,
    }
});
