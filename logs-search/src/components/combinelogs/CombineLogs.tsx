import React, {useEffect, useMemo, useState} from 'react'
import ProcessLog from '@bit/mazatf.components.process-log'
import {sum} from '@bit/mazatf.components.utils'
import {useSortBy, useTable} from 'react-table'
import {fetchLogData} from '../../fetch'
import {Abbr} from './Abbr'
import './CombineLogs.css'
import {ClassList} from './cells/ClassList'
import {logstf_json} from '../../logstf_api'

const processLogs = async (logs, steam32: number) => {
	const handle = new ProcessLog()
	const promises = logs.map(async i => await handle.newLog(i, steam32))
	
	const result = await handle.db
	console.log(result)
	return result
}

type props = {
	ids: number[]
	steam32: number
}

export const sumNoDecimals = (arr: number[]) => Number(sum(arr).toFixed(0))

export const CombineLogs = ({ids, steam32}: props) => {
	const [logsArr, setLogsArr] = useState([])
	const [players, setPlayers] = useState([])
	
	useEffect(() => {
		const fetchLogs = async () => {
			const data = ids
				.map(id => fetchLogData(id)
					.then(r => r.json()),
				)
			
			const logsArr: logstf_json[] = await Promise.all(data)
			const result = await processLogs(logsArr, steam32)
			setPlayers(Object.values(result.DB.players))
			
			console.log(result)
			return
		}
		fetchLogs()
	}, [ids])
	
	const data = useMemo(() => players, [players])
	
	const sumColumn = (key: string) => {
		return {
			Header: Abbr(key),
			id: key,
			accessor: player => sumNoDecimals(player[key]),
			className: 'has-text-right',
		}
	}
	
	const columns = React.useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'currentTeam',
				id: 'currentName',
				className: 'has-text-left',
				Cell: i => i.row.original.currentName,
			},
			{
				Header: 'Classes',
				accessor: 'mostPlayedClass', // sort key
				id: 'class_stats',
				className: 'has-text-left',
				Cell: i => <ClassList player={i.row.original}/>,
			},
			sumColumn('kills'),
			sumColumn('assists'),
			sumColumn('deaths'),
			sumColumn('dmg'),
			sumColumn('dapm'), // dps
			// sumColumn('dapd'), // dmg per death
			sumColumn('kpd'), // kd
			sumColumn('as'),
			sumColumn('backstabs'),
			sumColumn('headshots'), // vs headshots_hit
			sumColumn('headshots_hit'), // vs headshots_hit
			sumColumn('cpc'), // captures
		],
		[],
	)
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns: columns,
		data: data,
		disableSortRemove: true,
	}, useSortBy)
	
	const getCellProps = (cell) => {
		
		if (['currentName'].includes(cell.column.id)) {
			const team = cell.row.original.currentTeam
			let className
			
			if (team === 'Red')
				className = 'red'
			if (team === 'Blue')
				className = 'blu'
			
			return {
				className: className,
			}
			
		}
		return {}
	}
	
	const setBold = (i: boolean) => {
		if(i) return ''
		return 'noBold'
	}
	
	return <>
		<table className="table is-hoverable" {...getTableProps()}>
			<thead className="thead">
			{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<th
							{...column.getHeaderProps([
								column.getSortByToggleProps(),
								{
									className: `th ${column.className} ${setBold(column.isSorted)}`
								},
							])}
						>
							{column.render('Header')}
						</th>
					))}
				</tr>
			))}
			</thead>
			<tbody className="tbody" {...getTableBodyProps()}>
			{rows.map(row => {
				prepareRow(row)
				return (
					<tr className="tr" {...row.getRowProps()}>
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
				)
			})}
			</tbody>
		</table>
	
	</>
}