"use strict";

const { describe, test, mock } = require("node:test");
const assert = require("node:assert/strict");

// Mock dns module before requiring the module under test
mock.module("node:dns", {
  namedExports: {
    lookup: () => {
      throw new Error("Should not call dns.lookup");
    },
    promises: {
      /**
       * @param {string} hostname
       * @param {import('dns').LookupAllOptions} options
       * @returns {Promise<import('dns').LookupAddress[]>}
       */
      lookup(hostname, options) {
        assert.ok(options, "options should be defined");
        assert.ok([0, 4, 6].includes(options.family), "family should be 0, 4, or 6");
        assert.ok(options.all, "options.all should be truthy");

        assert.strictEqual(typeof hostname, "string");
        assert.ok(hostname.length >= 2);
        assert.match(hostname, /^\w+\.(local|empty|external|error)$/);

        const suffix = hostname.split(".", 2)[1];
        switch (suffix) {
          case "local":
            return Promise.resolve([
              { address: "164.2.23.4", family: 4 },
              { address: "::1", family: 6 },
            ]);

          case "empty":
            return Promise.resolve([]);

          case "external":
            return Promise.resolve([{ address: "1.1.1.1", family: 4 }]);

          case "error":
            return Promise.reject(new TypeError("DNS lookup error"));

          default:
            return Promise.reject(new Error("Unknown hostname suffix"));
        }
      },
    },
  },
});

const isLocalhost = require("../");

describe("mocked dns tests", () => {
  test("works with external domains", async () => {
    assert.strictEqual(await isLocalhost("test.external"), false);
  });

  test("works with local domains", async () => {
    assert.strictEqual(await isLocalhost("test.local"), true);
  });

  test("works with empty or error responses", async () => {
    assert.strictEqual(await isLocalhost("test.empty"), false);
    assert.strictEqual(await isLocalhost("test.error"), false);
  });
});
