import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'

import {fetchLogs} from './fetch'
import {searchLogsApi, logList} from './logstf_api'
import {extendComponents, LoglistTable} from './components/LoglistTable'
import {highlight, search} from './sort/sort'
import Fuzzysort from 'fuzzysort'

export interface tableData {
	steam64: string
	log: logList
	fuzzyResult: Fuzzysort.Result
	highlight: {
		key: keyof logList | null,
		value: string
	}
}

const newTableDataEntry = (i: logList, steam64: string): tableData => {
	return {
		steam64: steam64,
		log: i,
		fuzzyResult: {indexes: [], target: '', score: Infinity},
		highlight: {key: null, value: ''},
	}
}

let mainData: tableData[] = []

const App = () => {
	const [steam64, setSteam64] = useState<string>('76561197996199110')
	
	const [searchVal, setSearchVal] = useState<string>('')
	const [searchTarget, setSearchTarget] = useState<keyof logList>('title')
	const [tableData, setTableData] = useState<tableData[]>([])
	
	const [extendTable, changeExtendTable] = useState<extendComponents>('nothing')
	
	const searchRef = React.useRef('')
	const selectRef = React.useRef('')
	
	useEffect(() => {
		const testData = async () => {
			const t = await fetchLogs(steam64)
			const data: searchLogsApi = await t.json()
			
			mainData = data.logs.map(i => newTableDataEntry(i, steam64))
			setTableData(mainData)
			
			console.log(data)
			
			return t
		}
		
		testData()
		
	}, [steam64])
	
	useEffect(() => {
		const testData = async () => {
			if (mainData.length < 1) return
			if (searchVal === '') {
				setTableData(mainData)
				return
			}
			//if(searchVal.length < 2) return
			if (!searchTarget) return
			
			console.log(1, searchVal, searchTarget)
			const searchObj = mainData.map(i => {
				return {
					id: i.log.id,
					key: i.log[searchTarget],
				}
			})
			
			const results = search(searchVal, searchObj, {key: 'key'})
			const ids = results.map(i => i.obj.id)
			
			const data: tableData[] = mainData.filter(i => ids.includes(i.log.id))
			for (const entry of data) {
				const fuzzyResult = results.filter(i => i.obj.id === entry.log.id)[0]
				entry.fuzzyResult = fuzzyResult
				
				entry.highlight = {
					key: searchTarget,
					value: highlight(fuzzyResult),
				}
				
			}
			
			setTableData(data)
			console.log(results)
			
		}
		
		testData()
		
	}, [searchVal, searchTarget])
	
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchVal(e.target.value)
		searchRef.current = e.target.value
	}
	
	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSearchTarget(e.target.value)
		selectRef.current = e.target.value
	}
	
	return <>
		{mainData.length} | {tableData.length}
		<label htmlFor="search">Search by:</label>
		<select
			id="search"
			onChange={(e) => handleSelect(e)}
		>
			<option defaultValue="true" value="title">log title</option>
			<option value="map">log map</option>
		</select>
		<input
			type="text"
			onChange={(e) => handleSearch(e)}
		/>
		
		<label htmlFor="extend">Extend table with:</label>
		<select
			id="extend"
			onChange={(e) => {
				changeExtendTable(e.target.value)
			}}
		>
			<option defaultValue="true" value="nothing">nothing</option>
			<option value="PlayerStatsAll">player stats</option>
		</select>
		
		<LoglistTable tableData={tableData} extendRightWith={extendTable} steam64={steam64}/>
	</>
}

ReactDOM.render(<App/>, document.getElementById('root'))