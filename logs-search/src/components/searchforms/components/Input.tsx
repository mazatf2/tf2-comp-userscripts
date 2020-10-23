import React from 'react'

export const Input = ({register, ...props}) => {
	return (
		<div className="field-body">
			<div className="field">
				<div className="control">
					<input
						type={props.type || 'txt'}
						className="input"
						ref={register}
						{...props}
					/>
				</div>
			</div>
		</div>
	)
}