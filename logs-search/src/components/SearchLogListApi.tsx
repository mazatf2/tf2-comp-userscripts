import React, {useState} from 'react'
import {SearchLogListApiForm} from './searchforms/SearchLogListApiForm'
import {SearchLogListApiFormAdvanced, searchObj} from './searchforms/SearchLogListApiFormAdvanced'
import {Button} from './searchforms/components/Button'

export const SearchLogListApi = ({onSubmit}: { onSubmit: (searchObj: searchObj) => void }) => {
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
			{isSimple && <SearchLogListApiForm onSubmit={onSubmit}>
				<Btn/>
			</SearchLogListApiForm>}
			
			{!isSimple && <SearchLogListApiFormAdvanced onSubmit={onSubmit}>
				<Btn/>
			</SearchLogListApiFormAdvanced>}
		
		</>
	)
}