
'use server';

import { revalidatePath } from 'next/cache';
import questionsData from '@/lib/data/questions.json';

// Mocking actions to avoid Postgres errors until credentials are provided
export async function addQuestion(formData: FormData) {
  const statementA = formData.get('statementA') as string;
  const statementB = formData.get('statementB') as string;

  if (!statementA || !statementB) return { error: 'Both statements are required' };

  console.log('Admin: Add question requested', { statementA, statementB });
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function toggleQuestionStatus(id: string, currentStatus: boolean) {
  console.log('Admin: Toggle status', id, !currentStatus);
  revalidatePath('/admin/dashboard');
}

export async function deleteQuestion(id: string) {
  console.log('Admin: Delete question', id);
  revalidatePath('/admin/dashboard');
}

export async function getStats() {
  // Return mock stats based on JSON file
  return questionsData.map((q) => ({
    id: q.id,
    statementA: q.statementA,
    statementB: q.statementB,
    countA: 0,
    countB: 0,
    isActive: q.isActive
  }));
}
