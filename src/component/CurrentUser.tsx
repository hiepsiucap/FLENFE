/** @format */

import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { formatDate } from "../utilz/Format";
const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    border: "0",
    zIndex: "50",
    width: "40%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
interface User {
  email: string;
  name: string;
  validDay: string;
}
Modal.setAppElement("#root");
export default function ModalGetCurrentUser({
  modalIsOpen,
  changeOpen,
}: {
  modalIsOpen: boolean;
  changeOpen: (open: boolean) => void;
}) {
  const { user } = useStateUserContext();
  const onSubmitHandler = () => {};
  const [data, changedata] = useState<User>({
    email: "",
    name: "",
    validDay: "",
  });
  const onChangeData = () => {};
  const CloseModal = () => {
    changeOpen(false);
  };
  useEffect(() => {
    if (user) {
      changedata({
        email: user?.email,
        name: user.name,
        validDay: user.validDay,
      });
    }
  }, [user]);
  return (
    <Modal
      isOpen={modalIsOpen}
      style={
        modalIsOpen
          ? {
              ...customStyles,
              content: {
                ...customStyles.content,
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1,
              },
            }
          : customStyles
      }
      onRequestClose={CloseModal}
      contentLabel="Example Modal"
    >
      <form
        onSubmit={onSubmitHandler}
        className="bg-white py-8 px-20 font-sans flex flex-col space-y-4 rounded-lg"
      >
        <div className=" flex justify-center  items-center">
          <img
            src={user?.ava}
            alt=""
            className=" w-32 h-32 "
          />
        </div>
        <div className=" flex justify-center  items-center">
          <div className=" font-semibold  bg-primary text-lg text-white px-8 py-2 rounded-2xl">
            {user?.subscription?.title.toUpperCase()}
          </div>
        </div>
        <div className=" flex flex-col space-x-1">
          <p className=" text-sm">Email:</p>
          <input
            className="border  border-gray-400 rounded-md py-2 px-4"
            name="email"
            value={data.email}
            onChange={onChangeData}
            type="text"
          />
        </div>
        <div className=" flex flex-col space-x-1">
          <p className=" text-sm">Họ và tên:</p>
          <input
            className="border border-gray-400 rounded-md py-2 px-4"
            type="text"
            name="password"
            value={data.name}
            onChange={onChangeData}
          />
        </div>
        <div className=" flex flex-col space-x-1">
          <p className=" text-sm">Gói đăng kí:</p>{" "}
          <input
            className="border  border-gray-400 rounded-md py-2 px-4"
            name="email"
            value={user?.subscription?.title}
            disabled
            type="text"
          />
        </div>
        <div className=" flex flex-col space-x-1">
          <p className=" text-sm">Ngày hết hạn:</p>
          <input
            className="border  border-gray-400 rounded-md py-2 px-4"
            name="email"
            value={formatDate(data.validDay)}
            disabled
            type="text"
          />
        </div>
        <div className=" py-4 flex items-center justify-center">
          <button className=" py-2  px-24 text-white font-semibold rounded-xl bg-primary  bg-opacity-80">
            {" "}
            Cập nhật
          </button>
        </div>
      </form>
    </Modal>
  );
}
