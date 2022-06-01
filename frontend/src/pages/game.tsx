import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import React from "react";
import { DockGuest } from "../components/Dock/DockGuest";
import { Ball } from "../components/Game/Ball";
import userService from "../services/user";

import io from "socket.io-client";

import { errorParser } from "../services/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

// Needed to update the user rank because you can't use the context in the function
let currentUser = "";

function DisplayBallForUser() {
  const loginContext = useLoginContext();

  if (loginContext.userLogin !== null) {
    currentUser = loginContext.userLogin;
    return <Ball />;
  } else {
    return <DockGuest />;
  }
}

// Access the global user name and update the user rank via the API.
// Emit on the websocket the user:update-elo event for the real time leaderboard.
function updateUserElo(eloModification: number) {
  const errorContext = useErrorContext();

  if (currentUser !== "") {
    userService
      .updateUserElo(currentUser, eloModification)
      .then(() => {
        socket.emit("user:update-elo");
      })
      .catch((error) => {
        errorContext.newError?.(errorParser(error));
      });
  }
}

function checkLineCrossed(previousBallPos: number, currentBallPos: number) {
  if (typeof window !== "undefined") {
    let left_line = document.getElementById("left_line");
    let right_line = document.getElementById("right_line");

    if (left_line !== null && right_line !== null) {
      const left_line_pos =
        (parseInt(left_line.style.left.replace("%", "")) * window.innerWidth) /
        100;
      const right_line_pos =
        (parseInt(right_line.style.left.replace("%", "")) * window.innerWidth) /
        100;

      // Left line crossed
      if (previousBallPos > left_line_pos && currentBallPos < left_line_pos) {
        updateUserElo(-1);
      }
      // Right line crossed
      if (previousBallPos < right_line_pos && currentBallPos > right_line_pos) {
        updateUserElo(1);
      }
    }
  }
}

function moveBall(e: KeyboardEvent) {
  let ball = document.getElementById("ball");

  if (ball !== null) {
    let ballTop = parseInt(ball.style.top.replace("px", ""));
    let ballLeft = parseInt(ball.style.left.replace("px", ""));
    let ballradius = 7;

    if (e.key === "ArrowUp") {
      ball.style.top = parseInt(ball.style.top) - 20 + "px";
      if (ballTop - 20 < ballradius) {
        ball.style.top = ballradius + "px";
      }
    } else if (e.key === "ArrowDown") {
      ball.style.top = parseInt(ball.style.top) + 20 + "px";
      if (ballTop + 20 > window.innerHeight - ballradius) {
        ball.style.top = window.innerHeight - ballradius + "px";
      }
    } else if (e.key === "ArrowLeft") {
      ball.style.left = parseInt(ball.style.left) - 20 + "px";
      if (ballLeft - 20 < ballradius) {
        ball.style.left = ballradius + "px";
      }
    } else if (e.key === "ArrowRight") {
      ball.style.left = parseInt(ball.style.left) + 20 + "px";
      if (ballLeft + 20 > window.innerWidth - ballradius - 20) {
        ball.style.left = window.innerWidth - ballradius - 20 + "px";
      }
    }
    checkLineCrossed(ballLeft, parseInt(ball.style.left.replace("px", "")));
  }
}

function Lines() {
  return (
    <>
      <div
        className={styles.left_line}
        id="left_line"
        style={{ left: "20%" }}
      />
      <div
        className={styles.right_line}
        id="right_line"
        style={{ left: "80%" }}
      />
    </>
  );
}

export default function Game() {
  if (typeof window !== "undefined") {
    document.addEventListener("keydown", moveBall);
  }

  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      <Lines />
      <DisplayBallForUser />
    </>
  );
}
