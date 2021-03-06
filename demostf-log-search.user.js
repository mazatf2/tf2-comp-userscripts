// ==UserScript==
// @name         Demos.tf & Logs.tf match entries linker.
// @version      0.1
// @description  Adds links to Logs.tf entries from Demos.tf. Links are added to Demos.tf match pages.
// @author       https://github.com/mazatf2/
// @match        https://demos.tf/*
// @connect      logs.tf
// @grant        GM.xmlHttpRequest
// @require      https://unpkg.com/timeago.js@4.0.2/dist/timeago.min.js
// ==/UserScript==

async function init () {
	const {host, pathname} = window.location

	// https://demos.tf/384366
	const isPathnameID = /\/\d+/.test(pathname)
	if(!isPathnameID) return
	if(host !== 'demos.tf') return

	await readyChek()

	const container = document.querySelector('footer')
	const buttonEl = button`userscript: Search Logs.tf`

	buttonEl.addEventListener('click', ()=>{
		buttonEl.disabled = true
		parseDemosTF(container)
	})

	container.before(buttonEl)
}

function readyChek () {
	return new Promise((resolve) => {

		const id = setInterval(() => {
			const isDemosTFReady = document.querySelectorAll('.players a').length >= 2

			if (isDemosTFReady) {
				clearInterval(id)
				resolve(true)
			}

		}, 500)
	})
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

async function parseDemosTF (container) {
	let el = div``
	container.before(el)

	// profiles/steamid64
	const re = /profiles\/(\d{17})/

	const players = [...document.querySelectorAll('.players a')]
		.filter(i => re.test(i.href))
		.map(element => re.exec(element.href)?.[1])

	const mapName = [...document.querySelectorAll('.demo-info span')]
		.filter(element => element.className !== 'time')
		?.[0]?.textContent

	if(players.length < 2) el.innerHTML += 'userscript error: No players found<br>'
	if(!mapName) el.innerHTML += 'userscript error: No map name found<br>'

	if(/error/.test(el.innerHTML)) return

	el.innerHTML += 'userscript is searching for logs<br>'
	const url = `https://logs.tf/api/v1/log?player=${players.join(',')}&map=${mapName}`
	console.log(url)

	const response = await fetchApi(url).catch(err => {
		console.error(err)
		el.innerHTML += `userscript error: ${err}, ${JSON.stringify(err, null, '\t')}<br>`
	})

	console.log('response', response)

	let logs = []
	if(response?.logs){
		logs = response.logs
	} else {
		el.innerHTML += 'userscript error: Logs.tf api error<br>'
	}

	const content = `
		<span>logs:</span><br>
		<ol>
		${logs.map(i => `
			<li>
				<a href="https://logs.tf/${i.id}">
					${i.title}, ${i.map}, ${i.players} players,
					${timeago.format(i.date * 1000)},
					${new Date(i.date * 1000).toLocaleString()}
				</a>
			</li>`
			).join('')
		}
		</ol>
		${response?.error ? 'userscript error: ' + response.error : ''}
		<br>
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