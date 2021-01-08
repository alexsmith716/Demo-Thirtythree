import { gql } from '@apollo/client';

export const GOOGLE_BOOK_MODIFY_FAVORITE = gql`
	mutation GoogleBookModifyFavorite($googleBookId: ID!, $favorite: Boolean) {
		googleBookModifyFavorite(googleBookId: $googleBookId, favorite: $favorite) {
			success
			message
			books {
				id
				favorite
			}
		}
	}
`;
