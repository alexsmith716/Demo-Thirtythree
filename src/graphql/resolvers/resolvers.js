import { paginateResults } from '../utils/utils';
import { GoogleBooks } from '../datasources/googleBooksAPI';
import { RickAndMortyAPICharacter } from '../datasources/rickAndMortyAPI';

export const dataSources = () => ({
	googleBooks: new GoogleBooks(),
	rickAndMortyAPICharacter: new RickAndMortyAPICharacter(),
});

export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		character: async (obj, { id }, { dataSources }) => (
			dataSources.rickAndMortyAPICharacter.character({ id })
		),

		search: async (obj, { pageSize = 2, after, searchString, orderBy }, { dataSources }) => {
			// dataSources.googleBooks.getBooks(searchString, startIndex, orderBy, maxResults)

			console.log('????????????? > after: ', after)
			console.log('????????????? > searchString: ', searchString)
			console.log('????????????? > orderBy: ', orderBy)
			const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);

			const books = paginateResults({
				after,
				pageSize,
				results: allGoogleBooks,
			});

			console.log('?????????????XXXXXXXXXXX@@@@@@@@@@@@@ > books: ', books)

			return {
				books,
				cursor: books.length ? books[books.length - 1].cursor : null,
				hasMore: books.length
					? books[books.length - 1].cursor !==
						allGoogleBooks[allGoogleBooks.length - 1].cursor
					: false,
			};
		},
	},
};
