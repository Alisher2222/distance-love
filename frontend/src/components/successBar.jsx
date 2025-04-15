import "./../style/successBar.css";

function SuccessBar({ message }) {
  return (
    <div className="successBar__container">
      <p className="successBar__container__heading">{message}</p>
    </div>
  );
}

export default SuccessBar;
