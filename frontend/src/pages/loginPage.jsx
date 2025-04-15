import RegisterLogin from "../components/registerLogin.jsx";
import Navbar from "../components/navbar.jsx";
function LoginPage() {
  return (
    <>
      <Navbar />
      <RegisterLogin type="login" />
    </>
  );
}
export default LoginPage;
