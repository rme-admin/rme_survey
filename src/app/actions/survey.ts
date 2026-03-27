'use client';
// This file is now a client-side mock as we are bypassing Postgres errors.
// In a real scenario, this would be a 'use server' file.

import { z } from 'zod';

const responseSchema = z.object({
  questionId: z.string(),
  choice: z.enum(['A_AGREE', 'A_SOMETIMES', 'B_AGREE', 'B_SOMETIMES']),
});

const profileSchema = z.object({
  institute: z.string().min(2, "Institute name is required"),
  profession: z.enum(['Research Scholar', 'Bachelors', 'MSc', 'Faculty', 'Scientist']),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
});

export async function submitResponse(data: { questionId: string; choice: string }) {
  const validated = responseSchema.parse(data);
  console.log('Response submitted:', validated);
  return { success: true };
}

export async function submitProfile(data: any) {
  const validated = profileSchema.parse(data);
  console.log('Profile submitted:', validated);
  return { success: true };
}
