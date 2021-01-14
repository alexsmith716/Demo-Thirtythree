import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
//	import fetch from 'node-fetch';
import fetch from 'isomorphic-fetch';

export default function apolloClient({ uri, ssrMode = false }) {

	const httpLink = createHttpLink({
		uri: uri,
		// fetch: ssrMode ? fetch : null,
		fetch: fetch,
	});

	const errorLink = onError(({ operation, response, graphQLErrors, networkError, forward }) => {
		if (graphQLErrors) {
			//	for (let err of graphQLErrors) {
			//		switch (err.extensions.code) {
			//			case 'ENOTFOUND':
			//				return null;
			//		}
			//	}
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(`>>>> apolloClient > [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,),
			);
		}

		if (networkError) {
			console.log(`>>>> apolloClient > [Network error]: ${networkError}`);
		}

		//	if (operation.operationName === "IgnoreErrorsQuery") {
		//		response.errors = null;
		//	}
	});

	const link = ApolloLink.from([
		errorLink,
		httpLink,
	]);

	let cache = new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					// --------------------------------------
					googleBooksList: {
						keyArgs: false,
						merge(existing, incoming) {
							let books = [];
							if (existing && existing.books) {
								books = books.concat(existing.books);
							}
							if (incoming && incoming.books) {
								books = books.concat(incoming.books);
							}
							return {
								...incoming,
								books,
							};
						}
					}
					// --------------------------------------
				}
			}
		}
	});

	console.log('>>>> apolloClient > InMemoryCache: ', cache.extract());

	if (!ssrMode) {
		cache = cache.restore(window.__APOLLO_STATE__);
	}

	//	* none: 	This is the default policy to match how Apollo Client 1.0 worked. 
	//							Any GraphQL Errors are treated the same as network errors and any data is ignored from the response.

	//	* ignore: Ignore allows you to read any data that is returned alongside GraphQL Errors,
	//							but doesn't save the errors or report them to your UI.

	//	* all: 		Using the all policy is the best way to notify your users of potential issues while still showing as much data as possible from your server.
	//							It saves both data and errors so your UI can use them.
	// -----------------------------------------------------------
	return new ApolloClient({
		link,
		cache,
		ssrMode,
		defaultOptions: {
			//	watchQuery: {
			//		fetchPolicy: 'cache-and-network',
			//		errorPolicy: 'all',
			//	},
			//	query: {
			//		fetchPolicy: 'network-only',
			//		errorPolicy: 'all',
			//	},
			//	mutate: {
			//		errorPolicy: 'all',
			//	},
		},
	});
}
