import { getSession } from "@auth0/nextjs-auth0";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIApi, Configuration } from "openai-edge";

import prompt from "./prompt";
import usersService from "@/services/users";
import questionsService from "@/services/questions";

const model = "gpt-3.5-turbo";
const apiKey = process.env.OPENAI_API_KEY!;

const openAi = new OpenAIApi(
  new Configuration({
    apiKey,
  })
);

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const question = await questionsService.getQuestion(params.id);
  if (!question) return new Response("Question not found", { status: 404 });

  const answers = await questionsService.getUserAnswers(question, user);

  return new Response(JSON.stringify(answers), {
    headers: {
      "content-type": "application/json",
    },
  });
};

export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await usersService.getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const question = await questionsService.getQuestion(params.id);
  if (!question) return new Response("Question not found", { status: 404 });

  const { messages } = await req.json();
  const response = await openAi.createChatCompletion({
    stream: true,
    temperature: 0.2,
    messages: [
      // Other messages
      ...messages.slice(0, -1),
      {
        role: "user",
        content: prompt(question, messages.at(-1).content),
      },
    ],
    model,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await questionsService.createUserAnswer(
        question,
        user,
        messages.at(-1).content,
        completion,
        Number(completion.split("\n")[0]) || 0
      );
    },
  });
  return new StreamingTextResponse(stream);
};
