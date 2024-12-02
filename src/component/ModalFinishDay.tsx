/** @format */

import { useState, useRef } from "react";
import Modal from "react-modal";
import Champion from "../assets/image/champion.png";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import finishday from "../assets/audio/finish.mp3";
import { useStateUserContext } from "../contexts/UserContextProvider";
import "react-circular-progressbar/dist/styles.css";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // màu đen nhạt cho background ngoài modal
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFFFFF",
    width: "50%",
    padding: "20px",
    borderRadius: "10px", // thêm radius 10px
  },
};

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");
const FinishDay = ({ totalScore }: { totalScore: number }) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(true);
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  const { user } = useStateUserContext();

  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = "#f00";
    }
  }

  function closeModal() {
    setIsOpen(false);
  }
  new Audio(finishday).play();
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" flex flex-col items-center font-opensans pt-6 pb-12 justify-between space-y-12">
          <div className=" flex items-center font-semibold text-2xl font-opensans text-primary  flex-col space-y-12">
            <p> Chúc mừng bạn Hoàn thành thử thách ngày</p>
            <div className=" w-40 h-40">
              <CircularProgressbarWithChildren
                styles={buildStyles({
                  pathColor: "#37AFE1",
                  strokeLinecap: "",
                })}
                value={100}
              >
                <img
                  src={Champion}
                  alt=""
                  className=" w-32 h-32"
                />
              </CircularProgressbarWithChildren>
            </div>
            <div className=" text-center  font-semibold text-3xl">
              {totalScore}/{user?.scoreADay}
            </div>
          </div>
          <button
            onClick={closeModal}
            className=" py-2 px-6 bg-primary  text-white rounded-lg"
          >
            Kết thúc
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default FinishDay;
