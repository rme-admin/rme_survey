'use server';

import { db } from '@/lib/db';
import { z } from 'zod';

const surveyResponseSchema = z.object({
  profileId: z.number(),
  answers: z.any(), // JSON object
  startTime: z.string(), // ISO string
  endTime: z.string(),   // ISO string
  duration: z.number(),  // seconds or ms
});

export async function submitSurveyResponse(data: any) {
  try {
    const validated = surveyResponseSchema.parse(data);
    await db.surveyResponse.create({
      data: {
        profileId: validated.profileId,
        answers: validated.answers,
        startTime: new Date(validated.startTime),
        endTime: new Date(validated.endTime),
        duration: validated.duration,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to submit survey response:', error);
    return { error: 'Submission failed' };
  }
}
