import React from 'react'
import Highlighter from 'react-highlight-words'

import {tableData} from '../Index'
import {highlight2} from '../sort/sort'
import {fetchLogData} from '../fetch'
import {PlayerStatsAll} from './PlayerStatsAll'

export type extendComponents = 'PlayerStatsAll' | 'nothing'

const keys = ['id', 'title', 'map', 'players', 'date', 'views']
export const playerStatsAllKeys = [
	'kills',
	'deaths',
	'assists',
	'suicides',
	'kapd',
	'kpd',
	'dmg',
	'dmg_real',
	'dt',
	'dt_real',
	'hr',
	'lks',
	'as',
	'dapd',
	'dapm',
	'drops',
	'medkits',
	'medkits_hp',
	'backstabs',
	'headshots',
	'headshots_hit',
	'sentries',
	'heal',
	'cpc',
	'ic',
]

const Row = ({
				 entry,
				 extendRightWith,
				 steam64,
			 }: { entry: tableData, extendRightWith: extendComponents, steam64: string }) => {
	const {log, fuzzyResult, highlight} = entry
	
	let highLighter = ''
	if (highlight.key) {
		const words = highlight2(fuzzyResult)
		
		highLighter = (<Highlighter
			searchWords={words}
			textToHighlight={log[highlight.key]}
			autoEscape={true}
		/>)
	}
	
	const is = (str: string) => {
		if (highlight.key && str === highlight.key)
			return highLighter
		return false
	}
	
	return (
		<tr
			data-score={fuzzyResult.score}
		>
			<td>{log.id}</td>
			<td>{is('title') || log.title}</td>
			<td>{is('map') || log.map}</td>
			<td>{log.players}</td>
			<td>{log.date}</td>
			<td>{log.views}</td>
			{
				(extendRightWith && extendRightWith === 'PlayerStatsAll') &&
				<PlayerStatsAll entry={entry} steam64={steam64}/>
			}
		</tr>
	)
}

export type LogListTableProps = {
	tableData: tableData[]
	extendRightWith: extendComponents
	steam64: string
}

export const LoglistTable = ({tableData, extendRightWith, steam64: steam64}: LogListTableProps) => {
	
	return (
		<table className="table">
			<thead>
			<tr>
				{keys.map(i => <td key={i}>{i}</td>)}
				{extendRightWith === 'PlayerStatsAll' && playerStatsAllKeys.map(i => <td key={i}>{i}</td>)}
			</tr>
			</thead>
			<tbody>
			{
				tableData
					.sort((a, b) => b.fuzzyResult.score - a.fuzzyResult.score)
					.map(i => <Row key={i.log.id} entry={i} extendRightWith={extendRightWith} steam64={steam64}/>)
			}
			</tbody>
		</table>
	)
}