import {
	useAppDispatch,
	useEffect,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as fileActions } from "~/modules/file/file.js";

type UseFileUrlReturn = {
	error: Error | null;
	loading: boolean;
	url: string;
};

const useFileUrl = (fileId: null | number | undefined): UseFileUrlReturn => {
	const dispatch = useAppDispatch();

	const [url, setUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const lastLoadedIdReference = useRef<null | number>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async (): Promise<void> => {
			if (!fileId) {
				lastLoadedIdReference.current = null;
				setUrl("");
				setLoading(false);
				setError(null);

				return;
			}

			if (lastLoadedIdReference.current === fileId) {
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const file = await dispatch(
					fileActions.getFileById({ id: fileId }),
				).unwrap();

				if (!cancelled) {
					setUrl(file.url);
					setLoading(false);
					lastLoadedIdReference.current = fileId;
				}
			} catch (error) {
				if (!cancelled) {
					setUrl("");
					setLoading(false);
					setError(error instanceof Error ? error : new Error("Unknown error"));
					lastLoadedIdReference.current = null;
				}
			}
		};

		void load();

		return (): void => {
			cancelled = true;
		};
	}, [dispatch, fileId]);

	return { error, loading, url };
};

export { useFileUrl };
