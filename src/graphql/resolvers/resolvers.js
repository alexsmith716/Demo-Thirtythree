import { paginateResults } from '../utils/utils';
import { GoogleBooksAPI } from '../datasources/googleBooksAPI';
import graphqlClient from '../../apollo/graphqlClient';

import { GET_RICK_AND_MORTY_CHARACTER, GET_RICK_AND_MORTY_CHARACTERS, GET_RICK_AND_MORTY_CHARACTERS_BY_IDS, } from '../queries/queries';

export const dataSources = () => ({
	googleBooks: new GoogleBooksAPI(),
});

// https://github.com/apollographql/apollo-client/blob/docs/source/data/error-handling.mdx

// Resolver functions take the following positional arguments, in order:
// parent, args, context, info
export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		googleBooks: async (obj, { after, searchString, orderBy, pageSize = 2, }, { dataSources }) => {
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > after: ', after);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > searchString: ', searchString);
			// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > orderBy: ', orderBy);
			try {
				const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);
				const books = paginateResults({ after, pageSize, results: allGoogleBooks });

				// console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > books: ', books);

				return {
					books,
					cursor: books.length ? books[books.length - 1].cursor : null,
					hasMore: books.length
						? books[books.length - 1].cursor !==
							allGoogleBooks[allGoogleBooks.length - 1].cursor
						: false,
				};
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > googleBooks > ERROR: ', error);
			}
		},

		googleBook: async (obj, { id }, { dataSources }) => {
			try {
				const book = await dataSources.googleBooks.getBook({ id });
				return book;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > googleBook > ERROR: ', error);
			}
		},

		character: async (obj, { id }) => {
			try {
				const response = await graphqlClient({endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTER, variables: {id: id}});
				const { data: { character }} = response;
				console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > character: ', character);
				return {
					...character
				}
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > character > ERROR: ', error);
			}
		},

		characters: async (obj, { page, filter }) => {
			try {
				const response = await graphqlClient({endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTERS, variables: {page: page, filter: filter}});
				console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > response: ', response);
				const { data: { characters }} = response;
				console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > characters: ', characters);
				return characters;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > characters > ERROR: ', error);
			}
		},

		charactersByIds: async (obj, { ids }) => {
			try {
				const response = await graphqlClient({endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTERS_BY_IDS, variables: {ids: ids}});
				const { data: { charactersByIds }} = response;
				console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > charactersByIds: ', charactersByIds);
				return charactersByIds;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > charactersByIds > ERROR: ', error);
			}
		},
	},

	// https://github.com/apollographql/apollo-client/blob/main/docs/source/data/mutations.mdx#updating-a-single-existing-entity
	// if mutation updates a single entity, AC automatically updates that value in cache when the mutation returns
	Mutation: {
		googleBookModifyFavorite: async (obj, { id, favorite }, { dataSources }) => {
			try {
				const book = await dataSources.googleBooks.getBook({ id });
				book.favorite = favorite;
				return {
					success: true,
					message: 'added to favorites',
					books: [book],
				};
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Mutation > googleBookModifyFavorite > ERROR: ', error);
			}
		},
	},
};
