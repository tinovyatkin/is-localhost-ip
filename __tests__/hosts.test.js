'use strict';

const isLocal = require('../index');

describe('Host names', () => {
  // we work with DNS resolver and it can be slow on CI
  beforeAll(() => jest.setTimeout(20000));

  it('works with `localhost`', async () =>
    expect(await isLocal('localhost')).toBeTruthy());

  it('work with some bad names', async () =>
    expect(await isLocal('definitely123.not.a.good.domain.name')).toBeFalsy());
});
