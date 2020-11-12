type steam64 = string
type nickname = string
type steam32 = string
type unixTime = number
type seconds = number

export interface logListJson {
	date: number
	id: number
	map: string
	players: number
	title: string
	views: number
}

export interface searchLogListApi {
	logs: logListJson[]
	parameters: {
		limit: number
		map: string
		offset: number
		player: steam64
		title: string
		uploader: steam64
	}
	results: number
	success: boolean
	total: number
}

export interface searchLogListOpts {
	title: string
	map: string,
	uploader: steam64
	player: steam64[]
	limit: number
	offset: number
}

export interface logstfJson {
	'version': number,
	'teams': {
		'Red': {
			'score': number,
			'kills': number,
			'deaths': number,
			'dmg': number,
			'charges': number,
			'drops': number,
			'firstcaps': number,
			'caps': number
		},
		'Blue': {
			'score': number,
			'kills': number,
			'deaths': number,
			'dmg': number,
			'charges': number,
			'drops': number,
			'firstcaps': number,
			'caps': number
		}
	},
	'length': seconds,
	'players': {
		[key: string]: {
			'team': 'Blue' | 'Red',
			'class_stats': Array<{
				'type': string,
				'kills': number,
				'assists': number,
				'deaths': number,
				'dmg': number,
				'weapon': {
					[key: string]: {
						'kills': number,
						'dmg': number,
						'avg_dmg': number,
						'shots': number,
						'hits': number
					},
				},
				'total_time': seconds
			}>,
			'kills': number,
			'deaths': number,
			'assists': number,
			'suicides': number,
			'kapd': string,
			'kpd': string,
			'dmg': number,
			'dmg_real': number,
			'dt': number,
			'dt_real': number,
			'hr': number,
			'lks': number,
			'as': number,
			'dapd': number,
			'dapm': number,
			'ubers': number,
			'ubertypes': {
				[key: string]: number
			},
			'drops': number,
			'medkits': number,
			'medkits_hp': number,
			'backstabs': number,
			'headshots': number,
			'headshots_hit': number,
			'sentries': number,
			'heal': number,
			'cpc': number,
			'ic': number,
			'medicstats'?: {
				'advantages_lost': number,
				'biggest_advantage_lost': number,
				'deaths_with_95_99_uber': number,
				'deaths_within_20s_after_uber': number,
				'avg_time_before_healing': seconds,
				'avg_time_to_build': seconds,
				'avg_time_before_using': seconds,
				'avg_uber_length': seconds
			}
		},
	},
	'names': {
		[key: string]: nickname
	},
	'rounds': Array<{
		'start_time': unixTime,
		'winner': 'Red' | 'Blue',
		'team': {
			'Blue': {
				'score': number,
				'kills': number,
				'dmg': number,
				'ubers': number
			},
			'Red': {
				'score': number,
				'kills': number,
				'dmg': number,
				'ubers': number
			}
		},
		'events': Array<{
			'type': 'medic_death',
			'time': seconds,
			'team': 'Red' | 'Blue',
			'steamid': steam32,
			'killer': steam32
		} |
			{
				'type': 'drop',
				'time': seconds,
				'team': 'Red' | 'Blue',
				'steamid': steam32
			} |
			{
				'type': 'pointcap',
				'time': seconds,
				'team': 'Red' | 'Blue',
				'point': number
			} |
			{
				'type': 'charge',
				'medigun': string,
				'time': seconds,
				'steamid': steam32,
				'team': 'Red' | 'Blue'
			} |
			{
				'type': 'round_win',
				'time': seconds,
				'team': 'Red' | 'Blue'
			}>,
		'players': {
			[key: string]: {
				'team': 'Red' | 'Blue',
				'kills': number,
				'dmg': number
			}
		},
		'firstcap': 'Red' | 'Blue',
		'length': seconds
	}>,
	'healspread': {
		[key: string]: {
			[key: string]: number,
		},
	},
	'classkills': {
		[key: string]: {
			[key: string]: number
		}
	},
	'classdeaths': {
		[key: string]: {
			[key: string]: number
		}
	},
	'classkillassists': {
		[key: string]: {
			[key: string]: number
		}
	},
	'chat': Array<{
		'steamid': string,
		'name': string,
		'msg': string
	}>,
	'info': {
		'map': string
		'supplemental': boolean,
		'total_length': seconds,
		'hasRealDamage': boolean,
		'hasWeaponDamage': boolean,
		'hasAccuracy': boolean,
		'hasHP': boolean,
		'hasHP_real': boolean,
		'hasHS': boolean,
		'hasHS_hit': boolean,
		'hasBS': boolean,
		'hasCP': boolean,
		'hasSB': boolean,
		'hasDT': boolean,
		'hasAS': boolean,
		'hasHR': boolean,
		'hasIntel': boolean,
		'AD_scoring': boolean,
		'notifications': [],
		'title': string,
		'date': unixTime,
		'uploader': {
			'id': steam64,
			'name': string,
			'info': string
		}
	},
	'killstreaks': Array<{
		'steamid': steam32,
		'streak': number,
		'time': seconds
	}>,
	'success': boolean
}

// from root.players combined from .class_stats[]
export const logstf_json_player_labels = {
	// https://github.com/mazatf2/tf2-stats/blob/63ae9ab593c8decb29e6f2c417fe8c9272b7e8b3/src/logDB/Player/Player.js#L18
	// https://github.com/mazatf2/stuff/blob/253fa620ec7f80acc4f5778d7a29c4827554b39c/src/scatter/config.js#L15
	
	// 'team': 'team',
	// 'class_stats': 'class_stats[]',
	'kills': 'kills',
	'deaths': 'deaths',
	'assists': 'assists',
	'suicides': 'suicides',
	'kapd': 'kills and assists per death ratio',
	'kpd': 'kills per death ratio',
	'dmg': 'damage',
	'dmg_real': 'damage (real)',
	'dt': 'damage taken',
	'dt_real': 'damage taken (real)',
	'hr': 'heals received',
	'lks': 'killstreak',
	'as': 'airshots',
	'dapd': 'damage per death', // ?
	'dapm': 'damage per minute',
	// 'ubers': 'ubers{}',
	// 'ubertypes': 'ubertypes',
	'drops': 'drops',
	'medkits': 'medkits',
	'medkits_hp': 'medkits hp received',
	'backstabs': 'backstabs',
	'headshots': 'headshot kills',
	'headshots_hit': 'headshots hit',
	'sentries': 'sentries built',
	'heal': 'heal',
	'cpc': 'cp captures',
	'ic': 'intel captures',
}

export const logstf_json_player_abbr = {
	
	// 'team': 'team',
	// 'class_stats': 'class_stats[]',
	'kills': 'K',
	'deaths': 'D',
	'assists': 'A',
	'suicides': 'suicides',
	'kapd': 'kills and assists per death ratio',
	'kpd': 'K/D',
	'dmg': 'DA',
	'dmg_real': 'damage (real)',
	'dt': 'DT',
	'dt_real': 'damage taken (real)',
	'hr': 'heals received',
	'lks': 'killstreak',
	'as': 'AS',
	'dapd': 'DA/D',
	'dapm': 'DA/M',
	// 'ubers': 'ubers{}',
	// 'ubertypes': 'ubertypes',
	'drops': 'drops',
	'medkits': 'medkits',
	'medkits_hp': 'medkits hp received',
	'backstabs': 'BS',
	'headshots': 'HS',
	'headshots_hit': 'HS',
	'sentries': 'sentries built',
	'heal': 'heal',
	'cpc': 'CAP',
	'ic': 'intel captures',
}

export const localizedClass ={
	scout: 			'Scout',
	soldier: 		'Soldier',
	pyro: 			'Pyro',
	
	demoman: 		'Demoman',
	heavyweapons: 	'Heavy',
	engineer: 		'Engineer',
	
	medic: 			'Medic',
	sniper: 		'Sniper',
	spy: 			'Spy',
}