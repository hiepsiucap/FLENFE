/** @format */

import React, { useState, useRef } from "react";
import Modal from "react-modal";
import hamburger from "../assets/image/hamburger.png";
import { Link } from "react-router-dom";
const customStyles = {
  content: {
    top: "0%",
    left: "50%",
    height: "100%",
    width: "50%",
    bottom: "auto",
    borderLeft: "1px solid #f0f0f0",
    border: "none", // Remove border on all sides, including the Y-axis
  },
};

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");

const Hamburger: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const subtitle = useRef<HTMLHeadingElement | null>(null);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = "#f00";
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>
        {" "}
        <img
          src={hamburger}
          alt=" w-12 h-12"
          className=" w-8 h-8"
        />
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <ul className=" flex  flex-col space-y-3  py-6 items-center justify-center ">
          <li className=" flex space-x-2   items-center text-md font-light">
            <Link
              onClick={closeModal}
              className={
                location.pathname === "/"
                  ? " border-b-2 pb-2 px-2 border-gray-600"
                  : " border-b-2 pb-2 px-2 border-white"
              }
              to="/"
            >
              Trang chủ
            </Link>{" "}
          </li>
          <li className=" flex space-x-2 items-center text-md font-light">
            <Link
              onClick={closeModal}
              className={
                location.pathname === "/product"
                  ? " border-b-2 pb-2 px-2 border-gray-600"
                  : " border-b-2 pb-2 px-2 border-white"
              }
              to="/product"
            >
              Sản phẩm
            </Link>
          </li>
          <li className=" flex space-x-2 items-center text-md font-light">
            <Link
              onClick={closeModal}
              to="/description"
              className={
                location.pathname === "/description"
                  ? " border-b-2 pb-2 px-2 border-gray-600"
                  : " border-b-2 pb-2 px-2 border-white"
              }
            >
              Hướng dẫn
            </Link>
          </li>
          <li className=" flex space-x-2 items-center text-md font-light">
            <Link
              onClick={closeModal}
              to="/posts"
              className={
                location.pathname === "/posts"
                  ? " border-b-2 pb-2 px-2 border-gray-600"
                  : " border-b-2 pb-2 px-2 border-white"
              }
            >
              Tin tức
            </Link>
          </li>
        </ul>
      </Modal>
    </div>
  );
};
export default Hamburger;
