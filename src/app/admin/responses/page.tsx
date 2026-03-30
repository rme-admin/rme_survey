

export const dynamic = "force-dynamic";
'use server';

import { BarChart3, Download, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { deleteResponseAndProfileAction, deleteAllResponsesAndProfilesAction } from './actions';


async function getAllResponses() {
  return db.surveyResponse.findMany({
    include: {
      profile: true,
    },
    orderBy: { startTime: 'desc' },
  });
}

// CSV export logic will be updated in actions.ts

// CSV export logic will be updated in actions.ts

export default async function AdminResponsesPage() {
  const responses = await getAllResponses();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold uppercase text-primary">All Survey Responses</h1>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/download-csv"
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md font-bold"
            download
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
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
              <TableHead>Survey ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration (s)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((r: any) => {
              let duration = '-';
              if (r.startTime && r.endTime) {
                const start = new Date(r.startTime);
                const end = new Date(r.endTime);
                duration = ((end.getTime() - start.getTime()) / 1000).toFixed(0);
              } else if (r.duration != null) {
                duration = r.duration;
              }
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link href={`/admin/responses/${r.id}`} className="text-primary underline font-bold">
                      {r.id}
                    </Link>
                  </TableCell>
                  <TableCell>{r.profile?.name || '-'}</TableCell>
                  <TableCell>{r.profile?.designation || '-'}</TableCell>
                  <TableCell>{r.profile?.institute || '-'}</TableCell>
                  <TableCell>{r.profile?.email || '-'}</TableCell>
                  <TableCell>{r.profile?.phone || '-'}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>{duration}</TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
