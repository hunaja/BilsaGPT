import prisma from "@/lib/prisma";
import React from "react";
import { redirect } from "next/navigation";
import { Exam } from "@prisma/client";

type Props = {
  exam: Exam;
};

export default function NewQuestionForm({ exam }: Props) {
  const action = async (formData: FormData) => {
    "use server";

    const data = Object.fromEntries(formData);
    const form = {
      maxPoints: Number(data.maxPoints),
      number: Number(data.number),
      title: data.title as string,
      content: data.content as string,
      answer: data.answer as string,
      examId: exam.id,
    };

    const question = await prisma.question.create({
      data: form,
    });

    redirect(`/exams/${exam.name}/questions/${question.number}`);
  };

  return (
    <form action={action} className="flex flex-col mt-2">
      <label htmlFor="number">Järjestysluku</label>
      <input
        type="number"
        name="number"
        id="number"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="title">Otsikko</label>
      <input
        type="text"
        name="title"
        id="title"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="content">Sisältö</label>
      <textarea
        name="content"
        id="content"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="answer">Hyvän vastauksen piirteet</label>
      <textarea
        name="answer"
        id="answer"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="maxPoints">Maksimipisteet</label>
      <input
        type="number"
        name="maxPoints"
        id="maxPoints"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <button
        type="submit"
        className="rounded bg-red-500 hover:bg-red-600 text-white my-4 px-2 py-1"
      >
        Lähetä
      </button>
    </form>
  );
}
