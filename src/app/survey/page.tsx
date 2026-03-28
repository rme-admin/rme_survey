import Image from 'next/image';
import siteContent from '@/lib/data/site-content.json';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import SurveyClientEntry from '@/components/SurveyClientEntry';
import SurveyProfileForm from '@/components/SurveyProfileForm';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';


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
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-white shadow-sm px-8 pt-6 pb-2 flex flex-col">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image 
                src={siteContent.logoUrl} 
                alt={siteContent.siteName} 
                width={40}
                height={40} 
                className="rounded-md"
              />
            </Link>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-[#4B5C6B] text-lg uppercase leading-tight">{siteContent.surveyTitle}</span>
                <span className="font-black text-xs text-[#4B5C6B] tracking-widest mb-1">QUESTION 1 OF {questions.length}</span>
            </div>
          </div>
            <div className="flex flex-col items-end">
              <div className="w-40 h-2 bg-[#F2F5F7] rounded-full">
                <div className="h-2 bg-[#C6560A] rounded-full" style={{ width: `${(1/questions.length)*100}%` }} />
              </div>
            </div>
        </div>
      </header>
        <main className="flex-1 flex items-center justify-center p-6 bg-white">
          {/* Pass all questions to SurveyClient for new flow */}
          <SurveyClientEntry questions={questions} />
        </main>

      <footer className="p-4 border-t border-border bg-card text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by {siteContent.siteName} • {siteContent.location}
        </p>
      </footer>
    </div>
  );
}
