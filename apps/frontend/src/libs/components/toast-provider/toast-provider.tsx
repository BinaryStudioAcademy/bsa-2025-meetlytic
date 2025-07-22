import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
	return (
		<ToastContainer
			autoClose={3000}
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
