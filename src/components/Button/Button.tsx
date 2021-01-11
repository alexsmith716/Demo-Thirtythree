import React from 'react';

export type Props = {
	className?: string;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset' | undefined;
	buttonText?: string;
};

export const Button: React.FC<Props> = ({ className, onClick=() => false, type='button', buttonText='button' }) => {
	return (
		<button className={`btn ${className}`} onClick={onClick} type={type}>
			{buttonText}
		</button>
	);
};
