/** @format */

import React, { useEffect, useState } from "react";
import successSound from "../assets/audio/success.mp3";
import errorSound from "../assets/audio/error.mp3";
import { useFetch } from "../customhook";
import { useRef } from "react";
interface Round {
  _id: string;
  book: string;
  answer: string;
  meaning: string;
  phonetic: string;
  example: string;
  score: number;
  questionType: string;
  image: string;
}

export default function VietNam({
  data,
  changeCurrent,
  UpdateScore,
  total,
  currentvalue,
  onFinish,
  ChangeText,
}: {
  data: Round;
  changeCurrent: () => void;
  total: number;
  currentvalue: number;
  onFinish: ({ roundid, total }: { roundid: string; total: number }) => void;
  UpdateScore: ({
    score,
    _id,
    questionType,
  }: {
    score: number;
    _id: string;
    questionType: string;
  }) => void;
  ChangeText: (text: string) => void;
}) {
  const { isLoading, setLoading } = useFetch();
  const inputref = useRef<HTMLInputElement>(null);
  const [inputanswer, changeinputanswer] = useState<string>("");
  const [error, changeerror] = useState("none");
  const [tempscore, changetempscore] = useState<number>(100);
  const onSubmitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (inputanswer.toLowerCase() !== data.answer.toLowerCase()) {
      changeerror("error");
      console.log(inputanswer, data.answer);
      playErrorSound();
      changetempscore((prev) => {
        return prev - 30;
      });
      changeinputanswer(data.answer);
      setTimeout(() => {
        changeinputanswer("");
        changeerror("none");
        setLoading(false);
      }, 400);
    } else {
      changeerror("success");
      playSuccessSound();
      ChangeText(data._id);
      UpdateScore({
        score: tempscore > 0 ? tempscore : 0,
        _id: data._id,
        questionType: data.questionType,
      });
      changetempscore(100);
      setTimeout(() => {
        if (currentvalue == total - 1) {
          onFinish({ total: tempscore, roundid: data._id });
        } else {
          changeCurrent();
          changeerror("none");
          changeinputanswer("");
          setLoading(false);
        }
      }, 500);
    }
  };
  const playSuccessSound = () => {
    const audio = new Audio(successSound);
    audio.play();
  };
  useEffect(() => {
    inputref.current?.focus();
  }, [currentvalue]);
  const playErrorSound = () => {
    new Audio(errorSound).play();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Xử lý phím Backspace
    if (e.code === "Space") {
      e.preventDefault();
      changeinputanswer((prev) => prev + " ");
    }
  };
  return (
    <div className=" bg-white rounded-lg shadow-lg md:w-4/5 mx-2 mr-2 md:mx-0 md:mr-0 flex flex-col justify-between h-custom2 py-12 pb-24 px-12">
      <div>
        <div className=" font-semibold text-lg md:text-2xl">
          Nhập vào từ vựng của bạn
        </div>
        <div className=" flex flex-col md:flex-row items-center space-y-4 md:items-end space-x-4 py-4">
          <img
            src={data?.image}
            className=" w-32 h-32 rounded-md"
            alt=""
          />
          <p className=" font-semibold text-2xl ">{data.meaning}</p>
        </div>
      </div>
      <form onSubmit={onSubmitHandler}>
        {isLoading ? (
          <input
            type="text"
            key={inputanswer}
            value={inputanswer}
            disabled
            onChange={(e) => {
              changeinputanswer(e.target.value);
            }}
            className={
              error == "error"
                ? " w-full text-center border  border-red-500 focus:outline-none animate-wiggle focus:border-none text-red-500 font-semibold shadow-sm text-2xl py-2 px-4 bg-slate-100 rounded-xl "
                : error == "none"
                ? "w-full text-cente   focus:outline-none  focus:border-none text-2xl font-semibold shadow-sm py-2 px-4 bg-gray-100 rounded-xl "
                : "w-full text-center animate-shake  focus:outline-none  outline-green-500 border border-green-400 text-green-500 text-2xl font-semibold shadow-sm py-2 px-4 bg-white rounded-xl "
            }
          />
        ) : (
          <input
            type="text"
            ref={inputref}
            value={inputanswer}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
              console.log(e.target.value);
              changeinputanswer(e.target.value);
            }}
            className={
              error == "error"
                ? " w-full text-center animate-shake  border-2 focus:outline-none outline-red-500 border-red-500 bg-white text-red-500 font-semibold shadow-sm text-2xl py-2 px-4  rounded-xl "
                : error == "none"
                ? "w-full text-center   focus:outline-none focus:border-none text-2xl font-semibold shadow-sm py-2 px-4 bg-gray-100 rounded-xl "
                : "w-full text-center animate-shake  focus:outline-none   outline-green-500 border border-green-400 text-green-500 text-2xl font-semibold shadow-sm py-2 px-4 bg-gray-100 rounded-xl "
            }
          />
        )}
      </form>
    </div>
  );
}
