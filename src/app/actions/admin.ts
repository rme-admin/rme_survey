'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export async function addQuestion(formData: FormData) {
  const statementA = (formData.get('statementA') as string)?.trim();
  const statementB = (formData.get('statementB') as string)?.trim();
  const optionA = (formData.get('optionA') as string)?.trim() || "Completely Agree";
  const optionB = (formData.get('optionB') as string)?.trim() || "Sometimes";

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
      where: { id: Number(id) },
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
      where: { id: Number(id) },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Failed to delete question:', error);
  }
}

export async function getStats() {
  try {
    const allQuestions = await db.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Fetch all survey responses
    const allResponses = await db.surveyResponse.findMany({});

    // For each question, count 1A, 1B, 2A, 2B
    const stats = allQuestions.map((q) => {
      let count1A = 0, count1B = 0, count2A = 0, count2B = 0;
      for (const resp of allResponses) {
        let answers: Record<string, any> = {};
        try {
          answers = typeof resp.answers === 'object' ? resp.answers : JSON.parse(String(resp.answers || '{}'));
        } catch { answers = {}; }
        const ans = answers[String(q.id)];
        if (ans && ans.code) {
          if (ans.code === '1A') count1A++;
          else if (ans.code === '1B') count1B++;
          else if (ans.code === '2A') count2A++;
          else if (ans.code === '2B') count2B++;
        }
      }
      const total = count1A + count1B + count2A + count2B;
      return {
        id: q.id,
        statementA: q.statementA,
        statementB: q.statementB,
        optionA: q.optionA,
        optionB: q.optionB,
        count1A,
        count1B,
        count2A,
        count2B,
        ratio1A: total ? (count1A / total) * 100 : 0,
        ratio1B: total ? (count1B / total) * 100 : 0,
        ratio2A: total ? (count2A / total) * 100 : 0,
        ratio2B: total ? (count2B / total) * 100 : 0,
        total,
        isActive: q.isActive,
      };
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [];
  }
}

export async function deleteResponseAndProfile(responseId: string, profileId?: string) {
  try {
    // Always delete the response
    await db.surveyResponse.delete({ where: { id: Number(responseId) } });
    // If profileId is provided, delete the profile as well
    if (profileId) {
      await db.profile.delete({ where: { id: Number(profileId) } });
    }
    // Optionally, revalidate the admin responses page
    // revalidatePath('/admin/responses');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete response and profile:', error);
    return { error: 'Delete failed' };
  }
}

export async function deleteAllResponsesAndProfiles() {
  try {
    // Delete all responses first
    await db.surveyResponse.deleteMany({});
    // Then delete all profiles
    await db.profile.deleteMany({});
    // Optionally, revalidate the admin responses page
    // revalidatePath('/admin/responses');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete all responses and profiles:', error);
    return { error: 'Delete all failed' };
  }
}
