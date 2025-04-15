import "../style/registerLogin.css";
import { Key, Mail, UserPen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
function RegisterLogin({ type }) {
  const [data, setData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        register({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
      setIsVisible(false);
      setTimeout(() => {
        navigate("/interests");
      }, 200);
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
    }
  };
  const handleLogin = async () => {
    event.preventDefault();
    try {
      const response = await dispatch(
        login({ email: data.email, password: data.password })
      ).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (type === "login") {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };
  return (
    <div className="auth">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="auth__card"
            initial={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="auth__heading">
              {type === "register" ? "Register" : "Login"}
            </p>
            <form
              className="auth__input-group"
              onSubmit={type === "register" ? handleRegister : handleLogin}
            >
              {type === "register" && (
                <>
                  <div className="auth__input__container">
                    <p className="auth__input__name">Name</p>
                    <div className="auth__input__container__bottom">
                      <UserPen color="grey" size={16} />
                      <input
                        type="text"
                        name="name"
                        placeholder="Type your name"
                        className="auth__input"
                        required
                        value={data.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="auth__input__container">
                    <p className="auth__input__name">Surname</p>
                    <div className="auth__input__container__bottom">
                      <UserPen color="grey" size={16} />
                      <input
                        type="text"
                        name="surname"
                        placeholder="Type your surname"
                        className="auth__input"
                        value={data.surname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="auth__input__container">
                <p className="auth__input__name">Email</p>
                <div className="auth__input__container__bottom">
                  <Mail color="grey" size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Type your email"
                    className="auth__input"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="auth__input__container">
                <p className="auth__input__name">Password</p>
                <div className="auth__input__container__bottom">
                  <Key color="grey" size={16} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Type your password"
                    className="auth__input"
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <motion.button
                className="auth__button"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: "3deg" }}
                transition={{ duration: 0.125 }}
              >
                {type === "register" ? "register" : "login"}
              </motion.button>
            </form>
            <Link
              className="auth__link"
              to={type === "register" ? "/login" : "/register"}
            >
              {type === "register" ? "Sign in" : "Sign up"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RegisterLogin;
