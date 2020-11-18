import React from 'react'
import {getClassIcon} from '../ClassIcons'
import ToolTip from 'rc-tooltip'
import {sumNoDecimals} from '../CombineLogs'
import 'rc-tooltip/assets/bootstrap_white.css'
import {Abbr} from '../Abbr'
import {getEnglishWeaponName, secondsToTimestamp} from '../../../utils'

const get = (key: string) => Abbr(key)

export const ClassList = ({player}) => {
	
	const gameClasses = Object.values(player.class_stats)
		.filter(i => i.total_time.length > 0)
	
	const icons = gameClasses
		.map(i => {
			const kills = sumNoDecimals(i.kills)
			const assists = sumNoDecimals(i.assists)
			const deaths = sumNoDecimals(i.deaths)
			const dmg = sumNoDecimals(i.dmg)
			const total_time = secondsToTimestamp(sumNoDecimals(i.total_time))
			
			const tipID = player.steamID + i.type[0]
			
			const weapons = Object.values(i.weapon)
				.map(weapon => <tr
					key={tipID + weapon.name}
				>
					<td>{getEnglishWeaponName(weapon.name)}</td>
					<td>{sumNoDecimals(weapon.kills)}</td>
					<td>{sumNoDecimals(weapon.dmg)}</td>
				</tr>)
			
			return <ToolTip
				placement="top"
				key={tipID}
				overlay={
					<table className="table is-narrow">
						<thead>
						<tr>
							<th className="th">{get('custom_playtime')}</th>
							<th className="th">{get('kills')}</th>
							<th className="th">{get('assists')}</th>
							<th className="th">{get('deaths')}</th>
							<th className="th">{get('dmg')}</th>
						</tr>
						</thead>
						<tbody>
						<tr className="tr">
							<td>{total_time}</td>
							<td>{kills}</td>
							<td>{assists}</td>
							<td>{deaths}</td>
							<td>{dmg}</td>
						</tr>
						<tr>
							<th className="th">{/* weapon.name */}</th>
							<th className="th">{get('kills')}</th>
							<th className="th">{get('dmg')}</th>
						</tr>
						{weapons}
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