import React, { useState, useEffect, useCallback } from 'react';
import { 
	gql,
	useQuery,
	useMutation,
	useApolloClient,
} from '@apollo/client';

import {
  fragmentTypeDroid,
} from "../../graphql/fragments/fragments";

import { GetCharacter } from '../../graphql/queries/queries.graphql';

//	update local data in the cache with either 'direct cache writes' or 'client resolvers'
//	two ways to perform local state mutations:
//		1) directly write to the cache by calling "cache.writeQuery"
//		2) leveraging the useMutation hook with a GraphQL mutation that calls a local client-side resolver

//	@client directive: tells Apollo Client to fetch the field data locally (either from the cache or using a local resolver), 
//		instead of sending it to GraphQL server

//	=========================================================================================================
//	ApolloClient functions:

//		query():     resolves a single query and returns a Promise which is either resolved with data or an error
//		readQuery(): read data from the store in shape of provided GraphQL query
//									does not make network request
//									method starts at the root query

//		writeQuery(): write data in the shape of the provided GraphQL query directly to store
//									method starts at the root query
//	=========================================================================================================

//	useMutation hook accepts some options:
//		update: function used to update cache after a mutation occurs
//		refetchQueries: array or function that specifies which queries to refetch after mutation has occurred. array values either queries or query strings
//		onCompleted: callback executed once mutation successfully completes
//		client: 'ApolloClient' instance. By default the client passed down via context, but a different client can be passed in

//	curl \
//	  -X POST \
//	  -H "Content-Type: application/json" \
//	  --data '{ "query": "{ droid(id: 2001) { id name friends {id name} appearsIn primaryFunction } }" }' \
//	  http://localhost:4000/graphql

//	query {
//	  characters(page: 2, filter: { name: "rick" }) {
//	    info {
//	      count
//	    }
//	    results {
//	      name
//	    }
//	  }
//	  character(id: 1) {
//	    id
//	  }
//	}

export const GET_A_DROID = gql`
	query GetADroid($droidID: ID!) {
		droid(id: $droidID) {
			id
			name
			friends {
				id
				name
			}
			appearsIn
			primaryFunction
		}
	}
`;

export const GET_A_DROID_ALIAS = gql`
	query GetADroid($droidIDa: ID!, $droidIDb: ID!) {
		droidIDa: droid(id: $droidIDa) {
			...fragmentTypeDroid
		}
		droidIDb: droid(id: $droidIDb) {
			...fragmentTypeDroid
		}
	}
	${fragmentTypeDroid}
`;

export const GET_REVIEWS = gql`
	query GetEpisodeReviews($episode: Episode!) {
		reviews(episode: $episode) {
			episode
			stars
			commentary
		}
	}
`;

export const GET_CHARACTER = gql`
	query Character($id: ID){
		character(id: "1") @rest(type: "Post", path: "character/1/") {
			id
			name
			status
			species
			type
			gender
			origin {
				name
				type
				dimension
			}
			location {
				name
				type
				dimension
			}
			image
			episode {
				name
				episode
			}
		}
	}
`;

export const ADD_REVIEW = gql`
	mutation createReview($episode: Episode, $review: ReviewInput!) {
		createReview(episode: $episode, review: $review ) {
			episode
			stars
			commentary
		}
	}
`;

export const JUST_GET_REVIEWS = gql`
	query GetEpisodeReviews($episode: Episode!) {
		reviews(episode: $episode)
	}
`;

export const GraphiQLExample = () => {

	const client = useApolloClient();

	// console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > client.extract(): ', client.extract());

	const styles = require('./scss/GraphiQLExample.scss');

	//	const { loading, error, data } = useQuery(GET_A_DROID, { variables: { droidID: 2000 }});
	const { loading: queryLoadingDroid, error: queryErrorDroid, data: queryDataDroid } = useQuery(
		GET_A_DROID_ALIAS,
		{
			variables: {
				droidIDa: 2000,
				droidIDb: 2001,
			},
		},
	);

	const { loading: queryLoading, error: queryError, data: queryData } = useQuery(
		GET_REVIEWS,
		{
			variables: {
				episode: "EMPIRE",
			},
		},
	);

	//	If a mutation updates a single existing entity, 
	//		Apollo Client can automatically update that entity's value in its cache when the mutation returns

	//	If a mutation modifies multiple entities, or if it creates or deletes entities, 
	//		the Apollo Client cache is not automatically updated to reflect the result of the mutation
	const [addReview, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(
		ADD_REVIEW,
		{
			variables: {
				episode: "EMPIRE",
				review: {stars: 5, commentary: "Wow, how about EMPIRE!" }
			},
			// refetchQueries: () => [{ query: GET_REVIEWS, variables: { episode: "EMPIRE" }}],
			//	update(cache, { data: { createReview } }) {

			//		const { reviews } = cache.readQuery({ query: JUST_GET_REVIEWS, variables: { episode: "EMPIRE" } });

			//		cache.writeQuery({
			//			query: JUST_GET_REVIEWS,
			//			data: { reviews: reviews.concat([createReview]) },
			//		});

			//		// console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > cache.extract(): ', cache.extract());
			//	}
		}
	);

	const [clientExtract, setClientExtract] = useState(null);

	useEffect(() => {
			// componentDidMount
			console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample!!!! > useEffect() > componentDidMount');

			// componentDidUpdate
			if (clientExtract) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > clientExtract: ', clientExtract);
			}

			// -------------------------------

			if (queryErrorDroid) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryErrorDroid: ', queryErrorDroid);
			}
			if (queryLoadingDroid) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryLoadingDroid: ', queryLoadingDroid);
			}
			if (queryDataDroid) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryDataDroid: ', queryDataDroid);
			}

			// -------------------------------

			if (queryError) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryError: ', queryError);
			}

			if (queryLoading) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryLoading: ', queryLoading);
			}

			if (queryData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > queryData: ', queryData);
			}

			// -------------------------------


			if (mutationError) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > mutationError: ', mutationError);
			}

			if (mutationLoading) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > mutationLoading: ', mutationLoading);
			}
			// componentDidUpdate
			if (mutationData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentDidUpdate > mutationData: ', mutationData);
			}

			// componentWillUnmount
			return () => {
				// some effects might require cleanup
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphiQLExample > useEffect() > componentWillUnmount > cleanup phase');
			};
		},
		[] // only re-run the effect if an array item changes
	);

	return (

		<div className="container">

			<h2 className={styles.uniqueColor}>GraphiQL Webpack Example</h2>

			{/* (>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>) */}

			<div className="row">
				<div className="col-lg-12 mb-4">
					<div className="bg-color-ivory container-padding-border-radius-1 text-break">

						<div>

							{queryLoading && (
								<p>
									Loading queryLoading...
								</p>
							)}

							{queryError && (
								<p>
									Error queryError:(
								</p>
							)}

							{mutationLoading && (
								<p>
									Loading mutationLoading...
								</p>
							)}
							
							{mutationError && (
								<p>
									Error mutationError:(
								</p>
							)}

							{queryData && (
								<div>
									<h5>queryData Data:</h5>
									<div>----------------------------------</div>
									<div>{JSON.stringify(queryData)}</div>
									<div>----------------------------------</div>
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

							{mutationData && (
								<div>
									<h5>mutationData Data:</h5>
									<div>----------------------------------</div>
									<div>{JSON.stringify(mutationData)}</div>
									<div>----------------------------------</div>
								</div>
							)}

						</div>

						<div>

								<button
									onClick={ () => setClientExtract( client.extract() ) }
									className={`btn btn-success`}
								>
									View Apollo Cache
								</button>

								<button 
									onClick={() => refetch()}
									className={`btn btn-success`}
								>
									refetch
								</button>

								<button
									onClick={() => client.writeQuery({
										query: GET_REVIEWS,
										data: queryData
									})}
									className={`btn btn-success`}
								>
									writeQuery
								</button>

								<button 
									onClick={() => addReview()} 
									className={`btn btn-success`}
								>
									useMutation
								</button>

						</div>

					</div>
				</div>
			</div>

			<div className="row">

				<div className="col-lg-12 mb-4">

					<div className="card h-100">

						<h2 className="card-header text-center font-tester-font2">
							GraphiQL Example
						</h2>

						<div className="card-body">

							<h5 className="card-title text-center">
								An graphical interactive in-browser GraphQL IDE!
							</h5>

							<div className="card-body-container">

								<div className="card-body-content vh-100">

									<div>GraphiQL goes here...</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* (>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>) */}

		</div>
	);
}
