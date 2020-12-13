const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://rickandmortyapi.com/api';

class RickAndMortyAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/character`
	}

	async character({ id }) {
		const data = await this.get('/' + id)
		return data
	}
};

module.exports = RickAndMortyAPI;
