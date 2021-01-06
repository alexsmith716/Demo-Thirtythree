import React, { useState, useEffect } from 'react';
import { Button } from '../Button';

export const GoogleBooksBook = ({ book }) => {

	const [toggleBookDescriptionView, setToggleBookDescriptionView] = useState(false);

	//  useEffect(() => {
	//    console.log('>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidMount');

	//    if (toggleBookDescriptionView) {
	//      console.log(
	//        '>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentDidUpdate > toggleBookDescriptionView: ',
	//        toggleBookDescriptionView,
	//      );
	//    }

	//    return () => {
	//      console.log(
	//        '>>>>>>>>>>>>>>>>>>>>>>>> GoogleBooksBook > useEffect() > componentWillUnmount > cleanup phase',
	//      );
	//    };
	//  }, [toggleBookDescriptionView]);

	const upgradeThumbnailURL = (url) => {
		const upgrade = url.replace(/^http:\/\//i, 'https://');
		return upgrade;
	};

	return (
		<div className="row-flex">
			<div className="col-two">

				<div className="display-flex">

					<div>
						{ book.smallThumbnail
							?
							<div>
								<img src={upgradeThumbnailURL(book.smallThumbnail)} alt={book.title}/>
							</div>
							:
							<div><i>Image not found</i></div>
						}
						<div className="text-center">
							<Button className="btn-light btn-tiny" onClick={() => false}>
								Add to Favorites
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="col-ten">

				<div>{book.title ? <h3>{book.title}</h3> : <i>Title not found</i>}</div>

				<div><b>Authors:&nbsp;</b>{book.authors ? book.authors.join(', ') : <i>n/a</i>}</div>

				<div><b>Publisher:&nbsp;</b>{book.publisher ? book.publisher : <i>n/a</i>}</div>

				<div><b>Published Date:&nbsp;</b>{book.publishedDate ? book.publishedDate : <i>n/a</i>}</div>

				<div><b>ID:&nbsp;</b>{book.id ? book.id : <i>n/a</i>}</div>

				{book.description &&
					<>
						<div className={!toggleBookDescriptionView ? 'text-overflow-ellipsis' : ''}>
							{book.description}
						</div>
						<Button className="btn-light btn-tiny" onClick={() => setToggleBookDescriptionView(!toggleBookDescriptionView)}>
							{ toggleBookDescriptionView
								? "<< Less"
								: "More >>"
							}
						</Button>
					</>
				}
			</div>
		</div>
	);
};
