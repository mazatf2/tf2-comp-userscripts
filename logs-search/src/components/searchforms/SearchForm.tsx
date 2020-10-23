import React from 'react'
import {useForm} from 'react-hook-form'
import {FieldHorizontal} from './components/FieldHorizontal'
import {Label} from './components/Label'
import {FieldBody} from './components/FieldBody'
import {Button} from './components/Button'
import {isMaybeValidSteamIdList, searchObj} from './SearchFormAdvanced'
import {PlayerSelect} from './rows/PlayerSelect'

export const SearchForm = ({onSubmit, ...props}: { onSubmit: searchObj }) => {
	const {handleSubmit, register, errors} = useForm()
	
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="section"
		>
			<PlayerSelect register={register({
				validate: val => isMaybeValidSteamIdList(val),
			})}/>
			
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					{errors.player && <p>invalid players</p>}
				</FieldBody>
			</FieldHorizontal>
			
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					<div className="field is-grouped">
						<Button onClick={handleSubmit(onSubmit)}>Search</Button>
						{props.children}
					</div>
				</FieldBody>
			</FieldHorizontal>
		</form>
	)
}