import "./../style/profilePage.css";
import Navbar from "./../components/navbar.jsx";
import Setting from "../../icons/setting.png";
import { motion } from "framer-motion";
import { useState, AnimatePresence, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInterests } from "../store/interestSlice.js";
import UnconnectedProfile from "../components/UnconnectedProfile.jsx";
import ConnectedProfile from "../components/connectedProfile.jsx";
import { getRelationshipId } from "../store/relationshipsSlice.js";
function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const coupleId = useSelector((state) => state.relationships.coupleId);
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const arrayOfInterests = useSelector((state) => state.interests.interests);
  const dispatch = useDispatch();
  const handleClick = () => {
    setRotation((prev) => prev + 180);
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    dispatch(getRelationshipId({ id: user.id }));
    dispatch(getInterests({ id: user.id }));
    dispatch(getRelationshipId({ id: user.id }));
  }, []);
  return (
    <>
      <Navbar />
      <div className="container__profile">
        <div className="container__user">
          <div className="container__user__top">
            <p className="profile__heading">My profile</p>
            <motion.img
              src={Setting}
              style={{ width: "32px", aspectRatio: "1/1", cursor: "pointer" }}
              animate={{ rotate: rotation }}
              transition={{ duration: 1 }}
              onClick={handleClick}
            />
          </div>
          <div className="container__user__bottom">
            <div className="photo__container">
              <img src="..." alt="" className="photo" />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div className="user__description">
                <p className="user__fullname">
                  {user.name} {user.surname}
                </p>
                <p className="user__data">Email: {user.email}</p>
                <p className="user__data">Id: {user.id}</p>
              </div>
              <div className="user__interest__container">
                <p className="interests__heading">Interests</p>
                <div className="interests">
                  {(arrayOfInterests || []).map((interest) => (
                    <div className="interest__profile" key={interest.id}>
                      {interest.icon} {interest.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {!coupleId ? (
          <UnconnectedProfile />
        ) : (
          <ConnectedProfile userId={user.id} coupleId={coupleId} />
        )}
      </div>
    </>
  );
}

export default ProfilePage;
