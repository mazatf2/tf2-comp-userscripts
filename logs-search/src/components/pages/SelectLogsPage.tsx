import React from 'react'
import {SearchSelect} from '../SearchSelect'
import {FilterTableSelections} from '../FilterTableSelections'
import {LogListTable} from '../loglisttable/LoglistTable'

export const SelectLogsPage = ({handleSubmit, handleExtendTable, tableData, steam64}) => {
	return <>
		<SearchSelect onSubmit={handleSubmit}/>
		
		<div className="section">
			<div className="container">
				<FilterTableSelections
					onExtendTableChange={handleExtendTable}
				/>
				<LogListTable
					tableData={tableData}
					steam64={steam64}
				/>
			</div>
		</div>
	</>
}