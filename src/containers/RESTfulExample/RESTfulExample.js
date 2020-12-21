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
	const [kTPBooksOffsetIndex, setKTPBooksOffsetIndex] = useState(0);
	const [kTPBooksMaxResults, setKTPBooksMaxResults] = useState(2);

	const client = useApolloClient();

	const [getCharacter, { loading: getCharacterLoading, error: getCharacterError, data: getCharacterData }] = useLazyQuery(
		GET_CHARACTER_REST,
		{
			variables: {
				id: 5,
			},
		}
	);

	//  https://github.com/apollographql/apollo-client/tree/main/docs/source/pagination
	//  https://github.com/apollographql/apollo-client/blob/main/docs/source/pagination/core-api.mdx#the-fetchmore-function
	const [getKTPBooks, { loading: getKTPBooksLoading, error: getKTPBooksError, data: getKTPBooksData, refetch: refetchKTPBooksData, fetchMore: fetchMoreKTPBooksData, networkStatus }] = useLazyQuery(
		GET_KTP_BOOKS_REST,
		{
			variables: {
				search: "kaplan test prep",
				startIndex: 0,
				orderBy: "newest",
				maxResults: kTPBooksMaxResults,
			},
			notifyOnNetworkStatusChange: true,
		}
	);

	useEffect(() => {
			console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidMount > kTPBooksOffsetIndex: ', kTPBooksOffsetIndex);

			if (kTPBooksOffsetIndex) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > kTPBooksOffsetIndex: ', kTPBooksOffsetIndex);
			}
		},
		[kTPBooksOffsetIndex]
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
								{/* ----------------------------------------------------------------------- */}
								{getKTPBooksData.search.books.map((book, index) => (
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
							onClick={() => refetchKTPBooksData()}
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
							onClick={() => {
								const newMaxResults = kTPBooksMaxResults+2;
								fetchMoreKTPBooksData({
									variables: {
										maxResults: newMaxResults,
									},
								}).then(fetchMoreResult => {
									const newKTPBooksOffsetIndex = kTPBooksOffsetIndex+fetchMoreResult.data.search.books.length;
									setKTPBooksOffsetIndex(newKTPBooksOffsetIndex);
									setKTPBooksMaxResults(newMaxResults);
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
