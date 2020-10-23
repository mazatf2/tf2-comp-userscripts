import React from 'react'

export const Label = ({...props}) => {
	return (
		<div className="field-label is-normal">
			<label
				className="label"
				{...props}
			/>
		</div>
	)
}