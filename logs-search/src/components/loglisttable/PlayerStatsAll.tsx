import React, {useEffect, useState} from 'react'
import {logListTableData} from '../../Index'
import {fetchLogData} from '../../fetch'
import {logstfJson} from '../../logstf_api'
import {labelObj} from './LoglistTable'

type entry = { entry: logListTableData, steam32: string }

export const playerStatsAllKeys = (steam32: string): labelObj[] => {
	const keys = [
		{
			'key': 'kills',
			'sortFn': 'number',
		},
		{
			'key': 'deaths',
			'sortFn': 'number',
		},
		{
			'key': 'assists',
			'sortFn': 'number',
		},
		{
			'key': 'suicides',
			'sortFn': 'number',
		},
		{
			'key': 'kapd',
			'sortFn': 'number', //FIXME
		},
		{
			'key': 'kpd',
			'sortFn': 'number', //FIXME
		},
		{
			'key': 'dmg',
			'sortFn': 'number',
		},
		{
			'key': 'dmg_real',
			'sortFn': 'number',
		},
		{
			'key': 'dt',
			'sortFn': 'number',
		},
		{
			'key': 'dt_real',
			'sortFn': 'number',
		},
		{
			'key': 'hr',
			'sortFn': 'number',
		},
		{
			'key': 'lks',
			'sortFn': 'number',
		},
		{
			'key': 'as',
			'sortFn': 'number',
		},
		{
			'key': 'dapd',
			'sortFn': 'number',
		},
		{
			'key': 'dapm',
			'sortFn': 'number',
		},
		{
			'key': 'drops',
			'sortFn': 'number',
		},
		{
			'key': 'medkits',
			'sortFn': 'number',
		},
		{
			'key': 'medkits_hp',
			'sortFn': 'number',
		},
		{
			'key': 'backstabs',
			'sortFn': 'number',
		},
		{
			'key': 'headshots',
			'sortFn': 'number',
		},
		{
			'key': 'headshots_hit',
			'sortFn': 'number',
		},
		{
			'key': 'sentries',
			'sortFn': 'number',
		},
		{
			'key': 'heal',
			'sortFn': 'number',
		},
		{
			'key': 'cpc',
			'sortFn': 'number',
		},
		{
			'key': 'ic',
			'sortFn': 'number',
		},
	]
	return keys.map(i => {
		return {...i, path: ['players', steam32, i.key]}
	})
}

const tds = (logData: logstfJson, steam32: string) => {
	return playerStatsAllKeys(steam32).map(i => <td key={i.key}>{logData.players[steam32][i.key]}</td>)
}

export const PlayerStatsAll = ({entry, steam32}: entry) => {
	const {log} = entry
	
	const [logData, setLogData] = useState<logstfJson | null>(null)
	
	useEffect(() => {
		fetchLogData(log.id)
			.then(r => r.json())
			.then(i => setLogData(i))
	}, [])
	
	return (
		<>
			{logData && tds(logData, steam32)}
		</>
	)
}