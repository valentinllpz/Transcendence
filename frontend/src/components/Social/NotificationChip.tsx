import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../../interfaces/users";
import userService from "../../services/users";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function NotificationChip() {
  const loginContext = useLoginContext();
  const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriendRequestsReceived(loginContext.userLogin)
      .then((notifications: IUserPublicInfos[]) => {
        setNotifications(notifications);
      });
    userService
      .getUserBlocked(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedUsers(blocked);
      });

    socket.on("update-relations", () => {
      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        });
      userService
        .getUserBlocked(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedUsers(blocked);
        });
    });
  }, []);

  const requests = notifications.filter(
    (notification) =>
      !blockedUsers?.some(
        (blockedUser) => blockedUser.login42 === notification.login42
      )
  );

  if (typeof requests === "undefined" || requests.length === 0) {
    return null;
  }
  return <div className={styles.notification_chip}>{notifications.length}</div>;
}
