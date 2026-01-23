"use server";

import { Doctor } from "@/types/index";

export async function getDoctorsAction(): Promise<Doctor[]> {
  const API_URL = process.env.DOCTORS_API_URL;

  if (!API_URL) throw new Error("DOCTORS_API_URL not configured");

  try {
    const res = await fetch(API_URL, {
      next: { 
        revalidate: 0, // 1 week cache
      },
    });

    if (!res.ok) return [];

    // 1. Read the body ONCE and store it
    const data: Doctor[] = await res.json();

    // 2. Now you can log it as much as you want
    console.log("Fetched Doctors Data:", data);

    // 3. Return the variable
    return data;

  } catch (error) {
    console.error("Doctor Fetch Error:", error);
    return [];
  }
}