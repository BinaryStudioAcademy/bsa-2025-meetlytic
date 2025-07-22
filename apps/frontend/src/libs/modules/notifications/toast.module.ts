import { toast, type TypeOptions } from "react-toastify";

class Toast {
	public show(message: string, type: TypeOptions = "default"): void {
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
}

export { Toast };
