const grades = [
  "Improbatur", // I
  "Approbatur", // A
  "Lubenter Approbatur", // B
  "Cum Laude Approbatur", // C
  "Magna Cum Laude Approbatur", // M
  "Eximia Cum Laude Approbatur", // E
  "Laudatur", // L
] as const;

export default grades;
export type ExamGrade = (typeof grades)[number];
