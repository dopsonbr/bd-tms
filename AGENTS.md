# Agent Notes

## Required Skills

Use these skills by default when the task matches:

- `browser-agent` (`agent-browser` local skill): required for website interaction, web app validation, screenshots, and browser automation work.
- `vercel-react-best-practices`: required for React/Next.js implementation, refactors, and performance-sensitive reviews.

## Port Assignments

Use non-default, high ports to avoid conflicts with other parallel implementations.

- `DEV_PORT`: `44100` (used by `vite dev`)
- `PREVIEW_PORT`: `44101` (used by `vite preview`)

These are configured in `vite.config.ts` via environment variables. Override per run if occupied:

```bash
DEV_PORT=44200 PREVIEW_PORT=44201 bun run dev
```

When using `browser-agent`/`agent-browser`, target the configured local URL:

```
http://localhost:${DEV_PORT:-44100}
```
