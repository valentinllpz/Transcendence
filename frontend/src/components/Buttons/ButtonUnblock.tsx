import styles from "../../styles/Home.module.css";
import { IUserPublic, IUserSelf } from "../../interfaces/IUser";
import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonUnblock({
  userSelf,
  displayedUser,
}: {
  userSelf: IUserSelf;
  displayedUser: IUserPublic;
}) {
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const sessionContext = useSessionContext();

  const unblockAUser = async () => {
    // if (
    // sessionContext.userSelf.login42 !== null &&
    // userSelf.login42 !== displayedUser.login42
    // ) {
    await userService
      .unblockUser(userSelf.login42, displayedUser.login42)
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    socketContext.socket.emit("user:update-relations");
    // }
  };

  return (
    <button
      className={styles.social_friend_card_unblock_button}
      onClick={unblockAUser}
    >
      Unblock
    </button>
  );
}
