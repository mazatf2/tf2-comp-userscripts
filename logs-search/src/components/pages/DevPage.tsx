import React, {useState} from 'react'
import {SelectLogsPage} from './SelectLogsPage'
import {CombineLogs} from '../combinelogs/CombineLogs'
import {LogCombinerPage} from './LogCombinerPage'
import SteamID from 'steamid'

export const DevPage = () => {
	const id = new SteamID('76561197996199110')
	const steam32 = id.getSteam3RenderedID()
	
	return <>
		<SelectLogsPage/>
		<LogCombinerPage steam32={steam32} ids={[1506035, 1506078, 1506121, 1506164]}/>
	</>
}