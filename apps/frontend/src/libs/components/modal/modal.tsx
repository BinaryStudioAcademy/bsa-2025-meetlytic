import { type FC } from "react";

import { KeyboardKey } from "~/libs/enums/enums.js";
import { useCallback, useEffect, useRef } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
};

const DEFAULT_TAB_INDEX = 0;

const Modal: FC<Properties> = ({ children, isOpen, onClose }) => {
	const modalReference = useRef<HTMLDivElement>(null);

	const handleModalClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>): void => {
			event.stopPropagation();
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>): void => {
			if (event.key === KeyboardKey.ESCAPE) {
				event.preventDefault();
				onClose();
			}
		},
		[onClose],
	);

	useEffect(() => {
		if (isOpen) {
			modalReference.current?.focus();
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			aria-hidden="true"
			className={styles["overlay"]}
			onClick={handleModalClick}
			onKeyDown={handleKeyDown}
			ref={modalReference}
			role="button"
			tabIndex={DEFAULT_TAB_INDEX}
		>
			<div
				aria-label="Modal window"
				aria-modal="true"
				className={styles["modal"]}
				role="dialog"
			>
				{children}
			</div>
		</div>
	);
};

export { Modal };
