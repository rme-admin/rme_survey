import Link from 'next/link';
import { db } from '@/lib/db';
import SurveyClientShell from '@/components/SurveyClientShell';


export default async function SurveyPage() {
  // Fetch all active questions
  const questions = await db.question.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }
  });

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border p-12 text-center max-w-lg shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 uppercase text-primary">No Active Surveys</h2>
          <p className="text-muted-foreground mb-8">
            There are currently no research questions available for evaluation. Please check back later.
          </p>
          <Link href="/" className="text-accent hover:underline font-bold uppercase tracking-widest">Return Home</Link>
        </div>
      </div>
    );
  }

  // Render the new survey client with all questions
  return <SurveyClientShell questions={questions} />;
}
