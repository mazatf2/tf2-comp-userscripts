import React from 'react'
import {FieldHorizontal} from './searchforms/components/FieldHorizontal'
import {Label} from './searchforms/components/Label'
import {FieldBody} from './searchforms/components/FieldBody'

type props = {
	onExtendTableChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const FilterTableSelections = ({onExtendTableChange}: props) => {
	
	return (
		<FieldHorizontal>
			<Label>Show</Label>
			<FieldBody>
				<div className="field is-narrow">
					<div className="control">
						<div className="select">
							<select
								onChange={onExtendTableChange}
							>
								<option defaultValue="true" value="nothing">defaults</option>
								<option value="PlayerStatsAll">player stats</option>
							</select>
						</div>
					</div>
				</div>
			</FieldBody>
		</FieldHorizontal>
	)
}