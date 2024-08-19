import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyAjDNXcQ31KQR0BuvBfZu24qLOL3WKCQXI",
  authDomain: "chat-app-yash-cf7d0.firebaseapp.com",
  projectId: "chat-app-yash-cf7d0",
  storageBucket: "chat-app-yash-cf7d0.appspot.com",
  messagingSenderId: "81870679338",
  appId: "1:81870679338:web:ded608c9c5397db0024253"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup =async(username, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const user = response.user;
    await setDoc(doc(db, "users", user.uid),{
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey there, Iam using Chat App",
      lastseen: Date.now()
    })

    await setDoc(doc(db,"chats",user.uid),{
      chatsData: []
    })
    
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const login = async(email, password) =>{
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = async () =>{
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }

}

const resetPass = async (email) => {
  if (!email) {
      toast.error("Enter your email")
      return null
  }
  try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("email", "==", email))
      const querySnap = await getDocs(q)
      if (!querySnap.empty) {
          await sendPasswordResetEmail(auth,email)
          toast.success("Reset Email Sent")
      }
      else {
          toast.error("Email doesn't exists")
      }
  } catch (error) {
      console.error(error)
      toast.error(error.message)
  }
 
}

export {signup, login, logout, auth, db, resetPass}


