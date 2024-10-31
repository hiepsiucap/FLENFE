/** @format */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/icon/logo";
import { useFetch } from "../customhook";
import { useState } from "react";
import { GetPostRequest } from "../utilz/Request/postRequest";

import { useStateUserContext } from "../contexts/UserContextProvider";
interface LoginInterFace {
  email: string;
  password: string;
  name: string;
  repassword: string;
}
export default function Register() {
  const { user } = useStateUserContext();
  console.log(user);
  const [issend, changesend] = useState<boolean>(false);
  const { isLoading, setLoading, setError, error } = useFetch();
  const [data, changedata] = useState<LoginInterFace>({
    email: "",
    password: "",
    name: "",
    repassword: "",
  });
  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    changedata((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  console.log(data);
  const onSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const { password, email, name, repassword } = data;
    if (repassword !== password) {
      return setError("Mật khẩu không giống nhau");
    }
    setLoading(true);
    if (password && email && name) {
      const response = await GetPostRequest({
        route: "api/auth/register",
        body: { password, email, name },
      });
      if (response.success) {
        console.log("Đăng Kí thành công");
        changesend(true);
      } else {
        setError(response.msg || "Đã có lỗi");
      }
      setLoading(false);
    } else {
      setError("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <section className=" w-screen font-sans  h-screen bg-secondary2   flex items-center font-light justify-center ">
        <div className=" bg-white min-w-64 w-1/3 bg-opacity-75  rounded-md shadow-lg py-12 px-6">
          <div className=" w-full flex justify-center">
            <Logo
              width={50}
              height={50}
            ></Logo>
          </div>
          {!issend ? (
            <form
              action=""
              onSubmit={onSubmitHandler}
              className=" flex flex-col space-y-6"
            >
              <h5 className=" text-center text-3xl font-light pb-2">Đăng Ký</h5>
              <p className=" text-red-600 text-sm mx-auto">{error}</p>
              <div className=" flex flex-col space-x-1">
                <p className=" text-sm">Email đăng kí:</p>
                <input
                  className="border border-gray-400 rounded-md py-2 px-4"
                  value={data.email}
                  name="email"
                  onChange={onChangeData}
                  type="text"
                />
              </div>
              <div className=" flex flex-col space-x-1">
                <p className=" text-sm">Tên của bạn:</p>
                <input
                  className="border border-gray-400 rounded-md py-2 px-4"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={onChangeData}
                />
              </div>
              <div className=" flex flex-col space-x-1">
                <p className=" text-sm">Mật khẩu:</p>
                <input
                  className="border border-gray-400 rounded-md py-2 px-4"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={onChangeData}
                />
              </div>
              <div className=" flex flex-col space-x-1">
                <p className=" text-sm">Nhập lại mật khẩu:</p>
                <input
                  className="border border-gray-400 rounded-md py-2 px-4"
                  type="password"
                  name="repassword"
                  value={data.repassword}
                  onChange={onChangeData}
                />
              </div>
              <div className=" w-full flex justify-end space-x-2 italic text-xs">
                <Link to="/forgotpassword">Quên mật khẩu ?</Link>
                <Link to="/login">Đã có tài khoản ?</Link>
              </div>
              <div className=" pt-4 w-1/2 mx-auto ">
                {isLoading ? (
                  <button className=" opacity-65  border bg-primary text-white border-primary w-full py-2 px-4 rounded-md">
                    Đăng ký
                  </button>
                ) : (
                  <button className="  border bg-primary text-white border-primary w-full py-2 px-4 rounded-md">
                    Đăng ký
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div>
              {" "}
              <h5 className=" text-center text-3xl font-light pb-2">
                Đăng ký thành công
              </h5>{" "}
              <p>Vui lòng kiểm tra email của bạn</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
