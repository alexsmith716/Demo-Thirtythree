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

			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooksList > after: ', after);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooksList > searchString: ', searchString);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooksList > orderBy: ', orderBy);
			const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);

			// destructured argument -destructure an object into individual variables ({cursor: after})
			const books = paginateResults({ after, pageSize, results: allGoogleBooks });
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooksList > books: ', books);

			const c = books.length ? books[books.length - 1].cursor : null;
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooksList > cursor: ', c);

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

  // https://github.com/apollographql/apollo-client/blob/main/docs/source/data/mutations.mdx#updating-a-single-existing-entity
  // if mutation updates a single entity, AC automatically updates that value in cache when the mutation returns
	Mutation: {
		googleBookModifyFavorite: async (obj, { googleBookId, favorite }, { dataSources }) => {
			const book = await dataSources.googleBooks.getBook({ googleBookId });
			book.favorite = favorite;
			// console.log('>>>>>>>>>>>>> RESOLVERS > Mutation > googleBookModifyFavorite > book: ', book);
			return {
				success: true,
				message: 'added to favorites',
				books: [book],
			};
		},
	},

	//	Book: {
	//	}
};
