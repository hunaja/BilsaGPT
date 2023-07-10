import prisma from "@/lib/prisma";

const getExams = async () =>
  prisma.exam.findMany({
    include: {
      questions: true,
    },
  });

const createExam = async (
  name: string,
  description: string,
  date: Date,
  gradePoints: number[]
) =>
  prisma.exam.create({
    data: {
      name,
      description,
      date,
      grades: gradePoints,
    },
  });

const getExam = async (id: string) =>
  prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      questions: true,
    },
  });

const getExamByName = async (name: string) =>
  prisma.exam.findUnique({
    where: {
      name,
    },
    include: {
      questions: true,
    },
  });

const examsService = {
  createExam,
  getExam,
  getExams,
  getExamByName,
};

export default examsService;
