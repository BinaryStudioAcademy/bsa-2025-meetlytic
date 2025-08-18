import { Loader, SearchBar } from "~/libs/components/components.js";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useMeetingSocket,
	useRef,
} from "~/libs/hooks/hooks.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

import styles from "./transcription-panel.module.css";

type Properties = {
	meetingId: number;
	meetingStatus: string;
};

const TranscriptionPanel: React.FC<Properties> = ({
	meetingId,
	meetingStatus,
}: Properties) => {
	const containerReference = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();
	const { dataStatus, transcriptions } = useAppSelector(
		({ transcription }) => transcription,
	);

	useEffect(() => {
		const containerBottom = containerReference.current;

		if (!containerBottom) {
			return;
		}

		containerBottom.scrollIntoView();
	}, [transcriptions.items]);

	useEffect(() => {
		void dispatch(transcriptionActions.getTranscriptionsByMeetingId(meetingId));
	}, [dispatch, meetingId]);

	useMeetingSocket(
		meetingId,
		(data) => {
			dispatch(transcriptionActions.addTranscription(data));
		},
		meetingStatus,
	);

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
			{transcriptions.items.length > EMPTY_ARRAY_LENGTH ? (
				<div className={styles["transcription-area"]}>
					{transcriptions.items.map((transcription) => (
						<p className={styles["transcription-text"]} key={transcription.id}>
							{transcription.chunkText}
						</p>
					))}
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
