/** @format */

import React, { useState } from "react";
import successSound from "../assets/audio/success.mp3";
import errorSound from "../assets/audio/error.mp3";
import { useFetch } from "../customhook";
import CharacterInput from "./InputLetter";
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

export default function Meaning({
  data,
  changeCurrent,
  UpdateScore,
  total,
  currentvalue,
  onFinish,
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
}) {
  const { isLoading, setLoading } = useFetch();
  const [inputanswer, changeinputanswer] = useState<string>("");
  const [error, changeerror] = useState("none");
  console.log(inputanswer);
  const [tempscore, changetempscore] = useState<number>(100);
  const onSubmitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (inputanswer !== data.answer) {
      changeerror("error");
      playErrorSound();
      changetempscore((prev) => {
        return prev - 30;
      });
      changeinputanswer(data.answer);
      setTimeout(() => {
        changeinputanswer("");
        changeerror("none");
      }, 400);
      setLoading(false);
    } else {
      changeerror("success");
      playSuccessSound();

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
    new Audio(successSound).play();
  };

  const playErrorSound = () => {
    new Audio(errorSound).play();
  };
  const ChangeInputAnswer = (data: string) => {
    changeinputanswer(data);
  };
  return (
    <div className=" bg-white rounded-lg shadow-lg w-4/5 flex flex-col justify-between h-custom2 py-12 pb-24 px-12">
      <div>
        <div className=" font-semibold text-2xl">Nhập vào từ vựng của bạn</div>
        <div className=" flex items-end space-x-4 py-4">
          <img
            src={data?.image}
            className=" w-32 h-32 rounded-md"
            alt=""
          />
          <p className=" font-semibold text-2xl ">{data.example}</p>
        </div>
      </div>
      <form onSubmit={onSubmitHandler}>
        {isLoading ? (
          <>
            <CharacterInput
              nums={data.answer.length}
              error={error}
              answer={data.answer}
              changeinputanswer={ChangeInputAnswer}
            ></CharacterInput>
            <button
              disabled
              className=" submit "
            ></button>
          </>
        ) : (
          <>
            <CharacterInput
              nums={data.answer.length}
              answer={data.answer}
              error={error}
              changeinputanswer={ChangeInputAnswer}
            ></CharacterInput>
            <button className=" submit "></button>
          </>
        )}
      </form>
    </div>
  );
}
