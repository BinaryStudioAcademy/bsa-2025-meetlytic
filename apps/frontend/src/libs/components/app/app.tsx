import React, { useCallback } from "react";

import reactLogo from "~/assets/img/react.svg";
import {
	Header,
	Link,
	Loader,
	Navigation,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import {
	HIDDEN_HEADER_ROUTES,
	NAVIGATION_ITEMS,
} from "~/libs/constants/constants.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as userActions } from "~/modules/users/users.js";

import { Button } from "../button/button.js";
import { MeetingForm } from "../meeting-form/meeting-form.js";
import meetingFormStyles from "../meeting-form/meeting-form.module.css";
import { Modal } from "../modal/modal.js";

const App: React.FC = () => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const { dataStatus, users } = useAppSelector(({ users }) => ({
		dataStatus: users.dataStatus,
		users: users.users,
	}));

	const isRoot = pathname === AppRoute.ROOT;

	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const handleOpenModal = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			{!HIDDEN_HEADER_ROUTES.some((route) => pathname.startsWith(route)) && (
				<Header />
			)}

			<img alt="logo" className="App-logo" src={reactLogo} width="30" />

			<Sidebar>
				<Navigation items={NAVIGATION_ITEMS} />
			</Sidebar>

			{isRoot && (
				<div
					style={{
						alignItems: "flex-start",
						display: "flex",
						justifyContent: "flex-end",
						padding: "32px 32px 0 0",
						width: "100%",
					}}
				>
					<div style={{ minWidth: 240, width: 240 }}>
						<Button
							className={meetingFormStyles["button-start-meeting"]}
							label="Start a meeting"
							onClick={handleOpenModal}
						/>
					</div>
				</div>
			)}

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>

			<ul className="App-navigation-list">
				<li>
					<Link to={AppRoute.ROOT}>Root</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_IN}>Sign in</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_UP}>Sign up</Link>
				</li>
			</ul>
			<p>Current path: {pathname}</p>

			<div>
				<RouterOutlet />
			</div>
			{isRoot && (
				<>
					<h2>Users:</h2>
					<h3>Status: {dataStatus}</h3>
					<ul>
						{users.map((user) => (
							<li key={user.id}>{user.email}</li>
						))}
					</ul>
				</>
			)}
		</>
	);
};

export { App };
