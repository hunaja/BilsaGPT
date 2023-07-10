import { getSession } from "@auth0/nextjs-auth0";
import questionsService from "@/services/questions";
import examsService from "@/services/exams";
import { redirect } from "next/navigation";

import usersService from "@/services/users";
import QuestionsList from "@/app/exams/questions";
import GradedResult from "../../graded";

type Params = {
  name: string;
  number: string;
  id: string;
};

export default async function ExamQuestionAnswer({
  params,
}: PageProps<Params>) {
  const session = await getSession();
  if (!session?.accessToken) return redirect("/");

  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return redirect("/");

  const exam = await examsService.getExamByName(params.name);
  if (!exam) return <p>Ei löydetty exam.</p>;

  const question = await questionsService.getQuestionByExamQuestionNumber(
    exam,
    Number(params.number) || 0
  );
  if (!question) return <p>Ei löydetty question.</p>;

  const answer = await questionsService.getAnswer(params.id);
  if (!answer) return <p>Ei löydetty answer.</p>;
  if (answer.userId !== user.id) return redirect("/");

  const topAnswers = await questionsService.getUserTopAnswers(exam, user);

  return (
    <div className="p-5 flex">
      <div className="w-96 p-2">
        <h2 className="text-2xl mb-5 text-center">{exam.description}</h2>

        <QuestionsList
          accessToken={session.accessToken}
          exam={exam}
          questions={exam.questions}
          initialTopAnswers={topAnswers}
        />
      </div>

      <div className="w-full">
        <h3 className="text-xl font-bold mb-2">
          {question.title} ({question.maxPoints} pistettä)
        </h3>
        <p className="text-base mx-4">{question.content}</p>

        <blockquote className="p-2 text-gray-700 text-base w-full w-full min-h-[10rem] mt-4 border-orange-300 rounded border-2 border-solid text-base p-1 whitespace-pre-line">
          {answer.content}
        </blockquote>

        <blockquote className="p-2 text-gray-700 text-base w-full self-start">
          <GradedResult content={answer.overview} />
        </blockquote>
      </div>
    </div>
  );
}
