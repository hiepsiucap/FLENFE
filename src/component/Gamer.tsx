/** @format */

import { useEffect, useState, useRef, useCallback } from "react";
import VietNam from "./VietNam";
import Meaning from "./MeaningGame";
import SoundGame from "./SoundGame";
import ExampleGamer from "./ExampleGamer";
import { Review } from "../component";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { PatchRequestWithCre } from "../utilz/Request/PatchRequest";
import Swal from "sweetalert2";
import Finish from "../assets/image/finish.png";
import { Link } from "react-router-dom";
import FinishDay from "./ModalFinishDay";
import finishsound from "../assets/audio/finish.mp3";
import { useNavigate } from "react-router-dom";
import { GetPostRequestWithCre } from "../utilz/Request/postRequest";
interface FlashCardType {
  _id: string;
  book: string;
  text: string;
  meaning: string;
  phonetic: string;
  example: string;
  image: string;
}
interface round {
  _id: string;
  book: string;
  answer: string;
  meaning: string;
  phonetic: string;
  example: string;
  score: number;
  questionType: string;
  image: string;
  ChangeText: (text: string) => void;
}
function shuffleArray(array: round[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const j = randomArray[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Gamer({
  flashCard,
  session,
}: {
  flashCard: FlashCardType[];
  session: string;
}) {
  const { accesstoken, refreshtoken, user } = useStateUserContext();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [readtext, changeReadtext] = useState<string>("  ");
  const ChangeText = (text: string) => {
    changeReadtext(text);
  };
  const fetchAudio = useCallback(
    async (id: string) => {
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
            console.log(url);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    [accesstoken, refreshtoken]
  );
  useEffect(() => {
    if (readtext) fetchAudio(readtext);
  }, [fetchAudio, readtext]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [audioUrl]);

  const [round, changeRound] = useState<round[]>(
    shuffleArray(
      flashCard.flatMap((card: FlashCardType): round[] => {
        if (card.example.toLowerCase().includes(card.text.toLowerCase())) {
          return [
            {
              _id: card._id,
              book: card.book,
              questionType: "meaning",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
            {
              _id: card._id,
              book: card.book,
              questionType: "vietnam",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
            {
              _id: card._id,
              book: card.book,
              questionType: "sound",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
            {
              _id: card._id,
              book: card.book,
              questionType: "examplegame",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
          ];
        } else {
          return [
            {
              _id: card._id,
              book: card.book,
              questionType: "meaning",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
            {
              _id: card._id,
              book: card.book,
              questionType: "vietnam",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
            {
              _id: card._id,
              book: card.book,
              questionType: "sound",
              answer: card.text,
              meaning: card.meaning,
              score: 0,
              phonetic: card.phonetic,
              example: card.example,
              image: card.image,
              ChangeText: ChangeText,
            },
          ];
        }
      })
    )
  );
  const playFinishSound = () => {
    new Audio(finishsound).play();
  };
  console.log("session" + session);
  const [currentvalue, changeCurrent] = useState(0);
  const [totalscore, changetotalscore] = useState(0);
  const [responsescore, changeResponse] = useState<number | null>(null);
  const [finish, changefinish] = useState(false);
  console.log(round);
  const navigate = useNavigate();
  const UpdateCurrent = () => {
    changeCurrent((prev) => {
      return prev + 1;
    });
  };
  const UpdateScore = ({
    score,
    _id,
    questionType,
  }: {
    score: number;
    _id: string;
    questionType: string;
  }) => {
    changeRound((prev) => {
      return prev.map((r) => {
        if (r._id == _id && r.questionType == questionType) {
          return {
            ...r,
            score: score,
          };
        }
        return r;
      });
    });
  };
  useEffect(() => {
    if (round) {
      const temptt = round.reduce(
        (total: number, each: { score: number }) => total + each.score,
        0
      );
      changetotalscore(temptt);
    }
  }, [round]);

  const onFinish = async ({
    roundid,
    total,
  }: {
    roundid: string;
    total: number;
  }) => {
    console.log(round);
    const scoresByCard = round.reduce((acc, round) => {
      if (!acc[round._id]) {
        acc[round._id] = { totalScore: 0, question: 0, _id: "" };
      }
      acc[round._id].totalScore += round.score;
      acc[round._id].question += 1;
      acc[round._id]._id = round._id;
      return acc;
    }, {} as Record<string, { totalScore: number; question: number; _id: string }>);
    if (!scoresByCard[roundid]) {
      scoresByCard[roundid] = { totalScore: 0, question: 0, _id: "" };
    }
    scoresByCard[roundid].totalScore += total;
    scoresByCard[roundid].question += 1;
    scoresByCard[roundid]._id = roundid;

    const list = Object.values(scoresByCard);
    const listflashcard = list.map((l) => {
      return {
        _id: l._id,
        iscorrect: l.totalScore / l.question > 70 ? true : false,
      };
    });
    console.log(list);
    console.log(listflashcard);
    const response = await PatchRequestWithCre({
      route: "api/session/updatescore",
      accesstoken,
      refreshtoken,
      body: {
        sessionid: session,
        listflashcard,
        score: totalscore + total,
      },
    });
    if (response.success) {
      changefinish(true);
      const response = await GetPostRequestWithCre({
        route: "api/users/checkstreak",
        body: {},
        accesstoken,
        refreshtoken,
      });
      if (totalscore)
        if (
          user?.scoreADay &&
          response.data.totalScore > user?.scoreADay &&
          response.data.totalScore - totalscore - total < 3000
        )
          changeResponse(response.data.totalScore);
      playFinishSound();
    } else {
      Swal.fire(response.msg, "", "error");
    }
  };

  return (
    <div className=" flex w-full ">
      <div className="hidden md:block w-1/6 md:w-1/5 "></div>
      {!finish ? (
        <div className=" w-full md:w-4/5  font-opensans mt-6 flex flex-col justify-center items-center py-12   text-black">
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
          <div className=" w-full flex justify-center space-x-2">
            <Review
              max={round.length}
              value={currentvalue + 1}
            ></Review>
          </div>
          <div className=" text-primary">{totalscore}</div>
          {round[currentvalue].questionType == "meaning" ? (
            <Meaning
              data={round[currentvalue]}
              total={round.length}
              currentvalue={currentvalue}
              onFinish={onFinish}
              key={round[currentvalue]._id}
              ChangeText={ChangeText}
              changeCurrent={UpdateCurrent}
              UpdateScore={UpdateScore}
            ></Meaning>
          ) : round[currentvalue].questionType == "vietnam" ? (
            <VietNam
              data={round[currentvalue]}
              total={round.length}
              key={round[currentvalue]._id}
              currentvalue={currentvalue}
              onFinish={onFinish}
              ChangeText={ChangeText}
              changeCurrent={UpdateCurrent}
              UpdateScore={UpdateScore}
            ></VietNam>
          ) : round[currentvalue].questionType == "sound " ? (
            <SoundGame
              data={round[currentvalue]}
              total={round.length}
              key={round[currentvalue]._id}
              currentvalue={currentvalue}
              ChangeText={ChangeText}
              onFinish={onFinish}
              changeCurrent={UpdateCurrent}
              UpdateScore={UpdateScore}
            ></SoundGame>
          ) : (
            <ExampleGamer
              data={round[currentvalue]}
              total={round.length}
              key={round[currentvalue]._id}
              round={round}
              ChangeText={ChangeText}
              currentvalue={currentvalue}
              onFinish={onFinish}
              changeCurrent={UpdateCurrent}
              UpdateScore={UpdateScore}
            ></ExampleGamer>
          )}
        </div>
      ) : (
        <>
          <div className=" md:w-4/5  font-opensans mt-6 flex flex-col justify-center items-center py-12   text-black">
            <div className=" bg-white rounded-lg shadow-lg md:w-4/5 mx-2 mr-3  flex flex-col items-center space-y-12  h-custom2 py-12 pb-12 px-12">
              <p className=" md:text-3xl text-xl text-center md:text-start font-semibold pt-6 text-primary">
                Chúc mừng bạn đã hoàn thành bài thi
              </p>
              <img
                src={Finish}
                className=" w-40 h-40"
              ></img>
              <div className=" flex items-center flex-col space-y-6">
                <p className=" font-light text-lg">
                  Số từ ôn tập được: {flashCard.length} từ
                </p>
                <p className=" md:text-2xl text-lg font-semibold  text-primary">
                  Số điểm đạt được: {totalscore}/ {round.length * 100}
                </p>
              </div>
              <div className=" flex flex-col space-y-3 items-center">
                <button
                  className=" py-3 px-12 text-xl text-white font-sans rounded-lg bg-primary"
                  onClick={() => {
                    navigate(0);
                  }}
                >
                  Chơi tiếp
                </button>
                <Link
                  className=" text-gray-500 italic"
                  to="/wordbank"
                >
                  Trở về sổ từ{" "}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      {responsescore && <FinishDay totalScore={responsescore}></FinishDay>}
    </div>
  );
}
