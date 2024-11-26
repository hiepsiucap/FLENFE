/** @format */

import React, { useEffect, useState } from "react";
import successSound from "../assets/audio/success.mp3";
import errorSound from "../assets/audio/error.mp3";
import { useFetch } from "../customhook";
import Sound from "../assets/icon/sound";
import CharacterInput from "./InputLetter";
import SoundSuccess from "../assets/icon/soundSuccess";
import { useRef, useCallback } from "react";
import { useStateUserContext } from "../contexts/UserContextProvider";
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

export default function SoundGame({
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, changeerror] = useState("none");
  const { accesstoken, refreshtoken } = useStateUserContext();
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
        setLoading(false);
      }, 400);
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

  const fetchAudio = useCallback(async (id: string) => {
    setLoading(true);
    try {
      if (accesstoken && refreshtoken) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_SERVER}/api/flashcard/read/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              "X-refresh-token": refreshtoken,
            },
            credentials: "include",
          }
        );
        const blob = await response.blob();
        console.log(blob);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play();
          }
        }
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setTimeout(() => {
      fetchAudio(data._id);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const playErrorSound = () => {
    new Audio(errorSound).play();
  };
  const ChangeInputAnswer = (data: string) => {
    changeinputanswer(data);
  };
  return (
    <div className=" bg-white rounded-lg shadow-lg md:w-4/5 mx-2 mr-3 flex flex-col justify-between h-custom2 py-12 pb-24 px-12">
      <div>
        <div className=" font-semibold text-2xl">Nhập vào từ vựng của bạn</div>
        <div className=" flex items-end space-x-4 py-4">
          <img
            src={data?.image}
            className=" w-32 h-32 rounded-md"
            alt=""
          />
          <div className="flex flex-col gap-4">
            {!isLoading ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAudio(data._id);
                }}
              >
                <Sound width={32}></Sound>
              </button>
            ) : (
              <button
                disabled
                onClick={() => {
                  fetchAudio(data._id);
                }}
              >
                <SoundSuccess width={32}></SoundSuccess>
              </button>
            )}
          </div>
        </div>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          className=" hidden"
          controls
        >
          <source
            src={audioUrl}
            type="audio/mpeg"
          />
        </audio>
      )}
      <form onSubmit={onSubmitHandler}>
        {isLoading ? (
          <>
            <CharacterInput
              answer={data.answer}
              nums={data.answer.length}
              error={error}
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
              answer={data.answer}
              nums={data.answer.length}
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
