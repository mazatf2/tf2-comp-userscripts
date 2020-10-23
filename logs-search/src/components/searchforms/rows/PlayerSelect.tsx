import {FieldHorizontal} from '../components/FieldHorizontal'
import {Label} from '../components/Label'
import {Input} from '../components/Input'
import React from 'react'

export const PlayerSelect = ({register}) => {
	return (
		<FieldHorizontal>
			<Label>Players</Label>
			<Input
				name="player"
				title="steam id(s), comma separated"
				register={register}
				placeholder="76561197987681768, 76561197996199110, [U:1:3048631]"/>
		</FieldHorizontal>
	)
}