import React, {useCallback, useEffect, useMemo, useState} from 'react'
import ProcessLog from '@bit/mazatf.components.process-log'
import {safeUseLayoutEffect, useTable} from 'react-table'
import {logstf_json} from '../../logstf_api'
import {fetchLogData} from '../../fetch'

const testData = async (logs, steam32) => {
	const processLog = new ProcessLog()
	const promises = logs.map(async i => await processLog.newLog(i, steam32))
	
	const result = await processLog.db
	console.log(result)
}


type props = {
	ids: number[]
	steam32: number
}

export const CombineLogs = ({ids, steam32}: props) => {
	const [playerLog, setPlayerLog] = useState<logstf_json[]>([])
	useEffect(() => {
		const fetchLogs = async () => {
			const data = ids
				.map(id => fetchLogData(id)
					.then(r => r.json()),
				)
			
			const logsArr = await Promise.all(data)
			testData(logsArr, steam32)
		}
		fetchLogs()
	}, [ids])
	
	
	const data = useMemo(
		() => [
			{
				col1: 'Hello',
				col2: 'World',
			},
			{
				col1: 'react-table',
				col2: 'rocks',
			},
			{
				col1: 'whatever',
				col2: 'you want',
			},
		],
		[playerLog],
	)
	
	const columns = React.useMemo(
		() => [
			{
				Header: 'Column 1',
				accessor: 'col1', // accessor is the "key" in the data
			},
			{
				Header: 'Column 2',
				accessor: 'col2',
			},
		],
		[],
	)
	const tableInstance = useTable({columns, data})
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = tableInstance
	
	return <>
		<table className="table" {...getTableProps()}>
			<thead>
			{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<th
							{...column.getHeaderProps()}
						
						>
							{column.render('Header')}
						</th>
					))}
				</tr>
			))}
			</thead>
			<tbody {...getTableBodyProps()}>
			{rows.map(row => {
				prepareRow(row)
				return (
					<tr {...row.getRowProps()}>
						{row.cells.map(cell => {
							return (
								<td
									{...cell.getCellProps()}
								>
									{cell.render('Cell')}
								</td>
							)
						})}
					</tr>
				)
			})}
			</tbody>
		</table>
	
	</>
}