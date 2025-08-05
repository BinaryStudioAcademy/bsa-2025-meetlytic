import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "~/assets/css/styles.css";
import {
	App,
	Layout,
	ProtectedRoute,
	RouterProvider,
	StoreProvider,
	ToastProvider,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { RootPage } from "./pages/root/root.js";

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<ToastProvider />
		<StoreProvider store={store.instance}>
			<App>
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
									element: (
										<ProtectedRoute redirectTo={AppRoute.SIGN_IN}>
											<RootPage />
										</ProtectedRoute>
									),
									index: true,
								},
							],

							element: <Layout />,
							path: AppRoute.ROOT,
						},
						{
							element: <NotFoundPage />,
							path: AppRoute.ANY,
						},
					]}
				/>
			</App>
		</StoreProvider>
	</StrictMode>,
);
