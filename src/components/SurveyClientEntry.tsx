"use client";
import SurveyClient from "@/components/SurveyClient";
import { Question } from "@/components/SurveyClient";

interface SurveyClientEntryProps {
  questions: Question[];
}
export default function SurveyClientEntry({ questions }: SurveyClientEntryProps) {
  return <SurveyClient questions={questions} />;
}
