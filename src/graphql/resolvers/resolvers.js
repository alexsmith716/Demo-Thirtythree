import { paginateResults } from '../utils/utils';
import { GoogleBooksAPI } from '../datasources/googleBooksAPI';
import graphqlClient from '../../apollo/graphqlClient';

import { GET_RICK_AND_MORTY_CHARACTER, GET_RICK_AND_MORTY_CHARACTERS, GET_RICK_AND_MORTY_CHARACTERS_BY_IDS, } from '../queries/queries';

export const dataSources = () => ({
	googleBooks: new GoogleBooksAPI(),
});


export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		//  character: async (obj, { id }, { dataSources }) => (
		//  	dataSources.rickAndMortyAPICharacter.character({ id })
		//  ),

		// RESTDatasource
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

		// RESTDatasource
		googleBook: async (obj, { id }, { dataSources }) => {
			const book = await dataSources.googleBooks.getBook({ id });
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > googleBook > book: ', book);
			return book;
		},

		// returned resolver value must match return type in schema

		// No Datasource
		character: async (obj, { id }) => {
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > ID: ', id);
			const response = await graphqlClient({ endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTER, variables: {id: id}});
			const { data: { character }} = response;
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > character: ', character);
			return {
				...character
			}
		},

		// No Datasource
		characters: async (obj, { page, filter }) => {
			const response = await graphqlClient({ endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTERS, variables: {page: page, filter: filter}});
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > response: ', response);
			//	const { data: { characters }} = response;
			//	console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > characters: ', characters);
			const { data: { characters: {results} } } = response;
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > results: ', results);
			return results;
		},

		// No Datasource
		charactersByIds: async (obj, { ids }) => {
			const response = await graphqlClient({ endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTERS_BY_IDS, variables: {ids: ids}});
			const { data: { charactersByIds }} = response;
			console.log('>>>>>>>>>>>>> RESOLVERS > Query > rickAndMortyCharacter > charactersByIds: ', charactersByIds);
			return charactersByIds;
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
};
