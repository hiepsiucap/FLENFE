/** @format */

import React, { useState, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import Modal from "react-modal";
import { ColorRing } from "react-loader-spinner";
import Edit from "../assets/icon/edit";
import { useFetch } from "../customhook";
import { useNavigate } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import Swal from "sweetalert2";
import RotateLoader from "react-spinners/RotateLoader";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { PatchRequestWithCre } from "../utilz/Request/PatchRequest";
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
    width: window.innerWidth < 768 ? "80%" : "60%",
    padding: "20px",
    borderRadius: "10px",
  },
};
interface Word {
  _id: string;
  phonetic: string;
  text: string;
  meaning: string;
  example: string;
  image: string;
}
interface FlashCardInterface {
  bookId: string;
  text: string;
  meaning: string;
  phonetic: string;
  example: string;
  image: string;
}
Modal.setAppElement("#root");

const UpdateWord = ({ Word }: { Word: Word }) => {
  const navigate = useNavigate();
  const { accesstoken, refreshtoken } = useStateUserContext();
  const [loading, changeloading] = useState(false);
  const [listImage, changeListImage] = useState([]);
  const [ldimg, changeldimg] = useState(false);
  const [aiMeaning, changeAiMeaning] = useState<
    { meaning: string; type: string; definition: string }[]
  >([]);

  const { isLoading, setLoading, error, setError } = useFetch();
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  function openModal() {
    setIsOpen(true);
  }
  const [data, changedata] = useState<FlashCardInterface>({
    bookId: Word?._id,
    text: Word?.text,
    meaning: Word?.meaning,
    phonetic: Word?.phonetic,
    example: Word?.example,
    image: Word?.image,
  });
  const AddImage = async () => {
    changeldimg(true);
    const response = await GetRequestWithCre({
      route: `api/flashcard/getpexelimage?word=${Word?.text}`,
      accesstoken,
      refreshtoken,
    });
    if (response.success) {
      changeListImage(response.data.data);
      changeldimg(false);
    }
  };
  console.log(data);

  console.log(listImage);
  const onChangeData = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.name === "meaning" && e.target.value === "custommeaning123") {
      changeAiMeaning([]);
      changedata((prev) => {
        return { ...prev, meaning: "", example: "" };
      });
      return;
    }
    if (e.target.name === "meaning") {
      changedata((prev) => {
        return {
          ...prev,
          example:
            aiMeaning.find((mn) => mn.meaning === e.target.value)?.definition ||
            "",
        };
      });
    }
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
    const { text, example, phonetic, meaning, bookId } = data;
    const predata = {
      bookId: bookId,
      data: { image: selectedImageUrl, text, example, phonetic, meaning },
    };
    console.log(predata);
    if (text && meaning && bookId && selectedImageUrl) {
      const response = await PatchRequestWithCre({
        route: "api/flashcard/update",
        accesstoken,
        refreshtoken,
        body: {
          bookId: bookId,
          data: { image: selectedImageUrl, text, example, phonetic, meaning },
        },
      });
      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Cập nhật thành công thành công",
          icon: "success",
          confirmButtonText: "Quay về",
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
  const [selectedImageUrl, setSelectedImageUrl] = useState(data.image);

  // Function to handle image selection
  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
  };
  return (
    <div className="overflow-y-auto">
      <button
        className="pt-1.5"
        onClick={openModal}
      >
        <Edit width={22}></Edit>
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
            Cập nhật từ <span className=" font-bold">{data.text}</span>
          </div>
          <p className=" text-sm text-red-500">{error}</p>
          <div className=" grid grid-cols-2 gap-4">
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
            <div>
              <div className=" flex w-full flex-col space-x-1">
                <p className=" text-sm">Dịch nghĩa:</p>
                {aiMeaning.length === 0 ? (
                  <input
                    className="border border-gray-400 rounded-md py-2 px-4"
                    type="text"
                    name="meaning"
                    onChange={onChangeData}
                    value={data.meaning}
                  />
                ) : (
                  <select
                    className="border border-gray-400 rounded-md py-2 px-4"
                    name="meaning"
                    onChange={onChangeData}
                    value={data.meaning}
                  >
                    {aiMeaning.map((mn) => {
                      return <option value={mn.meaning}>{mn.meaning}</option>;
                    })}
                    <option value="custommeaning123">
                      tự nhập nghĩa của bạn ......
                    </option>
                  </select>
                )}
              </div>
              {aiMeaning.length === 0 && data.text && !loading && (
                <button
                  type="button"
                  onClick={async () => {
                    changeloading(true);
                    const response = await GetRequestWithCre({
                      route: `api/translate/getgpt?text=${data.text}`,
                      accesstoken,
                      refreshtoken,
                    });
                    if (response.success)
                      changeAiMeaning(response.data?.meaningsArray);
                    changeloading(false);
                  }}
                  className="flex items-center space-x-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#37AFE1"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                  <p className=" text-sm  text-primary">
                    Tìm thêm nghĩa bằng AI
                  </p>
                </button>
              )}
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
            <div className=" flex items-center justify-start">
              <div className=" flex  flex-col space-x-1">
                <p className=" text-sm pb-2">Ảnh minh hoạ:</p>
                <div className=" flex items-center space-x-2">
                  <div
                    key={data.image}
                    className={`border  cursor-pointer transition-all overflow-hidden w-32 h-32 rounded-md ${
                      selectedImageUrl === data.image + " "
                        ? "border-blue-500 border-4 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:border-3"
                    }`}
                    onClick={() => handleImageSelect(data.image + " ")}
                  >
                    <img
                      src={data.image}
                      alt={data.image}
                      className="w-full h-full "
                    />
                  </div>
                  {ldimg ? (
                    <div className=" py-12 pl-24">
                      <RotateLoader color="#14e1cf" />
                    </div>
                  ) : (
                    listImage?.map((image) => {
                      return (
                        <div
                          key={image}
                          className={`border  cursor-pointer transition-all overflow-hidden w-32 h-32 rounded-md ${
                            selectedImageUrl === image
                              ? "border-blue-500 border-4 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:border-3"
                          }`}
                          onClick={() => handleImageSelect(image)}
                        >
                          <img
                            src={image}
                            alt={image}
                            className="w-full h-full "
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              {listImage.length === 0 && !ldimg && (
                <button
                  type="button"
                  onClick={AddImage}
                  className=" pl-4 flex  items-center justify-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#37AFE1"
                    className=" size-7"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <div className="  text-primary  font-semibold">
                    Tìm kiếm thêm ảnh
                  </div>
                </button>
              )}
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
                Cập nhật từ vựng
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default UpdateWord;
