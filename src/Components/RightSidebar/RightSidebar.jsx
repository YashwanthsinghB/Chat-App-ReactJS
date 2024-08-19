// import React, { useContext } from "react";
// import "./RightSidebar.css";
// import "../../assets/assets";
// import assets from "../../assets/assets";
// import { logout } from "../../Config/firebase";
// import { AppContext } from "../../Context/AppContext";

// const RightSidebar = () => {
//   const {chatUser,messages} = useContext(AppContext);

//   return (
//     <div className="rs">
//       <div className="rs-profile">
//         <img src={assets.profile_img} alt="" />
//         <h3>
//           Yashwanth Singh
//           <img src={assets.green_dot} className="dot" alt="" />
//         </h3>
//         <p>Hey, There iam Yashwanth Singh using Chat App</p>
//       </div>
//       <hr />
//       <div className="rs-media">
//         <p>Media</p>
//         <div>
//           <img src={assets.pic1} alt="" />
//           <img src={assets.pic2} alt="" />
//           <img src={assets.pic3} alt="" />
//           <img src={assets.pic4} alt="" />
//           <img src={assets.pic1} alt="" />
//           <img src={assets.pic2} alt="" />
//         </div>
//       </div>
//       <button onClick={() => logout()}>Logout</button>
//     </div>
//   );
// };

// export default RightSidebar;

import React, { useContext, useEffect, useState } from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";
import { logout } from "../../Config/firebase";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img
              onClick={() => window.open(url)}
              key={index}
              src={url}
              alt=""
            />
          ))}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;
