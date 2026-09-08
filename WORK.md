# WORK.md — GDG Club Recruitment Portal

## 1. Project Overview

This project is a recruitment portal for GDG Club applications.

The existing application was improved across the **frontend, backend, authentication, database architecture, security, performance, accessibility, and administrator workflows**.

The objective was not simply to add UI features. The existing implementation was analyzed to identify weaknesses and improve **reliability, security, performance, maintainability, and user experience** while preserving existing application data and workflows.

The application is deployed using **Vercel** and uses **Firebase Firestore** with the **Firebase Admin SDK** for server-side database access.

---

## 2. Technology Stack

### Frontend

- Next.js 14 App Router
- React 18
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- Framer Motion
- GSAP

### Backend

- Next.js Route Handlers
- Firebase Admin SDK
- Google Cloud Firestore
- Better Auth
- Nodemailer / Gmail SMTP

### Authentication

- Email/password authentication
- Mandatory email verification
- Google OAuth
- Role-based admin authorization
- Server-side session validation

### Deployment

- Vercel
- Firebase / Firestore

---

## 3. Architecture Improvements

The application was improved toward a **server-authoritative architecture**.

The browser does **not** directly read or write recruitment data in Firestore.

Instead, the flow is:

1. The client interacts with the Next.js application.
2. Authenticated requests reach protected server routes.
3. Server routes validate the authenticated session and request data.
4. The Firebase Admin SDK performs privileged Firestore operations.

Firestore client access is **deny-by-default**.

This creates a clear separation between:

- Client/UI state
- Authentication
- Authorization
- Server-side validation
- Database persistence

This also prevents users from bypassing application-level validation through direct Firestore access.

---

## 4. Major Backend Issue — Response Storage and Identification

One of the most important areas of the project was improving how application responses are stored and identified.

### Problem

The original response structure relied heavily on **question text** when identifying submitted answers.

Using question text as a database identifier is fragile because question wording is presentation data and can change over time. For example:

```text
Why do you want to join GDG Club?
```

could later become:

```text
Why do you want to join the GDG Club?
```

If the question text itself is used as the identifier, historical responses can become difficult to resolve reliably.

### Solution

Each logical question now has a **stable UUID**.

The universal question uses:

```text
09a6b635-d8f1-4ec5-96a9-fa89de59e74f
```

- The Firestore `Questions` object stores responses using stable question IDs.
- When responses are displayed, the application resolves those IDs back to human-readable question labels.
- A compatibility layer is also retained for legacy question text so older records can still be interpreted.

### Result

Question identity is now independent of question wording. This provides:

- Reliable response-to-question mapping
- Safer question wording changes
- Readable historical submissions
- More robust admin response viewing
- Cleaner and more predictable Firestore data

This was a key improvement to the response-storage and identification problem.

---

## 5. Submission Identification and Duplicate Prevention

Application documents use **deterministic identifiers** derived from the authenticated user's email and department.

Conceptually:

```text
submissionId = SHA-256(userEmail + department)
```

This means that the same student submitting to the same department maps to the same logical application document.

Submission creation uses a **Firestore transaction**. The transaction checks the current database state before creating the application.

This prevents:

- Duplicate applications to the same department
- Race-condition duplicates
- Exceeding the two-department application limit

The **maximum number of department applications is two**.

---

## 6. Authentication

### Email / Password Authentication

Password requirements were strengthened. Passwords must contain:

- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

The signup form also provides:

- Confirm-password validation
- Live password requirement feedback
- Password visibility toggle
- Matching-password validation

Password validation exists on **the server as well as the client**. The client therefore improves user experience, while the server remains the actual security boundary.

### Email Verification

Email verification is **mandatory** for email/password accounts.

Verification emails are sent through the configured SMTP provider.

A dedicated verification page provides:

- Verification success state
- Expired/invalid states
- Resend functionality
- Sign-in guidance
- Continuation after successful verification

### Google OAuth

Google authentication was added using **Better Auth's** Google social provider.

- Google sign-in works alongside email/password authentication.
- The server remains authoritative for user roles.

---

## 7. Role Escalation Protection

A client must never be trusted to decide whether it is an administrator.

Server-side authentication processing removes potentially dangerous client-supplied role fields such as:

- `role`
- `admin`
- `roles`
- `isAdmin`

before account processing.

This prevents a malicious client from attempting to register itself as an administrator by modifying the signup request. **Administrative access is controlled server-side.**

---

## 8. Authorization and IDOR Protection

Sensitive administrator routes verify:

- An authenticated session
- Administrator authorization

Student-specific endpoints derive the student's identity from the authenticated session. They do **not** trust a client-supplied email address to determine which student's data should be returned.

This prevents an **IDOR-style attack** where a user modifies a request parameter and attempts to retrieve another student's application data.

---

## 9. Firestore Security

- Firestore client access is **deny-by-default**.
- Privileged database operations are performed through the **Firebase Admin SDK** on the server.
- Firebase Admin credentials are never exposed to the browser.
- Sensitive deployment values are stored as environment variables.

The repository ignores local secrets and generated files, including:

```text
.env
.env*.local
.vercel
node_modules
.next
*.pem
```

An `.env.example` file is included only to document required environment variable names.

---

## 10. Input Validation and Data Integrity

Important application fields are validated on the server. Validation covers:

- Authenticated email
- Department
- Name
- Registration number
- Phone number
- Gender
- Question responses
- Priority

The server canonicalizes and sanitizes incoming values before persistence.

- The phone number is restricted to exactly **10 digits**.
- Registration numbers follow the expected format.
- Department values are validated against the allowed department set.
- Unexpected question fields are **not** blindly persisted.

This prevents clients from bypassing frontend validation by manually modifying network requests.

---

## 11. Department Application System

Students can apply to a **maximum of two departments**.

The order in which departments are selected determines their preference:

- **Priority 1** = First choice
- **Priority 2** = Second choice

Students can swap their priorities before submitting. The join form clearly displays the current priority.

---

## 12. Single Final Shortlist Selection

The recruitment workflow assumes that a student can ultimately be selected for only **one** department.

Therefore the shortlist system enforces **one final shortlist per student**.

If an administrator shortlists the student's Priority 1 application:

| Application | Resulting Status |
|---|---|
| Priority 1 | Shortlisted |
| Priority 2 | Unavailable |

If the administrator instead shortlists Priority 2:

| Application | Resulting Status |
|---|---|
| Priority 2 | Shortlisted |
| Priority 1 | Unavailable |

- The restriction is enforced **server-side** using a Firestore transaction.
- The API returns a conflict response if another application for the same student has already been shortlisted.
- Unshortlisting restores the other application's availability.
- The UI also reflects the server state by disabling the conflicting application.

This ensures that the rule cannot be bypassed simply by manipulating the frontend.

---

## 13. Legacy Priority Handling

Applications created before the priority feature were deliberately **not migrated**.

Their priority is displayed as:

```text
Not set
```

No priority is inferred from historical application order. Only newly submitted applications receive explicit **Priority 1** or **Priority 2** values.

This preserves historical data without silently changing its meaning.

---

## 14. Student Application Dashboard

A dedicated `/applications` page was added for authenticated students.

The dashboard provides an overview of the student's submitted applications. It displays:

- Department
- Priority
- Application status
- Shortlist status
- Remaining application slots
- Refresh functionality

The dashboard API derives the student's identity from the authenticated session. Only the minimum information required by the dashboard is returned.

---

## 15. Admin Search and Filtering

The administrator table was expanded with search and filtering functionality.

Administrators can search across:

- Name
- Email
- Registration Number
- Department

Additional filters include:

- Priority
- Shortlist status

A reset mechanism allows administrators to return to the complete dataset.

Existing table features were preserved, including:

- Sorting
- Row selection
- Response viewing
- Shortlist functionality
- CSV export

---

## 16. Admin Analytics

The administrator interface provides recruitment statistics including:

- Total applications
- Unique applicants
- Shortlisted applications
- Shortlist percentage
- Department breakdown
- Priority distribution

**Unique applicants** are calculated using authenticated email identity rather than simply counting application rows.

This distinction is important because one student can have two department applications. For example:

```text
1 student
    ↓
2 applications
    ↓
2 application rows
    ↓
1 unique applicant
```

This prevents applicant statistics from being incorrectly inflated.

---

## 17. CSV Export

- The administrator CSV export includes application priority.
- Human-readable department names are used for presentation instead of exposing internal department identifiers.

---

## 18. Department Identifier Presentation

The application internally uses stable/obfuscated department identifiers. These identifiers are useful for storage consistency but are not suitable for displaying to users.

A presentation mapping was added so that users see readable department names such as:

- Management
- Publicity
- Outreach
- UI/UX
- Design
- Web Dev
- App Dev
- Game Dev
- Data Science
- Cloud & DevOps
- Blockchain
- Competitive Programming

The internal identifiers remain an implementation detail.

---

## 19. Email System Improvements

Email-related operations were reviewed for reliability and performance.

- Verification emails are sent through the configured SMTP provider.
- After a successful application transaction, a submission confirmation email can be sent as a **best-effort operation**.
- The database transaction is independent from email delivery.

The flow is:

```text
Database transaction
        ↓
Application successfully stored
        ↓
Confirmation email attempted
```

Therefore an email-provider failure does **not** invalidate an otherwise successful application submission.

- Email content is escaped before being inserted into HTML.
- A timeout prevents a slow email operation from unnecessarily delaying the request.

---

## 20. Performance Improvements

Several unnecessary performance costs were removed.

### Artificial CPU Usage

Artificial CPU-heavy loops were removed from application code. These loops consumed processing resources without providing useful functionality.

### Scroll Processing

An unnecessary unthrottled scroll listener was removed.

### Data Processing

An **O(N²)** department-processing pattern was replaced with more efficient lookup logic.

### React Rendering

- Unnecessary effects and redundant data fetching were removed.
- Stable React keys and memoization were used where appropriate.

### Local Storage

Form draft persistence was **debounced** instead of writing to local storage on every change.

### Admin Filtering

Admin search, filtering, and analytics operate on the already-loaded dataset rather than creating additional Firestore reads for every filter interaction.

### Email Performance

Non-critical confirmation email work is separated from the core database transaction and protected with a timeout.

---

## 21. UI / UX Improvements

The interface was substantially refined. Improvements include:

- Responsive layouts
- Improved spacing
- Clearer typography
- Improved light theme
- Preserved dark theme
- Improved card styling
- Clearer form hierarchy
- Required/optional indicators
- Character counters
- Improved focus states
- Improved touch targets
- Responsive department selection
- Application status feedback
- Loading states
- Empty states
- Clearer administrator actions
- Clearer shortlist terminology

---

## 22. Accessibility Improvements

Accessibility-oriented improvements include:

- Visible keyboard focus states
- Semantic interactive elements
- Appropriate ARIA attributes
- Improved table interaction
- Reduced-motion consideration
- Clearer button states
- Accessible form feedback
- Improved touch target sizing

The administrator table also avoids ambiguous response selection by allowing only one applicant response to be actively viewed at a time.

---

## 23. Theme and Visual Improvements

The application supports both **light and dark themes**.

- The light theme was refined with cleaner backgrounds, borders, and slate-toned surfaces.
- Decorative particles were adjusted so the light theme uses subtle blue visual accents while the dark theme retains a lighter particle treatment.

The visual effects are intended to support the design without competing with recruitment content.

---

## 24. Admin Response Viewer

The administrator response viewer was improved to make submitted answers easier to inspect. It:

- Requires an applicant row to be selected
- Displays human-readable department information
- Displays question labels instead of internal question IDs
- Displays submitted answers
- Provides shortlist controls
- Handles empty states clearly

This is especially important because submitted responses are the primary information collected during recruitment.

---

## 25. Database and Storage Design

Firestore is used because the application's data is naturally document-oriented.

The main recruitment submission data is stored in `formData`.

- Application documents use deterministic IDs.
- Questions are stored as an object keyed by stable question IDs.

This keeps each application self-contained while avoiding unnecessary relational joins.

Privileged Firestore access is performed through the **Firebase Admin SDK**.

---

## 26. Firestore Indexing

Firestore configuration includes the indexes required by authentication and application queries.

The index configuration is stored with the project so the expected database configuration can be reproduced across environments.

---

## 27. Cost and Scalability Considerations

The application avoids unnecessary real-time listeners and repeated Firestore reads.

- Student dashboards retrieve only the authenticated student's applications.
- Admin filtering and analytics operate on the already-loaded dataset.

For the expected recruitment scale, loading the administrator application collection once and performing filtering client-side avoids repeated database reads during normal interaction.

If the dataset grows substantially, future improvements could include:

- Server-side pagination
- Aggregation documents
- Dedicated analytics storage
- More targeted Firestore queries

---

## 28. Testing and Verification

The project was repeatedly verified using linting and production builds.

The primary checks are:

```bash
npm run lint
npm run build
```

Production testing covered:

- Account creation
- Password validation
- Email verification
- Email/password sign in
- Google sign in
- Department selection
- Two-department application flow
- Priority assignment
- Priority swapping
- Duplicate application prevention
- Application submission
- Student application dashboard
- Administrator authentication
- Administrator response viewing
- Administrator search
- Administrator filtering
- CSV export
- Shortlist behaviour
- Single-student shortlist restriction
- Unshortlisting
- Light theme
- Dark theme

---

## 29. Deployment

The application is deployed on **Vercel**.

Production secrets are stored as Vercel environment variables rather than committed to the source repository.

Sensitive values include:

- Firebase Admin credentials
- Better Auth secret
- SMTP credentials
- Google OAuth credentials

These values are not included in GitHub.

Production application:

<https://recruitment-portal-deploy.vercel.app>

---

## 30. Development Data Cleanup

Development and test application records were removed from the final Firebase environment.

The final database was intentionally kept clean rather than leaving test applicants and submissions for evaluators.

The administrator account was retained so the club can directly inspect the administrative workflow.

---

## 31. Important Design Decisions

### Why server-side validation?

Frontend validation improves user experience but cannot be trusted for security. A user can manually modify requests. Therefore security-sensitive validation is repeated on the server.

### Why deterministic application IDs?

They provide stable identity for **student + department** and simplify duplicate prevention.

### Why Firestore transactions?

Two simultaneous requests could otherwise both pass a duplicate check before either write occurs. Transactions make the check-and-write operation atomic.

### Why stable question IDs?

Question wording is presentation data. Question identity should not depend on wording.

### Why preserve legacy priorities?

Automatically guessing historical priorities would change the meaning of existing records. Historical records are therefore left untouched and displayed as `Not set`.

### Why enforce shortlist rules on the server?

Disabling a button in the UI is not a security or integrity guarantee. The server transaction provides the actual enforcement.

---

## 32. Future Improvements

Potential future improvements include:

- Real-time application status updates
- Server-side pagination for very large datasets
- Dedicated aggregate analytics at larger scale
- Additional HTTP security headers
- Regular dependency patch upgrades
- Further cleanup of unused legacy components
- Stricter controls on bulk administrative email operations

These are future hardening and scaling opportunities rather than requirements for the current recruitment workflow.

---

## 33. Interview / Evaluation Preparation

The following areas are particularly important to understand and explain during evaluation.

### Backend

- How application responses are stored
- How questions are identified
- Why stable UUIDs are used
- Why deterministic application IDs are used
- Why transactions are required
- How duplicate applications are prevented
- How the two-application limit is enforced

### Security

- Why Firestore client access is denied
- Why Firebase Admin SDK is server-side only
- How authentication is enforced
- How administrator authorization works
- How role escalation is prevented
- How IDOR is prevented
- Why frontend validation alone is insufficient

### Performance

- Which unnecessary CPU operations were removed
- How redundant reads were reduced
- Why administrator filtering is client-side at the current scale
- Why local-storage writes are debounced
- Why email sending is separated from the core transaction

### Data and Storage

- Why Firestore was retained
- How application documents are structured
- Why deterministic IDs are useful
- How stable question IDs solve the response-identification problem
- How legacy records are preserved
- What architectural changes would be appropriate at much larger scale

### UI / UX

- Why applications have priorities
- Why only one final shortlist is allowed
- How UI state reflects server state
- How student and administrator workflows differ
- Accessibility and responsive-design decisions

---

## 34. Final Result

The project evolved from a basic recruitment application into a more robust recruitment workflow with:

- Secure authentication
- Mandatory email verification
- Google OAuth
- Server-authoritative authorization
- Protected Firestore access
- Stable question identification
- Transactional submission storage
- Duplicate prevention
- Two-department application support
- Priority 1 / Priority 2 selection
- Single final shortlist enforcement
- Student application tracking
- Administrator search and filtering
- Recruitment analytics
- CSV export
- Improved email reliability
- Responsive UI/UX
- Light/dark themes
- Accessibility improvements
- Performance optimizations
- Production deployment

The implementation focuses on **correctness, security, maintainability, performance, and explainable engineering decisions** rather than only visual changes.