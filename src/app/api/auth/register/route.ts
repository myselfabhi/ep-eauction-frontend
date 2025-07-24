import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Types
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  profile: {
    companyName: string;
    country: string;
    portOfLoading: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Viewer' | 'Supplier';
  isVerified: boolean;
  profile: {
    companyName: string;
    registrationNumber: string;
    country: string;
    portOfLoading: string;
  };
  createdAt: Date;
}

interface Auction {
  _id: string;
  invitedSuppliers: string[];
}

// Mock database functions (replace with actual database calls)
const mockDb = {
  users: new Map<string, User>(),
  auctions: new Map<string, Auction>(),
  
  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },
  
  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const id = Math.random().toString(36).substr(2, 9);
    const user: User = {
      _id: id,
      ...userData,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  },
  
  async findAuctionsByEmail(email: string): Promise<Auction[]> {
    const auctions: Auction[] = [];
    for (const auction of this.auctions.values()) {
      if (auction.invitedSuppliers.includes(email)) {
        auctions.push(auction);
      }
    }
    return auctions;
  },
  
  async updateAuctionSuppliers(auctionId: string, oldEmail: string, newUserId: string): Promise<void> {
    const auction = this.auctions.get(auctionId);
    if (auction) {
      const emailIndex = auction.invitedSuppliers.indexOf(oldEmail);
      if (emailIndex !== -1) {
        auction.invitedSuppliers[emailIndex] = newUserId;
      }
    }
  }
};

// Helper function to generate registration number
function generateRegistrationNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  
  return `SUP-${year}${month}${day}-${random}`;
}

// Validation function
function validateRequest(body: RegisterRequest): { isValid: boolean; error?: string } {
  const requiredFields = ['name', 'email', 'password', 'role'];
  const requiredProfileFields = ['companyName', 'country', 'portOfLoading'];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!body[field as keyof RegisterRequest]) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Check required profile fields
  if (!body.profile) {
    return { isValid: false, error: 'Missing required field: profile' };
  }
  
  for (const field of requiredProfileFields) {
    if (!body.profile[field as keyof typeof body.profile]) {
      return { isValid: false, error: `Missing required field: profile.${field}` };
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Validate password length
  if (body.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // Validate request
    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Check if only Supplier role is allowed
    if (body.role !== 'Supplier') {
      return NextResponse.json(
        { error: 'Only Supplier registration is allowed here.' },
        { status: 403 }
      );
    }
    
    // Check if user already exists
    const existingUser = await mockDb.findUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    
    // Generate registration number
    const registrationNumber = generateRegistrationNumber();
    
    // Create user
    const userData = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: 'Supplier' as const,
      isVerified: false,
      profile: {
        companyName: body.profile.companyName,
        registrationNumber,
        country: body.profile.country,
        portOfLoading: body.profile.portOfLoading,
      }
    };
    
    const newUser = await mockDb.createUser(userData);
    
    // Find and update auctions that have this email in invitedSuppliers
    const auctionsToUpdate = await mockDb.findAuctionsByEmail(body.email);
    let auctionsUpdated = 0;
    
    for (const auction of auctionsToUpdate) {
      await mockDb.updateAuctionSuppliers(auction._id, body.email, newUser._id);
      auctionsUpdated++;
    }
    
    // Return success response
    return NextResponse.json(
      {
        message: 'Registration successful',
        auctionsUpdated
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 