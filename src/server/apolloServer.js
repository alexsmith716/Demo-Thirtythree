import * as express from 'express';
import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-express';

// schema
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

// resolver functions
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
	},
};

export function apolloServer(app) {
	
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
	});

	apollo.applyMiddleware({ app, path: '/graphql' });
}
