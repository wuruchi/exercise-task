import axios from "axios";
import { UnknownErrorHandler } from "../utils/errors";
import { ItunesAlbumsResponse } from "./interfaces/itunes-interfaces";
import config from "../config";

export default class ItunesFacadeService {
    async searchAlbums(term: string, limit: number) {
        try {
            const response = await axios.get<ItunesAlbumsResponse>(
                `${config.itunesBaseUrl}/search?term=${term}&media=music&entity=album&attribute=artistTerm&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw (new UnknownErrorHandler()).getHandledError(error);
        }
    }
}
