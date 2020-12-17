import React, { useState, useEffect } from 'react';

//	export type Props = {
//		state?: string;
//	};


export const GoogleBooksBook = ({ book }) => {

	const [toggleButtonState, setToggleButtonState] = useState(true);

	useEffect(() => {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidMount');

		if (toggleButtonState) {
			console.log(
				'>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidUpdate > toggleButtonState: ',
				toggleButtonState,
			);
		}

		return () => {
			console.log(
				'>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentWillUnmount > cleanup phase',
			);
		};
	}, [toggleButtonState]);

	return (
		<div className="row-flex">
			<div className="col-two">
				{ book.imageLinks ?
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
				<div>{book.description}</div>
				<button onClick={() => setToggleButtonState(!toggleButtonState)} type="button">
					{ toggleButtonState
						? "More >>"
						: "<< Less"
					}
				</button>
			</div>
		</div>
	);
};
