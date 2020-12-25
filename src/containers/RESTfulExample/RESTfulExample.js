import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	gql,
	useQuery,
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';
import { Button } from '../../components/Button';
import { GoogleBooksBook } from '../../components/GoogleBooksBook';

import { GET_CHARACTER_REST, GET_KTP_BOOKS_REST } from '../../graphql/queries/queries.js';

const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [startIndex, setStartIndex] = useState(0);
	const [maxResults, setMaxResults] = useState(2);

	const client = useApolloClient();

	const [getKTPBooks, { loading, error, data, refetch, fetchMore, networkStatus }] = useLazyQuery(
		GET_KTP_BOOKS_REST,
	);

	useEffect(() => {
			if (data) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > data: ', data);
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > data.search: ', data.search);
			}
		},
		[data]
	);

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

						{networkStatus === NetworkStatus.refetch && (
							<p>
								Refetching!
							</p>
						)}

						{loading && (
							<p>
								Loading getKTPBooksLoading...
							</p>
						)}

						{error && (
							<p>
								Error getKTPBooksError!
							</p>
						)}

						{data && (
							<div>
								<div className="mb-3">
									<h5>getKTPBooksData Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								{data.search.books.map((book, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<GoogleBooksBook book={ book } />
									</div>
								))}
								{/* ----------------------------------------------------------------------- */}
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
							onClick={() => refetch()}
						>
							refetchKTPBooksData
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => getKTPBooks()}
						>
							Get KTP Books
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-primary"
							onClick={async () => {
								await fetchMore({
									variables: {
										after: data.search.cursor,
									},
								});
							}}
						>
							fetchMoreKTPBooksData
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
