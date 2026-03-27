
'use server';

import { db } from '@/lib/db';
import { questions, responses } from '@/lib/db/schema';
import { eq, sql, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addQuestion(formData: FormData) {
  const statementA = formData.get('statementA') as string;
  const statementB = formData.get('statementB') as string;

  if (!statementA || !statementB) return { error: 'Both statements are required' };

  try {
    await db.insert(questions).values({
      statementA,
      statementB,
      isActive: true,
    });
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to add question:', error);
    return { error: 'Database insertion failed' };
  }
}

export async function toggleQuestionStatus(id: string, currentStatus: boolean) {
  try {
    await db.update(questions)
      .set({ isActive: !currentStatus })
      .where(eq(questions.id, id));
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Failed to toggle status:', error);
  }
}

export async function deleteQuestion(id: string) {
  try {
    await db.delete(questions).where(eq(questions.id, id));
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Failed to delete question:', error);
  }
}

export async function getStats() {
  try {
    const allQuestions = await db.select().from(questions);
    
    // Fetch counts for each choice per question
    const stats = await Promise.all(allQuestions.map(async (q) => {
      const countsA = await db.select({ count: count() })
        .from(responses)
        .where(sql`${responses.questionId} = ${q.id} AND ${responses.choice} LIKE 'A_%'`);
      
      const countsB = await db.select({ count: count() })
        .from(responses)
        .where(sql`${responses.questionId} = ${q.id} AND ${responses.choice} LIKE 'B_%'`);

      return {
        id: q.id,
        statementA: q.statementA,
        statementB: q.statementB,
        countA: Number(countsA[0]?.count || 0),
        countB: Number(countsB[0]?.count || 0),
        isActive: q.isActive,
      };
    }));

    return stats;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [];
  }
}
