# Simple Authentication System for NoteGenius

This document explains the simple authentication system implemented in NoteGenius.

## Overview

The authentication system uses localStorage to store user information without token-based authentication or password encryption. This is a simple implementation for demonstration purposes and should not be used in a production environment.

## Features

- User registration
- User login
- Role-based access control (admin vs regular users)
- Protected routes
- Persistent authentication state using localStorage

## How it Works

1. **Registration**
   - Users register with username, email, and password
   - Password is stored without encryption (not secure for production)
   - User is assigned a role (default: 'user')

2. **Login**
   - Users login with email and password
   - The system checks if the provided credentials match a user in the database
   - If credentials match, user information is stored in localStorage

3. **Authentication Context**
   - A React Context API provides authentication state across the app
   - Detects if a user is logged in by checking localStorage
   - Provides helper methods for login, logout, and checking permissions

4. **Protected Routes**
   - Routes are protected using a custom ProtectedRoute component
   - Certain routes require specific roles (e.g., admin panel)

## User Data Structure

```javascript
{
  id: "user_id_from_database",
  username: "johndoe",
  email: "john@example.com",
  role: "user" // or "admin"
}
```

## API Functions

- `getUserByEmail(email)` - Retrieves user information by email
- `createUser(userData)` - Creates a new user
- `updateUser(id, userData)` - Updates user information

## Security Considerations

This implementation is NOT secure for production use because:

1. Passwords are stored and compared without encryption
2. Authentication relies solely on client-side localStorage
3. No token expiration or refresh mechanism
4. No protection against XSS attacks

For a production application, consider:
- Using JWT or session-based authentication
- Implementing password hashing (bcrypt, Argon2, etc.)
- Adding HTTPS and secure cookies
- Implementing CSRF protection

## Testing the Authentication

1. Register a new user
2. Log in with the registered credentials
3. Try accessing admin routes with a non-admin user
4. Create a test admin user in the database
5. Log in as admin and verify access to admin panel

## Further Enhancement Ideas

- Add password encryption
- Implement JWT token authentication
- Add email verification
- Implement password reset functionality
- Add two-factor authentication
