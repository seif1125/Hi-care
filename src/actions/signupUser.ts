"use server";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export async function signupUser(userData: { name: string; email: string; insuranceId: string }) {
  // 1. In a real app, you'd save to your DB here (Prisma/Supabase/etc.)
  const mockUserId = `USR_${Math.random().toString(36).substr(2, 9)}`;

  // 2. Generate the Token
  const token = jwt.sign(
    { id: mockUserId, email: userData.email, role: 'patient' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    id: mockUserId,
    token: token
  };
}