
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addQuestion(formData: FormData) {
  const statementA = formData.get('statementA') as string;
  const statementB = formData.get('statementB') as string;
  const optionA = formData.get('optionA') as string || "Completely Agree";
  const optionB = formData.get('optionB') as string || "Sometimes";

  if (!statementA || !statementB) return { error: 'Both statements are required' };

  try {
    await db.question.create({
      data: {
        statementA,
        statementB,
        optionA,
        optionB,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const stats = allQuestions.map((q) => {
      const countA = q.responses.filter(r => r.choice.startsWith('A_')).length;
      const countB = q.responses.filter(r => r.choice.startsWith('B_')).length;

      return {
        id: q.id,
        statementA: q.statementA,
        statementB: q.statementB,
        optionA: q.optionA,
        optionB: q.optionB,
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
