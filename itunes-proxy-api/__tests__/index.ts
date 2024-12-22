import requests from 'supertest';
import app from '../src/app'

let server: any;
const port = 5000;

beforeAll((done) => {
    server = app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
        done();
    });
})

afterAll((done) => {
    server.close(done);
});

describe('GET /v0/albums', () => {
    it('should return Bad Request if the query param artistName is not supplied', async () => {
        const response = await requests(app).get('/v0/albums');
        // Assert
        expect(response.status).toBe(400);
    });
    it('should return Bad Request if the query param artistName is supplied but empty', async () => {
        const response = await requests(app).get('/v0/albums?artistName=');
        // Assert
        expect(response.status).toBe(400);
    });
    it('should return Bad Request if other query params are supplied', async () => {
        const response = await requests(app).get('/v0/albums?artistName=adele&other=10');
        // Assert
        expect(response.status).toBe(400);
    });
    it('should return Ok and an empty array if no albums are found', async () => {
        const response = await requests(app).get('/v0/albums?artistName=xyz01829as&limit=10');
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(0);
        expect(response.body.items).toEqual([]);
    });
    it('should return Ok and a list of albums if albums are found', async () => {
        const response = await requests(app).get('/v0/albums?artistName=adele&limit=10');
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.count).toBeGreaterThan(0);
        expect(response.body.items.length).toBeGreaterThan(0);
    });
});
