import React, {useEffect, useMemo, useState} from 'react'
import {sum} from '@bit/mazatf.components.utils'
import {fetchLogData} from '../../fetch'
import {logstfJson} from '../../logstf_api'
import {RoundInfo} from './RoundInfo'
import {CombineLogsPlayersTable} from './CombineLogsPlayersTable'


type props = {
	ids: number[]
	steam32: string
}

export const sumNoDecimals = (arr: number[]) => {
	if(!arr) return 0
	return Number(sum(arr).toFixed(0))
}

export const CombineLogs = ({ids, steam32}: props) => {
	const [logsArr, setLogsArr] = useState<logstfJson[]>([])
	console.log('CombineLogs', ids, steam32)
	
	useEffect(() => {
		const data = ids
			.map(id => fetchLogData(id))
		
		Promise.all(data)
			.then((logs) => {
				
				setLogsArr(logs)
				console.log('setLogsArr', logs, logsArr)
			})
	}, [ids])
	
	return <>
		<CombineLogsPlayersTable logsArr={logsArr} steam32={steam32}/>
		<RoundInfo logsArr={logsArr} ids={ids}/>
	</>
}