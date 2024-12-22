export interface ItunesAlbum {
    wrapperType: "collection";
    collectionType: "Album";
    artistId: number;
    collectionId: number;
    artistName: string;
    collectionName: string;
    collectionCensoredName: string;
    artistViewUrl: string;
    collectionViewUrl: string;
    artworkUrl60: string;
    artworkUrl100: string;
    collectionPrice: number;
    collectionExplicitness: "notExplicit" | "explicit";
    trackCount: number;
    copyright: string;
    country: string;
    currency: string;
    releaseDate: string;
    primaryGenreName: string;
}

export interface ItunesAlbumsResponse {
    resultCount: number;
    results: ItunesAlbum[];
}
