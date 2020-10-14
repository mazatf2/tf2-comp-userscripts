import Fuzzysort from 'fuzzysort'

type partialOpts = Partial<Fuzzysort.Options> | Partial<Fuzzysort.KeyOptions>

export const search = (searchFor: string, data: any, options: partialOpts = {}): Fuzzysort.Results => {
	const results = Fuzzysort.go(searchFor, data, options)
	return results
}

export const highlight = (result: Fuzzysort.Result) => {
	return Fuzzysort.highlight(result)
}

export const highlight2 = (result: Fuzzysort.Result) => {
	const indexes = result.indexes
	const temp = []
	
	for (let start = 0; start < indexes.length; start++) {
		
		const next = (curr: number) => {
			if (indexes[curr + 1] && indexes[curr + 1] - indexes[curr] === 1) {
				return next(curr + 1)
			} else {
				return curr
			}
		}
		
		const end = next(start)
		
		temp.push([indexes[start], indexes[end]])
		
		start = end
	}
	
	const words = temp.map(([start, end]) => result.target.substr(start, (end - start) + 1))
	return words
}

