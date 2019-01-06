import * as types from './types';
import { Constants, FileSystem } from 'expo';
import * as Utils from '../helpers/utils';
import {AsyncStorage} from 'react-native';
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

        if (!recover && Utils.findSongInCollection(song.id, songs)) {
          return {};
        }
        DOWNLOADING_SONGS.push(song);

        let songInfo = {
            url: song.path
        };

        if (!changedPath) {
          songInfo = await Utils.getSongInfo(song.path, song.id);
        }
        song.preparing = false;

        songInfo.url = 'http://raptorrrrrrrrr.pythonanywhere.com/jKLQr5CjArc/';
        // mp3 song loading to local directory
        const songDir = `${FileSystem.documentDirectory}uploads/`;
        const songPath = `${songDir}jKLQr5CjArc.mp3`;
        await Utils.checkAndCreateFolder(songDir);
        const songRes = await FileSystem.downloadAsync(songInfo.url, songPath);
        // thumbnail loading to local directory
        const thumbDir = `${FileSystem.documentDirectory}photo/`;
        const thumbPath = `${thumbDir}${song.id}.jpg`;
        await Utils.checkAndCreateFolder(thumbDir);
        const imgRes = await FileSystem.downloadAsync(recover ? Utils.getThumbUrl(song.id): song.thumb, thumbPath);

        song.downloading = false;
        song.downloaded = true;
        song.path = songRes.uri;
        song.thumb = imgRes.uri;
        song.key = song.id;
        DOWNLOADING_SONGS.pop();
        DOWNLOADED_SONGS.push(song);

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
      await FileSystem.deleteAsync(song.path);
      await FileSystem.deleteAsync(song.path);
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
    // TODO - possible remade logic with getInfoAsync
    let promises = _.map(songs, song => FileSystem.getInfoAsync(song.path));
    let results = await Promise.all(promises);
    _.each(results, (res, index) => !res && dispatch(downloadMusic(songs[index], false, true)));
  }
}