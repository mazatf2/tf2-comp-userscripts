import React from 'react'

export const Button = ({...props}) => {
	return (
		<div className="control">
			<button
				className="button"
				{...props}
			>
				{props.children}
			</button>
		</div>
	)
}