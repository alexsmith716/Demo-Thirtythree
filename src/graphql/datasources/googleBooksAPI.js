const { RESTDataSource } = require('apollo-datasource-rest');

//  REST API
const baseUrl = 'https://www.googleapis.com/books';

export class GoogleBooks extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `${baseUrl}/v1/`
	}

	//  reflect how "googleapis.com/books" schema is used in UI (shaping schema fields)
	//  can also be accomplished in resolver
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
			favorite: false,
		};
	}

	// https://www.googleapis.com/books/v1/volumes?q=gmat&startIndex=0&orderBy=newest&projection=lite&maxResults=40
	// https://www.googleapis.com/books/v1/volumes/XDTlxgEACAAJ

	//  REST API endpoint search for all books
	async getBooks(searchString, orderBy) {
		// const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=${startIndex}&orderBy=${orderBy}&projection=lite&maxResults=${maxResults}`;
		const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=0&orderBy=${orderBy}&projection=lite&maxResults=40`;
		// console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > route: ', route);
		const response = await this.get(route);
		// console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > response: ', response);
		const reducedResponse = Array.isArray(response.items) ? response.items.map(book => this.bookReducer(book)) : [];
		// console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > reducedResponse: ', reducedResponse);
		return reducedResponse;
	}

	async getBook({ googleBookId }) {
		const route = `volumes/${googleBookId}`;
		const response = await this.get(route);
		const reducedResponse = this.bookReducer(response);
		// console.log('>>>>>>>>>>>>> googleBooksAPI > getBook > reducedResponse: ', reducedResponse);
		return reducedResponse;
	}
};
