/** @format */

import React, { useState, useRef } from "react";
import Modal from "react-modal";
import cheems from "../assets/image/cheems.png";
import { ColorRing } from "react-loader-spinner";
import { useFetch } from "../customhook";
import { useStateUserContext } from "../contexts/UserContextProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
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
    width: window.innerWidth < 768 ? "80%" : "40%",
    padding: "20px",

    borderRadius: "10px", // thêm radius 10px
  },
};
interface Subscription {
  title: string;
}
interface User {
  name: string;
  email: string;
  _id: string;
  role: string;
  ava: string;
  streak: number;
  totalscore: number;
  validDay: string;
  scoreADay: number;
  subscription: Subscription;
  level_description: string;
}
// Make sure to bind modal to your appElement
Modal.setAppElement("#root");
const ChooseTargetDay: React.FC<{ user: User; total: number }> = ({
  user,
  total,
}: {
  user: User;
  total: number;
}) => {
  //   const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  function openModal() {
    setIsOpen(true);
  }
  const options = [
    { label: "3000 điểm", value: "3000" },
    { label: "6000 điểm ", value: "6000" },
    { label: "20000 điểm", value: "20000" },
  ];

  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = "#f00";
    }
  }

  function closeModal() {
    setIsOpen(false);
  }
  const { accesstoken, refreshtoken } = useStateUserContext();
  const navigate = useNavigate();
  const { isLoading, setLoading } = useFetch();
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  console.log(selectedOption);
  const onClickHandler = async () => {
    setLoading(true);
    const newRequest = await PatchRequestWithCre({
      route: "api/users/changetarget",
      body: { scoreADay: Number(selectedOption) },
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
    console.log(newRequest);
    if (newRequest.success) {
      Swal.fire({
        title: "Success!",
        text: "Thay đổi điểm thành công",
        icon: "success",
        confirmButtonText: "Quay về",
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate(0);
        }
      });
    }
    setLoading(false);
  };
  return (
    <div>
      <button
        onClick={openModal}
        className=" flex  space-x-2 items-center
            "
      >
        <div className=" w-12 h-12">
          <CircularProgressbarWithChildren
            styles={buildStyles({
              pathColor: "#37AFE1",
              strokeLinecap: "butt",
            })}
            value={
              user.scoreADay < total
                ? 100
                : Number(total / user.scoreADay) * 100
            }
          >
            <img
              style={{ width: 40, marginTop: -2 }}
              src={
                user.scoreADay > total
                  ? "https://i.imgur.com/b9NyUGm.png"
                  : cheems
              }
              alt="doge"
            />
          </CircularProgressbarWithChildren>
        </div>
        <div className=" flex space-x-4">
          <p className=" font-opensans font-semibold text-lg text-primary1">
            {total}/{user.scoreADay}
          </p>
        </div>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            chọn target điểm theo ngày:
          </h2>
          <div className="space-y-3 font-semibold">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 border ${
                  selectedOption === option.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="radioOption"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={() => setSelectedOption(option.value)}
                  className="hidden"
                />
                <span className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center mr-3">
                  {selectedOption === option.value && (
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  )}
                </span>
                {option.label}
              </label>
            ))}
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
                <button
                  onClick={onClickHandler}
                  className=" w-1/2 font-opensans text-lg py-2 px-6 bg-primary text-slate-50 rounded-lg"
                >
                  Tạo mới
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ChooseTargetDay;
