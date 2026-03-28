"use server";

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';


// Clear all survey data and reset auto-increment index for SurveyResponse and Profile
export async function clearAllAndResetIndex() {
  await db.surveyResponse.deleteMany({});
  await db.profile.deleteMany({});
  // Reset auto-increment index for PostgreSQL (works for MySQL too, adjust if needed)
  // For PostgreSQL, the sequence name is usually <table>_<column>_seq
  await db.$executeRawUnsafe('ALTER SEQUENCE "SurveyResponse_id_seq" RESTART WITH 1');
  await db.$executeRawUnsafe('ALTER SEQUENCE "Profile_id_seq" RESTART WITH 1');
  // If you use MySQL, use: ALTER TABLE SurveyResponse AUTO_INCREMENT = 1;
  // and: ALTER TABLE Profile AUTO_INCREMENT = 1;
  revalidatePath('/admin/responses');
}


// Dynamically fetch questions from the database for accurate columns

async function getAllResponses() {
  return db.surveyResponse.findMany({
    include: {
      profile: true,
    },
    orderBy: { startTime: 'desc' },
  });
}

export async function toCSV(rows: any[]) {
  if (!rows.length) return '';
  // Fetch all active questions from the database, ordered by id
  const dbQuestions = await db.question.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });
  const questionCount = dbQuestions.length;
  const questionHeaders = [];
  for (let i = 0; i < questionCount; i++) {
    const qNum = i + 1;
    questionHeaders.push(
      `question+options(${qNum})`,
      `statement answered(${qNum})`,
      `option selected(${qNum})`
    );
  }
  const header = [
    'response id',
    'name',
    'designation',
    'Institute',
    'email',
    'phone',
    ...questionHeaders,
    'start time',
    'end time',
    'attempt date',
    'device',
    'ip',
    'status',
  ];
  const sep = '|';
  const csvRows = [header.join(sep)];
  for (const r of rows) {
    // Parse answers: { [questionId]: { statement: string, option: string } }
    let answers: Record<string, any> = {};
    try {
      answers = typeof r.answers === 'object' ? r.answers : JSON.parse(r.answers || '{}');
    } catch {
      answers = {};
    }
    const questionData = [];
    for (let i = 0; i < questionCount; i++) {
      const q = dbQuestions[i];
      const ans = answers[q.id] || {};
      // question+options: statementA + ' | ' + statementB + ' | ' + optionA + '/' + optionB
      const qOptions = `${q.statementA} | ${q.statementB} | ${q.optionA}/${q.optionB}`;
      questionData.push(
        (qOptions ? String(qOptions).replace(/\|/g, ' ') : 'NA'),
        (ans.statement ? String(ans.statement).replace(/\|/g, ' ') : 'NA'),
        (ans.option ? String(ans.option).replace(/\|/g, ' ') : 'NA')
      );
    }
    // Format attempt date as YYYY-MM-DD
    const attemptDate = r.startTime ? new Date(r.startTime).toISOString().slice(0, 10) : 'NA';
    // Always fill all fields, use 'NA' if missing
    const row = [
      r.id ?? 'NA',
      r.profile?.name ? String(r.profile.name).replace(/\|/g, ' ') : 'NA',
      r.profile?.designation ? String(r.profile.designation).replace(/\|/g, ' ') : 'NA',
      r.profile?.institute ? String(r.profile.institute).replace(/\|/g, ' ') : 'NA',
      r.profile?.email ? String(r.profile.email).replace(/\|/g, ' ') : 'NA',
      r.profile?.phone ? String(r.profile.phone).replace(/\|/g, ' ') : 'NA',
      ...questionData,
      r.startTime ? new Date(r.startTime).toISOString() : 'NA',
      r.endTime ? new Date(r.endTime).toISOString() : 'NA',
      attemptDate,
      r.device ? String(r.device).replace(/\|/g, ' ') : 'NA',
      r.ip ? String(r.ip).replace(/\|/g, ' ') : 'NA',
      r.status ? String(r.status).replace(/\|/g, ' ') : 'NA',
    ];
    // Ensure row length matches header
    while (row.length < header.length) row.push('NA');
    csvRows.push(row.join(sep));
  }
  return csvRows.join('\n');
}

export async function downloadCSV() {
  const responses = await getAllResponses();
  return await toCSV(responses);
}

export async function deleteResponseAndProfileAction(formData: FormData) {
  const responseId = formData.get('responseId');
  const profileId = formData.get('profileId');
  const responseIdInt = responseId ? parseInt(responseId as string, 10) : undefined;
  const profileIdInt = profileId ? parseInt(profileId as string, 10) : undefined;
  if (responseIdInt) {
    await db.surveyResponse.delete({ where: { id: responseIdInt } });
    if (profileIdInt) {
      await db.profile.delete({ where: { id: profileIdInt } });
    }
    revalidatePath('/admin/responses');
  }
}

export async function deleteAllResponsesAndProfilesAction() {
  await db.surveyResponse.deleteMany({});
  await db.profile.deleteMany({});
  revalidatePath('/admin/responses');
}

