const { RESTDataSource } = require('apollo-datasource-rest');

class KtpBooksAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://www.googleapis.com/books/v1/volumes?q=kaplan%20test%20prep';
	}

};

module.exports = KtpBooksAPI;
