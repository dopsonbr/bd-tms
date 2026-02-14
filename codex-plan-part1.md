# Codex Plan Part 1: Foundation Platform

## Stage Goal
- Build the architectural and UI foundation for FreightOS so Stage 2 and Stage 3 can focus on workflows and AI/voice behavior without rework.

## Scope
- Application shell and navigation skeleton.
- Domain model and deterministic seed generator.
- Central store, selectors, and state actions.
- Route scaffolding for all primary tabs.
- Core component primitives for domain cards and status patterns.
- Simulation scaffolding: scenarios, clock, and event queue contracts.
- Baseline tests for state correctness and routing.

## Out Of Scope
- Full dispatch workflow behavior.
- Voice transcript playback details.
- Complete AI conversation orchestration.

## Critical Feedback Applied
- Removed non-executable duplicate-pass checklist structure.
- Reordered work by hard dependencies: domain/data -> state -> routes -> components -> tests.
- Added stage gates to prevent Stage 2 from starting on unstable foundations.

## Target File Additions
- `src/domain/types.ts`
- `src/domain/constants.ts`
- `src/domain/guards.ts`
- `src/data/seed/base-seed.ts`
- `src/data/seed/build-seed.ts`
- `src/data/seed/scenarios.ts`
- `src/state/app-store.ts`
- `src/state/selectors.ts`
- `src/state/actions.ts`
- `src/sim/clock.ts`
- `src/sim/events.ts`
- `src/sim/event-dispatcher.ts`
- `src/components/freightos/*`
- `src/routes/dashboard.tsx`
- `src/routes/loads.tsx`
- `src/routes/fleet.tsx`
- `src/routes/ai-agent.tsx`
- `src/routes/more.tsx`

## Stage 1 Acceptance Criteria
- App boots into a FreightOS shell, not starter UI.
- Bottom tabs expose Dashboard, Loads, Fleet, AI Agent, More.
- Seed state has coherent cross references.
- Store selectors provide stable derived slices.
- Scenario reset and baseline clock are deterministic.
- Foundation unit tests pass.

## Stage 1 Detailed Work Packages
- [ ] FND-0001 | Domain | Define entities and lifecycle enums in `src/domain/types.ts`.
- [ ] FND-0002 | Domain | Add constants and status maps in `src/domain/constants.ts`.
- [ ] FND-0003 | Domain | Add lifecycle and referential integrity guards in `src/domain/guards.ts`.
- [ ] FND-0004 | Data | Build deterministic base fixtures in `src/data/seed/base-seed.ts`.
- [ ] FND-0005 | Data | Build normalized seed generator in `src/data/seed/build-seed.ts`.
- [ ] FND-0006 | Data | Define scenario metadata and initial snapshots in `src/data/seed/scenarios.ts`.
- [ ] FND-0007 | Sim | Implement deterministic clock controls in `src/sim/clock.ts`.
- [ ] FND-0008 | Sim | Implement queue/event contracts in `src/sim/events.ts`.
- [ ] FND-0009 | Sim | Implement event dispatcher with once-only event semantics.
- [ ] FND-0010 | State | Implement central app store in `src/state/app-store.ts`.
- [ ] FND-0011 | State | Implement selectors in `src/state/selectors.ts`.
- [ ] FND-0012 | State | Implement serializable action contracts in `src/state/actions.ts`.
- [ ] FND-0013 | Routing | Replace index starter route with dashboard entry and tab shell.
- [ ] FND-0014 | Routing | Scaffold tab routes for dashboard/loads/fleet/ai-agent/more.
- [ ] FND-0015 | UI | Implement app shell and bottom tab bar.
- [ ] FND-0016 | UI | Implement shared status/metric/entity/timeline primitives.
- [ ] FND-0017 | UI | Implement reusable empty/loading/error states.
- [ ] FND-0018 | UI | Implement global search + notification overlays.
- [ ] FND-0019 | UI | Implement mobile bottom sheet + FAB action container.
- [ ] FND-0020 | Style | Define FreightOS visual tokens and typography in `src/styles.css`.
- [ ] FND-0021 | Quality | Add test setup harness and deterministic fixtures.
- [ ] FND-0022 | Quality | Add unit tests for seed integrity and state invariants.
- [ ] FND-0023 | Quality | Add route smoke tests for tab deep linking.
- [ ] FND-0024 | Quality | Ensure build/test scripts validate baseline stage.

## Stage 1 Test Cases And Scenarios
- [ ] T1-001 Validate seed counts and deterministic IDs.
- [ ] T1-002 Validate no truck is assigned to more than one active load.
- [ ] T1-003 Validate no driver exceeds HOS limits in initial state.
- [ ] T1-004 Validate load lifecycle starts at allowed stages only.
- [ ] T1-005 Validate scenario loader swaps state atomically.
- [ ] T1-006 Validate reset returns canonical baseline snapshot.
- [ ] T1-007 Validate bottom tab shell on 390px viewport.
- [ ] T1-008 Validate route deep links render expected shell sections.

## Stage 1 Exit Checklist
- [ ] FreightOS shell replaces starter app.
- [ ] Domain, store, and sim contracts are implemented and tested.
- [ ] Foundation routes compile and render with deterministic data.
- [ ] Stage 2 can start without architecture blockers.
