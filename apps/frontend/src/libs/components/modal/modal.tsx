import {
	type FC,
	type MouseEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";

import { KeyboardKey } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
};

const Modal: FC<Properties> = ({ children, isOpen, onClose }) => {
	const modalReference = useRef<HTMLDivElement>(null);

	const handleModalClick = useCallback(
		(event: MouseEvent<HTMLDivElement>): void => {
			event.stopPropagation();
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>): void => {
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
			tabIndex={0}
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
