import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DailyFrame from "@daily-co/daily-js";
import { useFirebaseApp } from "reactfire";
import Firebase from "firebase";
import store from "store";
import axios from "axios";
import "typeface-fredoka-one";
import "fontsource-comic-neue";

import SettingsModal from "./components/Settings";
import AboutLink from "./components/AboutLink";

const CloudFunction = axios.create({
  baseURL: "https://us-central1-watercooler-server.cloudfunctions.net",
  timeout: 30e3,
});

const LoadingOverlay = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);
  top: 5rem;
  background: #457b9d;
  color: #f1faee;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9099;
`;

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: "Comic Neue", sans-serif;

  h1 {
    font-family: "Fredoka One", sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    color: white;
    /* letter-spacing: 0.1rem; */
    color: #457b9d;
    padding: 0;
    margin: 0;
  }
`;

// const HeaderWrap = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const Header = styled.div`
  height: 5rem;
  width: calc(100% - 8rem);
  /* max-width: 1020px; */
  background: #f1faee;
  color: #457b9d;
  padding: 0 4rem;
  display: flex;
  align-items: center;

  h4 {
    padding: 0;
    margin: 0;
    font-weight: 600;
  }
`;

const ProfileChip = styled.div`
  background: #1d3557;
  color: #f1faee;
  padding: 0.6rem 0.6rem 0.6rem 1.2rem;
  margin-left: auto;
  border-radius: 1337rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileReset = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka One";
  font-weight: 800;
  border-radius: 1337rem;
  width: 2rem;
  height: 2rem;
  background: #e63946;
  color: #f1faee;
  margin-left: 0.6rem;
  cursor: pointer;
`;

const DailyContainer = styled.iframe`
  width: 100vw;
  flex: 1;
  background: #1d3557;
  outline: none;
  border: none;
`;

const App = () => {
  const initialUserProfile = store.get("user");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(initialUserProfile);
  const [currentUser, setCurrentUser] = useState(initialUserProfile);
  const [hasInitialised, setHasInitialised] = useState(false);
  const [showSettings, setShowSettings] = useState(!initialUserProfile);
  const dailyRef = useRef(null);
  const firebaseApp = useFirebaseApp();

  const resetProfile = () => {
    store.set("user", null);
    window.location.reload();
  };

  const generateRandomId = () => {
    const randomDoc = firebaseApp.firestore().collection("random").doc();
    return randomDoc.id;
  };

  const monitorPresence = (uid) => {
    const userStatusDatabaseRef = firebaseApp.database().ref("/status/" + uid);

    const isOfflineForDatabase = {
      state: "offline",
      last_changed: Firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: "online",
      last_changed: Firebase.database.ServerValue.TIMESTAMP,
    };

    firebaseApp
      .database()
      .ref(".info/connected")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          userStatusDatabaseRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusDatabaseRef.set(isOnlineForDatabase);
            });
        }
      });
  };

  const connectToRoom = async () => {
    setLoading(true);
    try {
      const { firstName, ventureName, uid, passcode } = currentUser;
      try {
        const activeRoomResponse = await CloudFunction.post("getActiveRoom", {
          firstName,
          ventureName,
          uid,
          passcode,
        });
        const { url } = activeRoomResponse.data;
        console.log("url", url);
        monitorPresence(currentUser.uid);
        const daily = DailyFrame.wrap(dailyRef.current);
        await daily.join({
          url,
          userName: `${firstName} (${ventureName})`,
        });
        daily.setShowNamesMode("always");
      } catch (error) {
        if (error.response.status === 403) {
          resetProfile();
        } else {
          setIsError(true);
          return;
        }
      }
    } catch (error) {
      console.error(`Unable to connect with error: `, error);
    }
    setLoading(false);
    setHasInitialised(true);
  };

  useEffect(() => {
    if (currentUser && !hasInitialised) {
      console.log(currentUser);
      connectToRoom();
    }
  }, [currentUser]);

  const onSettingsChanged = ({ firstName, ventureName, passcode }) => {
    const randomId = generateRandomId();
    store.set("user", { firstName, ventureName, passcode, uid: randomId });
    setShowSettings(false);
    setCurrentUser({ firstName, ventureName, passcode, uid: randomId });
  };

  return (
    <Page>
      {loading && <LoadingOverlay>Loading...</LoadingOverlay>}
      <Header>
        <h1>⛲️&nbsp;the watercooler&nbsp;⛲️</h1>
        {currentUser && (
          <ProfileChip>
            <h4>
              {currentUser.firstName} ({currentUser.ventureName})
            </h4>
            <ProfileReset onClick={resetProfile}>X</ProfileReset>
          </ProfileChip>
        )}
      </Header>
      <DailyContainer
        ref={dailyRef}
        allow="microphone; camera; autoplay; display-capture;"
      />
      {showSettings && <SettingsModal onSubmit={onSettingsChanged} />}
      <AboutLink darkMode />
    </Page>
  );
};

export default App;
