import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "~/assets/css/styles.css";
import {
	App,
	Layout,
	Link,
	ProtectedRoute,
	RouterProvider,
	StoreProvider,
	ToastProvider,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { NotFoundPage } from "~/pages/not-found/not-found.js";
import { Profile } from "~/pages/profile/profile.jsx";

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
						element: (
							// TODO: add LandingPage component
							<div>
								Landing Page
								<div>
									<Link to={AppRoute.SIGN_IN}>Sign In</Link>
								</div>
							</div>
						),
						path: AppRoute.ROOT,
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
