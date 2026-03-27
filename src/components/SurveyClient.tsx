
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitResponse } from '@/app/actions/survey';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SurveyClientProps {
  question: {
    id: string;
    statementA: string;
    statementB: string;
  };
  nextStep: number;
}

export default function SurveyClient({ question, nextStep }: SurveyClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);

  const handleChoice = async (choice: 'A' | 'B') => {
    setSelected(choice);
    setIsSubmitting(true);
    
    try {
      await submitResponse({ questionId: question.id, choice });
      router.push(`/survey?question=${nextStep}`);
      setSelected(null);
    } catch (error) {
      console.error('Failed to submit response', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row gap-0 items-stretch min-h-[50vh]">
      {/* Statement A */}
      <button
        disabled={isSubmitting}
        onClick={() => handleChoice('A')}
        className={cn(
          "flex-1 p-12 text-left group transition-all duration-300 flex flex-col justify-center",
          "border-4 border-transparent hover:border-accent bg-card",
          selected === 'A' && "bg-primary border-accent"
        )}
      >
        <span className="text-accent font-black text-6xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">A</span>
        <p className="text-2xl md:text-3xl font-body leading-relaxed">
          {question.statementA}
        </p>
        <div className="mt-8 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">
          Select Statement A <ArrowRight className="h-4 w-4" />
        </div>
      </button>

      {/* Central OR Badge */}
      <div className="relative flex items-center justify-center py-4 md:py-0 md:px-4 z-10 pointer-events-none">
        <div className="h-px w-full md:w-px md:h-full bg-border absolute" />
        <div className="bg-accent text-white w-16 h-16 flex items-center justify-center font-black text-xl shadow-2xl relative">
          OR
        </div>
      </div>

      {/* Statement B */}
      <button
        disabled={isSubmitting}
        onClick={() => handleChoice('B')}
        className={cn(
          "flex-1 p-12 text-left md:text-right group transition-all duration-300 flex flex-col justify-center",
          "border-4 border-transparent hover:border-accent bg-card",
          selected === 'B' && "bg-primary border-accent"
        )}
      >
        <span className="text-accent font-black text-6xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">B</span>
        <p className="text-2xl md:text-3xl font-body leading-relaxed">
          {question.statementB}
        </p>
        <div className="mt-8 flex items-center md:justify-end gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Select Statement B
        </div>
      </button>
    </div>
  );
}
