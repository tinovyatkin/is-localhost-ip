// @ts-nocheck
'use strict';

const isLocal = require('../index');

describe('IP addresses', () => {
  // throw on process warnings

  it('edge case - 0', async () => await expect(isLocal(0)).rejects.toThrow());
  it('edge case - NaN', async () =>
    await expect(isLocal(NaN)).rejects.toThrow());
  it('works for ::', async () => expect(await isLocal('::1')).toBeTruthy());
  it('works for ::1', async () => expect(await isLocal('::1')).toBeTruthy());
  it('works for fe80::1', async () =>
    expect(await isLocal('fe80::1')).toBeTruthy());

  it('works for 1.1.1.1 by cloudflare', async () =>
    expect(await isLocal('1.1.1.1')).toBeFalsy());

  it('works for all 127.x.0.1', async () => {
    for (let i = 0; i <= 255; ++i) {
      expect(await isLocal(`127.${i}.0.1`)).toBeTruthy();
    }
  });

  test('fe80::/10', async () => {
    expect(await isLocal('fe79::1')).toBeFalsy();
    expect(await isLocal('fe80::1')).toBeTruthy();
    expect(await isLocal('febf::1')).toBeTruthy();
    expect(
      await isLocal('fe80:0000:0000:0000:0000:0000:0000:0000'),
    ).toBeTruthy();
    // expect(await isLocal('ff00::1')).toBeFalsy();
  });

  test('10.x.x.x', async () => {
    expect(await isLocal('9.255.255.255')).toBeFalsy();
    expect(await isLocal('10.0.0.0')).toBeTruthy();
    expect(await isLocal('10.255.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:10.255.255.255')).toBeTruthy();
    expect(await isLocal('11.0.0.0')).toBeFalsy();
  });

  test('10.x.x.x', async () => {
    expect(await isLocal('9.255.255.255')).toBeFalsy();
    expect(await isLocal('10.0.0.0')).toBeTruthy();
    expect(await isLocal('10.255.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:10.255.255.255')).toBeTruthy();
    expect(await isLocal('11.0.0.0')).toBeFalsy();
  });

  test('127.x.x.x', async () => {
    expect(await isLocal('126.255.255.255')).toBeFalsy();
    expect(await isLocal('127.0.0.0')).toBeTruthy();
    expect(await isLocal('127.255.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:127.255.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:7f00:1', false)).toBeTruthy();
    expect(await isLocal('::ffff:7f00:1', true)).toBeTruthy();
    expect(await isLocal('[::ffff:7f00:1]')).toBeTruthy();
    expect(await isLocal('128.0.0.0')).toBeFalsy();
  });

  test('192.168.x.x', async () => {
    expect(await isLocal('192.167.255.255')).toBeFalsy();
    expect(await isLocal('192.168.0.0')).toBeTruthy();
    expect(await isLocal('192.168.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:192.168.255.255')).toBeTruthy();
    expect(await isLocal('192.169.0.0')).toBeFalsy();
  });

  test('172.(16-31).x.x', async () => {
    expect(await isLocal('172.15.255.255')).toBeFalsy();
    expect(await isLocal('172.16.0.0')).toBeTruthy();
    expect(await isLocal('172.31.255.255')).toBeTruthy();
    expect(await isLocal('::ffff:172.31.255.255')).toBeTruthy();
    expect(await isLocal('172.32.0.0')).toBeFalsy();
  });

  test('169.254.(1-254).x', async () => {
    expect(await isLocal('169.254.0.0')).toBeFalsy();
    expect(await isLocal('169.254.1.0')).toBeTruthy();
    expect(await isLocal('169.254.254.255')).toBeTruthy();
    expect(await isLocal('169.254.169.254')).toBeTruthy();
    expect(await isLocal('::ffff:169.254.254.255')).toBeTruthy();
    expect(await isLocal('::ffff:a9fe:a9fe')).toBeTruthy();
    expect(await isLocal('0:0:0:0:0:ffff:a9fe:a9fe')).toBeTruthy();
    expect(
      await isLocal('0000:0000:0000:0000:0000:ffff:a9fe:a9fe'),
    ).toBeTruthy();
    expect(await isLocal('169.254.255.0')).toBeFalsy();
  });

  test('fc00::/7', async () => {
    expect(await isLocal('fb00::1')).toBeFalsy();
    expect(await isLocal('fc00::1')).toBeTruthy();
    expect(await isLocal('fdff::1')).toBeTruthy();
    expect(await isLocal('fdaa::')).toBeTruthy();
    expect(
      await isLocal('fdaa:0000:0000:0000:0000:0000:0000:0000'),
    ).toBeTruthy();
    expect(await isLocal('fe00::1')).toBeFalsy();
  });
});
