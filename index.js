'use strict';

const { isIP } = require('net');
const { networkInterfaces } = require('os');

/*
  DNS.promises were experimental until Node 11.4 and we don't want experimental warning
  https://nodejs.org/en/blog/release/v11.14.0/
*/
const lookup =
  process.versions.node
    .split('.', 2)
    .map(n => n.padStart(2, '0'))
    .join('.') >= '11.14'
    ? // eslint-disable-next-line node/no-unsupported-features/node-builtins
      require('dns').promises.lookup
    : require('util').promisify(require('dns').lookup);

const LOCAL_INTERFACES = networkInterfaces();
const INTERFACES_ADDRESSES = /** @type {Set<string>} */ (new Set([
  '::',
  '::1',
]));

/*
 We will check if every network interface has an IPv4 or IPv6 address
 to try to avoid lookup both families
*/
let haveIPv4 = 0;
let haveIPv6 = 0;
for (const interfaceInfo of Object.values(LOCAL_INTERFACES)) {
  let v4 = false;
  let v6 = false;
  for (const { address, family } of interfaceInfo) {
    INTERFACES_ADDRESSES.add(address);
    if (family === 'IPv4') v4 = true;
    else v6 = true;
  }
  if (v4) haveIPv4++;
  if (v6) haveIPv6++;
}

const totalInterfaces = Object.keys(LOCAL_INTERFACES).length;
const LOOKUP_OPTIONS = /** @type {import('dns').LookupAllOptions} */ ({
  all: true,
  family:
    totalInterfaces === haveIPv4 ? 4 : totalInterfaces === haveIPv6 ? 6 : 0,
});

/**
 * Addresses reserved for private networks
 * @see {@link https://en.wikipedia.org/wiki/Private_network}
 */
const IP_RANGES = [
  // 10.0.0.0 - 10.255.255.255
  /^(:{2}f{4}:)?10(?:\.\d{1,3}){3}$/,
  // 127.0.0.0 - 127.255.255.255
  /^(:{2}f{4}:)?127(?:\.\d{1,3}){3}$/,
  // 169.254.1.0 - 169.254.254.255
  /^(::f{4}:)?169\.254\.([1-9]|1?\d\d|2[0-4]\d|25[0-4])\.\d{1,3}$/,
  // 172.16.0.0 - 172.31.255.255
  /^(:{2}f{4}:)?(172\.1[6-9]|172\.2\d|172\.3[01])(?:\.\d{1,3}){2}$/,
  // 192.168.0.0 - 192.168.255.255
  /^(:{2}f{4}:)?192\.168(?:\.\d{1,3}){2}$/,
  // fc00::/7
  /^f[cd][\da-f]{2}(::1$|:[\da-f]{1,4}){1,7}$/,
  // fe80::/10
  /^fe[89ab][\da-f](::1$|:[\da-f]{1,4}){1,7}$/,
];

// Concat all RegExes from above into one
const IP_TESTER_RE = new RegExp(
  `^(${IP_RANGES.map(re => re.source).join('|')})$`,
);

/**
 * Syntax validation RegExp for possible valid host names. Permits underscore.
 * Maximum total length 253 symbols, maximum segment length 63 symbols
 * @see {@link https://en.wikipedia.org/wiki/Hostname}
 */
const VALID_HOSTNAME = /(?![\w-]{64,})((^(?=[\w-.]{1,253}\.?$)((\w{1,63}|(\w[\w-]{0,61}\w))\.?)+$)(?<!\.{2,}))/i;

/**
 * Checks if given strings is a local IP address or a DNS name that resolve into a local IP
 *
 * @param {string} ip
 * @returns {Promise.<boolean>} - true, if given strings is a local IP address or DNS names that resolves to local IP
 */
async function isLocalhost(ip) {
  if (typeof ip !== 'string') return false;

  // Check if given string is an IP address
  if (isIP(ip)) return INTERFACES_ADDRESSES.has(ip) || IP_TESTER_RE.test(ip);

  // May it be a hostname?
  if (!VALID_HOSTNAME.test(ip)) return false;

  // it's a DNS name
  try {
    const addresses = await lookup(ip, LOOKUP_OPTIONS);
    return (
      Array.isArray(addresses) &&
      addresses.some(
        ({ address }) =>
          INTERFACES_ADDRESSES.has(address) || IP_TESTER_RE.test(address),
      )
    );
  } catch (_) {
    return false;
  }
}

module.exports = isLocalhost;
module.exports.VALID_HOSTNAME = VALID_HOSTNAME; // for tests
