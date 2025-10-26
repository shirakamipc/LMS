# Authentication & Authorization Setup

This document describes the authentication and authorization implementation for the LMS backend.

## Overview

The application uses JWT (JSON Web Tokens) for authentication with a single role-based system. All endpoints require authentication except for the auth endpoints themselves.

## Authentication Endpoints

### Sign Up
- **POST** `/auth/signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "fullName": "John Doe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER"
    }
  }
  ```

### Sign In
- **POST** `/auth/signin`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as signup

### Refresh Token
- **POST** `/auth/refresh`
- **Body:**
  ```json
  {
    "refresh_token": "refresh_token_here"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "new_jwt_token_here"
  }
  ```

### Logout
- **POST** `/auth/logout`
- **Body:**
  ```json
  {
    "refresh_token": "refresh_token_here"
  }
  ```

## Protected Endpoints

All other endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PASSWORD_SALT="your-password-salt-change-this-in-production"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Security Features

1. **Password Hashing**: Uses PBKDF2 with SHA-512 and salt
2. **JWT Tokens**: 15-minute expiration for access tokens
3. **Refresh Tokens**: 7-day expiration for refresh tokens
4. **Input Validation**: All DTOs have proper validation
5. **Error Handling**: Comprehensive error messages

## Usage

1. Start the server: `npm run start:dev`
2. Register a new user: `POST /auth/signup`
3. Sign in: `POST /auth/signin`
4. Use the access token in subsequent requests
5. Refresh token when it expires: `POST /auth/refresh`

## Testing

You can test the authentication using tools like Postman or curl:

```bash
# Sign up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User","password":"password123"}'

# Sign in
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access protected endpoint
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer <your_jwt_token>"
```
