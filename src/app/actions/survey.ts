
'use server';

import { z } from 'zod';

const responseSchema = z.object({
  questionId: z.string(),
  choice: z.enum(['A_AGREE', 'A_SOMETIMES', 'B_AGREE', 'B_SOMETIMES']),
});

export async function submitResponse(data: { questionId: string; choice: string }) {
  const validated = responseSchema.parse(data);
  
  // Mocking database submission to avoid connection errors
  console.log('Response submitted:', validated);
  
  // In a real scenario, you would save this to a file or wait for Postgres
  return { success: true };
}
