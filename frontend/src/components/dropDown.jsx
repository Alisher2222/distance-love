import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import "../style/dropDown.css";
import { Link } from "react-router-dom";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <p onClick={() => setIsOpen(!isOpen)} className="dropdown-text">
        <BriefcaseBusiness size={16} color="purple" />
        Services
      </p>
      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
        <Link className="dropdown__link">Wishlist</Link>
        <Link className="dropdown__link">Todos</Link>
        <Link className="dropdown__link">Tasks</Link>
        <Link className="dropdown__link">Meetings</Link>
      </div>
    </div>
  );
}

export default Dropdown;
