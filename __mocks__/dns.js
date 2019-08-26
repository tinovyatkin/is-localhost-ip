// https://jestjs.io/docs/en/manual-mocks

const dns = jest.genMockFromModule('dns');

/**
 *
 * @param {string} hostname
 * @param {(err: Error | undefined, res: import('dns').LookupAddress[]) => void} callback
 */
function lookup(hostname, callback) {
  expect(typeof hostname).toBe('string');
  expect(hostname.length).toBeGreaterThanOrEqual(2);
  expect(hostname).toMatch(/^\w+\.(local|empty|external|error)$/); // it resolves only particular suffixes
  switch (hostname.split('.', 2)[1]) {
    case 'local':
      callback(undefined, [
        { address: '164.2.23.4', family: 4 },
        { address: '::1', family: 6 },
      ]);
      break;

    case 'empty':
      callback(undefined, []);
      break;

    case 'external':
      callback(undefined, [{ address: '1.1.1.1', family: 4 }]);
      break;

    case 'error':
      callback(new TypeError(`DNS lookup error`), []);
      break;
  }
}

if (
  process.versions.node
    .split('.', 2)
    .map(n => n.padStart(2, '0'))
    .join('.') >= '11.14'
) {
  dns.lookup = () => {
    throw new Error(`Should not call dns.lookup on Node >= 11.14`);
  };
  dns.promises = {
    /**
     * @param {string} hostname
     * @param {import('dns').LookupAllOptions} options
     * @returns {Promise<import('dns').LookupAddress[]>}
     */
    lookup(hostname, options) {
      expect(options).toBeDefined();
      expect([0, 4, 6]).toContain(options.family);
      expect(options.all).toBeTruthy();
      return new Promise((resolve, reject) => {
        lookup(hostname, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    },
  };
} else {
  dns.promises = {
    get lookup() {
      throw new Error(`Should not even touch dns.promises on Node < 11.14`);
    },
  };
  dns.lookup =
    /**
     * @param {string} hostname
     * @param {import('dns').LookupAllOptions} options
     * @param {(err: Error | undefined, res: import('dns').LookupAddress[]) => void} callback
     */
    (hostname, options, callback) => {
      expect(options).toBeDefined();
      expect([0, 4, 6]).toContain(options.family);
      expect(options.all).toBeTruthy();
      expect(typeof callback).toBe('function');
      lookup(hostname, callback);
    };
}

module.exports = dns;
