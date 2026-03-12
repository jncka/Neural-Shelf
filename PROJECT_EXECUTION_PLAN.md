# Neural-Shelf Multi-Agent Execution Plan

## 1) Current-state review (from the existing codebase)

### Product and architecture snapshot
- Stack: Next.js App Router + TypeScript + React 19 + Prisma + SQLite (`dev.db`) + NextAuth.  
- Domain model exists for `User`, `Skill`, `Review`, `Collection`, plus NextAuth models.
- The app already supports:
  - Landing page and skill discovery pages.
  - Skill upload (authenticated).
  - Skill detail and reviews.
  - Download count tracking.
  - Public user profile API/page.
- UI component foundation is present (custom components + shadcn-style primitives).

### Key strengths
- End-to-end core marketplace loop is scaffolded (browse -> detail -> download, plus upload).
- API endpoints are cleanly split by resource.
- Input validation exists for upload and reviews via Zod.
- SKILL.md semantic validation exists (`validateSkillMd`).

### Gaps and risks observed
- **No test suite configured** (unit, integration, or E2E), which increases regression risk.
- **Auth sign-in page mismatch risk**: auth config points to `/auth/signin`, but no corresponding app route currently exists.
- **Code duplication** in skill listing/serialization logic across pages and API routes.
- **Storage strategy is local filesystem** (`uploads/`), which is not production-ready for multi-instance deployment.
- **Search/filter capabilities are basic** (`contains` on JSON-string fields), limiting relevance and performance.
- **No explicit authorization policy layer** beyond route-level checks.
- **No observable product analytics/event instrumentation**.
- README is still template-level and not project-operational.

---

## 2) Recommended delivery strategy

Use a **parallel, stream-aligned team model** with one coordinator and multiple specialized agents.  
Each agent owns a bounded vertical slice with clear interfaces and acceptance criteria.

### Coordination rules
- Define a shared "Definition of Done" for every task:
  - Type-safe API contracts.
  - Loading/error/empty states in UI.
  - At least one test per new critical behavior.
  - Documentation updated.
- Merge order by dependency chain (platform first, then features).
- Require short architecture notes in each PR.

---

## 3) Multi-agent task breakdown

## Track A — Platform Foundations (highest priority)

### Agent A1: Auth & Access Foundations
**Scope**
- Implement `/auth/signin` page aligned with `NextAuth` config.
- Harden session handling and route-guard patterns.
- Add reusable auth utilities for server components and route handlers.

**Deliverables**
- Sign-in UX (GitHub/Google buttons, callback handling, error states).
- Consistent unauthorized handling strategy (redirect vs JSON 401).
- Documentation of auth flows and env requirements.

**Dependencies**: none.

---

### Agent A2: Data & Serialization Refactor
**Scope**
- Centralize skill/user DTO mapping logic currently duplicated in API and page loaders.
- Introduce repository/service layer modules for query reuse.

**Deliverables**
- `lib/serializers` and/or `lib/services` modules.
- Replaced duplicate JSON parse/reduce mapping in routes/pages.
- Strict typing for API response payloads.

**Dependencies**: none.

---

### Agent A3: Testing Infrastructure
**Scope**
- Add test framework and baseline CI checks.
- Add route-level tests for skill listing, upload validation, review constraints.

**Deliverables**
- Test runner setup + scripts.
- Seeded test DB strategy.
- Initial coverage gates for critical paths.

**Dependencies**: A2 preferred (to test stable abstractions).

---

## Track B — Core Product Experience

### Agent B1: Browse/Search UX & Relevance
**Scope**
- Improve query/filter behavior (category, tags, compatibility).
- Add better sorting options (rating, most reviewed, trending).
- Improve pagination UX and sharable filter URLs.

**Deliverables**
- Better search semantics and reusable filter state model.
- Improved browse page performance and user feedback states.

**Dependencies**: A2.

---

### Agent B2: Skill Detail & Reviews Experience
**Scope**
- Polish skill detail page data loading and interactions.
- Improve review UX (editing, optimistic updates, pagination states).
- Add abuse-resistant constraints (optional cooldown, rate limit hooks).

**Deliverables**
- Improved review lifecycle UX.
- Clear empty/error/signed-out behavior.

**Dependencies**: A1, A2.

---

### Agent B3: Upload Pipeline & Validation Enhancements
**Scope**
- Expand SKILL.md validator rules (schema completeness, optional metadata).
- Add upload preview/checklist before publish.
- Improve duplicate slug/name detection and conflict messaging.

**Deliverables**
- Stronger pre-publish validation UX.
- More informative API error format.

**Dependencies**: A1, A2.

---

## Track C — Production Readiness

### Agent C1: File Storage & Delivery
**Scope**
- Replace local `uploads/` file strategy with pluggable storage (S3/R2/local adapter).
- Add secure download URLs and optional signed links.

**Deliverables**
- Storage abstraction with environment-specific adapter.
- Migration/backfill strategy for existing zip assets.

**Dependencies**: A2.

---

### Agent C2: Observability & Analytics
**Scope**
- Add structured logging in API routes.
- Add product events: view skill, download, upload started/completed, review submitted.

**Deliverables**
- Event schema + instrumentation points.
- Basic dashboard-ready event stream (even if log-based initially).

**Dependencies**: A2.

---

### Agent C3: Security & Performance Hardening
**Scope**
- Add rate limiting stubs for mutable endpoints.
- Review input validation boundaries and payload size limits.
- Add caching strategy for read-heavy endpoints and pages.

**Deliverables**
- Security checklist and mitigations shipped.
- Performance wins documented with before/after metrics.

**Dependencies**: A1, A2, B1.

---

## Track D — Documentation & Developer Experience

### Agent D1: Project Docs and Contributor Guide
**Scope**
- Replace template README with operational docs.
- Add architecture overview, local setup, env vars, seed data, and route map.

**Deliverables**
- Production-quality README.
- `docs/architecture.md` and `docs/contributing.md`.

**Dependencies**: none (can start now).

---

## 4) Suggested sprint sequencing (4 sprints)

### Sprint 1 (stabilize foundation)
- A1 Auth & sign-in route.
- A2 Data/serialization refactor.
- D1 Documentation baseline.

### Sprint 2 (quality gates + core UX)
- A3 Testing infrastructure.
- B1 Browse/search improvements.
- B2 Detail/reviews UX polish.

### Sprint 3 (creator workflow + infra)
- B3 Upload enhancements.
- C1 Storage abstraction and migration path.

### Sprint 4 (go-live hardening)
- C2 Observability.
- C3 Security/performance hardening.
- Regression and release checklist.

---

## 5) Task board template for parallel agents

For each task ticket, use:
- **Owner agent**
- **Problem statement**
- **Scope in/out**
- **API/UI contracts touched**
- **Dependencies**
- **Acceptance criteria**
- **Test cases**
- **Rollout/rollback note**

This structure minimizes merge conflicts and keeps agents aligned on handoff quality.

---

## 6) Immediate next actions (today)
1. Create issues for A1, A2, D1 first.
2. Nominate one integration agent to own shared types/contracts.
3. Freeze naming conventions for DTOs and API response envelopes before implementation.
4. Add CI placeholder (lint + typecheck) so new PRs are gate-kept from day one.
