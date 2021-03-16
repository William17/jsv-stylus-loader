/**
 * @jest-environment node
 */
 import compiler from './compiler.js';
import exampleResult from './example'

test('loader', async () => {
  const stats = await compiler('example.jsv.styl');
  const output = stats.toJson({ source: true }).modules[0].source;
  expect(output).toEqual(exampleResult);
});