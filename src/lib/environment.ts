export function resolveEnv(
	value: string | null,
	envs: string[],
	fallback?: string,
): string | undefined {
	if (value && envs.includes(value)) return value;
	return fallback && envs.includes(fallback) ? fallback : envs[0];
}
