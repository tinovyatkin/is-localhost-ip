'use strict';

jest.mock('dns');
const isLocalhost = require('../');

describe('mocked dns tests', () => {
  it('works with external domains', async () => {
    expect(await isLocalhost('test.external')).toBeFalsy();
  });

  it('works with local domains', async () => {
    expect(await isLocalhost('test.local')).toBeTruthy();
  });

  it('works with empty or error responses', async () => {
    expect(await isLocalhost('test.empty')).toBeFalsy();
    expect(await isLocalhost('test.error')).toBeFalsy();
  });

  it('works on dns throws', async () => {
    expect(await isLocalhost('our-mock-resolver-will-throw')).toBeFalsy();
  });
});
