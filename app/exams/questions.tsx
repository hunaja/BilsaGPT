"use client";

import React from "react";
import { Exam, Question } from "@prisma/client";
import Link from "next/link";
import useSWR from "swr";

import { TopAnswers } from "@/services/questions";

type Props = {
  accessToken: string;
  exam: Exam;
  questions: Question[];
  initialTopAnswers: TopAnswers;
};

export default function QuestionsList({
  accessToken,
  exam,
  questions,
  initialTopAnswers,
}: Props) {
  const { data: topAnswers } = useSWR(
    `/api/exams/${exam.id}/progress`,
    async () =>
      fetch(`/api/exams/${exam.id}/progress`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()) as Promise<TopAnswers>,
    {
      fallbackData: initialTopAnswers,
      revalidateOnMount: false,
    }
  );

  return (
    <>
      {topAnswers.grade ? (
        <p>Arvosana {topAnswers.grade}</p>
      ) : (
        <p>Ei arvosanaa</p>
      )}
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="p-3 flex justify-between">
            <span>
              {question.number}.{" "}
              <Link
                href={`/exams/${exam.name}/questions/${question.number}`}
                className="text-red-500 hover:text-red-600 hover:underline font-medium"
              >
                {question.title}
              </Link>
            </span>
            <span>
              {topAnswers.topAnswers.some((a) => a.questionId === question.id)
                ? `${
                    topAnswers.topAnswers.find(
                      (a) => a.questionId === question.id
                    )!.points
                  }/`
                : ""}
              {question.maxPoints} pistettä
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
