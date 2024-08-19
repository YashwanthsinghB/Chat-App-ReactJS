// import { doc, getDoc } from "firebase/firestore";
// import { createContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [chatData, setChatData] = useState(null);

//   const loadUserData = async (uid) => {
//     try {
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);
//       const userData = userSnap.data();
//       setUserData(userData);
//       if (userData.avatar && userData.name) {
//         navigate("/chat");
//       } else {
//         navigate("/profile");
//       }
//     } catch (error) {}
//   };

//   const value = {
//     userData,
//     setUserData,
//     chatData,
//     setChatData,
//     loadUserData,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };

// export default AppContextProvider;

import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);
      if (userData.avatar && userData.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData;
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub();
      };
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setInterval(async () => {
        const chatRef = doc(db, "chats", userData.id);
        const data = await getDoc(chatRef);
        const chatItems = data.data().chatsData;
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      }, 10000);
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    loadUserData,
    chatData,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
    messages,
    setMessages,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
