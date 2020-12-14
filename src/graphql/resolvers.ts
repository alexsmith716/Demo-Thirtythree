
const { KaplanTestPrepBooks } = require('./datasources/googleBooksAPI');
//import { KaplanTestPrepBooks } from './datasources/googleBooksAPI';
const { RickAndMortyAPICharacter } = require('./datasources/rickAndMortyAPI');

export const dataSources = () => ({
	kaplanTestPrepBooks: new KaplanTestPrepBooks(),
	rickAndMortyAPICharacter: new RickAndMortyAPICharacter(),
});

//	https://github.com/dotansimha/graphql-code-generator
export const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		character: async (obj: any, { id }: { id: number }, { dataSources }: { dataSources: any }) => (
			dataSources.rickAndMortyAPICharacter.character({ id })
		),
		search: async (obj: any, { searchString }: { searchString: string }, { dataSources }: { dataSources: any }) => (
			dataSources.kaplanTestPrepBooks.getBooks(searchString)
		),
	},

	Book: {
		id: ({ id }: { id: string }) => id,
		title: ({ volumeInfo: { title } }: { volumeInfo: any, title: string }) => title,
	},

	SearchResult: {
		books: ({ items }: { items: any }) => items,
	}
};
