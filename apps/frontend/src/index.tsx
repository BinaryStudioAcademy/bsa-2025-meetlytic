import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

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
								element: <App />,
								path: AppRoute.ROOT,
							},
						],
						element: (
							<ProtectedRoute redirectTo={AppRoute.SIGN_IN}>
								<App />
							</ProtectedRoute>
						),
						path: AppRoute.ROOT,
					},
				]}
			/>
		</StoreProvider>
	</StrictMode>,
);
