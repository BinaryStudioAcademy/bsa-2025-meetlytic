import { Loader, SearchBar } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useRef,
	useSearchParams,
} from "~/libs/hooks/hooks.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

import styles from "./transcription-panel.module.css";

type Properties = {
	meetingId: number;
	meetingStatus: string;
};

const EMPTY_TRANSCRIPT_CHUNKS = 0;

const TranscriptionPanel: React.FC<Properties> = ({
	meetingId,
}: Properties) => {
	const containerReference = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();
	const { dataStatus, transcriptions } = useAppSelector(
		({ transcription }) => transcription,
	);
	const [searchParameters] = useSearchParams();
	const token = searchParameters.get("token");

	useEffect(() => {
		const containerBottom = containerReference.current;

		if (!containerBottom) {
			return;
		}

		containerBottom.scrollIntoView();
	}, []);

	useEffect(() => {
		if (meetingId) {
			if (token) {
				void dispatch(
					transcriptionActions.getTranscriptionsBySignedUrl({
						meetingId: String(meetingId),
						token,
					}),
				);
			} else {
				void dispatch(
					transcriptionActions.getTranscriptionsByMeetingId(meetingId),
				);
			}
		}
	}, [dispatch, meetingId, token]);

	const handleSearch = useCallback(() => {
		// TODO: implement handleSearch logic
	}, []);

	return (
		<div className={styles["meeting-details__transcription-panel"]}>
			<div className={styles["panel-header"]}>
				<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
				<SearchBar onSearch={handleSearch} />
			</div>
			{dataStatus === DataStatus.PENDING && <Loader isLoading />}

			{transcriptions.items.length > EMPTY_TRANSCRIPT_CHUNKS ? (
				<div className={styles["transcription-area"]}>
					<p className={styles["transcription-text"]}>
						{transcriptions.items
							.map((transcription) => transcription.chunkText)
							.join(" ")}
					</p>
					<div ref={containerReference} />
				</div>
			) : (
				<div className={styles["no-transcriptions"]}>
					<p>No transcriptions</p>
				</div>
			)}
		</div>
	);
};

export { TranscriptionPanel };
