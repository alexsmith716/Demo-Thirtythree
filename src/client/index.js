import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';
import localForage from 'localforage';
import { getStoredState } from 'redux-persist';
import { Provider } from 'react-redux';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import asyncGetPromises from '../utils/asyncGetPromises';
import { RouterTrigger } from '../components/RouterTrigger/RouterTrigger';
import routes from './routes';
import { apiClient } from '../helpers/apiClient';
import configureStore from '../redux/configureStore';
import isOnline from '../utils/isOnline';
import '../styled/fonts.css';

import { ThemeContext } from '../styled/ThemeContext';

const persistConfig = {
	key: 'root',
	storage: localForage,
	// redux-persist:
	// inboundState:  the state being rehydrated from storage
	// originalState: the state before the REHYDRATE action
	stateReconciler(inboundState, originalState) {
		// preloadedState from window object
		return originalState;
	},
	// redux-persist:
	// whitelist: ['info', 'infoAlert', 'infoAlertThree',],
};

const spinnerContainer = document.createElement('div');
spinnerContainer.classList.add('spinner-progress');
const dest = document.getElementById('react-root');
document.body.insertBefore(spinnerContainer, dest);

const client = apiClient();

const providers = {
	client,
};

// =====================================================

const render = async () => {
	// redux-persist:
	// delays rendering of app UI until persisted state has been retrieved and saved to redux
	const preloadedState = await getStoredState(persistConfig);
	const online = window.REDUX_DATA ? true : await isOnline();
	const history = createBrowserHistory();

	const store = configureStore({
		history,
		data: {
			...preloadedState,
			...window.REDUX_DATA,
			online,
		},
		helpers: providers,
		persistConfig,
	});

	// =====================================================

	const httpLink = createHttpLink({
		uri: 'https://rickandmortyapi.com/graphql/',
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(`>>>> CLIENT > [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,),
			);
		}

		if (networkError) {
			console.log(`>>>> CLIENT > [Network error]: ${networkError}`);
		}
	});

	const link = ApolloLink.from([
		errorLink,
		httpLink,
	]);

	// https://github.com/apollographql/apollo-client/blob/main/docs/source/pagination/core-api.mdx
	// https://github.com/apollographql/apollo-client/docs/source/local-state/reactive-variables.mdx
	// https://github.com/apollographql/apollo-client/docs/source/local-state/managing-state-with-field-policies
	const clientCache = new InMemoryCache({
		typePolicies: {
			// =====================================================
			Query: {
				fields: {
					// --------------------------------------
					// define field policy for "googleBooksList"
					// define field policy to merge the results of paginated queries into a single list
					// googleBooksList: relayStylePagination(),
					googleBooksList: {
						keyArgs: false,
						merge(existing, incoming) {
							//console.log('>>>> CLIENT > InMemoryCache > existing AAAAAAAA: ', existing);
							//console.log('>>>> CLIENT > InMemoryCache > incoming BBBBBBBB: ',  incoming);
							let books = [];
							if (existing && existing.books) {
								books = books.concat(existing.books);
							}
							if (incoming && incoming.books) {
								books = books.concat(incoming.books);
							}
							const q = {...incoming}
							const w = {books}
							const x = {...incoming, books}
							//console.log('>>>> CLIENT > InMemoryCache > incoming CCCCCCCCCCC: ',  q);
							//console.log('>>>> CLIENT > InMemoryCache > books DDDDDDDDDDD: ',  w);
							//console.log('>>>> CLIENT > InMemoryCache > incoming EEEEEEEE: ', x);
							return {
								...incoming,
								books,
							};
						}
					}
				}
			}
		}
	});

	const clientApollo = new ApolloClient({
		ssrMode: false,
		cache: clientCache.restore(window.__APOLLO_STATE__),
		link,
	});

	// =====================================================

	const triggerHooks = async (hydrateRoutes, pathname) => {
		spinnerContainer.classList.add('spinner');
		if (window.__PRELOADED__) {
			delete window.__PRELOADED__;
		} else {
			await asyncGetPromises(hydrateRoutes, pathname, store);
		}
		spinnerContainer.classList.remove('spinner');
	};

	const hydrate = (hydrateRoutes) => {
		const element = (
			<HelmetProvider>
				<ApolloProvider client={clientApollo}>
					<Provider store={store}>
						<Router history={history}>
							<ThemeContext>
								<RouterTrigger triggerProp={(pathname) => triggerHooks(hydrateRoutes, pathname)}>
									{renderRoutes(hydrateRoutes)}
								</RouterTrigger>
							</ThemeContext>
						</Router>
					</Provider>
				</ApolloProvider>
			</HelmetProvider>
		);


		if (dest && dest.innerHTML !== "") {
			console.log('############## CLIENT > ReactDOM.hydrate 00000 ###########')
		} else {
			console.log('############## CLIENT > ReactDOM.render 00000 ###########')
		}

		if (dest.hasChildNodes()) {
			console.log('############## CLIENT > ReactDOM.hydrate 111111 ###########')
			ReactDOM.hydrate(element, dest);
		} else {
			console.log('############## CLIENT > ReactDOM.render 111111 ###########')
			ReactDOM.render(element, dest);
		}
	};

	hydrate(routes);
};

loadableReady(() => {
	render();
});
