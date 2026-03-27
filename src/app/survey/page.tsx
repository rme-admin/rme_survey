
import questionsData from '@/lib/data/questions.json';
import SurveyClient from '@/components/SurveyClient';

export default async function SurveyPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const params = await searchParams;
  const step = parseInt(params.question || '0');

  // Using JSON data instead of DB to avoid connection errors
  const activeQuestions = questionsData.filter(q => q.isActive);

  if (activeQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border p-12 text-center max-w-lg">
          <h2 className="text-2xl font-bold mb-4">NO ACTIVE SURVEYS</h2>
          <p className="text-muted-foreground mb-8">
            There are currently no research questions available for evaluation. Please check back later.
          </p>
          <a href="/" className="text-accent hover:underline font-bold">Return Home</a>
        </div>
      </div>
    );
  }

  if (step >= activeQuestions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border p-12 text-center max-w-lg">
          <h2 className="text-2xl font-bold mb-4">SURVEY COMPLETE</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for participating in this research study. Your responses have been recorded successfully.
          </p>
          <a href="/" className="bg-accent text-white px-8 py-4 uppercase font-bold inline-block">Finish</a>
        </div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Comparison Study <span className="text-white ml-2">Question {step + 1} of {activeQuestions.length}</span>
          </h1>
          <div className="w-48 h-1 bg-secondary">
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
    </div>
  );
}
