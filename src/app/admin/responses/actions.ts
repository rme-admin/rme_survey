'use server';

import { db } from '@/lib/db';
import { deleteResponseAndProfile, deleteAllResponsesAndProfiles } from '@/app/actions/admin';
import { revalidatePath } from 'next/cache';

async function getAllResponses() {
  return db.response.findMany({
    include: {
      profile: true,
      question: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function toCSV(rows: any[]) {
  if (!rows.length) return '';
  const header = [
    'Profile Name', 'Profession', 'Institute', 'Email', 'Phone',
    'Statement A', 'Statement B', 'Option Selected', 'Choice', 'Timestamp'
  ];
  const csvRows = [header.join(',')];
  for (const r of rows) {
    csvRows.push([
      r.profile?.name || '',
      r.profile?.profession || '',
      r.profile?.institute || '',
      r.profile?.email || '',
      r.profile?.phone || '',
      r.question?.statementA || '',
      r.question?.statementB || '',
      r.question?.optionA === r.choice ? r.question?.optionA : r.question?.optionB,
      r.choice,
      r.createdAt?.toISOString?.() || ''
    ].map((v) => `"${String(v).replace(/"/g, '""')}` ).join(','));
  }
  return csvRows.join('\n');
}

export async function downloadCSV() {
  const responses = await getAllResponses();
  return await toCSV(responses);
}

export async function deleteResponseAndProfileAction(formData: FormData) {
  const responseId = formData.get('responseId') as string;
  const profileId = formData.get('profileId') as string;
  if (responseId && profileId) {
    await deleteResponseAndProfile(responseId, profileId);
    revalidatePath('/admin/responses');
  }
}

export async function deleteAllResponsesAndProfilesAction() {
  await deleteAllResponsesAndProfiles();
  revalidatePath('/admin/responses');
}

export { deleteAllResponsesAndProfiles };
