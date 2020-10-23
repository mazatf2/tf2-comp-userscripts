import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'

import {fetchLogs} from './fetch'
import {searchLogsApi, logList, fetchLogsOpts} from './logstf_api'
import {extendComponents, LoglistTable} from './components/LoglistTable'
import {highlight, search} from './sort/sort'
import Fuzzysort from 'fuzzysort'
import {SearchFormAdvanced, searchObj} from './components/searchforms/SearchFormAdvanced'
import {SearchForm} from './components/searchforms/SearchForm'
import {SearchSelect} from './components/SearchSelect'

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
			const t = await fetchLogs({player: [steam64]})
			const data: searchLogsApi = await t.json()
			
			mainData = data.logs.map(i => newTableDataEntry(i, steam64))
			setTableData(mainData)
			
			console.log(data)
			
			return t
		}
		
		testData()
		
	}, [steam64])
	
	const searchDebounce = useRef((debounce((a, b, c) => search(a, b, c), 50, {leading: true, maxWait: 50}))).current
	
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
			
			const results = searchDebounce(searchVal, searchObj, {key: 'key'})
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
	
	const handleSubmit = (i: searchObj)=>{
		console.log(i)
	}
	
	return <>
		{mainData.length} | {tableData.length}
		<SearchSelect onSubmit={handleSubmit}/>
		
		<div className="section field is-grouped">
			<div className="control">
				<label htmlFor="search" className="label" style={{marginTop: '0.5em'}}>Search by:</label>
			</div>
			<div className="control">
				<div className="select">
					<select
						id="search"
						onChange={(e) => handleSelect(e)}
					>
						<option defaultValue="true" value="title">log title</option>
						<option value="map">log map</option>
					</select>
				</div>
			</div>
			<div className="control">
				<input
					type="text"
					className="input"
					onChange={(e) => handleSearch(e)}
				/>
			</div>
			
			
			<div className="control">
				<label htmlFor="extend" className="label" style={{marginTop: '0.5em'}}>Extend table with:</label>
			</div>
			<div className="control">
				<div className="select">
					<select
						id="extend"
						onChange={(e) => {
							changeExtendTable(e.target.value)
						}}
					>
						<option defaultValue="true" value="nothing">nothing</option>
						<option value="PlayerStatsAll">player stats</option>
					</select>
				</div>
			</div>
		</div>
		
		<LoglistTable tableData={tableData} extendRightWith={extendTable} steam64={steam64}/>
	</>
}

ReactDOM.render(<App/>, document.getElementById('root'))