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
    it('should return 200 OK', async () => {
        const response = await requests(app).get('/v0/albums');
        expect(response.status).toBe(200);
    });
});
