import "../style/NotFoundPage.css";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-message">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="not-found-link">
        Go back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
