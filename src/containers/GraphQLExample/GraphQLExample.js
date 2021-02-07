import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
	gql,
} from '@apollo/client';

import { Loading } from '../../components/Loading';
import { Button } from '../../components/Button';
import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_RICK_AND_MORTY_CHARACTER, GET_RICK_AND_MORTY_CHARACTERS, GET_RICK_AND_MORTY_CHARACTERS_BY_IDS } from '../../graphql/queries/queries.js';

const GraphQLExample = () => {

	//	const [errorMessage, setErrorMessage] = useState(null);
	const [clientExtract, setClientExtract] = useState(null);
	const [rickAndMortyCharactersInfo, setRickAndMortyCharactersInfo] = useState(null);
	const [rickAndMortyCharactersFilterName, setRickAndMortyCharactersFilterName] = useState('');
	const [rickAndMortyCharactersCurrentPage, setRickAndMortyCharactersCurrentPage] = useState(null);

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
			{
				//	variables: {
				//		filter: { name: `${rickAndMortyCharactersFilterName}`},
				//	},
				//	fetchPolicy: 'cache-and-network',
			}
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
				//	console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyData: ', rickAndMortyData.character);
			}
			if (rickAndMortyCharactersData) {
				//	console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersData: ', rickAndMortyCharactersData);
				const { characters: { info }} = rickAndMortyCharactersData;
				setRickAndMortyCharactersInfo(info);
				if (!info.prev && info.next) {
					setRickAndMortyCharactersCurrentPage(1);
				} else if (info.next && info.prev) {
					setRickAndMortyCharactersCurrentPage(info.next - 1);
				} else {
					setRickAndMortyCharactersCurrentPage(info.pages);
				}
			}
			if (rickAndMortyCharactersByIdsData) {
				//	console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersByIdsData: ', rickAndMortyCharactersByIdsData);
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

						<div className="mb-3">
							{networkStatus === NetworkStatus.refetch && (
								<b><Loading text="Refetching" /></b>
							)}

							{rickAndMortyCharactersLoading && (
								<b><Loading text="Loading" /></b>
							)}

							{rickAndMortyCharactersError && (
								<b>Query Error: {rickAndMortyCharactersError.message}</b>
							)}
						</div>

						{rickAndMortyCharactersData && (
							<div>
								<div className="mb-3">
									<h5>rickAndMortyCharactersData Data:</h5>
								</div>
								{/* ----------------------------------------------------------------------- */}
								{rickAndMortyCharactersData.characters.results.map((character, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<RickAndMortyCharacter character={ character } />
									</div>
								))}
								{/* ----------------------------------------------------------------------- */}
							</div>
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

						{clientExtract && (
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
							onClick={() => getRickAndMortyCharacter({variables: {id: 11}, fetchPolicy: 'network-only'})}
							buttonText="Get character 11"
						/>
					</div>

					{/*
					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharacters({variables: {page: rickAndMortyCharactersInfo.next, filter: { name: rickAndMortyCharactersFilterName }}, fetchPolicy: 'network-only'})}
							buttonText="getRickAndMortyCharacters"
						/>
					</div>
					*/}

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharactersByIds({variables: {ids: [10,12]}, fetchPolicy: 'network-only'})}
							buttonText="Get RandMCharsByIds 10,12"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharactersByIds({variables: {ids: [1,9]}, fetchPolicy: 'network-only'})}
							buttonText="Get RandMCharsByIds 1,9"
						/>
					</div>

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									type="text"
									className="form-control"
									name="rickAndMortyCharactersFilterName"
									value={rickAndMortyCharactersFilterName}
									onChange={e => setRickAndMortyCharactersFilterName(e.target.value)}
									placeholder="Rick, Morty, Beth..."
								/>
							</div>
						</div>
					</div>

					{rickAndMortyCharactersCurrentPage && (
						<div className="mb-3">
							<b>Page {rickAndMortyCharactersCurrentPage} of {rickAndMortyCharactersInfo.pages}</b>
						</div>
					)}
					
					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md ${rickAndMortyCharactersInfo ? rickAndMortyCharactersInfo.next ? '' : 'disabled' : null}`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: `${rickAndMortyCharactersFilterName}` }}, fetchPolicy: 'cache-and-network'})}
							buttonText="Get Characters"
						/>
					</div>

					{rickAndMortyCharactersData && (
						<div className="mb-3">
							<Button
								type="button"
								className={`btn-primary btn-md ${rickAndMortyCharactersInfo ? rickAndMortyCharactersInfo.next ? '' : 'disabled' : null}`}
								onClick={ () => {
									rickAndMortyCharactersFetchMore({
										variables: {page: rickAndMortyCharactersInfo.next, filter: { name: rickAndMortyCharactersFilterName }},
									});
								}}
								buttonText="fetchMore RickAndMortyCharacters"
							/>
						</div>
					)}

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
