'use server';

import { db } from '@/lib/db';
import { z } from 'zod';

const createSurveyResponseSchema = z.object({
  profileId: z.number(),
  answers: z.any(),
  startTime: z.string(),
  ip: z.string().optional(),
  device: z.string().optional(),
});

const updateSurveyResponseSchema = z.object({
  id: z.number(),
  answers: z.any().optional(),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['completed', 'inprogress']).optional(),
});

export async function createSurveyResponse(data: any) {
  const validated = createSurveyResponseSchema.parse(data);
  const response = await db.surveyResponse.create({
    data: {
      profileId: validated.profileId,
      answers: validated.answers,
      startTime: new Date(validated.startTime),
      status: 'inprogress',
      ip: validated.ip,
      device: validated.device,
    },
  });
  return response;
}

export async function updateSurveyResponse(data: any) {
  const validated = updateSurveyResponseSchema.parse(data);
  const response = await db.surveyResponse.update({
    where: { id: validated.id },
    data: {
      ...(validated.answers !== undefined && { answers: validated.answers }),
      ...(validated.endTime && { endTime: new Date(validated.endTime) }),
      ...(validated.duration !== undefined && { duration: validated.duration }),
      ...(validated.status && { status: validated.status }),
    },
  });
  return response;
}

export async function findSurveyByIpDevice({ ip, device }: { ip: string, device: string }) {
  return db.surveyResponse.findFirst({
    where: {
      ip,
      device,
      status: { in: ['inprogress', 'completed'] },
    },
  });
}
