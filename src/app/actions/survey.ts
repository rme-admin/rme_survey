'use server';

import { db } from '@/lib/db';
import { Designation } from '@/generated/prisma-client';
import { z } from 'zod';
import { cookies } from 'next/headers';

const responseSchema = z.object({
  questionId: z.string(),
  choice: z.string(),
});

const profileSchema = z.object({
  institute: z.string().min(2, "Institute name is required"),
  profession: z.string().min(1, "Profession is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
});

// Deprecated: per-question response logic removed for new SurveyResponse model
// export async function submitResponse(data: { questionId: string; choice: string }) { ... }

export async function submitProfile(data: any) {
  try {
    const validated = profileSchema.parse(data);
    // Map user-friendly profession to Designation enum
      const professionMap: Record<string, Designation> = {
        'Undergraduate': Designation.UNDERGRADUATE,
        'Post Graduate': Designation.POSTGRADUATE,
        'Faculty': Designation.FACULTY,
        'Research Scholar': Designation.RESEARCH_SCHOLAR,
        'Scientist': Designation.INDUSTRY_PERSONNEL,
      };
      const designation: Designation = professionMap[validated.profession] || Designation.OTHER;
    const newProfile = await db.profile.create({
      data: {
        name: validated.name,
        designation,
        institute: validated.institute,
        email: validated.email,
        phone: validated.phone,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('survey_profile_id', String(newProfile.id), {
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      path: '/',
    });

    return { success: true, profileId: newProfile.id };
  } catch (error) {
    console.error('Failed to submit profile', error);
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.flatten() };
    }
    return { error: 'Database error' };
  }
}
