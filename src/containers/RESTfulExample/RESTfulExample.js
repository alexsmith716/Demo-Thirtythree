import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';
import { Button } from '../../components/Button';
import { GoogleBooksBook } from '../../components/GoogleBooksBook';

import { GET_GOOGLE_BOOKS } from '../../graphql/queries/queries.js';

const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [googleBookSearch, setGoogleBookSearch] = useState('');

	const client = useApolloClient();

	//  network-only
	//  cache-and-network
	const [getGoogleBooks, { loading, error, data, refetch, fetchMore, networkStatus }] = useLazyQuery(
		GET_GOOGLE_BOOKS,
		{
			variables: {
				// searchString: `${googleBookSearch}`,
				searchString: '',
				orderBy: 'newest',
			},
			//  fetchPolicy: 'cache-and-network',
			//  pollInterval: 500,
			notifyOnNetworkStatusChange: true,
		}
	);

	useEffect(() => {
			if (data) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > data.googleBooksList: ', data.googleBooksList);
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > data.googleBooksList.cursor: ', data.googleBooksList.cursor);
			}
			if (googleBookSearch) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > googleBookSearch: ', googleBookSearch);
			}
		},
		[data, googleBookSearch]
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
								Refetching...
							</p>
						)}

						{loading && (
							<p>
								Loading...
							</p>
						)}

						{error && (
							<p>
								Query Error!
							</p>
						)}

						{data && (
							<div>
								<div className="mb-3">
									<h5>getGoogleBooks Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								{data.googleBooksList.books.map((book, index) => (
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
							className="btn-success btn-md"
							onClick={() => setClientExtract(client.extract())}
						>
							View Apollo Cache
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => refetch()}
						>
							RefetchQueryResults
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('mcat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'mcat' }, fetchPolicy: 'network-only'})}
						>
							Search MCAT
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('gmat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'gmat' }, fetchPolicy: 'network-only'})}
						>
							Search GMAT
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('lsat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'lsat' }, fetchPolicy: 'network-only'})}
						>
							Search LSAT
						</Button>
					</div>

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									type="text"
									className="form-control"
									name="googleBookSearch"
									value={googleBookSearch}
									onChange={e => setGoogleBookSearch(e.target.value)}
									placeholder="Search Google Books"
								/>
							</div>
						</div>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getGoogleBooks()}
						>
							Get Google Books
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-primary btn-md"
							onClick={ async () => {
								await fetchMore({
									variables: {
										after: data.googleBooksList.cursor,
									},
									// fetchPolicy: 'cache-and-network',
								});
							}}
						>
							fetchMore Google Books
						</Button>
					</div>

				</div>
			</div>
		</>
	);
};

export default RESTfulExample;
