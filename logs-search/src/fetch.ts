import Queue from 'smart-request-balancer'
import {logstfJson, searchLogListOpts} from './logstf_api'

const queue = new Queue({
	rules: {
		common: {
			rate: 5,
			limit: 1,
			priority: 1,
		},
	},
	retryTime: 300,
})

export const CacheableFetch = async (request: Request) => {
	
	const cache = await caches.open('cacheable-fetch')
	
	const cachedResult = await cache.match(request)
	if (cachedResult) {
		console.log('cached', cachedResult)
		return cachedResult
	}
	
	const _get = async () => {
		await cache.add(request) // returns undefined if successfully added
		return await cache.match(request)
	}
	
	const get = () => {
		return new Promise((resolve, reject) => {
			queue.request(() => _get())
				.then(i => resolve(i))
				.catch(err => {
					console.log('queue.request', err)
					debugger
					
					reject(err)
				})
		})
	}
	const result = await get()
	return result
}

export const fetchLogList = async ({
									title = '',
									map = '',
									uploader = '',
									player = [],
									limit = 1000,
									offset = 0,
								}: Partial<searchLogListOpts>) => {
	
	// http://logs.tf/api/v1/log?title=X&uploader=Y&player=Z&limit=N&offset=N
	const url = `https://logs.tf/api/v1/log?player=${player.join(',')}`
	const req = new Request(url)
	
	return await CacheableFetch(req)
}

export const fetchLogData = async (id: number) => {
	const url = `http://logs.tf/api/v1/log/${id}`
	const req = new Request(url)
	const data = await CacheableFetch(req)
	return data.json() as logstfJson
}