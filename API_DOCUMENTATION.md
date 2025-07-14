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
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```