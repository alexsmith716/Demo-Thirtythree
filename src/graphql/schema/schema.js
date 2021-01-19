import gql from 'graphql-tag';

export const typeDefs = gql`
	scalar ObjID

	type Query {
		hello: String

		googleBooks(
			after: String,
			searchString: String!
			orderBy: String!
			pageSize: Int,
		): GoogleBookConnection

		googleBook(id: ID!): Book

		characters(
			after: String,
			searchString: String!
			pageSize: Int,
		): rickAndMortyCharacterConnection

		character(id: ID!): Character
	}

	type Mutation {
		googleBookModifyFavorite(
			id: ID!
			favorite: Boolean
		): GoogleBooksUpdateResponse!
	}

	type rickAndMortyCharacterConnection {
		cursor: String!
		hasMore: Boolean!
		characters: [Character]!
	}

	type GoogleBooksUpdateResponse {
		success: Boolean!
		message: String
		books: [Book]
	}

	type GoogleBookConnection {
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
	}
`;
