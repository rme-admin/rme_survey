'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ExcelJS from 'exceljs';

export async function GET() {
  // Fetch responses and questions
  const responses = await db.surveyResponse.findMany({
    include: {
      profile: true,
    },
    orderBy: { startTime: 'desc' },
  });
  const questions = await db.question.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });

  // Build Excel workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Survey Responses');

  // Build header
  const questionHeaders = [];
  for (let i = 0; i < questions.length; i++) {
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
  sheet.addRow(header);

  // Add data rows
  for (const r of responses) {
    let answers = {};
    try {
      answers = typeof r.answers === 'object' ? r.answers : JSON.parse(r.answers || '{}');
    } catch { answers = {}; }
    const questionData = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const ans = answers[String(q.id)];
      const qOptions = `${q.statementA} | ${q.statementB} | ${q.optionA}/${q.optionB}`;
      let statement = 'NA', option = 'NA';
      if (ans && typeof ans === 'object') {
        statement = ans.statement || 'NA';
        option = ans.option || 'NA';
      } else if (typeof ans === 'string') {
        // fallback for old data: parse code
        if (ans.endsWith('A')) {
          statement = q.statementA;
          option = q.optionA;
        } else if (ans.endsWith('B')) {
          statement = q.statementB;
          option = q.optionB;
        }
      }
      questionData.push(
        qOptions || 'NA',
        statement,
        option
      );
    }
    // Only show time (HH:MM:SS) for start time and end time
    let startTime = 'NA', endTime = 'NA';
    if (r.startTime) {
      const d = new Date(r.startTime);
      startTime = d.toTimeString().slice(0, 8);
    }
    if (r.endTime) {
      const d = new Date(r.endTime);
      endTime = d.toTimeString().slice(0, 8);
    }
    const attemptDate = r.startTime ? new Date(r.startTime).toISOString().slice(0, 10) : 'NA';
    const row = [
      r.id ?? 'NA',
      r.profile?.name || 'NA',
      r.profile?.designation || 'NA',
      r.profile?.institute || 'NA',
      r.profile?.email || 'NA',
      r.profile?.phone || 'NA',
      ...questionData,
      startTime,
      endTime,
      attemptDate,
      r.device || 'NA',
      r.ip || 'NA',
      r.status || 'NA',
    ];
    while (row.length < header.length) row.push('NA');
    sheet.addRow(row);
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const filename = `responses_${dd}${mm}${yyyy}.xlsx`;
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
