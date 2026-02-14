# FreightOS Implementation Overview

## Intent

- Convert product and design specifications into a three-stage, execution-ready build plan for this repository.
- Keep implementation aligned with current stack: TanStack React Start, React 19, TypeScript strict, Tailwind 4, shadcn/base-nova components.
- Deliver an entirely client-side proof of concept with deterministic mocks and scenario playback.

## Current Codebase Baseline

- `src/routes/index.tsx` currently renders `ComponentExample` starter UI.
- `src/routes/__root.tsx` configures global document shell and style loading.
- `src/styles.css` defines theme tokens with Tailwind 4 CSS variables.
- UI primitive wrappers already exist in `src/components/ui/`.
- Product and design source docs exist inside `files.zip`: `requirements.md`, `design.md`.

## Stage Ordering

1. Stage 1: Foundation Platform
2. Stage 2: Core Operations Workflows
3. Stage 3: AI, Voice, and Demo Finalization

## Cross-Stage Rules

- Mobile-first for 390px viewport; preserve responsiveness for tablet and desktop.
- No backend dependencies in MVP; all data and workflows simulated locally.
- Deterministic state and seeded fixtures for repeatable demos.
- Accessibility and visual consistency are non-optional requirements.
- Each stage includes executable acceptance criteria and tests.

## Planned Deliverables

- `codex-plan-part1.md`: Stage 1 implementation plan.
- `codex-plan-part2.md`: Stage 2 implementation plan.
- `codex-plan-part3.md`: Stage 3 implementation plan.
- `codex-milestones.md`: milestone outcomes and stakeholder expectations.
- `codex-manual-validtation.md`: manual validation playbook for app behavior.

## Data And Mock Principles

- Seed entities: trucks, drivers, loads, shippers, carriers, lane rates, events.
- Provide deterministic IDs and timestamps for reproducible walkthroughs.
- Track status transitions via state machine style transitions.
- Time simulator drives event queue and scenario progression.

## Public Interface Contract Summary

- Domain types centralized in `src/domain/types.ts`.
- App state and actions centralized in `src/state/app-store.ts`.
- Simulation engine contracts in `src/sim/`.
- Recommendation and voice simulation contracts in `src/ai/`.

## Scenario Coverage Target

- Scenario A: New Load Dispatch
- Scenario B: Brokered Load Lifecycle
- Scenario C: Exception Management
- Scenario D: AI Planning Session
- Scenario E: Voice Agent Demo

## Done Criteria Across Entire Program

- All scenario flows are runnable from in-app controls.
- Data remains logically consistent after each action sequence.
- UI demonstrates information-dense but readable mobile behavior.
- Manual validation checklist passes without blockers.
