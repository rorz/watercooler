import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DailyFrame from "@daily-co/daily-js";
import { useFirebaseApp } from "reactfire";
import Firebase from "firebase";
import store from "store";
import "typeface-fredoka-one";

import SettingsModal from "./components/Settings";

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-family: "Fredoka One", sans-serif;
    color: white;
    letter-spacing: 0.1rem;
  }
`;

const Header = styled.div`
  width: calc(100% - 2rem);
  height: 6rem;
  background: blue;
  color: white;
  padding: 1rem;
  display: flex;

  h4 {
    margin-left: auto;
  }
`;

const DailyContainer = styled.iframe`
  width: 100vw;
  flex: 1;
  background: red;
`;

const App = () => {
  const [currentUser, setCurrentUser] = useState(store.get("user"));
  const [showSettings, setShowSettings] = useState(false);
  const dailyRef = useRef(null);
  const firebaseApp = useFirebaseApp();

  const generateRandomId = () => {
    const randomDoc = firebaseApp.firestore().collection("random").doc();
    return randomDoc.id;
  };

  const onSettingsChanged = ({ firstName, ventureName, passcode }) => {
    const randomId = generateRandomId();
    store.set("user", { firstName, ventureName, passcode, uid: randomId });
    setCurrentUser({ firstName, ventureName, passcode, uid: randomId });
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

  useEffect(() => {
    if (!currentUser) {
      setShowSettings(true);
    } else {
      console.log(currentUser);
      monitorPresence(currentUser.uid);
      const daily = DailyFrame.wrap(dailyRef.current);
      daily.join({
        url: "https://k20-watercooler.daily.co/3CMWllZZnVZCUXqq65sL",
      });
    }
  }, []);

  return (
    <Page>
      <Header>
        <h1>The Watercooler</h1>
        {currentUser && (
          <h4>
            {currentUser.firstName} ({currentUser.ventureName})
          </h4>
        )}
      </Header>
      <DailyContainer ref={dailyRef} />
      {showSettings && <SettingsModal onSubmit={onSettingsChanged} />}
    </Page>
  );
};

export default App;
