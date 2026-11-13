export interface ApiParam {
	name: string;
	type: string;
	required: boolean;
	description: string;
}
export function filterParams(params: ApiParam[], query: string): ApiParam[] {
	return params.filter((param) =>
		param.name.toLowerCase().includes(query.trim().toLowerCase()),
	);
}
export function sortParams(
	params: ApiParam[],
	column: keyof ApiParam,
	direction: 'asc' | 'desc',
): ApiParam[] {
	return [...params].sort((a, b) =>
		a[column] === b[column]
			? 0
			: (a[column] > b[column] ? 1 : -1) * (direction === 'asc' ? 1 : -1),
	);
}
