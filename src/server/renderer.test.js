import { Response } from 'express';
import httpMocks, { MockResponse } from 'node-mocks-http';
import { get } from './renderer';


test('should return the get of renderer response', async () => {

	const req = httpMocks.createRequest({url: '/graphqlexample',});
	const res = httpMocks.createResponse();
	const data = await get(req, res);

	console.log(data._getData());
});

//	test('should return 500 when internal errors occur', async () => {
//		
//		jest.resetModules();
//		jest.mock('@loadable/server', () => {
//			return {
//				ChunkExtractor: () => {
//					return new Error();
//				},
//			};
//		});
//	
//		const { get } = await import('./renderer');
//		const req = httpMocks.createRequest();
//		const res = httpMocks.createResponse();
//		const data = await get(req, res);
//	
//		expect(data.statusCode).toEqual(500);
//	});
