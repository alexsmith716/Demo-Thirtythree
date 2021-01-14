import React, { useState, useEffect } from 'react';
import { 
	useMutation,
} from '@apollo/client';
import { Button } from '../Button';
import { Thumbnail } from '../../Styles';


export const RickAndMortyCharacter = ({ character }) => {

	const [toggleCharacterDescriptionView, setToggleCharacterDescriptionView] = useState(false);

	return (
		<div className="row-flex">

			<div className="col-two">

				<Thumbnail>

					<div className="text-center">
						{ character.image
							?
							<div>
								<img src={character.image} alt={character.name}/>
							</div>
							:
							<div><i>Image not found</i></div>
						}
					</div>
				</Thumbnail>
			</div>

			<div className="col-ten">

				<div>{character.title ? <h3>{character.title}</h3> : <i>Title not found</i>}</div>

				<div><b>Episodes:&nbsp;</b>{character.episode ? character.episode.join(', ') : <i>n/a</i>}</div>

				<div><b>Gender:&nbsp;</b>{character.gender ? character.gender : <i>n/a</i>}</div>

				<div><b>Name:&nbsp;</b>{character.name ? character.name : <i>n/a</i>}</div>

				<div><b>Species:&nbsp;</b>{character.species ? character.species : <i>n/a</i>}</div>

				<div><b>Status:&nbsp;</b>{status.species ? status.species : <i>n/a</i>}</div>

				<div><b>ID:&nbsp;</b>{character.id ? character.id : <i>n/a</i>}</div>

				{character.description &&
					<>
						<div className={!toggleCharacterDescriptionView ? 'text-overflow-ellipsis' : ''}>
							{character.description}
						</div>
						<Button
							className="btn-light btn-tiny"
							onClick={() => setToggleCharacterDescriptionView(!toggleCharacterDescriptionView)}
							buttonText={toggleCharacterDescriptionView ? "<< Less" : "More >>"}
						/>
					</>
				}
			</div>
		</div>
	);
};
