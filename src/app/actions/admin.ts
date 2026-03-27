'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addQuestion(formData: FormData) {
  const statementA = formData.get('statementA') as string;
  const statementB = formData.get('statementB') as string;

  if (!statementA || !statementB) return { error: 'Both statements are required' };

  try {
    await db.question.create({
      data: {
        statementA,
        statementB,
        isActive: true,
      },
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
    await db.question.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Failed to toggle status:', error);
  }
}

export async function deleteQuestion(id: string) {
  try {
    await db.question.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Failed to delete question:', error);
  }
}

export async function getStats() {
  try {
    const allQuestions = await db.question.findMany({
      include: {
        responses: true,
      },
    });
    
    const stats = allQuestions.map((q) => {
      const countA = q.responses.filter(r => r.choice.startsWith('A_')).length;
      const countB = q.responses.filter(r => r.choice.startsWith('B_')).length;

      return {
        id: q.id,
        statementA: q.statementA,
        statementB: q.statementB,
        countA,
        countB,
        isActive: q.isActive,
      };
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [];
  }
}
