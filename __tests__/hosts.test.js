"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const isLocal = require("../index");

// We work with DNS resolver and it can be slow on CI
describe("Host names", { timeout: 20000 }, () => {
  test("works with `localhost`", async () => assert.strictEqual(await isLocal("localhost"), true));

  test("works with `google.com`", async () =>
    assert.strictEqual(await isLocal("google.com"), false));

  test("works with some syntactically correct, but non-existent names", async () =>
    assert.strictEqual(await isLocal("definitely123.not.a.good.domain.name"), false));

  test("works with some syntactically incorrect names", async () =>
    assert.strictEqual(await isLocal("_a.not..domain.name"), false));
});
