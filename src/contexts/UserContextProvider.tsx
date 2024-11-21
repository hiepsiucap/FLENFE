/** @format */

import { ReactNode, useEffect } from "react";
import { createContext, useContext, useState } from "react";

export interface StateContextType {
  user: User | null;
  accesstoken: string | null;
  refreshtoken: string | null;
  notification: string | null | undefined;
  setUserWithStorage: (user: User | null) => void;
  SetAccessToken: (token: string | null) => void;
  SetRefreshToken: (token: string | null) => void;
  SetNotification: (token: string | null) => void;
}
const StateContext = createContext<StateContextType>({
  user: null,
  accesstoken: null,
  refreshtoken: null,
  notification: null,
  setUserWithStorage: () => {},
  SetAccessToken: () => {},
  SetRefreshToken: () => {},
  SetNotification: () => {},
});
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
  scoreADay: number;
  subscription: Subscription;
  level_description: string;
}
interface UserContextProviderProps {
  children: ReactNode;
}
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("USER_DATA");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notification, setNotification] = useState<string | null>();
  const [accesstoken, setAccessToken] = useState<string | null>(
    localStorage.getItem("ACCESS_TOKEN") as string
  );
  const [refreshtoken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("REFRESH_TOKEN") as string
  );

  useEffect(() => {
    const validate = async () => {
      if (accesstoken && refreshtoken) {
        console.log(accesstoken, refreshtoken);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_SERVER}/api/auth/validate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accesstoken}`, // Properly format Authorization header
              "X-refresh-token": refreshtoken,
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          setUser(null);
          setAccessToken("");
          setRefreshToken("");
        } else {
          const data = await response.json();
          setUser(data.user);
        }
      }
    };
    validate();
  }, []);
  const SetAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
      setAccessToken(token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };
  const SetRefreshToken = (token: string | null) => {
    setRefreshToken(token);
    if (token) {
      localStorage.setItem("REFRESH_TOKEN", token);
    } else {
      localStorage.removeItem("REFRESH_TOKEN");
    }
  };
  const SetNotification = (notification: string | null) => {
    setNotification(notification);
  };
  const setUserWithStorage = (user: User | null) => {
    if (user) {
      const safeUserData = {
        name: user.name,
        ava: user.ava,
        role: user.role,
        streak: user.streak,
        totalscore: user.totalscore,
        id: user._id,
        level_description: user.level_description,
        scoreADay: user.scoreADay,
        subscription: user.subscription,
      };
      localStorage.setItem("USER_DATA", JSON.stringify(safeUserData));
      setUser(user);
    } else {
      localStorage.removeItem("USER_DATA");
      setUser(null);
    }
  };
  return (
    <StateContext.Provider
      value={{
        user,
        accesstoken,
        refreshtoken,
        setUserWithStorage,
        notification,
        SetNotification,
        SetAccessToken,
        SetRefreshToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateUserContext = () => {
  return useContext(StateContext);
};
