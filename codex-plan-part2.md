# Codex Plan Part 2: Core Operations Workflows (Refined)

## Stage Goal
Implement dispatcher and brokerage workflows on top of Stage 1 so operational value is demoable before AI/voice deep polish.

## In Scope
- Dashboard operations summary and exception feed
- Loads list with status segments, assignment actions, lifecycle visibility
- Fleet map/list synchronization and truck/driver visibility
- Brokerage-style margin and availability signals
- Scenario A/B/C completion paths

## Execution Packages
1. `OPS-01` Dashboard
- Files: `src/routes/index.tsx`, `src/components/freightos/kpi-strip.tsx`, `src/components/freightos/exception-feed.tsx`
- Exit: KPIs and exceptions respond to state changes

2. `OPS-02` Loads workflow
- Files: `src/routes/loads.tsx`, `src/components/freightos/load-card.tsx`, `src/components/freightos/load-lifecycle.tsx`
- Exit: Users can inspect loads by segment and dispatch pending loads

3. `OPS-03` Fleet workflow
- Files: `src/routes/fleet.tsx`, `src/components/freightos/fleet-map-panel.tsx`
- Exit: Fleet availability and truck status are consistent with assignments

4. `OPS-04` Shared visual primitives
- Files: `src/components/freightos/status-badge.tsx`, `src/components/freightos/metric-card.tsx`, `src/components/freightos/entity-card.tsx`
- Exit: Operational cards are dense but readable on mobile

## Stage 2 Acceptance Criteria
- Scenario A: pending load can be dispatched and reflected in Dashboard/Loads/Fleet
- Scenario B: brokered load view shows margin-aware cards and progression
- Scenario C: exception appears, can be resolved, and resolution state is reflected globally
- Navigation between tabs preserves user context and feels app-like
