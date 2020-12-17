import { gql } from '@apollo/client';
import { fragmentTypeDroid } from '../fragments/fragments';

export const GET_HELLO = gql`
	{
		hello
	}
`;

export const GET_KTP_BOOKS_REST = gql`
	query GetKptBooksRest($search: String!) {
		search(searchString: $search) {
			books {
				id
				title
				authors
				publisher
				publishedDate
        description
				imageLinks {
					smallThumbnail
				}
			}
		}
	}
`;

export const GET_CHARACTER_REST = gql`
	query GetCharacterRest($id: ID) {
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

export const GET_CHARACTER = gql`
	query Character($id: ID){
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
