// @ts-nocheck
'use strict';

const { VALID_HOSTNAME } = require('../index');

describe('hostnames validation via RegExp', () => {
  test.each(
    [
      'localhost',
      'i',
      '_.example.com',
      '_http._sctp.www.example.com',
      'domain.com',
      'dom.plato',
      'a.domain.co',
      'foo--bar.com',
      'xn--froschgrn-x9a.com',
      'rebecca.blackfriday',
      // 3 segments of 63 characters
      Array.from({ length: 3 }, () =>
        Array.from({ length: 63 }, () =>
          String.fromCodePoint(65 + Math.floor(25 * Math.random())),
        ).join(''),
      ).join('.'),
      // 63 characters + a trailing dot
      Array.from({ length: 63 }, () =>
        String.fromCodePoint(65 + Math.floor(25 * Math.random())),
      ).join('') + '.',
    ].map((v) => [v]),
  )('%s should be valid', (i) => expect(i).toMatch(VALID_HOSTNAME));

  test.each(
    [
      '*.some.com',
      '.some.com',
      'a.some..com',
      'букин.рф',
      's!ome.com',
      'domain.com/',
      ' domain.com',
      '/more.com',
      // valid characters but too long for segment
      Array.from({ length: 254 }, () =>
        String.fromCodePoint(65 + Math.floor(25 * Math.random())),
      ).join(''),
      // 2 segments of 64 characters
      Array.from({ length: 2 }, () =>
        Array.from({ length: 64 }, () =>
          String.fromCodePoint(65 + Math.floor(25 * Math.random())),
        ).join(''),
      ).join('.'),
      // 4 segments of 63 characters
      Array.from({ length: 4 }, () =>
        Array.from({ length: 63 }, () =>
          String.fromCodePoint(65 + Math.floor(25 * Math.random())),
        ).join(''),
      ).join('.'),
    ].map((v) => [v]),
  )('%s should be invalid', (i) => expect(i).not.toMatch(VALID_HOSTNAME));
});
