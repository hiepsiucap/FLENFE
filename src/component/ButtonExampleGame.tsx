/** @format */

import { useState } from "react";

export default function ButtonExampleGame({
  correct,
  text,
  disabled,
  error,
  onSubmit,
}: {
  correct: boolean;
  text: string;
  disabled: boolean;
  error: string;
  onSubmit: (inputanswer: string) => void;
}) {
  const [wrong, changeWrong] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      className={
        (error === "success" || error === "error") && correct
          ? "bg-green-500 animate-shake scale-105  w-full shadow-sm  text-xl   rounded-lg "
          : !wrong
          ? "bg-slate-100 w-full shadow-sm  text-xl   rounded-lg"
          : "bg-red-500 animate-shake scale-105  w-full shadow-sm  text-xl   rounded-lg"
      }
      onClick={() => {
        onSubmit(text);
        if (correct === false) changeWrong(true);
      }}
    >
      {text}
    </button>
  );
}
