import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
};

const Sidebar: React.FC<Properties> = ({ children }: Properties) => (
	<aside className={styles["sidebar-container"]}>{children}</aside>
);

export { Sidebar };
