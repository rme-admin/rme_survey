"use client";
import SurveyClient from "@/components/SurveyClient";
import { Question } from "@/components/SurveyClient";
import { useState } from "react";

interface SurveyClientEntryProps {
  questions: Question[];
}


export default function SurveyClientEntry({ questions }: SurveyClientEntryProps) {
  const [step, setStep] = useState(0); // 0 = profile, 1...N = questions, N+1 = complete
  return <SurveyClient questions={questions} step={step} setStep={setStep} />;
}
