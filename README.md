# Real Estate Platform — Project Instructions

## Overview

This repository contains the full stack for the real estate platform. It is split into a NestJS backend, a Next.js frontend, and supplemental project documentation.

## Directory guide

- `backend/` — NestJS application that powers the API, authentication, and business logic. Refer to the directory README files for setup details and run scripts.
- `frontend/` — Next.js application that implements the user-facing web experience.
- `project/` — Collection of product and technical documentation (scope definitions, contracts, multimedia references, etc.).

## Frontend component guidelines

All reusable UI building blocks live in `frontend/components/`. Before creating new visual components, check this directory for an existing implementation to maintain consistency across the app. Only add new components when the required behavior or style cannot be covered by the existing ones.

## Getting started (quick reference)

1. Install dependencies where needed:
   - `backend/`: use `npm install`.
   - `frontend/`: use `npm install`.
2. Run development servers:
   - Backend: `npm run start:dev` inside `backend/`.
   - Frontend: `npm run dev` inside `frontend/`.

Adjust environment variables and secrets as described in the respective subdirectories when deploying or running locally.
