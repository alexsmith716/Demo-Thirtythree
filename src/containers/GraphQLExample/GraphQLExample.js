import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
	gql,
} from '@apollo/client';

import { Loading } from '../../components/Loading';
import Button from '../../components/Button';
import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_RICK_AND_MORTY_CHARACTERS, } from '../../graphql/queries/queries.js';

const GraphQLExample = () => {

	//	const [errorMessage, setErrorMessage] = useState(null);
	const inputElement = useRef(null);
	const [clientExtract, setClientExtract] = useState(null);
	const [rickAndMortyCharactersInfo, setRickAndMortyCharactersInfo] = useState(null);
	const [rickAndMortyCharactersFilterName, setRickAndMortyCharactersFilterName] = useState('');
	const [rickAndMortyCharactersCurrentPage, setRickAndMortyCharactersCurrentPage] = useState(null);

	const client = useApolloClient();

	//	=====================================================================

	const variables = {
		filter: { name: `${rickAndMortyCharactersFilterName}`},
	};

	//	1 = loading, 2 = setVariables, 3 = fetchMore, 4 = refetch, 6 = poll, 7 = ready, 8 = error
	//	2 = setVariables ?????

	//	the very first query will read from the cache and make a network request, 
	//		but subsequent queries will make a network request only if the cache data has become incomplete

	//	https://github.com/apollographql/apollo-client/issues/6907

	const [getRickAndMortyCharacters, {
			loading: rickAndMortyCharactersLoading, 
			error: rickAndMortyCharactersError,
			data: rickAndMortyCharactersData,
			previousData,
			fetchMore,
			networkStatus,
		}] = useLazyQuery(
			gql`${GET_RICK_AND_MORTY_CHARACTERS}`,
			{
				fetchPolicy: 'cache-and-network',
				nextFetchPolicy: 'cache-first',
				//	variables,
				notifyOnNetworkStatusChange: true,
			}
	);

  //  const isSetVariables = networkStatus === 2;

  //  const characters = !isSetVariables ? rickAndMortyCharactersData?.characters : undefined;
  //  const next = characters?.info?.next;

  //  const hasNextPage = Boolean(next);
  //  const results = characters?.results || [];

  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > networkStatus: ', networkStatus);
  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > isSetVariables: ', isSetVariables);
  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > characters: ', characters);
  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > next: ', next);
  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > hasNextPage: ', hasNextPage);
  //  console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > results: ', results);

	//	=====================================================================

	useEffect(() => {
			if (previousData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > previousData: ', previousData);
			}
			if (rickAndMortyCharactersData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersData: ', rickAndMortyCharactersData);
				const { characters: { info }} = rickAndMortyCharactersData;
				setRickAndMortyCharactersInfo(info);
				if (!info.prev && info.next) {
					setRickAndMortyCharactersCurrentPage(1);
				} else if (info.next && info.prev) {
					setRickAndMortyCharactersCurrentPage(info.next - 1);
				} else {
					setRickAndMortyCharactersCurrentPage(info.pages);
				}
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersCurrentPage: ', rickAndMortyCharactersCurrentPage);
			}
			if (rickAndMortyCharactersFilterName) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > rickAndMortyCharactersFilterName: ', rickAndMortyCharactersFilterName);
			}
		},
		[rickAndMortyCharactersData, rickAndMortyCharactersFilterName, previousData]
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

            {/* 
						<div>
							<div className="mb-3">
								<h5>rickAndMortyCharactersData Data:</h5>
							</div>
							{results.map((character, index) => (
								<div key={index} className="mb-3 container-padding-border-radius-2">
									<RickAndMortyCharacter character={ character } />
								</div>
							))}
						</div>
            */}

						{rickAndMortyCharactersData && (
							<div>
								<div className="mb-3">
									<h5>rickAndMortyCharactersData Data:</h5>
								</div>
								{rickAndMortyCharactersData.characters.results.map((character, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<RickAndMortyCharacter character={ character } />
									</div>
								))}
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

					{/* ======================================================================= */}
					{/* ======================================================================= */}

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									ref={inputElement}
									type="text"
									className="form-control"
									name="rickAndMortyCharactersFilterName"
									defaultValue={rickAndMortyCharactersFilterName}
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
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: rickAndMortyCharactersFilterName }},})}
							buttonText="Get Characters!!"
						/>
					</div>

					{/* ======================================================================= */}
					{/* ======================================================================= */}

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Rick' }},})}
							buttonText="get rick chars"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Beth' }},})}
							buttonText="get beth chars"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Morty' }},})}
							buttonText="get morty chars"
						/>
					</div>

          {rickAndMortyCharactersData && (
            <div className="mb-3">
              <Button
                type="button"
                className={`btn-primary btn-md ${rickAndMortyCharactersInfo ? rickAndMortyCharactersInfo.next ? '' : 'disabled' : null}`}
                onClick={ () => {
                  fetchMore({
                    variables: {page: rickAndMortyCharactersInfo.next,},
                  });
                }}
                buttonText="Fetch More"
              />
            </div>
          )}

          {/* 
					{rickAndMortyCharactersData && (
						<div className="mb-3">
							<Button
								type="button"
								className={`btn-primary btn-md ${rickAndMortyCharactersInfo ? rickAndMortyCharactersInfo.next ? '' : 'disabled' : null}`}
								onClick={ () => {
									fetchMore({
										variables: {page: next,},
									});
								}}
								buttonText="Fetch More!"
							/>
						</div>
					)}
          */}

				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
