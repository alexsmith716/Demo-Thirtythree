import path from 'path';
import React from 'react';
import { renderToNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router, StaticRouter } from 'react-router';
import { createMemoryHistory } from 'history';
import { renderRoutes } from 'react-router-config';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';
import { ServerStyleSheet } from 'styled-components';
import fetch from 'node-fetch';
import { resolvers } from '../graphql/resolvers/resolvers.js';
import asyncGetPromises from '../utils/asyncGetPromises';
import routes from '../client/routes';
import configureStore from '../redux/configureStore';
import initialStatePreloaded from '../redux/initial-preloaded-state';
import { getUserAgent, isBot } from '../utils/device';

import Html from '../helpers/Html';
import { apiClient } from '../helpers/apiClient';

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, ApolloLink, gql } from '@apollo/client';

import { onError } from '@apollo/client/link/error';
import { getDataFromTree, getMarkupFromTree } from '@apollo/client/react/ssr';

const nodeStats = path.resolve(__dirname,'../../public/dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname,'../../public/dist/web/loadable-stats.json');

// -------------------------------------------------------------------

export async function get(req, res) {
	const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

	const preloadedState = initialStatePreloaded(req);

	console.log('>>>> SERVER > preloadedState!!!!!: ', preloadedState)
	console.log('>>>> SERVER > req.counterPreloadedState!!!!!: ', req.counterPreloadedState)
	console.log('>>>> SERVER > req.userAgent!!!!!: ', req.userAgent)
	console.log('>>>> SERVER > req.isBot!!!!!: ', req.isBot)

	const providers = {
		client: apiClient(req),
	};

	const store = configureStore({
		history,
		data: { ...preloadedState },
		helpers: providers,
	});

	store.subscribe(() => console.log('>>>> SERVER > configureStore > store.getState(): ', store.getState()));

	// =====================================================

	const sheet = new ServerStyleSheet();

	const httpLink = createHttpLink({
		uri: 'http://localhost:4000/graphql',
		// fetch: customFetch,
		fetch: fetch,
	});

	const cache = new InMemoryCache();

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors && graphQLErrors?.length > 0) {
			//  catchError((e) => handleError(e))
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(
					`>>>> SERVER > [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
				),
			);
		}

		if (networkError) {
			console.log(`>>>> SERVER > [Network error!!!!!]: ${networkError}`);
		}
	});

	const link = ApolloLink.from([
		errorLink,
		httpLink,
	]);

	const clientApollo = new ApolloClient({
		ssrMode: true,
		cache,
		link,
		resolvers,
	});

	// =====================================================
	// const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
	// const { default: App } = nodeExtractor.requireEntrypoint('main');
	// const extractor = new ChunkExtractor({ statsFile: webStats });
	//  // =====================================================

	//  // =====================================================
	//  const linkElements = extractor.getLinkElements();
	//  const styleElements = extractor.getStyleElements();
	//  const scriptElements = extractor.getScriptElements();
	//  // =====================================================

	//  function hydrate() {
	//    console.log('############## RENDERER > HYDRATE ###########');
	//    res.write('<!DOCTYPE html>');
	//    const stream = renderToNodeStream(<Html linkElements={linkElements} styleElements={styleElements} scriptElements={scriptElements} store={JSON.stringify(store)} />);
	//    stream.pipe(res);
	//  }

	//  //  if (__DISABLE_SSR__) {
	//  //    return hydrate();
	//  //  }
	//  // =====================================================

	await asyncGetPromises(routes, req.path, store);

	try {
		console.log('>>>> SERVER > InMemoryCache > CACHE > cache.extract() 1: ', cache.extract());

		// ==========================================================================

		clientApollo.writeQuery({
			query: gql`
				query GetCartItems {
					cartItems
				}
			`,
			data: {
				cartItems: ['itemAA', 'itemBB', 'itemCC'],
			},
		});

		console.log('>>>> SERVER > InMemoryCache > CACHE > cache.extract() 2: ', cache.extract());

		const helmetContext = {};
		const context = {};

		const App = (
			<HelmetProvider context={helmetContext}>
				<ApolloProvider client={clientApollo}>
					<Provider store={store}>
						<Router history={history}>
							<StaticRouter location={req.originalUrl} context={context}>
								{renderRoutes(routes)}
							</StaticRouter>
						</Router>
					</Provider>
				</ApolloProvider>
			</HelmetProvider>
		);

		// -------------------------------------------------------------------

		if (context.url) {
			return res.redirect(301, context.url);
		}

		const { location } = history;

		const loc = location.pathname + location.search;
		if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(loc)) {
			return res.redirect(301, location.pathname);
		}

		// =====================================================
		const extractorZ = new ChunkExtractor({ statsFile: webStats });
		// =====================================================

		// =====================================================
		// LOADABLE-COMPONENTS 
		const tree = extractorZ.collectChunks(App)
		// =====================================================

		// =====================================================
		//  @apollo/client/react/ssr
		//  await GraphQL data coming from the API server
		await getDataFromTree(tree);
		//  await Promise.all([getDataFromTree(tree)]);
		//  await Promise.all([getMarkupFromTree({tree, renderFunction: renderToStaticMarkup})]);
		// =====================================================

		// =====================================================
		// STYLED-COMPONENTS 
		const content = renderToString(sheet.collectStyles(tree));
		// =====================================================

		// =====================================================
		const linkElementsZ = extractorZ.getLinkElements();
		const styleElementsZ = extractorZ.getStyleElements();
		const scriptElementsZ = extractorZ.getScriptElements();
		// =====================================================

		// =====================================================
		// STYLED-COMPONENTS
		const styledComponents = sheet.getStyleElement();
		// =====================================================

		// =====================================================
		// LOADABLE-COMPONENTS 
		const storeState = JSON.stringify(store.getState());
		const graphqlState = JSON.stringify(clientApollo.extract());
		// =====================================================

		const html = (
			<Html
				linkElements={linkElementsZ}
				styleElements={styleElementsZ}
				scriptElements={scriptElementsZ}
				store={storeState}
				content={content}
				styledComponents={styledComponents}
				graphqlState={graphqlState}
			/>
		);

		const ssrHtml = `<!DOCTYPE html>${renderToString(html)}`;
		return res.status(200).send(ssrHtml);
	} catch (error) {
		console.log('>>>> SERVER > RESPONSE > ERROR: ', error);
		// const errorHtml = `<!DOCTYPE html><html lang="en"><div>Error Loading. Response Status 500.</div></html>`;
		return res.status(500).send(error);
	} finally {
		sheet.seal()
	}
};
