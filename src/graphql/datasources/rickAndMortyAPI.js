import { DataSource } from 'apollo-datasource';
import fetch from 'isomorphic-fetch';

// import graphqlClient from '../../apollo/graphqlClient';
import { GET_RICK_AND_MORTY_CHARACTER, } from '../queries/queries.js';

export class RickAndMortyAPI extends DataSource {
	constructor() {
		super();
		this.baseURL = 'https://rickandmortyapi.com/graphql';
	}

	graphqlClient({ query, variables={}, method='POST' }) {
		return fetch('https://rickandmortyapi.com/graphql', {
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
				console.log('>>>> RickAndMortyAPI > DATA:', JSON.stringify(data));
				return data;
			})
			.catch(err => {
				console.error('>>>> RickAndMortyAPI > ERROR:', err.message);
				return null;
			});
	};

	async getCharacter({id}) {
		try {
			const response = await this.graphqlClient({query: GET_RICK_AND_MORTY_CHARACTER, variables: {id: id}});
			return response
		} catch (error) {
			console.error('>>>>>>>>>>>>> RickAndMortyAPI > Query > getCharacter > ERROR: ', error);
			return false;
		}
	}
};
