/** @format */

import { useState, useCallback, useRef, useEffect } from "react";
import { useFetch } from "../customhook";
import Sound from "../assets/icon/sound";
import SoundSuccess from "../assets/icon/soundSuccess";
import { useStateUserContext } from "../contexts/UserContextProvider";
interface FlashCardType {
  _id: string;
  book: string;
  text: string;
  meaning: string;
  phonetic: string;
  example: string;
  box: number;
  image: string;
}
const Flashcard = ({
  info,
  isFlipped,
  setIsFlipped,
}: {
  info: FlashCardType;
  isFlipped: boolean;
  setIsFlipped: (flip: boolean) => void;
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { accesstoken, refreshtoken } = useStateUserContext();
  const { isLoading, setLoading } = useFetch();
  const fetchAudio = useCallback(
    async (id: string) => {
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
            console.log(url);
          }
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    },
    [accesstoken, refreshtoken, setLoading]
  );
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [audioUrl]);

  useEffect(() => {
    const FetchAu = async () => {
      fetchAudio(info._id);
      setIsFlipped(false);
    };
    FetchAu();
  }, [fetchAudio, info, setIsFlipped]);
  return (
    <div className="group h-custom w-custom [perspective:1000px]">
      <div
        className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
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
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl bg-white p-6 text-center text-slate-800 [backface-visibility:hidden]"
          onClick={() => setIsFlipped(true)}
        >
          <div className="flex flex-col gap-4">
            {!isLoading ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAudio(info._id);
                }}
              >
                <Sound width={24}></Sound>
              </button>
            ) : (
              <button
                disabled
                onClick={() => {
                  fetchAudio(info._id);
                }}
              >
                <SoundSuccess width={24}></SoundSuccess>
              </button>
            )}
          </div>
          <h4 className=" font-semibold text-start text-xl">{info.text}</h4>
          <h5 className=" font-light text-lg text-start">{info.phonetic}</h5>
          <div className=" h-full w-full  flex items-center justify-center">
            <img
              src={info.image}
              alt=""
              className=" w-52 h-52 rounded-md"
            />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-start  rounded-xl bg-white p-6 text-center text-slate-800 [transform:rotateY(180deg)] [backface-visibility:hidden]"
          onClick={() => setIsFlipped(false)}
        >
          <div className="flex flex-col gap-4">
            {!isLoading ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAudio(info._id);
                }}
              >
                <Sound width={24}></Sound>
              </button>
            ) : (
              <button
                disabled
                onClick={() => {
                  fetchAudio(info._id);
                }}
              >
                <Sound width={24}></Sound>
              </button>
            )}
          </div>
          <h4 className=" font-semibold text-start text-xl">{info.text}</h4>
          <h5 className=" font-light text-lg text-start">{info.phonetic}</h5>
          <h5 className=" font-semibold py-2 text-lg text-start">
            {info.meaning}
          </h5>

          <h5 className=" font-light tex text-start">Example:{info.example}</h5>
          <div className=" h-full w-full  flex items-center justify-center">
            <img
              src={info.image}
              alt=""
              className=" w-52 h-52 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Flashcard;
