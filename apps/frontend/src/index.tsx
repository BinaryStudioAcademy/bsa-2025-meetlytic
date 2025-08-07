import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Link } from "react-router-dom";

import "~/assets/css/styles.css";
import {
	App,
	ProtectedRoute,
	RouterProvider,
	StoreProvider,
	ToastProvider,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

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
								element: <Meetings />,
								path: AppRoute.MEETINGS,
							},
						],
						element: (
							<ProtectedRoute redirectTo={AppRoute.SIGN_IN}>
								<App />
							</ProtectedRoute>
						),
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
