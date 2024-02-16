import "../../styles/button.style.scss";
function Button({ isDisabled = false, btnName, btnEvent, btnClsName }) {
  return (
    <button
      disabled={isDisabled}
      className={`customBtn bg-gray-500 text-white font-semibold py-2 px-4 rounded ${btnClsName}`}
      onClick={() => btnEvent()}
    >
      {btnName}
    </button>
  );
}

export default Button;
