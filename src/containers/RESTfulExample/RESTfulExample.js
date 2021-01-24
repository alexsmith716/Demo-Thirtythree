import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';

import { Button } from '../../components/Button';
import { GoogleBookBook, } from '../../components/GoogleBookBook';
import { GET_GOOGLE_BOOKS, GET_GOOGLE_BOOK } from '../../graphql/queries/queries.js';


const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [googleBookSearch, setGoogleBookSearch] = useState('');

	const client = useApolloClient();

	const [getGoogleBooks, {
			loading, 
			error,
			data: googleBooksData,
			previousData: googleBooksPreviousData,
			refetch,
			fetchMore,
			networkStatus,
		}] = useLazyQuery(
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

	const [getGoogleBook, {
			loading: googleBookLoading, 
			error: googleBookError,
			data: googleBookData,
		}] = useLazyQuery(
			GET_GOOGLE_BOOK,
	);

	// Provide a previousData property in useQuery/useLazyQuery results
	// result.data ?? result.previousData to obtain the most recent useful data
	useEffect(() => {
			if (googleBooksData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > googleBooksData: ', googleBooksData);
				//console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > googleBooksData.googleBooks.cursor: ', googleBooksData.googleBooks.cursor);
			}
			if (googleBookSearch) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > googleBookSearch: ', googleBookSearch);
			}
			if (googleBookData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > googleBookData.googleBook: ', googleBookData.googleBook);
			}
		},
		[googleBooksData, googleBookSearch, googleBookData]
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

						{loading || googleBookLoading && (
							<p>
								Loading...
							</p>
						)}

						{error || googleBookError && (
							<p>
								Query Error!
							</p>
						)}

						{googleBooksData && (
							<div>
								<div className="mb-3">
									<h5>getGoogleBooks Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								{googleBooksData.googleBooks.books.map((book, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ book } />
									</div>
								))}
								{/* ----------------------------------------------------------------------- */}
							</div>
						)}

						{googleBookData && (
							<div>
								<div className="mb-3">
									<h5>getGoogleBook Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
									<div key={googleBookData.googleBook.id} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ googleBookData.googleBook } />
									</div>
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
							buttonText="View Apollo Cache"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => refetch()}
							buttonText="RefetchQueryResults"
						/>
					</div>

					
					{/* <div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={ () => getGoogleBook({ variables: { id: 'uW_zzQEACAAJ' }}) }
							buttonText="Get Book ID: uW_zzQEACAAJ"
						/>
					</div> */}

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('mcat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'kaplan test prep' }, fetchPolicy: 'network-only'})}
							buttonText="Search Kaplan"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('gmat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'gmat' }, fetchPolicy: 'network-only'})}
							buttonText="Search GMAT"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							//onClick={() => setGoogleBookSearch('lsat')}
							onClick={() => getGoogleBooks({ variables: { searchString: 'lsat' }, fetchPolicy: 'network-only'})}
							buttonText="Search LSAT"
						/>
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
							buttonText="Get Google Books"
						/>
					</div>

					{googleBooksData && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-primary btn-md"
								onClick={ async () => {
									await fetchMore({
										variables: {
											after: googleBooksData.googleBooks.cursor,
										},
										// fetchPolicy: 'cache-and-network',
									});
								}}
								buttonText="fetchMore Google Books"
							/>
						</div>
					)}

				</div>
			</div>
		</>
	);
};

export default RESTfulExample;
