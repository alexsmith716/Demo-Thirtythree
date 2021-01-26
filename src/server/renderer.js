import path from 'path';
import React from 'react';
import { renderToNodeStream, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router, StaticRouter } from 'react-router';
import { createMemoryHistory } from 'history';
import { renderRoutes } from 'react-router-config';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, gql } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

import apolloClient from '../apollo/apolloClient';
import asyncGetPromises from '../utils/asyncGetPromises';
import routes from '../client/routes';
import configureStore from '../redux/configureStore';
import initialStatePreloaded from '../redux/initial-preloaded-state';
import { getUserAgent, isBot } from '../utils/device';
import Html from '../helpers/Html';
import { apiClient } from '../helpers/apiClient';
// -------------------------------------------------------------------

import { GetRickAndMortyCharacter, GetRickAndMortyCharacterIdOne } from '../graphql/queries/queries.graphql';
import * as graphqlQueries from '../graphql/queries/queries';

// -------------------------------------------------------------------

const nodeStats = path.resolve(__dirname,'../../public/dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname,'../../public/dist/web/loadable-stats.json');

// -------------------------------------------------------------------

export async function get(req, res) {
	const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

	const preloadedState = initialStatePreloaded(req);

	console.log('>>>> RENDERER > preloadedState: ', preloadedState)
	console.log('>>>> RENDERER > req.counterPreloadedState: ', req.counterPreloadedState)
	console.log('>>>> RENDERER > req.userAgent: ', req.userAgent)
	console.log('>>>> RENDERER > req.isBot: ', req.isBot)

	const providers = {
		client: apiClient(req),
	};

	const store = configureStore({
		history,
		data: { ...preloadedState },
		helpers: providers,
	});

	store.subscribe(() => console.log('>>>> RENDERER > configureStore > store.getState(): ', store.getState()));

	const sheet = new ServerStyleSheet();

	// =====================================================

	const clientApollo = apolloClient({ uri: 'http://localhost:8080/graphql/', ssrMode: true });

	// =====================================================
	const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
	const { default: AppX } = nodeExtractor.requireEntrypoint('main');
	const extractor = new ChunkExtractor({ statsFile: webStats });
	// =====================================================

	// =====================================================
	const linkElements = extractor.getLinkElements();
	const styleElements = extractor.getStyleElements();
	const scriptElements = extractor.getScriptElements();
	// =====================================================

	function hydrate() {
		console.log('############## RENDERER > HYDRATE ###########');
		res.write('<!DOCTYPE html>');
		const stream = renderToNodeStream(<Html linkElements={linkElements} styleElements={styleElements} scriptElements={scriptElements} store={JSON.stringify(store)} />);
		stream.pipe(res);
	}

	//  //  if (__DISABLE_SSR__) {
	//  //    return hydrate();
	//  //  }
	// =====================================================

	await asyncGetPromises(routes, req.path, store);

	//  try {
	//  	const gbram = await clientApollo.query({
	//  		query: graphqlQueries.GET_GOOGLE_BOOKS,
	//  		variables: {
	//  			searchString: 'rick and morty',
	//  			orderBy: 'newest',
	//  		},
	//  	});
	//  	console.log('>>>> RENDERER > GetRickAndMortyCharacter: ', JSON.stringify(gbram));
	//  } catch (error) {
	//  	console.error('>>>> RENDERER > GetRickAndMortyCharacter > ERROR: ', error);
	//  }

	//	try {
	//		const characterTen = await clientApollo.query({ query: GetRickAndMortyCharacter, variables: { id: 10 }});
	//		console.log('>>>> RENDERER > GetRickAndMortyCharacter: ', characterTwo);
	//	} catch (error) {
	//		console.error('>>>> RENDERER > GetRickAndMortyCharacter > ERROR: ', error);
	//	}

	//	try {
	//		const characterNine = await clientApollo.query({ query: graphqlQueries.GET_A_RICK_AND_MORTY_CHARACTER, variables: { id: 9 }});
	//		console.log('>>>> RENDERER > GET_A_RICK_AND_MORTY_CHARACTER_FULL: ', characterNine);
	//	} catch (error) {
	//		console.error('>>>> RENDERER > GET_A_RICK_AND_MORTY_CHARACTER_FULL > ERROR: ', error);
	//	}

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

	// ==========================================================================

	try {

		const AppY = () => React.createElement(AppX);

		const AppZ = JSON.stringify(AppY);

		const helmetContext = {};
		const context = {};

		const App = (
			<HelmetProvider context={helmetContext}>
				<ApolloProvider client={clientApollo}>
					<Provider store={store}>
						<Router history={history}>
							<StaticRouter location={req.originalUrl} context={context}>
								{ AppZ }
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
		const tree = extractorZ.collectChunks(App)
		// =====================================================

		// =====================================================
		// The `getDataFromTree` function takes your React tree, determines which queries are needed to render them, and then fetches them all.
		// It does this recursively down the whole tree if you have "nested queries".
		// It returns a promise which resolves when the data is ready in your Apollo Client store.

		// At the point that the promise resolves, your Apollo Client store will be completely initialized,
		//   which should mean your app will now render instantly (since all queries are prefetched) and
		//   you can return the stringified results in the response:

		// getMarkupFromTree:
		//    returns a promise for the generated HTML, so no an extra render to get the HTML

		// await GraphQL data coming from the API server
		// determines which queries are needed to render, then fetch them all
		await getDataFromTree(tree);
		//  await Promise.all([getDataFromTree(tree)]);
		//  await Promise.all([getMarkupFromTree({tree, renderFunction: renderToStaticMarkup})]);
		// =====================================================

		// =====================================================
		const content = renderToString(sheet.collectStyles(tree));
		// =====================================================

		// =====================================================
		const linkElementsZ = extractorZ.getLinkElements();
		const styleElementsZ = extractorZ.getStyleElements();
		const scriptElementsZ = extractorZ.getScriptElements();
		// =====================================================

		// =====================================================
		const styledComponents = sheet.getStyleElement();
		// =====================================================

		// =====================================================
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
		console.log('>>>> RENDERER > RESPONSE > ERROR: ', error);
		// return res.status(500).send(error);
		res.status(500)
		hydrate();
	} finally {
		sheet.seal()
	}
};
