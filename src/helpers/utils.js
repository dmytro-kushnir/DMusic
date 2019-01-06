import {AsyncStorage} from 'react-native';
import Config from '../config';
import _ from "underscore";

export function filterSearchResults(res) {
    return res.items.map(item => {
        return {
            id: item.id.videoId,
            artist: item.snippet.channelTitle,
            title: item.snippet.title,
            thumb: item.snippet.thumbnails.high.url,
            path: getSongUrl(item.id.videoId),
            key: item.id.videoId
        }
    });
}

export function getSongUrl(id) {
    return `${Config.API_URL}${id}`;
}

export async function getSongsFromStorage() {
    let songs = await AsyncStorage.getItem('songs');
    songs = songs || JSON.stringify([]);
    return JSON.parse(songs);
}

export async function getSongFromStorage(id) {
    let songs = await AsyncStorage.getItem('songs');
    songs = songs || JSON.stringify([]);
    return _.findWhere(JSON.parse(songs), {id});
}

export function findSongInCollection(id, songs) {
    return songs.filter(song => song.id == id).length;
}

export async function getSongInfo(path, recoverId) {
    let res = await fetch(recoverId? getSongUrl(recoverId): path);
    let data = await res.json();
    if(data.status) return data;
    throw data.error;
}

export function getThumbUrl(id) {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export async function setSongsToStorage(songs, recover) {
    let storageSongs = await getSongsFromStorage();
    storageSongs = recover?deleteRecoverSongs([...storageSongs], [...songs]): storageSongs;
    let newSongs = [...storageSongs, ...songs];
    await AsyncStorage.setItem('songs', JSON.stringify(newSongs));
    return newSongs;
}

function deleteRecoverSongs(oldSongs, newSongs) {
    return _.filter(oldSongs, song => {
        return !_.findWhere(newSongs, {id: song.id});
    });
}

export function urlToBlob(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onerror = reject;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr.response);
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob'; // convert type
        xhr.send();
    })
}