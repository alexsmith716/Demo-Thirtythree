import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
	gql,
} from '@apollo/client';

import { Button } from '../../components/Button';
import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_RICK_AND_MORTY_CHARACTER, GET_RICK_AND_MORTY_CHARACTERS, GET_RICK_AND_MORTY_CHARACTERS_BY_IDS } from '../../graphql/queries/queries.js';


const GraphQLExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const client = useApolloClient();

	const [getRickAndMortyCharacter, {
			loading, 
			error,
			data: rickAndMortyData,
			refetch,
			networkStatus,
		}] = useLazyQuery(
			gql`${GET_RICK_AND_MORTY_CHARACTER}`,
			{
				notifyOnNetworkStatusChange: true,
			}
	);

	const [getRickAndMortyCharacters, {
			loading: rickAndMortyCharactersLoading, 
			error: rickAndMortyCharactersError,
			data: rickAndMortyCharactersData,
			fetchMore: rickAndMortyCharactersFetchMore,
		}] = useLazyQuery(
			gql`${GET_RICK_AND_MORTY_CHARACTERS}`,
	);

	const [getRickAndMortyCharactersByIds, {
			loading: rickAndMortyCharactersByIdsLoading, 
			error: rickAndMortyCharactersByIdsError,
			data: rickAndMortyCharactersByIdsData,
			fetchMore: rickAndMortyCharactersByIdsFetchMore,
		}] = useLazyQuery(
			gql`${GET_RICK_AND_MORTY_CHARACTERS_BY_IDS}`,
	);

	useEffect(() => {
			if (rickAndMortyData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyData: ', rickAndMortyData.character);
			}
			if (rickAndMortyCharactersData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersData: ', rickAndMortyCharactersData);
			}
			if (rickAndMortyCharactersByIdsData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersByIdsData: ', rickAndMortyCharactersByIdsData);
			}
		},
		[rickAndMortyData, rickAndMortyCharactersData, rickAndMortyCharactersByIdsData,]
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

						{loading || rickAndMortyCharactersLoading || rickAndMortyCharactersByIdsLoading && (
							<p>
								Loading...
							</p>
						)}

						{error || rickAndMortyCharactersError || rickAndMortyCharactersByIdsError && (
							<p>
								Query Error!
							</p>
						)}

						{rickAndMortyCharactersByIdsData && (
							<div>
								<div className="mb-3">
									<h5>getRickAndMortyCharactersByIds Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								{rickAndMortyCharactersByIdsData.charactersByIds.map((character, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<RickAndMortyCharacter character={ character } />
									</div>
								))}
								{/* ----------------------------------------------------------------------- */}
							</div>
						)}

						{rickAndMortyData && (
							<div>
								<div className="mb-3">
									<h5>getRickAndMortyCharacter Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								<div key={rickAndMortyData.character.id} className="mb-3 container-padding-border-radius-2">
									<RickAndMortyCharacter character={ rickAndMortyData.character } />
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
							onClick={() => getRickAndMortyCharacter({variables: {id: 1}, fetchPolicy: 'network-only'})}
							buttonText="Get character 1"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharacters({variables: {page: 1, query: ''}})}
							buttonText="get RandMChars page 1"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharacters({variables: {page: 2, query: ''}})}
							buttonText="get RandMChars page 2"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharactersByIds({variables: {ids: [4,9]}, fetchPolicy: 'network-only'})}
							buttonText="Get RandMCharsByIds 4,9"
						/>
					</div>

					{rickAndMortyCharactersData && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-primary btn-md"
								onClick={ async () => {
									await rickAndMortyCharactersFetchMore({
										variables: {
											after: rickAndMortyCharactersData.characters.cursor,
										},
									});
								}}
								buttonText="fetch next R&M character"
							/>
						</div>
					)}

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
