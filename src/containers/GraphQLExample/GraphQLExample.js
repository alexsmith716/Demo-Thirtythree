import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';
import { Button } from '../../components/Button';

import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_A_RICK_AND_MORTY_CHARACTER_FULL } from '../../graphql/queries/queries.js';


const GraphQLExample = () => {

	const client = useApolloClient();

	const [getRickAndMortyCharacters, { loading, error, data: rickAndMortyCharactersData, refetch, fetchMore, networkStatus }] = useLazyQuery(
		GET_A_RICK_AND_MORTY_CHARACTER_FULL,
		{
			variables: {
				id: '',
			},
			notifyOnNetworkStatusChange: true,
		}
	);

	useEffect(() => {
			if (rickAndMortyCharactersData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > rickAndMortyCharactersData.googleBooksListRAM: ', rickAndMortyCharactersData.googleBooksListRAM);
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > rickAndMortyCharactersData.googleBooksListRAM.cursor: ', rickAndMortyCharactersData.googleBooksListRAM.cursor);
			}
			if (rickAndMortyCharacterSearch) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > rickAndMortyCharacterSearch: ', rickAndMortyCharacterSearch);
			}
		},
		[rickAndMortyCharactersData, rickAndMortyCharacterSearch]
	);

	return (
		<>
			<Helmet title="GraphQL Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">GraphQL Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">

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
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
						/>
					</div>

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
