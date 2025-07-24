import styles from "./auth-layout.module.css";

interface AuthLayoutProperties {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProperties) => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["auth__left"]}>
				<div className={styles["auth__logo"]}>
					<span className={styles["auth__logo-circle"]} />
					<span className={styles["auth__logo-text"]}>LOGO</span>
				</div>
			</div>

			<div className={styles["auth__right"]}>
				<div className={styles["auth__form-wrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
