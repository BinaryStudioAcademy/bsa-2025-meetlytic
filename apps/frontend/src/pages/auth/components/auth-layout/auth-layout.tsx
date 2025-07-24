import styles from "./auth-layout.module.css";

interface AuthLayoutProperties {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProperties) => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["authLeft"]}>
				<div className={styles["authLogo"]}>
					<span className={styles["authLogoCircle"]} />
					<span className={styles["authLogoText"]}>LOGO</span>
				</div>
			</div>

			<div className={styles["authRight"]}>
				<div className={styles["authFormWrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
