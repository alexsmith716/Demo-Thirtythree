import fetch from 'isomorphic-fetch';

import { GetRickAndMortyCharacter } from '../graphql/queries/queries.graphql';

var queryA = `{
	character(id: 9) {
		id
		name
		status
		species
		type
		gender
		origin {
			name
			type
			dimension
		}
		location {
			name
			type
			dimension
		}
		image
		episode {
			name
			episode
		}
	}
}`;


export default function graphqlClient({ endpoint, query, variables = {}, method='POST' }) {

	//	console.log('>>>> graphqlClient > endpoint: ', endpoint);
	//	console.log('>>>> graphqlClient > query: ', query);
	//	console.log('>>>> graphqlClient > variables: ', {...variables});
	//	console.log('>>>> graphqlClient > method: ', method);

	fetch(endpoint, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: queryA,
			variables: {...variables}
		}),
	})
		.then(response => response.json())
		.then(data => {
			if (data.error) {
				throw new Error(data.error);
			}
			console.log('>>>> graphqlClient > DATA:', JSON.stringify(data));
			return data;
		})
		.catch(err => {
			console.error('>>>> graphqlClient > ERROR:', err.message);
		});
};
