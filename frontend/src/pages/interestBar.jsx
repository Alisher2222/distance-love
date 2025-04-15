import { useEffect, useState } from "react";
import "./../style/interestBar.css";
import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getHobbies } from "../store/hobbiesSlice";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { addInterests } from "../store/interestSlice";
import { motion, AnimatePresence } from "motion/react";

function InterestBar() {
  const [text, setText] = useState("");
  const [choosed, setChoosed] = useState([]);
  const [animatingItems, setAnimatingItems] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(getHobbies());
    } catch (error) {
      console.error(error);
    }
  }, []);

  const arrayOfInterest = useSelector((state) => state.hobbies.hobbies);
  const userId = useSelector((state) => state.auth.userId);
  const handleChoose = (id) => {
    setAnimatingItems((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setAnimatingItems((prev) => ({ ...prev, [id]: false }));
    }, 500);

    if (choosed.includes(id)) {
      setChoosed(choosed.filter((choosedID) => choosedID !== id));
    } else {
      setChoosed([...choosed, id]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (arrayOfInterest.length === 0) {
        return;
      }
      dispatch(addInterests({ arrayOfInterests: choosed, id: userId }));
      setIsVisible(false);
      setTimeout(() => {
        navigate("/");
      }, 200);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log(choosed);
  }, [choosed]);
  useEffect(() => {
    console.log(arrayOfInterest);
  }, [arrayOfInterest]);
  return (
    <>
      <Navbar />
      <div className="interest__container">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="interest__card"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="interest__header">Tell us about your interests</h1>
              <p className="interest__description">
                Choose the topics that you like. This will help us offer you the
                best content!
              </p>

              <div className="interest__input__container">
                <Search size={16} color="grey" />
                <input
                  type="text"
                  className="interest__input"
                  placeholder="Search interests..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>

              <div className="interest__list">
                {(!text
                  ? arrayOfInterest || []
                  : (arrayOfInterest || []).filter((interest) =>
                      interest.name.toLowerCase().includes(text.toLowerCase())
                    )
                )
                  .slice(0, 8)
                  .map((interest) => (
                    <motion.div
                      key={interest.id}
                      className={`${
                        choosed.includes(interest.id)
                          ? "interest__choosed"
                          : "interest"
                      } ${animatingItems[interest.id] && "animate"}`}
                      onClick={() => handleChoose(interest.id)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="interest__icon">{interest.icon}</p>
                      <p>{interest.name}</p>
                    </motion.div>
                  ))}
              </div>
              <motion.button
                className="interest__button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
              >
                Submit
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default InterestBar;
