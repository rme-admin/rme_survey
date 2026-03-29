import { db } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function SurveyResponseDetailPage({ params }: Props) {
  const responseId = Number(params.id);
  const response = await db.surveyResponse.findUnique({
    where: { id: responseId },
    include: { profile: true },
  });
  const questions = await db.question.findMany({ orderBy: { createdAt: 'asc' } });

  if (!response) {
    return <div className="p-8">Survey response not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase text-primary">Survey Response #{response.id}</h1>
        <Link href="/admin/responses" className="text-primary underline text-sm">Back to Responses</Link>
      </div>
      <div className="mb-6 bg-card p-6 rounded-xl border border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>Name:</b> {response.profile?.name || '-'}</div>
          <div><b>Designation:</b> {response.profile?.designation || '-'}</div>
          <div><b>Institute:</b> {response.profile?.institute || '-'}</div>
          <div><b>Email:</b> {response.profile?.email || '-'}</div>
          <div><b>Phone:</b> {response.profile?.phone || '-'}</div>
          <div><b>Status:</b> {response.status}</div>
          <div><b>Start Time:</b> {response.startTime ? new Date(response.startTime).toLocaleString() : '-'}</div>
          <div><b>End Time:</b> {response.endTime ? new Date(response.endTime).toLocaleString() : '-'}</div>
          <div><b>Duration (s):</b> {response.duration != null ? response.duration : '-'}</div>
          <div><b>IP:</b> {response.ip || '-'}</div>
          <div><b>Device:</b> {response.device || '-'}</div>
        </div>
      </div>
      <div className="bg-card p-6 rounded-xl border border-border">
        <h2 className="text-lg font-bold mb-4">Question-wise Responses</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Selected Option</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, idx) => {
              const answer = response.answers?.[q.id];
              return (
                <TableRow key={q.id}>
                  <TableCell>
                    <div className="font-semibold">A: {q.statementA}</div>
                    <div className="font-semibold">B: {q.statementB}</div>
                  </TableCell>
                  <TableCell>
                    {answer && typeof answer === 'object' ? (
                      <span className="font-bold text-primary">{answer.option}</span>
                    ) : answer ? (
                      <span className="font-bold text-primary">{answer}</span>
                    ) : (
                      <span className="text-muted-foreground">No response</span>
                    )}
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
