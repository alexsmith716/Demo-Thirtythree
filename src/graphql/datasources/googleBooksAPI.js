const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://www.googleapis.com/books';

class KaplanTestPrepBooks extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/v1/`
	}

	//	https://www.googleapis.com/books/v1/volumes?q=kaplan+test+prep&startIndex=0&orderBy=newest&projection=lite&maxResults=2

	async getBooks(searchString, startIndex, orderBy, maxResults) {
		const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=${startIndex}&orderBy=${orderBy}&projection=lite&maxResults=${maxResults}`;
		const data = await this.get(route);
		return data;
	}

};

module.exports = { KaplanTestPrepBooks };
