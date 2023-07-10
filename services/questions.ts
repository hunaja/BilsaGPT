import { Exam, Question, User } from "@prisma/client";

import grades, { ExamGrade } from "@/grades";
import prisma from "@/lib/prisma";

export type AnswerPoints = {
  questionId: string;
  points: number;
};

export type TopAnswers = {
  grade: ExamGrade | undefined;
  topAnswers: AnswerPoints[];
};

const getUserTopAnswers = async (
  exam: Exam & { questions: Question[] },
  user: User
): Promise<TopAnswers> => {
  const grouped = await prisma.userAnswer.groupBy({
    by: ["questionId"],
    _max: {
      points: true,
    },
    where: {
      userId: user.id,
      questionId: {
        in: exam.questions.map((q) => q.id),
      },
    },
  });
  if (!grouped)
    return {
      grade: undefined,
      topAnswers: [],
    };

  const topAnswers = grouped
    .map((group) => ({
      questionId: group.questionId,
      points: group._max.points,
    }))
    .filter((p): p is AnswerPoints => p.points !== null);
  const totalPoints = topAnswers.reduce(
    (acc, curr) => (curr.points ? acc + curr.points : acc),
    0
  );

  const grade = exam.grades.reduceRight<ExamGrade | undefined>(
    (acc, curr, i) => {
      if (acc) return acc;
      if (totalPoints >= curr) return grades[i];
    },
    undefined
  );

  return { grade, topAnswers };
};

const getQuestion = async (id: string) =>
  prisma.question.findUnique({
    where: {
      id,
    },
  });

const getQuestionByExamQuestionNumber = async (exam: Exam, number: number) => {
  const question = await prisma.question.findUnique({
    where: {
      exam_question_number: {
        examId: exam.id,
        number: number,
      },
    },
  });
  if (!question) return null;

  const { answer: ignored, ...questionWithoutAnswer } = question;
  return questionWithoutAnswer;
};

const getAnswer = async (id: string) =>
  prisma.userAnswer.findUnique({
    where: {
      id,
    },
  });

const getUserAnswers = async (question: Omit<Question, "answer">, user: User) =>
  prisma.userAnswer.findMany({
    where: {
      questionId: question.id,
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

const createUserAnswer = async (
  question: Question,
  user: User,
  content: string,
  overview: string,
  points: number
) =>
  prisma.userAnswer.create({
    data: {
      content,
      overview,
      points,
      questionId: question.id,
      userId: user.id,
    },
  });

const questionsService = {
  getUserTopAnswers,
  getQuestion,
  getQuestionByExamQuestionNumber,
  getAnswer,
  getUserAnswers,
  createUserAnswer,
};

export default questionsService;
