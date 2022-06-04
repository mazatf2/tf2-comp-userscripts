// ==UserScript==
// @name         ETF2L match page demo and log search tool
// @version      0.1
// @description  Search Logs.tf and Demos.tf for logs and demos
// @author       https://github.com/mazatf2/
// @match        https://etf2l.org/matches/*
// @connect      api.etf2l.org
// @connect      api.demos.tf
// @connect      logs.tf
// @require      https://unpkg.com/timeago.js@4.0.2/dist/timeago.min.js
// ==/UserScript==

const Script = {allPlayers: [], isInited: false};

(function () {
	main()
})();

async function main() {
	const hookEl = document.querySelector('table.match-players')
	const containerEl = div``
	containerEl.id = 'userscript-etf2l-search-logs-demos'
	hookEl.after(containerEl)

	// [map1, map2, ...]
	const maps = [...document.querySelectorAll('.maps .map h2')].map(i => i.textContent)

	// [{nick: player1, etf2lID: 1234}, ...]
	const team1 = [...document.querySelectorAll('table.match-players tr:nth-child(1) a')].map(i => toPlayerObj(i))
	const team2 = [...document.querySelectorAll('table.match-players tr:nth-child(2) a')].map(i => toPlayerObj(i))
	const unrostered = [...document.querySelectorAll('table.match-players tr:nth-child(3) a')].map(i => toPlayerObj(i))
	const otherPlayers = [...document.querySelectorAll('table.match-players tr:nth-child(3) ~ tr a')].map(i => toPlayerObj(i))

	const allPlayers = [...team1, ...team2, ...unrostered, ...otherPlayers]
	Script.allPlayers = allPlayers

	// {123: steam64, 1234: steam64, ...}
	const index_by_etf2lId = allPlayers
		// .filter(i => i && i.player.steam.id64)
		.map(i => {
			return {id64: 'temp', id: i.etf2lID}
		})
		.reduce((accumulator, i) => {
			return {...accumulator, [i.id]: i.id64}
		}, {})

	const playerSelect = `
	<form>
	<br>
	<fieldset style="margin: 4px; border: none">
		<label>Userscript: Select players</label>
	</fieldset>
		${team1.length > 0 ? PlayerSelectRow(team1, index_by_etf2lId) : ''}
		${team2.length > 0 ? PlayerSelectRow(team2, index_by_etf2lId) : ''}
		${unrostered.length > 0 ? PlayerSelectRow(unrostered, index_by_etf2lId) : ''}
		${otherPlayers.length > 0 ? PlayerSelectRow(otherPlayers, index_by_etf2lId) : ''}
	<br>
	</form>
	`

	const mapListing = `
		<form>
		${maps.map(i => `
			<fieldset>
				<label><b>${i}</b></label><br>
				<div>
					<label>logs:</label>
					<ol id="${i}-logs.tf"></ol>
				</div><br>
				<div>
					<label>demos:</label>
					<ol id="${i}-demos.tf"></ol>
				</div><br>

				<!-- dataset is for LogsTF and DemosTF components-->
				<input value="Search Logs.tf" type="button" data-mapname="${i}" data-service="logs.tf" data-css_id="${i}-logs.tf"/>
				<input value="Search Demos.tf" type="button" data-mapname="${i}" data-service="demos.tf" data-css_id="${i}-demos.tf"/>
			</fieldset>
		`).join('')}
		</form>
	`

	const playerSelectEl = createEl('form', playerSelect)
	const mapListingEl = createEl('form', mapListing)
	const playersEl = [...playerSelectEl].filter(i => i.type === 'checkbox')

	mapListingEl.addEventListener('click', (e) => {

		if (e.target.type === 'button') {
			const id = e.target.dataset.css_id
			const button = e.target

			if (e.target.dataset.service === 'logs.tf') {
				button.disabled = true

				LogsTF(playersEl, e.target.dataset, () => {
					button.disabled = false
				})
					.then((el) => {
						document.querySelector(`ol[id="${id}"]`).append(el)
					})

			}

			if (e.target.dataset.service === 'demos.tf') {
				button.disabled = true

				DemosTF(playersEl, e.target.dataset, () => {
					button.disabled = false
				})
					.then((el) => {
						document.querySelector(`ol[id="${id}"]`).append(el)
					})
			}
		}
	})

	const resetCss = style`
		#userscript-etf2l-search-logs-demos * {
			padding: revert;
			margin: revert;
		}
	`

	containerEl.append(resetCss)
	containerEl.append(playerSelectEl)
	containerEl.append(mapListingEl)
	containerEl.append(ClearCache())
}

async function LogsTF(playersEl, dataset, enableButtonCb) {
	const ids = await getSteam64fromEl(playersEl)
	const {mapname, service, css_id} = dataset
	let html = li`searching...`

	fetchLogsApi(ids, mapname)
		.then(r => renderSuccess(r))
		.catch(e => {
			enableButtonCb()
			console.trace(e)
			html.innerHTML = 'error: ' + JSON.stringify(e)
		})

	function renderSuccess(api) {
		enableButtonCb()
		html.innerHTML = `
			<ul>
			${api.logs.map(i => {
			let {id, title, map, date, views, players} = i
			const playedAgo = timeago.format(date * 1000)
			const localeTime = new Date(date * 1000).toLocaleString()
			const url = 'https://logs.tf/' + id

			const txt = [title, players + ' players', playedAgo, localeTime].join(', ')

			return `<li><a href="${url}">${txt}</a></li>`
		}).join('')}
			</ul>
		`
	}

	return html
}

async function DemosTF(playersEl, dataset, enableButtonCb) {
	const ids = await getSteam64fromEl(playersEl)
	const {mapname, service, css_id} = dataset
	let html = li`searching...`

	fetchDemosApi(ids, mapname)
		.then(r => renderSuccess(r))
		.catch(e => {
			enableButtonCb()
			console.trace(e)
			html.innerHTML = 'error: ' + JSON.stringify(e)
		})

	function renderSuccess(api) {
		enableButtonCb()
		html.innerHTML = `
			<ul>
			${api.map(i => {
			let {id, server, duration, map, time, red, blue, redScore, blueScore, playerCount} = i
			const title = `${server}: ${blue} vs ${red}` // logs.tf title style
			const playedAgo = timeago.format(time * 1000)
			const localeTime = new Date(time * 1000).toLocaleString()
			const url = 'https://demos.tf/' + id

			const txt = [
				title, playerCount + ' players', playedAgo, localeTime, blueScore + ' - ' + redScore, Duration(duration),
			].join(', ')

			return `<li><a href="${url}">${txt}</a></li>`
		}).join('')}
			</ul>
		`
	}

	return html
}

function PlayerSelectRow(players, index_by_etf2lId) {
	const content = `
	<fieldset>
		${players.map(i => `
			<input id="${i.nick}" type="checkbox" checked data-nick="${i.nick}" data-etf2lID="${i.etf2lID}" data-id64="${index_by_etf2lId[i.etf2lID]}">
			<label for="${i.nick}">${i.nick}</label>
		`,).join('')}
	</fieldset>
	`
	return content
}

function Duration(seconds) {
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds % 60).toString().padStart(2, '0')
	return m + ':' + s
}

function ClearCache() {
	//dev tools -> application -> cache -> cache storage -> userscript-etf2l-match-page
	const fieldset = document.createElement('fieldset')
	fieldset.style.margin = '4px'
	fieldset.style.border = 'none'
	const el = document.createElement('button')
	el.textContent = 'Clear cache'
	el.onclick = () => {
		caches.open('userscript-etf2l-match-page')
			.then(async (cache) => {
				await (await cache.keys())
					.forEach(key => cache.delete(key))
				console.log('cache cleared')
			})
			.catch(console.trace)
	}
	fieldset.append(el)
	return fieldset
}

function toPlayerObj(i) {
	// https://etf2l.org/forum/user/12345
	const playerProfileRE = /forum\/user\/(\d+)/
	return {nick: i.textContent, etf2lID: playerProfileRE.exec(i.href)[1]}
}

async function getSteam64fromEl(playersEl) {
	if (!Script.isInited) {
		const t = await fetchPlayers()
		for (const apiPlayer of t) {
			const temp = playersEl.find(i => i.dataset.nick === apiPlayer.player.name)
			temp.dataset.id64 = apiPlayer.player.steam.id64
		}
		Script.isInited = true
	}

	const players = playersEl.filter(i => i.checked === true).map(i => i.dataset.id64)
	return players
}

function style(src) {
	const el = document.createElement('style')
	el.innerHTML = src
	return el
}

function li(src) {
	const el = document.createElement('li')
	el.innerHTML = src
	return el
}

function div(src) {
	const el = document.createElement('div')
	el.innerHTML = src
	return el
}

function createEl(tag, src) {
	const el = document.createElement(tag)
	el.innerHTML = src
	return el
}

async function fetchLogsApi(idArr, mapname) {
	if (!Array.isArray(idArr) && idArr.length < 2) Promise.reject('logs: player list')
	if (typeof mapname === 'string' && mapname.length < 1) Promise.reject('logs: map name')

	const url = `https://logs.tf/api/v1/log?player=${idArr.join(',')}&map=${mapname}`
	const res = cacheableFetch(url)
	if (typeof res === 'object' && res.success) {
		return res
	} else {
		const cache = await caches.open('userscript-etf2l-match-page')
		await cache.delete(url)
	}
	return res
}

async function fetchDemosApi(idArr, mapname) {
	if (!Array.isArray(idArr) && idArr.length < 2) Promise.reject('demos: player list')
	if (typeof mapname === 'string' && mapname.length < 1) Promise.reject('demos: map name')

	const url = `https://api.demos.tf/demos/?players=${idArr.join(',')}&map=${mapname}`
	const res = cacheableFetch(url)
	if (typeof res === 'object') {
		return res
	} else {
		const cache = await caches.open('userscript-etf2l-match-page')
		await cache.delete(url)
	}
	return res
}

async function fetchPlayers() {
	const apiResponses = await Promise.all(Script.allPlayers.map(i => fetchEtf2lApi(i.etf2lID)))
		.catch(err => console.error('err', err))
	return apiResponses;
}

async function fetchEtf2lApi(etf2lID) {
	const url = 'https://api.etf2l.org/player/' + etf2lID + '.json'
	const res = await cacheableFetch(url)

	if (res && res?.player?.steam?.id64?.length > 0) {
		return res
	} else {
		const cache = await caches.open('userscript-etf2l-match-page')
		await cache.delete(url)
	}
	return res
}

function cacheableFetch(url) {
	return new Promise(async (resolve, reject) => {
		const cache = await caches.open('userscript-etf2l-match-page')
		const match = await cache.match(url)
		if (match) {
			resolve(match.clone().json())
		}

		const res = await fetch(url)
		if (!res.ok) {
			reject(res)
		}
		await cache.put(url, res.clone())
		resolve(await res.clone().json())
	})
}