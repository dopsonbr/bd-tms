# Agent Notes

## Required Skills

Use these skills by default when the task matches:

- `browser-agent` (`agent-browser` local skill): required for website interaction, web app validation, screenshots, and browser automation work.
- `vercel-react-best-practices`: required for React/Next.js implementation, refactors, and performance-sensitive reviews.

## Port Assignments (This Worktree)

Use non-default, high ports in this worktree to avoid conflicts with other parallel implementations.

- `DEV_PORT`: `43857` (used by `vite dev`)
- `PREVIEW_PORT`: `43858` (used by `vite preview`)

## Override Ports

If these ports are occupied, override them per run:

```bash
DEV_PORT=43957 PREVIEW_PORT=43958 bun run dev
```

When using `browser-agent`/`agent-browser`, target the configured local URL:

```bash
http://127.0.0.1:${DEV_PORT:-43857}
```
