import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterParams, sortParams } from '../src/lib/table.ts';

test('table filters names without case or surrounding whitespace and preserves input', () => {
	const rows = [
		{ name: 'apiKey', type: 'string', required: true, description: '' },
		{ name: 'limit', type: 'number', required: false, description: '' },
	];
	assert.deepEqual(filterParams(rows, ' KEY '), [rows[0]]);
	assert.deepEqual(filterParams(rows, ''), rows);
	assert.deepEqual(filterParams(rows, 'missing'), []);
	assert.deepEqual(sortParams(rows, 'required', 'asc'), [rows[1], rows[0]]);
	assert.deepEqual(sortParams(rows, 'name', 'desc'), [rows[1], rows[0]]);
	assert.deepEqual(sortParams([], 'name', 'asc'), []);
	assert.equal(rows[0].name, 'apiKey');
});
