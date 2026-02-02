"use server";
import { Doctor } from "@/types";
import { image } from "framer-motion/client";
import jwt from "jsonwebtoken";

// Use the secret from your .env
const SECRET = process.env.JWT_SECRET!;

export async function signupPatient(userData: { name: string; email: string; insuranceId: string }) {
  try {
    // In a real app, you'd do: const user = await prisma.user.create({ data: ... })
    const mockUserId = `PAT_${Math.random().toString(36).substr(2, 9)}`;

    // Generate the token dynamically including name and role
    const token = jwt.sign(
      { 
        id: mockUserId, 
        name: userData.name, 
        role: 'patient' 
      }, 
      SECRET, 
      { expiresIn: '7d' }
    );

    return {
      success: true,
      id: mockUserId,
      token: token
    };
  } catch (error) {
    console.error("JWT Generation Error:", error);
    return { success: false };
  }
}

// Handle Doctor Login/Signup
export async function loginDoctor(pin: string) {
 
   
  try {
    const doctors = await fetch(process.env.DOCTORS_API_URL!)
      .then(res => res.json());

    // 1. Search for the doctor whose ID matches the entered PIN
    const doctor = doctors.find((d:Doctor) => d.id === pin);

    // 2. If not found, deny access
    if (!doctor) {
      return { success: false, error: "Invalid Doctor ID/PIN" };
    }

    // 3. Generate a professional JWT
    // We include the ID and role so the WebSocket server knows who this is
    const token = jwt.sign(
      { 
        id: doctor.id, 
        name: doctor.name_en, 
        role: 'doctor' 
      }, 
      SECRET, 
      { expiresIn: '12h' } // Doctors usually need shorter sessions for security
    );

    return {
      success: true,
      id: doctor.id,
      name: doctor.name_en,
      image: doctor.image,
      token: token
    };
  } catch (error) {
    console.error("Auth Error:", error);
    return { success: false, error: "Server authentication failed" };
  }
}