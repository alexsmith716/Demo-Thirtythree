import * as express from 'express';
import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-express';

const { KaplanTestPrepBooks } = require('./datasources/googleBooksAPI');
const { RickAndMortyAPICharacter } = require('./datasources/rickAndMortyAPI');

// ===============================================

// schema
const typeDefs = gql`
	type Book {
		id: String!
		title: String
	}

	type SearchResult {
		books: [Book]
	}

	type Query {
		hello: String

		character(id: ID): Character

		search(searchString: String!): SearchResult
	}

	type Character {
		id: ID

		name: String

		status: String

		species: String

		type: String

		gender: String

		origin: Location

		location: Location

		image: String

		episode: [Episode]

		created: String
	}

	type Location {
		id: ID

		name: String

		type: String

		dimension: String

		residents: [Character]

		created: String
	}

	type Episode {
		id: ID

		name: String

		air_date: String

		episode: String

		characters: [Character]

		created: String
	}
`;

// ===============================================

// resolver functions
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		character: async (_, { id }, { dataSources }) => (
			dataSources.rickAndMortyAPICharacter.character({ id })
		),
		search: async (_, { searchString }, { dataSources }) => (
			dataSources.kaplanTestPrepBooks.getBooks(searchString)
		),
	},
	Book: {
		id: ({ id }) => id,
		title: ({ volumeInfo: { title } }) => title,
	},
	SearchResult: {
		books: ({ items }) => items,
	}
};

// ===============================================

const dataSources = () => ({
	kaplanTestPrepBooks: new KaplanTestPrepBooks(),
	rickAndMortyAPICharacter: new RickAndMortyAPICharacter(),
});

// ===============================================

export function apolloServer(app) {
	
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources,
	});

	apollo.applyMiddleware({ app, path: '/graphql' });
}
