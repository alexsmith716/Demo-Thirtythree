import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';

// =========================
import { ApolloClient, createHttpLink, ApolloLink, execute } from '@apollo/client';
import fetch from 'isomorphic-fetch';
import { typeDefs } from '../schema/schema';
import { resolvers } from '../resolvers/resolvers';
// =========================

import { GoogleBooksAPI } from '../datasources/googleBooksAPI';

/**
 * Integration testing utils
 */

export const constructTestServer = () => {

	const googleBooks = new GoogleBooksAPI();

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: () => ({ googleBooks }),
	});

	return { server, googleBooks };
};

// =========================

export const startTestServer = async () => {
	const app = express();
	const googleBooks = new GoogleBooksAPI();

	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: () => ({ googleBooks }),
	});

	apollo.applyMiddleware({ app, path: '/graphql' });

	const server = createServer(app);

	const httpServer = await server.listen({ port: 8080 });

	const httpLink = createHttpLink({
		uri: 'http://localhost:8080/graphql/',
		fetch: fetch,
	});

	const link = ApolloLink.from([
		httpLink,
	]);

	const executeOperation = ({ query, variables = {} }) =>
		execute(link, { query, variables });

	return {
		link,
		stop: () => httpServer.close(),
		graphql: executeOperation,
	};
};
