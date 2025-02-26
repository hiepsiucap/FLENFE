/** @format */

import { useState } from "react";
import successSound from "../assets/audio/success.mp3";
import errorSound from "../assets/audio/error.mp3";
import ButtonExampleGame from "./ButtonExampleGame";
import { useFetch } from "../customhook";
interface Roundinf {
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
interface Round {
  _id: string;
  book: string;
  answer: string;
  meaning: string;
  phonetic: string;
  example: string;
  score: number;
  round?: Roundinf[];
  questionType: string;
  image: string;
}
function replaceWordWithBlank(sentence: string, targetWord: string) {
  const blank = "________";
  const regex = new RegExp(`\\b${targetWord.toLowerCase()}\\b`, "gi");
  return sentence.replace(regex, blank);
}
function getRandomElements({
  arr,
  count,
  answer,
}: {
  arr: Roundinf[];
  count: number;
  answer: string;
}) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }

  if (count <= 0) {
    throw new Error("Count must be greater than 0");
  }

  if (count > arr.length) {
    throw new Error(
      `Cannot get ${count} elements from an array of length ${arr.length}`
    );
  }
  const arr1 = arr.filter((round) => round.answer !== answer);
  const shuffled: { correct: boolean; text: string }[] = arr1.map((r) => {
    return { correct: false, text: r.answer || "" };
  });

  for (let i: number = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Trả về số phần tử yêu cầu
  return shuffled.slice(0, count);
}
function shuffleArray(array: { correct: boolean; text: string }[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export default function ExampleGamer({
  data,
  changeCurrent,
  UpdateScore,
  total,
  round,
  currentvalue,
  onFinish,
  ChangeText,
}: {
  data: Round;
  changeCurrent: () => void;
  total: number;
  round: Roundinf[];
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
  const [error, changeerror] = useState("none");
  const [tempscore, changetempscore] = useState<number>(100);
  const [temparray] = useState(
    shuffleArray([
      ...getRandomElements({
        arr: round,
        count: 3,
        answer: data.answer,
      }),
      { correct: true, text: data.answer },
    ])
  );
  const onSubmitHandler = (inputanswer: string) => {
    setLoading(true);
    if (inputanswer.toLowerCase() !== data.answer.toLowerCase()) {
      changeerror("error");
      playErrorSound();
      UpdateScore({
        score: 0,
        _id: data._id,
        questionType: data.questionType,
      });
      changetempscore(100);
      setTimeout(() => {
        if (currentvalue == total - 1) {
          onFinish({ total: 0, roundid: data._id });
        } else {
          changeCurrent();
          changeerror("none");
          setLoading(false);
        }
      }, 500);
    } else {
      changeerror("success");
      ChangeText(data._id);
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
          setLoading(false);
        }
      }, 500);
    }
  };
  const playSuccessSound = () => {
    const audio = new Audio(successSound);
    audio.play();
  };

  const playErrorSound = () => {
    new Audio(errorSound).play();
  };
  console.log(currentvalue, total);
  return (
    <div className=" bg-white rounded-lg shadow-lg md:w-4/5 mx-2 mr-2 md:mx-0 md:mr-0 flex flex-col justify-between h-custom2 py-12 pb-24 md:px-12 px-4">
      <div>
        <div className=" font-semibold text-lg md:text-2xl">
          Nhập vào từ vựng của bạn
        </div>
        <div className=" flex flex-col items-center md:flex-row md:items-end space-x-4 py-4">
          <img
            src={data?.image}
            className=" w-32 h-32 rounded-md"
            alt=""
          />
          <p className=" font-semibold md:text-2xl ">
            {replaceWordWithBlank(data.example, data.answer)}
          </p>
        </div>
      </div>
      <div className=" w-full h-full">
        {isLoading ? (
          <>
            <div className=" grid grid-cols-2 grid-rows-2 w-full h-full md:gap-6 gap-2 pt-16">
              {temparray.map((btn) => {
                return (
                  <ButtonExampleGame
                    correct={btn.correct}
                    text={btn.text}
                    disabled={true}
                    error={error}
                    onSubmit={onSubmitHandler}
                  ></ButtonExampleGame>
                );
              })}{" "}
            </div>
          </>
        ) : (
          <div className=" grid grid-cols-2 grid-rows-2 w-full h-full md:gap-6 gap-2 pt-16">
            {temparray.map((btn) => {
              return (
                <ButtonExampleGame
                  correct={btn.correct}
                  text={btn.text}
                  disabled={false}
                  error={error}
                  onSubmit={onSubmitHandler}
                ></ButtonExampleGame>
              );
            })}{" "}
          </div>
        )}
      </div>
    </div>
  );
}
