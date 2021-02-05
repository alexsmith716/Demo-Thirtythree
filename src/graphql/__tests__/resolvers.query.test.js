import { graphql } from 'graphql';
import { resolvers } from '../resolvers/resolvers';

import { constructTestServer } from './__utils';

// =====================================================

// https://api.spacexdata.com/v2/launches?flight_number=99

//		graphql(
//		  schema: GraphQLSchema,
//		  requestString: string,
//		  rootValue?: ?any,
//		  contextValue?: ?any,
//		  variableValues?: ?{[key: string]: any},
//		  operationName?: ?string
//		): Promise<GraphQLResult>

// The graphql function lexes, parses, validates and executes a GraphQL request.
// It requires a schema and a requestString.
// Optional arguments include a rootValue, which will get passed as the root value to the executor, 
//		a contextValue, which will get passed to all resolve functions, variableValues, 
//		which will get passed to the executor to provide values for any variables in requestString, 
//		and operationName, which allows the caller to specify which operation in requestString will be run, 
//		in cases where requestString contains multiple top-level operations.

// =====================================================

test('should return result from character resolver', async () => {

	const GET_RICK_AND_MORTY_CHARACTER = `
		query GetRickAndMortyCharacter($id: ID!) {
			character(id: $id) {
				id
				name
			}
		}
	`;

	const res = await graphql(
		executableSchema,
		GET_RICK_AND_MORTY_CHARACTER,
		null,
		{
			character: MOCK_type_Query_character,
		},
		{
			id: 3,
		}
	);

	expect(res).toMatchSnapshot();
});

// =====================================================

//		exports[`[Query.googleBook] calls lookup from googleBook api 1`] = `
//		Object {
//		  "id": "uW_zzQEACAAJ",
//		}
//		`;
//		
//		exports[`[Query.googleBooks] calls lookup from googleBooks api 1`] = `
//		Object {
//		  "books": Array [
//		    Object {
//		      "cursor": "foo",
//		      "id": "uW_zzQEACAAJ",
//		    },
//		  ],
//		  "cursor": "foo",
//		  "hasMore": false,
//		}
//		`;

describe('[Query.googleBooks]', () => {
	const mockContext = {
		dataSources: {
			googleBooks: { getBooks: jest.fn() },
		},
	};

	const { getBooks } = mockContext.dataSources.googleBooks;

	it('calls lookup from googleBooks api', async () => {
		getBooks.mockReturnValueOnce([{ id: 'uW_zzQEACAAJ', cursor: 'foo' }]);

		// check the resolver response
		const res = await resolvers.Query.googleBooks(null, {}, mockContext);
		expect(res).toEqual({
			books: [{ id: 'uW_zzQEACAAJ', cursor: 'foo' }],
			cursor: 'foo',
			hasMore: false,
		});
		expect(res).toMatchSnapshot();
	});
});

// =====================================================

describe('[Query.googleBook]', () => {
	const mockContext = {
		dataSources: {
			googleBooks: { getBook: jest.fn() },
		},
	};

	it('calls lookup from googleBook api', async () => {
		const getBook = mockContext.dataSources.googleBooks.getBook;
		getBook.mockReturnValueOnce({ id: 'uW_zzQEACAAJ' });

		// check the resolver response
		const res = await resolvers.Query.googleBook(null, { id: 'uW_zzQEACAAJ' }, mockContext);
		expect(res).toEqual({ id: 'uW_zzQEACAAJ' });

		// make sure the dataSources were called properly
		expect(getBook).toBeCalledWith({ id: 'uW_zzQEACAAJ' });
		expect(res).toMatchSnapshot();
	});
});

// =====================================================

//	// GET_RICK_AND_MORTY_CHARACTER
//	describe('[Query.character]', () => {
//	});
