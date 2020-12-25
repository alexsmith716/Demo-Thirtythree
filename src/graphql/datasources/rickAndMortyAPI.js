const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://rickandmortyapi.com/api';

export class RickAndMortyAPICharacter extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/character`
	}

	async character({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};

export class RickAndMortyAPILocation extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = `${baseUrl}/location`
	}

	async location({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};

export class RickAndMortyAPIEpisode extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = `${baseUrl}/episode`
	}

	async episode({ id }) {
		const data = await this.get('/' + id);
		return data;
	}
};
