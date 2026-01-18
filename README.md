[![codecov](https://codecov.io/gh/tinovyatkin/is-localhost-ip/branch/master/graph/badge.svg)](https://codecov.io/gh/tinovyatkin/is-localhost-ip)
![node](https://img.shields.io/node/v/is-localhost-ip)

# is-localhost-ip

Zero-dependency Node.js utility that checks whether a hostname or IPv4/IPv6 address refers to the local machine.

This package aims to be strict and comprehensive:

- Validates input as an IP address or a syntactically valid hostname (including bracketed IPv6).
- Treats private/loopback/link-local ranges as local.
- Optionally verifies the address exists on the current machine by attempting to bind to it.
- Falls back to DNS resolution, so it works with hostnames mapped in `/etc/hosts` or a local resolver.

## Installation

```sh
npm i is-localhost-ip
# or
yarn add is-localhost-ip
# or
pnpm add is-localhost-ip
```

Requires Node.js `>=18`.

## Usage

```js
const isLocalhost = require("is-localhost-ip");

(async () => {
  await isLocalhost("127.0.0.1"); // true
  await isLocalhost("::ffff:127.0.0.1"); // true
  await isLocalhost("192.168.0.12"); // true
  await isLocalhost("192.168.0.12", true); // true only if an interface has this address
  await isLocalhost("184.55.123.2"); // false

  await isLocalhost("tino.local"); // true if it resolves to a local address
  await isLocalhost("localhost"); // true
  await isLocalhost("microsoft.com"); // false
})();
```

## API

### `isLocalhost(ipOrHostname, canBind?)`

Returns a `Promise<boolean>`.

- `ipOrHostname` (`string`): IP address (v4/v6) or a hostname.
- `canBind` (`boolean`, default `false`): when `true`, additionally checks that the local machine can bind to the
  address (i.e., it is configured on a local interface).

The function throws for invalid inputs (non-string values or syntactically invalid hostnames).

## Caveats

Internationalized domain names (IDNs) are not supported. If you need IDNs, use
[Punycode.js](https://github.com/bestiejs/punycode.js) (or another punycode implementation) to convert the input
to ASCII before calling this function:

```js
const isLocalhost = require("is-localhost-ip");
const punycode = require("punycode");

(async () => {
  await isLocalhost(punycode.toASCII("свобода.рф")); // false
  await isLocalhost(punycode.toASCII("私の.家")); // true
})();
```

## License

`is-localhost-ip` is available under the [MIT](https://mths.be/mit) license.
