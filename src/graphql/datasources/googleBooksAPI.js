const { RESTDataSource } = require('apollo-datasource-rest');

const baseUrl = 'https://www.googleapis.com/books';

export class KaplanTestPrepBooks extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/v1/`
	}

	bookReducer(book) {
		return {
			id: book.id,
			cursor: `${book.id}`,
			title: book.volumeInfo.title,
			authors: book.volumeInfo.authors,
			publisher: book.volumeInfo.publisher,
			publishedDate: book.volumeInfo.publishedDate,
			description: book.volumeInfo.description,
			previewLink: book.volumeInfo.previewLink,
			smallThumbnail: book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail,
		};
	}

	//	https://www.googleapis.com/books/v1/volumes?q=kaplan+test+prep&startIndex=0&orderBy=newest&projection=lite&maxResults=40

	async getBooks(searchString, orderBy) {
		//const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=${startIndex}&orderBy=${orderBy}&projection=lite&maxResults=${maxResults}`;
		const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=0&orderBy=${orderBy}&projection=lite&maxResults=40`;
		const response = await this.get(route);
		const reducedResponse = Array.isArray(response.items) ? response.items.map(book => this.bookReducer(book)) : [];
		return reducedResponse;
	}
};
