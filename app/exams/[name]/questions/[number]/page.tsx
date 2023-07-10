import prisma from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import ExamAnswerForm from "./form";
import usersService from "@/services/users";
import examsService from "@/services/exams";
import questionsService from "@/services/questions";
import AnswersList from "./answers";

type Params = {
  name: string;
  number: string;
};

export default async function ExamQuestionPage({ params }: PageProps<Params>) {
  const session = await getSession();
  if (!session) return redirect("/");

  const exam = await examsService.getExamByName(params.name);
  if (!exam) return <p>Ei löydetty exam.</p>;

  const question = await questionsService.getQuestionByExamQuestionNumber(
    exam,
    Number(params.number) || 0
  );
  if (!question) return <p>Ei löydetty question.</p>;

  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return <p>Ei löydetty user.</p>;

  const answers = await questionsService.getUserAnswers(question, user);
  if (!answers) return <p>Ei löydetty answers.</p>;

  return (
    <div className="p-5 flex w-full">
      <div className="w-96 p-2">
        <h2 className="text-2xl mb-5 text-center">{exam.description}</h2>

        {exam.questions.map((q) => (
          <li key={q.id} className="p-3 flex justify-between text-sm">
            <span>
              {q.number}.{" "}
              <Link
                href={`/exams/${exam.name}/questions/${q.number}`}
                className="text-red-500 hover:text-red-600 hover:underline font-medium"
              >
                {q.title}
              </Link>
            </span>
            <span>{q.maxPoints} pistettä</span>
          </li>
        ))}
      </div>
      <div className="w-full">
        <h3 className="text-xl font-bold mb-2">
          {question.title} ({question.maxPoints} pistettä)
        </h3>
        <p className="text-base mx-4">{question.content}</p>

        <ExamAnswerForm question={question} />

        {session.accessToken && (
          <AnswersList
            initialAnswers={answers}
            question={question}
            exam={exam}
            accessToken={session.accessToken}
          />
        )}
      </div>
    </div>
  );
}
