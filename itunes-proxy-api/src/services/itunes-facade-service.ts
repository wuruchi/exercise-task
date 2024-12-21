import axios from 'axios';
import { UnknownErrorHandler } from '../utils/errors';

export default class ItunesFacadeService {
    // Search albums using the service https://itunes.apple.com/search?parameterkeyvalue
    async searchAlbums(term: string) {
        try {
            const response = await axios.get(`https://itunes.apple.com/search?term=${term}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw new UnknownErrorHandler().getHandledError(error);
        }
    }
}
