CoBuild — Hackathon Management Platform

CoBuild is a full-stack Hackathon Management Platform built using the MERN stack (MongoDB, Express.js, React, and Node.js). It brings together the complete hackathon lifecycle into a single application, replacing multiple disconnected tools used for registrations, team management, project submissions, judging, and result announcements.

The platform provides dedicated workspaces for participants, organizers, judges, and administrators, making hackathon management more structured, transparent, and efficient.

Overview

CoBuild simplifies the complete hackathon workflow by allowing organizers to create events, participants to register and form teams, judges to evaluate projects, and administrators to manage the platform from a single dashboard.

The platform includes role-based authentication, project submission management, live leaderboard generation, analytics, and a global discussion space.

Features
Role-based authentication for Admin, Organizer, Judge, and Participant
Hackathon creation and management
Team creation, invitations, and member management
Project submission with GitHub, live demo, and video links
Judge assignment and evaluation system
Dynamic scoring using organizer-defined judging criteria
Live leaderboard with ranking and winner announcements
Global discussion board for participants and organizers
Platform analytics and administrative controls
Responsive interface for desktop, tablet, and mobile devices
Technology Stack
Frontend
React 18
Vite
React Router DOM
Tailwind CSS
Framer Motion
React Hook Form
Zod
Axios
Recharts
React Hot Toast
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
Multer
Cloudinary
Nodemailer
User Roles
Administrator
View platform analytics
Manage users
Block or delete accounts
Monitor hackathons and teams
Access overall platform statistics
Organizer
Create hackathons
Manage registrations
Approve or reject teams
Assign judges
Review submissions
Announce winners
Participant
Browse hackathons
Register for events
Create or join teams
Submit projects
View scores and feedback
Judge
View assigned submissions
Evaluate projects
Score projects based on custom criteria
Provide written feedback
Main Modules
Authentication
User Registration
Login
JWT Authentication
User Profile
Password Update
Hackathon Management
Create Hackathons
Edit Hackathons
Registration Management
Judge Assignment
Winner Announcement
Team Management
Team Creation
Invite Members
Join via Invite Code
Leadership Transfer
Team Invitations
Project Submission
Project Details
GitHub Repository
Live Demo
Demo Video
Screenshots
Edit Before Deadline
Judge Portal
Assigned Projects
Evaluation Form
Custom Scoring Criteria
Feedback Notes
Review History
Leaderboard
Live Ranking
Average Score Calculation
Winner Podium
Searchable Rankings
Group Chat
Global Discussion
Role Badges
Team Identification
Unread Message Counter
Database Models
User
Name
Email
Password
Role
Avatar
Bio
Skills
GitHub
LinkedIn
Portfolio
Account Status
Hackathon
Title
Description
Banner
Mode
Venue
Dates
Registration Deadline
Team Size
Prize Pool
Judging Criteria
Assigned Judges
Winners
Team
Team Name
Leader
Members
Hackathon
Invite Code
Registration
Team
Hackathon
Status
Rejection Reason
Registration Date
Submission
Team
Project Name
Problem Statement
Solution
Tech Stack
GitHub Link
Live Demo
Video Demo
Attachments
Review
Judge
Submission
Scores
Total Score
Comments
Review Date
Message
Sender
Role
Team
Content
Timestamp
API Overview
Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
User Management
GET /api/users
PATCH /api/users/:id/toggle-block
DELETE /api/users/:id
Hackathons
GET /api/hackathons
GET /api/hackathons/:id
POST /api/hackathons
PUT /api/hackathons/:id
POST /api/hackathons/:id/judges
POST /api/hackathons/:id/announce-winners
Teams
POST /api/teams
POST /api/teams/join
GET /api/teams/my-team
Registrations
POST /api/registrations
PATCH /api/registrations/:id/status
Submissions
POST /api/submissions
GET /api/submissions/hackathon/:id
Reviews
POST /api/reviews
Leaderboard
GET /api/leaderboard/:hackathonId
Messages
GET /api/messages
POST /api/messages
Design System
Clean monochrome interface
High-contrast light theme
Sharp-edged components
Responsive layout
Mobile-friendly navigation
Consistent typography
Reusable component library
Project Structure

CoBuild/

backend/

controllers/
middleware/
models/
routes/
services/
utils/

frontend/

components/
pages/
layouts/
hooks/
services/

uploads/

README.md

ARCHITECTURE.md

DEPLOYMENT.md

Running the Project
Backend

npm install

npm run dev

Frontend

npm install

npm run dev

Future Improvements
Real-time notifications using Socket.IO
Calendar integration
Certificate generation
QR code check-in
AI-assisted project recommendations
Team matching based on skills
Plagiarism detection
Advanced analytics dashboard
