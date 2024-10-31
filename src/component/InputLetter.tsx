/** @format */

import React, { useState, useRef, useEffect } from "react";

interface CharacterInputProps {
  nums: number;
  changeinputanswer: (data: string) => void;
  error: string;
  answer: string;
}

const CharacterInput: React.FC<CharacterInputProps> = ({
  nums,
  error,
  changeinputanswer,
  answer,
}) => {
  const [chars, setChars] = useState<string[]>(Array(nums).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  if (inputRefs.current.length === 0) {
    inputRefs.current = Array(nums)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>().current);
  }
  const handleChange = (index: number, value: string) => {
    const newValue = value.slice(-1);

    const newChars = [...chars];
    newChars[index] = newValue;
    setChars(newChars);
    if (newValue && index < chars.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (error == "error") {
      setChars(answer.split(""));
      setTimeout(() => {
        setChars(Array(nums).fill(""));
      }, 300);

      inputRefs.current[0]?.focus();
    }
    if (error == "success") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 500);
    }
  }, [error]);
  useEffect(() => {
    setChars(Array(nums).fill(""));
  }, [nums]);
  useEffect(() => {
    changeinputanswer(chars.join(""));
  }, [chars]);
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace" && !chars[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft") {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "") {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === " ") {
      handleChange(index, " ");
      inputRefs.current[index + 1]?.focus();
    }
  };
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={char}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={
              error == "error"
                ? "w-12 h-12 animate-shake text-center font-semibold text-xl border-2 border-red-500 text-red-500 rounded  focus:outline-none"
                : error == "none"
                ? "w-12 h-12 text-center  font-semibold text-xl border-2 border-gray-300 rounded  focus:outline-none"
                : "w-12 h-12 text-center animate-shake font-semibold text-xl border-2 border-green-500 rounded text-green-500  focus:outline-none"
            }
            maxLength={1}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterInput;