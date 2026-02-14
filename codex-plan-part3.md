# Codex Plan Part 3: AI, Voice, and Demo Finalization (Refined)

## Stage Goal
Complete AI and voice simulation surfaces and deliver polished demo controls for deterministic stakeholder walkthroughs.

## In Scope
- AI chat with reasoning and action buttons
- Voice call playback screen with timed transcript + system actions
- Planning assistant cards for tomorrow recommendations
- Demo controls for scenario switching, time advancement, event injection, and reset
- Scenario D/E completion paths

## Execution Packages
1. `AIV-01` AI chat experience
- Files: `src/routes/ai-agent.tsx`, `src/components/freightos/ai-chat.tsx`, `src/ai/chat-simulator.ts`
- Exit: Multi-turn deterministic chat with operational context and actions

2. `AIV-02` Voice demo experience
- Files: `src/components/freightos/voice-call-demo.tsx`, `src/ai/voice-simulator.ts`
- Exit: Deterministic transcript playback with play/pause/speed/skip controls

3. `AIV-03` Demo controls and reports surface
- Files: `src/routes/more.tsx`, `src/components/freightos/demo-controls-panel.tsx`
- Exit: Scenario/time/event/reset controls are visible and reliable

4. `AIV-04` Visual and interaction polish
- Files: `src/styles.css`
- Exit: Intentional visual direction, strong hierarchy, responsive behavior on mobile/tablet/desktop

## Stage 3 Acceptance Criteria
- Scenario D and E run fully from the UI
- AI outputs include confidence/reasoning language
- Voice playback demonstrates realistic call flow and post-call summary
- Reset returns canonical baseline from any path
- Demo operator can run all scenarios without hidden steps
