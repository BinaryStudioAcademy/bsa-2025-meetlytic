import { toast } from "react-toastify";

class Notification {
	public error(message: string): void {
		toast.dismiss();
		toast.error(message);
	}

	public info(message: string): void {
		toast.dismiss();
		toast.info(message);
	}

	public success(message: string): void {
		toast.dismiss();
		toast.success(message);
	}

	public warning(message: string): void {
		toast.dismiss();
		toast.warning(message);
	}
}

export { Notification };
