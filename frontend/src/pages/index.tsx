import { DockUser } from "../components/Dock/DockUser";
import styles from "../styles/Home.module.css";
import { DockGuest } from "../components/Dock/DockGuest";
import { useLoginContext } from "../context/LoginContext";
import Link from "next/link";

function DockToShow() {
	const loginContext = useLoginContext();

	if (loginContext.userLogin !== null) {
		return <DockUser />;
	} else {
		return <DockGuest />;
	}
}

//Show a Big play button to start the game in the middle of the screen.
export default function MainMenu() {
  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
			<Link href="/game">
				<div className={styles.play}>
					PLAY
				</div>
			</Link>
			<DockToShow />
    </>
  );
}