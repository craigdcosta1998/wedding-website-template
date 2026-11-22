# Design and technical review

Craig requested two independent reviewers on November 21, 2026: one for approved design guidelines and one for technical practices. Both review the proposed approach before substantive implementation and the result after every significant website change, regardless of deployment. Local and uncommitted work needs the same reviews before the change is marked complete or unrelated significant work begins.

## When review is required

Treat a coherent group of related edits as one change. Significant changes include page/section redesigns, meaningful layout or styling changes, navigation and interaction changes, new features, substantive guest-facing content, architecture, authentication/permissions, data handling, dependencies, and runtime or hosting configuration. These examples are not exhaustive. Do not accumulate unrelated significant changes and defer their reviews until deployment.

Pure typo, formatting, or comment-only edits may skip the full review cycle only when they have no meaningful visual, content-meaning, behavioral, architectural, data, dependency, or runtime impact, unless the user requests review. When uncertain, require both reviewers. Review completed changes, not each keystroke within an implementation batch.

## Roles

| Reviewer | Definition | Focus |
| --- | --- | --- |
| `design_reviewer` | [.codex/agents/design_reviewer.toml](.codex/agents/design_reviewer.toml) | Approved visual direction, content, responsive layouts, accessibility, and rendered evidence |
| `technical_reviewer` | [.codex/agents/technical_reviewer.toml](.codex/agents/technical_reviewer.toml) | Correctness, architecture, security, preserved functionality, performance, and verification |

The primary agent implements changes and coordinates reviews. Reviewers inspect and report; they do not edit project files, change application/database state, commit, push, deploy, or spawn further agents. They inherit the parent's model and permissions. Their instruction to avoid edits is a workflow rule, not a separate read-only sandbox.

## Before implementation

1. Read the applicable project guidance and inspect the affected implementation. State a concrete approach, intended files/routes, and behavior that must be preserved.
2. Spawn **both** independent reviewers. Give each the user request, proposed approach, relevant decisions, current candidate/base, and known constraints. They may review in parallel.
3. Wait for both reports before substantive edits. Resolve actionable blockers in the approach and ask the affected reviewer to review the revision. A materially changed scope needs a renewed preflight. Reviewers do not need to approve routine read-only investigation.
4. Implement the reviewed approach. Reviewers advise within the user's scope; optional suggestions do not silently expand it.

## After each significant change

Complete this review cycle even if no commit, push, or deployment is planned.

1. Run lint, explicit TypeScript checking, and relevant tests. Run a production build for application changes and check affected behavior. The usual commands from the repository root are:

   ```powershell
   npm.cmd run lint -- --no-cache
   .\node_modules\.bin\tsc.cmd --noEmit --incremental false
   npm.cmd run test:run -- --configLoader runner
   npm.cmd run build
   git diff --check
   ```

   Sequence the build and type check so generated Next.js types are stable. Documentation/configuration-only changes need configuration validation and the applicable project checks; they do not require a new application build or visual screenshots.
2. Give both reviewers the complete candidate: intended base/target, tracked and new files, the final diff, check results, and relevant evidence. Include staged and unstaged changes; do not omit new agent/configuration files because `git diff` alone misses them.
3. For UI changes, supply current rendered desktop, tablet, and mobile evidence plus relevant keyboard/interaction checks. Source-level responsive reasoning does not count as visual verification. Craig explicitly permitted Chrome again on November 21, 2026 for end-to-end project verification. Report unavailable evidence honestly.
4. Wait for both final reports. Resolve blockers and obtain another review of affected changes after fixes. Required unavailable evidence means the candidate is blocked for that approval, not implicitly passed. Design may report `NOT_APPLICABLE` only with a reason showing no UI or website-content impact.
5. Bind the final verdicts to the actual reviewed candidate: record the base and commit if committed, or the base plus the specific working-tree files/diff reviewed. Later relevant edits invalidate the affected sign-offs; a clean commit of the reviewed contents does not itself require a repeat review.
6. Report both verdicts, verification results, and material limits to the user before marking the change complete or starting unrelated significant work. If required evidence is missing, report the change as implemented but awaiting verification/review rather than complete.

## Before a later push or deployment

Verify that the candidate still matches the reviewed contents and that no required reviews or checks remain outstanding. Reuse the completed reviews when the contents are unchanged; obtain renewed reviews for affected edits. Publish only within the user's authorization. A reviewer verdict is not permission to publish.

## Reviewer report

Return a concise report containing:

- **Reviewer and phase:** design/technical; preflight/final.
- **Candidate:** proposed scope or exact base/commit/working-tree changes inspected.
- **Verdict:** `APPROVED`, `CHANGES_REQUIRED` (actionable blocker), or `BLOCKED` (required information or verification missing). Design alone may use `NOT_APPLICABLE` with the reason above.
- **Blockers:** file/line or visual evidence, practical impact, and the smallest needed correction. Say explicitly if there are none.
- **Optional suggestions:** keep separate from blockers.
- **Evidence and limits:** checks/artifacts actually inspected, unverified behavior, and what is needed to close any gap.

Keep reports in the task conversation and summarize relevant durable decisions/verification limits in the existing project records. Do not store guest lists, issued credentials, or secrets in review records. Judge the current change, not unrelated deferred backlog work.

## Loading the reviewers

The project-scoped TOML definitions use Codex's [documented custom-agent format](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Run Codex from this Git repository when using project-scoped agent discovery.

If the current client does not expose named agent selection, the primary agent must read each TOML file and pass its complete `developer_instructions`, role name, and task context to a separate spawned reviewer. Do not assume a matching task name loads the profile. This fallback provides the same review instructions without changing global configuration. If delegation is unavailable, report that limitation; do not substitute self-review and claim that independent reviews passed.

This is a local Codex workflow. It does not install a Git hook, require GitHub checks, change Vercel settings, or prevent someone from deploying outside this workflow. Hosting integration and production-branch protection have not been verified. Treat a push as a possible deployment trigger and complete the reviews before it.
