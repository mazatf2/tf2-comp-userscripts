import React from 'react'
import {CombineLogs} from '../combinelogs/CombineLogs'
import {Redirect} from '../../loging'

type props = {
	steam32: string
	ids: number[]
}

export const LogCombinerPage = ({steam32, ids}: props) => {
	
	if (typeof steam32 !== 'string' || steam32.length < 14)
		return Redirect(['LogCombinerPage steam32', steam32])
	if (typeof ids !== 'object' || ids.length < 1)
		return Redirect(['LogCombinerPage ids', ids])
	
	return <CombineLogs
		steam32={steam32}
		ids={ids}/>
}