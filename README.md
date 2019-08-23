# is-localhost-ip

Comprehensively checks whether given DNS name or IPv4/IPv6 address belongs to local machine

Main difference from other libraries here is comprehensiveness: we start from simple RegExp checks, then fallbacks DNS resolver (so it works with something like `john.dev` remapped locally).

Requires Node 12+, 100% code coverage

## Installation

```sh
npm i is-localhost-ip
yarn add is-localhost-ip
```

## Example

```js
const isLocalhost = require('is-localhost-ip');

(async () => {

    await isLocalhost("127.0.0.1"); // true
    await isLocalhost("::ffff:127.0.0.1"); // true
    await isLocalhost("192.168.0.12"); // true
    await isLocalhost("184.55.123.2"); // false

    await isLocalhost("tino.local"); // true
    await isLocalhost("localhost"); // true
    await isLocalhost("microsoft.com"); // false

})();

```
