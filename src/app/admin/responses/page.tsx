
'use server';

import { BarChart3, Download, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { deleteResponseAndProfileAction, deleteAllResponsesAndProfilesAction } from './actions';


async function getAllResponses() {
  return db.response.findMany({
    include: {
      profile: true,
      question: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

function toCSV(rows: any[]) {
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
  'use server';
  const responses = await getAllResponses();
  return toCSV(responses);
}

export default async function AdminResponsesPage() {
  const responses = await getAllResponses();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold uppercase text-primary">All Survey Responses</h1>
          <Link href="/admin/profiles" className="text-primary underline text-sm">View by Profile</Link>
        </div>
        <div className="flex gap-2">
          {/* CSV Download Button Placeholder */}
          <a
            href="/api/admin/download-csv"
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md font-bold"
            download
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
          {/* Delete All Responses Button */}
          <form action={deleteAllResponsesAndProfilesAction}>
            <Button type="submit" className="flex items-center gap-2 bg-destructive text-white">
              <Trash2 className="h-4 w-4" /> Delete All
            </Button>
          </form>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Statement A</TableHead>
              <TableHead>Statement B</TableHead>
              <TableHead>Option Selected</TableHead>
              <TableHead>Choice</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell>{r.profile?.name || '-'}</TableCell>
                <TableCell>{r.profile?.profession || '-'}</TableCell>
                <TableCell>{r.profile?.institute || '-'}</TableCell>
                <TableCell>{r.profile?.email || '-'}</TableCell>
                <TableCell>{r.profile?.phone || '-'}</TableCell>
                <TableCell>{r.question?.statementA || '-'}</TableCell>
                <TableCell>{r.question?.statementB || '-'}</TableCell>
                <TableCell>{r.question?.optionA === r.choice ? r.question?.optionA : r.question?.optionB}</TableCell>
                <TableCell>{r.choice}</TableCell>
                <TableCell>{r.createdAt?.toLocaleString?.() || '-'}</TableCell>
                <TableCell>
                  <form action={deleteResponseAndProfileAction}>
                    <input type="hidden" name="responseId" value={r.id} />
                    <input type="hidden" name="profileId" value={r.profileId || ''} />
                    <Button type="submit" size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
