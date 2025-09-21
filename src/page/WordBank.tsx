/** @format */

import { useEffect, useState } from "react";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { formatDate } from "../utilz/Format";
import { CreateBook } from "../component";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Bin from "../assets/icon/bin";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { DeleteRequestWithCre } from "../utilz/Request/DeteleRequest";
import RotateLoader from "react-spinners/RotateLoader";
interface wordbank {
  _id: string;
  name: string;
  user: string;
  numsofcard: number;
  ava: string;
}
interface lastSessionInterface {
  _id: string;
  date: string;
  score: number;
  status: string;
}
interface result {
  _id: string;
  book: wordbank;
  lastSession: lastSessionInterface;
  dueCardsCount: number;
}
export default function WordBank() {
  const { accesstoken, refreshtoken } = useStateUserContext();
  const [data, changeData] = useState<result[]>();
  const [loading, changeLoading] = useState<boolean>(true);
  useEffect(() => {
    const GetRequest = async () => {
      const resultdata = await GetRequestWithCre({
        route: "api/bookstore/all",
        refreshtoken,
        accesstoken,
      });
      if (resultdata.success) {
        console.log(resultdata);
        changeData(resultdata.data.listbook);
        changeLoading(false);
      } else {
        console.log(resultdata.msg);
        changeLoading(false);
      }
    };

    GetRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const DeleteHandler = async (id: string) => {
    if (id) {
      const response = await DeleteRequestWithCre({
        route: `api/bookstore/delete/${id}`,
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
  const navigate = useNavigate();
  console.log(data);
  return (
    <div className=" flex w-full">
      <div className=" hidden md:block md:w-1/5 "></div>
      {loading ? (
        <div className=" md:w-4/5 w-full  font-opensans mt-6 flex justify-center items-center h-32  text-black">
          {" "}
          <RotateLoader color="#14e1cf" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className=" w-full mx-6 md:mx-0 md:w-4/5  font-opensans mt-6 md:pr-6  text-black"
        >
          <div className=" flex justify-between items-center">
            <div>
              <h3 className=" font-opensans text-2xl  md:text-3xl">
                Sổ từ của tôi
              </h3>
              <div className=" hidden md:block text-gray-700 py-2">
                {data?.length} sổ từ |{" "}
                {data?.reduce(
                  (total, book) => (total += book?.book?.numsofcard),
                  0
                ) + " "}
                từ vựng đã lưu | 0 từ vựng thành thạo
              </div>
              <div className=" md:hidden text-gray-700 pb-2 md:py-2">
                {data?.length} sổ từ đã lưu
              </div>
            </div>
            <CreateBook></CreateBook>
          </div>
          {data && data?.length > 0 ? (
            <div className=" grid md:grid-cols-3 grid-cols-1  gap-6   h-64 ">
              {data?.map((book) => {
                return (
                  <Link
                    to={`/wordbank/${book._id}`}
                    className=" shadow-md p-4  bg-white bg-opacity-100 rounded-lg border border-slate-200"
                  >
                    <div className=" flex justify-between ">
                      <div className=" font-opensans flex space-x-4 items-center justify-start">
                        <img
                          src={book?.book?.ava}
                          alt=""
                          className=" w-20 h-20 rounded-full border "
                        />
                        <div className=" flex flex-col">
                          <div className=" font-semibold">
                            {book.book?.name}
                          </div>
                          <div>{book?.book?.numsofcard} từ vựng</div>
                        </div>
                      </div>
                      <button
                        onClick={async (event) => {
                          event.stopPropagation(); // Ngăn chặn sự kiện click lan ra <Link>
                          event.preventDefault();
                          Swal.fire({
                            title: `Bạn có chắc xoá từ ${book.book.name}?`,
                            text: "Từ vững sẽ bị xoá vĩnh viễn",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            cancelButtonText: "Không xoá nữa",
                            confirmButtonText: "Xoá đi!",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              await DeleteHandler(book._id);
                            }
                          });
                        }}
                      >
                        <Bin width={20}></Bin>
                      </button>
                    </div>
                    <div className=" mx-auto text-center text-sm pt-6 ">
                      Ngày ôn tập gần nhất:{" "}
                      <span className=" text-primary font-bold">
                        {formatDate(book?.lastSession?.date)}
                      </span>
                    </div>
                    <div className=" mx-auto text-center text-sm pt-2 ">
                      Số từ ôn tập hôm nay:{" "}
                      <span className=" text-primary font-bold">
                        {book.dueCardsCount} từ
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className=" md:w-4/5 w-full italic  font-opensans mt-6 flex justify-center  pl-12 h-32  text-black">
              {" "}
              <h2>Không có sổ từ</h2>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
