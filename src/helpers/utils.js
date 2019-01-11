import {AsyncStorage} from 'react-native';
import Config from '../config';
import _ from "underscore";
import {FileSystem} from "expo";

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
    return `${Config.API_URL}${id}${Config.API_PARAMS}`;
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
    let res = await fetch(recoverId ? getSongUrl(recoverId): path);
    let data = await res.json();
    if (data.status) {
        return data;
    }
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

// Create any app folders that don't already exist
export const checkAndCreateFolder = async folder_path => {
    const folder_info = await FileSystem.getInfoAsync(folder_path);
    if (!Boolean(folder_info.exists)) {
        // Create folder
        console.log("checkAndCreateFolder: Making " + folder_path);
        try {
            await FileSystem.makeDirectoryAsync(folder_path, {
                intermediates: true
            });
        } catch (error) {
            // Report folder creation error, include the folder existence before and now
            const new_folder_info = await FileSystem.getInfoAsync(folder_path);
            const debug = `checkAndCreateFolder: ${
                error.message
                } old:${JSON.stringify(folder_info)} new:${JSON.stringify(
                new_folder_info
            )}`;
            console.log(debug);
        }
    }
};

export function formattedTime( timeInSeconds ) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds - minutes * 60;

    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 && seconds < 0) {
        return "";
    } else {
        return(`${withLeadingZero(minutes)}:${withLeadingZero(seconds.toFixed(0))}`);
    }
}

function withLeadingZero(amount){
    if (amount < 10) {
        return `0${amount}`;
    } else {
        return `${amount}`;
    }
}