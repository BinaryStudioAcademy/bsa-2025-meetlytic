import React from "react";

import { Logo, LogoIcon } from "~/libs/components/components.js";
import { LogoSize, LogoTheme } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
};

const AuthLayout: React.FC<Properties> = ({ children }: Properties) => {
	return (
		<div className={styles["auth"]}>
			<div className={styles["auth-left"]}>
				<div className={styles["auth-logo"]}>
					<LogoIcon size={LogoSize.LARGE} />
					<Logo size={LogoSize.LARGE} theme={LogoTheme.LIGHT} />
				</div>
			</div>

			<div className={styles["auth-right"]}>
				<div className={styles["auth-form-wrapper"]}>{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
