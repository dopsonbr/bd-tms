# Codex Plan Part 2: Core Operations Workflows

## Stage Goal
- Implement high-value carrier and brokerage workflows over Stage 1 foundation, including dispatch interaction, load lifecycle behavior, and operational analytics.

## Scope
- Dashboard operations view with KPI and exceptions.
- Loads list/detail with lifecycle and dispatch interactions.
- Fleet map/list with truck and driver summaries.
- Brokerage load board, carrier matching, and margin controls.
- Scenario A/B/C end-to-end state transitions.

## Out Of Scope
- Full AI natural-language engine behavior beyond guided recommendations.
- Full voice call immersive playback.

## Critical Feedback Applied
- Removed duplicate-pass task inflation and consolidated into one executable checklist.
- Sequenced tasks by workflow dependencies and shared state coupling.
- Added explicit cross-surface consistency test requirements.

## Required File Expansion
- `src/routes/dashboard.tsx`
- `src/routes/loads.tsx`
- `src/routes/loads.$loadId.tsx`
- `src/routes/fleet.tsx`
- `src/routes/fleet.$truckId.tsx`
- `src/routes/more.tsx`
- `src/components/freightos/*` (ops components)
- `src/state/actions/dispatch-actions.ts`
- `src/state/selectors/ops-selectors.ts`
- `src/sim/scenarios/scenario-a.ts`
- `src/sim/scenarios/scenario-b.ts`
- `src/sim/scenarios/scenario-c.ts`

## Workflow Acceptance Criteria
- Assignment updates dashboard, loads, and fleet in one transition.
- Exception actions update severity feed and timeline outcomes.
- Brokerage matching shows deterministic margin impact.
- KPI/report charts update on scenario/time changes.
- Scenario A/B/C run from demo controls and complete predictably.

## Stage 2 Detailed Work Packages
- [ ] OPS-0001 | Dashboard | Implement dashboard header and operational context.
- [ ] OPS-0002 | Dashboard | Implement KPI strip bound to derived selectors.
- [ ] OPS-0003 | Dashboard | Implement quick actions strip for common dispatch flows.
- [ ] OPS-0004 | Dashboard | Implement prioritized exception feed with severity affordances.
- [ ] OPS-0005 | Dashboard | Implement mini map summary synced with fleet state.
- [ ] OPS-0006 | Dashboard | Implement today timeline with deep links.
- [ ] OPS-0007 | Loads | Implement segmented load list (active/available/completed).
- [ ] OPS-0008 | Loads | Implement combinable filters and deterministic subset behavior.
- [ ] OPS-0009 | Loads | Implement deep-linkable load detail route.
- [ ] OPS-0010 | Loads | Implement lifecycle tracker with coherent timestamps.
- [ ] OPS-0011 | Loads | Implement financial breakdown and margin math.
- [ ] OPS-0012 | Loads | Implement document and communication panels.
- [ ] OPS-0013 | Dispatch | Implement dispatch board list/timeline view.
- [ ] OPS-0014 | Dispatch | Implement assignment recommendation sheet.
- [ ] OPS-0015 | Dispatch | Implement HOS/equipment/window conflict detection.
- [ ] OPS-0016 | Fleet | Implement fleet roster with availability grouping.
- [ ] OPS-0017 | Fleet | Implement map/list synchronization behavior.
- [ ] OPS-0018 | Fleet | Implement truck detail route and driver panel.
- [ ] OPS-0019 | Brokerage | Implement broker load board with margin color semantics.
- [ ] OPS-0020 | Brokerage | Implement carrier ranking and match sheet.
- [ ] OPS-0021 | Brokerage | Implement rate controls and margin preview.
- [ ] OPS-0022 | Analytics | Implement reports route and range controls.
- [ ] OPS-0023 | Analytics | Implement chart cards with empty and dense states.
- [ ] OPS-0024 | Scenarios | Implement Scenario A dispatch lifecycle flow.
- [ ] OPS-0025 | Scenarios | Implement Scenario B broker lifecycle flow.
- [ ] OPS-0026 | Scenarios | Implement Scenario C exception lifecycle flow.
- [ ] OPS-0027 | State | Implement ops selectors resistant to recomputation churn.
- [ ] OPS-0028 | Quality | Add cross-surface integration tests for A/B/C.
- [ ] OPS-0029 | Quality | Validate accessibility labels on critical CTA controls.
- [ ] OPS-0030 | Quality | Validate mobile ergonomics for dispatch and detail flows.

## Stage 2 Test Cases And Scenarios
- [ ] T2-001 Scenario A dispatch acceptance updates Dashboard, Loads, Fleet.
- [ ] T2-002 Scenario A captures POD simulation and enables invoice state.
- [ ] T2-003 Scenario B creates brokered load and assigns partner carrier.
- [ ] T2-004 Scenario B updates margin after simulated rate negotiation.
- [ ] T2-005 Scenario C triggers breakdown exception and recovery recommendation.
- [ ] T2-006 Scenario C resolves exception and updates feed severity.
- [ ] T2-007 Filter combinations return deterministic subsets.
- [ ] T2-008 Dispatch conflict alerts appear pre-confirmation.

## Stage 2 Exit Checklist
- [ ] Dashboard, Loads, Fleet, and Brokerage views are interactive and consistent.
- [ ] Scenario A/B/C are replayable from demo controls.
- [ ] Integration tests pass for core operations behavior.
- [ ] Stage 3 can focus on AI/voice without workflow debt.
