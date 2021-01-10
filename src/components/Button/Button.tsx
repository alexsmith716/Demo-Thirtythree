import React from 'react';

export type Props = {
	classNameX?: string;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset' | undefined;
	children?: React.ReactNode;
};

// why does "classNameX" work and "className" NOT work???????
export const Button: React.FC<Props> = ({ classNameX='btn-primary btn-md', onClick=() => false, type='button', children='button' }) => {
	return (
		<button className={`btn ${classNameX}`} onClick={onClick} type={type}>
			{children}
		</button>
	);
};
