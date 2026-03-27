
'use server';

import { db } from '@/lib/db';
import { questions, responses } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addQuestion(formData: FormData) {
  const statementA = formData.get('statementA') as string;
  const statementB = formData.get('statementB') as string;

  if (!statementA || !statementB) return { error: 'Both statements are required' };

  await db.insert(questions).values({
    statementA,
    statementB,
  });

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function toggleQuestionStatus(id: string, currentStatus: boolean) {
  await db.update(questions)
    .set({ isActive: !currentStatus })
    .where(eq(questions.id, id));
  revalidatePath('/admin/dashboard');
}

export async function deleteQuestion(id: string) {
  await db.delete(questions).where(eq(questions.id, id));
  revalidatePath('/admin/dashboard');
}

export async function getStats() {
  const allQuestions = await db.query.questions.findMany();
  const stats = await Promise.all(allQuestions.map(async (q) => {
    const [countA] = await db.select({ value: count() }).from(responses).where(eq(responses.questionId, q.id) && eq(responses.choice, 'A'));
    const [countB] = await db.select({ value: count() }).from(responses).where(eq(responses.questionId, q.id) && eq(responses.choice, 'B'));
    
    return {
      id: q.id,
      statementA: q.statementA,
      statementB: q.statementB,
      countA: Number(countA?.value || 0),
      countB: Number(countB?.value || 0),
      isActive: q.isActive
    };
  }));

  return stats;
}
