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

		googleBooksList: async (obj, { after, searchString, orderBy, pageSize = 2, }, { dataSources }) => {
			// dataSources.googleBooks.getBooks(searchString, startIndex, orderBy, maxResults)

			console.log('????????????? > after: ', after)
			console.log('????????????? > searchString: ', searchString)
			console.log('????????????? > orderBy: ', orderBy)
			const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);

			// destructured argument -destructure an object into individual variables ({cursor: after})
			const books = paginateResults({ after, pageSize, results: allGoogleBooks });

			console.log('?????????????XXXXXXXXXXX@@@@@@@@@@@@@ > books: ', books)

			const c = books.length ? books[books.length - 1].cursor : null;

			console.log('?????????????XXXXXXXXXXX@@@@@@@@@@@@@ > cursor?????: ', c)

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
