import React from 'react'

export const Label = ({...props}) => {
	return (
		<div className="field-label">
			<label
				className="label"
				{...props}
			/>
		</div>
	)
}