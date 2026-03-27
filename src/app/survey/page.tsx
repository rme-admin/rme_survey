
import questionsData from '@/lib/data/questions.json';
import siteContent from '@/lib/data/site-content.json';
import SurveyClient from '@/components/SurveyClient';
import Link from 'next/link';

export default async function SurveyPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const params = await searchParams;
  const step = parseInt(params.question || '0');

  const activeQuestions = questionsData.filter(q => q.isActive);

  if (activeQuestions.length === 0) {
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

  if (step >= activeQuestions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border p-12 text-center max-w-lg shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 uppercase text-primary">Survey Complete</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for participating in the <span className="font-bold text-primary">{siteContent.surveyTitle}</span>. Your responses have been recorded successfully.
          </p>
          <Link href="/" className="bg-accent text-white px-8 py-4 uppercase font-bold inline-block rounded-lg hover:bg-orange-700 transition-colors">Finish</Link>
        </div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
              {siteContent.surveyTitle}
            </h1>
            <p className="text-xs text-primary font-bold uppercase">Question {step + 1} of {activeQuestions.length}</p>
          </div>
          <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500" 
              style={{ width: `${((step + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <SurveyClient 
          question={currentQuestion} 
          nextStep={step + 1} 
        />
      </main>

      <footer className="p-4 border-t border-border bg-card text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by {siteContent.siteName} • {siteContent.location}
        </p>
      </footer>
    </div>
  );
}
