import React from "react";

import "./auth-layout.css";

interface AuthLayoutProperties {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProperties): React.JSX.Element => {
	return (
		<div className="auth">
			<div className="auth__left">
				<div className="auth__logo">
					<span className="auth__logo-circle" />
					<span className="auth__logo-text">LOGO</span>
				</div>
			</div>

			<div className="auth__right">
				<div className="auth__form-wrapper">{children}</div>
			</div>
		</div>
	);
};

export { AuthLayout };
