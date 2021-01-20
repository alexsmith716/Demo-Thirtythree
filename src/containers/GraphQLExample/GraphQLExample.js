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

	const [clientExtract, setClientExtract] = useState(null);
	const client = useApolloClient();

	const [getRickAndMortyCharacter, {
			loading, 
			error,
			data,
			refetch,
			fetchMore,
			networkStatus 
		}] = useLazyQuery(
			GET_RICK_AND_MORTY_CHARACTER,
			{
				notifyOnNetworkStatusChange: true,
			}
	);

	useEffect(() => {
			if (data) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > useEffect() > DATA: ', data.character);
			}
		},
		[data,]
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
							onClick={() => getRickAndMortyCharacter({ variables: { id: 1 }, fetchPolicy: 'network-only'})}
							buttonText="Get character 1"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharacter({ variables: { id: 3 }, fetchPolicy: 'network-only'})}
							buttonText="Get character 3"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => getRickAndMortyCharacter({ variables: { id: 9 }, fetchPolicy: 'network-only'})}
							buttonText="Get character 9"
						/>
					</div>

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
