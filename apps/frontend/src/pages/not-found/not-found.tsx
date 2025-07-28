import NotFoundImage from "~/assets/img/404.png";
import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

import { AuthLayout } from "../auth/components/auth-layout/auth-layout.js";
import styles from "./styles.module.css";

const NotFoundPage: React.FC = () => {
	return (
		<AuthLayout>
			<img
				alt="Page not found"
				className={styles["image"]}
				src={NotFoundImage}
			/>
			<h3 className={styles["title"]}>
				<p>404</p>
				<p>PAGE NOT FOUND</p>
			</h3>
			<p className={styles["sub-title"]}>
				The page you’re looking for might have been moved or never existed.
			</p>
			<h5 className={styles["link-container"]}>
				<Link to={AppRoute.ROOT}>
					<p>Go to homepage</p>
				</Link>
				or
				<Link to={AppRoute.SIGN_IN}>
					<p>Sign in to your account</p>
				</Link>
			</h5>
		</AuthLayout>
	);
};

export { NotFoundPage };
