# Project rules

- Read docs/PLAN.md, docs/PROGRESS.md and data/storyboard.json before continuing.
- Work on one shot at a time. Present its animation and keyframes to the user, then STOP until the user explicitly approves or requests revisions.
- Never treat silence, a successful test, a GitHub push, or a different project request as shot approval.
- Never implement the next shot while the current shot is awaiting review. Shared infrastructure may be repaired.
- Record actual approval in docs/PROGRESS.md and data/storyboard.json, with the user's wording and date. Never invent approvals.
- Every frame must be derived from absolute time. No unseeded randomness or accumulation of simulation state.
- Follow docs/PLAN.md. Concept maps are curated artistic representations, not model internals.
- Keep this project in its own directory. Do not edit sibling projects.
- Sync reviewable changes to the linked GitHub repository when available. Never commit credentials, node_modules, third-party audio or unreviewed license claims.
- Music selected by the user on 2026-10-15: Aphelion by Scott Buckley, CC BY 4.0. See data/music-edit.json for verified source, hash and attribution. Keep full audio out of Git.
- Current priority: review the combined S001–S003 music edit (BOOT music-v001). Keep S004 and all later shots on hold until the user approves this edit. Original silent scene modules and their prior approvals are preserved as baselines.
