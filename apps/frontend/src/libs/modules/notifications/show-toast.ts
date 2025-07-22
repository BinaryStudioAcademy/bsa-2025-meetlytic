import { toast, type TypeOptions } from "react-toastify";

function showToast(message: string, type: TypeOptions = "default") {
	toast.dismiss();

	switch (type) {
		case "error": {
			toast.error(message);
			break;
		}
		case "info": {
			toast.info(message);
			break;
		}
		case "success": {
			toast.success(message);
			break;
		}
		case "warning": {
			toast.warning(message);
			break;
		}
		default: {
			toast(message);
			break;
		}
	}
}

export { showToast };
