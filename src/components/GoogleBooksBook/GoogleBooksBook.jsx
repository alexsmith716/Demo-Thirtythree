import React, { useState, useEffect } from 'react';

export const GoogleBooksBook = ({ book }) => {

	const [toggleBookDescriptionView, setToggleBookDescriptionView] = useState(false);

	useEffect(() => {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidMount');

		if (toggleBookDescriptionView) {
			console.log(
				'>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidUpdate > toggleBookDescriptionView: ',
				toggleBookDescriptionView,
			);
		}

		return () => {
			console.log(
				'>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentWillUnmount > cleanup phase',
			);
		};
	}, [toggleBookDescriptionView]);

	return (
		<div className="row-flex">
			<div className="col-two">
				{ book.smallThumbnail
					?
					<img src={book.smallThumbnail} alt={book.title}/>
					:
					<div>Image not found</div>
				}
			</div>
			<div className="col-ten">
				<h3>{book.title ? book.title : "n\/a"}</h3>

				<div><b>Authors:</b> {book.authors ? book.authors.join(', ') : "n\/a"}</div>

				<div><b>Publisher:</b> {book.publisher ? book.publisher : "n\/a"}</div>

				<div><b>Published Date:</b> {book.publishedDate ? book.publishedDate : "n\/a"}</div>

				<div><b>ID:</b> {book.id ? book.id : "n\/a"}</div>

				{/* {book.description &&
					<div className={!toggleBookDescriptionView ? 'text-overflow-ellipsis' : ''}>
						{book.description}
					</div>
					<button onClick={() => setToggleBookDescriptionView(!toggleBookDescriptionView)} type="button">
						{ toggleBookDescriptionView
							? "<< Less"
							: "More >>"
						}
					</button>
				} */}
			</div>
		</div>
	);
};
