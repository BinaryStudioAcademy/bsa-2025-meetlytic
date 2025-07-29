import React from "react";

import { Logo } from "~/libs/components/components.js";
import { LogoSize } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
};

const AuthLayout: React.FC<Properties> = ({ children }: Properties) => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["auth-left"]}>
				<div className={styles["auth-logo"]}>
					<span className={styles["auth-logo-circle"]} />
					<Logo size={LogoSize.LARGE} />
				</div>
			</div>

			<div className={styles["auth-right"]}>
				<div className={styles["auth-form-wrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
