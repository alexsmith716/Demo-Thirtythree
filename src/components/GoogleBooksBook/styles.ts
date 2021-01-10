import styled, { css } from 'styled-components';
import { Button } from '../Button';

export const Thumbnail = styled.div`
	display: flex;
	justify-content: center;

	@media screen and (max-width: 992px) {
		justify-content: flex-start;
	}
`;

export const TinyButton = styled(Button)`
	font-size: 1.1rem;
	font-family: 'Phosphate';
`;