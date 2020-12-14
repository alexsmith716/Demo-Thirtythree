const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://www.googleapis.com/books';

class KaplanTestPrepBooks extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/v1/`
	}

	async getBooks(searchString) {
		const route = `volumes?q=${searchString.split(' ').join('+')}&projection=lite&maxResults=30`;
		console.log(`HTTP GET ${this.baseURL}${route}`);
		const data = await this.get(route);
		return data
	}
};

module.exports = { KaplanTestPrepBooks };
