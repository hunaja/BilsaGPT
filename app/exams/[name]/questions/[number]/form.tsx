"use client";

import React from "react";
import type { Question } from "@prisma/client";
import { useChat } from "ai/react";
import GradedResult from "./graded";
import useSWRMutation from "swr/mutation";

type Props = {
  question: Omit<Question, "answer">;
};

export default function ExamAnswerForm({ question }: Props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: `/api/questions/${question.id}/answers`,
    initialInput: "",
    initialMessages: [],
  });
  const { trigger: refreshAnswers } = useSWRMutation(
    `/api/questions/${question.id}/answers`,
    () => {}
  );
  const { trigger: refreshProgress } = useSWRMutation(
    `/api/questions/${question.id}/progress`,
    () => {}
  );

  const clearMessages = () => {
    setMessages([]);
    refreshAnswers();
    refreshProgress();
  };

  if (isLoading || messages.length > 1) {
    const userMessage = messages.find((m) => m.role === "user");
    const assistantMessage = messages.find((m) => m.role === "assistant");

    return (
      <>
        <div className="flex flex-col">
          {userMessage && (
            <blockquote className="p-2 text-gray-700 text-base w-full min-h-[10rem] mt-4 border-orange-300 rounded border-2 border-solid text-base whitespace-pre-line">
              {userMessage.content}
            </blockquote>
          )}

          {assistantMessage ? (
            <div className="p-2 text-gray-700 text-base w-full">
              <GradedResult content={assistantMessage.content} />
            </div>
          ) : (
            <div className="flex justify-center p-2 text-sm text-center w-full text-gray-700">
              <p>Lähetetään vastausta...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-items-center">
          <button
            className="rounded bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-base"
            onClick={clearMessages}
            disabled={isLoading}
          >
            Sulje
          </button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <textarea
          className="w-full min-h-[10rem] mt-4 border-orange-400 rounded border-2 border-solid text-base outline-orange-500 p-1"
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
        />
      </label>

      <div className="flex justify-end mb-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-base"
        >
          Lähetä
        </button>
      </div>
    </form>
  );
}
