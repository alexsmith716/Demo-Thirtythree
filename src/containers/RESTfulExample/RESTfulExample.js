import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	gql,
	useQuery,
	useLazyQuery,
	useApolloClient,
} from '@apollo/client';
import { Button } from '../../components/Button';

import { GET_CHARACTER_REST, GET_KTP_BOOKS_REST, GET_KTP_BOOKS_REST_imageLinks } from '../../graphql/queries/queries.js';


const RESTfulExample = () => {

	const client = useApolloClient();

	const [getCharacter, { loading: getCharacterLoading, error: getCharacterError, data: getCharacterData }] = useLazyQuery(
		GET_CHARACTER_REST,
		{
			variables: {
				id: 5,
			},
		}
	);

	const [getKTPBooks, { loading: getKTPBooksLoading, error: getKTPBooksError, data: getKTPBooksData }] = useLazyQuery(
		GET_KTP_BOOKS_REST,
		{
			variables: {
				search: "kaplan test prep",
			},
		}
	);

	const [clientExtract, setClientExtract] = useState(null);

	//	useEffect(() => {
	//			// componentDidMount
	//			console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample!!!! > useEffect() > componentDidMount');
	//			// componentDidUpdate
	//			if (componentDidUpdate) {
	//				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidUpdate');
	//			}
	//			// componentWillUnmount
	//			return () => {
	//				// some effects might require cleanup
	//				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentWillUnmount > cleanup phase');
	//			};
	//		},
	//		[] // only re-run the effect if an array item changes
	//	);

	return (
		<>
			<Helmet title="REST Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">REST Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">
					<div className="mb-3">

						{getKTPBooksLoading && (
							<p>
								Loading getKTPBooksLoading...
							</p>
						)}

						{getKTPBooksError && (
							<p>
								Error getKTPBooksError!
							</p>
						)}

						{getKTPBooksData && (
							<div>
								<div className="mb-3">
									<h5>getKTPBooksData Data:</h5>
								</div>
								{getKTPBooksData.search.books.map(book => (
									<div key={book.id} className="mb-3 container-padding-border-radius-2">
										<h4>{book.title}</h4>
										<img src={book.imageLinks.smallThumbnail} />
										<div>Authors: {book.authors.join(', ')}</div>
										{ book.publisher &&
												<div>Publisher: {book.publisher}</div>
										}
										<div>Published Date: {book.publishedDate}</div>
									</div>
								))}
							</div>
						)}

						{clientExtract !== null && (
							<div>
								<h5>ApolloClient Cache:</h5>
								<div>----------------------------------</div>
								<div>{JSON.stringify(clientExtract)}</div>
								<div>----------------------------------</div>
							</div>
						)}

					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => setClientExtract(client.extract())}
						>
							View Apollo Cache
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => getKTPBooks()}
						>
							KTP Books
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => getCharacter()}
						>
							Get Character
						</Button>
					</div>

				</div>
			</div>
		</>
	);
};

export default RESTfulExample;
