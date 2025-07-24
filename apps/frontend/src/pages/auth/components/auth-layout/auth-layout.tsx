import styles from "./auth-layout.module.css";

interface AuthLayoutProperties {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProperties) => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["auth-left"]}>
				<div className={styles["auth-logo"]}>
					<span className={styles["auth-logo-circle"]} />
					<span className={styles["auth-logo-text"]}>LOGO</span>
				</div>
			</div>

			<div className={styles["auth-right"]}>
				<div className={styles["auth-form-wrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
