import React from 'react'

export const Form = ({...props}) => {
	return (
		<div
			className="section"
		>
			<div
				className="container"
			>
				<form
					onSubmit={props.onSubmit}
				>
					{props.children}
				</form>
			</div>
		</div>
	)
}