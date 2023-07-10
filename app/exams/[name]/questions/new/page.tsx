import examsService from "@/services/exams";
import NewQuestionForm from "./form";
import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

type Props = {
  name: string;
};

export default async function NewExam({ params }: PageProps<Props>) {
  const session = await getSession();
  if (!session) return redirect("/");

  const exam = await examsService.getExamByName(params.name);
  if (!exam) return null;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-2">Uusi koekysymys</h1>
      <NewQuestionForm exam={exam} />
    </div>
  );
}
