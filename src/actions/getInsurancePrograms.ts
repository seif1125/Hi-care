"use server";

import { InsuranceProgram } from "@/types/index";

export async function getInsurancePrograms(): Promise<InsuranceProgram[]> {
  const API_URL = process.env.INSURANCE_API_URL;

  if (!API_URL) {
    console.error("Environment variable INSURANCE_API_URL is missing.");
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      // ISR: Cache data for 24 hours to optimize performance
      next: { revalidate: 86400 }, 
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data: InsuranceProgram[] = await res.json();
    return data;
  } catch (error) {
    // In a real production app, you might log this to Sentry
    console.error("Critical: Failed to fetch localized insurance programs", error);
    return [];
  }
}