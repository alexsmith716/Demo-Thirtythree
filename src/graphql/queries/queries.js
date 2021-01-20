import { gql } from '@apollo/client';
import { fragmentTypeDroid } from '../fragments/fragments';

export const GET_HELLO = gql`
	{
		hello
	}
`;

export const GET_RICK_AND_MORTY_CHARACTER_X = `
	query GetRickAndMortyCharacter($id: ID!) {
		character(id: $id) {
			id
			name
			status
			species
			type
			gender
		}
	}
`;

export const GET_RICK_AND_MORTY_CHARACTER = gql`
	query GetRickAndMortyCharacter($id: ID!) {
		character(id: $id) {
			id
			name
			status
			species
			type
			gender
		}
	}
`;

export const GET_RICK_AND_MORTY_CHARACTERS = `
	query GetRickAndMortyCharacters($after: String, $searchString: String!) {
		characters(after: $after, searchString: $searchString) {
			cursor
			hasMore
			characters {
				id
				name
			}
		}
	}
`;

export const GET_GOOGLE_BOOKS = gql`
	query GetGoogleBooks($after: String, $searchString: String!, $orderBy: String!) {
		googleBooks(after: $after, searchString: $searchString, orderBy: $orderBy) {
			cursor
			hasMore
			books {
				id
				title
				authors
				publisher
				publishedDate
				description
				smallThumbnail
				favorite
			}
		}
	}
`;

export const GET_GOOGLE_BOOK = gql`
	query GetGoogleBook($id: ID!) {
		googleBook(id: $id) {
			id
			title
			authors
			publisher
			publishedDate
			description
			smallThumbnail
			favorite
		}
	}
`;

export const GET_REVIEWS = gql`
	query GetReviews($episode: Episode!) {
		reviews(episode: $episode) {
			episode
			stars
			commentary
		}
	}
`;

export const GET_A_DROID = gql`
	query GetADroid($droidID: ID!) {
		droid(id: $droidID) {
			id
			name
			friends {
				id
				name
			}
			appearsIn
			primaryFunction
		}
	}
`;

export const GET_A_DROID_ALIAS = gql`
	query GetADroid($droidIDa: ID!, $droidIDb: ID!) {
		droidIDa: droid(id: $droidIDa) {
			...fragmentTypeDroid
		}
		droidIDb: droid(id: $droidIDb) {
			...fragmentTypeDroid
		}
	}
	${fragmentTypeDroid}
`;

export const GET_CHARACTER_REST = gql`
	query Character($id: ID!){
		character(id: "1") @rest(type: "Post", path: "character/1/") {
			id
			name
			status
			species
			type
			gender
			origin {
				name
				type
				dimension
			}
			location {
				name
				type
				dimension
			}
			image
			episode {
				name
				episode
			}
		}
	}
`;

export const ADD_REVIEW = gql`
	mutation createReview($episode: Episode, $review: ReviewInput!) {
		createReview(episode: $episode, review: $review ) {
			episode
			stars
			commentary
		}
	}
`;

export const JUST_GET_REVIEWS = gql`
	query GetEpisodeReviews($episode: Episode!) {
		reviews(episode: $episode)
	}
`;

export const GET_HERO = gql`
	{
		hero {
			name
		}
	}
`;

export const GET_THE_SCHEMA = gql`
	{
		__schema {
			types {
				name
				kind
				description
				fields {
					name
				}
			}
		}
	}
`;
