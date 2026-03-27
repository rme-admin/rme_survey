
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitResponse } from '@/app/actions/survey';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [selected, setSelected] = useState<string | null>(null);

  const handleChoice = async (choice: string) => {
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
    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-4 md:gap-0">
      {/* Column A */}
      <div className="flex-1 flex flex-col items-center gap-8 p-6 text-center">
        <p className="text-lg md:text-2xl font-medium leading-relaxed min-h-[100px] flex items-center">
          {question.statementA}
        </p>
        <div className="flex gap-4 w-full justify-center">
          <Button
            disabled={isSubmitting}
            onClick={() => handleChoice('A_AGREE')}
            className={cn(
              "flex-1 max-w-[200px] py-6 text-lg font-bold uppercase transition-all duration-300",
              "bg-accent hover:bg-orange-600 text-white border-b-4 border-orange-800",
              selected === 'A_AGREE' && "ring-4 ring-white"
            )}
          >
            Completely Agree
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => handleChoice('A_SOMETIMES')}
            className={cn(
              "flex-1 max-w-[200px] py-6 text-lg font-bold uppercase transition-all duration-300",
              "bg-accent hover:bg-orange-600 text-white border-b-4 border-orange-800",
              selected === 'A_SOMETIMES' && "ring-4 ring-white"
            )}
          >
            Sometimes
          </Button>
        </div>
      </div>

      {/* Central OR Circle */}
      <div className="relative flex items-center justify-center p-4">
        <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-xl z-10">
          OR
        </div>
        <div className="hidden md:block absolute w-[2px] h-[300px] bg-border -z-0" />
      </div>

      {/* Column B */}
      <div className="flex-1 flex flex-col items-center gap-8 p-6 text-center">
        <p className="text-lg md:text-2xl font-medium leading-relaxed min-h-[100px] flex items-center">
          {question.statementB}
        </p>
        <div className="flex gap-4 w-full justify-center">
          <Button
            disabled={isSubmitting}
            onClick={() => handleChoice('B_AGREE')}
            className={cn(
              "flex-1 max-w-[200px] py-6 text-lg font-bold uppercase transition-all duration-300",
              "bg-accent hover:bg-orange-600 text-white border-b-4 border-orange-800",
              selected === 'B_AGREE' && "ring-4 ring-white"
            )}
          >
            Completely Agree
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => handleChoice('B_SOMETIMES')}
            className={cn(
              "flex-1 max-w-[200px] py-6 text-lg font-bold uppercase transition-all duration-300",
              "bg-accent hover:bg-orange-600 text-white border-b-4 border-orange-800",
              selected === 'B_SOMETIMES' && "ring-4 ring-white"
            )}
          >
            Sometimes
          </Button>
        </div>
      </div>
    </div>
  );
}
