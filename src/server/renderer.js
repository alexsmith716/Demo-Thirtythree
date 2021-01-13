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
import fetch from 'node-fetch';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, ApolloLink, gql } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getDataFromTree } from '@apollo/client/react/ssr';
// -------------------------------------------------------------------
import asyncGetPromises from '../utils/asyncGetPromises';
import routes from '../client/routes';
import configureStore from '../redux/configureStore';
import initialStatePreloaded from '../redux/initial-preloaded-state';
import { getUserAgent, isBot } from '../utils/device';
import Html from '../helpers/Html';
import { apiClient } from '../helpers/apiClient';
// -------------------------------------------------------------------
import { GetRickAndMortyCharacter, GetRickAndMortyCharacterIdOne } from '../graphql/queries/queries.graphql';
import * as graphqlQueries from '../graphql/queries/queries.js';
//import { resolvers } from '../graphql/resolvers/resolvers.js';
// -------------------------------------------------------------------

//  provide for client ("to avoid network calls and mocking data"):
//  https://github.com/apollographql/apollo-client/blob/master/docs/source/api/link/apollo-link-schema.md
//  https://graphql.org/graphql-js/graphql/#entry-point

//  When performing SSR on the same server, you can use this library to avoid making network calls
//  build "new SchemaLink({ schema })"

//  pre-fetch needed data (graphql/REST) and build a schema
//  pre-fetch needed data (graphql/REST) (SchemaLink) on server for SSR

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

	//  Composing a link chain:
	//  Each link should represent a self-contained modification to a GraphQL operation. 
	//  By composing these links into a chain, you can create an arbitrarily complex model for your client's data flow.

	//  There are two forms of link composition: additive and directional.
	//    * Additive composition involves combining a set of links into a serially executed chain.
	//    * Directional composition involves branching to one of multiple links, depending on the details of an operation.
	//  Directional composition: defined with the "split" method of an ApolloLink instance

	//  https://www.apollographql.com/docs/react/v3.0-beta/api/link/apollo-link-rest/
	//  setup "RestLink" instance:
	//  specify endpoint to use in the rest directive:

	//  https://github.com/afuh/rick-and-morty-api
	//  REST:     https://rickandmortyapi.com/api/
	//  GRAPHQL:  https://rickandmortyapi.com/graphql/
	//            http://localhost:4000/graphql

	const httpLink = createHttpLink({
		uri: 'https://rickandmortyapi.com/graphql/',
		//	uri: 'http://localhost:8080/graphql/',
		// fetch: customFetch,
		fetch: fetch,
	});

	const cache = new InMemoryCache();

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors && graphQLErrors?.length > 0) {
			//  catchError((e) => handleError(e))
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(
					`>>>> RENDERER > [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
				),
			);
		}

		// https://hasura.io/blog/handling-graphql-hasura-errors-with-react/
		// https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-error#retrying-failed-requests
		if (networkError) {
			console.log(`>>>> RENDERER > [Network error!!!!!]: ${networkError}`);
		}
	});

	//  "httpLink" is terminating so must be last, while retry & error wrap the links to their right
	//  State & context links should happen before (to the left of) restLink
	//  one of "uri" or "link" is required; if both are specified, "link" will take precedence
	const link = ApolloLink.from([
		//  authLink,
		errorLink,
		//  retryLink,
		httpLink,
	]);

	const clientApollo = new ApolloClient({
		ssrMode: true,
		cache,
		link,
		//	resolvers,
	});

	// =====================================================
	const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
	const { default: AppX } = nodeExtractor.requireEntrypoint('main');
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
		console.log('>>>> RENDERER > InMemoryCache > CACHE > cache.extract() 1: ', cache.extract());

		const characterTwo = await clientApollo.query({ query: GetRickAndMortyCharacter, variables: { id: 10 }});
		console.log('>>>> RENDERER > GetRickAndMortyCharacter: ', characterTwo);

		const characterEight = await clientApollo.query({ query: graphqlQueries.GET_A_RICK_AND_MORTY_CHARACTER_BASIC, variables: { id: 8 }});
		console.log('>>>> RENDERER > GET_A_RICK_AND_MORTY_CHARACTER_BASIC: ', characterEight);

		const characterNine = await clientApollo.query({ query: graphqlQueries.GET_A_RICK_AND_MORTY_CHARACTER_FULL, variables: { id: 9 }});
		console.log('>>>> RENDERER > GET_A_RICK_AND_MORTY_CHARACTER_FULL: ', characterNine);

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

		console.log('>>>> RENDERER > InMemoryCache > CACHE > cache.extract() 2: ', cache.extract());

		// ==========================================================================

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
		return res.status(500).send(error);
	} finally {
		sheet.seal()
	}
};
