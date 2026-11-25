<h1 align="center">🎓 Campus Connect</h1>

<h3 align="center">A College Student Management & Communication Platform</h3>

<p align="center">
  Bringing student management, communication, and administrative operations together in one place.
</p>

<p align="center">
  <a href="https://campusconnect-edu.netlify.app">
    <img src="https://img.shields.io/badge/🌐_Live_Website-Visit_Campus_Connect-success?style=for-the-badge" alt="Live Website"/>
  </a>
  <a href="https://github.com/ritamxyz/CampusConnect">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" alt="Version 1.0"/>
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Completed"/>
  <img src="https://img.shields.io/badge/Project-Educational-orange?style=for-the-badge" alt="Educational Project"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/JavaScript-Language-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

---

## 📌 Table of Contents

- [🌟 About the Project](#-about-the-project)
- [🎯 Project Objectives](#-project-objectives)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🗄️ Database Structure](#️-database-structure)
- [⚠️ Current Limitations](#️-current-limitations)
- [🚀 Future Roadmap](#-future-roadmap)
- [📊 Project Information](#-project-information)
- [👨‍💻 Author](#-author)

---

## 🌟 About the Project

**Campus Connect** is a web-based platform designed to simplify student management and improve communication within a college environment.

The platform provides a centralized space where administrators can manage student records, students can access their profiles and interact through a shared Study Feed, and moderators can assist with platform management.

The primary objective is to bring essential student-related operations into a single, organized digital platform.

🌐 **Live Website:** [campusconnect-edu.netlify.app](https://campusconnect-edu.netlify.app)

💻 **Source Code:** [github.com/ritamxyz/CampusConnect](https://github.com/ritamxyz/CampusConnect)

### 🎯 Project Objectives

- Simplify student enrolment and record management.
- Provide convenient access to student information.
- Streamline student profile update requests.
- Improve communication through a centralized Study Feed.
- Provide separate dashboards for students, administrators, and moderators.

---

## ✨ Features

### 👨‍🎓 1. Student Portal

- Login using registered mobile number.
- Login using Student Code (DSC Code).
- Access personal student dashboard.
- View student profile information.
- Submit profile update requests.

### 📝 2. Student Management

- Individual student enrolment.
- Bulk student registration through Excel/CSV import.
- Centralized student record management.
- Student information viewing and administration.

### 📢 3. Study Feed

- Centralized student communication feed.
- Create and view posts.
- Manage posts through available administrative controls.
- Store posts using Firebase Firestore.

### 🛡️ 4. Moderator Dashboard

- Dedicated moderator login.
- Separate moderator interface.
- Access to available moderation controls.

### ⚙️ 5. Admin Dashboard

- Centralized administrative control panel.
- Individual and bulk student enrolment.
- Student record management.
- Review and approval of profile update requests.
- Admin profile management.
- Study Feed management.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend library |
| ⚡ Vite | Development server and build tool |
| 🎨 Tailwind CSS | UI styling |
| 📜 JavaScript | Application logic |
| 🔥 Firebase Firestore | Cloud database |
| 🐙 Git & GitHub | Version control |
| 🚀 Netlify | Deployment and hosting |

---

## 📂 Project Structure

```text
CampusConnect/
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── firebase/
│   ├── pages/
│   └── ...
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

Follow these instructions to run Campus Connect locally.

### 📋 Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A Firebase project with Cloud Firestore enabled

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ritamxyz/CampusConnect.git
```

### 2️⃣ Navigate to the Project Directory

```bash
cd CampusConnect
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Firebase

Create a `.env` file in the root directory of the project.

Add the following environment variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill in the values using your Firebase Web App configuration.

> 💡 The `.env` file is excluded from version control. Configure your own Firebase project and Firestore database before running the application.

### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

### 6️⃣ Generate a Production Build

```bash
npm run build
```

The production-ready files will be generated inside the `dist/` directory.

---

## 🗄️ Database Structure

Campus Connect uses **Firebase Cloud Firestore** for storing application data.

The V1.0 implementation uses the following collections:

| Collection | Description |
|---|---|
| `students` | Student records and profile information |
| `posts` | Study Feed posts |
| `profile_requests` | Student profile update requests |
| `moderators` | Moderator records |
| `settings` | Application and administrator settings |

---

## ⚠️ Current Limitations

This release preserves the original V1.0 architecture and authentication workflows.

Some improvements are intentionally deferred to future releases:

- Student-to-moderator promotion does not automatically provide separate moderator login credentials.
- The original hardcoded moderator login mechanism is retained.
- The current Firebase Firestore rules are configured for demonstration purposes, not production security.
- A complete production-grade authentication and authorization system has not yet been implemented.

> 🚨 **Security Notice**
>
> Campus Connect V1.0 is intended for educational and demonstration purposes. It uses fictional student records and should not be used to store actual institutional student information.
>
> The associated Firebase database has permissive access rules. Anyone with the necessary project configuration may be able to access or modify its data. Do not reuse this database for production or real student records.

---

## 🚀 Future Roadmap

Campus Connect will continue to evolve through separate development releases.

### 🔵 V1.0 — Initial Release

<details>
<summary><b>✅ Completed — Core Platform</b></summary>

- Original system restoration.
- Firebase Firestore integration.
- Student enrolment and bulk import.
- Student login using mobile number and DSC code.
- Profile update request and approval workflow.
- Study Feed.
- Admin and Moderator dashboards.
- Deployment on Netlify.

</details>

### 🟣 V2.0 — Functional Improvements

<details>
<summary><b>🔧 Planned — Feature Enhancements</b></summary>

- Student-to-moderator promotion and login integration.
- Improved account and role workflows.
- Additional functionality and refinements to existing features.

</details>

### 🔴 V3.0 — Security Upgrade

<details>
<summary><b>🔐 Planned — Security & Architecture</b></summary>

- Firebase Authentication integration.
- Proper role-based access control.
- Restrictive Firestore security rules.
- Improved credential management.
- Stronger data-access controls.
- Production-oriented security architecture.

</details>

---

## 📊 Project Information

| Detail | Information |
|---|---|
| Project Name | Campus Connect |
| Release | V1.0 |
| Project Type | Educational / College Project |
| Domain | Web Development |
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Deployment | Netlify |
| Status | Completed — Initial Release |

---

## 👨‍💻 Author

### Ritam Das

**B.Tech — Computer Science & Engineering**

Interested in web development, software engineering, and building practical applications.

- GitHub: [@ritamxyz](https://github.com/ritamxyz)
- Repository: [CampusConnect](https://github.com/ritamxyz/CampusConnect)

---

<p align="center">
  <b>🎓 Campus Connect V1.0</b>
  <br/>
  <i>Bringing essential college student management and communication into one platform.</i>
</p>

<p align="center">
  ⭐ If you find this project interesting, consider giving the repository a star!
</p>