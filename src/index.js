import React from "react";
import ReactDOM from "react-dom";
import { FirebaseAppProvider, useFirebaseApp } from "reactfire";
import "firebase/firestore";
import "firebase/database";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const firebaseConfig = {
  apiKey: "AIzaSyBZMjNXzAsvzCGiGC7pg-2Mre1_ix_AtbU",
  authDomain: "watercooler-server.firebaseapp.com",
  databaseURL: "https://watercooler-server.firebaseio.com",
  projectId: "watercooler-server",
  storageBucket: "watercooler-server.appspot.com",
  messagingSenderId: "556168356557",
  appId: "1:556168356557:web:19242f56b9e58b5a613f84",
  measurementId: "G-7Z07KY8XY4",
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
