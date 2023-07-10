"use client";

import { DocumentIcon } from "@heroicons/react/24/solid";
import { Exam, Question, UserAnswer } from "@prisma/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

type Props = {
  initialAnswers: UserAnswer[];
  question: Omit<Question, "answer">;
  exam: Exam;
  accessToken: string;
};

export default function AnswersList({
  initialAnswers,
  question,
  exam,
  accessToken,
}: Props) {
  const { data: answers } = useSWR(
    `/api/questions/${question.id}/answers`,
    async () =>
      fetch(`/api/questions/${question.id}/answers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()) as Promise<UserAnswer[]>,
    {
      fallbackData: initialAnswers,
      revalidateOnMount: false,
    }
  );

  return (
    <div className="flex flex-col">
      <h4 className="text-lg font-bold my-10 mb-2">Vastaukset</h4>
      {answers.map((answer) => (
        <div
          key={answer.id}
          className="p-3 border-orange-400 border-2 border-solid rounded my-2 flex justify-between w-full drop-shadow text-sm items-center"
        >
          <div className="text-orange-400 flex justify-center items-center">
            <div className="border-orange-400 border-2 border-solid rounded-[6em] p-1">
              <DocumentIcon className="w-3 h-3" />
            </div>

            <Link
              href={`/exams/${exam.name}/questions/${question.number}/answers/${answer.id}`}
              className="text-red-500 hover:text-red-600 hover:underline font-medium ml-2"
            >
              Vastaus{" "}
              {new Date(answer.date).toLocaleDateString("fi-FI", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Link>
          </div>

          <div>{answer.points ?? "0"} pistettä</div>
        </div>
      ))}
    </div>
  );
}
