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
	const buttonEl = button`userscript: Search Demos.tf`

	buttonEl.addEventListener('click', ()=>{
		buttonEl.disabled = true
		parseLogsTF(container)
	})

	container.append(buttonEl)
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

async function parseLogsTF (container) {
	let el = div``
	container.append(el)

	// profiles_steamid64
	const re = /player_(\d{17})/

	const players = [...document.querySelectorAll('#players tbody tr')]
		.filter(element => re.test(element.id))
		.map(element => re.exec(element.id)?.[1])

	const mapName = document.querySelector('#log-map')?.textContent

	if(players.length < 2) el.innerHTML += 'userscript error: No players<br>'
	if(!mapName) el.innerHTML += 'userscript error: No map name<br>'

	if(/error/g.test(el.innerHTML)) return

	el.innerHTML += 'userscript is searching for demos<br>'
	const url = `https://api.demos.tf/demos/?players=${players.join(',')}&map=${mapName}`
	console.log(url)

	const response = await fetchApi(url).catch(err => {
		console.error(err)
		el.innerHTML += `userscript error: ${err}, ${JSON.stringify(err, null, '\t')}<br>`
	})

	console.log('response', response)

	let demos = []
	if(response?.length > 0) {
		demos = response
	} else {
		el.innerHTML += 'userscript error: Demos.tf api error<br>'
	}

	const content = `
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
			</li>`
			).join('')
		}
		</ol>
	`

	el.innerHTML += content
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