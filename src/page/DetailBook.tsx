/** @format */
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { CreateWord } from "../component";
import Sound from "../assets/icon/sound";
import Box from "../assets/icon/box";
import { useNavigate } from "react-router-dom";
import Bin from "../assets/icon/bin";
import { useFetch } from "../customhook";
import SoundSuccess from "../assets/icon/soundSuccess";
import { DeleteRequestWithCre } from "../utilz/Request/DeteleRequest";

import Swal from "sweetalert2";
interface Word {
  _id: string;
  phonetic: string;
  text: string;
  meaning: string;
  example: string;
  image: string;
}
export default function DetailBook() {
  const { bookId } = useParams();
  const { accesstoken, refreshtoken } = useStateUserContext();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { isLoading, setLoading } = useFetch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const [listword, changelistword] = useState<Word[]>();
  useEffect(() => {
    const fetchListWord = async () => {
      if (bookId) {
        const response = await GetRequestWithCre({
          route: `api/flashcard/bookcard/${bookId}`,
          accesstoken,
          refreshtoken,
        });
        if (response.success) {
          changelistword(response.data.listcard);
        }
      }
    };
    fetchListWord();
  }, [bookId]);
  const fetchAudio = async (id: string) => {
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
  };
  const DeleteHandler = async (id: string) => {
    if (id) {
      const response = await DeleteRequestWithCre({
        route: `api/flashcard/${id}`,
        accesstoken,
        refreshtoken,
      });
      if (response.success) {
        Swal.fire("Xoá thành công", "", "success");
        navigate(0);
      } else {
        Swal.fire("Xoá thất bại", "", "error");
      }
    }
  };
  return (
    <div className=" flex w-full">
      <div className=" w-1/5"></div>
      <div className=" w-4/5  font-opensans mt-6  text-black">
        <div className=" flex justify-between items-center">
          <div>
            <h3 className=" font-opensans  text-3xl">Sổ từ của tôi</h3>
            <div className=" text-gray-700 py-2">
              {listword?.length} sổ từ | từ vựng đã lưu | 0 từ vựng thành thạo
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
          <CreateWord></CreateWord>
        </div>
        <div className=" grid grid-cols-2 gap-10 pb-10">
          {listword ? (
            listword.map((word) => {
              return (
                <div className=" shadow-lg bg-white py-10 rounded-lg px-10 flex justify-start space-x-5">
                  <div className=" flex w-fit min-w-40 flex-col">
                    <img
                      src={word.image}
                      alt=""
                      className=" w-40 h-40 rounded-lg"
                    />
                  </div>
                  <div className=" flex w-full flex-col">
                    <div className=" w-full flex items-center justify-between">
                      {!isLoading ? (
                        <button
                          onClick={() => {
                            fetchAudio(word._id);
                          }}
                        >
                          <Sound width={24}></Sound>
                        </button>
                      ) : (
                        <button
                          disabled
                          onClick={() => {
                            fetchAudio(word._id);
                          }}
                        >
                          <SoundSuccess width={24}></SoundSuccess>
                        </button>
                      )}
                      <div className=" flex items-center space-x-2 ">
                        <Box width={20}></Box>
                        <button
                          onClick={async () => {
                            Swal.fire({
                              title: `Bạn có chắc xoá từ ${word.text}?`,
                              text: "Từ vững sẽ bị xoá vĩnh viễn",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              cancelButtonText: "Không xoá nữa",
                              confirmButtonText: "Xoá đi!",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                await DeleteHandler(word._id);
                              }
                            });
                          }}
                        >
                          <Bin width={20}></Bin>
                        </button>
                      </div>
                    </div>
                    <div className=" font-semibold text-lg pt-2">
                      {word.text}
                    </div>
                    <div className=" font-light text-gray-600 ">
                      {"[" + word.phonetic + "]"}
                    </div>
                    <div className=" font-  text-gray-600 py-2 ">
                      {word.meaning}
                    </div>
                    <div className=" font-light text-gray-600 ">
                      {word?.example && "Example: " + word?.example}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có từ vựng nào được lưu</p>
          )}
        </div>
      </div>
    </div>
  );
}