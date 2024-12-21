import express from "express";
import path from "path";
import * as OpenApiValidator from 'express-openapi-validator';
import { NotFound } from './utils/errors';
import { customErrorRequestHandler } from "./middleware/error-handler";

const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// Swagger
const apiSpec = path.join(__dirname, 'api', 'swagger.yaml');

app.use(OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
}));

const router = express.Router();

router.use('/v0/api-docs', express.static(apiSpec));
router.get('/v0/albums', (req, res) => {
    res.send('Hello World!');
});
router.all('*', (req, res, next) => next(new NotFound('Route Not Found')));

app.use('/', router);

app.use(customErrorRequestHandler);


export default app;