/** @format */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/icon/logo";
import { useFetch } from "../customhook";
import { GetPostRequest } from "../utilz/Request/postRequest";
import { useState } from "react";
export default function ForgotPassword() {
  const [email, changeemail] = useState<string>("");
  const { isLoading, setLoading, error, setError } = useFetch();
  const [issend, changesend] = useState<boolean>(false);
  const onSumbitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(false);
    setError("");
    if (email) {
      const response = await GetPostRequest({
        route: "api/auth/forgotpassword",
        body: { email },
      });
      if (response.success) {
        changesend(true);
      } else {
        setError(response.msg || "Gọi api thất bại");
      }
    } else {
      setError("Vui lòng điền email");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <section className=" w-screen bg-secondary2  h-screen  flex items-center font-light justify-center ">
        <div className=" bg-white min-w-64 bg-opacity-50 w-1/3 font-sans rounded-md shadow-lg py-12 px-6">
          {!issend ? (
            <>
              <div className=" w-full flex justify-center">
                <Logo
                  width={50}
                  height={50}
                ></Logo>
              </div>
              <form
                action=""
                onSubmit={onSumbitHandler}
                className=" flex flex-col space-y-6"
              >
                <h5 className=" text-center text-3xl font-light pb-2">
                  Quên mật khẩu
                </h5>
                <p className=" text-red-600 text-sm mx-auto">{error}</p>
                <div className=" flex flex-col space-x-1">
                  <p className=" text-sm">Email xác thực:</p>
                  <input
                    className="border border-gray-400 rounded-md py-2 px-4"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      changeemail(e.target.value);
                    }}
                  />
                </div>
                <div className=" w-full flex justify-end space-x-2 italic text-xs">
                  <Link to="/login">Đăng nhập ?</Link>
                  <Link to="/register">Chưa có tài khoản ?</Link>
                </div>
                <div className=" pt-4 w-1/2 mx-auto ">
                  {!isLoading ? (
                    <button className="  border border-primary2 bg-primary text-white w-full py-2 px-4 rounded-md">
                      Gửi Email đăng kí
                    </button>
                  ) : (
                    <button
                      disabled
                      className="  bg-opacity-65 border border-primary2 bg-primary text-white w-full py-2 px-4 rounded-md"
                    >
                      Gửi Email đăng kí
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div>
              <div className=" w-full flex justify-center">
                <Logo
                  width={50}
                  height={50}
                ></Logo>
              </div>
              <h5 className=" text-center text-3xl font-light pb-2">
                Gửi Email thành công
              </h5>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
