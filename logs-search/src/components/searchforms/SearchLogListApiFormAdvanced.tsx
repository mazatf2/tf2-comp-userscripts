import React from 'react'
import {useForm} from 'react-hook-form'
import Steamid from 'steamid'
import {Input} from './components/Input'
import {Button} from './components/Button'
import {Label} from './components/Label'
import {FieldHorizontal} from './components/FieldHorizontal'
import {FieldBody} from './components/FieldBody'
import {PlayerSelect} from './rows/PlayerSelect'
import {Form} from './components/Form'

export const isMaybeValidSteamId = (val: string) => {
	if (val === undefined) return true
	if (val === '') return true
	
	try {
		const str = val.trim()
		
		const id = new Steamid(str)
		return id.isValid()
		
	} catch (e) {
		return false
	}
}

export const isMaybeValidSteamIdList = (val: string) => {
	if (val === undefined) return true
	if (val === '') return true
	
	try {
		const str = val.trim()
		const list = str.split(',')
		
		return list.every(i => isMaybeValidSteamId(i))
	} catch (e) {
		return false
	}
}

export type searchObj = {
	title: string, map: string, uploader: string, player: string
}

export const SearchLogListApiFormAdvanced = ({onSubmit, ...props}: { onSubmit: searchObj }) => {
	const {handleSubmit, register, errors} = useForm()
	
	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
		>
			<FieldHorizontal>
				<Label>Title</Label>
				<Input
					name="title"
					minLength={3}
					register={register({})}
					placeholder="i52 - BLU vs RED"/>
			</FieldHorizontal>
			
			<FieldHorizontal>
				<Label>Map</Label>
				<Input
					name="map"
					title="exact map name"
					minLength={3}
					register={register({})}
					placeholder="cp_process_final1"/>
			</FieldHorizontal>
			
			<FieldHorizontal>
				<Label>Uploader</Label>
				<Input
					name="uploader"
					title="steam id"
					register={register({
						validate: val => isMaybeValidSteamId(val),
					})}
					placeholder="76561197960497430"/>
			</FieldHorizontal>
			
			<PlayerSelect register={register({
				validate: val => isMaybeValidSteamIdList(val),
			})}/>
			
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					{errors.uploader && <p>invalid uploader</p>}
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
		</Form>
	)
}