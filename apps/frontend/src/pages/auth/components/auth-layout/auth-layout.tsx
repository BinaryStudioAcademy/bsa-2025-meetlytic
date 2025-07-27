import React from "react";

import { Logo } from "~/libs/components/components.js";
import { LogoSize } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

interface AuthLayoutProperties {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProperties): React.JSX.Element => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["auth__left"]}>
				<div className={styles["auth__logo"]}>
					<span className={styles["auth__logo-circle"]} />
					<Logo size={LogoSize.LARGE} />
				</div>
			</div>

			<div className={styles["auth__right"]}>
				<div className={styles["auth__form-wrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
