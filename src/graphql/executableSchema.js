import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers/resolvers';
import { typeDefs } from './schema/schema';


export const executableSchema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

// =====================================================

export const constructTestServer = () => {

	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	return { server };
};
