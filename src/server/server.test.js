import request from 'supertest';
import { startServer } from './server';

test('should return the api response of get::graphql', async () => {
	const app = startServer();
	const res = await request(app).get('/graphql');

	expect(res.status).toEqual(400);
});
