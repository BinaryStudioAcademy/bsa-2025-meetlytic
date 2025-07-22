import React from "react";

import "./loader.css";

type Properties = {
	isLoading: boolean;
};

const Loader: React.FC<Properties> = ({ isLoading }) => {
	if (!isLoading) {
		return null;
	}

	return (
		<div className="loader-overlay">
			<div className="dot-loader">
				<span />
				<span />
				<span />
			</div>
		</div>
	);
};

export { Loader };
