/** @format */

import React, { useEffect, useState } from "react";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { LevelDescription } from "../utilz/Constant";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
interface topUser {
  _id: string;
  name: string;
  ava: string;
  totalscore: number;
  level_description: "Newbie";
}
export default function Ranking() {
  const { accesstoken, user, refreshtoken } = useStateUserContext();
  const [listUser, changeListUser] = useState<topUser[]>([]);
  const [myrank, changeMyRank] = useState<number>(0);

  const navigate = useNavigate();
  useEffect(() => {
    const getTopUser = async () => {
      const response = await GetRequestWithCre({
        route: "api/users/top",
        accesstoken,
        refreshtoken,
      });
      if (response.success) {
        changeListUser(response.data.listuser);
        changeMyRank(response.data.ranking);
      } else {
        Swal.fire("Xác thực thất bại ", `<p>${response.msg}</p>`, "error").then(
          async () => {
            navigate("/user");
          }
        );
      }
    };
    getTopUser();
  }, []);
  return (
    <div className=" flex w-full">
      <div className=" w-1/5"></div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className=" w-4/5  font-opensans mt-6  text-black"
      >
        <h2 className=" text-center font-semibold  text-2xl  text-primary">
          Bảng xếp hạng điểm{" "}
        </h2>
        {listUser.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className=" flex px-24 w-2/3 mx-auto py-6 flex-col space-y-4"
          >
            {listUser.map((topuser, index) => {
              return (
                <div
                  className={`flex relative ${
                    index < 3 ? "border-primary  shadow-lg" : "border-primary "
                  }  border-2 rounded-xl shadow-md px-4 py-1 items-center justify-between`}
                >
                  <div className=" flex justify-start space-x-2 items-center">
                    <div className=" w-12 font-semibold text-primary text-xl">
                      {index + 1}
                      {index == 0
                        ? "st"
                        : index == 1
                        ? "nd"
                        : index == 2
                        ? "rd"
                        : "th"}
                    </div>
                    <div className=" flex items-center space-x-1">
                      <img
                        src={topuser.ava}
                        className=" w-12 h-12"
                        alt=""
                      />
                      <p className=" font-semibold w-fit">{topuser.name}</p>
                    </div>
                    <div className=" flex items-center space-x-1">
                      <img
                        src={
                          LevelDescription.find(
                            (level) => level.name == topuser.level_description
                          )?.img
                        }
                        className=" w-10 h-10"
                        alt=""
                      />
                      <p className=" font-semibold ">
                        {topuser.level_description}
                      </p>
                    </div>
                  </div>
                  <div className=" font-semibold text-2xl text-primary">
                    {topuser.totalscore}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`flex relative ${
            myrank < 3 ? "border-primary  shadow-lg" : "border-primary "
          }  border-2 rounded-xl shadow-2xl px-4 py-2 w-2/3  mx-auto   items-center justify-between`}
        >
          <div className=" flex justify-start space-x-2 items-center">
            <div className=" w-fit font-semibold text-primary text-xl">
              {myrank}
              {myrank == 1
                ? "st"
                : myrank == 2
                ? "nd"
                : myrank == 3
                ? "rd"
                : "th"}
            </div>
            <div className=" flex items-center space-x-1">
              <img
                src={user?.ava}
                className=" w-12 h-12"
                alt=""
              />
              <p className=" font-semibold w-fit">{user?.name}</p>
            </div>
            <div className=" flex items-center space-x-1">
              <img
                src={
                  LevelDescription.find(
                    (level) => level.name == user?.level_description
                  )?.img
                }
                className=" w-10 h-10"
                alt=""
              />
              <p className=" font-semibold ">{user?.level_description}</p>
            </div>
          </div>
          <div className=" font-semibold text-2xl text-primary">
            {user?.totalscore}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}