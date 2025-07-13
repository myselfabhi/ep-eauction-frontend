# Supplier Registration API Documentation

## Overview
This document describes the implementation of the supplier registration API endpoint for the e-auction platform.

## Endpoint Details

### POST /api/auth/register

**Purpose**: Register a new supplier user in the system

### Request Payload
```json
{
  "name": "Supplier Name",
  "email": "supplier@example.com", 
  "password": "password123",
  "role": "Supplier",
  "profile": {
    "companyName": "ABC Manufacturing Ltd",
    "country": "United States",
    "portOfLoading": "Los Angeles"
  }
}
```

### Required Fields
- `name` (string): Full name of the supplier
- `email` (string): Unique email address  
- `password` (string): Password for the account (minimum 6 characters)
- `role` (string): Must be "Supplier" (only supplier registration allowed)
- `profile.companyName` (string): Company name
- `profile.country` (string): Country of operation
- `profile.portOfLoading` (string): Port of loading

### Success Response (201)
```json
{
  "message": "Registration successful",
  "auctionsUpdated": 2
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "User already exists"
}
```
```json
{
  "error": "Missing required field: email"
}
```
```json
{
  "error": "Invalid email format"
}
```
```json
{
  "error": "Password must be at least 6 characters long"
}
```

#### 403 Forbidden
```json
{
  "error": "Only Supplier registration is allowed here."
}
```

#### 500 Internal Server Error
```json
{
  "error": "Registration failed",
  "details": "Error details"
}
```

## Implementation Features

### 1. Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Secure password storage in the database

### 2. Registration Number Generation
- Auto-generates registration number in format: `SUP-YYYYMMDD-XXXXX`
- Example: `SUP-20241201-A1B2C`

### 3. Role Validation
- Only allows "Supplier" role for public registration
- Prevents unauthorized role assignments

### 4. Auction Integration
- Automatically finds auctions that have the supplier's email in `invitedSuppliers`
- Updates those auctions to use the new user ID instead of email
- Returns count of auctions updated

### 5. Data Validation
- Comprehensive field validation
- Email format validation
- Password length validation
- Required field checking

### 6. User Profile
- Creates complete user profile with:
  - Company name
  - Registration number
  - Country
  - Port of loading
- Sets `isVerified` to `false` by default
- Adds `createdAt` timestamp

## Database Schema

### User Model
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'Admin' | 'Manager' | 'Viewer' | 'Supplier';
  isVerified: boolean; // defaults to false
  profile: {
    companyName: string;
    registrationNumber: string;
    country: string;
    portOfLoading: string;
  };
  createdAt: Date;
}
```

## Frontend Integration

The frontend has been updated to use the new API endpoint:

### Updated API Call
```typescript
const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### Updated Payload Structure
```typescript
const payload = {
  name: data.name,
  email: data.email,
  password: data.password,
  role: 'Supplier', // Updated to match API requirements
  profile: {
    companyName: data.name,
    country: data.country,
    portOfLoading: data.port,
  },
};
```

## Testing

### Test Endpoint
A test endpoint is available at `/api/test` to verify API functionality.

### Manual Testing
You can test the registration API using tools like Postman or curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Supplier",
    "email": "test@example.com",
    "password": "password123",
    "role": "Supplier",
    "profile": {
      "companyName": "Test Company",
      "country": "India",
      "portOfLoading": "Mumbai"
    }
  }'
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **Input Validation**: Comprehensive validation of all input fields
3. **Role Restriction**: Only supplier registration is allowed
4. **Email Uniqueness**: Prevents duplicate user registration
5. **Error Handling**: Proper error responses without exposing sensitive information

## Future Enhancements

1. **Email Verification**: Implement email verification flow
2. **JWT Token**: Return JWT token after successful registration
3. **Database Integration**: Replace mock database with real database (MongoDB/PostgreSQL)
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Logging**: Add comprehensive logging for monitoring
6. **Audit Trail**: Track registration attempts and failures

## Dependencies

- `bcrypt`: For password hashing
- `@types/bcrypt`: TypeScript types for bcrypt
- `next/server`: Next.js server components

## Installation

The required dependencies have been installed:

```bash
npm install bcrypt @types/bcrypt
```

## Notes

- Currently uses a mock database for demonstration purposes
- Replace mock database functions with actual database calls
- Implement proper authentication flow after registration
- Add proper error logging and monitoring
- Consider adding email verification before allowing login 