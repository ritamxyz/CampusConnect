# Campus Connect | Academic & Student Networking Portal

Campus Connect is a React-based academic and student networking portal developed as my **1st Year, 1st Semester college project**.

The platform is designed to bring students, academic resources, college announcements, and student networking into one centralized digital environment. It combines a roster-verified student directory, academic materials and posts, direct WhatsApp connectivity, and an administrative dashboard for managing student records and portal content.

**Live Website:** https://campusconnect-surtech.netlify.app/

---

## About the Project

College information and student communication are often spread across different platforms, groups, and sources. Finding relevant academic materials, keeping up with important notices, or connecting with classmates can become inconvenient.

Campus Connect aims to make this process more organized by providing a centralized platform for college students to access academic updates and discover verified classmates.

One of the main ideas behind the project is to maintain a controlled student networking environment. The student directory is not intended to be publicly accessible to everyone. Access is restricted to students whose information has been registered in the portal's student database.

The project combines academic information sharing, student discovery, communication, and basic administrative management into a single web application.

---

## Features

### Home Page

A landing page introducing the platform and its purpose.

- Modern, dark-themed interface.
- Navigation to the major sections of the portal.
- Overview of the platform's features.
- Quick access to student networking and academic materials.
- Responsive interface for different screen sizes.

### Materials & Posts

A centralized feed for academic resources, announcements, and campus-related information.

- Browse study materials and academic posts.
- Access important notices and lecture notes.
- Discover campus events and activities.
- Search posts using keywords, subjects, or authors.
- Filter content using post categories.
- View shared resources, descriptions, and relevant links.

### Roster-Verified Student Access

The student directory uses a controlled access system based on the college student roster.

- Only students whose details have been added to the portal's student database are eligible for student access.
- Student authentication uses registered information such as their mobile number or college ID/DSC code.
- Unregistered students cannot access the student directory simply by entering random credentials.
- Student directory access remains locked until valid student authentication.
- Helps keep the directory restricted to the intended college student community.

This system is designed to reduce unauthorized access and keep student networking within a roster-based environment.

### Student Directory

A searchable directory for discovering classmates and exploring available student information.

- Search using student name, roll number, mobile number, or DSC code.
- Filter students by department or academic stream.
- View student profile cards and available institutional details.
- Access section, group, and faculty mentor information where available.
- Discover classmates through the college roster.
- Connect directly with students using WhatsApp.

### WhatsApp Networking

Makes student-to-student communication easier through direct WhatsApp connectivity.

- Connect with classmates directly from the student directory.
- Open WhatsApp conversations through available contact links.
- Find students without manually searching through multiple groups.
- Simplify networking within the college community.

### Campus Notices & Events

The portal supports sharing important college-related information.

- Campus event announcements.
- Important academic dates and notices.
- Examination-related updates.
- Student activities and event posts.
- Shared information and links relevant to the college community.

### Content Moderation

A moderation-oriented workflow for handling campus posts and submissions.

- Review pending content before publication.
- Manage the moderation queue.
- View published/live posts.
- Remove inappropriate or outdated content.
- Keep campus information more organized and controlled.

### Admin Dashboard

A dedicated administrative interface for managing the portal.

The admin dashboard includes different management sections:

- **Posts & Queue** — Review submissions, moderation queue, and published content.
- **Profile Updates** — Review submitted student profile update requests.
- **Roster & Moderators** — Manage student records and moderator privileges.
- **Add / Import** — Add individual students or import roster data in bulk.
- **Profile & Footer** — Manage administrative profile and website footer information.
- **Security** — Update administrative login credentials.

### Student Roster Management

Tools for maintaining the student database used throughout the portal.

- Add student records manually.
- Import student records from Excel or CSV files.
- Process roster data using the `xlsx` package.
- Manage student names, college ID/DSC codes, mobile numbers, departments, sections, groups, and mentor information.
- Maintain the roster used for student authentication and directory information.

### Firebase Firestore Synchronization

Firebase Firestore provides cloud database functionality for the application.

- Cloud-based storage of student roster data.
- Synchronization of portal data across devices.
- Shared data access for authorized application functionality.
- Support for roster management and portal content workflows.

### Student Profiles

Students can view their available institutional profile information through the portal.

- Student identification details.
- Department and academic information.
- Section and group details.
- Faculty mentor information, where available.
- Profile update request functionality.

### Dark Mode

A dark-themed interface across the portal, designed to maintain visual consistency and comfortable navigation.

---

## Technology Stack

| Technology | Usage |
|---|---|
| React | Component-based UI and frontend application |
| JavaScript | Application logic and functionality |
| HTML5 | Webpage structure |
| CSS3 | Styling, layouts, and responsiveness |
| Tailwind CSS | Utility-based styling |
| Vite | Development server and build tooling |
| Firebase Firestore | Cloud database and synchronization |
| XLSX | Excel/CSV roster processing |
| Netlify | Deployment and hosting |

---

## Website Overview

| Section | Description |
|---|---|
| **Home** | Introduction to Campus Connect and its core features |
| **Materials & Posts** | Academic materials, notices, lecture notes, events, and shared posts |
| **Connect Students** | Roster-verified student directory and WhatsApp networking |
| **Reach Admin** | Access to administrative contact information |
| **Admin Console** | Student roster, posts, moderation, imports, profile management, and security settings |

---

## Security & Access Control

Campus Connect is designed around controlled access to student information.

- Student directory access is restricted behind authentication.
- Student access is based on information present in the imported college roster.
- Registered mobile numbers and college ID/DSC codes are used as student identification credentials.
- Administrative functionality is separated from normal student access.
- Moderation features help maintain control over content shared on the platform.

The objective is to avoid making the student directory an unrestricted public listing and to provide a more controlled environment for campus networking.

> The project implements roster-based access restrictions, but it is still a learning project and should not be considered a fully security-audited production system.

---

## Live Deployment

Campus Connect is deployed using Netlify.

**Live Website:** https://campusconnect-surtech.netlify.app/

---

## Running Locally

The project can be run locally using Node.js and npm.

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

Clone the repository:

    git clone <repository-url>

Navigate into the project directory:

    cd campus-connect

Install the project dependencies:

    npm install

### Development Server

Run the development server:

    npm run dev

Vite will display the local development URL in your terminal. Open it in your browser to access Campus Connect locally.

### Production Build

To create an optimized production build:

    npm run build

---

## Project Structure

    Campus-Connect/
    │
    ├── src/                   # React application source
    ├── public/                 # Static assets
    ├── dist/                   # Production build output
    ├── index.html               # Application entry point
    ├── package.json              # Dependencies and scripts
    ├── package-lock.json         # Dependency lock file
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Tailwind configuration
    ├── postcss.config.js        # PostCSS configuration
    ├── netlify.toml             # Netlify configuration
    └── README.md                 # Project documentation

---

## Project Purpose & Learning

Campus Connect is my first-semester college project and part of my journey into programming and web development.

Instead of limiting myself to basic practice programs and static webpage exercises, I wanted to explore the process of building a functional website with multiple sections, interactive features, data handling, authentication flows, and cloud integration.

Working on this project gave me exposure to:

- React-based frontend development.
- Component-based UI structure.
- Website design and responsive layouts.
- JavaScript functionality and user interactions.
- Student data handling and roster management.
- Firebase Firestore integration.
- Authentication and access-control concepts.
- Excel/CSV data importing.
- Administrative interfaces and moderation workflows.
- Deployment using Netlify.

This project is still evolving. There are features that can be improved, optimized, redesigned, or implemented more independently as my understanding of web development grows.

---

## Author

**Ritam Das**

B.Tech — Computer Science & Engineering  
1st Year | 1st Semester

Campus Connect was developed as a college project while learning and exploring web development.

I'm currently learning **Full Stack Web Development**, and I haven't covered every technology or concept required to independently build and implement all the functionality present in this project.

During development, **Google Gemini** was used as an AI-assisted development tool to help with unfamiliar concepts, implementation, debugging, exploring React functionality, and building features that are currently beyond my learning level.

The project is a representation of my current learning stage — experimenting with technologies, understanding how different components work together, and gradually developing the skills to build more complex applications independently.

---

*College project — built while learning, experimenting, and improving.*