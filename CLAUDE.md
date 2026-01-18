# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`is-localhost-ip` is a zero-dependency Node.js library (~100 lines) that checks whether a given hostname or IPv4/IPv6 address belongs to the local machine. It uses regex-based IP range matching followed by DNS resolution fallback.

## Commands

- **Run tests**: `npm test`
- **Run a single test file**: `node --test __tests__/addresses.test.js`
- **Lint**: `npm run lint` (uses oxlint with auto-fix)
- **Format**: `npm run format` (uses oxfmt)

## Architecture

The library exports a single async function `isLocalhost(ipOrHostname, canBind?)` from `index.js`:

1. **IP Detection**: Uses `node:net.isIP()` to determine if input is an IP address
2. **Regex Matching**: Tests IP against combined regex for private/local ranges (10.x, 127.x, 169.254.x, 172.16-31.x, 192.168.x, fc00::/7, fe80::/10, plus IPv4-mapped IPv6 variants)
3. **Bind Check**: When `canBind=true`, creates a UDP socket to verify the address exists on a local interface
4. **DNS Fallback**: For hostnames, validates format with `VALID_HOSTNAME` regex, then uses `dns.promises.lookup()` to resolve and recursively checks resolved addresses

## Testing

Tests use Node.js built-in test runner (`node:test`) with coverage output to `coverage/lcov.info`. Test files are in `__tests__/`:
- `addresses.test.js` - IP range boundary tests
- `hosts.test.js` - Hostname resolution tests
- `hosts-regexp.test.js` - Hostname validation regex tests
- `dns-mock.test.js` - DNS mocking tests

## Git Hooks

Pre-commit hooks via lefthook run: TypeScript type checking, oxlint, oxfmt, and various config validators. Commit messages are linted with commitlint.
