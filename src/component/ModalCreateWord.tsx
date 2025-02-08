/** @format */

import React, { useState, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import Modal from "react-modal";
import { ColorRing } from "react-loader-spinner";
import { useFetch } from "../customhook";
import { useNavigate } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { GetPostRequestWithCre } from "../utilz/Request/postRequest";
import Swal from "sweetalert2";
import plus from "../assets/image/icons8-plus-30.png";
import { useParams } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFFFFF",
    width: window.innerWidth < 768 ? "80%" : "40%",
    padding: "20px",
    borderRadius: "10px",
  },
};
interface FlashCardInterface {
  bookId: string;
  text: string;
  meaning: string;
  phonetic: string;
  example: string;
}
Modal.setAppElement("#root");

const CreateWord: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { accesstoken, refreshtoken } = useStateUserContext();
  const [loading, changeloading] = useState(false);
  const { isLoading, setLoading, error, setError } = useFetch();
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  function openModal() {
    setIsOpen(true);
  }
  const [data, changedata] = useState<FlashCardInterface>({
    bookId: "",
    text: "",
    meaning: "",
    phonetic: "",
    example: "",
  });
  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    changedata((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const changeData = ({ name, data }: { name: string; data: string }) => {
    changedata((prev) => {
      return { ...prev, [name]: data };
    });
  };
  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = "#f00";
    }
  }

  function closeModal() {
    setIsOpen(false);
  }
  async function fetchDictionaryData(
    text: string
  ): Promise<{ definition: string; phonetic: string }> {
    const response = await fetch(
      `${import.meta.env.VITE_DICTIONARY_API}/${text}`
    );
    const data = await response.json();
    return {
      definition: data[0]?.meanings[0]?.definitions[0]?.definition || "",
      phonetic: data[0]?.phonetic || "",
    };
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      console.log(searchTerm);
      if (!searchTerm.trim()) return;
      try {
        changeloading(true);
        const returndata = await fetchDictionaryData(searchTerm);
        changeData({ name: "phonetic", data: returndata.phonetic });
        changeData({ name: "example", data: returndata.definition });
        const returndata2 = await fetchTranslation(searchTerm);
        changeData({ name: "meaning", data: returndata2 });
        changeloading(false);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        console.log(e);
      }
    }, 300),
    []
  );
  const handleBlur = () => {
    debouncedFetch(data.text);
  };
  async function fetchTranslation(text: string): Promise<string> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL_SERVER}/api/translate`,
      {
        method: "POST",
        body: JSON.stringify({
          text,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return data?.meaning;
  }
  const onSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { text, example, phonetic, meaning } = data;
    if (text && meaning && bookId) {
      console.log("Book Id" + bookId);
      const response = await GetPostRequestWithCre({
        route: "api/flashcard/create",
        accesstoken,
        refreshtoken,
        body: { text, example, phonetic, meaning, bookId },
      });
      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Tạo mới thành công",
          icon: "success",
          confirmButtonText: "Quay vế",
        }).then(async (result) => {
          if (result.isConfirmed) {
            navigate(0);
          }
        });
        setLoading(false);
      } else {
        setLoading(false);
        setError(response.msg || "");
      }
    } else {
      setLoading(false);
      return setError("Vui lòng điền đầy đủ thông tin");
    }
  };
  return (
    <div>
      <button
        onClick={openModal}
        className=" py-3 px-6 hidden md:block rounded-lg bg-primary text-lg text-slate-100 mr-12"
      >
        Tạo từ mới
      </button>
      <button
        onClick={openModal}
        className=" py-2  px-2 md:hidden rounded-lg flex  items-end  space-x-1 bg-primary1  text-slate-100 mr-6"
      >
        <img
          src={plus}
          alt=""
          className=" w-6"
        />
        <p>từ mới</p>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form
          onSubmit={onSubmitHandler}
          className=" pb-10 flex flex-col relative  space-y-2"
        >
          <div className="bg-white pb-5 w-full h-full text-center font-opensans text-2xl">
            Tạo mới từ{" "}
          </div>
          <p className=" text-sm text-red-500">{error}</p>
          <div className=" flex flex-col space-y-5">
            <div className=" flex w-full flex-col space-x-1">
              <p className=" text-sm">Từ vựng:</p>
              <input
                className="border border-gray-400 rounded-md py-2 px-4"
                type="text"
                name="text"
                onBlur={handleBlur}
                onChange={onChangeData}
                value={data.text}
              />
              {loading && (
                <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <RotateLoader color="#14e1cf"></RotateLoader>
                </div>
              )}
            </div>
            <div className=" flex w-full flex-col space-x-1">
              <p className=" text-sm">Dịch nghĩa:</p>
              <input
                className="border border-gray-400 rounded-md py-2 px-4"
                type="text"
                name="meaning"
                onChange={onChangeData}
                value={data.meaning}
              />
            </div>
            <div className=" flex w-full flex-col space-x-1">
              <p className=" text-sm">Phiên âm:</p>
              <input
                className="border border-gray-400 rounded-md py-2 px-4"
                type="text"
                name="phonetic"
                onChange={onChangeData}
                value={data.phonetic}
              />
            </div>
            <div className=" flex w-full flex-col space-x-1">
              <p className=" text-sm">Định nghĩa:</p>
              <input
                className="border border-gray-400 rounded-md py-2 px-4"
                type="text"
                name="example"
                onChange={onChangeData}
                value={data.example}
              />
            </div>
          </div>
          <div className=" w-full py-2 flex justify-center">
            {isLoading ? (
              <button
                disabled
                className=" w-1/2 font-opensans flex justify-center text-lg py-2 px-6 bg-primary text-slate-50 rounded-lg"
              >
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#e15b64",
                    "#e15b64",
                    "#e15b64",
                    "#e15b64",
                  ]}
                />
              </button>
            ) : (
              <button className=" w-1/2 font-opensans text-lg py-2 px-6 bg-primary text-slate-50 rounded-lg">
                Tạo mới
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CreateWord;
