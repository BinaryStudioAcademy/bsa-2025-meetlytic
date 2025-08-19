import { Loader, SearchBar } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useMeetingSocket,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import {
	type MeetingTranscriptionResponseDto,
	actions as transcriptionActions,
} from "~/modules/transcription/transcription.js";

import styles from "./transcription-panel.module.css";

type Properties = {
	meetingId: number;
	meetingStatus: string;
};

const TranscriptionPanel: React.FC<Properties> = ({
	meetingId,
	meetingStatus,
}: Properties) => {
	const [combinedText, setCombinedText] = useState<string>("");
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
	}, [combinedText]);

	useEffect(() => {
		setCombinedText(transcriptions.items.map((t) => t.chunkText).join(" "));
	}, [transcriptions.items]);

	useEffect(() => {
		void dispatch(transcriptionActions.getTranscriptionsByMeetingId(meetingId));
	}, [dispatch, meetingId]);

	const onNewMessage = useCallback(
		(data: MeetingTranscriptionResponseDto) => {
			dispatch(transcriptionActions.addTranscription(data));
			setCombinedText((previous) => previous + " " + data.chunkText);
		},
		[dispatch, setCombinedText],
	);

	useMeetingSocket(meetingId, onNewMessage, meetingStatus);

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

			{combinedText ? (
				<div className={styles["transcription-area"]}>
					<p className={styles["transcription-text"]}>{combinedText}</p>
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
