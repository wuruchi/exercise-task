import { AlbumsByArtistResponse, AlbumsQueryParams } from "../interfaces/album-interfaces";
import { ItunesAlbumsResponse, ItunesAlbum } from "../../services/interfaces/itunes-interfaces";
import config from "../../config";

export class AlbumResponseAdapter {

    private filterAlbums(itunesAlbums: ItunesAlbum[]) {
        const uniqueByNameFirstFoundKeptFilter = (albums: ItunesAlbum[]) => {
            const uniqueAlbumNames = new Set<string>();
            return albums.filter((album) => {
                if (uniqueAlbumNames.has(album.collectionName)) {
                    return false;
                }
                uniqueAlbumNames.add(album.collectionName);
                return true;
            });
        }
        return uniqueByNameFirstFoundKeptFilter(itunesAlbums);
    }

    public adapt(itunesResponse: ItunesAlbumsResponse, queryParams: AlbumsQueryParams): AlbumsByArtistResponse {
        const keyValuePairs = Object.entries(queryParams);
        const queryString = keyValuePairs.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
        return {
            count: itunesResponse.resultCount,
            items: this.filterAlbums(itunesResponse.results).map((result) => ({
                albumName: result.collectionName,
                artistId: result.artistId,
                artistName: result.artistName,
                artworkUrl100: result.artworkUrl100,
            })),
            _links: {
                self: {
                    href: `http://localhost:${config.port}/v0/albums?${queryString}`,
                },
            },
        };
    }
}
