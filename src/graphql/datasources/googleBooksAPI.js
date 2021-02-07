import { RESTDataSource } from 'apollo-datasource-rest';

const baseUrl = 'https://www.googleapis.com/books';

export class GoogleBooksAPI extends RESTDataSource {
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
			favorite: false,
		};
	}

	// https://www.googleapis.com/books/v1/volumes?q=gmat&startIndex=0&orderBy=newest&projection=lite&maxResults=40
	// https://www.googleapis.com/books/v1/volumes/XDTlxgEACAAJ

	async getBooks(searchString, orderBy) {
		try {
			// const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=${startIndex}&orderBy=${orderBy}&projection=lite&maxResults=${maxResults}`;
			const route = `volumes?q=${searchString.split(' ').join('+')}&startIndex=0&orderBy=${orderBy}&projection=lite&maxResults=40`;
			// console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > route: ', route);
			const response = await this.get(route);
			// console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > response: ', response);
			console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > response: ', JSON.stringify(response));
			const reducedResponse = Array.isArray(response.items) ? response.items.map(book => this.bookReducer(book)) : [];
			console.log('>>>>>>>>>>>>> googleBooksAPI > getBooks > reducedResponse: ', reducedResponse);
			return reducedResponse;
		} catch (error) {
			console.error('>>>>>>>>>>>>> googleBooksAPI > getBooks > response > ERROR: ', error);
			return false;
		}
	}

	async getBook({id}) {
		try {
			const route = `volumes/${id}`;
			const response = await this.get(route);
			console.log('>>>>>>>>>>>>> googleBooksAPI > getBook > response: ', response);
			const reducedResponse = this.bookReducer(response);
			console.log('>>>>>>>>>>>>> googleBooksAPI > getBook > reducedResponse: ', reducedResponse);
			return reducedResponse;
		} catch (error) {
			console.error('>>>>>>>>>>>>> googleBooksAPI > getBook > response > ERROR: ', error);
			return false;
		}
	}
};
