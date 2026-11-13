# AGENTS.md

This repository is being converted into a custom multi-page wedding website for Talia and Craig.

Before substantial UI or architecture work, read PROJECT_BRIEF.md.

## General rules

- Preserve working backend functionality unless explicitly asked to change it.
- Do not remove RSVP, authentication, database, or admin functionality merely because it is not currently visible in the redesign.
- Prefer incremental changes over large rewrites.
- Keep the application running after each meaningful change.
- Run the project's linting, type checking, and relevant tests before considering a task complete.
- Fix errors introduced by your changes.

## Design

The existing visual design is not authoritative.

Follow PROJECT_BRIEF.md for visual direction.

Read DESIGN.md and DESIGN_DECISIONS.md before homepage work. These documents capture the approved Italian Journal / Editorial Cover direction and supersede conflicting template visual guidance in CLAUDE.md. Record accepted design changes and material verification limits in the project files.

The site is English-only. Journal styling is an aesthetic direction, not a public journal title or edition label.

Do not default to generic AI-generated UI patterns such as:
- grids of rounded cards
- excessive pills
- glassmorphism
- gradients without a design reason
- generic SaaS layouts

The design should be editorial, photography-led, and appropriate for a luxury Italian destination wedding.

## Architecture

This must remain a true multi-page Next.js application.

Prefer reusable components and shared layouts.

Avoid duplicating wedding information across routes.

Where content is likely to change, prefer structured configuration/data.

## Workflow

The user's feature queue for this workspace is ../feature_list.txt, in the project folder above this Git repository. Use that existing file; do not create another feature_list.txt inside the repository.

For large changes:

1. Inspect the relevant existing code first.
2. Explain the proposed approach.
3. Identify functionality that must be preserved.
4. Implement the change.
5. Run checks.
6. Summarize changed files and any remaining issues.

Do not redesign multiple major pages simultaneously unless explicitly requested.

## Content

Do not invent final wedding logistics, addresses, venues, dates, hotel recommendations, shuttle details, or RSVP rules.

Use clearly identifiable placeholder content when information is unknown.

## Responsive design

Always verify layouts conceptually at:
- mobile
- tablet
- desktop

Mobile must not be treated as a shrunk desktop layout.
