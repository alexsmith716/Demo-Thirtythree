import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
} from '@apollo/client';

import { Button } from '../../components/Button';
import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_RICK_AND_MORTY_CHARACTER } from '../../graphql/queries/queries.js';


const GraphQLExample = () => {

	const client = useApolloClient();


	const [getRickAndMortyCharacter, {
			loading, 
			error,
			data: rickAndMortyCharactersData,
			previousData: rickAndMortyCharactersPreviousData,
			refetch,
			fetchMore,
			networkStatus 
		}] = useLazyQuery(
			GET_RICK_AND_MORTY_CHARACTER,
			{
				variables: {
					id: '',
				},
				notifyOnNetworkStatusChange: true,
			}
	);

	useEffect(() => {
			if (rickAndMortyCharactersData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > useEffect() > rickAndMortyCharactersData.rickAndMortyCharacters: ', rickAndMortyCharactersData.rickAndMortyCharacters);
			}
		},
		[rickAndMortyCharactersData,]
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
							onClick={() => getRickAndMortyCharacter({ variables: { id: '9' }, fetchPolicy: 'network-only'})}
							buttonText="Get character"
						/>
					</div>

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
