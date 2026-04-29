# ADR-0004: Local-First with Graceful AI Degradation

**Status:** Accepted

## Context

Mimisbrunnr has AI features that require network calls to LLM providers. A design choice is needed: should AI be core (app breaks without it) or additive (app works without it)?

## Decision

**Core features must work fully offline.** AI features are additive and degrade gracefully on network failure.

## Rationale

- Users should not lose access to their notes because an API is down or they are offline
- Local-first is a core product differentiator and trust signal
- LLM API costs should not be incurred for basic read/write operations

## Consequences

- Read, write, and search are implemented with zero network dependency
- LLM calls are isolated to AI feature modules (Absorption Engine, Production Engine)
- All AI call sites must handle failure gracefully — errors are surfaced as quiet warnings, not blocking modals
- Features gated on AI must be clearly distinguished in the UI
