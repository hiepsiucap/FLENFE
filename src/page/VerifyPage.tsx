/** @format */

import { motion } from "framer-motion";
import Logo from "../assets/icon/logo";
import { useEffect, useState } from "react";
import { GetPostRequest } from "../utilz/Request/postRequest";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function VerifyPage() {
  const navigate = useNavigate();
  const [isVerify, changeIsVerify] = useState(false);
  useEffect(() => {
    const GetVefify = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      if (token && email) {
        const response = await GetPostRequest({
          route: "api/auth/verifyemail",
          body: {
            email: email,
            verifyToken: token,
          },
        });
        if (response.success) {
          changeIsVerify(true);
        } else {
          Swal.fire(
            "Xác thực thất bại ",
            `<p>${response.msg}</p>`,
            "error"
          ).then(async () => {
            navigate("/login");
          });
        }
      }
    };
    GetVefify();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <section className=" w-screen bg-secondary2  h-screen  flex items-center font-light justify-center ">
        {isVerify && (
          <div className=" bg-white min-w-64 bg-opacity-50 w-1/3 font-sans rounded-md shadow-lg py-12 px-6">
            <div className=" w-full flex justify-center">
              <Logo
                width={80}
                height={80}
              ></Logo>
            </div>
            <div className=" text-center text-green-500 font-bold text-2xl py-12">
              Xác thực thành công
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
}
