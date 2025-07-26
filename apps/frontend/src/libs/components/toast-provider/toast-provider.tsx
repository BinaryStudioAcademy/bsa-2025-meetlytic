import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_AUTO_CLOSE_MS = 3000;

const ToastProvider: React.FC = () => {
	return (
		<ToastContainer
			autoClose={TOAST_AUTO_CLOSE_MS}
			closeOnClick
			draggable
			hideProgressBar={false}
			newestOnTop
			pauseOnFocusLoss
			pauseOnHover
			position="top-right"
			theme="light"
		/>
	);
};

export { ToastProvider };
