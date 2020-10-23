import React from 'react'

export const FieldBody = ({...props}) => {
	return (
		<div className="field-body">
			{props.children}
		</div>
	)
}