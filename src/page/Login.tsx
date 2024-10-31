/** @format */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/icon/logo";
import { useFetch } from "../customhook";
import { useState } from "react";
import { GetPostRequest } from "../utilz/Request/postRequest";
import { useNavigate } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
interface LoginInterFace {
  email: string;
  password: string;
}
export default function Login() {
  const { SetAccessToken, SetRefreshToken, setUserWithStorage, user } =
    useStateUserContext();
  console.log(user);
  const navigate = useNavigate();
  const { isLoading, setLoading, setError, error } = useFetch();
  const [data, changedata] = useState<LoginInterFace>({
    email: "",
    password: "",
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
    const { password, email } = data;
    setLoading(true);
    if (password && email) {
      const response = await GetPostRequest({
        route: "api/auth/login",
        body: { password, email },
      });
      if (response.success) {
        console.log("Đăng nhập thành công");
        SetAccessToken(
          response?.response?.headers?.get("Authorization")?.split(" ")[1] ||
            null
        );
        SetRefreshToken(
          response?.response?.headers?.get("x-refresh-token") || null
        );
        console.log(response.data.user);
        setUserWithStorage(response.data.user);
        navigate("/dashboard");
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
      <section className=" w-screen  h-screen bg-secondary2   font-opensans flex items-center font-light justify-center ">
        <div className=" bg-white bg-opacity-75 min-w-64 w-1/3  rounded-md shadow-lg py-12 px-6">
          <div className=" w-full flex justify-center">
            <Logo
              width={100}
              height={100}
            ></Logo>
          </div>

          <form
            action=""
            onSubmit={onSubmitHandler}
            className=" flex flex-col space-y-6"
          >
            <h5 className=" text-center font-opensans text-3xl font-light pb-2">
              Đăng nhập
            </h5>
            <p className=" text-red-600 text-sm mx-auto">{error}</p>
            <div className=" flex flex-col space-x-1">
              <p className=" text-sm">Tên đăng nhập:</p>
              <input
                className="border  border-gray-400 rounded-md py-2 px-4"
                name="email"
                value={data.email}
                onChange={onChangeData}
                type="text"
              />
            </div>
            <div className=" flex flex-col space-x-1">
              <p className=" text-sm">Mật khẩu:</p>
              <input
                className="border border-gray-400 rounded-md py-2 px-4"
                type="text"
                name="password"
                onChange={onChangeData}
              />
            </div>
            <div className=" w-full flex justify-end space-x-2 italic text-xs">
              <Link to="/forgotpassword">Quên mật khẩu ?</Link>
              <Link to="/register">Chưa có tài khoản ?</Link>
            </div>
            <div className=" pt-4 w-1/2 mx-auto ">
              {isLoading ? (
                <button className=" opacity-65  border bg-primary text-white border-primary w-full py-2 px-4 rounded-md">
                  Đăng nhập
                </button>
              ) : (
                <button className="  border bg-primary text-white border-primary w-full py-2 px-4 rounded-md">
                  Đăng nhập
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
