# 📝 KeepNote-Lite

KeepNote-Lite is a modern note-taking application. It is designed to be simple, fast, and easy to maintain. The project focuses on clean code structure and reliable state management.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (for fast development)
- **Styling**: Tailwind CSS + DaisyUI (for clean and responsive design)
- **State Management**: Zustand (for managing global state)
- **Routing**: React Router DOM (v6)
- **Forms & Validation**: React Hook Form
- **Mock Backend**: MockAPI.io (cloud-based mock backend)
- **Deployment**: Netlify Ready
## 🏗️ Architecture & Structure

The codebase is organized into small, specific folders. This makes it easier to read and update.

```
KeepNote-Lite/
├─ dist/
│  ├─ assets/
│  │  ├─ index-dKzeZfMJ.js
│  │  └─ index-DuydcxRJ.css
│  └─ index.html
├─ public/
│  └─ _redirects
├─ src/
│  ├─ api/
│  │  └─ axiosInstance.ts
│  ├─ components/
│  │  ├─ auth/
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ RegisterForm.tsx
│  │  ├─ layout/
│  │  │  └─ Navbar.tsx
│  │  ├─ notes/
│  │  │  ├─ NoteCard.tsx
│  │  │  ├─ NoteModal.tsx
│  │  │  └─ SearchBar.tsx
│  │  ├─ ui/
│  │  │  └─ Toaster.tsx
│  │  └─ ProtectedRoute.tsx
│  ├─ hooks/
│  │  └─ useDebounce.ts
│  ├─ pages/
│  │  ├─ ActivityLogPage.tsx
│  │  ├─ HomePage.tsx
│  │  ├─ LoginPage.tsx
│  │  ├─ RegisterPage.tsx
│  │  └─ SharedNotePage.tsx
│  ├─ services/
│  │  ├─ authService.ts
│  │  ├─ logsService.ts
│  │  └─ notesService.ts
│  ├─ store/
│  │  ├─ authStore.ts
│  │  ├─ logStore.ts
│  │  ├─ notesStore.ts
│  │  └─ uiStore.ts
│  ├─ utils/
│  │  ├─ formatDate.ts
│  │  └─ validation.ts
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts


```

### Key Technical Choices

1. **State Management**: The app uses different stores (`authStore`, `notesStore`, etc.) instead of one large file. This keeps the code organized and helps the app run faster.
2. **Action Logging**: When a user creates, edits, or deletes a note, the app tracks this activity in the background.
3. **Themes**: The app uses DaisyUI colors to easily switch between Light and Dark mode.
4. **Error Handling**: If the mock server stops working, the app will show a helpful error message instead of crashing.
5. **Form Validation**: `react-hook-form` is used to handle form inputs efficiently and show text errors.

## 🌟 Core Features

- **User Roles**: Supports `viewer` (read-only), `editor` (can edit their own notes), and `admin` (can manage all notes and view logs).
- **Manage Notes**: Users can create, edit, and delete notes. Notes are saved to the local mock backend.
- **Protected Pages**: The app ensures that only logged-in users can access their notes.
- **Search**: Users can search for notes easily.
- **Mobile Design**: The app looks great on phones, tablets, and desktops using standard Tailwind CSS setups.

## ⚙️ Setup & Installation

Follow these steps to run KeepNote-Lite on your computer:

### 1. Install Dependencies

Make sure you have Node JS installed. Open a terminal and run:

```bash
npm install
```

### 2. Configure Environment (Optional)

The endpoints are already hooked up in `axiosInstance.ts` pointing to `mockapi.io`. Ensure you have internet connection for the API functions to work.

### 3. Start the Frontend

Open a terminal window and run the Vite server:

```bash
npm run dev
```
---

_Built with a focus on simple, readable, and high-quality code._
