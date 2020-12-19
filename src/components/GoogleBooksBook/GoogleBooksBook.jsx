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
				{ book.imageLinks
					?
					<img src={book.imageLinks.smallThumbnail} alt={book.title}/>
					:
					<div>Image not found</div>
				}
			</div>
			<div className="col-ten">
				<h3>{book.title}</h3>
				<div><b>Authors:</b> {book.authors.join(', ')}</div>
				{ book.publisher &&
					<div><b>Publisher:</b> {book.publisher}</div>
				}
				<div><b>Published Date:</b> {book.publishedDate}</div>
				<div className={!toggleBookDescriptionView ? 'text-overflow-ellipsis' : ''}>
					{book.description}
				</div>
				<button onClick={() => setToggleBookDescriptionView(!toggleBookDescriptionView)} type="button">
					{ toggleBookDescriptionView
						? "<< Less"
						: "More >>"
					}
				</button>
			</div>
		</div>
	);
};
