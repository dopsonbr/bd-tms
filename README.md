# FreightOS

A mobile-first trucking management prototype for regional carrier and brokerage operations, powered by AI agents for dispatch, planning, and voice communication.

## What It Is

FreightOS replaces fragmented spreadsheets, phone calls, and legacy TMS systems with a single phone-friendly interface. AI agents handle load-truck matching, natural language dispatch, and voice calls with shippers, carriers, and drivers who still rely on call centers.

## Key Capabilities

**Carrier Operations** — Fleet dashboard, live truck map, dispatch board, driver HOS tracking, equipment management, and safety compliance.

**Brokerage Operations** — Load sourcing, carrier matching with scorecards, rate management, margin analysis, and simplified AR/AP.

**AI Dispatch Agent** — Automated load-truck matching with scored recommendations, natural language chat interface, route optimization, demand forecasting, and exception handling.

**AI Voice Agents** — Inbound call handling for shippers (status checks, load tenders, appointment changes), outbound calls to partner carriers (load offers, check calls), and a hands-free driver interface for reporting and updates.

## Demo

The prototype is fully interactive with no backend required. It includes 45 trucks, 30 drivers, 80 loads, and 15 shipper accounts across a Southeast US regional network.

Built-in demo tools let you walk through scenarios like dispatching a new load, brokering with a voice agent, handling a breakdown, and reviewing an AI-generated plan — all with time simulation and event injection controls.

## Documentation

- **[requirements.md](requirements.md)** — Full product requirements including user roles, feature specs, AI agent behavior, and demo scenarios.
- **[design.md](design.md)** — Visual design system, screen-by-screen layouts, interaction patterns, component library, data model, and responsive behavior.

## Target

Mobile-first (390px / iPhone 14), with responsive support for tablet and desktop.

## Visual Validation

Run the app on `localhost:4317` (default dev command) and capture the main route screenshots from a phone-first viewport:

```bash
bun run dev
```

In a second terminal, run:

```bash
bun run visual:routes
```

If `@playwright/test` is not installed, run:

```bash
bun add -d @playwright/test
bunx playwright install chromium
```

Optional env override:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4317 bun run visual:routes
```

Images are written to `artifacts/route-screenshots`.
