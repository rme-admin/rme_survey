"use client";

import { useState, useEffect } from "react";
import SurveyProfileForm from "./SurveyProfileForm";
import { createSurveyResponse, updateSurveyResponse } from "@/app/actions/surveyResponseStatus";
import { Button } from "@/components/ui/button";
import { linkedinUrl } from "@/lib/data/site-content.json";

export type Question = {
  id: number;
  statementA: string;
  statementB: string;
  optionA: string;
  optionB: string;
};


interface SurveyClientProps {
  questions: Question[];
  step: number;
  setStep: (step: number | ((prev: number) => number)) => void;
}

export default function SurveyClient({ questions, step, setStep }: SurveyClientProps) {
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [surveyStarted, setSurveyStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [surveyResponseId, setSurveyResponseId] = useState<number | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle profile form submit: create SurveyResponse and store ids
  const handleProfileSubmit = async (profile: any, createdProfileId: number) => {
    setProfileData(profile);
    setProfileId(createdProfileId);
    setSurveyStarted(true);
    setStep(1);
    const now = new Date().toISOString();
    try {
      const response = await createSurveyResponse({
        profileId: createdProfileId,
        answers: {},
        startTime: now,
      });
      setSurveyResponseId(response.id);
    } catch (err) {
      alert("Failed to start survey. Please try again.");
      setSurveyStarted(false);
      setStep(0);
    }
  };

  // Handle answer selection for a question
  // codeType: '1A' | '1B' | '2A' | '2B'
  const handleAnswer = async (questionId: number, codeType: '1A' | '1B' | '2A' | '2B', statement: string, option: string) => {
    const key = String(questionId);
    const updatedAnswers = {
      ...answers,
      [key]: { code: codeType, option, statement },
    };
    setAnswers(updatedAnswers);
    // Instantly move to next question or complete
    if (step === questions.length) {
      setCompleted(true);
    } else {
      setStep(step + 1);
    }
    // Fire-and-forget background submission
    setIsSubmitting(true);
    updateSurveyResponse({
      id: surveyResponseId,
      answers: updatedAnswers,
      status: step === questions.length ? "completed" : "inprogress",
      ...(step === questions.length && { endTime: new Date().toISOString() }),
    })
      .catch(() => {
        // Optionally, you can show a toast or log error, but don't block navigation
        // e.g. toast({ title: "Failed to save answer. Will retry at end." });
      })
      .finally(() => setIsSubmitting(false));
  };

  // Handle start over (reset state and create new SurveyResponse)
  const handleStartOver = async () => {
    setAnswers({});
    setStep(0);
    setSurveyStarted(false);
    setCompleted(false);
    setSurveyResponseId(null);
    setProfileData(null);
    setProfileId(null);
    // Optionally, you could re-create a new survey response here if needed
  };

  // Prevent SSR from accessing client state
  if (!hasMounted) {
    return null;
  }

  // Completion screen
  if (completed) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-12 bg-card rounded-2xl shadow-lg">
        <h2 className="text-3xl font-black mb-4 uppercase text-primary">Survey Complete</h2>
        <div className="w-20 h-1 bg-accent mx-auto mb-8" />
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Thank you for participating. Your valuable insights help us build a more effective research ecosystem in India.
        </p>
        <div className="mb-8 text-base text-gray-700 bg-gray-100 rounded-lg p-4 border border-gray-200">
          <strong>This form is exclusively developed and a product of IR-INFOTECH.</strong><br />
          To get this solution, reach us at <a href="mailto:support@irinfotech.com" className="text-blue-700 underline">support@irinfotech.com</a>
          {" "}or view our <a href="https://drive.google.com/file/d/1LF51tDoI6q_cdv2GS9SwjTg5S8uMXflY/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">IR INFOTECH brochure</a>.
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={() => window.open(linkedinUrl, "_blank")}
            className="bg-accent text-white px-8 py-4 font-bold uppercase">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 0: Profile form
  if (!surveyStarted && step === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <SurveyProfileForm onProfileSubmit={handleProfileSubmit} />
      </div>
    );
  }

  // Question steps
  if (step > 0 && step <= questions.length) {
    const q = questions[step - 1];
    const questionNum = step;
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center font-[Poppins] bg-white px-2 sm:px-4 md:px-8 py-6">
        {/* ...existing code... */}
        <div className="flex flex-col md:flex-row w-full max-w-6xl items-stretch md:items-center justify-center gap-6 md:gap-8">
          {/* Statement A */}
          <div className="flex-1 flex flex-col items-center mb-8 md:mb-0">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8 text-[#0A1629]">{q.statementA}</div>
            <div className="flex flex-col xs:flex-row gap-3 md:gap-4 w-full justify-center">
              <Button
                disabled={isSubmitting}
                onClick={() => handleAnswer(q.id, '1A', q.statementA, q.optionA)}
                className="bg-[#C6560A] text-white text-base md:text-lg font-bold px-6 md:px-8 py-3 rounded-md shadow-lg tracking-wide hover:bg-[#a94a08] transition-all w-full xs:w-auto"
                style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0px 4px 10px 0px rgba(198,86,10,0.15)" }}
              >
                {q.optionA.toUpperCase()}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleAnswer(q.id, '1B', q.statementA, q.optionB)}
                className="bg-[#C6560A] text-white text-base md:text-lg font-bold px-6 md:px-8 py-3 rounded-md shadow-lg tracking-wide hover:bg-[#a94a08] transition-all w-full xs:w-auto"
                style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0px 4px 10px 0px rgba(198,86,10,0.15)" }}
              >
                {q.optionB.toUpperCase()}
              </Button>
            </div>
          </div>
          {/* OR Divider */}
          <div className="hidden md:flex flex-col items-center justify-center relative h-full mx-4">
            <div className="w-px h-48 bg-[#E3E7ED] absolute left-1/2 top-0 -translate-x-1/2" />
            <div className="z-10 w-16 h-16 rounded-full bg-[#0A1629] flex items-center justify-center text-white text-xl font-bold mb-0 border-4 border-white" style={{ fontFamily: "Poppins, sans-serif" }}>OR</div>
          </div>
          <div className="flex md:hidden flex-row items-center justify-center my-4">
            <div className="z-10 w-12 h-12 rounded-full bg-[#0A1629] flex items-center justify-center text-white text-lg font-bold border-4 border-white" style={{ fontFamily: "Poppins, sans-serif" }}>OR</div>
          </div>
          {/* Statement B */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8 text-[#0A1629]">{q.statementB}</div>
            <div className="flex flex-col xs:flex-row gap-3 md:gap-4 w-full justify-center">
              <Button
                disabled={isSubmitting}
                onClick={() => handleAnswer(q.id, '2A', q.statementB, q.optionA)}
                className="bg-[#C6560A] text-white text-base md:text-lg font-bold px-6 md:px-8 py-3 rounded-md shadow-lg tracking-wide hover:bg-[#a94a08] transition-all w-full xs:w-auto"
                style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0px 4px 10px 0px rgba(198,86,10,0.15)" }}
              >
                {q.optionA.toUpperCase()}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleAnswer(q.id, '2B', q.statementB, q.optionB)}
                className="bg-[#C6560A] text-white text-base md:text-lg font-bold px-6 md:px-8 py-3 rounded-md shadow-lg tracking-wide hover:bg-[#a94a08] transition-all w-full xs:w-auto"
                style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0px 4px 10px 0px rgba(198,86,10,0.15)" }}
              >
                {q.optionB.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // fallback
  return (
    <div className="w-full max-w-2xl mx-auto text-center p-12">
      <p className="text-muted-foreground">Something went wrong. Please refresh the page and try again.</p>
      <Button variant="outline" onClick={handleStartOver} className="mt-4">Start Over</Button>
    </div>
  );
}
