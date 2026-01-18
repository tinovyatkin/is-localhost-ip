"use strict";

const { describe, test, mock } = require("node:test");
const assert = require("node:assert/strict");

mock.module("node:dgram", {
  namedExports: {
    /**
     * Minimal dgram socket mock to exercise canBindToIp edge cases deterministically.
     * @param {"udp4"|"udp6"} type
     */
    createSocket(type) {
      assert.ok(type === "udp4" || type === "udp6");

      /** @type {Record<string, Function | undefined>} */
      const listeners = {};

      /** @type {any} */
      const socket = {
        once(eventName, listener) {
          listeners[eventName] = listener;
          return socket;
        },
        unref() {
          return socket;
        },
        bind(port, address) {
          assert.strictEqual(port, 0);
          assert.strictEqual(typeof address, "string");

          if (address === "0.0.0.0") {
            listeners.listening?.();
            return;
          }

          if (address === "127.0.0.1") {
            throw new Error("bind failure");
          }

          listeners.error?.(new Error("EADDRNOTAVAIL"));
        },
        close(callback) {
          if (callback) callback();
        },
      };

      return socket;
    },
  },
});

mock.module("node:dns", {
  namedExports: {
    promises: {
      /**
       * @param {string} hostname
       * @param {import("dns").LookupAllOptions} options
       * @returns {Promise<import("dns").LookupAddress[] | unknown>}
       */
      lookup(hostname, options) {
        assert.ok(options?.all, "options.all should be truthy");

        if (hostname === "test.nonarray") {
          return Promise.resolve({ address: "127.0.0.1", family: 4 });
        }

        return Promise.resolve([]);
      },
    },
  },
});

const isLocalhost = require("../");

describe("coverage edge cases", () => {
  test("returns false if socket.bind throws synchronously", async () => {
    assert.strictEqual(await isLocalhost("127.0.0.1", true), false);
  });

  test("returns true if socket can bind to 0.0.0.0", async () => {
    assert.strictEqual(await isLocalhost("0.0.0.0"), true);
  });

  test("throws if dns lookup returns a non-array result", async () => {
    await assert.rejects(() => isLocalhost("test.nonarray"), {
      name: "TypeError",
      message: "DNS Lookup failed.",
    });
  });
});
