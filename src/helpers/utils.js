import {AsyncStorage} from 'react-native';
import Config from '../config';

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