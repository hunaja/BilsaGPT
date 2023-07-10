import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import examsService from "@/services/exams";
import questionsService from "@/services/questions";
import usersService from "@/services/users";
import QuestionsList from "../questions";

type Params = {
  name: string;
};

export default async function Exam({ params }: PageProps<Params>) {
  const session = await getSession();
  if (!session?.accessToken) return redirect("/");
  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return redirect("/");

  const exam = await examsService.getExamByName(params.name);
  if (!exam) return <p>Ei löydetty exam.</p>;

  const topAnswers = await questionsService.getUserTopAnswers(exam, user);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-2">{exam.description}</h2>
      <QuestionsList
        accessToken={session.accessToken}
        exam={exam}
        questions={exam.questions}
        initialTopAnswers={topAnswers}
      />
    </div>
  );
}
