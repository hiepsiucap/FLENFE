/** @format */
import { Link, Outlet } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { Navigate } from "react-router-dom";
import Podium from "../assets/image/podium.png";
import Logo from "../assets/icon/logo";
import fire from "../assets/image/fire.png";
import { useLocation } from "react-router-dom";
import Console from "../assets/image/console.png";
import { LevelDescription } from "../utilz/Constant";
import book from "../assets/image/agenda.png";
import dangxuat from "../assets/image/dangxuat.png";
import { useEffect, useState } from "react";
import cheems from "../assets/image/cheems.png";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { GetRequestWithCre } from "../utilz/Request/getRequest";
export default function DefaultLayout() {
  const {
    user,
    accesstoken,
    refreshtoken,
    SetAccessToken,
    setUserWithStorage,
    SetRefreshToken,
  } = useStateUserContext();
  const location = useLocation();
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const GetTotal = async () => {
      const response = await GetRequestWithCre({
        route: "api/session/totalscore",
        accesstoken,
        refreshtoken,
      });
      console.log(response);
      if (response.success) {
        setTotal(response.data.totalScore);
        console.log(response.data.totalScore);
      }
    };
    GetTotal();
  }, [accesstoken, refreshtoken]);
  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }
  const onClickHandler = () => {
    setUserWithStorage(null);
    SetAccessToken(null);
    SetRefreshToken(null);
  };
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className=" fixed w-full   bg-white shadow-sm">
        <nav className=" md:container p-1 pt-2 mx-auto flex items-center justify-between">
          <div className=" flex">
            <Logo
              width={70}
              height={70}
            ></Logo>
          </div>
          <div className=" flex items-center space-x-12 ">
            <div className=" flex items-center space-x-2">
              <img
                src={user.ava}
                className=" w-12 h-12"
                alt=""
              />
              <h5 className=" font-opensans text-lg ">{user.name}</h5>
            </div>
            <div className=" flex items-center space-x-2">
              <img
                src={fire}
                className=" w-9 h-9"
                alt=""
              />
              <h5 className=" font-opensans text-xl font-semibold ">
                {user.streak}
              </h5>
            </div>
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
            <div className=" flex items-center space-x-2">
              <img
                src={
                  LevelDescription.find(
                    (level) => level.name == user.level_description
                  )?.img
                }
                alt={`${user.level_description} Medal`}
                className="w-9"
              />
              <h5 className=" font-opensans text-lg font-semibold ">
                {user.level_description}
              </h5>
            </div>
            <button
              onClick={onClickHandler}
              className=" flex items-center space-x-2"
            >
              <img
                src={dangxuat}
                className=" w-9 h-9"
                alt=""
              />
            </button>
          </div>
        </nav>
      </div>
      <div className=" w-full pt-20">
        <div className="w-1/6 fixed flex flex-col  items-center justify-start py-12 bg-white shadow-md h-screen">
          <Link
            to="/playgame"
            className={
              location.pathname === "/playgame"
                ? "flex w-full justify-center bg-secondary rounded-md space-x-2 py-4  items-center"
                : "flex w-full justify-center  rounded-md space-x-2 py-4  items-center"
            }
          >
            <img
              src={Console}
              className=" w-8 h-8"
              alt=""
            />
            <p className=" font-opensans">Chơi game</p>
          </Link>
          <Link
            to="/wordbank"
            className={
              location.pathname === "/wordbank"
                ? "flex w-full justify-center bg-secondary rounded-md space-x-2 py-4  items-center"
                : "flex w-full justify-center  rounded-md space-x-2 py-4  items-center"
            }
          >
            <img
              src={book}
              className=" w-8 h-8"
              alt=""
            />
            <p className=" font-opensans">Sổ từ vựng</p>
          </Link>
          <Link
            to="/ranking"
            className={
              location.pathname === "/ranking"
                ? "flex w-full justify-center bg-secondary rounded-md space-x-2 py-4  items-center"
                : "flex w-full justify-center  rounded-md space-x-2 py-4  items-center"
            }
          >
            <img
              src={Podium}
              className=" w-8 h-8"
              alt=""
            />
            <p className=" font-opensans">Bảng xếp hạng</p>
          </Link>
        </div>
        <div className=" w-full">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
