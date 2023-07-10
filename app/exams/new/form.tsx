import React from "react";
import { redirect } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Zod from "zod";

import grades from "@/grades";
import examsService from "@/services/exams";

const schema = Zod.object({
  name: Zod.string(),
  description: Zod.string(),
  date: Zod.string().pipe(Zod.coerce.date()),
  grade0: Zod.string().pipe(Zod.coerce.number().positive()),
  grade1: Zod.string().pipe(Zod.coerce.number().positive()),
  grade2: Zod.string().pipe(Zod.coerce.number().positive()),
  grade3: Zod.string().pipe(Zod.coerce.number().positive()),
  grade4: Zod.string().pipe(Zod.coerce.number().positive()),
  grade5: Zod.string().pipe(Zod.coerce.number().positive()),
  grade6: Zod.string().pipe(Zod.coerce.number().positive()),
});

const action = async (formData: FormData) => {
  "use server";

  const data = Object.fromEntries(formData);

  try {
    const { name, description, date, ...grades } = schema.parse(data);
    const gradePoints = Object.values(grades);

    const exam = await examsService.createExam(
      name,
      description,
      date,
      gradePoints
    );

    redirect(`/exams/${exam.name}`);
  } catch (error) {
    // TODO: Proper Error Handling
    console.error(error);
  }
};

export default withPageAuthRequired(async function NewExamForm() {
  return (
    <form action={action} className="flex flex-col p-2">
      <label htmlFor="name">Nimi</label>
      <input
        type="text"
        name="name"
        id="name"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="description">Kuvailu</label>
      <input
        type="text"
        name="description"
        id="description"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <label htmlFor="date">Päivämäärä</label>
      <input
        type="date"
        name="date"
        id="date"
        className="border-orange-400 rounded border-2 border-solid text-sm outline-orange-500 px-1 py-1"
        required
      />

      <h3 className="text-xl mt-2">Pisterajat</h3>
      <div className="p-2 w-full">
        {grades.map((grade, index) => (
          <div key={grade} className="flex flex-row my-2">
            <div className="w-52 flex flex-col justify-center">
              <label htmlFor={grade} className="text-xs">
                {grade}
              </label>
            </div>
            <div>
              <input
                type="number"
                name={`grade${index}`}
                id={grade}
                className="border-orange-400 rounded border-2 p-1 border-solid text-sm outline-orange-500 w-16"
                required
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="rounded bg-red-500 hover:bg-red-600 text-white my-4 px-2 py-1"
      >
        Lähetä
      </button>
    </form>
  );
});
