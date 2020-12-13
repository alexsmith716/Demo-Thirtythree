import * as express from 'express';
import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-express';

//const KtpBooksAPI = require('./datasources/ktpBooksAPI');
const RickAndMortyAPI = require('./datasources/rickAndMortyAPI');

// ===============================================

// schema
const typeDefs = gql`
	type Query {
		hello: String

		character(id: ID): Character
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
			dataSources.rickAndMortyAPI.character({ id })
		),
	},
};

// ===============================================

const dataSources = () => ({
	//ktpBooksAPI: new KtpBooksAPI(),
	rickAndMortyAPI: new RickAndMortyAPI(),
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
