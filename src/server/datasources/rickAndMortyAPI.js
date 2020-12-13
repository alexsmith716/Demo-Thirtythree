const { RESTDataSource } = require('apollo-datasource-rest');

class RickAndMortyAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://rickandmortyapi.com/api/character';
	}

	async character({ id }) {
		const data = await this.get('/' + id)
		return data
	}
};

module.exports = RickAndMortyAPI;
