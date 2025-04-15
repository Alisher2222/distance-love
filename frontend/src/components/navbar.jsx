import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Bell } from "lucide-react";
import { useState } from "react";
import Requests from "./requests";
function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const dispatch = useDispatch();
  const handleLogout = () => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error("error occurred ", error);
    }
  };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo__link">
        <p className="navbar__logo">Distance love</p>
      </Link>
      <div className="navbar__links">
        <Link to="/aboutUs" className="nav-link">
          About us
        </Link>

        {isAuthorized ? (
          <>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link onClick={handleLogout} className="nav-link">
              Logout
            </Link>
            <div style={{ position: "relative" }}>
              <Bell
                color="grey"
                style={{ cursor: "pointer" }}
                onClick={() => setIsVisible(!isVisible)}
              />
              {isVisible && <Requests />}
            </div>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
