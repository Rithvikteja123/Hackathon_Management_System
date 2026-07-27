# ◈ CoBuild — Complete & Comprehensive Technical Overview

**CoBuild** is a production-level, multi-role SaaS Hackathon Management Platform built on the MERN stack (MongoDB, Express.js, React 18, Node.js). 

It replaces fragmented third-party tools (Google Forms, WhatsApp/Telegram groups, Excel sheets, Google Drive, and Discord servers) with a unified, high-contrast monochrome digital workspace for **Participants**, **Organizers**, **Judges**, and **Platform Administrators**.

---

## 🌟 1. Executive Summary & Value Proposition

Traditional hackathon management is fragmented:
- **Organizers** track team registrations in spreadsheets and distribute submission links via emails.
- **Participants** struggle with team formation, finding teammates, and submitting project links across multiple forms.
- **Judges** score projects in manual Google Sheets or paper rubrics, leading to delays and scoring discrepancies.
- **Admins** lack global analytics and system-wide visibility.

**CoBuild** solves this by providing:
- **End-to-End Workflow Integration**: From hackathon creation, team formation, application approvals, project submissions, and judge scoring to real-time leaderboard aggregation and winner announcements.
- **Role-Based Workflows**: Tailored user interfaces for `admin`, `organizer`, `participant`, and `judge`.
- **Global Group Chat**: Real-time public discussion forum with role badges and team identification.
- **Monochrome SaaS Design System**: Sharp-edged, high-contrast, light-mode interface with zero visual fluff and smooth responsiveness.

---

## 🛠️ 2. Technology Stack Architecture

### **Frontend Architecture**
- **Framework**: React 18 powered by Vite for instant hot-module reloading.
- **Routing**: React Router DOM with `ProtectedRoute` guards verifying JWT tokens and role authorizations.
- **Styling**: Tailwind CSS v4 with a custom monochrome design system (`index.css`) featuring sharp borders (`border-radius: 0`), bold offset drop-shadows (`box-shadow: 3px 3px 0px #000`), and curated HSL color tokens.
- **Animations**: Framer Motion for page transitions, tab switches, and modal/drawer slide-ins.
- **Form Management & Validation**: React Hook Form coupled with Zod schema validation.
- **Data Visualization**: Recharts for platform statistics and analytics bar charts.
- **API Client**: Axios instance with request/response interceptors attached to `localStorage` Bearer tokens.
- **Notifications**: React Hot Toast for non-intrusive feedback toasts.

### **Backend Architecture**
- **Runtime**: Node.js with Express.js REST API.
- **Database & ODM**: MongoDB Atlas with local MongoDB fallback (`mongodb://127.0.0.1:27017/hacklytics`) via Mongoose ODM.
- **Authentication & Security**:
  - `jsonwebtoken` (JWT) with HTTP-only cookie support.
  - Password hashing with `bcryptjs`.
  - Role-based middleware (`authMiddleware.js` and `roleMiddleware.js`).
  - Dynamic CORS header resolution allowing multi-origin local development (`http://localhost:5173`, `http://localhost:5174`, `127.0.0.1`).
- **File Storage**: Multer + Cloudinary storage engine (`multer-storage-cloudinary`) for banner images, user avatars, screenshots, and PDF submissions.
- **Email Service**: Nodemailer for automated email notifications (approval/rejection alerts).

---

## 👥 3. Detailed Role-Based Workflows & Modules

```
                              ┌────────────────────────┐
                              │  CoBuild Platform      │
                              └───────────┬────────────┘
                                          │
    ┌──────────────────┬──────────────────┼──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼                  ▼
┌────────┐       ┌───────────┐     ┌─────────────┐       ┌───────┐      ┌───────────────┐
│ Public │       │ Admin     │     │ Organizer   │       │ Judge │      │ Participant   │
│ Module │       │ Suite     │     │ Studio      │       │ Suite │      │ Workspace     │
└────────┘       └───────────┘     └─────────────┘       └───────┘      └───────────────┘
```

### 🔐 A. Authentication & User System (`/login`, `/signup`, `/profile`)
- **JWT Authentication**: Users authenticate with email/password to receive a signed JWT token.
- **Role Selection**: During registration, users choose their default role (`participant`, `organizer`, or `judge`). Admin accounts are promoted via system procedures.
- **User Profile Studio** (`/profile`): Users can edit their bio, skills list, GitHub/LinkedIn links, portfolio URL, update their avatar, and change passwords.

---

### 🛡️ B. Administrator Suite (`/admin`)
Designed for platform owners to audit operations, monitor platform health, and enforce community standards.

1. **Admin Dashboard & Analytics** (`/admin`, `/admin/analytics`):
   - Overview metrics: Total Users, Total Hackathons, Total Teams, Total Submissions, Total Registrations.
   - Interactive Recharts visual graphs:
     - User Distribution by Role (Bar chart).
     - Hackathon Distribution by Mode & Status.
   - Recent Registrations audit feed.
2. **User Management** (`/admin/users`, `/admin/organizers`, `/admin/judges`, `/admin/participants`):
   - Full tabular directory with role-filtered views.
   - Capability to toggle account status (`Active` / `Blocked`) and permanently delete accounts.
3. **Hackathons & Teams Oversight** (`/admin/hackathons`, `/admin/teams`):
   - Administrative power to inspect and remove any hackathon or team on the platform.

---

### 🎪 C. Organizer Suite (`/organizer`)
Designed for hackathon hosts, universities, and organizations.

1. **Organizer Dashboard** (`/organizer`):
   - Summary cards of organized hackathons, team applications, submitted projects, and assigned judges.
   - Quick action shortcuts to create hackathons and review applications.
2. **Hackathon Studio / Creation Wizard** (`/organizer/create-hackathon`):
   - Form for title, tagline, description, mode (`Online`, `Offline`, `Hybrid`), venue/location, registration deadline, start/end dates, team size limits, and prize pool.
   - Custom Judging Criteria Builder: Organizers define evaluation dimensions (e.g., *Innovation*, *Technical Complexity*, *UI/UX Design*, *Pitch*) and assign max points to each.
3. **Hackathon Management Hub** (`/organizer/manage/:id`):
   - **Registrations Tab**: View incoming team applications, inspect team member details, and approve or reject teams with custom rejection reasons (triggers email alerts).
   - **Submissions Tab**: Inspect submitted projects, review GitHub links, live demos, and assign certified judges to evaluate specific projects.
   - **Judges Tab**: Add/remove judges assigned to evaluate the hackathon.
   - **Announce Winners Tab**: Publish evaluations and publicly crown 1st, 2nd, and 3rd place winners.

---

### 🚀 D. Participant Workspace (`/participant`)
Designed for developers, designers, and hackers competing in hackathons.

1. **Participant Dashboard** (`/participant`):
   - Tracks registered hackathons, active team memberships, project submission status, and official results.
2. **Hackathon Discovery Hub** (`/hackathons`, `/hackathons/:id`):
   - Browse active, upcoming, and completed hackathons with mode filters and search.
   - View details, criteria, prizes, schedule, and team size limits.
3. **Team Management Studio** (`/participant/team`):
   - Create a team or join an existing team via a unique Invite Code.
   - Invite teammates by email/user ID.
   - Accept or decline team invitations.
   - Leadership controls: Transfer team leadership or leave team.
4. **Project Submission Studio** (`/participant/submission`):
   - Form to submit Project Name, Tagline, Problem Statement, Detailed Solution Description, Tech Stack tags, GitHub Repository link, Live Demo URL, Video Demo URL, and screenshot attachments.
   - Edit submissions before the deadline expires.
5. **Results & Feedback View** (`/participant/results`):
   - View final evaluation scores and written feedback notes from judges once announced.

---

### ⚖️ E. Judge Suite (`/judge`)
Designed for mentors and industry experts evaluating hackathon projects.

1. **Judge Dashboard** (`/judge`):
   - Metrics showing assigned projects, pending evaluations, and completed evaluations.
2. **Project Reviewing Interface** (`/judge/review/:submissionId`):
   - Detailed project view: Read problem statement, solution description, tech stack, open GitHub repo, and watch demo videos.
   - **Criterion Scoring Sliders**: Real-time range sliders with progress bars for each custom evaluation dimension defined by the organizer.
   - Overall written feedback & recommendation notes.
3. **Completed Reviews** (`/judge/completed`):
   - History of all completed evaluations with ability to edit scores before the evaluation period closes.

---

### 🏆 F. Live Public Leaderboard (`/leaderboard`)
- **Real-Time Aggregation Pipeline**: Uses MongoDB aggregation pipelines to calculate the average score for each project across all evaluating judges.
- **Top 3 Podium Display**: Interactive podium cards highlighting 1st Place (Gold), 2nd Place (Silver), and 3rd Place (Bronze) with project links and score points.
- **Full Rankings Table**: Searchable, filterable leaderboard listing all teams ranked by score.

---

### 💬 G. Global Group Chat Drawer
- **Persistent Header Button**: Accessible from the navbar across all pages for authenticated users.
- **Unread Badge Counter**: Bouncing badge indicator highlighting new unread messages.
- **Role & Team Identification**: Messages display color-coded role tags (`[ADMIN]`, `[ORGANIZER]`, `[JUDGE]`, `[PARTICIPANT]`) and participant team names.
- **Auto-Scroll & Polling**: Periodically fetches updates while open and auto-scrolls to new messages.

---

## 🗄️ 4. Data Models & Database Schemas

```
┌──────────────┐         ┌─────────────────┐         ┌──────────────┐
│     User     │◄───────┤    Hackathon    ├────────►│     Team     │
└──────┬───────┘         └────────┬────────┘         └──────┬───────┘
       │                          │                         │
       │                 ┌────────┴────────┐                │
       └────────────────►│  Registration   │◄───────────────┘
                         └─────────────────┘
                                  │
                         ┌────────┴────────┐
                         │   Submission    │
                         └────────┬────────┘
                                  │
                         ┌────────┴────────┐
                         │     Review      │
                         └─────────────────┘
```

1. **User**: `name`, `email`, `password`, `role` (`admin`/`organizer`/`participant`/`judge`), `avatar`, `bio`, `skills`, `github`, `linkedin`, `portfolio`, `isBlocked`.
2. **Hackathon**: `title`, `tagline`, `description`, `banner`, `mode` (`online`/`offline`/`hybrid`), `venue`, `startDate`, `endDate`, `registrationDeadline`, `minTeamSize`, `maxTeamSize`, `prizePool`, `criteria` `[{ name, maxPoints }]`, `status` (`draft`/`open`/`in_progress`/`under_review`/`completed`), `organizer` (ref `User`), `judges` (array of ref `User`), `winners` `[{ rank, team, submission }]`.
3. **Team**: `name`, `leader` (ref `User`), `members` (array of ref `User`), `hackathon` (ref `Hackathon`), `inviteCode`.
4. **Registration**: `team` (ref `Team`), `hackathon` (ref `Hackathon`), `status` (`pending`/`approved`/`rejected`), `rejectionReason`, `registeredAt`.
5. **Submission**: `team` (ref `Team`), `hackathon` (ref `Hackathon`), `projectName`, `tagline`, `problemStatement`, `solutionDescription`, `techStack` `[String]`, `githubRepo`, `liveDemoUrl`, `videoUrl`, `attachments` `[String]`, `status` (`submitted`/`under_review`/`evaluated`/`winner`).
6. **Review**: `judge` (ref `User`), `submission` (ref `Submission`), `hackathon` (ref `Hackathon`), `scores` `[{ criterionName, score, maxPoints }]`, `totalScore`, `comments`, `completedAt`.
7. **Message**: `sender` (ref `User`), `content`, `senderRole`, `senderName`, `teamName`, `createdAt`.

---

## 🎨 5. Design System & Aesthetics

- **Theme Palette**: Pure white background (`#ffffff`), pitch black text (`#09090b`), light grey surfaces (`#f4f4f5`), and indigo/purple accents.
- **Brutalist Sharp Edges**: All buttons, inputs, cards, and modals use zero border radius (`border-radius: 0 !important`) for a crisp SaaS look.
- **Bold Offset Shadows**: Buttons and cards use hard pixel drop-shadows (`box-shadow: 3px 3px 0px #000000`).
- **Responsive Layout**:
  - Full support for desktop, tablet, and mobile screens.
  - Off-canvas slide-out navigation drawer on mobile with background blur backdrop.
  - Horizontal scroll wrappers (`overflow-x-auto`) for all data tables.

---

## 📡 6. Complete API Endpoint Reference

| Method | Endpoint | Description | Auth Required | Roles |
|---|---|---|---|---|
| **POST** | `/api/auth/register` | Register new account | No | All |
| **POST** | `/api/auth/login` | User login | No | All |
| **GET** | `/api/auth/me` | Get active user profile | Yes | All |
| **POST** | `/api/auth/logout` | Clear auth cookies | Yes | All |
| **GET** | `/api/users` | Get all users list | Yes | Admin |
| **PATCH**| `/api/users/:id/toggle-block` | Block/unblock account | Yes | Admin |
| **DELETE**| `/api/users/:id` | Delete user account | Yes | Admin |
| **GET** | `/api/hackathons` | Public hackathons directory | No | All |
| **GET** | `/api/hackathons/:id` | Hackathon details | No | All |
| **POST** | `/api/hackathons` | Create new hackathon | Yes | Organizer/Admin |
| **PUT** | `/api/hackathons/:id` | Update hackathon | Yes | Organizer/Admin |
| **POST** | `/api/hackathons/:id/judges` | Assign judge to hackathon | Yes | Organizer/Admin |
| **POST** | `/api/hackathons/:id/announce-winners` | Publish winners | Yes | Organizer/Admin |
| **POST** | `/api/teams` | Create a team | Yes | Participant |
| **POST** | `/api/teams/join` | Join team via invite code | Yes | Participant |
| **GET** | `/api/teams/my-team` | Get user's active team | Yes | Participant |
| **POST** | `/api/registrations` | Register team for hackathon | Yes | Participant |
| **PATCH**| `/api/registrations/:id/status` | Approve/Reject application | Yes | Organizer/Admin |
| **POST** | `/api/submissions` | Submit project | Yes | Participant |
| **GET** | `/api/submissions/hackathon/:id` | Get hackathon submissions | Yes | Organizer/Judge/Admin |
| **POST** | `/api/reviews` | Submit project evaluation | Yes | Judge |
| **GET** | `/api/leaderboard/:hackathonId` | Get live rankings | No | All |
| **GET** | `/api/messages` | Get global group chat | Yes | All |
| **POST** | `/api/messages` | Send message in chat | Yes | All |

---

## ⚡ 7. Project Execution Commands

```bash
# Start Backend Express API (Port 5001)
npm run dev

# Start Frontend Vite Dev Server (Port 5174)
npm run dev:client

# Production Build Verification
```
