import React, {useEffect} from 'react';
import GraphiQL from 'graphiql';
import * as Styles from './styles';
import 'graphiql/graphiql.css';

const GraphiQLPage = () => {

	useEffect(() => {
			// componentDidMount
			console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLPage > useEffect() > componentDidMount');
			// componentWillUnmount
			return () => {
				// some effects might require cleanup
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLPage > useEffect() > componentWillUnmount > cleanup phase');
			};
		},
		[]
	);

	return (
		<Styles.GraphiQLPage>
			<GraphiQL
				fetcher={async (graphQLParams) => {
					const data = await fetch('https://rickandmortyapi.com/graphql', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(graphQLParams),
					});
					return data.json().catch(() => data.text());
				}}
			/>
		</Styles.GraphiQLPage>
	);
};

export default GraphiQLPage;

// http://localhost:4000/graphql
// https://rickandmortyapi.com/graphql
// https://api.github.com/graphql
