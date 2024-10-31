/** @format */

import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { ColorRing } from "react-loader-spinner";
import { useFetch } from "../customhook";
import { useNavigate } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { GetPostRequestFormDataWithCre } from "../utilz/Request/postRequest";
import Swal from "sweetalert2";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // màu đen nhạt cho background ngoài modal
  },
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFFFFF",
    width: "40%",
    padding: "20px",
    borderRadius: "10px", // thêm radius 10px
  },
};

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");
const CreateBook: React.FC = () => {
  const navigate = useNavigate();
  const { accesstoken, refreshtoken } = useStateUserContext();
  const { isLoading, setLoading, setError, error } = useFetch();
  const [file, changefile] = useState<File | null>(null);
  const [name, changename] = useState("");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  function openModal() {
    setIsOpen(true);
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      changefile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = "#f00";
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (file && name) {
      const formdata = new FormData();
      formdata.set("file", file);
      formdata.set("name", name);
      const response = await GetPostRequestFormDataWithCre({
        route: "api/bookstore/create",
        accesstoken,
        refreshtoken,
        formdata,
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
        className=" py-3 px-6 rounded-lg bg-primary text-lg text-slate-100 mr-12"
      >
        Tạo sổ từ mới
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
          className=" pb-10 flex flex-col  space-y-2"
        >
          <div className="bg-white pb-5 w-full h-full text-center font-opensans text-2xl">
            Tạo sổ từ mới{" "}
          </div>
          <p className=" text-sm text-red-500">{error}</p>
          <div className=" flex w-full flex-col space-x-1">
            <p className=" text-sm">Tên sổ từ:</p>
            <input
              className="border border-gray-400 rounded-md py-2 px-4"
              type="text"
              name="password"
              onChange={(e) => {
                changename(e.target.value);
              }}
              value={name}
              // onChange={onChangeData}
            />
          </div>

          <p className=" text-sm pt-2">Ảnh sổ từ:</p>
          <button
            type="button"
            onClick={() => {
              if (imageRef.current) imageRef.current.click();
            }}
            className="p-10 relative border w-32 h-32 rounded-xl overflow-hidden border-gray-500 border-dashed"
          >
            {preview && (
              <img
                src={preview}
                className=" absolute w-full h-full top-0 left-0"
              ></img>
            )}
          </button>
          <input
            type="file"
            className=" hidden"
            onChange={handleFileChange}
            ref={imageRef}
          />
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
                  colors={["#e15b64"]}
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
export default CreateBook;
