import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
	gql,
	useQuery,
	useLazyQuery,
	useApolloClient,
} from '@apollo/client';
import { Button } from '../../components/Button';

import { GET_CHARACTER_REST } from '../../graphql/queries/queries.js';


const RESTfulExample = () => {

	const client = useApolloClient();

	const [getCharacter, { loading: queryLoading, error: queryError, data: queryData }] = useLazyQuery(
		GET_CHARACTER_REST,
		{
			variables: {
				id: 5,
			},
		}
	);

	const [clientExtract, setClientExtract] = useState(null);

	useEffect(() => {
			// componentDidMount
			console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample!!!! > useEffect() > componentDidMount');

			// componentDidUpdate
			if (clientExtract) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidUpdate > clientExtract: ', clientExtract);
			}

			// -------------------------------

			if (queryError) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidUpdate > queryError: ', queryError);
			}

			if (queryLoading) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidUpdate > queryLoading: ', queryLoading);
			}

			if (queryData) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentDidUpdate > queryData: ', queryData);
			}

			// -------------------------------

			// componentWillUnmount
			return () => {
				// some effects might require cleanup
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > useEffect() > componentWillUnmount > cleanup phase');
			};
		},
		[] // only re-run the effect if an array item changes
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
