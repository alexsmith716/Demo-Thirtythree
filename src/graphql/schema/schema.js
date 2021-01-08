import gql from 'graphql-tag';

//  Schema-First Developement
//  build the schema on how the GraphQL API will be used by the front-end
//  ============================================
export const typeDefs = gql`
	type Query {
		hello: String

		character(id: ID): Character

		googleBooksList(
			pageSize: Int,
			after: String,
			searchString: String!
			orderBy: String!
		): GoogleBooksSearchResult

		googleBook(id: ID!): Book
	}

	type Mutation {
		googleBookModifyFavorite(
			googleBookId: ID!
			favorite: Boolean
		): GoogleBooksUpdateResponse!
	}

	type GoogleBooksUpdateResponse {
		success: Boolean!
		message: String
		books: [Book]
	}

	type GoogleBooksSearchResult {
		cursor: String!
		hasMore: Boolean!
		books: [Book]!
	}

	type Book {
		id: ID!
		title: String
		subtitle: String
		authors: [String]
		publisher: String
		publishedDate: String
		description: String
		previewLink: String
		smallThumbnail: String
		favorite: Boolean
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
