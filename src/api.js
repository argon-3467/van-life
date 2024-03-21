import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCDLccan9_mjNbNAPGlx2zx6PZyGK4yZhI",
  authDomain: "van-life-e77c0.firebaseapp.com",
  projectId: "van-life-e77c0",
  storageBucket: "van-life-e77c0.appspot.com",
  messagingSenderId: "367772019538",
  appId: "1:367772019538:web:2bc007cdb023a5ce38e88b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const vansCollection = collection(db, "vans");

export async function getVans() {
  const querySnapshot = await getDocs(vansCollection);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return dataArr;
}

export async function getVan(id) {
  const docRef = doc(db, "vans", id);
  const vanSnapshot = await getDoc(docRef);
  return {
    ...vanSnapshot.data(),
    id: vanSnapshot.id,
  };
}

export async function addVan(van) {
  try {
    const docRef = doc(vansCollection, van.id);
    await setDoc(docRef, van);
    console.log("Document written with ID: ", van.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getHostVans(id) {
  const q = query(vansCollection, where("hostId", "==", id));
  const querySnapshot = await getDocs(q);
  const hostVans = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return hostVans;
}

export async function getHostVan(id, hostId) {
  const docRef = doc(db, "vans", id);
  const vanSnapshot = await getDoc(docRef);

  if (!vanSnapshot.exists()) {
    throw {
      message: "Van not found",
      statusText: "Not Found",
      status: 404,
    };
  }

  if (vanSnapshot.data().hostId != hostId) {
    throw {
      message: "This is not your Van. or is it?",
      statusText: "Not Found",
      status: 404,
    };
  }
  return {
    ...vanSnapshot.data(),
    id: vanSnapshot.id,
  };
}

export async function loginUser(creds) {
  // fake authentication (very secure 😅)
  if (creds.email == "b@b.com" && creds.password == "p123") {
    const user = { id: "123", email: "b@b.com", name: "Bob" };
    const data = {
      user,
      token: "Enjoy your vans, here's your token",
    };
    return data;
  } else {
    throw {
      message: "No user with those credentials found!",
      statusText: "Unauthorized",
      status: 401,
    };
  }
}
