import express from "express";
import path from "path";
import cors from "cors";
import * as OpenApiValidator from 'express-openapi-validator';
import { NotFound } from './utils/errors';
import { customErrorRequestHandler } from "./middleware/error-handler";
import AlbumController from "./controllers/album-controller";
import ItunesFacadeService from "./services/itunes-facade-service";

const albumController = new AlbumController(new ItunesFacadeService());

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger
const apiSpec = path.join(__dirname, 'api', 'swagger.yaml');

app.use(OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
}));

const router = express.Router();

router.use(cors());
router.use('/docs', express.static(apiSpec));

router.get('/v0/albums', (req, res, next) => {
    albumController.getCollection(req, res, next).catch(next);
});

router.all('*', (req, res, next) => next(new NotFound('Route Not Found')));

app.use('/', router);

app.use(customErrorRequestHandler);

export default app;
