"use client";
import SurveyClient from "@/components/SurveyClient";
import { Question } from "@/components/SurveyClient";
interface SurveyClientEntryProps {
  questions: Question[];
  step: number;
  setStep: (step: number | ((prev: number) => number)) => void;
}

export default function SurveyClientEntry({ questions, step, setStep }: SurveyClientEntryProps) {
  return <SurveyClient questions={questions} step={step} setStep={setStep} />;
}
