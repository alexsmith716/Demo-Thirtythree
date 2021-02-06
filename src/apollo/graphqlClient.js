import fetch from 'isomorphic-fetch';

const graphqlClient = ({ endpoint, query, variables={}, method='POST' }) => {

	//	console.log('>>>> graphqlClient > endpoint: ', endpoint);
	//	console.log('>>>> graphqlClient > query: ', query);
	//	console.log('>>>> graphqlClient > variables: ', {...variables});
	//	console.log('>>>> graphqlClient > method: ', method);

	return fetch(endpoint, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: query,
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
			return null;
		});
};

export default graphqlClient;
