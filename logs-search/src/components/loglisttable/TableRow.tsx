import {tableData} from '../../Index'
import {highlight2} from '../../sort/fuzzysort'
import Highlighter from 'react-highlight-words'
import {PlayerStatsAll} from './PlayerStatsAll'
import React from 'react'
import {extendComponents} from './LoglistTable'

export const TableRow = ({
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