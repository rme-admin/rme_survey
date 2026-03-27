
'use server';

import { db } from '@/lib/db';
import { responses } from '@/lib/db/schema';
import { z } from 'zod';
import { headers } from 'next/headers';

const responseSchema = z.object({
  questionId: z.string().uuid(),
  choice: z.enum(['A', 'B']),
});

export async function submitResponse(data: { questionId: string; choice: 'A' | 'B' }) {
  const validated = responseSchema.parse(data);
  const head = await headers();
  const metadata = JSON.stringify({
    userAgent: head.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  await db.insert(responses).values({
    questionId: validated.questionId,
    choice: validated.choice,
    metadata,
  });

  return { success: true };
}
