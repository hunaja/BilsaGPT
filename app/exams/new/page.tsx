import React from "react";
import NewExamForm from "./form";

export default function NewExam() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-2">Uusi koe</h1>
      <NewExamForm />
    </div>
  );
}
