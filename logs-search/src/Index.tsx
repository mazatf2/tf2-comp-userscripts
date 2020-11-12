import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import SteamID from 'steamid'
import {fetchLogs} from './fetch'
import {logList, searchLogsApi} from './logstf_api'
import Fuzzysort from 'fuzzysort'
import {searchObj} from './components/searchforms/SearchFormAdvanced'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import {LandingPage} from './components/pages/LandingPage'
import {SelectLogsPage} from './components/pages/SelectLogsPage'
import {DevPage} from './components/pages/DevPage'
import {LogCombinerPage} from './components/pages/LogCombinerPage'
import {SelectLogsPageNavigation} from './components/pages/SelectLogsPageNavigation'

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
	const [showSelectPage, setShowSelect] = useState(false)
	
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
	
	const togglePages = (page?: string) => {
		if (page === 'select')
			setShowSelect(true)
		else
			setShowSelect(false)
	}
	
	const isSelectPageActive = () => {
		if (showSelectPage)
			return 'block'
		return 'none'
	}
	
	return <Router>
		<Link to="/" onClick={() => togglePages('')}>Frontpage</Link>
		<Link to="/select" onClick={() => togglePages('select')}>Select logs</Link>
		<Link to="/dev">Debug</Link>
		<Link to="/log-combiner">Combine logs</Link>
		<Switch>
			<Route path="/select">
				test
				<SelectLogsPageNavigation onLocationPage={togglePages}/>
			</Route>
			<Route path="/log-combiner">
				<LogCombinerPage steam32={steam32} ids={[]}/>
			</Route>
			<Route path="/dev">
				<DevPage/>
			</Route>
			<Route path="/">
				<LandingPage/>
			</Route>
		</Switch>
		<div style={{display: isSelectPageActive()}}>
			<SelectLogsPage
				handleSubmit={handleSubmit}
				handleExtendTable={handleExtendTable}
				tableData={tableData}
				steam64={steam64}
			/>
		</div>
	</Router>
}

ReactDOM.render(<App/>, document.getElementById('root'))