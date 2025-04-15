import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import NotFoundPage from "./pages/notFoundPage";
import MainPage from "./pages/mainPage";
import InterestBar from "./pages/interestBar";
import ProfilePage from "./pages/profilePage";
import ProtectedRoute from "./components/protectedRoute";
import SchedualePage from "./components/schedulePage";
import TodoList from "./pages/todoListPage";
import AboutUs from "./pages/aboutUsPage";
import SharedWishlist from "./pages/sharedWishListPage";
function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/interests"
            element={
              <ProtectedRoute>
                <InterestBar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedualePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todolist"
            element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <SharedWishlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
