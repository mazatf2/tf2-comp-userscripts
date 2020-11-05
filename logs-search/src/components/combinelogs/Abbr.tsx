import React from 'react'
import {logstf_json_player_abbr, logstf_json_player_labels} from '../../logstf_api'

export const Abbr = (labelId: string) => {
	const long = logstf_json_player_labels[labelId] || ''
	const label = logstf_json_player_abbr[labelId] || ''
	
	return <abbr
		style={{textDecoration: 'none'}}
		title={long}
	>
		{label}
	</abbr>
}