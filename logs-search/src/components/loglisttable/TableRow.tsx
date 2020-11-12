import {logListTableData} from '../../Index'
import {highlight2} from '../../sort/fuzzysort'
import Highlighter from 'react-highlight-words'
import React from 'react'

type props = {
	entry: logListTableData,
	extend: JSX.Element | null
	onSelect: (id: number) => void
}

export const TableRow = ({entry, extend, onSelect}: props) => {
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
			<td>
				<input
					type="checkbox"
					className="checkbox"
					checked={entry.selected}
					onChange={() => onSelect(log.id)}
				/>
			</td>
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