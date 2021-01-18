import React, { useState, useEffect } from 'react';
import { 
	useMutation,
} from '@apollo/client';
import { Button } from '../Button';
import { Thumbnail } from '../../Styles';
import { GOOGLE_BOOK_MODIFY_FAVORITE } from '../../graphql/mutations/mutations.js';

export const GoogleBookBook = ({ book }) => {

	const [toggleBookDescriptionView, setToggleBookDescriptionView] = useState(false);

	const [googleBookModifyFavorite, { error: googleBookModifyFavoriteERROR, data: googleBookModifyFavoriteDATA }] = useMutation(
		GOOGLE_BOOK_MODIFY_FAVORITE,
	);

	const upgradeThumbnailURL = (url) => {
		const upgrade = url.replace(/^http:\/\//i, 'https://');
		return upgrade;
	};

	useEffect(() => {

		if (googleBookModifyFavoriteDATA) {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>> GoogleBookBook > useEffect() > googleBookModifyFavoriteDATA: ', googleBookModifyFavoriteDATA);
		}

	},[googleBookModifyFavoriteDATA]);

	return (
		<div className="row-flex">

			<div className="col-two">

				<Thumbnail>

					<div className="text-center">
						{ book.smallThumbnail
							?
							<div>
								<img src={upgradeThumbnailURL(book.smallThumbnail)} alt={book.title}/>
							</div>
							:
							<div><i>Image not found</i></div>
						}
						<div>
							<Button
								className="btn-light btn-tiny"
								onClick={() => googleBookModifyFavorite({ variables: { id: book.id, favorite: book.favorite && book.favorite ? false : true }})}
								buttonText={`${book.favorite && book.favorite ? "Remove from" : "Add to"} Favorites`}
							/>
						</div>
					</div>
				</Thumbnail>
			</div>

			<div className="col-ten">

				<div>{book.title ? <h3>{book.title}</h3> : <i>Title not found</i>}</div>

				<div><b>Authors:&nbsp;</b>{book.authors ? book.authors.join(', ') : <i>n/a</i>}</div>

				<div><b>Publisher:&nbsp;</b>{book.publisher ? book.publisher : <i>n/a</i>}</div>

				<div><b>Published Date:&nbsp;</b>{book.publishedDate ? book.publishedDate : <i>n/a</i>}</div>

				<div><b>ID:&nbsp;</b>{book.id ? book.id : <i>n/a</i>}</div>

				<div><b>Favorite:&nbsp;</b>{book.favorite && book.favorite ? <i>true</i> : <i>false</i>}</div>

				{book.description &&
					<>
						<div className={!toggleBookDescriptionView ? 'text-overflow-ellipsis' : ''}>
							{book.description}
						</div>
						<Button
							className="btn-light btn-tiny"
							onClick={() => setToggleBookDescriptionView(!toggleBookDescriptionView)}
							buttonText={toggleBookDescriptionView ? "<< Less" : "More >>"}
						/>
					</>
				}
			</div>
		</div>
	);
};
