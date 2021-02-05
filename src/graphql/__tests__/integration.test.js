import { createTestClient } from 'apollo-server-testing';
import nock from'nock';

// integration test being run against a test instance of apollo-server

// =========================
import { toPromise } from '@apollo/client';
// =========================

import { GET_GOOGLE_BOOK } from '../queries/queries.js';
import { GoogleBooksAPI } from '../datasources/googleBooksAPI';

import { constructTestServer, startTestServer } from './__utils';

// the mocked REST API data
import { mockBookResponse } from '../datasources/__tests__/googleBooksAPI.test.js';

describe('Queries', () => {
	it('fetches single book', async () => {
		const {server, googleBooks} = constructTestServer();

		googleBooks.get = jest.fn(() => mockBookResponse);

		const {query} = createTestClient(server);

		const res = await query({query: GET_GOOGLE_BOOK, variables: {id: 'uW_zzQEACAAJ'}});

		expect(res).toMatchSnapshot();
	});
});

//	describe('Server', () => {
//		let stop, graphql;
//	
//		beforeEach(async () => {
//			const testServer = await startTestServer();
//			stop = testServer.stop;
//			graphql = testServer.graphql;
//		});
//	
//		afterEach(() => stop());
//	
//		it('gets a single book', async () => {
//			const res = await toPromise(graphql({ query: GET_GOOGLE_BOOK, variables: { id: 'uW_zzQEACAAJ' } }));
//	
//			expect(res).toMatchSnapshot();
//		});
//	});
