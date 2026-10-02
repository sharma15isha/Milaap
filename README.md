# Milaap — Student Innovation & Collaboration Platform

Milaap is a **Student Innovation & Collaboration Platform** designed to bring hackathons, innovation events, team formation, project submissions, evaluations, and student progress into one centralized platform.

It helps students discover opportunities, connect with teammates based on skills, participate in events, submit projects, and track their learning journey — while providing organizers and judges with dedicated tools to manage events and evaluate submissions.

---

## Overview

In colleges, information about hackathons and innovation events is often distributed across multiple channels such as WhatsApp groups, notices, and separate forms. Students may also find it difficult to discover suitable teammates, manage submissions, and track their performance.

**Milaap** addresses these challenges through a centralized platform with role-based access for:

* Students
* Organizers
* Judges
* Administrators

The platform combines event management, collaboration, project submission, evaluation, leaderboards, and student development features in a single system.

---

## Key Features

### Student

* Browse available innovation events and hackathons
* Register for events
* Create and manage teams
* Find potential teammates based on skills
* Send and receive team invitations
* Submit projects
* Add GitHub repository links
* View project and evaluation information
* Track performance and progress
* Access personalized learning information
* View skill-gap information
* Explore the Winner's Playbook
* View event leaderboards

### Organizer

* Create and manage events
* Define event details and requirements
* Monitor registrations
* Manage participating teams
* View submitted projects
* Track event activities through an organizer dashboard

### Judge

* Access assigned events
* Review submitted projects
* Evaluate projects
* Provide scores and evaluation information
* View relevant project and team details

### Administrator

* Dedicated administrator login
* Manage platform-level activities
* Monitor users and platform data
* Manage events and system information

---

## Team Formation

Milaap includes a **skill-based team formation system** to help students find suitable collaborators.

The system considers available student information such as:

* Skills
* Areas of interest
* Experience
* Team requirements

This helps students discover potential teammates instead of depending entirely on existing personal networks.

---

## Student Development

Milaap goes beyond event participation by providing features that help students understand and improve their progress.

### Learning Journey

Students can track their participation and development through their learning journey.

### Skill Gap Analysis

The platform provides information that can help students identify areas where they may need further improvement.

### Performance Analysis

Students can review relevant performance information from their participation and evaluations.

### Winner's Playbook

The Winner's Playbook provides a dedicated space for learning from successful project and innovation experiences.

---

## Project Submission & Evaluation

Students can submit their projects through the platform along with relevant project information and GitHub repository links.

Judges can access submissions through their dashboard and evaluate projects according to the event's evaluation process.

Evaluation data can then be reflected in relevant performance and leaderboard sections.

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT-based authentication
* Role-based authorization
* Protected routes

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## Project Structure

```text
MILAAP/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── judge/
│   │   │   ├── organizer/
│   │   │   └── student/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── package.json
└── README.md
```

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │      Milaap UI       │
                    │    React + Vite      │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication     Business Logic    Role Control
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │       Database       │
                    └──────────────────────┘
```

---

## User Roles

| Role          | Main Responsibilities                                         |
| ------------- | ------------------------------------------------------------- |
| **Student**   | Events, teams, submissions, profile, learning and performance |
| **Organizer** | Event creation and management                                 |
| **Judge**     | Project evaluation and scoring                                |
| **Admin**     | Platform administration and management                        |

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sharma15isha/Milaap.git
```

```bash
cd Milaap
```

> The main application code is located inside the `MILAAP` directory.

```bash
cd MILAAP
```

---

## Backend Setup

Open a terminal inside the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a reference.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` if required.

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL shown by Vite, typically:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend

Frontend environment variables should be configured according to the API configuration used by the application.

**Never commit actual `.env` files or secret credentials to GitHub.**

---

## API Modules

The backend is organized into separate modules for maintainability.

```text
Authentication
    │
    ├── Auth
    ├── Admin
    ├── Students
    ├── Events
    ├── Teams
    ├── Invitations
    ├── Projects
    ├── Evaluations
    ├── Leaderboard
    ├── Notifications
    └── Performance
```

---

## Security

Milaap implements several application-level security mechanisms:

* JWT authentication
* Protected API routes
* Role-based authorization
* Separate administrator access
* Environment-based configuration
* Password authentication handling
* Restricted access to role-specific dashboards

---

## Future Scope

The platform can be further extended with:

* AI-based teammate recommendations
* Personalized event recommendations
* Advanced project analytics
* Improved skill matching
* Automated project insights
* Notifications and reminders
* Institution-level analytics
* Expanded collaboration features

---

## Project Goals

Milaap aims to create a centralized environment where students can:

**Discover → Collaborate → Build → Submit → Compete → Learn**

The platform brings the complete innovation-event journey into one place while connecting students, organizers, judges, and administrators.

---

## Contributing

Contributions and suggestions are welcome.

To contribute:

```bash
git clone https://github.com/sharma15isha/Milaap.git
```

Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

Make your changes and commit them:

```bash
git add .
git commit -m "Add: your feature"
```

Push the branch:

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request.

---

## License

This project is developed as an academic/project initiative.

---

## Author

**Isha Sharma**

GitHub: [@sharma15isha](https://github.com/sharma15isha)

**Aditi**

GitHub: [@aditiis07](https://github.com/aditiis07)


---

## Milaap

**A centralized platform for student innovation, collaboration, and growth.**
