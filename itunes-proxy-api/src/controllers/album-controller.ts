import { NextFunction, Request, Response } from 'express';
import Security from '../utils/security';
import ItunesFacadeService from "../services/itunes-facade-service";
import { AlbumsQueryParams } from './interfaces/album-interfaces';
import { AlbumResponseAdapter } from './adapters/album-response-adapter';

export default class AlbumController {
    private readonly itunesFacadeService: ItunesFacadeService;
    constructor(itunesFacadeService: ItunesFacadeService) {
        this.itunesFacadeService = itunesFacadeService;
    }

    async getCollection(req: Request, res: Response, next: NextFunction) {
        try {
            const queryParams: AlbumsQueryParams = {
                artistName: req.query.artistName as string,
                limit: parseInt(req.query.limit as string)
            };
            const artist = Security.sanitizeString(queryParams.artistName);
            const albums = await this.itunesFacadeService.searchAlbums(artist, queryParams.limit);
            return res.status(200).json((new AlbumResponseAdapter).adapt(albums, queryParams));
        } catch (error) {
            return next(error);
        }
    }
}