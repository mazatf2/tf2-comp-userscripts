// ==UserScript==
// @name         Logs.tf & Demos.tf match entries linker.
// @version      0.1
// @description  Adds links to Demos.tf entries from Logs.tf. Links are added to Logs.tf match pages.
// @author       https://github.com/mazatf2/
// @match        http://logs.tf/*
// @match        https://logs.tf/*
// @connect      api.demos.tf
// @grant        GM.xmlHttpRequest
// @require      https://unpkg.com/timeago.js@4.0.2/dist/timeago.min.js
// ==/UserScript==

async function init () {
	const {host, pathname} = window.location

	// https://logs.tf/2520991
	const isPathnameID = /\/\d+/.test(pathname)
	if(!isPathnameID) return
	if (host !== 'logs.tf')  return

	const container = document.querySelector('#log-section-footer')

	parseLogsTF(container)
}

(function () {
	init()
})()

function fetchApi (url) {
	return new Promise((resolve, reject) => {

		try{
			let req = GM.xmlHttpRequest({
				method: 'GET',
				url: url,
				onload: res => onload(res),
				onerror: err => reject(err),
				ontimeout: err => reject(err),
			})

			function onload(res) {
				let json

				try {
					json = JSON.parse(res.responseText)
				} catch (e) {
					reject(e)
				}

				resolve(json)
			}
		} catch (e) {
			reject(e)
		}
	})
}

function parseLogsTF (container) {
	let el = div`
	<style>
		#userscript-demo-search * {
			all: revert;
		}
	</style>`
	
	el.id = 'userscript-demo-search'

	container.append(el)

	// profiles_steamid64
	const re = /player_(\d{17})/
	
	const $playerTable = [...document.querySelectorAll('#players tbody tr')]
	
	const $team1 = $playerTable
		.filter(i => i.querySelector('.blu'))
	const $team2 = $playerTable
		.filter(i => i.querySelector('.red'))
	
	const $allPlayers = [...$team1, ...$team2]
	
	// [id64, ...]
	const playerIds = $allPlayers
		.filter(element => re.test(element.id))
		.map(element => re.exec(element.id)?.[1])
	
	const playerNames = $allPlayers
		.map(i => i.querySelector('.log-player-name'))
		.map(element => element.innerText)
	
	const mapName = document.querySelector('#log-map')?.textContent
	
	if (playerIds.length < 2) el.innerHTML += 'userscript error: No players<br>'
	if (!mapName) el.innerHTML += 'userscript error: No map name<br>'
	
	if (/error/g.test(el.innerHTML)) return
	
	const $playerSelect = `
	<form>
	<fieldset>
		${playerNames.map((nick, index) => `
			<input id="${nick}" type="checkbox" checked data-nick="${nick}" data-id64="${playerIds[index]}" >
			<label for="${nick}">${nick}</label>
		`).join('')}
	</fieldset>
	</form>
	`
	el.innerHTML += $playerSelect
	
	const buttonEl = button`userscript: Search Demos.tf`
	buttonEl.addEventListener('click', () => {
		buttonEl.disabled = true
		renderApiResponse()
			.then(() => buttonEl.disabled = false)
	})
	
	container.append(buttonEl)
	
	async function renderApiResponse () {
		// [id64, ...]
		const selectedPlayers = [...el.querySelectorAll('input:checked')]
			.map(i => i.dataset.id64)
		
		if (selectedPlayers.length < 2) {
			el.append(log`userscript error: Not enough selected players<br>`)
			return
		}
		
		el.append(log`userscript is searching for demos<br>`)
		const url = `https://api.demos.tf/demos/?players=${selectedPlayers.join(',')}&map=${mapName}`
		console.log(url)
		
		const response = await fetchApi(url).catch(err => {
			console.error(err)
			el.append(log`userscript error: ${err}, ${JSON.stringify(err, null, '\t')}<br>`)
		})
		
		console.log('response', response)
		
		let demos = []
		if (response?.length > 0) {
			demos = response
		} else {
			el.append(log`userscript error: Demos.tf api error<br>`)
		}
		
		const content = document.createElement('div')
		content.innerHTML = `
            <br>
            <span>Demos:</span><br>
            <ol>
            ${demos.map(i => `
                <li>
                    <a href="https://demos.tf/${i.id}">
                        ${i.server}, ${i.map}, ${i.playerCount} players,
                        ${timeago.format(i.time * 1000)},
                        ${new Date(i.time * 1000).toLocaleString()}
                    </a>
                </li>`,
		).join('')
		}
            </ol>
        `
		
		el.append(content)
	}
}

function div(content) {
	const el = document.createElement('div')
	el.innerHTML = content
	return el
}

function button(content) {
	const el = document.createElement('button')
	el.innerHTML = content
	return el
}

function log(content) {
	const el = document.createElement('div')
	el.innerHTML = content
	return el
}