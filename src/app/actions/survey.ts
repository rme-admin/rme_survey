'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';

const responseSchema = z.object({
  questionId: z.string(),
  choice: z.enum(['A_AGREE', 'A_SOMETIMES', 'B_AGREE', 'B_SOMETIMES']),
});

const profileSchema = z.object({
  institute: z.string().min(2, "Institute name is required"),
  profession: z.string().min(1, "Profession is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
});

export async function submitResponse(data: { questionId: string; choice: string }) {
  try {
    const validated = responseSchema.parse(data);
    const cookieStore = await cookies();
    const profileId = cookieStore.get('survey_profile_id')?.value;

    await db.response.create({
      data: {
        questionId: validated.questionId,
        choice: validated.choice,
        profileId: profileId || null,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit response:', error);
    return { error: 'Submission failed' };
  }
}

export async function submitProfile(data: any) {
  try {
    const validated = profileSchema.parse(data);
    
    const newProfile = await db.profile.create({
      data: {
        name: validated.name,
        profession: validated.profession,
        institute: validated.institute,
        email: validated.email,
        phone: validated.phone,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('survey_profile_id', newProfile.id, {
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to submit profile:', error);
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.flatten() };
    }
    return { error: 'Database error' };
  }
}
