import axios from "axios";

const API_URL = "http://localhost:5000/v0";

export async function getAlbumsByArtist(artistName) {
    const encodedArtistName = encodeURIComponent(artistName);
    const response = await axios.get(`${API_URL}/albums?artistName=${encodedArtistName}`);
    return response.data.items;
}
