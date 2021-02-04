import { resolvers } from '../resolvers/resolvers';

describe('[Query.googleBooks]', () => {
	const mockContext = {
		dataSources: {
			googleBooks: { getBooks: jest.fn() },
		},
	};

	// just for easy access
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
	});
});

describe('[Query.googleBook]', () => {
	const mockContext = {
		dataSources: {
			googleBooks: { getBook: jest.fn() },
		},
	};

	it('calls lookup from googleBook api', async () => {
		const getBook = mockContext.dataSources.googleBooks.getBook;
		getBook.mockReturnValueOnce({
			id: 'uW_zzQEACAAJ',
		});

		// check the resolver response
		const res = await resolvers.Query.googleBook(null, { id: 'uW_zzQEACAAJ' }, mockContext);
		expect(res).toEqual({ id: 'uW_zzQEACAAJ' });

		// make sure the dataSources were called properly
		expect(getBook).toBeCalledWith({ id: 'uW_zzQEACAAJ' });
	});
});
