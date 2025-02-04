const admin = require("firebase-admin");
require("dotenv").config();

let bucket = null;

const initializeFirebase = () => {
  if (!bucket) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "cfkapp-aa448.firebasestorage.app",
    });

    bucket = admin.storage().bucket();
  }
  return bucket;
};

const getBucket = () => {
  if (!bucket) {
    throw new Error("Firebase has not been initialized");
  }
  return bucket;
};

module.exports = { initializeFirebase, getBucket };
