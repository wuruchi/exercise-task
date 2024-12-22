import { NextFunction, Request, Response } from 'express';
import ItunesFacadeService from "../services/itunes-facade-service";

class AlbumController {
    private readonly itunesFacadeService: ItunesFacadeService;
    constructor(itunesFacadeService: ItunesFacadeService) {
        this.itunesFacadeService = itunesFacadeService;
    }

    async getAlbums(req: Request, res: Response, next: NextFunction) {
        try {

            const sanitizedTerm = req.query.term as string;
            const albums = this.itunesFacadeService.searchAlbums(sanitizedTerm);
            return res.status(200).json(albums);
        } catch (error) {
            return next(error);
        }
    }
}