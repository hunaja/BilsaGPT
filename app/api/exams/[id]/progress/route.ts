import { getSession } from "@auth0/nextjs-auth0";

import usersService from "@/services/users";
import questionsService from "@/services/questions";
import examsService from "@/services/exams";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const exam = await examsService.getExam(params.id);
  if (!exam) return new Response("Exam not found", { status: 404 });

  const topAnswers = await questionsService.getUserTopAnswers(exam, user);
  return new Response(JSON.stringify(topAnswers), {
    headers: {
      "content-type": "application/json",
    },
  });
};
