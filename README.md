# GDG Club Recruitment Portal

A full-stack recruitment portal built for managing GDG Club applications, applicant responses, priorities, shortlisting, and recruitment analytics.

The project was developed with a focus on **UI/UX, backend reliability, authentication, data integrity, security, performance, and maintainability** rather than only visual improvements.

## Live Application

**Production:** <https://recruitment-portal-deploy.vercel.app>

---

## Overview

The GDG Club Recruitment Portal provides separate workflows for students and administrators.

### Student Workflow

Students can:

- Create an account using email/password or Google
- Verify their email when using email/password authentication
- Browse available departments
- Apply to a maximum of two departments
- Assign **Priority 1** and **Priority 2**
- Swap their department priorities before submission
- Complete department-specific application forms
- View their submitted applications and current status
- Receive email notifications related to their application

### Administrator Workflow

Administrators can:

- View submitted applications
- Search applicants by name, email, registration number, or department
- Filter applications by priority and shortlist status
- Inspect complete applicant responses
- Export application data as CSV
- View recruitment analytics
- Shortlist applicants
- Enforce a single final shortlisted department per student

---

## Key Improvements

The project was significantly improved across multiple areas:

- Stable UUID-based question identification
- Reliable Firestore response storage
- Transactional application submission
- Deterministic submission IDs
- Duplicate application prevention
- Maximum two-department application rule
- Priority 1 / Priority 2 selection
- Single final shortlist per student
- Student application status dashboard
- Admin search and filtering
- Recruitment analytics
- CSV export
- Email verification
- Password complexity validation
- Confirm-password validation
- Google OAuth
- Server-side authentication and authorization
- Server-side input validation
- Firestore security rules
- IDOR protection
- Performance optimizations
- Responsive UI
- Light and dark themes
- Accessibility improvements
- Improved admin response viewing

---

## Major Backend Improvement

One of the most important improvements involved how application responses were stored and identified.

Using question text directly as a database identifier is fragile because changing the wording of a question can make historical responses difficult to identify correctly.

The application now assigns each logical question a **stable UUID**. Responses are stored inside the Firestore `Questions` object using these stable identifiers. The UI resolves the identifiers back to human-readable question labels when displaying responses.

A compatibility layer is also retained so that legacy records using older question text can still be interpreted.

This separates **question identity** from **question presentation**.

For more details about the original problem, reasoning, implementation, and trade-offs, see [`WORK.md`](WORK.md).

---

## Application Submission Integrity

Application submissions are handled on the server. The server:

- Uses the authenticated user's email as the authoritative identity
- Validates and canonicalizes submitted fields
- Validates registration numbers and phone numbers
- Validates department identifiers
- Validates question responses
- Validates application priority
- Prevents unexpected fields from being persisted
- Enforces the maximum application limit
- Prevents duplicate applications
- Uses deterministic document IDs
- Uses Firestore transactions for atomic submission logic

The core application document is associated with the authenticated applicant and department rather than relying on client-provided identity information.

---

## Priority and Shortlisting

Students can apply to up to two departments. Their selections are ordered as:

- **Priority 1** — first choice
- **Priority 2** — second choice

The selection order can be swapped before submission.

On the administrator side, the portal enforces a single final shortlisted department per student. If one department is shortlisted:

- The student's other department becomes unavailable for shortlisting
- The UI immediately reflects the blocked state
- The administrator receives a conflict response if a conflicting shortlist is attempted

If the shortlist is removed, the other department becomes available again.

This keeps the recruitment state consistent with the rule that a student can ultimately be selected for only one department.

---

## Authentication and Authorization

Authentication is handled using **Better Auth**.

Supported authentication methods include:

- Email/password
- Google OAuth

Email/password accounts require email verification. Password requirements include:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

The application also provides:

- Confirm-password validation
- Password visibility controls
- Verification email flow
- Verification success/failure handling
- Session-based authentication

Authorization is enforced server-side. Administrator access is based on the authenticated user's server-side role and is not controlled by client-provided fields. Client attempts to provide fields such as `role`, `admin`, or related privilege fields are not trusted.

---

## Security

The application was designed so that sensitive operations remain server-side.

### Firestore

Firestore client access is denied by security rules. Database operations are performed through the Firebase Admin SDK on the server.

### API Authorization

Protected API routes validate the authenticated session before performing sensitive operations. Student-specific endpoints derive identity from the authenticated session rather than trusting arbitrary client-supplied email addresses. Administrator endpoints require administrator authorization.

### Input Validation

Important application fields are validated on the server before persistence. This prevents frontend-only validation from becoming the application's security boundary.

### Secrets

Credentials and secrets are never stored in the repository. Environment variables are used for:

- Firebase Admin credentials
- Better Auth
- SMTP
- Google OAuth

A `.env.example` file documents the required variable names without containing real credentials.

---

## Performance Improvements

Several unnecessary sources of client and server work were removed, including:

- Removal of unnecessary CPU-heavy loops
- Removal of unthrottled scroll work
- Removal of redundant data fetching
- Reduction of inefficient repeated lookups
- Improved React rendering through memoization and stable keys
- Debounced local draft persistence
- More efficient department processing
- Client-side filtering using linear passes for the current dataset size
- Avoidance of unnecessary charting dependencies
- Best-effort email sending separated from the core submission transaction
- Timeout protection for confirmation email delivery

The goal was to reduce unnecessary work without introducing premature infrastructure complexity.

---

## Student Dashboard

Students have access to an application status dashboard. The dashboard shows:

- Submitted departments
- Priority
- Application status
- Shortlist status
- Remaining application slots
- Legacy applications whose priority was never assigned

Existing records are not retroactively assigned priorities. Legacy applications therefore display **Not set** rather than having an inferred priority.

---

## Administrator Dashboard

The administrator interface includes:

### Applicant Search

Search across:

- Name
- Email
- Registration number
- Department

### Filters

Applications can be filtered by:

- Priority
- Shortlist status
- Department

### Analytics

The dashboard provides:

- Total applications
- Unique applicants
- Shortlisted applications
- Shortlist percentage
- Department-level application counts
- Priority distribution

### Response Viewer

Administrators can select an applicant and inspect their submitted responses with human-readable question labels.

### CSV Export

Application data can be exported for further analysis and recruitment workflows.

---

## Data Storage

The project uses **Google Cloud Firestore** as its database.

The main application data is stored in Firestore documents representing an applicant's application to a department. The system also uses Better Auth-related collections for authentication and session management. The architecture currently uses:

- `users`
- `accounts`
- `sessions`
- `formData`

Firestore is accessed through the Firebase Admin SDK from trusted server-side code.

For the current expected recruitment dataset size, the administrator workflow can efficiently operate on the application collection without introducing unnecessary database infrastructure. The architecture can be changed to indexed server-side querying or pagination if the dataset grows substantially.

---

## Technology Stack

### Frontend

- Next.js 14
- React 18
- Tailwind CSS
- Radix UI
- shadcn-style components
- Framer Motion
- React Hook Form
- Zod

### Backend

- Next.js App Router API routes
- Better Auth
- Firebase Admin SDK
- Google Cloud Firestore
- Nodemailer

### Authentication

- Email/password authentication
- Email verification
- Google OAuth
- Role-based administrator access

### Deployment

- Vercel
- Firebase / Google Cloud Firestore

---

## Architecture

```text
                        ┌──────────────────────┐
                        │       Student        │
                        │  Web Browser / UI    │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │       Next.js        │
                        │     App Router       │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┼───────────────┐
                    │              │               │
                    ▼              ▼               ▼
              Better Auth     API Routes      UI Components
                    │              │
                    │              ▼
                    │     Server-side validation
                    │      and authorization
                    │              │
                    └──────┬───────┘
                           ▼
                 ┌──────────────────────┐
                 │  Firebase Admin SDK  │
                 └──────────┬───────────┘
                            ▼
                 ┌──────────────────────┐
                 │   Google Cloud       │
                 │     Firestore        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     Nodemailer       │
                 │    Email / SMTP      │
                 └──────────────────────┘
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in `.env.local` using `.env.example` as the reference for the required variable names.

Start the development server:

```bash
npm run dev
```

The application will normally be available at `http://localhost:3000`.

---

## Verification

Before deployment, the project can be checked with:

```bash
npm run lint
npm run build
```

- `npm run lint` checks code quality and catches common issues before they reach production.
- `npm run build` produces a production build and helps catch compilation, routing, and server/client integration issues before deployment.

---

## Environment Variables

The application requires environment-specific credentials for:

- Firebase Admin
- Better Auth
- SMTP
- Google OAuth

Real credentials must never be committed to Git. The repository intentionally contains only `.env.example` for documenting the required variable names.

---

## Project Documentation

- **README.md** — high-level project overview (this file)
- [`WORK.md`](WORK.md) — detailed engineering documentation

`WORK.md` covers:

- Original implementation issues
- Backend response storage problem
- Stable question identifiers
- Authentication and authorization
- Security improvements
- Firestore architecture
- Submission integrity
- Performance optimizations
- UI/UX changes
- Priority and shortlist design
- Student dashboard
- Admin functionality
- Testing
- Deployment
- Design decisions and trade-offs

---

## Design Philosophy

The main goal of this project was not to add features for the sake of adding features. The implementation focuses on making the existing recruitment workflow:

- Reliable
- Secure
- Understandable
- Performant
- Maintainable
- Easy for students to use
- Useful for administrators

Particular attention was given to separating frontend presentation from backend data integrity, ensuring that important rules are enforced on the server rather than being dependent on the client interface.

---

## License

This project is licensed under the MIT License.

See [`LICENSE`](LICENSE) for details.