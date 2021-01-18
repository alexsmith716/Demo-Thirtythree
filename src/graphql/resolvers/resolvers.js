import { paginateResults } from '../utils/utils';
import { GoogleBooksAPI } from '../datasources/googleBooksAPI';
import graphqlClient from '../../apollo/graphqlClient';

import * as graphqlQueries from '../queries/queries.js';

export const dataSources = () => ({
	googleBooks: new GoogleBooksAPI(),
});


// tell Apollo Server how to populate data for every schema field
export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		//  character: async (obj, { id }, { dataSources }) => (
		//  	dataSources.rickAndMortyAPICharacter.character({ id })
		//  ),

		googleBooks: async (obj, { after, searchString, orderBy, pageSize = 2, }, { dataSources }) => {
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > after: ', after);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > searchString: ', searchString);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > orderBy: ', orderBy);
			const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);

			// destructured argument -destructure an object into individual variables ({cursor: after})
			const books = paginateResults({ after, pageSize, results: allGoogleBooks });
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > books: ', books);

			// const c = books.length ? books[books.length - 1].cursor : null;
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > cursor: ', c);

			return {
				books,
				cursor: books.length ? books[books.length - 1].cursor : null,
				hasMore: books.length
					? books[books.length - 1].cursor !==
						allGoogleBooks[allGoogleBooks.length - 1].cursor
					: false,
			};
		},

		googleBook: async (obj, { id }, { dataSources }) => {
			const book = await dataSources.googleBooks.getBook({ id });
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBook > book: ', book);
			return book;
		},

		rickAndMortyCharacter: async (obj, { id }) => {
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > ID: ', id);
			const character = await graphqlClient({ endpoint: 'https://rickandmortyapi.com/graphql/', method: 'POST', query: });
			return character;
		},
	},

	// https://github.com/apollographql/apollo-client/blob/main/docs/source/data/mutations.mdx#updating-a-single-existing-entity
	// if mutation updates a single entity, AC automatically updates that value in cache when the mutation returns
	Mutation: {
		googleBookModifyFavorite: async (obj, { id, favorite }, { dataSources }) => {
			const book = await dataSources.googleBooks.getBook({ id });
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
