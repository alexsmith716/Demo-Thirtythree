import { RickAndMortyAPI } from '../rickAndMortyAPI';

const mocks = {
	graphqlClient: jest.fn(),
};

const ds = new RickAndMortyAPI();
ds.graphqlClient = mocks.graphqlClient;


describe('[RickAndMortyAPI.getCharacter]', () => {
	it('should look up single character from api', async () => {
		mocks.graphqlClient.mockReturnValueOnce(mockCharacterResponse);
		const res = await ds.getCharacter({ id: 11 });

		expect(res).toEqual(mockCharacter);
	});
});

describe('[RickAndMortyAPI.getCharacters]', () => {
	it('looks up characters from api', async () => {
		mocks.graphqlClient.mockReturnValueOnce(mockCharactersResponse);
		const res = await ds.getCharacters({ page: 1, filter: 'Beth' });

		expect(res).toEqual(mockCharacters);
	});
});

describe('[RickAndMortyAPI.getCharactersByIds]', () => {
	it('looks up characters from api', async () => {
		mocks.graphqlClient.mockReturnValueOnce(mockCharactersResponseByIds);
		const res = await ds.getCharactersByIds({ ids: [10,12] });

		expect(res).toEqual(mockCharactersByIds);
	});
});

/**
 * MOCK DATA BELOW
 */

export const mockCharactersByIds = [{
	id: "10",
	name: "Alan Rails",
	status: "Dead",
	species: "Human",
	type: "Superhuman (Ghost trains summoner)",
	gender: "Male",
	origin: {
		name: "unknown",
		type: null,
		dimension: null
	},
	location: {
		name: "Worldender's lair",
		type: "Planet",
		dimension: "unknown"
	},
	image: "https://rickandmortyapi.com/api/character/avatar/10.jpeg",
	episode: [{
		name: "Vindicators 3: The Return of Worldender",
		episode: "S03E04"
	}]
}, {
	id: "12",
	name: "Alexander",
	status: "Dead",
	species: "Human",
	type: "",
	gender: "Male",
	origin: {
		name: "Earth (C-137)",
		type: "Planet",
		dimension: "Dimension C-137"
	},
	location: {
		name: "Anatomy Park",
		type: "Microverse",
		dimension: "Dimension C-137"
	},
	image: "https://rickandmortyapi.com/api/character/avatar/12.jpeg",
	episode: [{
		name: "Anatomy Park",
		episode: "S01E03"
	}]
}];

export const mockCharactersResponseByIds = {
	data: {
		charactersByIds: [{
			id: "10",
			name: "Alan Rails",
			status: "Dead",
			species: "Human",
			type: "Superhuman (Ghost trains summoner)",
			gender: "Male",
			origin: {
				name: "unknown",
				type: null,
				dimension: null
			},
			location: {
				name: "Worldender's lair",
				type: "Planet",
				dimension: "unknown"
			},
			image: "https://rickandmortyapi.com/api/character/avatar/10.jpeg",
			episode: [{
				name: "Vindicators 3: The Return of Worldender",
				episode: "S03E04"
			}]
		}, {
			id: "12",
			name: "Alexander",
			status: "Dead",
			species: "Human",
			type: "",
			gender: "Male",
			origin: {
				name: "Earth (C-137)",
				type: "Planet",
				dimension: "Dimension C-137"
			},
			location: {
				name: "Anatomy Park",
				type: "Microverse",
				dimension: "Dimension C-137"
			},
			image: "https://rickandmortyapi.com/api/character/avatar/12.jpeg",
			episode: [{
				name: "Anatomy Park",
				episode: "S01E03"
			}]
		}]
	}
};

export const mockCharacters = {
	info: {
		next: null,
		prev: null,
		pages: 1,
		count: 10
	},
	results: [{
		id: 4,
		name: 'Beth Smith',
		status: 'Alive',
		species: 'Human',
		type: '',
		gender: 'Female',
		origin: {
			name: 'Earth (Replacement Dimension)',
			type: 'Planet',
			dimension: 'Replacement Dimension'
		},
		location: {
			name: 'Earth (Replacement Dimension)',
			type: 'Planet',
			dimension: 'Replacement Dimension'
		},
		image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
		episode: [{
			name: 'Star Mort: Rickturn of the Jerri',
			episode: 'S04E10'
		}]
	}, {
		id: 667,
		name: 'Defiance Beth',
		status: 'Alive',
		species: 'Human',
		type: '',
		gender: 'Female',
		origin: {
			name: 'Earth (Replacement Dimension)',
			type: 'Planet',
			dimension: 'Replacement Dimension'
		},
		location: {
			name: 'Earth (Replacement Dimension)',
			type: 'Planet',
			dimension: 'Replacement Dimension'
		},
		image: 'https://rickandmortyapi.com/api/character/avatar/667.jpeg',
		episode: [{
			name: 'Star Mort: Rickturn of the Jerri',
			episode: 'S04E10'
		}]
	}]
};

export const mockCharactersResponse = {
	data: {
		characters: {
			info: {
				next: null,
				prev: null,
				pages: 1,
				count: 10
			},
			results: [{
				id: 4,
				name: 'Beth Smith',
				status: 'Alive',
				species: 'Human',
				type: '',
				gender: 'Female',
				origin: {
					name: 'Earth (Replacement Dimension)',
					type: 'Planet',
					dimension: 'Replacement Dimension'
				},
				location: {
					name: 'Earth (Replacement Dimension)',
					type: 'Planet',
					dimension: 'Replacement Dimension'
				},
				image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
				episode: [{
					name: 'Star Mort: Rickturn of the Jerri',
					episode: 'S04E10'
				}]
			}, {
				id: 667,
				name: 'Defiance Beth',
				status: 'Alive',
				species: 'Human',
				type: '',
				gender: 'Female',
				origin: {
					name: 'Earth (Replacement Dimension)',
					type: 'Planet',
					dimension: 'Replacement Dimension'
				},
				location: {
					name: 'Earth (Replacement Dimension)',
					type: 'Planet',
					dimension: 'Replacement Dimension'
				},
				image: 'https://rickandmortyapi.com/api/character/avatar/667.jpeg',
				episode: [{
					name: 'Star Mort: Rickturn of the Jerri',
					episode: 'S04E10'
				}]
			}]
		}
	}
};

export const mockCharacter = {
	id: "11",
	name: "Albert Einstein",
	status: "Dead",
	species: "Human",
	type: "",
	gender: "Male",
	origin: {
		name: "Earth (C-137)",
		type: "Planet",
		dimension: "Dimension C-137"
	},
	location: {
		name: "Earth (Replacement Dimension)",
		type: "Planet",
		dimension: "Replacement Dimension"
	},
	image: "https://rickandmortyapi.com/api/character/avatar/11.jpeg",
	episode: [{
		name: "A Rickle in Time",
		episode: "S02E01"
	}]
};

export const mockCharacterResponse = {
	data: {
		character: {
			id: "11",
			name: "Albert Einstein",
			status: "Dead",
			species: "Human",
			type: "",
			gender: "Male",
			origin: {
				name: "Earth (C-137)",
				type: "Planet",
				dimension: "Dimension C-137"
			},
			location: {
				name: "Earth (Replacement Dimension)",
				type: "Planet",
				dimension: "Replacement Dimension"
			},
			image: "https://rickandmortyapi.com/api/character/avatar/11.jpeg",
			episode: [{
				name: "A Rickle in Time",
				episode: "S02E01"
			}]
		}
	}
};
