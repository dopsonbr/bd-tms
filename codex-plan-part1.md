# Codex Plan Part 1: Foundation Platform (Refined)

## Stage Goal
Establish the data model, deterministic simulation engine, shared state store, and mobile shell so workflow features can be built without architecture churn.

## In Scope
- Domain entities and strict TypeScript contracts
- Deterministic seed generator (`45` trucks, `30` drivers, `80` loads baseline)
- Scenario loader/reset baseline mechanics
- Shared app store with actions and memoized selectors
- App shell with 5-tab navigation and responsive layout primitives
- Core reusable components (`status`, `metric`, `entity`, `timeline`)

## Out of Scope
- Full brokerage workflows
- AI natural-language quality polish
- Voice playback experience polish

## Execution Packages
1. `FND-01` Domain contracts
- Files: `src/domain/types.ts`
- Exit: Core entities and status enums compile with strict mode

2. `FND-02` Deterministic data and scenarios
- Files: `src/data/seed/build-seed.ts`
- Exit: Seed and scenario transforms return stable outputs for same inputs

3. `FND-03` Store and selectors
- Files: `src/state/app-store.tsx`
- Exit: Actions for assign, resolve, advance time, inject event, scenario load, reset

4. `FND-04` Simulation and AI/voice contracts
- Files: `src/ai/chat-simulator.ts`, `src/ai/voice-simulator.ts`
- Exit: Deterministic outputs for chat and transcript scripts

5. `FND-05` App shell and navigation
- Files: `src/components/freightos/app-shell.tsx`, `src/components/freightos/tab-bar.tsx`, `src/routes/__root.tsx`
- Exit: 5-tab shell is functional at `390px`

## Stage 1 Acceptance Criteria
- Starter example UI is removed from root experience
- App boots with coherent seeded operational state
- Scenario load and reset are deterministic
- Navigation shell is stable and mobile-first
- Shared store updates without remounting root shell
