# Integration Flow Design

This document collects integration flow designs that will be translated into integration tests and E2E scenarios.

Purpose
-------
- Provide clear, reproducible flow definitions that map user/business flows to test scenarios.
- Make each flow self-contained: preconditions, inputs, expected results, cleanup and edge cases.
- Serve as the single source of truth for implementing deterministic integration tests.

How to use this document
------------------------
1. Pick a flow from the list below.
2. Fill the Flow Template for that flow (Goal, Actors, Preconditions, Steps, Expected Outcomes, Test Data, Cleanup, Edge Cases).
3. Implement the test using the chosen framework (Jest + Supertest with Nest TestingModule) following the acceptance criteria.

Flow template (copy and fill for each flow)
-------------------------------------------
- Flow id: (unique identifier, e.g. FLOW-001)
- Title: (short descriptive title)
- Purpose / Goal: (what this flow verifies)
- Actors: (user roles or system actors involved)
- Preconditions: (DB state, fixtures, external services, environment vars)
- HTTP Endpoints / Services involved: (list with method + path)
- Steps (ordered):
  1. (step description: request, payload, headers)
  2. ...
- Expected outcomes (per step): (HTTP status, response shape, DB state changes)
- Postconditions / Cleanup: (what must be removed/reset after test)
- Edge cases / Negative scenarios: (invalid data, missing permissions, limits)
- Metrics to assert (optional): response time, event produced, DB counts
- Acceptance criteria (for test pass): clear checklist of assertions

Example flow: FLOW-001 — Register user → Create property → Upload document → Create contract
-------------------------------------------------------------------------------------------
- Flow id: FLOW-001
- Title: Full happy path from user registration to contract creation
- Purpose / Goal: Verify end-to-end happy path where a new user registers, creates a property, uploads required documents and creates a contract for that property.
- Actors: COMMUNITY user (creator), AGENT or OWNER depending on business rule
- Preconditions:
  - Test DB is clean (dataSource.synchronize(true) or equivalent)
  - No user with the test emails/usernames exists
  - Configuration: storage for uploads points to test storage (local tmp)
- Endpoints involved:
  - POST /auth/register (or /users depending on route)
  - POST /properties
  - POST /multimedia/upload
  - POST /documents
  - POST /contracts
- Steps:
  1. POST /auth/register -> create user (save returned id)
     - Assert 201 and response contains `id` and `email`
  2. Authenticate (POST /auth/sign-in) to obtain bearer token
     - Assert 200 and JWT returned
  3. POST /properties with token -> create property owned by user
     - Assert 201 and response contains `id` and `creatorUser.id === user.id`
  4. POST /multimedia/upload with file and metadata -> receive multimedia id(s)
     - Assert 201 and multimedia resource created with required fields
  5. POST /documents linking multimedia and property
     - Assert 201 and document has `multimedia` relationship
  6. POST /contracts linking property and people (buyer/seller)
     - Assert 201 and contract contains `id`, `property.id` and computed commission amount
- Expected DB state after flow:
  - User exists and has no duplicate
  - Property exists and is linked to user
  - Multimedia & Document exist linked to property
  - Contract exists and references property and people
- Cleanup:
  - Delete contract (or soft-delete) created by the test
  - Delete document and multimedia
  - Delete property
  - Delete person(s) and user(s)
  - Optionally truncate in reverse order to respect FK constraints
- Edge cases to add as separate flows:
  - Missing required multimedia fields on upload
  - Property created without required relation
  - Contract creation with non-existent property id (expect FK error)

Design considerations and tips
-----------------------------
- Make tests idempotent: always create unique usernames/emails (timestamp suffix or use faker) so tests don't conflict across runs.
- Clean up in reverse dependency order: children before parents (e.g. multimedia → documents → contracts → properties → users).
- Prefer creating fixtures in the test itself (or via seeds) rather than relying on global state.
- For heavy assets (videos, large files), mock upload or use small representative files to avoid large repo artifacts.
- Close resources at the end of tests: `await app.close()` and `await dataSource.destroy()` to avoid open-handles.
- If tests interact with external services, either mock them or use local test doubles (dockerized mocks) to keep runs deterministic.

Mapping flows to test suites
---------------------------
- Each flow should map to one or more Jest test files under `test/` or `src/**.spec.ts` depending on scope.
- Use descriptive testPathPattern names and group related flow tests in directories by module (auth/, properties/, contracts/).

Next steps
----------
1. Pick the first 3 flows to design in detail (we can start with FLOW-001 above). I can author full Flow Template entries for each and generate the test skeletons.
2. After you approve the designs, I will implement the integration test files (Jest + Supertest) and run the suite.

If you want, I can now: (a) design FLOW-001 in full detail (test data, exact payloads), or (b) generate the test skeleton file for FLOW-001 under `test/flows/flow-001.integration.spec.ts`.

Tell me which of the next steps you want me to take.
