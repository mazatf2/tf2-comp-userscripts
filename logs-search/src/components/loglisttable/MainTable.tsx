import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {useAsyncDebounce, useGlobalFilter, useRowSelect, useSortBy, useTable} from 'react-table'
import {FieldHorizontal} from '../searchforms/components/FieldHorizontal'
import {Label} from '../searchforms/components/Label'
import {FieldBody} from '../searchforms/components/FieldBody'
import {logListTableData} from '../../Index'
import './MainTable.css'

export const IndeterminateCheckbox = forwardRef(({indeterminate, ...rest}, ref) => {
		// https://github.com/tannerlinsley/react-table/blob/v7.6.1/examples/row-selection/src/App.js#L36
		const defaultRef = React.useRef()
		const resolvedRef = ref || defaultRef
		
		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate
		}, [resolvedRef, indeterminate])
		
		return (
			<>
				<input
					type="checkbox"
					ref={resolvedRef}
					{...rest}
					className="checkbox"
				/>
			</>
		)
	},
)

function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}) {
	// https://github.com/tannerlinsley/react-table/blob/v7.6.1/examples/filtering/src/App.js#L39
	const count = preGlobalFilteredRows.length
	const [value, setValue] = React.useState(globalFilter)
	const onChange = useAsyncDebounce(value => {
		setGlobalFilter(value || undefined)
	}, 200)
	
	return (
		<FieldHorizontal>
			<Label>Filter</Label>
			<FieldBody>
				<div className="field is-narrow">
					<div className="control">
						<input
							value={value || ''}
							onChange={e => {
								setValue(e.target.value)
								onChange(e.target.value)
							}}
							placeholder={`${count} logs...`}
							className="input"
						/>
					</div>
				</div>
			</FieldBody>
		</FieldHorizontal>
	)
}

export type MainTableProps = {
	data: logListTableData[]
	columns: []
	steam64: string
}

export const MainTable = ({data, columns, steam64}: MainTableProps) => {
	const columnsMemo = useMemo(() => columns, [columns])
	const dataMemo = useMemo(() => data, [data])
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		selectedFlatRows,
		preGlobalFilteredRows,
		setGlobalFilter,
		state,
	} = useTable({
			columns: columnsMemo,
			data: dataMemo,
			disableSortRemove: true,
		},
		useGlobalFilter,
		useSortBy,
		useRowSelect,
	)
	
	const setBold = (i: boolean) => {
		if (i) return ''
		return 'noBold'
	}
	
	return (
		<div
			className="is-fullwidth is-fullheight"
			style={{overflow: 'auto'}}
		>
			<div className="container">
				{console.log(state, selectedFlatRows)}
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={state.globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				
				<table className="table is narrow is-hoverable" {...getTableProps()}>
					<thead className="thead">
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th
									{...column.getHeaderProps([
										column.getSortByToggleProps(),
										{
											className: `th ${column.className || ''} ${setBold(column.isSorted)}`,
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
													className: `td ${cell.column.className || ''}`,
												},
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
			</div>
		</div>
	)
}