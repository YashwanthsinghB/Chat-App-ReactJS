import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import "../../assets/assets";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Config/firebase";
import { toast } from "react-toastify";
import upload from "../../Lib/upload";

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
        return 0;
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              id="avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Your name"
            type="text"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
          />
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage
              ? prevImage
              : assets.logo_icon
          }
          alt=""
        />
      </div>
    </div>
  );
};
export default ProfileUpdate;

// import React, { useState } from "react";
// import "./ProfileUpdate.css";
// import assets from "../../assets/assets";

// const ProfileUpdate = () => {
//   const [image, setImage] = useState(null);

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//   };

//   return (
//     <div className="profile">
//       <div className="profile-container">
//         <form onSubmit={handleSubmit}>
//           <h3>Profile Details</h3>
//           <label htmlFor="avatar">
//             <input
//               onChange={handleImageChange}
//               type="file"
//               id="avatar"
//               accept=".png, .jpg, .jpeg"
//               hidden
//             />
//             <img
//               src={image ? URL.createObjectURL(image) : assets.avatar_icon}
//               alt="Profile Avatar"
//             />
//             <span>Upload profile image</span>
//           </label>
//           <input type="text" placeholder="Your name" required />
//           <textarea placeholder="Write profile bio" required></textarea>
//           <button type="submit">Save</button>
//         </form>
//         <img
//           className="profile-pic"
//           src={image ? URL.createObjectURL(image) : assets.logo_icon}
//           alt="Profile Logo"
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfileUpdate;
