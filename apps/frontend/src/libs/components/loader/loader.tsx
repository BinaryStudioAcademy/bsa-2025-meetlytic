import React from "react";

import "./loader.css";

type Properties = {
	isLoading: boolean;
	withOverlay: boolean;
};

const Loader: React.FC<Properties> = ({ isLoading, withOverlay }) => {
	if (!isLoading) {
		return null;
	}

	const loaderContent = (
		<div className="dot-loader">
			<span />
			<span />
			<span />
		</div>
	);

	return withOverlay ? (
		<div className="loader-overlay">{loaderContent}</div>
	) : (
		loaderContent
	);
};

export { Loader };
