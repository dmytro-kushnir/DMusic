const YOUTUBE_API_KEY = "Your_Api_Key";
const X_MASHAPE_KEY = "Your_Api_Key";

export default {
    API_URL: "https://getvideo.p.mashape.com/?url=https://www.youtube.com/watch?v=",
    SEARCH_API_URL: `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&maxResults=40&q=`,
    X_MASHAPE_KEY: X_MASHAPE_KEY
}