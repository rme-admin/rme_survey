'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toCSV } from '@/app/admin/responses/actions';

export async function GET() {
  const responses = await db.response.findMany({
    include: {
      profile: true,
      question: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const csv = await toCSV(responses);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="responses.csv"',
    },
  });
}
