import { redirect } from "next/navigation";

type Params = {
  name: string;
};

export default function ExamQuestion({ params }: PageProps<Params>) {
  redirect(`/exams/${params.name}`);
}
