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
    await expect(isLocalhost('test.error')).rejects.toThrowError();
  });

  it('works on dns throws', async () => {
    await expect(
      isLocalhost('our-mock-resolver-will-throw'),
    ).rejects.toThrowError();
  });
});
