/** @format */

import { useEffect, useState } from "react";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { useFetch } from "../customhook";
import { Review } from "../component";
import quiz from "../assets/image/quiz.png";
import Write from "../assets/icon/write";
import Word from "../assets/icon/word";
import abcd from "../assets/image//answer.png";
import { motion } from "framer-motion";
import { Flashcard, Gamer } from "../component";
import Swal from "sweetalert2";
import { GetPostRequestWithCre } from "../utilz/Request/postRequest";
import HashLoader from "react-spinners/HashLoader";
interface wordbank {
  _id: string;
  book: object;
  name: string;
  user: string;
  numsofcard: number;
  ava: string;
}
interface book {
  _id: string;
  book: wordbank;
  dueCardsCount: number;
}
interface SubmitData {
  total: number;
  id: string | undefined;
}
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
export default function GamePlay() {
  const { accesstoken, refreshtoken } = useStateUserContext();
  const [data, changeData] = useState<book[]>([]);
  const [now, changenow] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcard, changeFlashCard] = useState<FlashCardType[]>([]);
  const [isplay, changeIsPlay] = useState("");
  const { isLoading, setLoading } = useFetch();
  const [submitdata, changeSubmitData] = useState<SubmitData>({
    total: 6,
    id: "",
  });
  console.log(submitdata);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
      }
      if (event.key === "ArrowLeft") {
        setIsFlipped(false);
        setTimeout(() => {
          changenow((prev) => {
            if (prev == 0) return 0;
            return (prev - 1) % flashcard.length;
          });
        }, 100);
      } else if (event.key === "ArrowRight") {
        setIsFlipped(false);
        setTimeout(() => {
          changenow((prev) => {
            if (prev == flashcard.length - 1) {
              return flashcard.length - 1;
            }
            return (prev + 1) % flashcard.length;
          });
        }, 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flashcard.length]);
  const onChangeData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSubmitData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const onClickHandler = async () => {
    setLoading(true);
    const response = await GetPostRequestWithCre({
      route: "api/session/create",
      accesstoken,
      refreshtoken,
      body: {
        bookid: submitdata.id,
        totalquestion: Number(submitdata.total),
      },
    });
    if (response.success) {
      changeIsPlay(response.data.session._id);
      setLoading(false);
    } else {
      setLoading(false);
      Swal.fire("Mạng đang bị lỗi", "", "error");
    }
  };
  const onSumbitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id, total } = submitdata;
    if (id && total) {
      const sumbit = await GetRequestWithCre({
        route: `api/flashcard/getreview?id=${id}&total=${total}`,
        accesstoken,
        refreshtoken,
      });
      if (sumbit.success) {
        changeFlashCard(sumbit.data.listflashcard);
        setLoading(false);
      } else {
        Swal.fire(sumbit.msg, "", "error");
        setLoading(false);
      }
    }
  };
  const createArrayFrom = (length: number) => {
    return Array.from({ length }, (_, index) => index);
  };
  useEffect(() => {
    const GetRequest = async () => {
      const resultdata = await GetRequestWithCre({
        route: "api/bookstore/all",
        refreshtoken,
        accesstoken,
      });
      if (resultdata.success) {
        changeData(resultdata.data.listbook);
        if (resultdata.data?.listbook.length > 0)
          changeSubmitData((prev) => {
            return {
              ...prev,
              id: resultdata.data.listbook[0]._id as string,
            };
          });
      } else {
        console.log(resultdata.msg);
      }
    };
    GetRequest();
  }, [accesstoken, refreshtoken]);
  return (
    <>
      {flashcard?.length > 0 && !isplay ? (
        <div className=" flex w-full font-opensans">
          <div className=" hidden md:block md:w-1/5"></div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className=" mx-auto md:m-0  md:w-4/5 flex flex-col items-center space-y-4 py-12  font-opensans mt-6  text-black"
          >
            <div className=" w-full flex justify-center space-x-2">
              <Review
                max={flashcard.length}
                value={now + 1}
              ></Review>
            </div>
            <div className=" relative md:w-4/5 md:mx-auto py-12 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setTimeout(() => {
                    changenow((prev) => {
                      if (prev == 0) return 0;
                      return (prev - 1) % flashcard.length;
                    });
                  }, 100);
                }}
                className=" absolute md:left-8 -left-4 bg-white top-1/2 z-10 rounded-full border p-2 border-gray-600 translate-x-1/2"
              >
                <button className=" hidden"></button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <Flashcard
                key={flashcard[now]._id}
                info={flashcard[now]}
                setIsFlipped={setIsFlipped}
                isFlipped={isFlipped}
              ></Flashcard>
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setTimeout(() => {
                    changenow((prev) => {
                      if (prev == flashcard.length - 1) {
                        return flashcard.length - 1;
                      }
                      return (prev + 1) % flashcard.length;
                    });
                  }, 100);
                }}
                className=" absolute md:right-20 right-6 bg-white  top-1/2 rounded-full border p-2 border-gray-600 translate-x-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
            {now == flashcard.length - 1 ? (
              isLoading ? (
                <button
                  onClick={onClickHandler}
                  disabled
                  className=" opacity-40 bg-primary  text-white font-semibold px-16 py-3 text-xl rounded-xl"
                >
                  Chơi ngay
                </button>
              ) : (
                <button
                  onClick={onClickHandler}
                  className=" bg-primary  text-white font-semibold px-16 py-3 text-xl rounded-xl"
                >
                  Chơi ngay
                </button>
              )
            ) : (
              <button
                disabled
                className=" bg-primary opacity-40  text-white font-semibold px-16 py-3 text-xl rounded-xl"
              >
                Chơi ngay
              </button>
            )}
          </motion.div>
        </div>
      ) : !isplay ? (
        <form
          className=" flex w-full font-opensans"
          onSubmit={onSumbitHandler}
        >
          <div className=" hidden   md:w-1/5"></div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:pl-32 mx-auto md:w-4/5 px-2 flex flex-col items-center md:space-y-4 space-y-2 md:py-12 py-6  font-opensans mt-6  text-black"
          >
            <div className=" flex items-center space-x-2">
              <img
                src={quiz}
                alt=""
                className=" w-12 h-12"
              />
              <h3 className="font-semibold text-3xl md:text-4xl">Chơi game</h3>
            </div>
            <div className=" font-semibold items-end  flex space-x-2 pb-6">
              <p>Số từ muốn chơi: </p>
              <select
                name="total"
                id=""
                value={submitdata.total}
                className="  bg-slate-50"
                onChange={onChangeData}
              >
                {createArrayFrom(
                  data?.find((book) => book._id == submitdata.id)
                    ?.dueCardsCount || 0
                )?.map((_book, index) => {
                  return (
                    <option value={(index + 1).toString()}>{index + 1}</option>
                  );
                })}
              </select>
            </div>
            <div className=" bg-opacity-20 shadow-lg  rounded-2xl w-fit bg-white py-8 px-12 ">
              <div className=" flex md:flex-row space-y-1 md:space-y-0 flex-col items-center   md:justify-start">
                {" "}
                <div className=" flex space-x-2  justify-between  text-gray-900 font-semibold">
                  Chơi với:
                </div>
                <select
                  name="id"
                  className=" bg-slate-50 pl-12 font-semibold "
                  id=""
                  value={submitdata.id}
                  onChange={onChangeData}
                >
                  {data?.map((book) => {
                    return <option value={book._id}>{book?.book.name}</option>;
                  })}
                </select>
              </div>
              <div className=" flex space-x-4 py-3 justify-center">
                <div className=" flex items-center  py-6  justify-center space-x-1">
                  <Word width={40}></Word>
                  <div className=" font-bold text-xl text-primary">
                    {data?.find((book) => book._id === submitdata.id)
                      ?.dueCardsCount || 0}
                  </div>
                </div>
                <div className=" flex items-center py-6  justify-center space-x-1">
                  <Write width={40}></Write>
                  <div className=" font-bold text-xl text-primary">
                    {" "}
                    {data?.find((book) => book._id == submitdata.id)
                      ?.dueCardsCount || 0}
                  </div>
                </div>
              </div>
            </div>
            <div className=" py-6">
              <img
                src={abcd}
                alt=""
                className=" w-24 h-24 md:w-32 md:h-32  "
              />
            </div>
            <div className=" font-semibold text-center md:text-start text-lg ">
              Bao gồm các dạng câu hỏi như: Trắc nghiệm, điền từ, nhập từ{" "}
            </div>
            <div className=" py-6">
              {!isLoading ? (
                <button className=" bg-primary  text-white font-semibold px-16 py-3 text-xl rounded-xl">
                  Chơi ngay
                </button>
              ) : (
                <button
                  disabled
                  className=" bg-primary  text-white font-semibold px-24 py-3 text-xl rounded-xl"
                >
                  <HashLoader
                    color="white"
                    size={24}
                  ></HashLoader>
                </button>
              )}
            </div>
          </motion.div>
        </form>
      ) : (
        <Gamer
          flashCard={flashcard}
          session={isplay}
        ></Gamer>
      )}
    </>
  );
}
