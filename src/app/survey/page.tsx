import questionsData from '@/lib/data/questions.json';
import siteContent from '@/lib/data/site-content.json';
import SurveyClient from '@/components/SurveyClient';
import SurveyProfileForm from '@/components/SurveyProfileForm';
import Link from 'next/link';

export default async function SurveyPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const params = await searchParams;
  const step = parseInt(params.question || '0');

  const activeQuestions = questionsData.filter(q => q.isActive);
  const totalSteps = activeQuestions.length + 1; // Questions + Profile Step

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

  // Final Completion Screen
  if (step >= totalSteps) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border p-12 text-center max-w-lg shadow-lg rounded-2xl">
          <h2 className="text-3xl font-black mb-4 uppercase text-primary">Survey Complete</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8" />
          <p className="text-muted-foreground mb-12 leading-relaxed">
            Thank you for participating in the <span className="font-bold text-primary">{siteContent.surveyTitle}</span>. Your valuable insights help us build a more effective research ecosystem in India.
          </p>
          <Link href="/" className="bg-accent text-white px-12 py-5 uppercase font-black tracking-widest inline-block rounded-none hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200">
            Finish & Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Profile Form Step
  if (step === activeQuestions.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="p-6 border-b border-border bg-card shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                {siteContent.surveyTitle}
              </h1>
              <p className="text-xs text-primary font-bold uppercase italic">Final Step: Research Identity</p>
            </div>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500" 
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <SurveyProfileForm nextStep={step + 1} />
        </main>
      </div>
    );
  }

  // Question Step
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
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
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
