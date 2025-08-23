import { Loader, SearchBar } from "~/libs/components/components.js";
import { DataStatus, MeetingStatus, SocketEvent } from "~/libs/enums/enums.js";
import {
	useAppSelector,
	useAutoScroll,
	useCallback,
	useFetchTranscriptions,
	useMeetingSocket,
	useMemo,
	useTypingQueue,
} from "~/libs/hooks/hooks.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

import { LiveTranscription } from "./components/live-transcription/live-transcription.js";
import styles from "./transcription-panel.module.css";

const EMPTY_TRANSCRIPT_CHUNKS = 0;

const TranscriptionPanel: React.FC = () => {
	const { isTyping, onAddChunk, typedText } = useTypingQueue();
	const { dataStatus, transcriptions } = useAppSelector(
		({ transcription }) => transcription,
	);
	const meeting = useAppSelector(
		({ meetingDetails }) => meetingDetails.meeting,
	);
	const containerReference = useAutoScroll<HTMLDivElement>(
		meeting?.status === MeetingStatus.STARTED ? [typedText] : [],
	);
	useFetchTranscriptions();

	useMeetingSocket<MeetingTranscriptionResponseDto>({
		callback: onAddChunk,
		event: SocketEvent.TRANSCRIBE,
	});

	const handleSearch = useCallback(() => {
		// TODO: implement handleSearch logic
	}, []);

	const staticTranscript = useMemo(() => {
		return transcriptions.items
			.map((transcription) => transcription.chunkText)
			.join(" ");
	}, [transcriptions.items]);

	return (
		<div className={styles["meeting-details__transcription-panel"]}>
			<div className={styles["panel-header"]}>
				<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
				<SearchBar onSearch={handleSearch} />
			</div>
			{dataStatus === DataStatus.PENDING && <Loader isLoading />}

			{transcriptions.items.length > EMPTY_TRANSCRIPT_CHUNKS ? (
				<div className={styles["transcription-area"]} ref={containerReference}>
					<p className={styles["transcription-text"]}>
						{staticTranscript}
						{meeting?.status === MeetingStatus.STARTED && (
							<LiveTranscription isTyping={isTyping} typedText={typedText} />
						)}
					</p>
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
