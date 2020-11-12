import React from 'react'
import {useLocation} from 'react-router-dom'

export const SelectLogsPageNavigation = ({onLocationPage}: { onLocationPage: (path: string) => void }) => {
	let loc = useLocation()
	if (loc.pathname.includes('select'))
		onLocationPage('select')
	
	return <></>
}