import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	gql,
	useQuery,
	useMutation,
	useApolloClient,
} from '@apollo/client';

import * as Styles from './styles';

import { GetCharacter } from '../../graphql/queries/queries.graphql';
import * as graphqlQueries from '../../graphql/queries/queries';

//  <Styles.GraphQLExample></Styles.GraphQLExample>


const GraphQLExample = () => {

	return (
		<>
			<Helmet title="GraphQL Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">GraphQL Example!</h1>

				{/* ---------------------------------------------- */}

				<div className="mb-5">
					<div>
						<p>
							Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.
						</p>
						<p>
							Apollo Client helps you structure code in an economical, predictable, and declarative way that's consistent with modern development practices. The core @apollo/client library provides built-in integration with React, and the larger Apollo community maintains integrations for other popular view layers.
						</p>
					</div>
				</div>

			</div>
		</>
	);
};

export default GraphQLExample;
