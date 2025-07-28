import {
	type FC,
	type MouseEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";

import styles from "./styles.module.css";

interface ModalProperties {
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

const Modal: FC<ModalProperties> = ({ children, isOpen, onClose }) => {
	const modalReference = useRef<HTMLDivElement>(null);

	const handleModalClick = useCallback(
		(event: MouseEvent<HTMLDivElement>): void => {
			event.stopPropagation();
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>): void => {
			if (event.key === "Escape") {
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
