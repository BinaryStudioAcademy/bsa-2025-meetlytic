import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "~/assets/css/styles.css";
import {
	App,
	Layout,
	ProtectedRoute,
	PublicLayout,
	RouterProvider,
	StoreProvider,
	ToastProvider,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { Landing } from "~/pages/landing/landing.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";
import { Profile } from "~/pages/profile/profile.jsx";

import { MeetingDetails } from "./pages/meeting-details/meeting-details.js";
import { Meetings } from "./pages/meetings/meetings.js";

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<ToastProvider />
		<StoreProvider store={store.instance}>
			<RouterProvider
				routes={[
					{
						element: <Auth />,
						path: AppRoute.SIGN_IN,
					},
					{
						element: <Auth />,
						path: AppRoute.SIGN_UP,
					},
					{
						children: [
							{
								children: [
									{
										element: <MeetingDetails />,
										path: AppRoute.MEETINGS_$ID,
									},
									{
										element: <Meetings />,
										path: AppRoute.MEETINGS,
									},
									{
										element: <Profile />,
										path: AppRoute.PROFILE,
									},
								],
								element: (
									<ProtectedRoute redirectTo={AppRoute.SIGN_IN}>
										<Layout />
									</ProtectedRoute>
								),
							},
						],
						element: <App />,
					},
					{
						children: [
							{
								element: <MeetingDetails />,
								path: AppRoute.PUBLIC_MEETINGS_$ID,
							},
						],
						element: <PublicLayout />,
					},
					{ element: <Landing />, path: AppRoute.ROOT },
					{
						element: <NotFoundPage />,
						path: AppRoute.NOT_FOUND,
					},
					{
						element: <NotFoundPage />,
						path: AppRoute.ANY,
					},
				]}
			/>
		</StoreProvider>
	</StrictMode>,
);
