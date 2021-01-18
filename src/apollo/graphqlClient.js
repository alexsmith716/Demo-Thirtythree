import fetch from 'isomorphic-fetch';

export default function graphqlClient({ endpoint, method='POST', query }) {

	console.log('>>>> graphqlClient > endpoint: ', endpoint);
	console.log('>>>> graphqlClient > method: ', method);
	console.log('>>>> graphqlClient > query: ', query);

	//	fetch('http://localhost:4000', {
	//		method: 'POST',
	//		headers: { 'Content-Type': 'application/json' },
	//		body: JSON.stringify({ query: `

	//			}` 
	//		}),
	//	})
	//	.then(res => res.json())
	//	.then(res => console.log(res.data));

	return 'graphqlClient';
}
