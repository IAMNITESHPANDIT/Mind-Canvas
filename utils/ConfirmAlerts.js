import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "../styles/confirmAlert.style.scss";

export const ConfirmDelete = (key, deleteCallback, cancelCallback) => {
  confirmAlert({
    message: "Are you sure, you want to remove it?",
    buttons: [
      {
        label: "Remove",
        onClick: () => deleteCallback(key),
      },
      {
        label: "Cancel",
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};
