import { Link } from "react-router-dom";
import { Phone, Info } from "lucide-react";
import Dropdown from "./dropDown";
import "./../style/sidebar.css";
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__links">
        <Link to="/aboutUs" className="sidebar__link">
          <Info size={16} color="purple" />
          About us
        </Link>
        <Dropdown />
      </div>
    </aside>
  );
}

export default Sidebar;
