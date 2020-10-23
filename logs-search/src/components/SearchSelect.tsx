import React, {useState} from 'react'
import {SearchForm} from './searchforms/SearchForm'
import {SearchFormAdvanced, searchObj} from './searchforms/SearchFormAdvanced'
import {Button} from './searchforms/components/Button'

export const SearchSelect = ({onSubmit}: { onSubmit: (searchObj: searchObj) => void }) => {
	const [isSimple, toggleSimple] = useState<boolean>(true)
	
	const toggle = () => {
		toggleSimple(!isSimple)
	}
	
	const Btn = () => (
		<Button
			type="checkbox"
			className="input"
			onClick={toggle}>
			<label>
				<input
					type="checkbox"
					className="checkbox"
					defaultChecked={!isSimple}
				/>
				{' '}Advanced
			</label>
		</Button>
	)
	
	return (
		<>
			{isSimple && <SearchForm onSubmit={onSubmit}>
				<Btn/>
			</SearchForm>}
			
			{!isSimple && <SearchFormAdvanced onSubmit={onSubmit}>
				<Btn/>
			</SearchFormAdvanced>}
		
		</>
	)
}