import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import examsService from "@/services/exams";

export default async function Exams() {
  const session = await getSession();
  if (!session) return redirect("/");

  const exams = await examsService.getExams();
  type Exam = (typeof exams)[number];

  const examsGroupedByYear = exams.reduce((acc, exam) => {
    const year = exam.date.getFullYear();

    if (!acc[year]) acc[year] = [];
    acc[year].push(exam);
    return acc;
  }, {} as Record<number, Exam[]>);

  return (
    <main className="p-5">
      {exams.length === 0 && (
        <p className="text-center text-gray-600">Ei kokeita lisätty.</p>
      )}

      {Object.entries(examsGroupedByYear).map(([year, exams]) => (
        <div key={year}>
          <h2 className="text-2xl font-bold mb-2">
            Vuosi {exams[0]?.date.getFullYear()}
          </h2>
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-3 border-orange-400 border-2 border-solid rounded mb-2 flex w-max drop-shadow"
            >
              <div className="text-orange-400 flex flex-col justify-center">
                <div className="border-orange-400 border-2 border-solid rounded-[6em] p-1">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="ml-4">
                <h3 className="text-xl">
                  <Link
                    href={`/exams/${exam.name}`}
                    className="text-red-500 hover:text-red-600 hover:underline font-medium"
                  >
                    {exam.description}
                  </Link>
                </h3>
                <p className="my-1">{exam.questions.length} tehtävää</p>
                <p className="text-gray-600 text-sm">
                  {new Date(exam.date).toLocaleDateString("fi-FI", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
