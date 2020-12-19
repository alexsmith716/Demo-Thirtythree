import  { KaplanTestPrepBooks } from '../datasources/googleBooksAPI';
import  { RickAndMortyAPICharacter } from '../datasources/rickAndMortyAPI';

export const dataSources = () => ({
	kaplanTestPrepBooks: new KaplanTestPrepBooks(),
	rickAndMortyAPICharacter: new RickAndMortyAPICharacter(),
});

export const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		character: async (obj: any, { id }: { id: number }, { dataSources }: { dataSources: any }) => (
			dataSources.rickAndMortyAPICharacter.character({ id })
		),
		search: async (obj: any, { searchString, startIndex, orderBy, maxResults }: { searchString: string, startIndex: number, orderBy: string, maxResults: number }, { dataSources }: { dataSources: any }) => (
			dataSources.kaplanTestPrepBooks.getBooks(searchString, startIndex, orderBy, maxResults)
		),
	},

	Book: {
		id: ({ id }: { id: string }) => id,
		title: ({ volumeInfo: { title }}: { volumeInfo: any, title: string }) => title,
		subtitle: ({ volumeInfo: { subtitle }}: { volumeInfo: any, subtitle: string }) => subtitle,
		authors: ({ volumeInfo: { authors }}: { volumeInfo: any, authors: string }) => authors,
		publisher: ({ volumeInfo: { publisher }}: { volumeInfo: any, publisher: string }) => publisher,
		publishedDate: ({ volumeInfo: { publishedDate }}: { volumeInfo: any, publishedDate: string }) => publishedDate,
		description: ({ volumeInfo: { description }}: { volumeInfo: any, description: string }) => description,
		previewLink: ({ volumeInfo: { previewLink }}: { volumeInfo: any, previewLink: string }) => previewLink,
		imageLinks: ({ volumeInfo: { imageLinks }}: { volumeInfo: any, imageLinks: string }) => imageLinks,
	},

	ImageLinks: {
		smallThumbnail: ({ smallThumbnail }: { smallThumbnail: string }) => smallThumbnail,
		thumbnail: ({ thumbnail }: { thumbnail: string }) => thumbnail,
	},

	SearchResult: {
		books: ({ items }: { items: any }) => items,
	}
};
