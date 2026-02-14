# Codex Plan Part 3: AI, Voice, and Demo Finalization

## Stage Goal
- Complete AI and voice simulation layers and polish the POC into a guided, reliable demo artifact with deterministic scenario handling.

## Scope
- AI chat interface with context-aware deterministic responses.
- Recommendation confidence + reasoning panel behavior.
- Voice dashboard and immersive call playback simulation.
- Planning assistant and tomorrow plan review interactions.
- Demo controls: scenario selector, time simulator, event injector, guided tour, reset.
- Scenario D/E end-to-end support.

## Out Of Scope
- Production-ready telephony and speech recognition services.
- Real-time backend persistence.

## Critical Feedback Applied
- Removed duplicate-pass inflation and mapped work into one dependency-ordered sequence.
- Added deterministic replay and reset guarantees as hard stage gates.
- Added explicit smoke testing for stakeholder demo reliability.

## Required File Expansion
- `src/routes/ai-agent.tsx`
- `src/routes/ai-agent.voice.tsx`
- `src/routes/more.demo-controls.tsx`
- `src/components/freightos/*` (AI + voice + demo components)
- `src/ai/recommendation-scorer.ts`
- `src/ai/chat-simulator.ts`
- `src/ai/voice-simulator.ts`
- `src/ai/reasoning.ts`
- `src/sim/time-advance.ts`
- `src/sim/injectors.ts`
- `src/sim/scenarios/scenario-d.ts`
- `src/sim/scenarios/scenario-e.ts`

## Final Stage Acceptance Criteria
- AI chat supports deterministic multi-turn prompts and action buttons.
- Voice demo plays deterministic transcript frames and system action feed.
- Scenario D/E run and produce expected outcomes.
- Demo controls can reset/replay all scenarios without stale state.
- Manual validation steps pass on mobile and desktop.

## Stage 3 Detailed Work Packages
- [ ] AIV-0001 | AI Chat | Implement AI chat shell with context chips.
- [ ] AIV-0002 | AI Chat | Implement message renderer for user/AI/system payloads.
- [ ] AIV-0003 | AI Chat | Implement inline chat action buttons bound to store actions.
- [ ] AIV-0004 | AI | Implement recommendation scorer with deterministic ranking.
- [ ] AIV-0005 | AI | Implement what-if and reasoning panel outputs.
- [ ] AIV-0006 | AI | Implement confidence badge thresholds and semantics.
- [ ] AIV-0007 | Voice | Implement voice dashboard tabs (live/history/performance/settings).
- [ ] AIV-0008 | Voice | Implement live and history call cards with transcript snippets.
- [ ] AIV-0009 | Voice | Implement voice performance metrics and filters.
- [ ] AIV-0010 | Voice | Implement session-level voice settings persistence.
- [ ] AIV-0011 | Voice Demo | Implement immersive call screen (mobile-first).
- [ ] AIV-0012 | Voice Demo | Implement transcript timeline scheduler.
- [ ] AIV-0013 | Voice Demo | Implement real-time system action feed.
- [ ] AIV-0014 | Voice Demo | Implement playback controls (play/pause/speed/skip).
- [ ] AIV-0015 | Voice Demo | Implement post-call summary and impacted entity list.
- [ ] AIV-0016 | Planning | Implement planning assistant summary UI.
- [ ] AIV-0017 | Planning | Implement deterministic demand forecast model.
- [ ] AIV-0018 | Planning | Implement repositioning suggestion generator.
- [ ] AIV-0019 | Planning | Implement tomorrow plan review and approval flow.
- [ ] AIV-0020 | Demo | Implement demo controls panel in More tab.
- [ ] AIV-0021 | Demo | Implement scenario selector with atomic loads.
- [ ] AIV-0022 | Demo | Implement time simulator tied to queue dispatch.
- [ ] AIV-0023 | Demo | Implement event injector for weather/breakdown/tender/call.
- [ ] AIV-0024 | Demo | Implement guided tour overlays.
- [ ] AIV-0025 | Demo | Implement deterministic reset engine.
- [ ] AIV-0026 | Scenarios | Implement Scenario D planning session flow.
- [ ] AIV-0027 | Scenarios | Implement Scenario E inbound voice status flow.
- [ ] AIV-0028 | Quality | Add Scenario D/E integration tests.
- [ ] AIV-0029 | Quality | Add demo smoke tests for scenario replay/reset.
- [ ] AIV-0030 | Quality | Validate final accessibility and mobile/desktop runbook.

## Stage 3 Test Cases And Scenarios
- [ ] T3-001 AI chat handles planning prompts with deterministic outputs.
- [ ] T3-002 Chat action buttons dispatch expected domain mutations.
- [ ] T3-003 Confidence badges change styles at threshold boundaries.
- [ ] T3-004 Voice demo transcript and system feed remain synchronized.
- [ ] T3-005 Voice summary includes impacted load and ETA updates.
- [ ] T3-006 Scenario D recommends repositioning with editable approvals.
- [ ] T3-007 Scenario E playback supports speed and skip controls.
- [ ] T3-008 Event injector updates impacted risk/status indicators.
- [ ] T3-009 Guided tour supports skip/back/complete.
- [ ] T3-010 Reset from any scenario restores canonical baseline.

## Stage 3 Exit Checklist
- [ ] AI Agent tab supports chat, reasoning, and planning workflow.
- [ ] Voice dashboard and immersive call simulation are complete.
- [ ] Demo controls support scenario/time/event/reset flows.
- [ ] Scenario D/E and smoke tests pass for stakeholder demo script.
- [ ] Runbook is ready for final walkthrough.
