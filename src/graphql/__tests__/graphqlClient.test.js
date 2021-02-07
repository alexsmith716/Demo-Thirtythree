import nock from 'nock'

import graphqlClient from '../../apollo/graphqlClient';

const mockRickAndMortyCharacter = {
	id: '11',
	name: 'Albert Einstein',
	status: 'Dead',
	species: 'Human',
	type: '',
	gender: 'Male',
	origin: {
		name: 'Earth (C-137)',
		type: 'Planet',
		dimension: 'Dimension C-137'
	},
	location: {
		name: 'Earth (Replacement Dimension)',
		type: 'Planet',
		dimension: 'Replacement Dimension'
	},
	image: 'https://rickandmortyapi.com/api/character/avatar/11.jpeg',
	episode: [ { name: 'A Rickle in Time', episode: 'S02E01' } ]
}

const GET_RICK_AND_MORTY_CHARACTER = `
	query GetRickAndMortyCharacter($id: ID!) {
		character(id: $id) {
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
	}
`;

describe('GraphqlClient', () => {

	describe('graphqlClient', () => {
		afterEach(() => {
			nock.cleanAll()
		});

		it('checks endpoint fetch attempted', async () => {
			nock('https://rickandmortyapi.com').post('/graphql').reply(200, mockRickAndMortyCharacter);

			const res = await graphqlClient({endpoint: 'https://rickandmortyapi.com/graphql', query: GET_RICK_AND_MORTY_CHARACTER, variables: {id: 11}});
			expect(res).toMatchSnapshot();
		})

	})
});
