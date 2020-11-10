import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'
import SteamID from 'steamid'
import {fetchLogs} from './fetch'
import {searchLogsApi, logList} from './logstf_api'
import {extendComponents, LogListTable} from './components/loglisttable/LoglistTable'
import {highlight, search} from './sort/fuzzysort'
import Fuzzysort from 'fuzzysort'
import {searchObj} from './components/searchforms/SearchFormAdvanced'
import {SearchSelect} from './components/SearchSelect'
import {FilterTableSelections} from './components/FilterTableSelections'
import {Button} from './components/searchforms/components/Button'
import {Label} from './components/searchforms/components/Label'
import {FieldBody} from './components/searchforms/components/FieldBody'
import {FieldHorizontal} from './components/searchforms/components/FieldHorizontal'
import {CombineLogs} from './components/combinelogs/CombineLogs'
import {MainTable} from './components/loglisttable/MainTable'

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
	const [tableData, setTableData] = useState<tableData[]>([])
	
	const id = new SteamID(steam64)
	const steam32 = id.getSteam3RenderedID()
	
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
	
	const handleExtendTable = (ev: React.ChangeEvent<HTMLSelectElement>) => {}
	
	const handleSubmit = (i: searchObj) => {
		console.log(i)
	}
	
	const getSelected = () => {
		return tableData.filter(i => i.selected)
			.map(i => i.log.id)
	}
	
	return <>
		{mainData.length} | {tableData.length}
		<SearchSelect onSubmit={handleSubmit}/>
		
		<CombineLogs
			steam32={steam32}
			ids={[1506035,1506078,1506121,1506164]}/>
		
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

ReactDOM.render(<App/>, document.getElementById('root'))