import { paginateResults } from '../utils/utils';
import { GoogleBooksAPI } from '../datasources/googleBooksAPI';
import { RickAndMortyAPI } from '../datasources/rickAndMortyAPI';
import graphqlClient from '../../apollo/graphqlClient';

// https://github.com/ardatan/graphql-tools
// https://github.com/ardatan/graphql-tools/blob/master/website/docs/generate-schema.md
// https://www.apollographql.com/docs/apollo-server/schema/schema/#the-schema-definition-language
// https://github.com/apollographql/apollo-server/blob/docs/source/api/graphql-tools.md

// Every resolver in a GraphQL.js schema accepts four positional arguments:
//		fieldName(obj, args, context, info) { result }

// These arguments have the following meanings and conventional names:
//		* obj: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.
//		* args: An object with the arguments passed into the field in the query. For example, if the field was called with author(name: "Ada"), the args object would be: { "name": "Ada" }.
//		* context: This is an object shared by all resolvers in a particular query, and is used to contain per-request state, including authentication information, dataloader instances, and anything else that should be taken into account when resolving the query. If you're using express-graphql, read about how to set the context in the setup documentation.
//		* info: This argument should only be used in advanced cases, but it contains information about the execution state of the query, including the field name, path to the field from the root, and more. It's only documented in the GraphQL.js source code.

import { GET_RICK_AND_MORTY_CHARACTER, GET_RICK_AND_MORTY_CHARACTERS, GET_RICK_AND_MORTY_CHARACTERS_BY_IDS, } from '../queries/queries';

export const dataSources = () => ({
	googleBooks: new GoogleBooksAPI(),
	rickAndMorty: new RickAndMortyAPI(),
});

// https://github.com/apollographql/apollo-client/blob/docs/source/data/error-handling.mdx

// Resolver functions take the following positional arguments, in order:
// parent, args, context, info
export const resolvers = {
	Query: {
		hello: () => 'Hello world!',

		googleBooks: async (obj, { after, searchString, orderBy, pageSize = 2, }, { dataSources }) => {
			try {
				const allGoogleBooks = await dataSources.googleBooks.getBooks(searchString, orderBy);
				const books = paginateResults({ after, pageSize, results: allGoogleBooks });

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
				return false;
			}
		},

		googleBook: (obj, { id }, { dataSources }) => {
			const book = dataSources.googleBooks.getBook({ id });
			return book;
		},

		character: async (obj, { id }, { dataSources }) => {
			try {
				const character = await dataSources.rickAndMorty.getCharacter({ id });
				return character;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > character > ERROR: ', error);
				return false;
			}
		},

		characters: async (obj, { page, filter }, { dataSources }) => {
			try {
        console.log('#################### RESOLVERS/characters ####################')
				const characters = await dataSources.rickAndMorty.getCharacters({ page, filter });
				return characters;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > characters > ERROR: ', error);
				return false;
			}
		},

		charactersByIds: async (obj, { ids }, { dataSources }) => {
			try {
				const charactersByIds = await dataSources.rickAndMorty.getCharactersByIds({ ids });
				return charactersByIds;
			} catch (error) {
				console.error('>>>>>>>>>>>>> RESOLVERS > Query > charactersByIds > ERROR: ', error);
				return false;
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
				return false;
			}
		},
	},
};
