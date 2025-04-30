# Admin Panel for Your Application

This is a simple admin panel built with React and Tailwind CSS for your application. It provides a user-friendly interface for managing users, tickets, payments, and notes.

## Features

- Dashboard with key metrics
- User management
- Ticket management
- Payment management
- Note management
- Responsive design (mobile and desktop)

## Setup Instructions

### 1. Install dependencies

```bash
# Navigate to the frontend directory
cd frontend

# Install required dependencies
npm install react-router-dom axios

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind CSS

Update the `tailwind.config.js` file:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Configure API endpoint

If your backend is not running on port 5000, update the API_URL in `src/pages/admin/AdminPanel.jsx`:

```javascript
// Change this to match your backend API URL
const API_URL = "http://localhost:5000/api";
```

### 4. Run the development server

```bash
npm run dev
```

## Usage

1. Navigate to the application in your browser
2. Click on "Admin Panel" in the navigation or go directly to `/admin` route
3. Use the sidebar to navigate between different sections
4. Manage your users, tickets, payments, and notes

## Important Notes

- This admin panel does not include authentication - it's meant for development purposes only
- For production, you should implement proper authentication and authorization
- Backend API endpoints should be secured appropriately

## Backend API Requirements

The admin panel expects the following API endpoints:

- `/api/users` - GET: Fetch all users
- `/api/tickets` - GET: Fetch all tickets
- `/api/payments` - GET: Fetch all payments
- `/api/notes` - GET: Fetch all notes

Make sure your backend provides these endpoints and returns data in the expected format.
