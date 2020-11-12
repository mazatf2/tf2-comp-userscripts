import React from 'react'
import {Redirect as RouterRedirect} from 'react-router-dom'

export const Redirect = (why: any[]) => {
	console.log('redirect: ', why)
	return <RouterRedirect to="/"/>
}