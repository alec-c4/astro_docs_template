import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveEnv } from '../src/lib/environment.ts';
test('environment resolves URL values and safely falls back for invalid defaults and empty lists', () => {
	assert.equal(resolveEnv('stage', ['dev', 'stage'], 'dev'), 'stage');
	assert.equal(resolveEnv('unknown', ['dev', 'stage'], 'bad'), 'dev');
	assert.equal(resolveEnv(null, ['dev', 'stage'], 'stage'), 'stage');
	assert.equal(resolveEnv('', ['dev']), 'dev');
	assert.equal(resolveEnv(null, []), undefined);
});
