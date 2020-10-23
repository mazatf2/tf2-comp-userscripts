import React from 'react'
import {Form} from './searchforms/components/Form'
import {FieldHorizontal} from './searchforms/components/FieldHorizontal'
import {Label} from './searchforms/components/Label'
import {FieldBody} from './searchforms/components/FieldBody'

type props = {
	onFilterTargetChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void,
	onFilterValueChange: (ev: React.ChangeEvent<HTMLInputElement>) => void,
	onExtendTableChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const FilterTableSelections = ({onFilterTargetChange, onFilterValueChange, onExtendTableChange}: props) => {
	return (
		<Form>
			<FieldHorizontal>
				<Label>Filter by</Label>
				<FieldBody>
					<div className="field is-grouped is-narrow">
						<div className="control">
							<div className="select">
								<select
									id="search"
									onChange={onFilterTargetChange}
								>
									<option defaultValue="true" value="title">log title</option>
									<option value="map">log map</option>
								</select>
							</div>
						</div>
						<div className="control">
							<input
								type="text"
								className="input"
								onChange={onFilterValueChange}
							/>
						</div>
					
					
					
					<div className="control">
						<label htmlFor="extend" className="label" style={{marginTop: '.375em'}}>Show</label>
					</div>
					<div className="control">
						<div className="select">
							<select
								id="extend"
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
		</Form>
	)
}