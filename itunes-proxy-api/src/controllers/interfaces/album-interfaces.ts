export interface AlbumItem {
    albumName: string;
    albumUrl: string;
    artistId: number;
    artistName: string;
    artworkUrl100: string;
}

export interface AlbumsByArtistResponse {
    count: number;
    items: AlbumItem[];
    _links: {
        self: {
            href: string;
        }
    }
}

export interface AlbumsQueryParams {
    artistName: string;
    limit: number;
}
