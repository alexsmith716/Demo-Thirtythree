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

//	<div className="bg-color-ivory container-padding-border-radius-1 text-break">


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

	const [addReview, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(
		graphqlQueries.ADD_REVIEW,
		{
			variables: {
				episode: "EMPIRE",
				review: {stars: 5, commentary: "Wow, how about EMPIRE!" }
			},
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

				<h1 className="mt-4 mb-3">GraphQL Example!</h1>

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
							onClick={() => refetch()}
						>
							refetch
						</Button>

					</div>
					<div className="mb-3">

						<Button
							type="button"
							className="btn-success"
							onClick={() => client.writeQuery({
								query: GET_REVIEWS,
								data: queryData
							})}
						>
							writeQuery
						</Button>

					</div>
					<div className="mb-3">

						<Button
							type="button"
							className="btn-success"
							onClick={() => addReview()}
						>
							useMutation
						</Button>

					</div>
				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
