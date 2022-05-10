import React from "react";

import styles from "../../styles/Home.module.css";
import { useLoginContext } from "../../context/LoginContext";

import Cookies from "js-cookie";

export function ButtonLogout() {
  const loginContext = useLoginContext();

  const handleOnClick = () => {
    loginContext.logout?.();
    Cookies.remove("transcendence_accessToken", { path: "/", sameSite: "strict" }); // options in .env?
  };

  if (loginContext.userLogin === null) return null;
  return (
    <button className={styles.logout_button} onClick={handleOnClick}>
      Logout
    </button>
  );
}
