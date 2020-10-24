import React, {useEffect, useState} from 'react'
import SteamID from 'steamid'
import {tableData} from '../Index'
import {fetchLogData} from '../fetch'
import {logstf_json} from '../logstf_api'
import {playerStatsAllKeys} from './LoglistTable'

type entry = { entry: tableData, steam64: string }

const tds = (logData: logstf_json, steam32: string) => {
	return playerStatsAllKeys.map(i => <td key={i.key}>{logData.players[steam32][i.key]}</td>)
}

export const PlayerStatsAll = ({entry, steam64}: entry) => {
	const {log} = entry
	
	const [logData, setLogData] = useState<logstf_json | null>(null)
	
	useEffect(() => {
		fetchLogData(log.id)
			.then(r => r.json())
			.then(i => setLogData(i))
	}, [])
	
	const id = new SteamID(steam64)
	const steam32 = id.getSteam3RenderedID()
	
	return (
		<>
			{logData && tds(logData, steam32)}
		</>
	)
}