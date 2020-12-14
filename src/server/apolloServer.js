import * as express from 'express';
import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-express';

import { typeDefs } from '../graphql/schema';
import { resolvers, dataSources } from '../graphql/resolvers';

// ===============================================

export function apolloServer(app) {
	
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources,
	});

	apollo.applyMiddleware({ app, path: '/graphql' });
}
