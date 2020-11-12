import React from 'react'
import {SearchLogListApi} from '../SearchLogListApi'
import {FilterTableSelections} from '../FilterTableSelections'
import {LogListTable} from '../loglisttable/LoglistTable'

export const SelectLogsPage = ({handleSubmit, handleExtendTable, tableData, steam64}) => {
	return <>
		<SearchLogListApi onSubmit={handleSubmit}/>
		
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