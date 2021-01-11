import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	gql,
	useQuery,
	useMutation,
	useApolloClient,
} from '@apollo/client';
import { Button } from '../../components/Button';

import * as Styles from './styles';

import { GetCharacter } from '../../graphql/queries/queries.graphql';
import * as graphqlQueries from '../../graphql/queries/queries';

//  <Styles.GraphQLExample></Styles.GraphQLExample>

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


const GraphQLExample = () => {

	const client = useApolloClient();

	//  const { loading, error, data } = useQuery(GET_A_DROID, { variables: { droidID: 2000 }});
	const { loading: queryLoadingDroid, error: queryErrorDroid, data: queryDataDroid } = useQuery(
		graphqlQueries.GET_A_DROID_ALIAS,
		{
			variables: {
				droidIDa: 2000,
				droidIDb: 2001,
			},
		},
	);

	const { loading: queryLoading, error: queryError, data: queryData } = useQuery(
		graphqlQueries.GET_REVIEWS,
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
		graphqlQueries.ADD_REVIEW,
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
		<>
			<Helmet title="GraphQL Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">GraphQL Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">
					<div className="mb-3">

						{queryLoading && (
							<p>
								Loading queryLoading...
							</p>
						)}

						{queryError && (
							<p>
								Error queryError!
							</p>
						)}

						{mutationLoading && (
							<p>
								Loading mutationLoading...
							</p>
						)}
						
						{mutationError && (
							<p>
								Error mutationError!
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

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => setClientExtract(client.extract())}
							buttonText="View Apollo Cache"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => refetch()}
							buttonText="refetch"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => client.writeQuery({
								query: GET_REVIEWS,
								data: queryData
							})}
							buttonText="writeQuery"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success"
							onClick={() => addReview()}
							buttonText="useMutation"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
