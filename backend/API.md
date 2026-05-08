# Notes App API Documentation

## Base URL
`http://localhost:3000/api` (development)
`https://your-sealos-domain.com/api` (production)

## Authentication
Some endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### User Management

#### POST /users/register
Register a new user

**Request Body:**
```json
{
  "username": "string (3-30 chars)",
  "email": "valid email address",
  "password": "string (min 6 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "jwt token"
  },
  "message": "User registered successfully"
}
```

#### POST /users/login
Login an existing user

**Request Body:**
```json
{
  "email": "valid email address",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "jwt token"
  },
  "message": "Login successful"
}
```

#### GET /users/profile
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### Notes Management

#### GET /notes
Retrieve all notes with pagination

**Query Parameters:**
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 10, max: 100)
- `userId` (optional): filter by user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "_id": "string",
        "title": "string",
        "content": "string",
        "userId": "string",
        "createdAt": "ISO date string",
        "updatedAt": "ISO date string"
      }
    ],
    "totalPages": "number",
    "currentPage": "number",
    "totalNotes": "number"
  }
}
```

#### GET /notes/:id
Retrieve a specific note by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "userId": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

#### POST /notes
Create a new note

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (max 200 chars)",
  "content": "string",
  "userId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "userId": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Note created successfully"
}
```

#### PUT /notes/:id
Update an existing note

**Headers:**
```
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "userId": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Note updated successfully"
}
```

#### DELETE /notes/:id
Soft delete a note (mark as deleted)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "userId": "string",
    "isDeleted": true,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Note deleted successfully"
}
```

#### GET /notes/search/:query
Search notes by title or content

**Path Parameter:**
- `query`: search query string

**Query Parameters:**
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "_id": "string",
        "title": "string",
        "content": "string",
        "userId": "string",
        "createdAt": "ISO date string",
        "updatedAt": "ISO date string"
      }
    ],
    "totalPages": "number",
    "currentPage": "number",
    "totalResults": "number"
  }
}
```

## Error Responses

General error response format:
```json
{
  "success": false,
  "error": "error message",
  "details": "optional array of validation errors"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error