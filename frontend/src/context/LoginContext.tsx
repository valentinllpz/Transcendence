import { createContext, useContext, useState } from "react";
import React from "react";
import Router from "next/router";

import Cookies from "js-cookie";

import { defaultLoginState, ILoginContext } from "../interfaces/ILoginContext";

import getConfig from "next/config";
import { useSocketContext } from "./SocketContext";
const { publicRuntimeConfig } = getConfig();

const LoginContext = createContext<ILoginContext>(defaultLoginState);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const socketContext = useSocketContext();
  const [userLogin, setUserLogin] = useState(defaultLoginState.userLogin);
  const [chatMenu, setChatMenu] = useState(defaultLoginState.chatMenu);
  const [chatDM, setChatDM] = useState(defaultLoginState.chatDM);

  const login = (userLogin: string) => {
    socketContext.socket.emit("user:logged", userLogin);

    setUserLogin(userLogin);
  };

  const logout = () => {
    setUserLogin(null);
    Router.push("/");
    Cookies.remove(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME, {
      path: publicRuntimeConfig.ACCESSTOKEN_COOKIE_PATH,
    });
  };

  return (
    <LoginContext.Provider
      value={{
        userLogin,
        chatMenu,
        setChatMenu,
        chatDM,
        setChatDM,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export function useLoginContext() {
  return useContext(LoginContext);
}
