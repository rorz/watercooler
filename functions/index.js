const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios").default;
const cors = require("cors")({ origin: true });

if (process.env.NODE_ENV === "local") {
  const serviceAccount = require("../priv/sac.json");
  admin.initializeApp({
    credential: serviceAccount,
    authDomain: "watercooler-server.firebaseapp.com",
    databaseURL: "https://watercooler-server.firebaseio.com",
    projectId: "watercooler-server",
    storageBucket: "watercooler-server.appspot.com",
    messagingSenderId: "556168356557",
    appId: "1:556168356557:web:19ec26b47f48ee98613f84",
    measurementId: "G-V76RTVP79E",
  });
} else {
  admin.initializeApp();
}

const firestore = admin.firestore();
const realtimeDb = admin.database();
const ConfigDocRef = firestore.collection("settings").doc("config");

const {
  daily_co: { token: DAILY_CO_TOKEN },
} = functions.config();

const DailyApi = axios.create({
  baseURL: "https://api.daily.co/v1/",
  timeout: 30e3,
  headers: {
    authorization: `Bearer ${DAILY_CO_TOKEN}`,
  },
});

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const invalidateCurrentRoom = async () => {
  const configDoc = await ConfigDocRef.get();
  const { activeRoomName } = configDoc.data();
  // Daily.co room delete
  if (activeRoomName) {
    await DailyApi.delete(`rooms/${activeRoomName}`);
  }

  await ConfigDocRef.update({
    activeRoomUrl: null,
    activeRoomName: null,
    activeRoomUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const createNewRoom = async () => {
  // Daily.co room create
  const newRoomResponse = await DailyApi.post("rooms", {
    properties: {
      exp: +new Date() + 60 * 60 * 24 * 1e-3,
    },
  });

  const { name: activeRoomName, url: activeRoomUrl } = newRoomResponse.data;

  await ConfigDocRef.update({
    activeRoomName,
    activeRoomUrl,
    activeRoomUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
  return activeRoomUrl;
};

const getActiveRoom = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const {
      firstName,
      ventureName,
      uid,
      passcode: providedPasscode,
    } = request.body;
    try {
      const configDoc = await ConfigDocRef.get();
      const {
        passcode: correctPasscode,
        activeRoomUrl,
        webhookUrl,
      } = configDoc.data();

      if (providedPasscode !== correctPasscode) {
        response.sendStatus(403);
        return;
      }

      // Send webhook notification

      if (activeRoomUrl) {
        response.json({ url: activeRoomUrl });
        return;
      }

      const newRoomUrl = await createNewRoom();
      if (webhookUrl) {
        try {
          axios.post(
            webhookUrl,
            { text: `${firstName} (${ventureName}) is at the watercooler...` },
            {
              timeout: 4e3,
            }
          );
        } catch (error) {
          console.error(`Unable to send webhook with error: `, error);
        }
      }
      response.json({ url: newRoomUrl });
      return;
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  });
});

const onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    await sleep(10e3);
    const eventStatus = change.after.val();
    const statusSnapshot = await change.after.ref.once("value");
    const latestStatus = statusSnapshot.val();

    if (latestStatus.last_changed > eventStatus.last_changed) {
      console.log("Not latest update... Exiting.");
      return null;
    }

    const { state: onlineStatus } = eventStatus;
    console.log("Received status: ", onlineStatus);
    if (onlineStatus === "offline") {
      // Make a query to get any onlines
      // If the onlines are older than 12h, set them to offline
      // If there are no onlines left, invalidate the room
      const allStatusesSnapshot = await realtimeDb.ref("/status").once("value");
      const allStatuses = allStatusesSnapshot.val();
      console.log("Got all statuses: ", JSON.stringify(allStatuses));
      const now = +new Date();
      const twelveHoursAgo = now - 1e3 * 60 * 60 * 12;
      const activeOnlineStatusesUnfiltered = await Promise.all(
        Object.entries(allStatuses).map(async ([uid, data]) => {
          console.log("Iterating for: ", uid, "With data: ", data);
          const { state, last_changed } = data;
          if (state === "offline") {
            return null;
          }
          if (last_changed < twelveHoursAgo) {
            await realtimeDb.ref(`/status/${uid}`).update({
              state: "offline",
              last_changed: admin.database.ServerValue.TIMESTAMP,
            });
            return null;
          }
          return uid;
        })
      );
      const activeOnlineStatuses = activeOnlineStatusesUnfiltered.filter(
        (uid) => uid
      );
      if (!activeOnlineStatuses.length) {
        console.log("Should invalidate");
        await invalidateCurrentRoom();
      } else {
        console.log("Onlines exist: ", JSON.stringify(activeOnlineStatuses));
      }
    }
  });

module.exports = {
  getActiveRoom,
  onUserStatusChanged,
};
