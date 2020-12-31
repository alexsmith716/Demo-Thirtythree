import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';
import { Button } from '../../components/Button';
import { GoogleBooksBook } from '../../components/GoogleBooksBook';

import { GET_GOOGLE_BOOKS_REST } from '../../graphql/queries/queries.js';

const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [googleBookSearch, setGoogleBookSearch] = useState('');
	const [googleBookSearchCURSOR, setGoogleBookSearchCURSOR] = useState('');

	const client = useApolloClient();

	//  network-only
	//  cache-and-network
	const [getGoogleBooks, { loading, error, data, refetch, fetchMore, networkStatus }] = useLazyQuery(
		GET_GOOGLE_BOOKS_REST,
		{
			variables: {
				// search: `${googleBookSearch}`,
				search: '',
				orderBy: 'newest',
			},
			//	fetchPolicy: 'cache-and-network',
			//	pollInterval: 500,
			notifyOnNetworkStatusChange: true,
		}
	);

	useEffect(() => {
			if (data) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > data.search.cursor: ', data.search.cursor);
				setGoogleBookSearchCURSOR(data.search.cursor)
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
							RefetchQueryResults
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							//onClick={() => setGoogleBookSearch('usmle')}
							onClick={() => getGoogleBooks({ variables: { search: 'usmle' }, fetchPolicy: 'network-only'})}
						>
							Search USMLE
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							//onClick={() => setGoogleBookSearch('gmat')}
							onClick={() => getGoogleBooks({ variables: { search: 'gmat' }, fetchPolicy: 'network-only'})}
						>
							Search GMAT
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => setGoogleBookSearch('lsat')}
						>
							Search LSAT!
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
							className="btn-success"
							onClick={() => getGoogleBooks()}
						>
							Get Google Books
						</Button>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-primary"
							onClick={ async () => {
								await fetchMore({
									variables: {
										cursor: data.search.cursor,
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
