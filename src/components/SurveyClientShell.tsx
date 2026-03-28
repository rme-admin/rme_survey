"use client";
import Image from 'next/image';
import siteContent from '@/lib/data/site-content.json';
import Link from 'next/link';
import { useState } from "react";
import SurveyClientEntry from '@/components/SurveyClientEntry';

interface SurveyClientShellProps {
  questions: any[];
}

export default function SurveyClientShell({ questions }: SurveyClientShellProps) {
  const [step, setStep] = useState(0);
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
                <span className="font-black text-xs text-[#4B5C6B] tracking-widest mb-1">QUESTION {step > 0 ? step : 1} OF {questions.length}</span>
            </div>
          </div>
            <div className="flex flex-col items-end">
              <div className="w-40 h-2 bg-[#F2F5F7] rounded-full">
                <div className="h-2 bg-[#C6560A] rounded-full" style={{ width: `${((step > 0 ? step : 1)/questions.length)*100}%` }} />
              </div>
            </div>
        </div>
      </header>
        <main className="flex-1 flex items-center justify-center p-6 bg-white">
          <SurveyClientEntry questions={questions} step={step} setStep={setStep} />
        </main>
      <footer className="p-4 border-t border-border bg-card text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by {siteContent.siteName} • {siteContent.location}
        </p>
      </footer>
    </div>
  );
}
