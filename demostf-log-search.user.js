// ==UserScript==
// @name         logs.tf & demos.tf linker thingy
// @version      0.1
// @description  adds links logs.tf logs to demo.tf demos
// @author       https://github.com/mazatf2/
// @match        http://logs.tf/*
// @match        https://logs.tf/*
// @match        https://demos.tf/*
// @connect      api.demos.tf
// @connect      logs.tf
// @grant        GM.xmlHttpRequest
// ==/UserScript==

let isPatched = false

async function init () {
	const {host, pathname} = window.location

	// detect demos.tf navigation events
	if(host === 'demos.tf' && !isPatched){
		isPatched = true
		applyPatch()
		window.addEventListener('locationchange', ()=>{
			init()
		})
	}

	// https://demos.tf/384366
	// https://logs.tf/2520991
	const isPathnameID = /\/\d+/.test(pathname)
	if(!isPathnameID) return

	await readyChek()

	if (host === 'logs.tf') parseLogsTF()
	if (host === 'demos.tf') parseDemosTF()

}

function readyChek () {
	return new Promise((resolve) => {

		const id = setInterval(() => {

			const isDemosTFReady = document.querySelectorAll('.players a').length >= 2
			const isLogsTFReady = document.querySelectorAll('#players tbody tr').length >= 2

			if (isDemosTFReady || isLogsTFReady) {
				clearInterval(id)
				resolve(true)
			}

		}, 500)
	})
}


(function(){
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

async function parseLogsTF () {
	let error = null

	const container = document.querySelector('#log-section-footer')
	let el = div`userscript is searching for demos`
	container.append(el)

	// profiles_steamid64
	const re = /player_(\d{17})/

	const players = [...document.querySelectorAll('#players tbody tr')]
		.filter(element => re.test(element.id))
		.map(element => re.exec(element.id)?.[1])

	const mapName = document.querySelector('#log-map')?.textContent

	if(!players) el.innerHTML = 'userscript error: no players'
	if(!mapName) el.innerHTML = 'userscript error: no map name'

	if(/error/.test(el.innerHTML)) return

	const url = `https://api.demos.tf/demos/?players=${players.join(',')}&map=${mapName}`
	console.log(url)

	const response = await fetchApi(url).catch(err => {
		console.error(err)
		error = err
	})

	console.log('response', response)

	let demos = []
	if(response?.length > 0) {
		demos = response
	} else {
		// possible error or no demos
		// error = 'demos.tf api error'
	}

	const content = `
		<br>
		<span>demos:</span><br>
		<ol>
		${demos.map(i => `
			<li>
				<a href="https://demos.tf/${i.id}">
					${i.server}, ${i.map}, ${i.playerCount} players,
					${timeSince(i.time * 1000)} ago,
					${new Date(i.time * 1000).toLocaleString()}
				</a>
			</li>`
			).join('')
		}
		</ol>
		${error ? 'userscript error: ' + error : ''}
	`

	el.innerHTML = content
}

async function parseDemosTF () {
	let error = null

	const container = document.querySelector('footer')
	let el = div`userscript is searching for logs`
	container.before(el)

	// profiles/steamid64
	const re = /profiles\/(\d{17})/

	const players = [...document.querySelectorAll('.players a')]
		.filter(i => re.test(i.href))
		.map(element => re.exec(element.href)?.[1])

	const mapName = [...document.querySelectorAll('.demo-info span')]
		.filter(element => element.className !== 'time')
		?.[0]?.textContent

	if(!players) el.innerHTML = 'userscript error: no players'
	if(!mapName) el.innerHTML = 'userscript error: no map name'

	if(/error/.test(el.innerHTML)) return

	const url = `https://logs.tf/api/v1/log?player=${players.join(',')}&map=${mapName}`
	console.log(url)

	const response = await fetchApi(url).catch(err => {
		console.error('a', err)
		error = err
	})

	console.log('response', response)

	let logs = []
	if(response?.logs){
		logs = response.logs
	} else {
		error = 'logs.tf api error'
	}

	const content = `
		<span>logs:</span><br>
		<ol>
		${logs.map(i => `
			<li>
				<a href="https://logs.tf/${i.id}">
					${i.title}, ${i.map}, ${i.players} players,
					${timeSince(i.date * 1000)} ago,
					${new Date(i.date * 1000).toLocaleString()}
				</a>
			</li>`
			).join('')
		}
		</ol>
		${response?.error ? 'userscript error: ' + response.error : ''}
		<br>
		${error ? 'userscript error: ' + error : ''}
	`

	el.innerHTML = content
}

function div(content) {
	const el = document.createElement('div')
	el.innerHTML = content
	return el
}

function timeSince(date) {
	// https://stackoverflow.com/a/23259289

	if (typeof date !== 'object') {
		date = new Date(date);
	}

	var seconds = Math.floor((new Date() - date) / 1000);
	var intervalType;

	var interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		intervalType = 'year';
	} else {
		interval = Math.floor(seconds / 2592000);
		if (interval >= 1) {
			intervalType = 'month';
		} else {
			interval = Math.floor(seconds / 86400);
			if (interval >= 1) {
				intervalType = 'day';
			} else {
				interval = Math.floor(seconds / 3600);
				if (interval >= 1) {
					intervalType = "hour";
				} else {
					interval = Math.floor(seconds / 60);
					if (interval >= 1) {
						intervalType = "minute";
					} else {
						interval = seconds;
						intervalType = "second";
					}
				}
			}
		}
	}

	if (interval > 1 || interval === 0) {
		intervalType += 's';
	}

	return interval + ' ' + intervalType;
}

function applyPatch(){
	//https://stackoverflow.com/a/52809105

	history.pushState = ( f => function pushState(){
		var ret = f.apply(this, arguments)
		window.dispatchEvent(new Event('pushstate'))
		window.dispatchEvent(new Event('locationchange'))
		return ret
	})(history.pushState)

	history.replaceState = ( f => function replaceState(){
		var ret = f.apply(this, arguments);
		window.dispatchEvent(new Event('replacestate'))
		window.dispatchEvent(new Event('locationchange'))
		return ret
	})(history.replaceState)

	window.addEventListener('popstate',()=>{
		window.dispatchEvent(new Event('locationchange'))
	})
}