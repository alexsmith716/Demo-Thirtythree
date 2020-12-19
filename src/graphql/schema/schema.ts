import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		hello: String

		character(id: ID): Character

		search(searchString: String!, startIndex: Int!, orderBy: String!, maxResults: Int!): SearchResult
	}

	type Book {
		id: String!
		title: String
		subtitle: String
		authors: [String]
		publisher: String
		publishedDate: String
		description: String
		previewLink: String
		imageLinks: ImageLinks
	}

	type ImageLinks {
		smallThumbnail: String
		thumbnail: String
	}

	type SearchResult {
		books: [Book]
	}

	type Character {
		id: ID

		name: String

		status: String

		species: String

		type: String

		gender: String

		origin: Location

		location: Location

		image: String

		episode: [Episode]

		created: String
	}

	type Location {
		id: ID

		name: String

		type: String

		dimension: String

		residents: [Character]

		created: String
	}

	type Episode {
		id: ID

		name: String

		air_date: String

		episode: String

		characters: [Character]

		created: String
	}
`;
