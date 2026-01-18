// @ts-nocheck
"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const isLocal = require("../index");

describe("IP addresses", () => {
  test("edge case - 0", async () => assert.strictEqual(await isLocal(0), false));
  test("edge case - NaN", async () => assert.strictEqual(await isLocal(NaN), false));
  test("works for ::", async () => assert.strictEqual(await isLocal("::"), true));
  test("works for ::1", async () => assert.strictEqual(await isLocal("::1"), true));
  test("works for fe80::1", async () => assert.strictEqual(await isLocal("fe80::1"), true));

  test("works for 1.1.1.1 by cloudflare", async () =>
    assert.strictEqual(await isLocal("1.1.1.1"), false));

  test("works for all 127.x.0.1", async () => {
    for (let i = 0; i <= 255; ++i) {
      assert.strictEqual(await isLocal(`127.${i}.0.1`), true);
    }
  });

  test("fe80::/10", async () => {
    assert.strictEqual(await isLocal("fe79::1"), false);
    assert.strictEqual(await isLocal("fe80::1"), true);
    assert.strictEqual(await isLocal("febf::1"), true);
    assert.strictEqual(await isLocal("fe80:0000:0000:0000:0000:0000:0000:0000"), true);
  });

  test("10.x.x.x", async () => {
    assert.strictEqual(await isLocal("9.255.255.255"), false);
    assert.strictEqual(await isLocal("10.0.0.0"), true);
    assert.strictEqual(await isLocal("10.255.255.255"), true);
    assert.strictEqual(await isLocal("::ffff:10.255.255.255"), true);
    assert.strictEqual(await isLocal("11.0.0.0"), false);
  });

  test("127.x.x.x", async () => {
    assert.strictEqual(await isLocal("126.255.255.255"), false);
    assert.strictEqual(await isLocal("127.0.0.0"), true);
    assert.strictEqual(await isLocal("127.255.255.255"), true);
    assert.strictEqual(await isLocal("::ffff:127.255.255.255"), true);
    assert.strictEqual(await isLocal("128.0.0.0"), false);
  });

  test("192.168.x.x", async () => {
    assert.strictEqual(await isLocal("192.167.255.255"), false);
    assert.strictEqual(await isLocal("192.168.0.0"), true);
    assert.strictEqual(await isLocal("192.168.255.255"), true);
    assert.strictEqual(await isLocal("::ffff:192.168.255.255"), true);
    assert.strictEqual(await isLocal("192.169.0.0"), false);
  });

  test("172.(16-31).x.x", async () => {
    assert.strictEqual(await isLocal("172.15.255.255"), false);
    assert.strictEqual(await isLocal("172.16.0.0"), true);
    assert.strictEqual(await isLocal("172.31.255.255"), true);
    assert.strictEqual(await isLocal("::ffff:172.31.255.255"), true);
    assert.strictEqual(await isLocal("172.32.0.0"), false);
  });

  test("169.254.(1-254).x", async () => {
    assert.strictEqual(await isLocal("169.254.0.0"), false);
    assert.strictEqual(await isLocal("169.254.1.0"), true);
    assert.strictEqual(await isLocal("169.254.254.255"), true);
    assert.strictEqual(await isLocal("::ffff:169.254.254.255"), true);
    assert.strictEqual(await isLocal("169.254.255.0"), false);
  });

  test("fc00::/7", async () => {
    assert.strictEqual(await isLocal("fb00::1"), false);
    assert.strictEqual(await isLocal("fc00::1"), true);
    assert.strictEqual(await isLocal("fdff::1"), true);
    assert.strictEqual(await isLocal("fdaa:0000:0000:0000:0000:0000:0000:0000"), true);
    assert.strictEqual(await isLocal("fe00::1"), false);
  });
});
