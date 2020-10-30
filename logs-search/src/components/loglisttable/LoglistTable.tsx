import React, {useEffect, useState} from 'react'
import SteamID from 'steamid'
import _get from 'lodash.get'
import {tableData} from '../../Index'
import {Button} from '../searchforms/components/Button'
import {TableRow} from './TableRow'
import {PlayerStatsAll, playerStatsAllKeys} from './PlayerStatsAll'
import {fetchLogData} from '../../fetch'
import {logstf_json} from '../../logstf_api'

export type extendComponents = 'PlayerStatsAll' | 'nothing'

export type labelObj = {
	key: string,
	sortFn: 'number' | 'string'
	path: string | string[]
}
const keys: labelObj[] = [
	{
		'key': 'id',
		'sortFn': 'number',
		'path': 'log.id',
	},
	{
		'key': 'title',
		'sortFn': 'string',
		'path': 'log.title',
	},
	{
		'key': 'map',
		'sortFn': 'string',
		'path': 'log.map',
	},
	{
		'key': 'players',
		'sortFn': 'number',
		'path': 'log.players',
	},
	{
		'key': 'date',
		'sortFn': 'number',
		'path': 'log.date',
	},
	{
		'key': 'views',
		'sortFn': 'number',
		'path': 'log.views',
	},
]

export type LogListTableProps = {
	tableData: tableData[]
	extendRightWith: extendComponents
	steam64: string
}

export const LoglistTable = ({tableData, extendRightWith, steam64: steam64}: LogListTableProps) => {
	const [sortBy, setSortBy] = useState<string | null>(null)
	const [sortTarget, setSortTarget] = useState<string | null>(null)
	const [sortDir, setSortDir] = useState<boolean>(true)
	const [tableDataExtend, setTableDataExtend] = useState<{ key: number, value: logstf_json }[]>([])
	const [labelsMain, setLabelsMain] = useState<labelObj[]>([])
	const [labelsExtend, setLabelsExtend] = useState<labelObj[]>([])
	
	const onClick = (ev: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
		console.log(ev.currentTarget.dataset)
		toggleSortDir()
		setSortBy(ev.currentTarget.dataset.labelkey as string)
		setSortTarget(ev.currentTarget.dataset.labeltarget as string)
	}
	
	const toggleSortDir = () => setSortDir(!sortDir)
	
	const Label = (i: labelObj, labelTarget: string) => <td
		onClick={onClick}
		data-labelkey={i.key}
		data-labeltarget={labelTarget}
		key={i.key}
	>
		<Button>{i.key}</Button>
	</td>
	
	const sortString = (a: tableData, b: tableData, path: labelObj['path']) => {
		if (!sortBy) return
		
		if (sortDir) {
			return _get(a, path).localeCompare(_get(b, path))
		}
		
		return _get(b, path).localeCompare(_get(a, path))
		
	}
	
	const sortNumber = (a: tableData, b: tableData, path: labelObj['path']) => {
		if (!sortBy) return
		
		if (sortDir) {
			return _get(a, path) - _get(b, path)
		}
		
		return _get(b, path) - _get(a, path)
	}
	
	const sortedTableData = React.useMemo(() => {
		const shallowCopy = [...tableData]
		if (!sortBy || !sortTarget) return shallowCopy
		
		const label = labelsMain.find(i => i.key === sortBy) || labelsExtend.find(i => i.key === sortBy)
		
		if (sortTarget === 'labelsMain') {
			if (label?.sortFn === 'string')
				return shallowCopy.sort((a, b) => sortString(a, b, label.path))
			if (label?.sortFn === 'number')
				return shallowCopy.sort((a, b) => sortNumber(a, b, label.path))
		}
		
		if (sortTarget === 'labelsExtend') {
			const temp = [...tableDataExtend]
			let sorted
			
			if (label?.sortFn === 'string')
				sorted = temp.sort((a, b) => sortString(a.data, b.data, label.path))
			if (label?.sortFn === 'number')
				sorted = temp.sort((a, b) => sortNumber(a.data, b.data, label.path))
			
			if (sorted) {
				const ids = sorted.map(i => i._logId)
				const result = ids.map(i => shallowCopy.find(log => log.log.id === i))
				
				return result
			}
		}
		return shallowCopy
	}, [tableData, tableDataExtend, sortBy, sortDir, sortTarget])
	
	useEffect(() => {
		setLabelsMain([...keys])
	}, [keys])
	
	useEffect(() => {
		if (extendRightWith === 'PlayerStatsAll') {
			const id = new SteamID(steam64)
			const steam32 = id.getSteam3RenderedID()
			
			setLabelsExtend(playerStatsAllKeys(steam32))
		}
	}, [extendRightWith, steam64])
	
	useEffect(() => {
		const f = () => {
			const data = tableData
				.map(i => fetchLogData(i.log.id)
					.then(async r => {
						return {data: await r.json(), _logId: i.log.id}
					}),
				)
			
			Promise.all(data).then((i) => {
				setTableDataExtend(i)
			})
		}
		if (tableData && extendRightWith === 'PlayerStatsAll')
			f()
		
	}, [tableData, extendRightWith])
	
	let extend = (entry: tableData, steam64: string) => {
		if (extendRightWith === 'PlayerStatsAll') {
			
			const id = new SteamID(steam64)
			const steam32 = id.getSteam3RenderedID()
			
			return <PlayerStatsAll entry={entry} steam32={steam32}/>
		}
		return null
	}
	
	return (
		<div
			className="section is-fullwidth is-fullheight"
			style={{overflow: 'auto'}}
		>
			<div className="container">
				<table
					className="table is-narrow is-hoverable"
				>
					<thead>
					<tr>
						{
							labelsMain.map(i => Label(i, 'labelsMain'))
						}
						{
							labelsExtend.map(i => Label(i, 'labelsExtend'))
						}
					</tr>
					</thead>
					<tbody>
					{
						sortedTableData
							//.sort((a, b) => b.fuzzyResult.score - a.fuzzyResult.score)
							.map(i => <TableRow
								key={i.log.id}
								entry={i}
								extend={extend(i, steam64)}
							/>)
					}
					</tbody>
				</table>
			</div>
		</div>
	)
}