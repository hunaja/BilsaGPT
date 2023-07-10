import { Question } from "@prisma/client";

export default function prompt(question: Question, content: string) {
  return `
Student's answer:

"${content.replace(/"/g, "'")}"

Grade the student's answer (part 1) as a high school biology teacher, utilizing the provided grading criteria, reference answer and question.
Evaluate the answer (part 1) assuming it is from a student who has studied biology for two years, in a matriculation examination context.

Consider the following guidelines:
- Apply the provided grading criteria to assess the student's comprehension and application of biological concepts.
- Identify and acknowledge commendable answer features, including clear explanations, accurate information, and relevant examples.
- Take into account the specific question requirements and context to determine the grade.
- Assign a grade based on the evaluation, ensuring it aligns with the student's demonstrated knowledge and abilities within the given parameters.

Please provide the grade on the first line, ranging from 0 to ${
    question.maxPoints
  }. For example, write '2' on the first line.

In addition to the grade, you must also provide constructive and encouraging feedback that justifies the grade of the answer (part 1).
Please write at least 6 lines of feedback. 
- The feedback should be written in Finnish! This is really important.
- Syntax: The feedback should be split into lines, with each line beginning with either a plus sign (+) or a minus sign (-). After the sign, write one sentence.
- Plus signs indicate good elements that raise the grade from 0, while minus signs indicate bad elements that lower the grade from the maximum points.
- No other syntax is allowed. The answer should only contain the grade and the feedback lines.
- The feedback lines should be short and concise, and contain examples.
- The feedback should be written in a positive and encouraging tone.

Grading criteria:

"The answer must fully follow the instructions, and the information in the answer must bemoi correct and relevant to the instructions.
The answer must show an understanding of cause and effect relationships.
The answer must not contain factual errors or ambiguities or inaccuracies.
Terms must not be used incorrectly or inconsistently.
The teacher evaluates each answer separately, but an answer that is graded as excellent requires a level of biological knowledge that is comparable to the one in reference answer.
Only an excellent answer that demonstrates superior biological knowledge and is error-free, precise and clear can receive the best grade.

The value of the answer is reduced if it is based solely or mainly on opinion, if the same things are repeated, or if the use of the materials is inappropriate or omitted.
The value of the answer is also reduced if the presentation is unclear or inconsistent, making it difficult to understand the answer."

The question (part 1):

"${question.content.replace(/"/g, "'")}}"

Reference answer (please do not grade this):

"${question.answer.replace(/"/g, "'")}}"
`;
}
