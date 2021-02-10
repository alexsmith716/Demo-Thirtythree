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
					googleBooks: {
						keyArgs: false,
						//	read(existing, options) {
						//		return existing ? existing : undefined;
						//	},
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
					},
					// --------------------------------------
					characters: {
						keyArgs: false,
						merge(existing = {}, incoming, { args }) {

							console.log('#################### apolloClient ####################')

							const page = args && args['page'];

							//  if (page === 1) {
							//  	return incoming;
							//  }

							let results = [];

							if (existing && existing.results) {
								results = results.concat(existing.results);
							}

							if (incoming && incoming.results) {
								//	const newItems = incoming.results.filter(
								//		(i) => !results.map((r) => r['__ref']).includes(i['__ref']),
								//	);
								//	results = results.concat(newItems);
								results = results.concat(incoming.results);
							}
							return {
								...incoming,
								results,
							};
						},
					},
					// --------------------------------------
					//	charactersByIds: {
					//		keyArgs: false,
					//	}
					// --------------------------------------
				}
			}
		}
	});

	console.log('>>>> apolloClient > InMemoryCache: ', cache.extract());

	if (!ssrMode) {
		cache = cache.restore(window.__APOLLO_STATE__);
	}

	//	* none: 	the default policy
	//							Any GraphQL Errors are treated the same as network errors and any data is ignored from the response

	//	* ignore: allows to read any data that is returned alongside GraphQL Errors,
	//							but doesn't save the errors or report them to UI

	//	* all: 		the best way to notify users of potential issues while still showing as much data as possible from server
	//							It saves both data and errors so UI can use them
	// -----------------------------------------------------------
	return new ApolloClient({
		link,
		cache,
		ssrMode,
		defaultOptions: {
			watchQuery: {
				// fetchPolicy: 'cache-and-network',
				errorPolicy: 'all',
			},
			query: {
				// fetchPolicy: 'network-only',
				errorPolicy: 'all',
			},
			mutate: {
				errorPolicy: 'all',
			},
		},
	});
}
