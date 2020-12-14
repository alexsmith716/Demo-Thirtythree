const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://rickandmortyapi.com/api';

class RickAndMortyAPICharacter extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/character`
	}

	async character({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};

class RickAndMortyAPILocation extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = `${baseUrl}/location`
	}

	async location({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};

class RickAndMortyAPIEpisode extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = `${baseUrl}/episode`
	}

	async episode({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};

module.exports = { RickAndMortyAPICharacter, RickAndMortyAPILocation, RickAndMortyAPIEpisode };
