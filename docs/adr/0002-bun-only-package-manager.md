# ADR-0002: Bun as the Only Package Manager

**Status:** Accepted

## Context

JavaScript projects typically support multiple package managers (npm, yarn, pnpm, bun). Allowing multiple managers leads to inconsistent lockfiles and developer environment drift.

## Decision

Use **bun** exclusively. npm, yarn, and pnpm are forbidden.

## Rationale

- Faster installs and script execution than npm/yarn/pnpm
- Single lockfile (`bun.lock`) eliminates environment drift
- Enforcing one tool removes ambiguity for contributors and agents

## Consequences

- All `package.json` scripts and CI must use `bun` commands
- Contributors must install bun before working on the project
- Agents must never invoke `npm`, `yarn`, or `pnpm`
