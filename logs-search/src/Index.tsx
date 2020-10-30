import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'

import {fetchLogs} from './fetch'
import {searchLogsApi, logList} from './logstf_api'
import {extendComponents, LoglistTable} from './components/loglisttable/LoglistTable'
import {highlight, search} from './sort/fuzzysort'
import Fuzzysort from 'fuzzysort'
import {searchObj} from './components/searchforms/SearchFormAdvanced'
import {SearchSelect} from './components/SearchSelect'
import {FilterTableSelections} from './components/FilterTableSelections'
import {Button} from './components/searchforms/components/Button'
import {Label} from './components/searchforms/components/Label'
import {FieldBody} from './components/searchforms/components/FieldBody'
import {FieldHorizontal} from './components/searchforms/components/FieldHorizontal'

export interface tableData {
	steam64: string
	log: logList
	fuzzyResult: Fuzzysort.Result
	highlight: {
		key: keyof logList | null,
		value: string
	}
	selected: boolean
}

const newTableDataEntry = (i: logList, steam64: string): tableData => {
	return {
		steam64: steam64,
		log: i,
		fuzzyResult: {indexes: [], target: '', score: Infinity},
		highlight: {key: null, value: ''},
		selected: false,
	}
}

let mainData: tableData[] = []

const App = () => {
	const [steam64, setSteam64] = useState<string>('76561197996199110')
	
	const [searchVal, setSearchVal] = useState<string>('')
	const [searchTarget, setFilterTarget] = useState<keyof logList>('title')
	const [tableData, setTableData] = useState<tableData[]>([])
	const [selectedLogs, setSelectedLogs] = useState<number[]>([])
	
	const [extendTable, setExtendTable] = useState<extendComponents>('nothing')
	
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
	
	const handleFilterValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setSearchVal(ev.target.value)
		searchRef.current = ev.target.value
	}
	
	const handleFilterTarget = (ev: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterTarget(ev.target.value)
		selectRef.current = ev.target.value
	}
	
	const handleExtendTable = (ev: React.ChangeEvent<HTMLSelectElement>) => {
		setExtendTable(ev.target.value)
	}
	
	const handleSubmit = (i: searchObj) => {
		console.log(i)
	}
	
	const selectAll = () => {
		const deepCopy: tableData[] = JSON.parse(JSON.stringify(tableData))
		deepCopy.forEach(i => i.selected = true)
		
		setTableData(deepCopy)
	}
	
	const selectId = (id: number) => {
		const deepCopy: tableData[] = JSON.parse(JSON.stringify(tableData))
		const log = deepCopy.find(i => i.log.id === id) as tableData
		log.selected = !log.selected
		
		setTableData(deepCopy)
	}
	
	const getSelected = () => {
		return tableData.filter(i => i.selected)
	}
	
	return <>
		{mainData.length} | {tableData.length}
		<SearchSelect onSubmit={handleSubmit}/>
		
		<FilterTableSelections
			onFilterTargetChange={handleFilterTarget}
			onFilterValueChange={handleFilterValue}
			onExtendTableChange={handleExtendTable}/>
		
		<div className="section container">
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					<div className="field is-grouped">
						<Button
							onClick={selectAll}>
							Select All
						</Button>
					</div>
				</FieldBody>
			</FieldHorizontal>
		</div>
		
		<LoglistTable
			onSelect={(id: number) => {selectId(id)}}
			tableData={tableData}
			extendRightWith={extendTable}
			steam64={steam64}/>
	</>
}

ReactDOM.render(<App/>, document.getElementById('root'))