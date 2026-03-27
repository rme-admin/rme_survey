import { db } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default async function AdminProfilesPage() {
  // Fetch all profiles and their responses
  const profiles = await db.profile.findMany({
    include: {
      responses: {
        include: { question: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold uppercase text-primary mb-8">Responses by Profile</h1>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Responses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name || '-'}</TableCell>
                <TableCell>{profile.profession || '-'}</TableCell>
                <TableCell>{profile.institute || '-'}</TableCell>
                <TableCell>{profile.email || '-'}</TableCell>
                <TableCell>{profile.phone || '-'}</TableCell>
                <TableCell>
                  <ul className="list-disc ml-4 space-y-1">
                    {profile.responses.length === 0 && <li className="text-muted-foreground text-xs">No responses</li>}
                    {profile.responses.map((r) => (
                      <li key={r.id}>
                        <span className="font-bold text-primary">{r.question?.statementA}</span> vs <span className="font-bold text-primary">{r.question?.statementB}</span>:
                        <span className="ml-2 text-accent font-semibold">{r.choice}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({r.createdAt?.toLocaleString?.() || '-'})</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <Link href="/admin/responses" className="text-primary underline">Back to All Responses</Link>
      </div>
    </div>
  );
}
