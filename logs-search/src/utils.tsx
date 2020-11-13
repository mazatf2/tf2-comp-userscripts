import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import WeaponDef from '@bit/mazatf.components.weapon_lognames_def/weapon_lognames_def'

dayjs.extend(duration)
dayjs.extend(utc)

export const secondsToTimestamp = (seconds: number): string => {
	if (!seconds) seconds = 0
	if (typeof seconds !== 'number') seconds = 0
	
	const difference = dayjs().subtract(seconds, 'second')
	const dur = dayjs.duration(dayjs().diff(difference))
	
	return dayjs.utc(dur.asMilliseconds()).format('H:m:s')
}

export const getEnglishWeaponName = (defName: string) => {
	const tfEnglish = WeaponDef[defName]?.tf_english
	
	if (tfEnglish) return tfEnglish
	if (defName.length > 0)
		defName = defName[0].toUpperCase() + defName.slice(1)
	
	return defName
}