const YOUTUBE_API_KEY = "Your_Api_Key";
export default {
    API_URL: "http://hello/api?vid=",
    SEARCH_API_URL: `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&maxResults=40&q=`
}