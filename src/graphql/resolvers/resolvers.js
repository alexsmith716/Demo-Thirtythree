import { paginateResults } from '../utils/utils';
import { KaplanTestPrepBooks } from '../datasources/googleBooksAPI';
import { RickAndMortyAPICharacter } from '../datasources/rickAndMortyAPI';

export const dataSources = () => ({
	kaplanTestPrepBooks: new KaplanTestPrepBooks(),
	rickAndMortyAPICharacter: new RickAndMortyAPICharacter(),
});

export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		character: async (obj, { id }, { dataSources }) => (
			dataSources.rickAndMortyAPICharacter.character({ id })
		),

		search: async (obj, { pageSize=2, after }, { dataSources }) => {
			// dataSources.kaplanTestPrepBooks.getBooks(searchString, startIndex, orderBy, maxResults)
			const allKtpBooks = await dataSources.kaplanTestPrepBooks.getBooks();

			const books = paginateResults({
				after,
				pageSize,
				results: allKtpBooks,
			});

			return {
				books,
				cursor: books.length ? books[books.length - 1].cursor : null,
				hasMore: books.length
					? books[books.length - 1].cursor !==
						allKtpBooks[allKtpBooks.length - 1].cursor
					: false,
			};
		},
	},
};
