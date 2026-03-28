"use client";
import SurveyClient from "@/components/SurveyClient";
import { Question } from "@/components/SurveyClient";
import { Button } from "@/components/ui/button"; 


interface SurveyClientWrapperProps {
  questions: Question[];
  step: number;
  total: number;
  onStartOver: () => void;
}

export default function SurveyClientWrapper({ questions, step, total, onStartOver }: SurveyClientWrapperProps) {
  return <SurveyClient questions={questions} step={step} total={total} onStartOver={onStartOver} />;
}
