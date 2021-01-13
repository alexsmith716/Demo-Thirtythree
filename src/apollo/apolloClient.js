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

	const errorLink = onError(({ graphQLErrors, networkError }) => {
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

	return new ApolloClient({
		link,
		cache,
		ssrMode,
		//	defaultOptions: {
		//		watchQuery: {
		//			errorPolicy: 'ignore',
		//		},
		//		query: {
		//			fetchPolicy: 'network-only',
		//			errorPolicy: 'all',
		//		},
		//		mutate: {
		//			errorPolicy: 'all',
		//		},
		//	},
	});
}
