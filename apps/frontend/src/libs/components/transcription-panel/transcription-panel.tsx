import { Loader } from "~/libs/components/components.js";
import { DataStatus, MeetingStatus, SocketEvent } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/get-valid-class-names.helper.js";
import {
	useAppSelector,
	useAutoScroll,
	useFetchTranscriptions,
	useMeetingSocket,
	useMemo,
	useTypingQueue,
} from "~/libs/hooks/hooks.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

import { LiveTranscription } from "./components/live-transcription/live-transcription.js";
import { FIRST_ITEM, LAST_ITEM } from "./libs/constants/constants.js";
import styles from "./transcription-panel.module.css";

const EMPTY_TRANSCRIPT_CHUNKS = 0;

const TranscriptionPanel: React.FC = () => {
	const { handleAddChunk, isTyping, typedText } = useTypingQueue();
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
		callback: handleAddChunk,
		event: SocketEvent.TRANSCRIBE,
	});

	const staticTranscript = useMemo(() => {
		return transcriptions.items
			.slice(FIRST_ITEM, LAST_ITEM)
			.map((transcription) => transcription.chunkText)
			.join(" ");
	}, [transcriptions.items]);

	const isMeetingEnded = meeting?.status === MeetingStatus.ENDED;

	return (
		<div
			className={getValidClassNames(
				styles["meeting-details__transcription-panel"],
				isMeetingEnded && styles["meeting-ended"],
			)}
		>
			<div className={styles["panel-header"]}>
				<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
			</div>
			{dataStatus === DataStatus.PENDING && <Loader hasOverlay isLoading />}

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
