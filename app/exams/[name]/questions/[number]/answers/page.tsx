import { redirect } from "next/navigation";

type Params = {
  name: string;
  number: string;
};

export default function ExamQuestion({ params }: PageProps<Params>) {
  return redirect(`/exams/${params.name}/questions/${params.number}`);
}
