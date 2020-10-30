import {tableData} from '../../Index'
import {highlight2} from '../../sort/fuzzysort'
import Highlighter from 'react-highlight-words'
import React from 'react'

type props = {
	entry: tableData,
	extend: JSX.Element | null
}

export const TableRow = ({entry, extend}: props) => {
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
				extend
			}
		</tr>
	)
}