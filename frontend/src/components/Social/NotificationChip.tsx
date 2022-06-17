import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { useSessionContext } from "../../context/SessionContext";
import { IUserPublic } from "../../interfaces/IUser";

import Badge from "@mui/material/Badge";

import userService from "../../services/user";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export const NotificationChip = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [notifications, setNotifications] = useState<IUserPublic[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUserPublic[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriendRequestsReceived(sessionContext.userSelf.login42)
      .then((notifications: IUserPublic[]) => {
        setNotifications(notifications);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    userService
      .getUserBlockedUsers(sessionContext.userSelf.login42)
      .then((blocked: IUserPublic[]) => {
        setBlockedUsers(blocked);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserFriendRequestsReceived(sessionContext.userSelf.login42)
        .then((notifications: IUserPublic[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
      userService
        .getUserBlockedUsers(sessionContext.userSelf.login42)
        .then((blocked: IUserPublic[]) => {
          setBlockedUsers(blocked);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });
  }, []);

  const requests = notifications?.filter(
    (notification) =>
      !blockedUsers?.some(
        (blockedUser) => blockedUser.login42 === notification.login42
      )
  );

  if (typeof requests === "undefined") {
    return children;
  }
  return (
    <Badge badgeContent={requests.length} color="primary">
      {children}
    </Badge>
  );
};
