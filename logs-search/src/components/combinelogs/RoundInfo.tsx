import React, {useMemo} from 'react'
import {logstfJson} from '../../logstf_api'
import {useExpanded, useTable} from 'react-table'
import {secondsToTimestamp} from '../../utils'
import './CombineLogs.css'
import {RoundInfoRoundOverview} from './RoundInfoRoundOverview'

type props = {
	logsArr: logstfJson[]
	ids: number[]
}

const numberColumn = (obj: {}) => {
	return {
		className: 'has-text-right',
		...obj,
	}
}

const textColumn = (obj: {}) => {
	return {
		className: 'has-text-left',
		...obj,
	}
}


export const RoundInfo = ({logsArr, ids}: props) => {
	
	if (!logsArr) return <>Loading</>
	
	if (logsArr.length === 0)
		return <>Loading</>
	
	console.log(logsArr)
	
	const columns = useMemo(() => [
		numberColumn({
			Header: 'Log',
			accessor: (log: logstfJson, index) => index,
			Cell: ({cell}) => <span>{cell.value + 1}</span>,
		}),
		textColumn({
			Header: 'Length',
			accessor: log => log.length,
			Cell: ({cell}) => <span>{secondsToTimestamp(cell.value)}</span>,
		}),
		{
			Header: 'Score',
			id: 'score',
			accessor: log => log.teams,
			Cell: ({cell}) => <span>{cell.value.Blue.score} - {cell.value.Red.score}</span>,
			className: 'has-text-centered'
		},
		numberColumn({
			Header: 'BLU K',
			accessor: log => log.teams,
			Cell: ({cell}) => <span>{cell.value.Blue.kills}</span>,
		}),
		numberColumn({
			Header: 'RED K',
			accessor: log => log.teams,
			Cell: ({cell}) => <span>{cell.value.Blue.kills}</span>,
		}),
		numberColumn({
			Header: 'BLU DA',
			accessor: log => log.teams,
			Cell: ({cell}) => <span>{cell.value.Blue.dmg}</span>,
		}),
		numberColumn({
			Header: 'RED DA',
			accessor: log => log.teams,
			Cell: ({cell}) => <span>{cell.value.Blue.dmg}</span>,
		}),
	], [])
	
	const data = useMemo(() => logsArr, [logsArr])
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		visibleColumns,
		state: {expanded},
	} = useTable({
			columns: columns,
			data: data,
		},
		useExpanded,
	)
	
	const getCellProps = (cell) => {
		
		if (cell.column.id === 'score') {
			const bluScore = cell.value.Blue.score
			const redScore = cell.value.Red.score
			let className = ''
			
			if (bluScore > redScore)
				className = 'blu'
			if (redScore > bluScore)
				className = 'red'
			
			return {
				className: className,
			}
			
		}
		
		return {}
	}
	
	return <table
		className="table is-hoverable"
		{...getTableProps()}
	>
		<thead className="thead">
		{headerGroups.map(headerGroup => (
			<tr {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map(column => (
					<th {...column.getHeaderProps([
						{
							className: `th ${column.className} noBold`,
						},
					])}
					>
						{column.render('Header')}</th>
				))}
			</tr>
		))}
		</thead>
		<tbody {...getTableBodyProps()}>
		{rows.map((row, index) => {
			prepareRow(row)
			
			return (
				<React.Fragment key={'roundinfo' + index}>
					<tr {...row.getRowProps()}
						{...row.getToggleRowExpandedProps()}>
						{row.cells.map(cell => {
							return (
								<td
									{...cell.getCellProps([
										{
											className: 'td ' + cell.column.className,
										},
										getCellProps(cell),
									])}
								>
									{cell.render('Cell')}
								</td>
							)
						})}
					</tr>
					{row.isExpanded ? (
						<tr>
							<td colSpan={visibleColumns.length}>
								{RoundInfoRoundOverview(row, index)}
							</td>
						</tr>
					) : null}
				</React.Fragment>
			)
		})}
		</tbody>
	</table>
	
}