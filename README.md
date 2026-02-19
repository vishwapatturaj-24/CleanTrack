# CleanTrack: A Mobile-Based Civic Complaint Management System

---

## Table of Contents

1. [Abstract](#abstract)
2. [Objective](#objective)
3. [Introduction](#introduction)
4. [Literature Survey](#literature-survey)
5. [Problem Statement](#problem-statement)
6. [Proposed System](#proposed-system)
7. [Technology Stack](#technology-stack)
8. [System Architecture](#system-architecture)
9. [Technical Modules](#technical-modules)
10. [Database Design](#database-design)
11. [Implementation Details](#implementation-details)
12. [User Interface Design](#user-interface-design)
13. [Features and Functionality](#features-and-functionality)
14. [System Requirements](#system-requirements)
15. [Installation and Setup](#installation-and-setup)
16. [Testing](#testing)
17. [Results and Discussion](#results-and-discussion)
18. [Future Enhancements](#future-enhancements)
19. [Conclusion](#conclusion)
20. [References](#references)

---

## Abstract

CleanTrack is a cross-platform mobile application designed to digitize and streamline the civic complaint management process. Built using React Native with the Expo framework, the application enables citizens to report cleanliness and infrastructure-related issues in their locality by submitting geo-tagged, photo-documented complaints through an intuitive mobile interface. The system employs a dual-role architecture comprising a **User Module** and an **Admin Module**, facilitated through role-based authentication via Firebase. Complaint data, including textual descriptions, photographic evidence uploaded to Cloudinary, and GPS coordinates, is persisted in Cloud Firestore, enabling real-time data synchronization and offline-capable access. Administrators can manage, prioritize, and resolve complaints through a dedicated dashboard featuring analytical summaries and a comprehensive status timeline. The application addresses the critical gap between civic issue reporting and governmental response mechanisms by providing a transparent, trackable, and efficient digital workflow.

**Keywords:** Mobile Application, Civic Complaint Management, React Native, Firebase, Cloud Firestore, Cloudinary, Geolocation, Role-Based Access Control, Cross-Platform Development.

---

## Objective

The primary objectives of CleanTrack are:

1. **Digitize Civic Complaint Reporting** -- Replace traditional, paper-based complaint mechanisms with a mobile-first digital platform accessible to citizens at any time and from any location.

2. **Enable Evidence-Based Reporting** -- Allow users to attach photographic evidence and precise GPS coordinates to complaints, ensuring verifiability and contextual accuracy.

3. **Implement Role-Based Workflow Management** -- Establish a structured workflow with distinct user and administrator roles, enabling systematic complaint processing through defined status transitions (Pending, In Progress, Resolved, Rejected).

4. **Provide Real-Time Status Tracking** -- Offer transparent complaint lifecycle tracking through a status timeline, enabling citizens to monitor the progress of their submitted complaints.

5. **Facilitate Data-Driven Decision Making** -- Equip administrators with dashboard analytics, category-wise breakdowns, and priority-based sorting to optimize resource allocation and response times.

6. **Ensure Cross-Platform Accessibility** -- Deliver a unified codebase deployable on both Android and iOS platforms, maximizing reach and minimizing development overhead.

---

## Introduction

Urban governance in developing nations faces a persistent challenge in bridging the communication gap between citizens and municipal authorities. Traditional complaint registration processes -- involving physical visits to government offices, handwritten forms, and manual tracking -- are plagued by inefficiency, lack of transparency, and poor accountability. Citizens frequently remain uninformed about the status of their complaints, leading to dissatisfaction and eroding public trust in civic institutions.

The proliferation of smartphones and mobile internet connectivity presents a transformative opportunity to reimagine this process. CleanTrack leverages this technological paradigm shift by providing a mobile application that empowers citizens to report civic issues -- ranging from power outages and drainage problems to road damage and waste management failures -- directly from their smartphones.

The application follows a **client-server architecture** where the React Native client communicates with Firebase's Backend-as-a-Service (BaaS) infrastructure. This architectural choice eliminates the need for custom server development, reduces operational costs, and ensures automatic scalability. The use of Cloud Firestore provides real-time data synchronization, while Cloudinary's content delivery network (CDN) ensures efficient image storage and delivery.

CleanTrack is designed with two distinct user personas in mind:

- **Citizens (Users):** Individuals who report civic issues, attach evidence, and track resolution progress.
- **Administrators (Admins):** Municipal officials or designated personnel who review, prioritize, and manage complaint resolution.

This dual-role system ensures a clear separation of concerns and maintains the integrity of the complaint management workflow.

---

## Literature Survey

The development of CleanTrack is informed by several domains of existing research and technology:

| Domain | Relevance | Key Technologies |
|--------|-----------|-----------------|
| Mobile-First Civic Engagement | Studies indicate that mobile platforms significantly increase citizen participation in governance processes compared to web-only solutions. | React Native, Flutter, Ionic |
| Backend-as-a-Service (BaaS) | Firebase and similar BaaS platforms reduce development complexity by providing pre-built authentication, database, and storage services. | Firebase, AWS Amplify, Supabase |
| Geolocation in Civic Applications | GPS-tagged complaint data enables spatial analysis of urban issues, facilitating data-driven infrastructure planning. | Google Maps API, Expo Location |
| Cloud-Based Media Storage | CDN-backed image storage ensures rapid delivery of complaint evidence across geographic regions with minimal latency. | Cloudinary, AWS S3, Firebase Storage |
| Role-Based Access Control (RBAC) | RBAC models are fundamental to multi-stakeholder applications, ensuring data security and operational integrity. | Firebase Auth, OAuth 2.0 |

---

## Problem Statement

Existing civic complaint management systems suffer from the following limitations:

1. **Inaccessibility** -- Citizens must physically visit government offices during restricted working hours to lodge complaints, creating barriers for working individuals.

2. **Lack of Evidence Support** -- Paper-based systems do not accommodate photographic or geographic evidence, reducing the verifiability and urgency assessment of complaints.

3. **Opaque Tracking** -- Citizens have no visibility into the status or progress of their complaints after submission, leading to duplicate filings and frustration.

4. **Inefficient Prioritization** -- Without categorization, priority tagging, and analytics, administrators lack the tools to effectively triage and allocate resources.

5. **No Centralized Data** -- Complaints are often scattered across multiple offices and registers, making holistic analysis and trend identification impossible.

CleanTrack addresses these challenges by providing a unified, mobile-accessible platform with end-to-end digital complaint lifecycle management.

---

## Proposed System

CleanTrack proposes a comprehensive complaint management ecosystem with the following characteristics:

### System Overview

```
+-------------------+         +-------------------+         +-------------------+
|                   |         |                   |         |                   |
|   User Module     | <-----> |   Firebase BaaS   | <-----> |   Admin Module    |
|   (React Native)  |         |   (Auth + DB)     |         |   (React Native)  |
|                   |         |                   |         |                   |
+-------------------+         +-------------------+         +-------------------+
        |                             |
        v                             v
+-------------------+         +-------------------+
|   Cloudinary CDN  |         |   Expo Location   |
|   (Image Storage) |         |   (GPS Services)  |
+-------------------+         +-------------------+
```

### Key Design Principles

- **Separation of Concerns:** Distinct modules for authentication, navigation, data services, and UI components.
- **Context-Based State Management:** React Context API provides centralized, prop-drilling-free state management for authentication data.
- **Service-Oriented Data Layer:** All Firestore and Cloudinary interactions are abstracted into dedicated service modules.
- **Responsive UI Design:** Platform-adaptive layouts using React Native's StyleSheet system with consistent design tokens.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile UI framework |
| React | 19.1.0 | Component-based UI library |
| Expo | 54.0.33 | Managed workflow and native API access |
| React Navigation | 7.x | Navigation framework (Stack + Bottom Tabs) |
| React Native Maps | 1.27.1 | Map rendering and geolocation display |
| Expo Image Picker | 17.0.10 | Camera and gallery image selection |
| Expo Location | 19.0.8 | GPS coordinate acquisition |
| @expo/vector-icons (Ionicons) | 15.0.3 | Icon library for UI elements |

### Backend Services

| Technology | Purpose |
|------------|---------|
| Firebase Authentication | Email/password-based user registration and login |
| Cloud Firestore | NoSQL document database for complaint and user data |
| Cloudinary | Cloud-based image upload, storage, and CDN delivery |

### Development Tools

| Tool | Purpose |
|------|---------|
| Expo CLI | Development server, building, and deployment |
| EAS Build | Production APK/AAB generation for Android |
| Node.js | JavaScript runtime for development tooling |
| Git & GitHub | Version control and repository hosting |

---

## System Architecture

### Architectural Pattern

CleanTrack follows a **layered architecture** pattern with clear separation between presentation, business logic, and data access layers:

```
+---------------------------------------------------------------+
|                     PRESENTATION LAYER                         |
|  (Screens: Auth, User, Admin | Components: Cards, Pickers)    |
+---------------------------------------------------------------+
|                     BUSINESS LOGIC LAYER                       |
|  (AuthContext | Navigation Logic | Form Validation)            |
+---------------------------------------------------------------+
|                     DATA ACCESS LAYER                          |
|  (authService | complaintService | storageService)             |
+---------------------------------------------------------------+
|                     EXTERNAL SERVICES                          |
|  (Firebase Auth | Cloud Firestore | Cloudinary API)            |
+---------------------------------------------------------------+
```

### Navigation Architecture

The application employs a conditional navigation structure based on authentication state and user role:

```
AppNavigator
  |
  +-- [Not Authenticated] --> AuthStack
  |     |-- LoginScreen
  |     |-- RegisterScreen
  |     +-- AdminLoginScreen
  |
  +-- [User Role] --> UserStack
  |     |-- UserTabs (Bottom Tab Navigator)
  |     |    |-- HomeScreen
  |     |    |-- NewComplaintScreen
  |     |    |-- MyComplaintsScreen
  |     |    +-- ProfileScreen
  |     +-- ComplaintDetailScreen (Stack)
  |
  +-- [Admin Role] --> AdminStack
        |-- AdminTabs (Bottom Tab Navigator)
        |    |-- AdminDashboard
        |    |-- ComplaintListScreen
        |    +-- AdminProfileScreen
        +-- ComplaintManageScreen (Stack)
```

---

## Technical Modules

### Module 1: Authentication Module

**Files:** `src/services/authService.js`, `src/contexts/AuthContext.js`, `firebaseConfig.js`

This module handles all authentication-related operations using Firebase Authentication:

- **User Registration:** Creates a new Firebase Auth account, sets the display name, and persists a user profile document in the `users` Firestore collection with fields: `name`, `email`, `phone`, `role`, and `createdAt`.
- **User Login:** Authenticates users via email and password using Firebase's `signInWithEmailAndPassword`.
- **Admin Login:** Performs standard authentication followed by a role verification check against the Firestore user profile. Non-admin users are immediately logged out with an unauthorized alert.
- **Session Persistence:** Leverages `@react-native-async-storage/async-storage` for React Native-compatible session persistence via `getReactNativePersistence`.
- **Auth State Management:** The `AuthContext` provider wraps the entire application, using Firebase's `onAuthStateChanged` listener to reactively update authentication state. Exposes `user`, `userProfile`, `isAdmin`, `loading`, `logout`, and `refreshProfile` through context.

### Module 2: Complaint Management Module

**Files:** `src/services/complaintService.js`

This module provides the complete CRUD interface for complaint data operations:

- **Create Complaint:** Adds a new document to the `complaints` collection with auto-generated ID. Initializes the status as `pending`, priority as `medium`, and creates the first entry in the `statusHistory` array.
- **Read Operations:**
  - `getMyComplaints(userId)` -- Fetches complaints filtered by user ID, ordered by creation date (descending).
  - `getAllComplaints()` -- Retrieves all complaints (admin use), ordered by creation date.
  - `getComplaintsByStatus(status)` -- Filters complaints by status value.
  - `getComplaintsByCategory(category)` -- Filters complaints by category.
  - `getComplaintById(complaintId)` -- Fetches a single complaint document by ID.
- **Update Operations:**
  - `updateComplaintStatus(id, status, note, updatedBy)` -- Updates the complaint status and appends a new entry to the `statusHistory` array using Firestore's `arrayUnion`.
  - `updateComplaintPriority(id, priority)` -- Updates the priority level (low, medium, high).

### Module 3: Media Storage Module

**Files:** `src/services/storageService.js`, `src/config/cloudinary.js`

This module manages image upload operations using Cloudinary's REST API:

- **Single Image Upload:** Constructs a `FormData` object with the image URI, upload preset, and target folder, then sends a POST request to Cloudinary's upload endpoint. Returns the secure HTTPS URL of the uploaded image.
- **Batch Upload:** Maps an array of image URIs to concurrent upload promises using `Promise.all`, enabling parallel uploads for efficiency.
- **Configuration:** Cloudinary credentials (cloud name and upload preset) are externalized in `src/config/cloudinary.js`.

### Module 4: Navigation Module

**Files:** `src/navigation/AppNavigator.js`

This module implements the application's navigation structure:

- **Conditional Root Navigation:** The `AppNavigator` component evaluates the authentication context to determine which navigation stack to render:
  - Unauthenticated users see the `AuthStack`.
  - Regular users see the `UserStack` with bottom tab navigation.
  - Admin users see the `AdminStack` with a distinct bottom tab configuration.
- **Stack Navigators:** Used for hierarchical screen transitions (e.g., complaint list to complaint detail).
- **Bottom Tab Navigators:** Provide primary navigation for both user and admin roles with Ionicons-based tab icons.

### Module 5: User Interface Components

**Files:** `src/components/`

Reusable UI components that promote consistency and reduce code duplication:

| Component | File | Description |
|-----------|------|-------------|
| `ComplaintCard` | `ComplaintCard.js` | Displays complaint summary in a card format with title, category, status badge, and timestamp. |
| `CategoryPicker` | `CategoryPicker.js` | Grid-based category selection interface with icons and color coding for 9 complaint categories. |
| `ImagePickerComponent` | `ImagePickerComponent.js` | Integrates with Expo Image Picker for camera capture and gallery selection with image preview. |
| `LocationPicker` | `LocationPicker.js` | Acquires GPS coordinates via Expo Location with reverse geocoding for address display. |
| `StatusBadge` | `StatusBadge.js` | Color-coded badge component displaying complaint status (Pending, In Progress, Resolved, Rejected). |
| `StatusTimeline` | `StatusTimeline.js` | Vertical timeline visualization of complaint status history with timestamps and admin notes. |

### Module 6: Utility Module

**Files:** `src/utils/`

Centralized constants and helper functions:

- **`constants.js`** -- Defines design tokens (color palette), status enumerations and labels, priority levels and colors, and role identifiers.
- **`categories.js`** -- Defines the 9 complaint categories with associated icons and colors: Power Cut, Drainage, Road Damage, Water Supply, Garbage, Street Light, Public Property, Noise Pollution, and Other.
- **`helpers.js`** -- Provides date formatting utilities (`formatDate`, `formatShortDate`, `getTimeAgo`) and text truncation.

---

## Database Design

### Firestore Collection: `users`

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name of the user |
| `email` | String | Email address (used for authentication) |
| `phone` | String | Contact phone number |
| `role` | String | User role: `"user"` or `"admin"` |
| `createdAt` | Timestamp | Account creation timestamp (server-generated) |

### Firestore Collection: `complaints`

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Brief title of the complaint (max 100 chars) |
| `description` | String | Detailed description (max 1000 chars) |
| `category` | String | Category identifier (e.g., `"garbage"`, `"road_damage"`) |
| `images` | Array\<String\> | Array of Cloudinary image URLs |
| `location` | Map | Contains `latitude`, `longitude`, and `address` |
| `userId` | String | Firebase Auth UID of the complaint author |
| `userName` | String | Display name of the complaint author |
| `status` | String | Current status: `pending`, `in_progress`, `resolved`, `rejected` |
| `priority` | String | Priority level: `low`, `medium`, `high` |
| `statusHistory` | Array\<Map\> | Chronological status change records |
| `createdAt` | Timestamp | Complaint creation timestamp (server-generated) |
| `updatedAt` | Timestamp | Last update timestamp (server-generated) |

### Status History Entry Structure

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | The status value at this point |
| `note` | String | Admin note or system message |
| `updatedBy` | String | Name of the person/system that made the change |
| `updatedAt` | String | ISO 8601 timestamp of the change |

---

## Implementation Details

### State Management Strategy

CleanTrack uses the **React Context API** for global state management, specifically for authentication state. The `AuthProvider` component wraps the root `App` component and:

1. Listens to Firebase's `onAuthStateChanged` event for real-time auth state updates.
2. Fetches the corresponding user profile from Firestore upon successful authentication.
3. Derives the `isAdmin` boolean from the user profile's `role` field.
4. Provides a `logout` function that clears both Firebase auth state and local state.
5. Offers a `refreshProfile` function for on-demand profile data re-fetching.

### Complaint Submission Workflow

```
User fills form (title, description, category)
         |
         v
User optionally attaches photos (camera/gallery)
         |
         v
User optionally tags GPS location
         |
         v
Form validation (required: title, description, category)
         |
         v
Images uploaded to Cloudinary (parallel uploads)
         |
         v
Complaint document created in Firestore
(status: "pending", priority: "medium")
         |
         v
Status history initialized with "Complaint submitted"
         |
         v
User redirected to Home Screen with success alert
```

### Admin Complaint Management Workflow

```
Admin views Dashboard (summary statistics)
         |
         v
Admin navigates to Complaint List (searchable, filterable)
         |
         v
Admin selects complaint --> ComplaintManageScreen
         |
         v
Admin reviews: title, description, photos, location, submitter
         |
         v
Admin updates: status (4 options) + priority (3 levels) + note
         |
         v
Firestore document updated with new status and history entry
         |
         v
Status history appended with admin name, note, and timestamp
```

---

## User Interface Design

### Design System

CleanTrack employs a consistent design system defined in `src/utils/constants.js`:

- **Primary Palette:** Green tones (`#2E7D32`, `#4CAF50`, `#1B5E20`) symbolizing cleanliness and environmental responsibility.
- **Status Colors:** Amber (Pending), Blue (In Progress), Green (Resolved), Red (Rejected).
- **Priority Colors:** Green (Low), Orange (Medium), Red (High).
- **Typography:** System fonts with weight hierarchy (400 for body, 600 for labels, 700-800 for headings).
- **Spacing:** Consistent padding (16-20px for sections, 8-12px for inner elements).
- **Border Radius:** 12px for cards and inputs, 20px for chips and badges.

### Screen Inventory

| # | Screen | Role | Description |
|---|--------|------|-------------|
| 1 | LoginScreen | Auth | Email/password login with branded header |
| 2 | RegisterScreen | Auth | Multi-field registration (name, email, phone, password) |
| 3 | AdminLoginScreen | Auth | Admin-specific login with role verification |
| 4 | HomeScreen | User | Welcome message, summary cards, recent complaints |
| 5 | NewComplaintScreen | User | Complaint submission form with media and location |
| 6 | MyComplaintsScreen | User | Filterable list of user's complaints |
| 7 | ComplaintDetailScreen | User | Full complaint view with images, map, and timeline |
| 8 | ProfileScreen | User | User info, activity stats, logout |
| 9 | AdminDashboard | Admin | Overview statistics, category breakdown, recent items |
| 10 | ComplaintListScreen | Admin | Searchable, filterable list of all complaints |
| 11 | ComplaintManageScreen | Admin | Complaint review and status/priority management |
| 12 | AdminProfileScreen | Admin | Admin profile, system stats, settings, logout |

---

## Features and Functionality

### User Features

- **Complaint Registration** with title, description, category selection, photo attachment, and location tagging.
- **Real-Time Status Tracking** with a visual timeline showing all status transitions and admin notes.
- **Complaint Filtering** by status (Pending, In Progress, Resolved, Rejected).
- **Pull-to-Refresh** for real-time data updates on all list screens.
- **Home Dashboard** displaying total, pending, and resolved complaint counts.
- **User Profile** with contact information and activity statistics.

### Admin Features

- **Analytics Dashboard** with total, pending, in-progress, and resolved counts displayed in color-coded summary cards.
- **Category Breakdown** showing complaint distribution across all 9 categories.
- **Advanced Filtering** by status, category, and text search.
- **Complaint Management** with status updates (4 states), priority assignment (3 levels), and admin notes.
- **Status History** providing a complete audit trail of all status transitions.

### Complaint Categories

| # | Category | Icon | Color |
|---|----------|------|-------|
| 1 | Power Cut / Electrical Issues | Flash | #FFC107 |
| 2 | Drainage / Sewage Problems | Water | #795548 |
| 3 | Road Damage / Potholes | Car | #607D8B |
| 4 | Water Supply Issues | Water Outline | #03A9F4 |
| 5 | Garbage / Waste Management | Trash | #4CAF50 |
| 6 | Street Light Issues | Bulb | #FF9800 |
| 7 | Public Property Damage | Business | #9C27B0 |
| 8 | Noise Pollution | Volume High | #F44336 |
| 9 | Other | Ellipsis | #9E9E9E |

---

## System Requirements

### Hardware Requirements

| Component | Minimum Specification |
|-----------|-----------------------|
| Processor | Quad-core 1.4 GHz or higher |
| RAM | 2 GB (4 GB recommended) |
| Storage | 100 MB free space |
| Camera | Rear-facing camera (for photo evidence) |
| GPS | GPS/GLONASS sensor (for location tagging) |
| Internet | Active Wi-Fi or mobile data connection |

### Software Requirements

| Component | Requirement |
|-----------|-------------|
| Operating System | Android 6.0+ (API Level 23) or iOS 13.0+ |
| Development OS | Windows 10+, macOS 12+, or Ubuntu 20.04+ |
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| Expo CLI | Latest version |
| EAS CLI | 3.0.0 or higher (for production builds) |

---

## Installation and Setup

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18 or higher).
2. Install Expo CLI: `npm install -g expo-cli`
3. Create a [Firebase Project](https://console.firebase.google.com/) with Authentication and Firestore enabled.
4. Create a [Cloudinary Account](https://cloudinary.com/) with an unsigned upload preset.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/vishwapatturaj-24/CleanTrack.git

# 2. Navigate to the project directory
cd CleanTrack

# 3. Install dependencies
npm install

# 4. Configure Firebase credentials in firebaseConfig.js

# 5. Configure Cloudinary credentials in src/config/cloudinary.js

# 6. Start the development server
npx expo start

# 7. Scan the QR code with Expo Go (Android/iOS)
```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build APK for Android
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

---

## Testing

### Testing Approach

| Type | Scope | Method |
|------|-------|--------|
| Unit Testing | Service functions, helpers | Manual verification of CRUD operations |
| Integration Testing | Firebase Auth + Firestore | End-to-end auth flow and data persistence |
| UI Testing | All 12 screens | Manual screen-by-screen walkthrough |
| Functional Testing | Complaint lifecycle | Full workflow: submit -> manage -> resolve |
| Usability Testing | Overall UX | User feedback on navigation and form flow |

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | User registration with valid data | Account created, auto-login, profile stored | Pass |
| 2 | Login with invalid credentials | Error alert displayed | Pass |
| 3 | Admin login with user account | "Unauthorized" alert, session terminated | Pass |
| 4 | Submit complaint without title | Validation alert shown | Pass |
| 5 | Submit complaint with images | Images uploaded to Cloudinary, URLs stored | Pass |
| 6 | Submit complaint with location | GPS coordinates captured and stored | Pass |
| 7 | Filter complaints by status | List updates to show filtered results | Pass |
| 8 | Admin updates complaint status | Status updated, history entry added | Pass |
| 9 | Admin changes complaint priority | Priority updated in Firestore | Pass |
| 10 | Logout from user/admin session | Auth state cleared, redirected to login | Pass |

---

## Results and Discussion

CleanTrack successfully demonstrates the feasibility of a fully serverless, cross-platform civic complaint management system. Key outcomes include:

1. **Reduced Complaint Registration Time:** Digital submission with pre-built category selection and GPS auto-detection significantly reduces the time required compared to physical filing.

2. **Enhanced Evidence Quality:** Photo and location-tagged complaints provide administrators with verifiable, contextually rich data for decision-making.

3. **Transparent Tracking:** The status timeline feature provides citizens with full visibility into the complaint resolution process, fostering trust.

4. **Scalable Architecture:** Firebase's serverless infrastructure ensures the system can handle increasing complaint volumes without manual scaling interventions.

5. **Cost Efficiency:** The use of free-tier services (Firebase Spark, Cloudinary Free) makes the system viable for resource-constrained municipal bodies.

### Limitations

- The application currently does not support push notifications for status updates.
- Offline complaint submission (queued for upload) is not yet implemented.
- The admin role must be manually assigned in the Firestore database.
- No analytics export or reporting functionality is available.

---

## Future Enhancements

1. **Push Notifications:** Implement Firebase Cloud Messaging (FCM) to notify users of status changes in real-time.
2. **Offline Mode:** Queue complaint submissions locally and auto-sync when connectivity is restored.
3. **Analytics Dashboard:** Add charts and graphs (using libraries like `react-native-chart-kit`) for trend analysis.
4. **Multi-Language Support:** Internationalization (i18n) for regional language accessibility.
5. **AI-Powered Categorization:** Use image recognition to auto-suggest complaint categories from uploaded photos.
6. **Community Upvoting:** Allow citizens to upvote complaints in their vicinity, surfacing high-impact issues.
7. **Admin Registration Portal:** Self-service admin onboarding with approval workflows.
8. **Export and Reporting:** Generate PDF/CSV reports for municipal records and auditing.
9. **Dark Mode:** Theme switching for improved usability in low-light conditions.
10. **Chatbot Integration:** In-app support chatbot for user guidance and FAQ resolution.

---

## Conclusion

CleanTrack presents a practical and scalable solution to the longstanding challenge of civic complaint management. By leveraging modern mobile development frameworks (React Native + Expo) and cloud-based backend services (Firebase + Cloudinary), the application delivers a production-ready platform that empowers citizens and equips administrators with the tools necessary for efficient urban governance.

The modular architecture, clear separation of concerns, and role-based access control ensure maintainability and extensibility, positioning CleanTrack as a foundation upon which more sophisticated civic technology solutions can be built.

The project demonstrates that with contemporary tooling, it is possible to develop a full-featured, cross-platform complaint management system with minimal infrastructure overhead, making it an accessible solution for municipalities of all sizes.

---

## References

1. Meta Platforms, Inc. (2024). *React Native Documentation*. https://reactnative.dev/docs/getting-started
2. Expo. (2024). *Expo Documentation*. https://docs.expo.dev/
3. Google. (2024). *Firebase Documentation*. https://firebase.google.com/docs
4. Google. (2024). *Cloud Firestore Documentation*. https://firebase.google.com/docs/firestore
5. Cloudinary. (2024). *Cloudinary Upload API Reference*. https://cloudinary.com/documentation/image_upload_api_reference
6. React Navigation. (2024). *React Navigation Documentation*. https://reactnavigation.org/docs/getting-started
7. Expo. (2024). *Expo Location API*. https://docs.expo.dev/versions/latest/sdk/location/
8. Expo. (2024). *Expo Image Picker API*. https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

## Project Structure

```
CleanTrack/
  |-- App.js                          # Root component with AuthProvider
  |-- index.js                        # Entry point (registerRootComponent)
  |-- firebaseConfig.js               # Firebase initialization and exports
  |-- app.json                        # Expo configuration
  |-- eas.json                        # EAS Build configuration
  |-- package.json                    # Dependencies and scripts
  |-- .gitignore                      # Git ignore rules
  |-- assets/                         # App icons and splash screen
  |   |-- icon.png
  |   |-- adaptive-icon.png
  |   |-- splash-icon.png
  |   +-- favicon.png
  +-- src/
      |-- config/
      |   +-- cloudinary.js           # Cloudinary configuration
      |-- contexts/
      |   +-- AuthContext.js           # Authentication context provider
      |-- navigation/
      |   +-- AppNavigator.js          # Conditional navigation structure
      |-- services/
      |   |-- authService.js           # Firebase Auth operations
      |   |-- complaintService.js      # Firestore CRUD for complaints
      |   +-- storageService.js        # Cloudinary image upload
      |-- screens/
      |   |-- auth/
      |   |   |-- LoginScreen.js
      |   |   |-- RegisterScreen.js
      |   |   +-- AdminLoginScreen.js
      |   |-- user/
      |   |   |-- HomeScreen.js
      |   |   |-- NewComplaintScreen.js
      |   |   |-- MyComplaintsScreen.js
      |   |   |-- ComplaintDetailScreen.js
      |   |   +-- ProfileScreen.js
      |   +-- admin/
      |       |-- AdminDashboard.js
      |       |-- ComplaintListScreen.js
      |       |-- ComplaintManageScreen.js
      |       +-- AdminProfileScreen.js
      |-- components/
      |   |-- ComplaintCard.js
      |   |-- CategoryPicker.js
      |   |-- ImagePickerComponent.js
      |   |-- LocationPicker.js
      |   |-- StatusBadge.js
      |   +-- StatusTimeline.js
      +-- utils/
          |-- constants.js             # Colors, statuses, priorities, roles
          |-- categories.js            # Complaint category definitions
          +-- helpers.js               # Date formatting and text utilities
```

---

*Developed as a civic technology initiative to improve urban governance through digital innovation.*
