import React, {useEffect} from 'react'
import {getClassIcon} from '../ClassIcons'
import ToolTip from 'rc-tooltip'
import {sumNoDecimals} from '../CombineLogs'
import {logstf_json_player_labels} from '../../../logstf_api'
import 'rc-tooltip/assets/bootstrap_white.css'

const get = (key: string) => logstf_json_player_labels[key] || ''

export const ClassList = ({player}) => {
	
	const gameClasses = Object.values(player.class_stats)
		.filter(i => i.total_time.length > 0)
	
	const icons = gameClasses
		.map(i => {
			const kills = sumNoDecimals(i.kills)
			const assists = sumNoDecimals(i.assists)
			const deaths = sumNoDecimals(i.deaths)
			const dmg = sumNoDecimals(i.dmg)
			const total_time = sumNoDecimals(i.total_time)
			
			const tipID = player.steamID + i.type[0]
			
			return <ToolTip
				placement="top"
				key={tipID}
				overlay={
					<table className="table is-narrow">
						<thead>
						<tr>
							<th className="th">{get('kills')}</th>
							<th className="th">{get('assists')}</th>
							<th className="th">{get('deaths')}</th>
							<th className="th">{get('dmg')}</th>
						</tr>
						</thead>
						<tbody>
						<tr className="tr">
							<td>{kills}</td>
							<td>{assists}</td>
							<td>{deaths}</td>
							<td>{dmg}</td>
						</tr>
						</tbody>
					</table>
				}>
				<span>{
					getClassIcon[i.type[0]]()
				}</span>
			
			</ToolTip>
		})
	
	return <span>
		{icons}
	</span>
}