import {
  FormEventHandler,
  ChangeEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { Dock } from "./Dock";
import { IUserCredentials, IUser } from "../../interfaces/users";
import userService from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function DockGuest() {
  const loginContext = useLoginContext();

  const [username, setUsername] = useState("");

  const addUser: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const newUserCredentials: IUserCredentials = {
      login42: username,
    };

    userService.addOne(newUserCredentials).then((user:IUser) => {
      loginContext.login(user.login42, "");
      socket.emit("user:new", username);
      setUsername("");
    });
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.value) {
      setUsername(event.target.value);
    }
  };

  return (
    <Dock>
      <form onSubmit={addUser}>
        <TextField
          value={username}
          onChange={handleUsernameChange}
          label="Login"
        />
        <Button type="submit">add</Button>
      </form>
    </Dock>
  );
}

// export default function DockGuest() {
// 	return (
// 	  <Dock>
// 		<IconButton className={styles.icons} aria-label="Authentification">
// 			<Image
// 				src = {FTLogo}
// 				layout = {'fill'}
// 			/>
// 		</IconButton>
// 	  </Dock>
// 	);
//   }
