import * as types from './types';
// import RNFetchBlob from 'rn-fetch-blob';
import { Constants, FileSystem } from 'expo';
import * as Utils from '../helpers/utils';
import {AsyncStorage} from 'react-native';
// import RNFS from 'react-native-fs';
import _ from 'underscore';

let DOWNLOADING_SONGS = [];
let DOWNLOADED_SONGS = [];

export function downloadMusic(song, changedPath, recover) {
    return async (dispatch) => {
      try {
        if (song.downloading) {
          return;
        }
        song.preparing = true;
        song.downloading = true;
        let songs = await Utils.getSongsFromStorage();
        // console.log("GET songs! ", songs);
        if (!recover && Utils.findSongInCollection(song.id, songs)) {
          return {};
        }
        DOWNLOADING_SONGS.push(song);
        let dirs = FileSystem.documentDirectory;
        let songInfo = {
            url: song.path
        };
        if (!changedPath) {
          songInfo = await Utils.getSongInfo(song.path, song.id);
        }
        song.preparing = false;
        const songRes = await Utils.urlToBlob(songInfo.url);
        // const songRes = await RNFetchBlob
        //     .config({
        //       path: `${dirs.DocumentDir}/${song.id}.mp3`
        //     })
        //     .fetch('GET', songInfo.url, {})
        //     .progress((received, total) => {
        //       dispatch(setProgress(received / total, song.id));
        //     });
        const imgRes = await Utils.urlToBlob(recover? Utils.getThumbUrl(song.id): song.thumb);
        // const imgRes = await RNFetchBlob
        //     .config({
        //       path: `${dirs.DocumentDir}/${song.id}.jpg`
        //     })
        //     .fetch('GET', recover? Utils.getThumbUrl(song.id): song.thumb, {});
        song.downloading = false;
        song.downloaded = true;
        song.path = songRes;
        song.thumb = imgRes;
        song.key = song.id;
        DOWNLOADING_SONGS.pop();
        DOWNLOADED_SONGS.push(song);

        // console.log("downloaded song -> ", song);
        if (!DOWNLOADING_SONGS.length) {
          let updatedSongs = await Utils.setSongsToStorage(DOWNLOADED_SONGS, recover);
          DOWNLOADED_SONGS = [];
          return dispatch(setSongs(updatedSongs));
        }
      } catch(err) {
        DOWNLOADING_SONGS.pop();
        song.downloading = false;
        song.preparing = false;
        let songs = await Utils.getSongsFromStorage();
        dispatch(setSongs(songs));
        console.warn(err);
      }
    }
}

export function musicDownloaded(path) {
  return {
    type: types.DOWNLOADED,
    path
  }
}

export function deleteSong(index, song) {
  return async (dispatch) => {
    let songs = await Utils.getSongsFromStorage();
    try {
      await RNFS.unlink(song.path);
      await RNFS.unlink(song.thumb);
      songs.splice(index, 1);
      await AsyncStorage.setItem('songs', JSON.stringify(songs));
      return dispatch(setSongs(songs));
    } catch(err) {
        //If song not found in path
        songs.splice(index, 1);
        await AsyncStorage.setItem('songs', JSON.stringify(songs));
        return dispatch(setSongs(songs));
    }
  }
}

export function setSongs(songs) {
  return {
    type: types.SONGS,
    songs
  }
}

export function setProgress(progress, id) {
  return {
    type: types.PROGRESS,
    progress,
    id
  }
}

export function recoverDeletedSongs(songs) {
  return async dispatch => {
    let promises = _.map(songs, song => RNFS.exists(song.path));
    let results = await Promise.all(promises);
    _.each(results, (res, index) => !res && dispatch(downloadMusic(songs[index], false, true)));
  }
}
