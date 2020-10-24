import React, {useState} from 'react'
import {tableData} from '../../Index'
import {Button} from '../searchforms/components/Button'
import {TableRow} from './TableRow'

export type extendComponents = 'PlayerStatsAll' | 'nothing'

type labelObj = {
	key: string,
	sortFn: 'number' | 'string'
}
const keys: labelObj[] = [
	{
		'key': 'id',
		'sortFn': 'number',
	},
	{
		'key': 'title',
		'sortFn': 'string',
	},
	{
		'key': 'map',
		'sortFn': 'string',
	},
	{
		'key': 'players',
		'sortFn': 'number',
	},
	{
		'key': 'date',
		'sortFn': 'number',
	},
	{
		'key': 'views',
		'sortFn': 'number',
	},
]

export const playerStatsAllKeys: labelObj[] = [
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

export const labelKeys = [...keys, ...playerStatsAllKeys]

export type LogListTableProps = {
	tableData: tableData[]
	extendRightWith: extendComponents
	steam64: string
}

export const LoglistTable = ({tableData, extendRightWith, steam64: steam64}: LogListTableProps) => {
	const [sortBy, setsortBy] = useState<string | null>(null)
	const [sortDir, setSortDir] = useState<boolean>(true)
	
	const onClick = (ev: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
		console.log(ev.currentTarget.dataset)
		toggleSortDir()
		setsortBy(ev.currentTarget.dataset.key as string)
	}
	
	const toggleSortDir = () => setSortDir(!sortDir)
	
	const Label = (i: labelObj) => <td
		onClick={onClick}
		data-key={i.key}
		key={i.key}
	>
		<Button>{i.key}</Button>
	</td>
	
	const sortString = (a, b) => {
		if (!sortBy) return
		
		if (sortDir) {
			return a.log[sortBy].localeCompare(b.log[sortBy])
		}
		
		return b.log[sortBy].localeCompare(a.log[sortBy])
		
	}
	
	const sortNumber = (a, b) => {
		if (!sortBy) return
		
		if (sortDir) {
			return a.log[sortBy] - b.log[sortBy]
		}
		
		return b.log[sortBy] - a.log[sortBy]
	}
	
	const sortedTableData = React.useMemo(() => {
		const shallowCopy = [...tableData]
		if (!sortBy) return shallowCopy
		
		const label = labelKeys.find(i => i.key === sortBy)
		
		if (label?.sortFn === 'string')
			return shallowCopy.sort((a, b) => sortString(a, b))
		if (label?.sortFn === 'number')
			return shallowCopy.sort((a, b) => sortNumber(a, b))
		
		return shallowCopy
	}, [tableData, sortBy, sortDir])
	
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
							keys.map(Label)
						}
						{extendRightWith === 'PlayerStatsAll' && playerStatsAllKeys.map(Label)}
					</tr>
					</thead>
					<tbody>
					{
						sortedTableData
							//.sort((a, b) => b.fuzzyResult.score - a.fuzzyResult.score)
							.map(i => <TableRow key={i.log.id} entry={i} extendRightWith={extendRightWith}
								steam64={steam64}/>)
					}
					</tbody>
				</table>
			</div>
		</div>
	)
}