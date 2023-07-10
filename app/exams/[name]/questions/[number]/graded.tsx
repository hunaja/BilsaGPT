"use client";

import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

type Props = {
  content: string;
};

export default function GradedResult({ content }: Props) {
  const [gradeStr, ...rest] = content.split("\n");

  const positive = rest.filter((a) => a.startsWith("+")).map((a) => a.slice(1));
  const negative = rest.filter((a) => a.startsWith("-")).map((a) => a.slice(1));

  return (
    <>
      <p className="text-center text-black text-sm my-2">Pisteet: {gradeStr}</p>

      <div className="flex justify-center p-2 text-sm">
        <div className="w-1/2">
          <ul>
            {positive.map((a) => (
              <li key={a} className="text-green-400 mb-2">
                <PlusCircleIcon className="w-4 h-4 inline-block mr-1" />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          {negative.map((a) => (
            <p key={a} className="text-red-400 mb-2">
              <MinusCircleIcon className="w-4 h-4 inline-block mr-1" />
              {a}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
