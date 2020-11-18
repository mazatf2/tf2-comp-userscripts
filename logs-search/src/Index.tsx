import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import SteamID from 'steamid'
import {fetchLogList} from './fetch'
import {logListJson, searchLogListApi} from './logstf_api'
import Fuzzysort from 'fuzzysort'
import {searchObj} from './components/searchforms/SearchLogListApiFormAdvanced'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import {LandingPage} from './components/pages/LandingPage'
import {SelectLogsPage} from './components/pages/SelectLogsPage'
import {DevPage} from './components/pages/DevPage'
import {LogCombinerPage} from './components/pages/LogCombinerPage'
import {SelectLogsPageNavigation} from './components/pages/SelectLogsPageNavigation'

export interface logListTableData {
	steam64: string
	log: logListJson
	fuzzyResult: Fuzzysort.Result
	highlight: {
		key: keyof logListJson | null,
		value: string
	}
	selected: boolean
}

const newLogListTableDataEntry = (i: logListJson, steam64: string): logListTableData => {
	return {
		steam64: steam64,
		log: i,
		fuzzyResult: {indexes: [], target: '', score: Infinity},
		highlight: {key: null, value: ''},
		selected: false,
	}
}

let mainData: logListTableData[] = []

const App = () => {
	const [steam64, setSteam64] = useState<string>('76561197996199110')
	const [logListTableData, setLogListTableData] = useState<logListTableData[]>([])
	const [showSelectPage, setShowSelect] = useState(false)
	
	const id = new SteamID(steam64)
	const steam32 = id.getSteam3RenderedID()
	
	useEffect(() => {
		const testData = async () => {
			const t = await fetchLogList({player: [steam64]})
			const data: searchLogListApi = await t.json()
			
			mainData = data.logs.map(i => newLogListTableDataEntry(i, steam64))
			setLogListTableData(mainData)
			
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
		return logListTableData.filter(i => i.selected)
			.map(i => i.log.id)
	}
	
	const togglePages = (page?: string) => {
		console.log('togglePages')
		
		if (page.includes('select')){
			if(!showSelectPage){
				setShowSelect(true)
				console.log('show select')
			}
			
		}
		else {
			if(showSelectPage) {
				setShowSelect(false)
				console.log('hide select')
			}
		}
		
	}
	
	useEffect(() => {
		togglePages(location.pathname)
	}, [])
	
	const isSelectPageActive = () => {
		if (showSelectPage)
			return 'block'
		return 'none'
	}
	
	return <Router>
		<Link to="/" onClick={() => togglePages('')}>Frontpage</Link>
		<Link to="/select" onClick={() => togglePages('select')}>Select logs</Link>
		<Link to="/dev" onClick={() => togglePages('')}>Debug</Link>
		<Link to="/log-combiner" onClick={() => togglePages('')}>Combine logs</Link>
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
				tableData={logListTableData}
				steam64={steam64}
			/>
		</div>
	</Router>
}

ReactDOM.render(<App/>, document.getElementById('root'))